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
import { formatDate } from "@/lib/utils";
import { Event, getEventImagePath } from "@/lib/events";

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={getEventImagePath(event.no)}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
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
        <Button asChild className="mt-4 w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
