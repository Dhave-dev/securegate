export const dynamic = 'force-dynamic'

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Welcome back, {session.user.email}!
        </p>
        <div className="mt-8 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-green-800 dark:text-green-400 font-medium">
            ✓ Your email is verified
          </p>
          <p className="text-green-800 dark:text-green-400 font-medium mt-2">
            ✓ You have successfully authenticated
          </p>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
