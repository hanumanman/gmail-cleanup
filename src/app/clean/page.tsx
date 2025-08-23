"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MailCard } from "./_components/mail-card"
import { FilterBar } from "./_components/filter-bar"
import { PaginationControls } from "./_components/pagination-controls"
import { IGmail } from "./types"

function CleanupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mails, setMails] = useState<IGmail[]>([])
  const [loading, setLoading] = useState(true)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [currentLabel, setCurrentLabel] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTokens, setPageTokens] = useState<string[]>([])

  // Get current URL parameters
  const urlPage = searchParams.get("page")
  const urlLabel = searchParams.get("label")

  // Function to update URL parameters
  const updateUrlParams = (page?: number, label?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page !== undefined) {
      if (page === 1) {
        params.delete("page")
      } else {
        params.set("page", page.toString())
      }
    }

    if (label !== undefined) {
      if (label === "all") {
        params.delete("label")
      } else {
        params.set("label", label)
      }
    }

    const newUrl = params.toString()
    router.replace(`/clean${newUrl ? `?${newUrl}` : ""}`, { scroll: false })
  }

  // Function to fetch emails with pagination
  const fetchEmails = async (
    labelId: string = "all",
    pageToken?: string | null,
    targetPage?: number
  ) => {
    setLoading(true)
    try {
      const url = new URL("/api/gmail/messages", window.location.origin)
      if (labelId !== "all") {
        url.searchParams.set("labelId", labelId)
      }
      if (pageToken) {
        url.searchParams.set("pageToken", pageToken)
      }

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setMails(data.messages || [])
        setNextPageToken(data.nextPageToken)
        setHasPreviousPage(!!pageToken)
        setCurrentLabel(labelId)

        // Update page tracking
        if (targetPage !== undefined) {
          setCurrentPage(targetPage)
          updateUrlParams(targetPage, labelId)
        } else if (pageToken) {
          const newPage = currentPage + 1
          setCurrentPage(newPage)
          updateUrlParams(newPage, labelId)
        } else {
          setCurrentPage(1)
          updateUrlParams(1, labelId)
        }

        // Store page tokens for navigation
        if (pageToken && data.nextPageToken) {
          setPageTokens(prev => {
            const newTokens = [...prev]
            // Store the token that was used to reach this page
            // This allows us to navigate back to this page later
            const pageIndex = targetPage ? targetPage - 1 : currentPage - 1
            newTokens[pageIndex] = pageToken
            return newTokens
          })
        }
      }
    } catch (error) {
      console.error("Error fetching emails:", error)
      setMails([])
    } finally {
      setLoading(false)
    }
  }

  // Sync with URL parameters when they change
  useEffect(() => {
    const urlPageNum = urlPage ? parseInt(urlPage, 10) : 1
    const urlLabelValue = urlLabel || "all"

    // Update state and fetch emails based on URL parameters
    setCurrentPage(urlPageNum)
    setCurrentLabel(urlLabelValue)

    if (urlPageNum === 1) {
      fetchEmails(urlLabelValue, null, urlPageNum)
    } else if (pageTokens[urlPageNum - 1]) {
      // Use stored token if available
      fetchEmails(urlLabelValue, pageTokens[urlPageNum - 1], urlPageNum)
    } else {
      // Navigate to closest available page or start from beginning
      fetchEmails(urlLabelValue, null, 1)
    }
  }, [urlPage, urlLabel, pageTokens])

  const handleEmailsChange = (newEmails: IGmail[], labelId?: string) => {
    setMails(newEmails)
    if (labelId) {
      setCurrentLabel(labelId)
      setNextPageToken(null)
      setHasPreviousPage(false)
      setCurrentPage(1)
      setPageTokens([])
      updateUrlParams(1, labelId)
    }
  }

  const handleNextPage = () => {
    if (nextPageToken) {
      const nextPage = currentPage + 1
      fetchEmails(currentLabel, nextPageToken, nextPage)
    }
  }

  const handlePreviousPage = () => {
    // For simplicity, we'll refetch from the beginning
    // In a more complex implementation, you might want to store previous tokens
    fetchEmails(currentLabel, null, 1)
  }

  const handlePageNumber = (pageNumber: number) => {
    if (pageNumber === currentPage) return // Already on this page

    if (pageNumber === 1) {
      // Go to first page
      fetchEmails(currentLabel, null, pageNumber)
    } else if (pageTokens[pageNumber - 1]) {
      // Use stored page token for this page
      fetchEmails(currentLabel, pageTokens[pageNumber - 1], pageNumber)
    } else {
      // If we don't have a direct token, find the closest available page
      const availablePages = pageTokens
        .map((pageToken, index) => index + 1)
        .filter(page => page <= pageNumber && pageTokens[page - 1])

      if (availablePages.length > 0) {
        const closestPage = Math.max(...availablePages)
        // Navigate to the closest available page
        fetchEmails(currentLabel, pageTokens[closestPage - 1], closestPage)
      } else {
        // No stored tokens, go to first page
        fetchEmails(currentLabel, null, 1)
      }
    }
  }

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading emails...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto">
      <FilterBar onEmailsChangeAction={handleEmailsChange} />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mails.map(mail => (
          <MailCard key={mail.id} {...mail} />
        ))}
      </div>
      <PaginationControls
        hasNextPage={!!nextPageToken}
        hasPreviousPage={hasPreviousPage}
        onNextPageAction={handleNextPage}
        onPreviousPageAction={handlePreviousPage}
        onPageNumberAction={handlePageNumber}
        currentPage={currentPage}
        totalPages={Math.max(currentPage + 2, 5)} // Estimate total pages
        loading={loading}
      />
    </div>
  )
}

export default CleanupPage
