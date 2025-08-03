import { Loader2 } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full">
      <Loader2 className="animate-spin" />
    </div>
  )
}
