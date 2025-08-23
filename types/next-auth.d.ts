import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "@auth/core/jwt";

declare module "next-auth" {
  interface User extends DefaultSession["user"] {
    idToken?: string;
    refreshToken?: string;
    idTokenExpires?: number;
  }

  interface Session {
    error?: string;
    user?: User;
  }

  interface JWT {
    idToken?: string;
    sessionExpirationTime?: number;
    error?: string;
  }
}