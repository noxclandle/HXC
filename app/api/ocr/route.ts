import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

/**
 * 名刺画像解析API
 * - GOOGLE_API_KEYがある場合：Gemini 1.5 Flashによる超高速・高精度解析（実用版）
 * - GOOGLE_API_KEYがない場合：デモモードとして、即座にモックデータを返却（テスト用・ハング防止）
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

    // 1. Gemini APIによる高精度解析（APIキーがある場合）
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
        // Markdownのコードブロックが入る場合があるため除去
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
        console.error("Gemini OCR failed:", geminiError);
        return NextResponse.json({ error: "AI Scan failed. Please try again." }, { status: 500 });
      }
    }

    // 2. デモモード（APIキーがない場合）
    // Vercel上でのTesseract.jsのデッドロック/ハングアップを回避するため、即座にダミーデータを返却します。
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 演出用のウェイト

    return NextResponse.json({
      name: "サンプル 太郎 / Taro Sample",
      handle: "Taro",
      role: "代表取締役 / CEO",
      email: "taro.sample@example.com",
      phone: "090-1234-5678",
      address: "東京都港区南青山 1-1-1",
      notes: "デモモード動作中（実用にはVercelにGOOGLE_API_KEYを設定してください）"
    });

  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to scan the card." }, { status: 500 });
  }
}
