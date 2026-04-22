import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-hxc-2026",
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/library/:path*"],
};
