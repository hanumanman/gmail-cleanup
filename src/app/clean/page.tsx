import { env } from "@/lib/env"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

async function CleanupPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const res = await fetch(env.BASE_URL + "/api/gmail/messages", {
    method: "POST",
    body: JSON.stringify({
      userId: session.user.id,
    }),
  })

  const hello = await res.json()
  // TODO: Delete console.log
  console.log("LOGGING hello", hello)
  return <div>Cleanup Page</div>
}

export default CleanupPage
