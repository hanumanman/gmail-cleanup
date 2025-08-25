import { getGmailClient } from "@/lib/gmail-auth"
import { GmailService } from "@/lib/gmail-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const pageToken = searchParams.get("pageToken")
  const labels = searchParams.get("labels")
  const inverse = searchParams.get("inverse") === "true"

  try {
    // Validate auth and get Gmail client
    const clientResult = await getGmailClient([
      "https://www.googleapis.com/auth/gmail.modify",
      "https://mail.google.com/",
    ])

    if ("error" in clientResult) {
      return NextResponse.json(clientResult.error, {
        status: clientResult.error?.status || 500,
      })
    }

    // Parse labels parameter (can be comma-separated)
    const labelIds = labels ? labels.split(",").filter(Boolean) : undefined

    // Use Gmail service to list messages
    const gmailService = new GmailService(clientResult.gmail)
    const result = await gmailService.listMessages({
      pageToken: pageToken ?? undefined,
      labels: labelIds,
      inverse,
      maxResults: 9,
    })

    if (result.messages.length === 0) {
      return NextResponse.json({
        messages: [],
        message: "No messages found",
      })
    }

    return NextResponse.json({
      messages: result.messages,
      nextPageToken: result.nextPageToken,
      resultSizeEstimate: result.resultSizeEstimate,
    })
  } catch (error) {
    console.error("Error fetching Gmail messages:", error)

    // Check for specific Gmail API errors
    if (error instanceof Error) {
      if (error.message.includes("insufficient authentication scopes")) {
        return NextResponse.json(
          {
            error: "Insufficient authentication scopes",
            message:
              "Please re-authenticate with Google to grant proper Gmail API access.",
            details:
              "You need to log out and log back in to grant the new Gmail permissions",
          },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Validate auth and get Gmail client
    const clientResult = await getGmailClient([
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/gmail.modify",
    ])

    if ("error" in clientResult) {
      return NextResponse.json(clientResult.error, {
        status: clientResult.error?.status || 500,
      })
    }

    const body = await req.json()
    const { messageIds, labels, inverse } = body

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid messageIds. Expected non-empty array." },
        { status: 400 }
      )
    }

    // Use Gmail service to delete messages
    const gmailService = new GmailService(clientResult.gmail)
    const result = await gmailService.deleteMessages({
      messageIds,
      labels,
      inverse,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting Gmail messages:", error)

    // Check for specific Gmail API errors
    if (error instanceof Error) {
      if (error.message.includes("insufficient authentication scopes")) {
        return NextResponse.json(
          {
            error: "Insufficient authentication scopes",
            message:
              "Please re-authenticate with Google to grant proper Gmail API access.",
            details:
              "You need to log out and log back in to grant the new Gmail permissions",
          },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to delete messages" },
      { status: 500 }
    )
  }
}
