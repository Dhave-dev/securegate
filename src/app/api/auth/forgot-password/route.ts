export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limit"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const isRateLimited = await rateLimit(`forgot-password_${ip}`, 3, "10 m")
    
    if (isRateLimited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      const token = crypto.randomBytes(32).toString("hex")
      
      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
      })

      await sendPasswordResetEmail(user.email, token)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      { message: "If an account with that email exists, we sent you a reset link." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: (error as any).errors[0].message },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
