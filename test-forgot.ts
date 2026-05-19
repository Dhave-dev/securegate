import crypto from "crypto"
import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy")

async function test() {
  try {
    const email = "test@example.com"
    // Create a dummy user just for testing
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: "hashedpassword123",
      }
    })

    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log("User found:", !!user)

    if (user) {
      const token = crypto.randomBytes(32).toString("hex")
      
      console.log("Creating token in DB...")
      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000)
        }
      })
      console.log("Token created!")

      console.log("Sending email...")
      const { data, error } = await resend.emails.send({
        from: "SecureGate <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: `<p>Reset link: ${token}</p>`
      })
      
      if (error) {
        console.error("Resend API Error:", error)
      } else {
        console.log("Email sent!", data)
      }
    }
  } catch (err) {
    console.error("Test Error:", err)
  } finally {
    await prisma.$disconnect()
  }
}

test()
