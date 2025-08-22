import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const callbackUrl = url.searchParams.get("callbackUrl") || "/"

  const res = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: callbackUrl,
    },
  })

  if (!res.url) {
    throw new Error("No redirect url")
  }

  return Response.redirect(res.url)
}
