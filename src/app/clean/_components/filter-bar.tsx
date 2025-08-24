"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { IGmail } from "../types"

interface Label {
  id: string
  name: string
}

interface FilterBarProps {
  onFilterChange: (emails: IGmail[]) => void
  onError: (response: Response) => Promise<boolean>
}

export function FilterBar({ onFilterChange, onError }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("/api/gmail/labels")
        if (!response.ok) {
          const isAuthError = await onError(response)
          if (isAuthError) return
        }
        const data = await response.json()
        setLabels(data.labels || [])
      } catch (error) {
        console.error("Error fetching labels:", error)
      }
    }

    fetchLabels()
  }, [onError])

  // Get current label from URL
  useEffect(() => {
    const fetchEmails = async (labelId: string | null) => {
      setLoading(true)
      try {
        const url = new URL("/api/gmail/messages", window.location.origin)
        if (labelId && labelId !== "all") {
          url.searchParams.set("labelId", labelId)
        }

        const response = await fetch(url.toString())
        if (!response.ok) {
          const isAuthError = await onError(response)
          if (isAuthError) return
        }
        const data = await response.json()
        onFilterChange(data.messages || [])
      } catch (error) {
        console.error("Error fetching emails:", error)
        onFilterChange([])
      } finally {
        setLoading(false)
      }
    }

    const labelId = searchParams.get("label") || "all"
    fetchEmails(labelId)
  }, [searchParams, onFilterChange, onError])

  const handleLabelChange = (labelId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (labelId === "all") {
      params.delete("label")
      params.delete("page") // Reset pagination when changing label
    } else {
      params.set("label", labelId)
      params.delete("page") // Reset pagination when changing label
    }
    router.replace(`/clean${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    })
  }

  const getSelectedLabelName = () => {
    const currentLabel = searchParams.get("label") || "all"
    if (currentLabel === "all") return "All Labels"
    return labels.find(l => l.id === currentLabel)?.name || "Select a label"
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
          {!loading && <Badge>{getSelectedLabelName()}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
