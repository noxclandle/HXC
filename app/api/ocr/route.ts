import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

/**
 * 送られてきた名刺画像を解析するAPI
 * GOOGLE_API_KEYがある場合は超高速・高精度のGemini 1.5 Flashを使用。
 * ない場合はローカルのTesseract.jsを /tmp キャッシュフォルダ経由で使用（Vercelの読込専用エラーを防止）。
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Gemini APIによる超高速・高精度OCR（APIキーがある場合）
    if (process.env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Analyze this business card image and extract the following information.
          Return ONLY a valid JSON object with these fields, no markdown formatting, no code blocks:
          {
            "name": "Person's name (in Japanese or English)",
            "handle": "A short nickname or first name (5 chars max)",
            "role": "Job title / Role",
            "email": "Email address",
            "phone": "Phone number",
            "address": "Company address / Location"
          }
        `;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: file.type || "image/jpeg"
            }
          }
        ]);

        const text = result.response.text().trim();
        // Remove markdown code block if present
        const jsonText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(jsonText);

        return NextResponse.json({
          name: parsed.name || "Unknown",
          handle: parsed.handle || (parsed.name ? parsed.name.substring(0, 5) : "User"),
          role: parsed.role || "Member",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
          notes: "Analyzed via Gemini 1.5 Flash."
        });
      } catch (geminiError) {
        console.error("Gemini OCR failed, falling back to local OCR:", geminiError);
      }
    }

    // 2. ローカルTesseract.jsによるフォールバック（APIキーがない場合）
    // Vercel上の読込専用エラーを防ぐため、書き込み権限のある /tmp をキャッシュ先に指定
    const worker = await createWorker('jpn+eng', 1, {
      cachePath: '/tmp',
    });
    
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}/);
    const addressLine = lines.find(l => 
      l.includes("都") || l.includes("道") || l.includes("府") || l.includes("県") || 
      l.includes("市") || l.includes("区") || l.includes("〒")
    ) || "";

    const name = lines[0] || "Unknown";
    const role = lines[1] || "Member";

    return NextResponse.json({
      name,
      handle: name.substring(0, 5),
      role,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      address: addressLine,
      notes: "Deciphered via local Tesseract.js (Fallback)."
    });

  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to scan the card." }, { status: 500 });
  }
}
