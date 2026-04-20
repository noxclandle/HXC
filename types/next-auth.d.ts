import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      rank: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    rank: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    rank: string;
  }
}
