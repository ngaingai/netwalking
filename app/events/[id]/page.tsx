import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEvent, getEventImages } from "@/lib/events";
import { formatDate } from "@/lib/utils";
import { EventGallery } from "@/components/event-gallery";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const eventDate = formatDate(event.date);
  const isPastEvent = new Date(event.date) < new Date();

  // Get list of images for this event
  const images = await getEventImages(event.no);
  const coverImage = images[0];

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {event.title}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {!isPastEvent && coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={coverImage.secure_url}
                alt={event.title}
                width={1200}
                height={675}
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none">
            <p>{event.description}</p>
          </div>

          {/* Event Gallery */}
          {images.length > 0 && (
            <div className="pt-4">
              <h2 className="mb-4 text-2xl font-bold">Event Gallery</h2>
              <EventGallery eventId={event.no} images={images} />
            </div>
          )}
        </div>

        <div className="lg:relative">
          <div className="space-y-6 lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-muted-foreground">{eventDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Course</p>
                    <p className="text-muted-foreground">{event.course}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Meeting Point</p>
                    <p className="text-muted-foreground">{event.location}</p>
                    {event.stravaLink && (
                      <Button variant="link" asChild className="h-auto p-0">
                        <Link
                          href={event.stravaLink}
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

                <Separator />

                {!isPastEvent && (
                  <div className="space-y-2">
                    {event.komootLink && (
                      <Button asChild className="w-full">
                        <Link
                          href={event.komootLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View Route on Komoot
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}

                {isPastEvent && (
                  <div className="rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
                    This event has already taken place
                  </div>
                )}
              </CardContent>
            </Card>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">View All Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
