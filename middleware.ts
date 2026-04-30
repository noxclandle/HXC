import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPath) {
      const rank = token?.rank as string;
      const allowedRoles = ["mastermind", "chief_officer", "architect"];
      
      if (!isAuth || !allowedRoles.includes(token?.role as string)) {
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
  matcher: ["/admin/:path*", "/hub/:path*", "/library/:path*", "/shop/:path*", "/inventory/:path*"],
};
