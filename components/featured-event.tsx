import { CalendarIcon, MapPinIcon } from "lucide-react";
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
import { formatDate } from "@/lib/utils";

interface FeaturedEventProps {
  event: Event;
}

export async function FeaturedEvent({ event }: FeaturedEventProps) {
  const images = await getEventImages(event.no);
  const coverImage = images[0];

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.secure_url}
            alt={event.title}
            width={1200}
            height={675}
            className="object-cover w-full h-full"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">No image available</p>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-muted-foreground">#{event.no}</span>
          {event.title}
        </CardTitle>
        <CardDescription>{event.course}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <CalendarIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Date & Time</p>
            <p className="text-muted-foreground">{formatDate(event.date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Meeting Point</p>
            <p className="text-muted-foreground">{event.location}</p>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
