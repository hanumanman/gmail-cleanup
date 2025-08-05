"use client"
import { useState } from "react"
import { ThemeToggler } from "@/components/mode-toggler"
import { Button } from "@/components/ui/button"
import { authClient, googleLogin, googleLogout } from "@/lib/auth-client"
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { data: session } = authClient.useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link
            href={"/"}
            className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap"
          >
            GC
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggler />
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="whitespace-nowrap">{session.user.name}</div>
              <Button onClick={googleLogout}>
                <LogOutIcon /> Log Out
              </Button>
            </div>
          ) : (
            <Button onClick={googleLogin}>
              <LogOutIcon /> Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="icon"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center gap-4">
            {session?.user ? (
              <>
                <div className="whitespace-nowrap gap-2 flex items-center">
                  <ThemeToggler />
                  {session.user.name}
                </div>
                <Button onClick={googleLogout} className="w-full">
                  <LogOutIcon /> Log Out
                </Button>
              </>
            ) : (
              <Button onClick={googleLogin} className="w-full">
                <LogOutIcon /> Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
