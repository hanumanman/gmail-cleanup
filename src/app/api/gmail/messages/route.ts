import { db } from "@/db"
import { account } from "@/db/schema"
import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { and, eq } from "drizzle-orm"
import { google as googleapi } from "googleapis"
import { headers } from "next/headers"

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const [userAccount] = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, session?.session.userId as string),
        eq(account.providerId, "google")
      )
    )

  let access_token = ""
  try {
    const accessTokenObj = await auth.api.getAccessToken({
      body: {
        providerId: "google",
      },
      headers: await headers(),
    })
    access_token = accessTokenObj.accessToken || ""
    console.log("access_token is ", access_token)
  } catch (error) {
    console.log("BIG ERR")
    console.log(JSON.stringify(error, null, 2))
    console.log(JSON.stringify(userAccount, null, 2))
    return Response.json(
      { error: "Failed to get access token" },
      { status: 500 }
    )
  }

  // Create an authenticated OAuth2 client
  // const authClient = new googleapi.auth.OAuth2()
  // authClient.setCredentials({
  //   access_token,
  // })
  // const gmail = googleapi.gmail({ version: "v1", auth: authClient })
  const gmail = googleapi.gmail({
    version: "v1",
    auth: env.GOOGLE_API_KEY,
  })

  // Fetch the list of message IDs
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 9, // TODO: Make this configurable
  })

  const messages = listResponse.data.messages
  if (!messages || messages.length === 0) {
    return Response.json([], { status: 200 })
  }

  // Fetch the full details for each message
  const emailPromises = messages.map(message =>
    gmail.users.messages.get({
      userId: "me",
      id: message.id!,
    })
  )

  const emailResponses = await Promise.all(emailPromises)
  const emails = emailResponses.map(res => res.data)

  return Response.json({ emails })
}
