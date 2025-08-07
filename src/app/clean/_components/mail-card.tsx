import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { IGmail } from "../types"

export const MailCard = (props: IGmail) => {
  const from = props.payload.headers.find(h => h.name === "From")?.value ?? ""
  return (
    <Card className="flex h-48 flex-col justify-between">
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
            <Checkbox />
            <span className="text-sm text-gray-500">
              {new Date(props.internalDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
