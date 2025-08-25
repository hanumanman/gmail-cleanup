"use client"

import { IGmail } from "@/types/gmail"
import { MailCard } from "./mail-card"

interface EmailGridProps {
  emails: IGmail[]
  bulkSelectMode: boolean
  selectedEmails: Set<string>
  isDeleting: boolean
  onEmailSelection: (emailId: string, selected: boolean) => void
}

export function EmailGrid({
  emails,
  bulkSelectMode,
  selectedEmails,
  isDeleting,
  onEmailSelection,
}: EmailGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {emails.map(mail => (
        <MailCard
          key={mail.id}
          {...mail}
          showCheckbox={bulkSelectMode}
          isSelected={selectedEmails.has(mail.id)}
          onSelectionChange={selected => onEmailSelection(mail.id, selected)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}
