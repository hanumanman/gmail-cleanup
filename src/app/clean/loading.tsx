import { Loader } from "lucide-react"

const Loading = () => {
  return (
    // TODO: should have appropriate height
    <div className="h-full flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}

export default Loading
