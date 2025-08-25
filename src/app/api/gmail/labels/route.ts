import { getGmailClient } from "@/lib/gmail-auth"
import { GmailService } from "@/lib/gmail-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Validate auth and get Gmail client
    const clientResult = await getGmailClient([
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
    ])

    if ("error" in clientResult) {
      return NextResponse.json(clientResult.error, {
        status: clientResult.error?.status || 500,
      })
    }

    // Use Gmail service to list labels
    const gmailService = new GmailService(clientResult.gmail)
    const labels = await gmailService.listLabels()

    if (labels.length === 0) {
      return NextResponse.json({
        labels: [],
        message: "No labels found",
      })
    }

    return NextResponse.json({
      labels: labels,
    })
  } catch (error) {
    console.error("Error fetching Gmail labels:", error)

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
      { error: "Failed to fetch labels" },
      { status: 500 }
    )
  }
}
