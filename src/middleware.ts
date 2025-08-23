import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse  } from "next/server";
 
// Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth?.user;
  const { nextUrl } = req

  const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard")
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isAPIRoute = nextUrl.pathname.startsWith("/api")

  if (isAPIRoute){
    return;
  }

  if(isLoggedIn && isAuthRoute){
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if(!isLoggedIn && isPrivateRoute){
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}