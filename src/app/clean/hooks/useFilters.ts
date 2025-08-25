import { FilterState } from "@/types/gmail"
import { useCallback, useState } from "react"

export function useFilters() {
  const [filterState, setFilterState] = useState<FilterState>()

  const handleLabelsSelect = useCallback((labelIds: string[]) => {
    setFilterState(prev => ({
      ...prev,
      labels: labelIds.length > 0 ? labelIds : undefined,
    }))
  }, [])

  const handleInverseToggle = useCallback((inverse: boolean) => {
    setFilterState(prev => ({
      ...prev,
      inverse,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilterState(undefined)
  }, [])

  return {
    filterState,
    handleLabelsSelect,
    handleInverseToggle,
    resetFilters,
  }
}
