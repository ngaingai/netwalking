import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { getEventBySlug, getAllEvents } from "@/lib/events";
import { LineCta } from "@/components/line-cta";
import { PhotoCarousel } from "@/components/photo-carousel";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const events = getAllEvents();
  const params: { locale: string; slug: string }[] = [];
  for (const event of events) {
    params.push({ locale: "ja", slug: event.slug });
    params.push({ locale: "en", slug: event.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  return {
    title: `#${event.no} ${event.title}`,
    description: `NetWalking #${event.no}: ${event.title} — ${event.course}`,
  };
}

function coverImageExists(eventNo: string): boolean {
  const coverPath = path.join(process.cwd(), "public", "events", `netwalking-${eventNo}.jpg`);
  return fs.existsSync(coverPath);
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const event = getEventBySlug(slug);
  if (!event) notFound();

  const dict = await getDictionary(locale as Locale);
  const backHref = locale === "ja" ? "/events" : "/en/events";
  const hasCover = coverImageExists(event.no);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `NetWalking #${event.no}: ${event.title}`,
    startDate: `${event.date}T${event.time.split("-")[0]}:00+09:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      event.status === "upcoming"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventMovedOnline",
    location: {
      "@type": "Place",
      name: event.meetingPoint,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tokyo",
        addressCountry: "JP",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "NetWalking",
      url: "https://netwalking.net",
    },
    isAccessibleForFree: true,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.events.heading}
      </Link>

      <div className="mx-auto max-w-3xl">
        {/* Cover image */}
        {hasCover ? (
          <div className="mb-8 aspect-[2/1] relative overflow-hidden rounded-2xl">
            <Image
              src={event.coverImage}
              alt={`NetWalking #${event.no}: ${event.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : (
          <div className="mb-8 aspect-[2/1] overflow-hidden rounded-2xl bg-muted" />
        )}

        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#4cccc3]">
          #{event.no}
        </p>
        <h1 className="mb-6 text-3xl font-bold">{event.title}</h1>

        <div className="mb-8 flex flex-col gap-3 rounded-xl border bg-card p-5 text-sm">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#4cccc3]" />
            <span className="font-medium">{dict.nextWalk.date}:</span>{" "}
            {format(new Date(event.date), "MMMM d, yyyy")}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#4cccc3]" />
            {event.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#4cccc3]" />
            <span className="font-medium">{dict.nextWalk.meetingPoint}:</span>{" "}
            {event.meetingPoint}
          </p>
          {event.mapLink && (
            <a
              href={event.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4cccc3] hover:underline"
            >
              {dict.nextWalk.map} &rarr;
            </a>
          )}
        </div>

        {event.status === "upcoming" && (
          <div className="mb-8">
            <LineCta label={dict.nextWalk.cta} size="large" />
          </div>
        )}

        {/* Post-walk write-up */}
        {event.description && (
          <div className="prose prose-gray max-w-none whitespace-pre-line mb-10">
            {event.description}
          </div>
        )}

        {/* Post-walk photos */}
        {event.photos.length > 0 && (
          <div className="mb-10">
            <PhotoCarousel
              photos={event.photos}
              alt={`NetWalking #${event.no}: ${event.title}`}
            />
          </div>
        )}

        {/* External links */}
        {(event.meetupLink || event.linkedinLink || event.linkedinReportLink) && (
          <div className="flex flex-wrap gap-3 text-sm">
            {event.meetupLink && (
              <a href={event.meetupLink} target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                Meetup
              </a>
            )}
            {event.linkedinLink && (
              <a href={event.linkedinLink} target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn Event
              </a>
            )}
            {event.linkedinReportLink && (
              <a href={event.linkedinReportLink} target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn Report
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
