import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// VercelでのConfigurationエラーを回避するため、secretを最優先で渡す
const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-hxc-2026",
});

export { handler as GET, handler as POST };
