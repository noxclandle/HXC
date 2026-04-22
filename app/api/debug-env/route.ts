import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    secretPrefix: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 4) : "NONE",
    nodeEnv: process.env.NODE_ENV,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT_SET (OK on Vercel)",
    vercelUrl: process.env.VERCEL_URL || "NOT_SET",
  });
}
