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
あなたは名刺解析のエキスパートです。提供された名刺画像を非常に詳細に分析し、情報を抽出してください。
縦型・横型、特殊なフォント、ロゴの位置などを考慮し、正確なデータをJSON形式で返してください。

【抽出ルール】
1. 氏名: 肩書きを除いたフルネームを抽出。
2. 呼称 (handle): 氏名から推測される親しみやすい呼び方、または名字。
3. 役職 (role): 会社内での役職や役割。
4. メールアドレス: 有効な形式で抽出。
5. 電話番号: ハイフンを含めて抽出。
6. 住所: 郵便番号から建物名まで正確に。
7. メモ (notes): この人物や会社の第一印象、専門性、ブランドイメージをAIの視点で1〜2文で要約。

【出力形式】
以下のJSON形式でのみ回答してください。Markdownの装飾（\`\`\`json 等）は不要です。

{
  "name": "氏名",
  "handle": "呼称",
  "role": "役職",
  "email": "メールアドレス",
  "phone": "電話番号",
  "address": "住所",
  "notes": "要約メモ"
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
