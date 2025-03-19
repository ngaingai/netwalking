import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event, getEventImages } from "@/lib/events";
import { formatDate, formatTime } from "@/lib/utils";

interface FeaturedEventProps {
  event: Event;
}

export async function FeaturedEvent({ event }: FeaturedEventProps) {
  const images = await getEventImages(event.no);
  const coverImage = images[0];
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <Card className="overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        {coverImage ? (
          <Link href={`/events/${event.id}`}>
            <Image
              src={coverImage.secure_url}
              alt={event.title}
              width={1200}
              height={675}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              priority
            />
          </Link>
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">No image available</p>
          </div>
        )}
        {/* Event Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPastEvent
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {isPastEvent ? "Past Event" : "Upcoming"}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono">#{event.no}</span>
          {event.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {event.course}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-muted-foreground">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-muted-foreground">{formatTime(event.time)}</p>
            </div>
          </div>
        </div>

        {/* Meeting Point */}
        <div className="flex items-start gap-3 border-t pt-4">
          <MapPinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Meeting Point</p>
            <p className="text-muted-foreground">{event.meetingPoint}</p>
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

        {/* Action Button */}
        <Button asChild className="w-full mt-2">
          <Link href={`/events/${event.id}`}>Event RSVP Info</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
