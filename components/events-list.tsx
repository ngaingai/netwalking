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
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";

interface EventsListProps {
  events: Event[];
}

export async function EventsList({ events }: EventsListProps) {
  // Get images sequentially to avoid rate limits
  const eventsWithImages = [];
  for (const event of events) {
    const images = await getEventImages(event.no);
    eventsWithImages.push({
      ...event,
      coverImage: images[0]?.secure_url,
    });
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventsWithImages.map((event) => (
        <Card
          key={event.id}
          className="h-full transition-colors hover:bg-muted/50"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            {event.coverImage ? (
              <Link href={`/events/${event.id}`}>
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  width={600}
                  height={338}
                  className="object-cover w-full h-full"
                />
              </Link>
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
              <span className="text-muted-foreground">#{event.no}</span>
              <Link href={`/events/${event.id}`}>{event.title}</Link>
            </CardTitle>
            <CardDescription>{event.course}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date)}
              </p>
              <div className="flex items-start gap-2">
                <MapPinIcon className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {event.meetingPoint}
                  </p>
                  {event.maplink && (
                    <Button variant="link" asChild className="h-auto p-0">
                      <Link
                        href={event.maplink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm"
                      >
                        View on Map
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
