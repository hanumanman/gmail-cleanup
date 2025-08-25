import { gmail_v1 } from "googleapis"

export interface EmailMessage {
  id?: string | null
  labelIds?: string[] | null
  payload?: gmail_v1.Schema$MessagePart | null
  snippet?: string | null
  internalDate?: string | null
}

export interface MessagesListParams {
  pageToken?: string
  labels?: string[]
  inverse?: boolean
  maxResults?: number
}

export interface MessagesListResult {
  messages: EmailMessage[]
  nextPageToken?: string
  resultSizeEstimate?: number
}

export interface DeleteMessagesParams {
  messageIds: string[]
  labels?: string[]
  inverse?: boolean
}

export interface DeleteMessagesResult {
  success: boolean
  deletedCount: number
  message: string
}

/**
 * Gmail service class that handles Gmail API operations
 */
export class GmailService {
  constructor(private gmail: gmail_v1.Gmail) {}

  /**
   * Retry function with exponential backoff for rate limit errors
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        // Check if it's a rate limit error (429) or quota exceeded
        const isRateLimit =
          error.status === 429 ||
          error.code === 429 ||
          error.message?.includes("Too many concurrent requests") ||
          error.message?.includes("quotaExceeded")

        if (!isRateLimit || attempt === maxRetries) {
          throw error
        }

        // Calculate delay with exponential backoff + jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        console.warn(
          `Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error("Unexpected error in retry logic")
  }

  /**
   * Lists messages based on filters and pagination
   */
  async listMessages({
    pageToken,
    labels,
    inverse = false,
    maxResults = 9,
  }: MessagesListParams): Promise<MessagesListResult> {
    if (inverse && labels && labels.length > 0) {
      return this.listMessagesWithInverseFilter(labels, pageToken, maxResults)
    }

    return this.listMessagesNormal(labels, pageToken, maxResults)
  }

  /**
   * Deletes messages based on IDs or filter criteria
   */
  async deleteMessages({
    messageIds,
    labels,
    inverse = false,
  }: DeleteMessagesParams): Promise<DeleteMessagesResult> {
    if (labels && labels.length > 0) {
      return this.deleteMessagesByFilter(labels, inverse)
    }

    return this.deleteSpecificMessages(messageIds)
  }

  /**
   * Lists all labels for the user
   */
  async listLabels() {
    const response = await this.gmail.users.labels.list({
      userId: "me",
    })

    return response.data.labels || []
  }

  /**
   * Gets message details with metadata
   */
  async getMessageDetails(messageIds: string[]) {
    const messageDetailsPromises = messageIds.map(async messageId => {
      try {
        const msgResponse = await this.gmail.users.messages.get({
          userId: "me",
          id: messageId,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        })
        return msgResponse.data
      } catch (error: any) {
        // Handle 404 errors (message not found) gracefully
        if (error.status === 404 || error.code === 404) {
          console.warn(`Message ${messageId} not found (404), skipping`)
          return null
        }
        throw error // Re-throw other errors
      }
    })

    const results = await Promise.all(messageDetailsPromises)
    // Filter out null results (404 errors) and cast to EmailMessage
    return results.filter(result => result !== null) as EmailMessage[]
  }

  /**
   * Lists messages with normal filtering (messages WITH selected labels)
   */
  private async listMessagesNormal(
    labels?: string[],
    pageToken?: string,
    maxResults = 9
  ): Promise<MessagesListResult> {
    const response = await this.gmail.users.messages.list({
      userId: "me",
      maxResults,
      labelIds: labels,
      pageToken: pageToken ?? undefined,
    })

    const messages = response.data.messages || []

    if (messages.length === 0) {
      return {
        messages: [],
        resultSizeEstimate: 0,
      }
    }

    const messageDetails = await this.getMessageDetails(
      messages.map(msg => msg.id!).filter(Boolean)
    )

    return {
      messages: messageDetails,
      nextPageToken: response.data.nextPageToken ?? undefined,
      resultSizeEstimate: response.data.resultSizeEstimate ?? undefined,
    }
  }

  /**
   * Lists messages with inverse filtering (messages WITHOUT selected labels)
   */
  private async listMessagesWithInverseFilter(
    labels: string[],
    pageToken?: string,
    maxResults = 9
  ): Promise<MessagesListResult> {
    // Get all messages (without label filter)
    const allMessagesResponse = await this.gmail.users.messages.list({
      userId: "me",
      maxResults: 500, // Get more to filter
      pageToken: pageToken ?? undefined,
    })

    const allMessages = allMessagesResponse.data.messages || []

    if (allMessages.length === 0) {
      return { messages: [], resultSizeEstimate: 0 }
    }

    // Get minimal message details to check labels
    const messageDetailsPromises = allMessages.map(async message => {
      const msgResponse = await this.gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "minimal",
      })
      return msgResponse.data
    })

    const allMessageDetails = await Promise.all(messageDetailsPromises)

    // Filter out messages that have ANY of the selected labels
    const filteredMessages = allMessageDetails.filter(message => {
      const messageLabelIds = message.labelIds || []
      // Return true if the message does NOT have any of the selected labels
      return !labels.some(labelId => messageLabelIds.includes(labelId))
    })

    // Take only the first maxResults for display
    const paginatedMessages = filteredMessages.slice(0, maxResults)

    // Get full metadata for display
    const fullMessageDetails = await this.getMessageDetails(
      paginatedMessages.map(msg => msg.id!).filter(Boolean)
    )

    return {
      messages: fullMessageDetails,
      nextPageToken:
        filteredMessages.length > maxResults ? "has_more" : undefined,
      resultSizeEstimate: filteredMessages.length,
    }
  }

  /**
   * Deletes specific messages by their IDs using batch delete
   */
  private async deleteSpecificMessages(
    messageIds: string[]
  ): Promise<DeleteMessagesResult> {
    if (messageIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: "No messages to delete",
      }
    }

    // Gmail API batchDelete can handle up to 1000 messages at once
    const chunkSize = 1000
    let totalDeleted = 0

    for (let i = 0; i < messageIds.length; i += chunkSize) {
      const chunk = messageIds.slice(i, i + chunkSize)

      try {
        await this.retryWithBackoff(() =>
          this.gmail.users.messages.batchDelete({
            userId: "me",
            requestBody: {
              ids: chunk,
            },
          })
        )
        totalDeleted += chunk.length
      } catch (error: any) {
        console.warn(
          `Failed to delete batch of ${chunk.length} messages:`,
          error.message
        )
        // Continue with next batch even if this one fails
      }
    }

    return {
      success: true,
      deletedCount: totalDeleted,
      message: `Successfully deleted ${totalDeleted} message(s)`,
    }
  }

  /**
   * Deletes messages based on filter criteria
   */
  private async deleteMessagesByFilter(
    labels: string[],
    inverse: boolean
  ): Promise<DeleteMessagesResult> {
    let allMessageIds: string[] = []
    let pageToken: string | undefined = undefined

    if (inverse) {
      // For inverse filtering, get all messages and filter out those with selected labels
      do {
        const response: gmail_v1.Schema$ListMessagesResponse = (
          await this.gmail.users.messages.list({
            userId: "me",
            maxResults: 500, // Max allowed by Gmail API
            pageToken: pageToken,
          })
        ).data

        if (response.messages) {
          // Get message details to check labels
          const messageDetailsPromises = response.messages.map(
            async (message: gmail_v1.Schema$Message) => {
              const msgResponse = await this.gmail.users.messages.get({
                userId: "me",
                id: message.id!,
                format: "minimal",
              })
              return msgResponse.data
            }
          )

          const messageDetails = await Promise.all(messageDetailsPromises)

          // Filter messages that do NOT have any of the selected labels
          const filteredMessageIds = messageDetails
            .filter(message => {
              const messageLabelIds = message.labelIds || []
              return !labels.some(labelId => messageLabelIds.includes(labelId))
            })
            .map(message => message.id!)
            .filter(Boolean)

          allMessageIds = allMessageIds.concat(filteredMessageIds)
        }

        pageToken = response.nextPageToken ?? undefined
      } while (pageToken)
    } else {
      // Normal filtering (messages WITH the selected labels)
      do {
        const response: gmail_v1.Schema$ListMessagesResponse = (
          await this.gmail.users.messages.list({
            userId: "me",
            maxResults: 500, // Max allowed by Gmail API
            labelIds: labels,
            pageToken: pageToken,
          })
        ).data

        if (response.messages) {
          allMessageIds = allMessageIds.concat(
            response.messages
              .map((msg: gmail_v1.Schema$Message) => msg.id!)
              .filter(Boolean)
          )
        }

        pageToken = response.nextPageToken ?? undefined
      } while (pageToken)
    }

    // Delete all messages matching the criteria using batch delete
    if (allMessageIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: "No messages found matching the criteria",
      }
    }

    // Gmail API batchDelete can handle up to 1000 messages at once
    const chunkSize = 1000
    let totalDeleted = 0

    for (let i = 0; i < allMessageIds.length; i += chunkSize) {
      const chunk = allMessageIds.slice(i, i + chunkSize)

      try {
        await this.retryWithBackoff(() =>
          this.gmail.users.messages.batchDelete({
            userId: "me",
            requestBody: {
              ids: chunk,
            },
          })
        )
        totalDeleted += chunk.length
      } catch (error: any) {
        console.warn(
          `Failed to delete batch of ${chunk.length} messages:`,
          error.message
        )
        // Continue with next batch even if this one fails
      }
    }

    return {
      success: true,
      deletedCount: totalDeleted,
      message: `Successfully deleted ${totalDeleted} messages`,
    }
  }
}
