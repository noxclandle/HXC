import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { ADMIN_ROLES } from "./constants";

export { ADMIN_ROLES };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "soul-link",
      name: "SoulLink",
      credentials: {
        deviceToken: { label: "Device Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.deviceToken) return null;

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase();

        console.log(`[AUTH_DEBUG] Attempting login for: ${email}`);

        // 1. データベースからユーザーを検索
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error(`[AUTH_DEBUG] User not found: ${email}`);
            return null;
          }

          console.log(`[AUTH_DEBUG] User found. ID: ${user.id}`);

          // 2. パスワードの照合
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");

          if (!isPasswordValid) {
            console.error(`[AUTH_DEBUG] Password mismatch for: ${email}`);
            return null;
          }

          console.log(`[AUTH_DEBUG] Login successful for: ${email}`);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            rank: user.rank,
          };
        } catch (dbError: any) {
          console.error("[AUTH_DEBUG] Database error during login:", dbError.message || dbError);
          // エラー内容を詳しく返す（開発・緊急対応用）
          throw new Error(`Database Integrity Error: ${dbError.message || "Unknown"}`);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.rank = user.rank;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.rank = token.rank as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
