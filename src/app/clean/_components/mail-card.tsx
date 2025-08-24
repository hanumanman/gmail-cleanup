import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IGmail } from "../types"

export function MailCard(props: IGmail) {
  const from = props.payload.headers.find(h => h.name === "From")?.value ?? ""
  const date = props.payload.headers.find(h => h.name === "Date")?.value ?? ""

  return (
    <Card
      className="flex h-48 flex-col justify-between"
      suppressHydrationWarning
    >
      <CardHeader>
        <CardTitle className="truncate text-base font-normal" title={from}>
          {from}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {props.snippet}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {/* <Checkbox /> */}
            <span suppressHydrationWarning className="text-sm text-gray-500">
              {date}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
