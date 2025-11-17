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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEvent, getEventImages } from "@/lib/events";
import { formatDate } from "@/lib/utils";
import { EventGallery } from "@/components/event-gallery";

const SITE_URL = "https://netwalking.net";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found | NetWalking",
      description: "The NetWalking event you’re looking for could not be found.",
      alternates: {
        canonical: `${SITE_URL}/events/${id}`,
      },
    };
  }

  const firstSentence = event.description
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  const description = firstSentence
    ? firstSentence.length > 200
      ? `${firstSentence.slice(0, 197)}…`
      : firstSentence
    : `Join NetWalking #${event.no} at ${event.course} on ${formatDate(event.date)}.`;

  const coverImageUrl =
    (await getEventImages(event.no))[0]?.secure_url ?? `${SITE_URL}/images/NetWalking-Logo.jpg`;

  return {
    title: `${event.title} | NetWalking #${event.no}`,
    description,
    alternates: {
      canonical: `${SITE_URL}/events/${event.id}`,
    },
    openGraph: {
      title: `${event.title} | NetWalking #${event.no}`,
      description,
      type: "website",
      url: `${SITE_URL}/events/${event.id}`,
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 675,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | NetWalking #${event.no}`,
      description,
      images: [coverImageUrl],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const eventDate = formatDate(event.date);
  const isPastEvent = new Date(event.date) < new Date();

  const images = await getEventImages(event.no);
  const coverImage = images[0];

  const [startTimeRaw] = event.time.split(/[^0-9:]/);
  const startTime = startTimeRaw || "12:00";
  const eventStartDate = new Date(`${event.date}T${startTime}:00+09:00`).toISOString();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: eventStartDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: isPastEvent
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.course,
      address: event.meetingPoint,
    },
    image: coverImage?.secure_url
      ? [coverImage.secure_url]
      : [`${SITE_URL}/images/NetWalking-Logo.jpg`],
    organizer: {
      "@type": "Organization",
      name: "NetWalking",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/events/${event.id}`,
    },
    sameAs: [event.meetuplink, event.linkedinlink].filter(Boolean),
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>
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
                    <p className="text-muted-foreground">{event.meetingPoint}</p>
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
