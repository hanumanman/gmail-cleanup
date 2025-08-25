"use client"

interface LoadingOverlayProps {
  isVisible: boolean
  isDeleteAll: boolean
  selectedCount?: number
}

export function LoadingOverlay({
  isVisible,
  isDeleteAll,
  selectedCount = 0,
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex items-center gap-3 rounded-lg bg-white p-6 shadow-lg">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <span className="text-sm font-medium">
          {isDeleteAll
            ? "Deleting all filtered emails..."
            : `Deleting ${selectedCount > 0 ? selectedCount : ""} email(s)...`}
        </span>
      </div>
    </div>
  )
}
