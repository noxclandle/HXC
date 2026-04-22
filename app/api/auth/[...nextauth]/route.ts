import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-hxc-2026",
});

export { handler as GET, handler as POST };
