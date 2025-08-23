"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface PaginationControlsProps {
  hasNextPage: boolean
  hasPreviousPage: boolean
  onNextPageAction: () => void
  onPreviousPageAction: () => void
  onPageNumberAction: (pageNumber: number) => void
  currentPage: number
  totalPages: number
  loading?: boolean
}

export function PaginationControls({
  hasNextPage,
  hasPreviousPage,
  onNextPageAction,
  onPreviousPageAction,
  onPageNumberAction,
  currentPage,
  totalPages,
  loading = false,
}: PaginationControlsProps) {
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={onPreviousPageAction}
        disabled={!hasPreviousPage || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map(pageNumber => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            onClick={() => onPageNumberAction(pageNumber)}
            disabled={loading || pageNumber === currentPage}
            className="w-10 h-10 p-0 min-w-[40px] transition-all duration-200 hover:scale-105"
            title={`Go to page ${pageNumber}`}
          >
            {pageNumber}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onNextPageAction}
        disabled={!hasNextPage || loading}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
