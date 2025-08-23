"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

// interface PageState {
//   currentPageToken: string | null
//   nextPageToken: string | null
//   prevPageToken: string | null
// }

// interface PaginationControlsProps {
//   nextPageToken: string | null
//   loading?: boolean
//   // onPageChange: (pageToken: string | null) => Promise<void>
// }
/*
It turns out that gmail does not have a straightforward way to implement pagination. Most sensible way to do is just a simple next/prev page.

On page load: fetch gmail data, first 10 results + nextPageToken, then store token into pageState.
Goto next page: get next 10 res using nextPageToken, then store token into pageState
Go to prev page: get prev 10 res using prevPageToken, then store token into pageState
This should be in context
*/

export function PaginationControls() {
  const handleNextPage = () => {
    alert("GG go next")
  }

  const handlePreviousPage = () => {
    alert("gg go prev")
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={handlePreviousPage}
        // disabled={currentPage === 1 || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Previous
      </Button>

      <Button
        variant="outline"
        onClick={handleNextPage}
        // disabled={!nextPageToken || loading}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
