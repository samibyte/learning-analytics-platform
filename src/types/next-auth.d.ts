import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "instructor" | "student";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "instructor" | "student";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "instructor" | "student";
  }
}
