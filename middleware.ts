import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. 管理者系パスへのアクセス制限
    if (path.startsWith("/admin")) {
      const allowedRoles = ["chief_officer", "architect", "sentinel"];
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/invalid-session", req.url));
      }
    }

    // 2. 創設者限定の「全権書き換え（Override）」への厳密な制限
    if (path.startsWith("/admin/override")) {
      const superRoles = ["chief_officer", "architect"];
      if (!token?.role || !superRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/invalid-session", req.url));
      }
    }

    // 3. 聖域の監視
    if (path.startsWith("/dashboard") || path.startsWith("/library")) {
      if (!token) {
        return NextResponse.redirect(new URL("/invalid-session", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // withAuthの内部でリダイレクトさせず、自分で制御する
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/library/:path*"],
};
