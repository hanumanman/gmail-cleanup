"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface PaginationControlsProps {
  nextPageToken: string | null
  currentPageToken?: string
  labelId?: string
}

export function PaginationControls({
  nextPageToken,
  currentPageToken,
  labelId,
}: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tokenHistory, setTokenHistory] = useState<string[]>([])

  // Initialize token history from sessionStorage on mount
  useEffect(() => {
    const storedHistory = sessionStorage.getItem("gmail-token-history")
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)
        setTokenHistory(parsedHistory)
      } catch (error) {
        console.error("Failed to parse token history:", error)
        sessionStorage.removeItem("gmail-token-history")
      }
    }
  }, [])

  // Update token history when navigating forward
  useEffect(() => {
    if (currentPageToken && !tokenHistory.includes(currentPageToken)) {
      const newHistory = [...tokenHistory, currentPageToken]
      setTokenHistory(newHistory)
      sessionStorage.setItem("gmail-token-history", JSON.stringify(newHistory))
    }
  }, [currentPageToken, tokenHistory])

  const handleNextPage = () => {
    if (!nextPageToken) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("pageToken", nextPageToken)
    
    if (labelId) {
      params.set("labelId", labelId)
    }

    router.push(`/clean?${params.toString()}`)
  }

  const handlePreviousPage = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (labelId) {
      params.set("labelId", labelId)
    }

    if (currentPageToken) {
      // Find the previous token in history
      const currentIndex = tokenHistory.indexOf(currentPageToken)
      if (currentIndex > 0) {
        const previousToken = tokenHistory[currentIndex - 1]
        params.set("pageToken", previousToken)
        router.push(`/clean?${params.toString()}`)
      } else {
        // Go to first page (no token)
        params.delete("pageToken")
        router.push(`/clean?${params.toString()}`)
        
        // Clear history if going back to first page
        setTokenHistory([])
        sessionStorage.removeItem("gmail-token-history")
      }
    } else {
      // Already on first page, cannot go back further
      return
    }
  }

  // Check if we can go to previous page
  const canGoPrevious = currentPageToken !== undefined

  // Check if we can go to next page
  const canGoNext = nextPageToken !== null

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={handlePreviousPage}
        disabled={!canGoPrevious}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {currentPageToken ? `Page ${tokenHistory.length + 1}` : "Page 1"}
      </div>

      <Button
        variant="outline"
        onClick={handleNextPage}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
