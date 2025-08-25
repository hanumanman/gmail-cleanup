"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { googleLogout } from "@/lib/auth-client"
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  error?: {
    message?: string
    details?: string
    isAuthError?: boolean
    type?: "auth" | "network" | "generic"
  }
  onRetry?: () => void
}

export function ErrorDialog({
  open,
  onOpenChange,
  error,
  onRetry,
}: ErrorDialogProps) {
  const handleLogout = async () => {
    try {
      await googleLogout()
    } catch (err) {
      console.error("Error during logout:", err)
      // Force redirect if logout fails
      window.location.href = "/"
    }
  }

  const handleRetry = () => {
    onRetry?.()
    onOpenChange(false)
  }

  const getIcon = () => {
    switch (error?.type) {
      case "auth":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "network":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      default:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getTitle = () => {
    switch (error?.type) {
      case "auth":
        return "Authentication Required"
      case "network":
        return "Connection Error"
      default:
        return "Error Occurred"
    }
  }

  const getDefaultMessage = () => {
    switch (error?.type) {
      case "auth":
        return "Your session has expired or you need to reauthenticate with Google to access Gmail."
      case "network":
        return "Unable to connect to the server. Please check your internet connection and try again."
      default:
        return "An unexpected error occurred. Please try again or refresh the page."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {error?.message || getDefaultMessage()}
          </DialogDescription>
          {error?.details && (
            <DialogDescription className="text-muted-foreground mt-2 text-xs">
              {error.details}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {error?.isAuthError ? (
            <Button onClick={handleLogout} className="w-full sm:w-auto">
              Logout & Reauthenticate
            </Button>
          ) : (
            <>
              {onRetry && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Refresh Page
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
