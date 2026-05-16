import { NextRequest, NextResponse } from "next/server";

/**
 * 従来の /charge パスへのアクセスを
 * 正規の購入フロー（Treasury内の購入セクション）へ永久リダイレクトする。
 */
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/inventory?purchase=true", req.url));
}
