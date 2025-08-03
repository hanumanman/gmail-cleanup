import { createAuthClient } from "better-auth/react"
import { toast } from "sonner"

export const authClient = createAuthClient({})

export async function googleLogin() {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  })

  if (error) {
    console.error("Google login error", error)
    toast.error("Error logging in with Google. Check logs for more details.")
  }
}
