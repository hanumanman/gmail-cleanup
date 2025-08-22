import { db } from "@/db"
import { account } from "@/db/schema"
import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { and, eq } from "drizzle-orm"
import { google as googleapi } from "googleapis"
import { headers } from "next/headers"
import z from "zod"

const schema = z.object({
  userId: z.string(),
})

export async function POST(request: Request) {
  const res = await request
    .json()
    .catch(() => Response.json({ success: false, msg: "Invalid JSON" }))

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  console.log("SESSION IS ", session)

  const { success, data, error } = schema.safeParse(res)
  if (!success) {
    return Response.json({ success, msg: z.prettifyError(error) })
  }

  const { userId } = data
  console.log("USER ID: ", userId)

  const [userAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "google")))

  let access_token = ""
  let refresh_token = ""
  try {
    const accessTokenObj = await auth.api.getAccessToken({
      body: {
        providerId: "google",
        accountId: userAccount.accountId,
        userId: userAccount.userId,
      },
    })
    access_token = accessTokenObj.accessToken || ""
    refresh_token = userAccount.refreshToken || ""
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
  const authClient = new googleapi.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET
  )
  authClient.setCredentials({
    access_token,
    refresh_token,
  })
  const gmail = googleapi.gmail({ version: "v1", auth: authClient })

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
