import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export default auth(async (req) => {
  if (req.nextUrl.pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const isRateLimited = await rateLimit(`login_${ip}`, 5, "10 m")
    if (isRateLimited) {
      return new NextResponse(JSON.stringify({ error: "Too many requests. Try again later." }), { 
        status: 429,
        headers: { "Content-Type": "application/json" }
      })
    }
  }

  const isLoggedIn = !!req.auth
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")

  if (isDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
    
    // Check if email is verified
    const emailVerified = (req.auth?.user as any)?.emailVerified
    if (!emailVerified) {
      return NextResponse.redirect(new URL("/login?error=UnverifiedEmail", req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
