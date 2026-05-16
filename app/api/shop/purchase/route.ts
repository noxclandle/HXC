import { NextRequest, NextResponse } from "next/server";

/**
 * RT購入の統合リダイレクト
 * 今後、サイト内のどこから「購入」が呼ばれても、
 * 必ず正規レート（1,000円=2,000RT〜）が設定された
 * Treasury内の購入セクションへ誘導する。
 */
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/inventory?purchase=true", req.url));
}
