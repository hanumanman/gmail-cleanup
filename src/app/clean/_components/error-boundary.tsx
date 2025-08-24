"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Gmail fetch error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Something went wrong!
        </h2>
        <p className="text-gray-600 max-w-md">
          We encountered an error while loading your Gmail messages. This might
          be due to authentication issues or network problems.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/api/auth/login")}
            variant="outline"
          >
            Re-authenticate
          </Button>
        </div>
      </div>
    </div>
  )
}
