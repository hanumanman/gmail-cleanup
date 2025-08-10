import { Loader } from "lucide-react"

const Loading = () => {
  return (
    <div className="h-full grow flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}

export default Loading
