import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ADMIN_ROLES } from "@/lib/constants";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPath) {
      const rank = token?.rank as string;
      
      if (!isAuth || !ADMIN_ROLES.includes(token?.role as string)) {
        return NextResponse.redirect(new URL("/hub", req.url));
      }
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
  matcher: ["/admin/:path*", "/hub/:path*", "/gate", "/library/:path*", "/shop/:path*", "/inventory/:path*"],
};
