import { auth as fbAuth } from "@/firebase";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") {
          return null;
        }

        try {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(
            fbAuth,
            credentials.email,
            credentials.password
          );

          if (!userCredential.user) return null;

          // Get initial Firebase ID token (valid for 1 hour)
          const idToken = await userCredential.user.getIdToken();

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || null,
            emailVerified: userCredential.user.emailVerified,
            idToken,
            refreshToken: userCredential.user.refreshToken,
            idTokenExpires: Date.now() + 3600 * 1000, // 1 hour from now
          };
        } catch (error: any) {
          const errorCode = error.code;
          if (errorCode === "auth/user-not-found") throw new Error("User doesn't exist");
          if (errorCode === "auth/wrong-password") throw new Error("Invalid password");
          if (errorCode === "auth/invalid-email") throw new Error("Invalid email");
          throw new Error("Error signing in. Please try again later");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: store tokens in JWT
      if (user) {
        token.uid = user.id;
        token.idToken = user.idToken;
        token.refreshToken = user.refreshToken;
        token.idTokenExpires = user.idTokenExpires;
      }

      // Check if token is expired
      if (Date.now() > (token.idTokenExpires as number)) {
        // Refresh ID token using Firebase REST API
        try {
          const response = await fetch(
            `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PRIVATE_FIREBASE_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
              }),
            }
          );

          const data = await response.json();
          if (!response.ok) throw new Error(data.error.message);

          token.idToken = data.id_token;
          token.idTokenExpires = Date.now() + 3600 * 1000; // 1 hour
          token.refreshToken = data.refresh_token;
        } catch (error) {
          console.error("Failed to refresh Firebase ID token:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.email = token.email || session.user.email;
      session.user.name = token.name || session.user.name;
      session.user.idToken = token.idToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.idTokenExpires = token.idTokenExpires as number;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
