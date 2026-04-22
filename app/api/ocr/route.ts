import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const dynamic = "force-dynamic";

/**
 * 送られてきた名刺画像を解析し、JSON形式で情報を返す
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ファイルをGeminiが読める形式に変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
この画像は名刺です。記載されている情報を読み取り、以下のJSON形式でのみ回答してください。
余計な説明は一切不要です。不明な項目は空文字にしてください。

{
  "name": "氏名",
  "handle": "名前から推測される短い呼称、または氏名の一部",
  "role": "役職や肩書き",
  "email": "メールアドレス",
  "phone": "電話番号",
  "address": "住所や会社所在地",
  "notes": "その人の特徴や会社についての短いメモ（AIによる要約）"
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type
        }
      }
    ]);

    const responseText = result.response.text();
    // JSON部分だけを抽出（念のため）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cardData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return NextResponse.json(cardData);
  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to read the card soul." }, { status: 500 });
  }
}
