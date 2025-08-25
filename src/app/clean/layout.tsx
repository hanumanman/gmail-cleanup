"use client"

import { authClient } from "@/lib/auth-client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

export default function CleanMailPageLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = authClient.getSession()
  const router = useRouter()

  if (!session) {
    router.push(`/api/auth/login?callbackUrl=${encodeURIComponent("/clean")}`)
  }

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex grow flex-col">{children}</div>
    </QueryClientProvider>
  )
}
