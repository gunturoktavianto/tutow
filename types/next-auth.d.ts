import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      username?: string | null;
      image?: string | null;
      school?: string | null;
      currentGrade?: number | null;
      xp?: number;
      gold?: number;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    school?: string | null;
    currentGrade?: number | null;
    xp?: number;
    gold?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    school?: string | null;
    currentGrade?: number | null;
    xp?: number;
    gold?: number;
  }
}
