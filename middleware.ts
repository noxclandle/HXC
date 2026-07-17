import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { ADMIN_ROLES } from "@/lib/constants";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
    const isApiPath = pathname.startsWith("/api");

    if (isAdminPath) {
      if (!isAuth || !ADMIN_ROLES.includes(token?.role as string)) {
        // API routes get a JSON 401, page routes get redirected to /hub.
        // This is defense-in-depth: each /api/admin handler must still
        // perform its own getServerSession + ADMIN_ROLES check.
        if (isApiPath) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/hub", req.url));
      }
    } else {
      // Emergency kill-switch toggled from /admin/security. Admin paths stay
      // reachable above so an admin can always lift the lockdown.
      // KVバックエンド未設定時にここで例外を投げると保護対象の全ページが
      // 巻き込まれて落ちるため、フェイルオープン（ロックダウンなし扱い）にする。
      let lockdown = false;
      try {
        lockdown = (await kv.get<boolean>("system_lockdown")) === true;
      } catch (e) {
        console.error("[middleware] KV backend unavailable, failing open", e);
        lockdown = false;
      }
      if (lockdown) {
        if (isApiPath) {
          return NextResponse.json({ error: "System is under maintenance lockdown." }, { status: 503 });
        }
        if (pathname !== "/lockdown") {
          return NextResponse.redirect(new URL("/lockdown", req.url));
        }
      }
    }

    if (pathname.startsWith("/api/ocr") && !isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/hub/:path*",
    "/gate",
    "/library/:path*",
    "/shop/:path*",
    "/inventory/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/documents/:path*",
    "/gacha/:path*",
    "/adjust/:path*",
    "/checkout/:path*",
    "/scan/:path*",
    "/api/ocr"
  ],
};
