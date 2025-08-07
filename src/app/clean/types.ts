export interface IGmail {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload: Payload
  sizeEstimate: number
  historyId: string
  internalDate: string
}

interface Payload {
  partId: string
  mimeType: string
  filename: string
  headers: Header[]
  body: PayloadBody
  parts: Part[]
}

interface PayloadBody {
  size: number
}

interface Header {
  name: string
  value: string
}

interface Part {
  partId: string
  mimeType: string
  filename: string
  headers: Header[]
  body: PartBody
}

interface PartBody {
  size: number
  data: string
}
