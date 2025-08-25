// Gmail API related types

export interface IGmail {
  id: string
  threadId?: string | null
  labelIds?: string[] | null
  snippet?: string | null
  payload?: {
    headers?: Array<{
      name: string
      value: string
    }> | null
  } | null
  internalDate?: string | null
  historyId?: string | null
  sizeEstimate?: number | null
}

export interface ILabel {
  id: string
  name: string
  messageListVisibility: string
  labelListVisibility: string
  type: string
}

// API Response types
export interface GetMailsResponse {
  messages: IGmail[]
  nextPageToken: string | null
  resultSizeEstimate?: number
}

export interface GetLabelsResponse {
  labels: ILabel[]
}

export interface DeleteMailsRequest {
  messageIds: string[]
  labels?: string[]
  inverse?: boolean
}

export interface DeleteMailsResponse {
  success: boolean
  deletedCount: number
  message: string
}

// Component prop types
export interface FilterState {
  labels?: string[]
  pageToken?: string
  inverse?: boolean
}

export interface PaginationState {
  currentPageToken?: string | null
  previousPageTokens: string[] // Stack to track previous pages for back navigation
  nextPageToken?: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number // Track current page number for display
}

export interface LabelFilterProps {
  labels?: ILabel[]
  labelsStatus: "pending" | "error" | "success"
  onLabelsSelect: (labelIds: string[]) => void
  appliedLabels?: string[]
  inverse?: boolean
  onInverseToggle?: (inverse: boolean) => void
}

export interface MailCardProps extends IGmail {
  showCheckbox?: boolean
  isSelected?: boolean
  onSelectionChange?: (selected: boolean) => void
  isDeleting?: boolean
}

// Error types
export interface ParsedError {
  message?: string
  details?: string
  isAuthError?: boolean
  type?: "auth" | "network" | "generic"
}
