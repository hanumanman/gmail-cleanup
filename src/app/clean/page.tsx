import { db } from "@/db"
import { account } from "@/db/schema"
import { env } from "@/lib/env"
import { getSession } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

async function CleanupPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const [user] = await db
    .select()
    .from(account)
    .where(
      and(eq(account.userId, session.user.id), eq(account.providerId, "google"))
    )

  const res = await fetch(env.BASE_URL + "/api/gmail/messages", {
    method: "POST",
    body: JSON.stringify({
      access_token: user.accessToken,
    }),
  })

  const hello = await res.json()
  // TODO: Delete console.log
  console.log("LOGGING hello", hello)
  return <div>Cleanup Page</div>
}

export default CleanupPage
