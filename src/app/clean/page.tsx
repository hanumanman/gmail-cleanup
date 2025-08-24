import { Suspense } from "react"
import { LoadingSkeleton } from "./_components/loading-skeleton"
import { MailList } from "./_components/mail-list"

interface CleanupPageProps {
  searchParams: {
    pageToken?: string
    labelId?: string
  }
}

export default function CleanupPage({ searchParams }: CleanupPageProps) {
  return (
    <div className="h-screen overflow-y-auto">
      {/* <FilterBar onFilterChange={handleFilterChange} onError={handleError} /> */}
      <Suspense fallback={<LoadingSkeleton />}>
        <MailList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
