"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { MailCard } from "./_components/mail-card"
import { PaginationControls } from "./_components/pagination-controls"
import type { IGmail } from "./types"

interface PageState {
  mails: IGmail[]
  nextPageToken: string | null
}

export default function CleanupPage() {
  const [loading, setLoading] = useState(false)
  const [pageState, setPageState] = useState<PageState>({
    mails: [],
    nextPageToken: null,
  })

  const handleError = async (response: Response) => {
    if (response.status === 401 || response.status === 403) {
      toast.error("Please login again")
      return
    }
    toast.error("Something went wrong")
    return
  }

  async function fetchMailData(pageToken?: string) {
    setLoading(true)

    const res = await fetch(
      `/api/gmail/messages${pageToken ? `?pageToken=${pageToken}` : ""}`
    )
    if (!res.ok) {
      handleError(res)
    }
    const data = await res.json()
    setPageState({ mails: data.messages, nextPageToken: data.nextPageToken })

    setLoading(false)
  }

  // Fetch initial data on component mount
  useEffect(() => {
    fetchMailData()
  }, [])

  const handlePageChange = async (pageToken?: string) => {
    await fetchMailData(pageToken)
  }

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto">
      {/* <FilterBar onFilterChange={handleFilterChange} onError={handleError} /> */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pageState.mails.map(mail => (
          <MailCard key={mail.id} {...mail} />
        ))}
      </div>
      <PaginationControls
      // nextPageToken={nextPageToken}
      // loading={loading}
      // onPageChange={handlePageChange}
      />
      {/*<ErrorDialog
        isOpen={showError}
        title={errorTitle}
        message={errorMessage}
        onConfirm={handleLogout}
      />*/}
    </div>
  )
}
