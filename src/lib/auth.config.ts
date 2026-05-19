import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = (user as any).emailVerified
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).emailVerified = token.emailVerified
      }
      return session
    }
  },
  providers: [], // Add providers with Edge compatibility here if needed
} satisfies NextAuthConfig
