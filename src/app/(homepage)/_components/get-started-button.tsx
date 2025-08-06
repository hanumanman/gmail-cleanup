"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export const GetStartedButton = () => {
  async function requestGmailAccess() {
    await authClient.linkSocial({
      provider: "google",
      scopes: ["https://www.googleapis.com/auth/gmail"],
    })
  }
  return (
    <Button onClick={requestGmailAccess} size="lg" className="text-base">
      Get Started Free
    </Button>
  )
}
