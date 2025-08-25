"use client"

import { Button } from "@/components/ui/button"
import { PaginationState } from "@/types/gmail"

interface PaginationControlsProps {
  paginationState: PaginationState
  onNextPage: () => void
  onPreviousPage: () => void
  emailRangeText: string
  isLoading?: boolean
  isDeleting?: boolean
  resultSizeEstimate?: number
}

export function PaginationControls({
  paginationState,
  onNextPage,
  onPreviousPage,
  emailRangeText,
  isLoading = false,
  isDeleting = false,
  resultSizeEstimate,
}: PaginationControlsProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button
        onClick={onPreviousPage}
        disabled={!paginationState.hasPreviousPage || isLoading || isDeleting}
        variant="outline"
      >
        ← Previous
      </Button>
      <div className="text-center text-sm text-gray-500">
        <div>{emailRangeText}</div>
        {resultSizeEstimate && (
          <div className="mt-1 text-xs opacity-75">
            * Gmail's estimated count (may not reflect total inbox)
          </div>
        )}
      </div>
      <Button
        onClick={onNextPage}
        disabled={!paginationState.hasNextPage || isLoading || isDeleting}
        variant="outline"
      >
        Next →
      </Button>
    </div>
  )
}
