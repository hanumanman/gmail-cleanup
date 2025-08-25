import { getAccessToken, getSession } from "@/lib/session"
import { google } from "googleapis"

export interface AuthValidationError {
  error: string
  message: string
  details?: string
  currentScopes?: string[]
  requiredScopes?: string[]
  status: number
}

export interface AuthValidationResult {
  success: boolean
  error?: AuthValidationError
  accessToken?: string
  scopes?: string[]
}

/**
 * Validates user session and Gmail API access
 */
export async function validateGmailAuth(): Promise<AuthValidationResult> {
  const session = await getSession()

  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        error: "Unauthorized",
        message: "Please log in to access Gmail",
        status: 401,
      },
    }
  }

  const accessTokenResponse = await getAccessToken()

  if (!accessTokenResponse?.accessToken) {
    return {
      success: false,
      error: {
        error: "No Google access token available",
        message: "Please re-authenticate with Google to grant Gmail API access",
        status: 401,
      },
    }
  }

  return {
    success: true,
    accessToken: accessTokenResponse.accessToken,
    scopes: accessTokenResponse.scopes,
  }
}

/**
 * Checks if the user has the required Gmail scopes
 */
export function hasRequiredGmailScopes(
  scopes: string[] = [],
  requiredScopes: string[] = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://mail.google.com/",
  ]
): boolean {
  return requiredScopes.some(requiredScope => scopes.includes(requiredScope))
}

/**
 * Creates a Gmail API client with the provided access token
 */
export function createGmailClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({
    access_token: accessToken,
  })

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  })
}

/**
 * Validates Gmail authentication and returns a configured Gmail client
 */
export async function getGmailClient(
  requiredScopes: string[] = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://mail.google.com/",
  ]
) {
  const authResult = await validateGmailAuth()

  if (!authResult.success || !authResult.accessToken) {
    return { error: authResult.error }
  }

  const hasScopes = hasRequiredGmailScopes(authResult.scopes, requiredScopes)

  if (!hasScopes) {
    return {
      error: {
        error: "Insufficient Gmail permissions",
        message:
          "Please re-authenticate with Google and grant Gmail access when prompted",
        details: "You need to grant the required Gmail permissions",
        currentScopes: authResult.scopes || [],
        requiredScopes,
        status: 403,
      },
    }
  }

  const gmail = createGmailClient(authResult.accessToken)

  return { gmail, accessToken: authResult.accessToken }
}
