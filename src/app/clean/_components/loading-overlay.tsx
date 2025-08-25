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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        <span className="text-sm font-medium">
          {isDeleteAll
            ? "Deleting all filtered emails..."
            : `Deleting ${selectedCount > 0 ? selectedCount : ""} email(s)...`}
        </span>
      </div>
    </div>
  )
}
