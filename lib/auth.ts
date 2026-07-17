import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { ADMIN_ROLES } from "./constants";
import { rateLimit, safeLimit } from "./ratelimit";
import { logger } from "./logger";

export { ADMIN_ROLES };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "soul-link",
      name: "SoulLink",
      credentials: {
        deviceToken: { label: "Device Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.deviceToken) return null;

        const ip = (req?.headers?.get?.("x-forwarded-for") as string) || "unknown";
        const { success } = await safeLimit(rateLimit.strict, `soul-link:${ip}`);
        if (!success) return null;

        try {
          const binding = await prisma.deviceBinding.findUnique({
            where: { device_token: credentials.deviceToken },
            include: { user: true }
          });

          if (!binding || !binding.user) return null;

          // 使用日時を更新
          await prisma.deviceBinding.update({
            where: { id: binding.id },
            data: { last_used_at: new Date() }
          });

          return {
            id: binding.user.id,
            name: binding.user.name,
            email: binding.user.email,
            role: binding.user.role,
            rank: binding.user.rank,
          };
        } catch (e) {
          return null;
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase();

        // IPベースのレートリミット（ブルートフォース対策）
        const ip = (req?.headers?.get?.("x-forwarded-for") as string) || "unknown";
        const { success } = await safeLimit(rateLimit.strict, `login:${ip}`);
        if (!success) return null;

        // 1. データベースからユーザーを検索
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // 2. パスワードの照合
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            rank: user.rank,
          };
        } catch (dbError: unknown) {
          // ログには詳細を残すが、クライアントへは汎用エラーのみ返す（内部情報の漏洩防止）
          const message = dbError instanceof Error ? dbError.message : String(dbError);
          logger.error("Database error during login", { reason: message });
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.rank = user.rank;
      }
      return token;
    },
    async session({ session, token }: { session: import("next-auth").Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.rank = token.rank;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
