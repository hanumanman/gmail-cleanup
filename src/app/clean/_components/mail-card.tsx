import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { IGmail } from "../types"

// Helper function to parse sender info
const parseSender = (from: string) => {
  const senderName = from.includes("<")
    ? from.split("<")[0].trim().replace(/"/g, "")
    : from
  const senderEmail = from.includes("<") ? from.match(/<(.+)>/)?.[1] : from
  return { senderName, senderEmail }
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

export function MailCard(props: IGmail) {
  const from = props.payload.headers.find(h => h.name === "From")?.value ?? ""
  const date = props.payload.headers.find(h => h.name === "Date")?.value ?? ""
  const { senderName, senderEmail } = parseSender(from)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none" />

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle
              className="text-sm font-semibold truncate mb-1"
              title={senderName}
            >
              {senderName}
            </CardTitle>
            {senderEmail && senderEmail !== senderName && (
              <p className="text-xs truncate" title={senderEmail}>
                {senderEmail}
              </p>
            )}
          </div>
          <time className="text-xs font-medium whitespace-nowrap">
            {formatDate(date)}
          </time>
        </div>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed mt-3">
          {props.snippet}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 relative">
        {props.labels && props.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {props.labels.map((label, index) => (
              <Badge key={index} variant="default">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  )
}
