export const dynamic = 'force-dynamic'

import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function VerifyEmailPage({
  params
}: {
  params: { token: string }
}) {
  const { token } = params

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Invalid Token</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">The verification token is missing.</p>
          <Link href="/login" className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Invalid Token</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">This verification link is invalid or has already been used.</p>
          <Link href="/login" className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const isExpired = new Date() > verificationToken.expires

  if (isExpired) {
    await prisma.verificationToken.delete({
      where: { token }
    })
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Token Expired</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">This verification link has expired. Please sign up again or request a new link.</p>
          <Link href="/signup" className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
            Go to Signup
          </Link>
        </div>
      </div>
    )
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() }
  })

  await prisma.verificationToken.delete({
    where: { token }
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-md w-full">
        <h1 className="mb-4 text-2xl font-bold text-green-500">Email Verified!</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">Your email has been successfully verified. You can now log in to access your dashboard.</p>
        <Link href="/login" className="inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
          Go to Login
        </Link>
      </div>
    </div>
  )
}
