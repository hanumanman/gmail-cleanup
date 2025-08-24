"use client"
import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function CleanMailPageLayout({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col grow">{children}</div>
    </QueryClientProvider>
  )
}
