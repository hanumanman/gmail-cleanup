import { getAccessToken, getSession } from "@/lib/session"
import { google as googleapis } from "googleapis"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const oauth2Client = new googleapis.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessTokenResponse.accessToken,
    })

    const gmail = googleapis.gmail({
      version: "v1",
      auth: oauth2Client,
    })

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 9,
    })

    const messages = response.data.messages || []

    if (messages.length === 0) {
      return NextResponse.json({
        messages: [],
        message: "No messages found",
      })
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
        return msgResponse.data
      })
    )

    return NextResponse.json({
      messages: messageDetails,
    })
  } catch (error) {
    console.error("Error fetching Gmail messages:", error)
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
