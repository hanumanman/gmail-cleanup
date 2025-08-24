import type { IGmail } from "../types"
import { EmptyState } from "./empty-state"
import { MailCard } from "./mail-card"
import { PaginationControls } from "./pagination-controls"

interface MailListProps {
  searchParams: {
    pageToken?: string
    labelId?: string
  }
}

async function fetchGmailMessages(pageToken?: string, labelId?: string) {
  const { getAccessToken, getSession } = await import("@/lib/session")
  const { google: googleapis } = await import("googleapis")
  const { redirect } = await import("next/navigation")

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      redirect("/api/auth/login")
    }

    const accessTokenResponse = await getAccessToken()
    if (!accessTokenResponse?.accessToken) {
      redirect("/api/auth/login")
    }

    const hasGmailScope =
      accessTokenResponse.scopes?.includes(
        "https://www.googleapis.com/auth/gmail.modify"
      ) || accessTokenResponse.scopes?.includes("https://mail.google.com/")
    if (!hasGmailScope) {
      redirect("/api/auth/login")
    }

    const oauth2Client = new googleapis.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessTokenResponse.accessToken,
    })

    const gmail = googleapis.gmail({
      version: "v1",
      auth: oauth2Client,
    })

    // Fetch all labels to map IDs to names
    const labelsResponse = await gmail.users.labels.list({
      userId: "me",
    })
    const labels = labelsResponse.data.labels || []
    const labelMap = new Map(labels.map(label => [label.id!, label.name!]))

    const listParams: any = {
      userId: "me",
      maxResults: 10, // 10 items per page
    }

    // If labelId is provided, filter by that label
    if (labelId && labelId !== "all") {
      listParams.labelIds = [labelId]
    }

    // If pageToken is provided, use it for pagination
    if (pageToken) {
      listParams.pageToken = pageToken
    }

    const response = await gmail.users.messages.list(listParams)
    const messages = response.data.messages || []

    if (messages.length === 0) {
      return {
        messages: [],
        nextPageToken: null,
      }
    }

    // Get full message details for each message
    const messageDetails = await Promise.all(
      messages.map(async message => {
        const msgResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        })
        const msgData = msgResponse.data
        // Map label IDs to names
        const labelNames = (msgData.labelIds || []).map(
          id => labelMap.get(id) || id
        )
        return {
          ...msgData,
          labels: labelNames,
        }
      })
    )

    return {
      messages: messageDetails as IGmail[],
      nextPageToken: response.data.nextPageToken as string | null,
    }
  } catch (error) {
    console.error("Error fetching Gmail messages:", error)
    if (error instanceof Error) {
      if (error.message.includes("insufficient authentication scopes")) {
        redirect("/api/auth/login")
      }
    }
    throw error
  }
}

export async function MailList({ searchParams }: MailListProps) {
  const { pageToken, labelId } = searchParams
  const { messages, nextPageToken } = await fetchGmailMessages(
    pageToken,
    labelId
  )

  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {messages.map(mail => (
          <MailCard key={mail.id} {...mail} />
        ))}
      </div>
      <PaginationControls
        nextPageToken={nextPageToken}
        currentPageToken={pageToken}
        labelId={labelId}
      />
    </>
  )
}
