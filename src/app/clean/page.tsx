"use client"

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { ErrorDialog } from "@/components/error-dialog"
import { LoadingScreen } from "@/components/loading-screen"
import { parseFirstError } from "@/lib/error-utils"
import { IGmail, ParsedError } from "@/types/gmail"
import { useEffect, useState } from "react"
import { BulkActions } from "./_components/bulk-actions"
import { EmailGrid } from "./_components/email-grid"
import { LabelFilter } from "./_components/label-filter"
import { LoadingOverlay } from "./_components/loading-overlay"
import { PaginationControls } from "./_components/pagination-controls"
import { useBulkSelection } from "./hooks/useBulkSelection"
import { useFilters } from "./hooks/useFilters"
import { usePagination } from "./hooks/usePagination"
import {
  useDeleteAllFilteredMails,
  useDeleteMails,
  useGetLabels,
  useGetMails,
} from "./queries"

function CleanupPage() {
  const [showError, setShowError] = useState(false)
  const [parsedError, setParsedError] = useState<ParsedError>()
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)

  // Custom hooks for state management
  const { filterState, handleLabelsSelect, handleInverseToggle } = useFilters()
  const {
    paginationState,
    resetPagination,
    updatePagination,
    handleNextPage,
    handlePreviousPage,
    getEmailRangeText,
  } = usePagination()
  const {
    bulkSelectMode,
    selectedEmails,
    toggleBulkSelectMode,
    handleEmailSelection,
    selectAllEmails,
    deselectAllEmails,
    clearSelection,
  } = useBulkSelection()

  const {
    data: mailsRes,
    status: mailsStatus,
    error: mailsError,
    refetch: refetchMails,
    isLoading: mailsLoading,
  } = useGetMails(
    paginationState.currentPageToken ?? undefined,
    filterState?.labels,
    filterState?.inverse
  )

  const {
    data: labelsRes,
    status: labelsStatus,
    error: labelsError,
    refetch: refetchLabels,
  } = useGetLabels()

  // Delete mutations
  const deleteMutation = useDeleteMails()
  const deleteAllFilteredMutation = useDeleteAllFilteredMails()

  // Update pagination state when mail data changes
  useEffect(() => {
    if (mailsRes?.nextPageToken !== undefined) {
      updatePagination(mailsRes.nextPageToken)
    }
  }, [mailsRes, updatePagination])

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [filterState?.labels, filterState?.inverse, resetPagination])

  // Check for any errors and show dialog
  useEffect(() => {
    const errors = [mailsError, labelsError].filter(Boolean)
    const errorResult = parseFirstError(errors)

    if (errorResult.hasError) {
      setParsedError({
        message: errorResult.message,
        details: errorResult.details,
        isAuthError: errorResult.isAuthError,
        type: errorResult.type,
      })
      setShowError(true)
    }
  }, [mailsError, labelsError])

  const handleRetry = () => {
    refetchMails()
    refetchLabels()
  }

  const handleBulkDelete = () => {
    const emailIds = Array.from(selectedEmails)
    deleteMutation.mutate({ messageIds: emailIds })
    clearSelection()
  }

  const handleDeleteAllFiltered = () => {
    if (filterState?.labels && filterState.labels.length > 0) {
      deleteAllFilteredMutation.mutate({
        labels: filterState.labels,
        inverse: filterState.inverse,
      })
    }
  }

  if (mailsStatus === "pending") {
    return <LoadingScreen />
  }

  const mails = mailsRes?.messages as IGmail[]
  const isDeleting =
    deleteMutation.isPending || deleteAllFilteredMutation.isPending
  const hasFilters = filterState?.labels && filterState.labels.length > 0
  const emailRangeText = getEmailRangeText(
    mails?.length || 0,
    mailsRes?.resultSizeEstimate,
    hasFilters,
    filterState?.inverse
  )

  return (
    <>
      <ErrorDialog
        open={showError}
        onOpenChange={setShowError}
        error={parsedError}
        onRetry={handleRetry}
      />

      <DeleteConfirmationDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        title="Delete Selected Emails"
        description={`Are you sure you want to delete ${selectedEmails.size} selected email(s)? This action cannot be undone.`}
        confirmButtonText={`Delete ${selectedEmails.size} email(s)`}
        isLoading={deleteMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        onConfirm={handleDeleteAllFiltered}
        title="Delete All Filtered Emails"
        description={`Are you sure you want to delete ALL emails ${filterState?.inverse ? "WITHOUT" : "WITH"} the selected label(s)? This will delete ${mailsRes?.resultSizeEstimate ? `approximately ${mailsRes.resultSizeEstimate.toLocaleString()}` : "all"} emails and cannot be undone.`}
        confirmButtonText={`Delete All ${filterState?.inverse ? "Without" : "With"} Labels`}
        isLoading={deleteAllFilteredMutation.isPending}
      />

      <LoadingOverlay
        isVisible={isDeleting}
        isDeleteAll={deleteAllFilteredMutation.isPending}
        selectedCount={selectedEmails.size}
      />

      <div className="h-screen overflow-y-auto">
        <div className="p-4">
          <BulkActions
            bulkSelectMode={bulkSelectMode}
            selectedEmails={selectedEmails}
            filterState={filterState}
            isDeleting={isDeleting}
            onToggleBulkSelectMode={toggleBulkSelectMode}
            onSelectAll={() => selectAllEmails(mails)}
            onDeselectAll={deselectAllEmails}
            onShowBulkDeleteDialog={() => setShowBulkDeleteDialog(true)}
            onShowDeleteAllDialog={() => setShowDeleteAllDialog(true)}
          />

          <LabelFilter
            labels={labelsRes}
            labelsStatus={labelsStatus}
            onLabelsSelect={handleLabelsSelect}
            appliedLabels={filterState?.labels || []}
            inverse={filterState?.inverse || false}
            onInverseToggle={handleInverseToggle}
          />

          <PaginationControls
            paginationState={paginationState}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            emailRangeText={emailRangeText}
            isLoading={mailsLoading}
            isDeleting={isDeleting}
            resultSizeEstimate={mailsRes?.resultSizeEstimate}
          />

          <EmailGrid
            emails={mails || []}
            bulkSelectMode={bulkSelectMode}
            selectedEmails={selectedEmails}
            isDeleting={isDeleting}
            onEmailSelection={handleEmailSelection}
          />
        </div>
      </div>
    </>
  )
}

export default CleanupPage
