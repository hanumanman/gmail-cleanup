"use client"

import { ThemeToggler } from "@/components/mode-toggler"
import { Button } from "@/components/ui/button"
import { authClient, googleLogin, googleLogout } from "@/lib/auth-client"
import { Loader2, LogOutIcon, MenuIcon, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { data: session, isPending } = authClient.useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  async function login() {
    await googleLogin(pathname)
  }

  return (
    <header className="relative z-10 border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8 dark:border-gray-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={"/"}
            className="text-2xl font-bold whitespace-nowrap text-gray-900 dark:text-white"
          >
            GC
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggler />
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <div className="relative aspect-square w-8 overflow-hidden rounded-full">
                  <Image
                    src={session.user.image}
                    fill
                    alt="User avatar"
                    sizes="100px"
                  />
                </div>
              )}
              <div className="whitespace-nowrap">{session.user.name}</div>
              <Button onClick={googleLogout}>
                <LogOutIcon /> Log Out
              </Button>
            </div>
          ) : isPending ? (
            <div>
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Button onClick={login}>
              <LogOutIcon /> Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
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
        <div className="mt-4 md:hidden">
          <div className="flex flex-col items-center gap-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <ThemeToggler />
                  {session.user.image && (
                    <div className="relative aspect-square w-8 overflow-hidden rounded-full">
                      <Image
                        src={session.user.image}
                        fill
                        alt="User avatar"
                        sizes="100px"
                      />
                    </div>
                  )}
                  {session.user.name}
                </div>
                <Button onClick={googleLogout} className="w-full">
                  <LogOutIcon /> Log Out
                </Button>
              </>
            ) : isPending ? (
              <div>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <Button onClick={login} className="w-full">
                <LogOutIcon /> Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
