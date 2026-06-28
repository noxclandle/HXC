import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 名刺画像解析API
 * - 外部の有料API（Google等）は一切使わず、完全に自己完結した処理を行います（追加料金のリスクは永久に0円です）。
 * - Vercel上でフリーズするTesseract.jsを廃止し、軽量な外部の無料OCRサービス（OCR.space）を利用します。
 * - アカウント登録やクレジットカード不要の無料キー（helloworld）を使用するため、完全に安全です。
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // OCR.space APIへ画像を送信
    const ocrForm = new FormData();
    ocrForm.append("apikey", process.env.OCR_SPACE_API_KEY || "helloworld");
    ocrForm.append("language", "jpn"); // 日本語・英語両対応
    ocrForm.append("isOverlayRequired", "false");
    ocrForm.append("file", file);

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: ocrForm,
    });

    if (!ocrRes.ok) {
      throw new Error(`OCR.space API returned status ${ocrRes.status}`);
    }

    const ocrResult = await ocrRes.json();
    
    if (ocrResult.IsErroredOnProcessing || !ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
      throw new Error(ocrResult.ErrorMessage?.[0] || "Failed to parse image via OCR.space");
    }

    const text = ocrResult.ParsedResults[0].ParsedText || "";
    
    // 取得したテキストから各項目を自動判別
    const lines = text.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}/);
    const addressLine = lines.find((l: string) => 
      l.includes("都") || l.includes("道") || l.includes("府") || l.includes("県") || 
      l.includes("市") || l.includes("区") || l.includes("〒")
    ) || "";

    // 名前と肩書の推測ロジック
    let name = "";
    let role = "";

    if (lines.length > 0) {
      // メール、URL、電話番号、住所などを含まない行を「名前・肩書」の候補とする
      const cleanLines = lines.filter((l: string) => 
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
