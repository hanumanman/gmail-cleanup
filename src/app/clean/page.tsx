import { env } from "@/lib/env"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { MailCard } from "./_components/mail-card"
import { IGmail } from "./types"

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

  const mails: IGmail[] = await res.json().then(data => data.emails)

  return (
    <div className="h-screen overflow-y-auto">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mails.map(mail => (
          <MailCard key={mail.id} {...mail} />
        ))}
      </div>
    </div>
  )
}

export default CleanupPage
