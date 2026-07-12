import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * 高精度・ルールベース名刺解析API
 * - 外部の有料API（Google等）は一切使わず、追加料金のリスクは永久に0円です。
 * - Vercel上でフリーズするTesseract.jsを廃止し、軽量な外部の無料OCRサービス（OCR.space）を利用します。
 * - 日本の名刺レイアウト特有の規則性（都道府県、郵便番号、部署名、人名の構成など）に基いて厳密に分類します。
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

    // 改行で分割してクリーンアップ
    const lines = text
      .split(/\r?\n/)
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);

    // 1. メールアドレスの抽出 (OCRの誤読に対応するため、@移行の英数字・ドット・ハイフンを広くマッチ)
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+/);
    const email = emailMatch ? emailMatch[0].replace(/[._-]+$/, "") : ""; // 末尾のゴミ記号を除去

    // 2. 電話番号とFAX의分類抽出
    let phone = "";
    const phoneLines = lines.filter((l: string) => l.match(/[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}/));
    
    // FAXを除外した「電話」の行を最優先する
    const primaryPhoneLine = phoneLines.find((l: string) => 
      !l.toLowerCase().includes("fax") && 
      !l.includes("ファクス") && 
      (l.includes("TEL") || l.includes("tel") || l.includes("電話") || l.includes("直通"))
    );

    if (primaryPhoneLine) {
      const match = primaryPhoneLine.match(/[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}/);
      if (match) phone = match[0];
    } else {
      // 見つからない場合は、FAX以外の最初の番号
      const backupPhoneLine = phoneLines.find((l: string) => !l.toLowerCase().includes("fax") && !l.includes("ファクス"));
      if (backupPhoneLine) {
        const match = backupPhoneLine.match(/[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}/);
        if (match) phone = match[0];
      } else if (phoneLines.length > 0) {
        // 最終手段として最初に見つかった番号
        const match = phoneLines[0].match(/[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}/);
        if (match) phone = match[0];
      }
    }

    // 3. 所在地の抽出 (都府県・〒を最優先とし、単なる自治体名による誤判定を防止)
    let address = "";
    const zipCodeLineIndex = lines.findIndex((l: string) => l.includes("〒") || l.match(/[0-9]{3}-[0-9]{4}/));
    const prefectureLineIndex = lines.findIndex((l: string) => l.match(/(東京都|北海道|京都府|大阪府|.{2,3}県)/));

    if (prefectureLineIndex !== -1) {
      address = lines[prefectureLineIndex];
      // もし直前の行が郵便番号なら結合する
      if (zipCodeLineIndex !== -1 && Math.abs(prefectureLineIndex - zipCodeLineIndex) === 1) {
        address = `${lines[zipCodeLineIndex]} ${address}`;
      }
    } else if (zipCodeLineIndex !== -1) {
      address = lines[zipCodeLineIndex];
      // 郵便番号の次の行も住所の一部として結合
      if (prefectureLineIndex === -1 && lines[zipCodeLineIndex + 1]) {
        address = `${address} ${lines[zipCodeLineIndex + 1]}`;
      }
    } else {
      // 最終フォールバック：市・区・町を含む行
      const cityLine = lines.find((l: string) => l.match(/(市|区|郡|町|村)/));
      if (cityLine) address = cityLine;
    }

    // 4. 会社名・部署名・役職の抽出
    let companyDept = "";
    let title = "";
    
    // 会社・組織・役所・部署を表すキーワード
    const companyKeywords = ["株式会社", "有限会社", "合同会社", "法人", "役所", "役場", "都庁", "県庁", "省", "庁", "局", "大学", "組合", "協会"];
    const deptKeywords = ["部", "課", "係", "室", "本部", "支店", "支社", "営業所", "センター"];
    const titleKeywords = ["代表", "取締役", "社長", "常務", "専務", "部長", "課長", "係長", "主任", "担当", "主事", "技師", "顧問", "CEO", "COO", "Manager", "President"];

    // 会社・部署行の特定
    const orgLines = lines.filter((l: string) => 
      companyKeywords.some(k => l.includes(k)) || 
      deptKeywords.some(k => l.includes(k))
    );

    if (orgLines.length > 0) {
      companyDept = orgLines.join(" ");
    } else {
      // キーワードがない場合、1行目を暫定の会社名とする
      if (lines.length > 0 && !lines[0].includes("@") && !lines[0].match(/[0-9]/)) {
        companyDept = lines[0];
      }
    }

    // 役職の特定
    const foundTitleLine = lines.find((l: string) => titleKeywords.some(k => l.includes(k)));
    if (foundTitleLine) {
      title = foundTitleLine;
    }

    // 5. 人名の抽出 (もっとも厳密なフィルタリング)
    let name = "";
    
    // 除外対象：メール、URL、電話番号、住所、郵便番号、会社名・部署名として分類された行
    const nameCandidates = lines.filter((l: string) => {
      const isEmail = l.includes("@");
      const isUrl = l.includes("http") || l.includes("www") || l.includes(".jp") || l.includes(".com");
      const isNumber = l.match(/[0-9]/) && l.replace(/[^0-9]/g, "").length > 4; // 郵便番号や電話番号
      const isAddress = l.includes("都") || l.includes("道") || l.includes("府") || l.includes("県") || l.includes("〒");
      const isOrg = companyKeywords.some(k => l.includes(k)) || deptKeywords.some(k => l.includes(k));
      const isEnglishName = l.match(/^[A-Z\s]+$/); // アルファベット大文字のみの行（英語表記）

      return !isEmail && !isUrl && !isNumber && !isAddress && !isOrg && !isEnglishName;
    });

    if (nameCandidates.length > 0) {
      // 通常、名前は比較的上部にあり、2〜5文字の漢字（またはスペース区切り）で構成される
      // スペース区切りがあるものを最優先
      const spacedName = nameCandidates.find((l: string) => l.includes(" ") || l.includes("　"));
      if (spacedName) {
        name = spacedName;
      } else {
        // なければ文字数が短い行（2〜6文字）を優先
        const shortName = nameCandidates.find((l: string) => l.length >= 2 && l.length <= 6);
        name = shortName || nameCandidates[0];
      }
    }

    // 英語表記の行が名前の直後にあれば、それを参考にする（必要に応じて）
    const englishNameIndex = lines.findIndex((l: string) => l.match(/^[A-Z\s]+$/));
    if (name === "" && englishNameIndex !== -1) {
      name = lines[englishNameIndex];
    }

    // 会社名と役職を結合して登録用「role」とする
    let finalRole = companyDept;
    if (title && !finalRole.includes(title)) {
      finalRole = finalRole ? `${finalRole} / ${title}` : title;
    }

    return NextResponse.json({
      name: name || "Unknown",
      role: finalRole || "",
      email: email,
      phone: phone,
      address: address,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("OCR Error", { error: message });
    return NextResponse.json({ error: "Failed to scan the card." }, { status: 500 });
  }
}
