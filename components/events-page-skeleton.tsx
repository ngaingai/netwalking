import { Skeleton } from "@/components/ui/skeleton"

export function EventsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-8 h-10 w-48" />

      <div className="mb-12">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="overflow-hidden rounded-lg border">
          <div className="md:grid md:grid-cols-2">
            <Skeleton className="h-64 w-full md:h-80" />
            <div className="p-6">
              <Skeleton className="mb-4 h-8 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="mb-6 h-4 w-1/2" />
              <Skeleton className="mb-4 h-24 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="mb-4 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="mb-4 h-4 w-1/2" />
                <Skeleton className="mb-6 h-16 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

