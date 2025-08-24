import { getAccessToken, getSession } from "@/lib/session"
import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the access token for Google using Better Auth's API
    const accessTokenResponse = await getAccessToken()

    if (!accessTokenResponse?.accessToken) {
      return NextResponse.json(
        {
          error: "No Google access token available",
          message:
            "Please re-authenticate with Google to grant Gmail API access",
        },
        { status: 401 }
      )
    }

    // Check if we have the required Gmail scope
    const hasGmailScope =
      accessTokenResponse.scopes?.includes(
        "https://www.googleapis.com/auth/gmail.modify"
      ) || accessTokenResponse.scopes?.includes("https://mail.google.com/")

    if (!hasGmailScope) {
      return NextResponse.json(
        {
          error: "Insufficient Gmail permissions",
          message:
            "Please re-authenticate with Google and grant Gmail access when prompted",
          details: "You need to grant 'Modify your Gmail' permissions",
          currentScopes: accessTokenResponse?.scopes || [],
          requiredScopes: ["https://www.googleapis.com/auth/gmail.modify"],
        },
        { status: 403 }
      )
    }

    // Create OAuth2 client with the access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessTokenResponse.accessToken,
    })

    // Create Gmail API client
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    })

    // List all labels
    const response = await gmail.users.labels.list({
      userId: "me",
    })

    const labels = response.data.labels || []

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
