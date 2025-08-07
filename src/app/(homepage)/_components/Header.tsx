"use client"
import { useState } from "react"
import { ThemeToggler } from "@/components/mode-toggler"
import { Button } from "@/components/ui/button"
import { authClient, googleLogin, googleLogout } from "@/lib/auth-client"
import { Loader2, LogOutIcon, MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { data: session, isPending } = authClient.useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
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
              {session.user.image && (
                <div className="w-8 aspect-square rounded-full relative overflow-hidden">
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
                  {session.user.image && (
                    <div className="w-8 aspect-square rounded-full relative overflow-hidden">
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
