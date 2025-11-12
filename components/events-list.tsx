import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Event, getEventImages } from "@/lib/events";

interface EventsListProps {
  events: Event[];
}

export async function EventsList({ events }: EventsListProps) {
  // Get images for all events in parallel
  const eventsWithImages = await Promise.all(
    events.map(async (event) => {
      const images = await getEventImages(event.no);
      return {
        ...event,
        coverImage: images[0]?.secure_url,
      };
    })
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventsWithImages.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <p className="text-sm text-muted-foreground">
                    No image available
                  </p>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="font-mono text-[#4cccc3]">#{event.no}</span>
                {event.title}
              </CardTitle>
              <CardDescription>{event.course}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date)}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
