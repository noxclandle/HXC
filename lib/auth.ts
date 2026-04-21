import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. データベースからユーザーを検索
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error("Auth Error: User not found ->", credentials.email);
            return null;
          }

          // 2. パスワードの照合
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");
          const isLegacyMatch = credentials.password === user.password;

          if (!isPasswordValid && !isLegacyMatch) {
            console.error("Auth Error: Invalid password for ->", credentials.email);
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            rank: user.rank,
          };
        } catch (dbError) {
          console.error("Auth Error: Database connection failed during login:", dbError);
          throw new Error("Database connection error");
        }
        },
        }),
        ],
        secret: process.env.NEXTAUTH_SECRET,
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
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.rank = token.rank;
        }
        return session;
        },
        },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
