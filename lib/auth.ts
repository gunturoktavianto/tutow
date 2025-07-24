import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
          school: user.school,
          currentGrade: user.currentGrade,
          xp: user.xp,
          gold: user.gold,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.school = user.school;
        token.currentGrade = user.currentGrade;
        token.xp = user.xp;
        token.gold = user.gold;
      }

      if (trigger === "update") {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            name: true,
            username: true,
            school: true,
            currentGrade: true,
            xp: true,
            gold: true,
          },
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.username = updatedUser.username;
          token.school = updatedUser.school;
          token.currentGrade = updatedUser.currentGrade;
          token.xp = updatedUser.xp;
          token.gold = updatedUser.gold;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.school = token.school as string;
        session.user.currentGrade = token.currentGrade as number;
        session.user.xp = token.xp as number;
        session.user.gold = token.gold as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
