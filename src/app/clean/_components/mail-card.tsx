import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MailCardProps } from "@/types/gmail"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useDeleteMails } from "../queries"

export function MailCard({
  isSelected = false,
  onSelectionChange,
  showCheckbox = false,
  isDeleting = false,
  ...props
}: MailCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteMutation = useDeleteMails()

  const from = props.payload?.headers?.find(h => h.name === "From")?.value ?? ""
  const subject =
    props.payload?.headers?.find(h => h.name === "Subject")?.value ?? ""
  const date = props.payload?.headers?.find(h => h.name === "Date")?.value ?? ""

  const handleDelete = () => {
    deleteMutation.mutate({ messageIds: [props.id] })
  }

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange?.(checked)
  }

  return (
    <>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Email"
        description={`Are you sure you want to delete this email from "${from}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      <Card
        className={`group relative flex h-48 flex-col justify-between ${
          isDeleting || deleteMutation.isPending
            ? "pointer-events-none opacity-60"
            : ""
        }`}
        suppressHydrationWarning
      >
        {showCheckbox && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="border-2 bg-white"
              disabled={isDeleting || deleteMutation.isPending}
            />
          </div>
        )}

        {(isDeleting || deleteMutation.isPending) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-700"></div>
              Deleting...
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 p-0"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader className={showCheckbox ? "pl-8" : ""}>
          <CardTitle className="truncate text-base font-normal" title={from}>
            {from}
          </CardTitle>
          {subject && (
            <CardDescription className="truncate text-sm font-medium">
              {subject}
            </CardDescription>
          )}
          <CardDescription className="line-clamp-2 text-xs">
            {props.snippet}
          </CardDescription>
        </CardHeader>
        <CardContent className={showCheckbox ? "pl-8" : ""}>
          <div className="flex items-center justify-between">
            <span suppressHydrationWarning className="text-xs text-gray-500">
              {date}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
