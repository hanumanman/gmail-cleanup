"use client"
import { Button } from "@/components/ui/button"
import { authClient, googleLogin } from "@/lib/auth-client"
import { LogOutIcon } from "lucide-react"

export function Header() {
  const { data: session } = authClient.useSession()

  return (
    <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">GC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gmail Cleanup
          </h1>
        </div>

        {session?.user ? (
          <div className="flex items-center gap-3">
            <div>{session.user.name}</div>
            <Button>
              <LogOutIcon /> Log Out
            </Button>
          </div>
        ) : (
          <Button className="cursor-pointer" onClick={googleLogin}>
            <LogOutIcon /> Login
          </Button>
        )}
      </div>
    </header>
  )
}
