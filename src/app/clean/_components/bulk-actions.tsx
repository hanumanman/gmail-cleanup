"use client"

import { Button } from "@/components/ui/button"
import { FilterState } from "@/types/gmail"
import { CheckSquare, Square, Trash2 } from "lucide-react"

interface BulkActionsProps {
  bulkSelectMode: boolean
  selectedEmails: Set<string>
  filterState?: FilterState
  isDeleting: boolean
  onToggleBulkSelectMode: () => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onShowBulkDeleteDialog: () => void
  onShowDeleteAllDialog: () => void
}

export function BulkActions({
  bulkSelectMode,
  selectedEmails,
  filterState,
  isDeleting,
  onToggleBulkSelectMode,
  onSelectAll,
  onDeselectAll,
  onShowBulkDeleteDialog,
  onShowDeleteAllDialog,
}: BulkActionsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant={bulkSelectMode ? "default" : "outline"}
          onClick={onToggleBulkSelectMode}
          className="flex items-center gap-2"
          disabled={isDeleting}
        >
          {bulkSelectMode ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          {bulkSelectMode ? "Exit Select Mode" : "Select Mode"}
        </Button>

        {bulkSelectMode && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={isDeleting}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              disabled={isDeleting}
            >
              Deselect All
            </Button>
            {selectedEmails.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onShowBulkDeleteDialog}
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedEmails.size})
              </Button>
            )}
          </>
        )}
      </div>

      {filterState?.labels && filterState.labels.length > 0 && (
        <Button
          variant="destructive"
          onClick={onShowDeleteAllDialog}
          className="flex items-center gap-2"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {filterState?.inverse
            ? "Delete All WITHOUT Labels"
            : "Delete All WITH Labels"}
        </Button>
      )}
    </div>
  )
}
