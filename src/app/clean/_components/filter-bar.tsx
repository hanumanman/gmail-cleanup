"use client"

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import type { IGmail } from "../types"

interface Label {
  id: string
  name: string
}

interface FilterBarProps {
  onEmailsChangeAction: (emails: IGmail[], labelId?: string) => void
}

export function FilterBar({ onEmailsChangeAction }: FilterBarProps) {
  const [labels, setLabels] = useState<Label[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Fetch labels on component mount
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("/api/gmail/labels")
        if (response.ok) {
          const data = await response.json()
          setLabels(data.labels || [])
        }
      } catch (error) {
        console.error("Error fetching labels:", error)
      }
    }

    fetchLabels()
  }, [])

  // Fetch emails when label is selected
  const handleLabelChange = async (labelId: string) => {
    setSelectedLabel(labelId)
    setLoading(true)

    try {
      if (labelId === "all") {
        // Fetch all emails
        const response = await fetch("/api/gmail/messages")
        if (response.ok) {
          const data = await response.json()
          onEmailsChangeAction(data.messages || [], labelId)
        }
      } else {
        // Fetch emails for specific label
        const response = await fetch(`/api/gmail/messages?labelId=${labelId}`)
        if (response.ok) {
          const data = await response.json()
          onEmailsChangeAction(data.messages || [], labelId)
        }
      }
    } catch (error) {
      console.error("Error fetching emails:", error)
      onEmailsChangeAction([], labelId)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedLabelName = () => {
    if (selectedLabel === "all") return "All Labels"
    return labels.find(l => l.id === selectedLabel)?.name || "Select a label"
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Label:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 justify-between">
                  {getSelectedLabelName()}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => handleLabelChange("all")}>
                  All Labels
                </DropdownMenuItem>
                {labels.map(label => (
                  <DropdownMenuItem
                    key={label.id}
                    onClick={() => handleLabelChange(label.id)}
                  >
                    {label.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {loading && <Badge>Loading...</Badge>}
          {selectedLabel && !loading && (
            <Badge>
              {selectedLabel === "all"
                ? "All Labels"
                : labels.find(l => l.id === selectedLabel)?.name ||
                  selectedLabel}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
