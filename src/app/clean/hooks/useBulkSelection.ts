import { IGmail } from "@/types/gmail"
import { useCallback, useState } from "react"

export function useBulkSelection() {
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())

  const toggleBulkSelectMode = useCallback(() => {
    setBulkSelectMode(prev => !prev)
    setSelectedEmails(new Set())
  }, [])

  const handleEmailSelection = useCallback(
    (emailId: string, selected: boolean) => {
      setSelectedEmails(prevSelected => {
        const newSelectedEmails = new Set(prevSelected)
        if (selected) {
          newSelectedEmails.add(emailId)
        } else {
          newSelectedEmails.delete(emailId)
        }
        return newSelectedEmails
      })
    },
    []
  )

  const selectAllEmails = useCallback((emails: IGmail[]) => {
    if (emails) {
      setSelectedEmails(new Set(emails.map(mail => mail.id)))
    }
  }, [])

  const deselectAllEmails = useCallback(() => {
    setSelectedEmails(new Set())
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedEmails(new Set())
    setBulkSelectMode(false)
  }, [])

  return {
    bulkSelectMode,
    selectedEmails,
    toggleBulkSelectMode,
    handleEmailSelection,
    selectAllEmails,
    deselectAllEmails,
    clearSelection,
  }
}
