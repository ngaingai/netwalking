import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  UsersIcon,
  LinkedinIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            {event.description.split("\n\n").map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4">
                {paragraph.split("\n").map((line, lIndex) => (
                  <span key={lIndex}>
                    {line}
                    {lIndex < paragraph.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Event Gallery - only show for past events */}
          {isPastEvent && images.length > 0 && (
            <div className="pt-4">
              <h2 className="mb-4 text-2xl font-bold">Event Gallery</h2>
              <EventGallery images={images} />
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
                    <p className="font-medium">Meeting Point</p>
                    <p className="text-muted-foreground">
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
                          View Meeting Point
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Course</p>
                    <p className="text-muted-foreground">{event.course}</p>
                    {event.stravaLink && (
                      <Button variant="link" asChild className="h-auto p-0">
                        <Link
                          href={event.stravaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm"
                        >
                          View Route
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Event Links */}
                <div className="space-y-3">
                  {event.meetuplink && (
                    <div className="flex items-start gap-3">
                      <UsersIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Meetup</p>
                        <Button variant="link" asChild className="h-auto p-0">
                          <Link
                            href={event.meetuplink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm"
                          >
                            View Event on Meetup
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {event.linkedinlink && (
                    <div className="flex items-start gap-3">
                      <LinkedinIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <Button variant="link" asChild className="h-auto p-0">
                          <Link
                            href={event.linkedinlink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm"
                          >
                            View Event on LinkedIn
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

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

                {isPastEvent && event.linkedinReportLink ? (
                  <Button
                    asChild
                    className="w-full"
                    style={{ backgroundColor: "#4cccc3", color: "#fff" }}
                  >
                    <Link
                      href={event.linkedinReportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Event Report
                    </Link>
                  </Button>
                ) : isPastEvent ? (
                  <div className="rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
                    This event has already taken place
                  </div>
                ) : null}
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
