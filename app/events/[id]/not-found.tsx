import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">Event Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Return to Events</Link>
      </Button>
    </div>
  )
}

