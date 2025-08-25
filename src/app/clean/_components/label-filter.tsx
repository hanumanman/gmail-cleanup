"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { LabelFilterProps } from "@/types/gmail"
import { ChevronDownIcon, X } from "lucide-react"
import { useState } from "react"

export function LabelFilter({
  labels,
  labelsStatus,
  onLabelsSelect,
  appliedLabels = [],
  inverse = false,
  onInverseToggle,
}: LabelFilterProps) {
  const [pendingLabels, setPendingLabels] = useState<Set<string>>(
    new Set(appliedLabels)
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleLabelToggle = (labelId: string) => {
    const newPendingLabels = new Set(pendingLabels)
    if (newPendingLabels.has(labelId)) {
      newPendingLabels.delete(labelId)
    } else {
      newPendingLabels.add(labelId)
    }
    setPendingLabels(newPendingLabels)
  }

  const clearAllLabels = () => {
    setPendingLabels(new Set())
  }

  const applyFilters = () => {
    onLabelsSelect(Array.from(pendingLabels))
    setIsOpen(false)
  }

  const hasChanges = () => {
    const appliedSet = new Set(appliedLabels)
    if (appliedSet.size !== pendingLabels.size) return true
    return Array.from(pendingLabels).some(id => !appliedSet.has(id))
  }

  const getAppliedLabelNames = () => {
    if (appliedLabels.length === 0) return "All Labels"
    const appliedLabelNames = appliedLabels
      .map(id => labels?.find(label => label.id === id)?.name)
      .filter(Boolean)

    if (appliedLabelNames.length === 1) {
      return appliedLabelNames[0]
    }
    return `${appliedLabelNames.length} labels selected`
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3">
        {/* Inverse Toggle */}
        {onInverseToggle && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="inverse-filter"
              checked={inverse}
              onCheckedChange={onInverseToggle}
            />
            <label
              htmlFor="inverse-filter"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show emails WITHOUT the selected labels (inverse filter)
            </label>
          </div>
        )}

        <div className="flex items-center gap-2">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[200px] justify-between"
              >
                {getAppliedLabelNames()}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]">
              <DropdownMenuLabel className="flex items-center justify-between">
                Filter by Labels
                {pendingLabels.size > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      clearAllLabels()
                    }}
                    className="h-auto p-1 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {labelsStatus === "pending" ? (
                // Show skeleton items when loading
                <>
                  <div className="px-2 py-1.5">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="px-2 py-1.5">
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="px-2 py-1.5">
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </>
              ) : labelsStatus === "error" ? (
                // Show error message when labels fail to load
                <div className="text-muted-foreground px-2 py-3 text-center text-sm">
                  Unable to load labels. Please try refreshing the page.
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto">
                  {labels?.map(label => (
                    <DropdownMenuItem
                      key={label.id}
                      className="cursor-pointer"
                      onSelect={e => {
                        e.preventDefault()
                        handleLabelToggle(label.id)
                      }}
                    >
                      <Checkbox
                        checked={pendingLabels.has(label.id)}
                        onCheckedChange={() => handleLabelToggle(label.id)}
                        className="mr-2"
                      />
                      <span className="truncate">{label.name}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              {/* Apply Filter Button */}
              <div className="border-t p-2">
                <Button
                  onClick={applyFilters}
                  disabled={!hasChanges()}
                  className="w-full"
                  size="sm"
                >
                  Apply Filter
                  {pendingLabels.size > 0 && ` (${pendingLabels.size})`}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Applied labels as chips */}
          {appliedLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {appliedLabels.map(labelId => {
                const label = labels?.find(l => l.id === labelId)
                return label ? (
                  <div
                    key={labelId}
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  >
                    <span className="max-w-[100px] truncate">{label.name}</span>
                    <button
                      onClick={() => {
                        const newAppliedLabels = appliedLabels.filter(
                          id => id !== labelId
                        )
                        onLabelsSelect(newAppliedLabels)
                        setPendingLabels(new Set(newAppliedLabels))
                      }}
                      className="hover:bg-primary/20 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
