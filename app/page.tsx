import { Suspense } from "react"
import Homepage from "@/components/Homepage"

function Page() {
  return (
    <div>
      <Suspense fallback={<div className="p-4">Loading listings...</div>}>
        <Homepage />
      </Suspense>
    </div>
  )
}

export default Page
