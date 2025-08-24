"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MailCard } from "./_components/mail-card"
import { useGetLabels, useGetMails } from "./queries"
import { LoadingScreen } from "@/components/loading-screen"
import { IGmail } from "./types"
import { toast } from "sonner"

interface FilterState {
  labels?: string
  pageToken?: string
}

function CleanupPage() {
  const session = authClient.getSession()
  const router = useRouter()

  const [filterState, _setFilterState] = useState<FilterState>()

  const {
    data: mailsRes,
    status: mailsStatus,
    error: mailsError,
  } = useGetMails(filterState?.pageToken, filterState?.labels)

  const {
    data: labelsRes,
    status: labelsStatus,
    error: labelsError,
  } = useGetLabels()
  // TODO: Delete console.log
  console.log("LOGGING labels", labelsRes)

  if (!session) {
    router.push(`/api/auth/login?callbackUrl=${encodeURIComponent("/clean")}`)
  }

  if (mailsStatus === "pending") {
    return <LoadingScreen />
  }

  if (mailsStatus === "error") {
    toast.error(mailsError?.message)
  }

  if (labelsStatus === "error") {
    toast.error(labelsError?.message)
  }

  const mails = mailsRes?.messages as IGmail[]

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
