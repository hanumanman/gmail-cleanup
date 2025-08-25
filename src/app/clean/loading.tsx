import { Loader } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex h-full grow items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}

export default Loading
