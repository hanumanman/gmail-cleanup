/**
 * Utility functions for handling all types of errors
 */

import { AxiosError } from "axios"

export interface ParsedError {
  hasError: boolean
  isAuthError: boolean
  type: "auth" | "network" | "generic"
  message?: string
  details?: string
}

/**
 * Categorizes and parses an error to determine its type and appropriate handling
 */
export function parseError(error: unknown): ParsedError {
  if (!error) {
    return { hasError: false, isAuthError: false, type: "generic" }
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data

    // Authentication errors (401, 403, 500)
    // 500 errors from Gmail API often indicate server-side auth token issues
    if (status === 401 || status === 403 || status === 500) {
      return {
        hasError: true,
        isAuthError: true,
        type: "auth",
        message: data?.message || "Authentication required",
        details:
          data?.details ||
          (status === 500
            ? "Server authentication error - please reauthenticate"
            : undefined),
      }
    }

    // Network/connection errors (502, 503, 504, timeout, no response)
    if (
      (status !== undefined && status > 500) ||
      error.code === "ECONNABORTED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      !error.response
    ) {
      return {
        hasError: true,
        isAuthError: false,
        type: "network",
        message: data?.message || error.message || "Network connection failed",
        details: `Status: ${status || "No response"}, Code: ${error.code || "Unknown"}`,
      }
    }

    // Other client/server errors (400, 404, etc.)
    return {
      hasError: true,
      isAuthError: false,
      type: "generic",
      message:
        data?.message ||
        error.message ||
        `Request failed with status ${status}`,
      details: data?.details,
    }
  }

  // Handle generic errors with auth-related messages
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    if (
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("token") ||
      message.includes("scope") ||
      message.includes("permission") ||
      message.includes("internal server error") ||
      message.includes("server error") ||
      message.includes("invalid credentials")
    ) {
      return {
        hasError: true,
        isAuthError: true,
        type: "auth",
        message: error.message,
      }
    }

    // Network-related error messages
    if (
      message.includes("network") ||
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("fetch")
    ) {
      return {
        hasError: true,
        isAuthError: false,
        type: "network",
        message: error.message,
      }
    }

    // Generic error
    return {
      hasError: true,
      isAuthError: false,
      type: "generic",
      message: error.message,
    }
  }

  // Fallback for unknown error types
  return {
    hasError: true,
    isAuthError: false,
    type: "generic",
    message: "An unknown error occurred",
    details: String(error),
  }
}

/**
 * Finds the first error in an array and returns its parsed information
 */
export function parseFirstError(errors: unknown[]): ParsedError {
  for (const error of errors) {
    const parsedError = parseError(error)
    if (parsedError.hasError) {
      return parsedError
    }
  }
  return { hasError: false, isAuthError: false, type: "generic" }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use parseError instead
 */
export function isAuthenticationError(error: unknown) {
  const parsed = parseError(error)
  return {
    isAuthError: parsed.isAuthError,
    message: parsed.message,
    details: parsed.details,
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use parseFirstError instead
 */
export function hasAuthError(errors: unknown[]) {
  const parsed = parseFirstError(errors)
  return {
    isAuthError: parsed.isAuthError,
    message: parsed.message,
    details: parsed.details,
  }
}
