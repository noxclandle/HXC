import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export const dynamic = "force-dynamic";

/**
 * 名刺画像解析API
 * - 外部の有料API（Google等）は一切使わず、完全に自己完結した処理を行います（追加料金のリスクは永久に0円です）。
 * - Vercel上でのデッドロックを防ぐため、Web Workerを使わないシングルスレッドモードで実行します。
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

    // Tesseract.recognizeを直接呼び出し、メインスレッド内で処理（Web Workerのデッドロックを防止）
    // キャッシュ先を書き込み可能な /tmp に指定
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'jpn+eng',
      {
        cachePath: '/tmp',
      }
    );

    // 取得したテキストから各項目を自動判別
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}/);
    const addressLine = lines.find(l => 
      l.includes("都") || l.includes("道") || l.includes("府") || l.includes("県") || 
      l.includes("市") || l.includes("区") || l.includes("〒")
    ) || "";

    // 名前と肩書の推測ロジック
    let name = "";
    let role = "";

    if (lines.length > 0) {
      // メール、URL、電話番号、住所などを含まない行を「名前・肩書」の候補とする
      const cleanLines = lines.filter(l => 
        !l.includes("@") && !l.includes("http") && !l.includes("tel") && 
        !l.includes("fax") && !l.match(/[0-9]{3}-[0-9]{4}/) &&
        !l.match(/^[0-9\-+() ]+$/) &&
        !l.includes("都") && !l.includes("道") && !l.includes("府") && !l.includes("県") &&
        l.length > 1
      );

      if (cleanLines.length > 0) {
        name = cleanLines[0];
        if (cleanLines.length > 1) {
          role = cleanLines[1];
        }
      }
    }

    return NextResponse.json({
      name: name || "Unknown",
      role: role || "",
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      address: addressLine,
    });

  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to scan the card." }, { status: 500 });
  }
}
