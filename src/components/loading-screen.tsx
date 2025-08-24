import { Loader2 } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="flex grow justify-center items-center w-full">
      <Loader2 className="animate-spin" />
    </div>
  )
}
