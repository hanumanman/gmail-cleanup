import z from "zod"
import { google as googleapi } from "googleapis"

const schema = z.object({
  access_token: z.string(),
})

export async function POST(request: Request) {
  const res = await request
    .json()
    .catch(() => Response.json({ success: false, msg: "Invalid JSON" }))

  const { success, data, error } = schema.safeParse(res)
  if (!success) {
    return Response.json({ success, msg: z.prettifyError(error) })
  }

  const { access_token } = data

  // 2. Create an authenticated OAuth2 client
  const authClient = new googleapi.auth.OAuth2()
  authClient.setCredentials({ access_token })

  const gmail = googleapi.gmail({ version: "v1", auth: authClient })

  // 3. Fetch the list of the first 10 message IDs
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  })

  const messages = listResponse.data.messages
  if (!messages || messages.length === 0) {
    return Response.json([], { status: 200 })
  }

  // 4. Fetch the full details for each message
  const emailPromises = messages.map(message =>
    gmail.users.messages.get({
      userId: "me",
      id: message.id!,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "Date"],
    })
  )

  const emailResponses = await Promise.all(emailPromises)
  const emails = emailResponses.map(res => {
    const headers = res.data.payload?.headers
    const subject = headers?.find(h => h.name === "Subject")?.value
    const from = headers?.find(h => h.name === "From")?.value
    const date = headers?.find(h => h.name === "Date")?.value
    return {
      id: res.data.id,
      snippet: res.data.snippet,
      subject,
      from,
      date,
    }
  })

  return Response.json({ messages, emails })
}
