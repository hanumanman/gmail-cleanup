export function LoadingSkeleton() {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Generate 8 skeleton cards */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse border rounded-lg p-4 space-y-3"
          >
            {/* Subject line skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>

            {/* From line skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>

            {/* Snippet skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Labels skeleton */}
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-9 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>
  )
}
