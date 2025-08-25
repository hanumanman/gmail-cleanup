import { PaginationState } from "@/types/gmail"
import { useCallback, useState } from "react"

export function usePagination() {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    previousPageTokens: [],
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
  })

  const resetPagination = useCallback(() => {
    setPaginationState({
      previousPageTokens: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
    })
  }, [])

  const updatePagination = useCallback((nextPageToken?: string | null) => {
    setPaginationState(prev => ({
      ...prev,
      nextPageToken: nextPageToken ?? undefined,
      hasNextPage: !!nextPageToken,
    }))
  }, [])

  const handleNextPage = useCallback(() => {
    if (paginationState.hasNextPage && paginationState.nextPageToken) {
      const newPreviousTokens = [...paginationState.previousPageTokens]
      if (paginationState.currentPageToken) {
        newPreviousTokens.push(paginationState.currentPageToken)
      }

      setPaginationState(prev => ({
        ...prev,
        currentPageToken: prev.nextPageToken,
        previousPageTokens: newPreviousTokens,
        hasPreviousPage: true,
        currentPage: prev.currentPage + 1,
      }))
    }
  }, [
    paginationState.hasNextPage,
    paginationState.nextPageToken,
    paginationState.previousPageTokens,
    paginationState.currentPageToken,
  ])

  const handlePreviousPage = useCallback(() => {
    if (
      paginationState.hasPreviousPage &&
      paginationState.previousPageTokens.length > 0
    ) {
      const newPreviousTokens = [...paginationState.previousPageTokens]
      const previousToken = newPreviousTokens.pop()

      setPaginationState(prev => ({
        ...prev,
        currentPageToken: previousToken,
        previousPageTokens: newPreviousTokens,
        hasPreviousPage: newPreviousTokens.length > 0,
        hasNextPage: true,
        currentPage: prev.currentPage - 1,
      }))
    }
  }, [paginationState.hasPreviousPage, paginationState.previousPageTokens])

  const getEmailRangeText = useCallback(
    (
      emailsLength: number,
      resultSizeEstimate?: number,
      hasFilters?: boolean,
      isInverse?: boolean
    ) => {
      if (!emailsLength) return ""

      const emailsPerPage = 9
      const startEmail = (paginationState.currentPage - 1) * emailsPerPage + 1
      const endEmail = startEmail + emailsLength - 1

      const formattedTotal = resultSizeEstimate
        ? resultSizeEstimate.toLocaleString()
        : ""

      if (resultSizeEstimate) {
        if (hasFilters) {
          const filterText = isInverse ? "without selected labels" : "filtered"
          return `Showing emails ${startEmail} to ${endEmail} of ~${formattedTotal} (${filterText})`
        } else {
          return `Showing emails ${startEmail} to ${endEmail} of ~${formattedTotal}`
        }
      } else {
        return `Showing emails ${startEmail} to ${endEmail}`
      }
    },
    [paginationState.currentPage]
  )

  return {
    paginationState,
    resetPagination,
    updatePagination,
    handleNextPage,
    handlePreviousPage,
    getEmailRangeText,
  }
}
