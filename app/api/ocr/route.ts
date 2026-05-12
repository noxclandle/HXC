import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

export const dynamic = "force-dynamic";

/**
 * 送られてきた名刺画像をTesseract.jsで解析（API不要・完全無料）
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

    // Tesseract.js Workerの起動
    const worker = await createWorker('jpn+eng'); // 日本語と英語をサポート
    
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    // 読み取った生のテキストから情報を抽出するロジック（簡易版）
    // AIを使わないため、正規表現や行ごとのパターンマッチングで対応
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}/);

    // 名前は通常1行目か2行目に来ることが多いという仮説
    const name = lines[0] || "Unknown";
    const role = lines[1] || "The Observer";

    return NextResponse.json({
      name,
      handle: name.substring(0, 5),
      role,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      address: "",
      notes: "Deciphered via local resonance. No external AI used."
    });

  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to decipher the card soul locally." }, { status: 500 });
  }
}
