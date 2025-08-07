import z from "zod"
import { google as googleapi } from "googleapis"
import { db } from "@/db"
import { account } from "@/db/schema"
import { and, eq } from "drizzle-orm"

const schema = z.object({
  userId: z.string(),
})

export async function POST(request: Request) {
  const res = await request
    .json()
    .catch(() => Response.json({ success: false, msg: "Invalid JSON" }))

  const { success, data, error } = schema.safeParse(res)
  if (!success) {
    return Response.json({ success, msg: z.prettifyError(error) })
  }

  const { userId } = data

  const [user] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "google")))

  // Create an authenticated OAuth2 client
  const authClient = new googleapi.auth.OAuth2()
  authClient.setCredentials({ access_token: user.accessToken })
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
