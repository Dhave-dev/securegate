import { Resend } from "resend"
import * as React from "react"
import { Html, Head, Preview, Body, Container, Section, Text, Link } from "@react-email/components"

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_to_bypass_build_error")

function VerificationEmailTemplate({ confirmLink }: { confirmLink: string }) {
  return React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Verify your email address"),
    React.createElement(Body, { style: { fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "40px 0" } },
      React.createElement(Container, { style: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "5px", margin: "0 auto", width: "460px" } },
        React.createElement(Section, null,
          React.createElement(Text, { style: { fontSize: "16px", color: "#333", marginBottom: "20px" } }, "Please verify your email address by clicking the link below:"),
          React.createElement(Link, { href: confirmLink, style: { fontSize: "16px", color: "#ffffff", backgroundColor: "#007ee6", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", display: "inline-block" } }, "Verify Email")
        )
      )
    )
  )
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email/${token}`

  await resend.emails.send({
    from: "SecureGate <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    react: VerificationEmailTemplate({ confirmLink }),
  })
}

function PasswordResetTemplate({ resetLink }: { resetLink: string }) {
  return React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Reset your password"),
    React.createElement(Body, { style: { fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "40px 0" } },
      React.createElement(Container, { style: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "5px", margin: "0 auto", width: "460px" } },
        React.createElement(Section, null,
          React.createElement(Text, { style: { fontSize: "16px", color: "#333", marginBottom: "20px" } }, "You requested a password reset. Click the link below to set a new password:"),
          React.createElement(Link, { href: resetLink, style: { fontSize: "16px", color: "#ffffff", backgroundColor: "#e63946", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", display: "inline-block" } }, "Reset Password")
        )
      )
    )
  )
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

  await resend.emails.send({
    from: "SecureGate <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    react: PasswordResetTemplate({ resetLink }),
  })
}
