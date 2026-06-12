import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getDictionary, isValidLocale, localized, type Locale } from "@/lib/i18n";
import { getEventBySlug, getAllEvents, getAdjacentEvents, type Event } from "@/lib/events";
import { HankoCta } from "@/components/hanko-cta";
import { NwBadge } from "@/components/nw-badge";
import { KanpoStamp } from "@/components/kanpo-stamp";
import { BrandedText } from "@/components/branded-text";
import { ExternalLinkButton } from "@/components/external-link-button";
import { SectionHeading } from "@/components/station";
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
    title: `${event.series} #${event.no} ${event.title}`,
    description: `${event.series} #${event.no}: ${event.title} (${event.course})`,
  };
}

function coverImageExists(coverImage: string): boolean {
  const coverPath = path.join(process.cwd(), "public", coverImage.replace(/^\//, ""));
  return fs.existsSync(coverPath);
}

function TransferCard({
  event,
  label,
  direction,
  href,
}: {
  event: Event;
  label: string;
  direction: "prev" | "next";
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
        direction === "next" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <NwBadge series={event.series} no={event.no} />
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold tracking-widest text-slate">
          {direction === "prev" ? `← ${label}` : `${label} →`}
        </p>
        <p className="truncate text-sm font-bold">{event.title}</p>
      </div>
    </Link>
  );
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
  const eventPrefix = locale === "ja" ? "" : "/en";
  const hasCover = coverImageExists(event.coverImage);
  const isPast = event.status === "past";
  const { prev, next } = getAdjacentEvents(event);

  const titlePrimary =
    locale === "ja" ? event.titleJp || event.title : event.title;
  const titleAlt = locale === "ja" ? event.title : event.titleJp;
  const showTitleAlt = Boolean(titleAlt) && titleAlt !== titlePrimary;
  const displayFont =
    locale === "ja" ? "font-display-jp" : "font-display-en font-expanded";

  const recordEntries: React.ReactNode[] = [];
  if (event.attendees > 0) {
    recordEntries.push(
      <span key="attendees">
        {event.attendees}
        {locale === "ja" ? "" : " "}
        {dict.events.attendeesSuffix}
      </span>
    );
  }
  for (const [key, href] of [
    ["LinkedIn", event.linkedinReportLink],
    ["Strava", event.stravaLink],
    ["Komoot", event.komootLink],
  ] as const) {
    if (href) {
      recordEntries.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono !text-green hover:underline"
        >
          {key} &rarr;
        </a>
      );
    }
  }

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.series} #${event.no}: ${event.title}`,
    startDate: `${event.date}T${event.time.split("-")[0]}:00+09:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
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

      <div className="mx-auto max-w-3xl">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-1.5 text-sm !text-slate hover:!text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.events.lineTitle}
        </Link>

        {/* Hero strip: the line passes through the station */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-[6px] border-green pb-6">
          <div className="flex items-center gap-4">
            <NwBadge series={event.series} no={event.no} size="large" />
            <div>
              <h1 className={`text-3xl font-bold md:text-4xl ${displayFont}`}>
                {titlePrimary}
              </h1>
              {showTitleAlt && (
                <p
                  aria-hidden="true"
                  className="mt-1 text-xs tracking-wide text-slate"
                >
                  {titleAlt}
                </p>
              )}
            </div>
          </div>
          <div className="font-mono text-sm tabular-nums text-slate md:text-right">
            <p>{format(new Date(event.date), "yyyy.MM.dd")}</p>
            <p>{event.time}</p>
          </div>
        </div>

        {/* Cover with GPS chip (chip renders only when route data exists) */}
        {hasCover && (
          <div className="relative mt-8 overflow-hidden rounded-xl">
            <div className="relative aspect-[2/1]">
              <Image
                src={event.coverImage}
                alt={`${event.series} #${event.no}: ${event.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            {event.routeImage && (
              <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-md bg-sign/90 px-2.5 py-1.5">
                <Image
                  src={event.routeImage}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span className="font-mono text-xs font-semibold text-white">
                  {event.distanceKm ?? 5}km
                </span>
              </div>
            )}
          </div>
        )}

        {/* Info board */}
        <div className="relative mt-8 rounded-xl bg-sign shadow-md">
          <dl className="flex flex-col">
            <div className="flex items-baseline gap-4 border-b border-white/10 px-5 py-3.5 md:px-6">
              <dt className="w-14 shrink-0 font-mono text-xs font-semibold tracking-wider text-green md:w-16">
                {dict.events.course}
              </dt>
              <dd className="text-sm text-white md:text-base">{event.course}</dd>
            </div>
            <div
              className={`flex items-baseline gap-4 px-5 py-3.5 md:px-6 ${
                recordEntries.length > 0 ? "border-b border-white/10" : ""
              }`}
            >
              <dt className="w-14 shrink-0 font-mono text-xs font-semibold tracking-wider text-green md:w-16">
                {dict.events.meet}
              </dt>
              <dd className="text-sm text-white md:text-base">
                {localized(event, "meetingPoint", locale as Locale)}
                {event.mapLink && (
                  <>
                    {" "}
                    <a
                      href={event.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap font-mono text-xs font-semibold !text-green hover:underline"
                    >
                      {dict.nextWalk.map} &rarr;
                    </a>
                  </>
                )}
              </dd>
            </div>
            {recordEntries.length > 0 && (
              <div className="flex items-baseline gap-4 px-5 py-3.5 md:px-6">
                <dt className="w-14 shrink-0 font-mono text-xs font-semibold tracking-wider text-green md:w-16">
                  {dict.events.record}
                </dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white md:text-base">
                  {recordEntries}
                </dd>
              </div>
            )}
          </dl>
          {isPast && (
            <KanpoStamp
              label={dict.events.stamp}
              className="absolute -right-3 -top-4 h-14 w-14 text-base"
            />
          )}
        </div>

        {/* Upcoming: join links instead of a stamp */}
        {!isPast && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <HankoCta label={dict.nextWalk.cta} size="large" />
            {event.meetupLink && (
              <ExternalLinkButton href={event.meetupLink}>Meetup</ExternalLinkButton>
            )}
            {event.linkedinLink && (
              <ExternalLinkButton href={event.linkedinLink}>LinkedIn Event</ExternalLinkButton>
            )}
          </div>
        )}

        {/* Walk report */}
        {event.description && (
          <div className="mt-10">
            <SectionHeading
              text={dict.events.walkReport}
              alt={dict.events.walkReportAlt}
              locale={locale}
            />
            <div className="whitespace-pre-line border-l-4 border-green pl-5 leading-relaxed md:pl-6">
              <BrandedText text={event.description} />
            </div>
          </div>
        )}

        {/* Photo grid */}
        {event.photos.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
            {event.photos.map((photo) => (
              <div
                key={photo}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={photo}
                  alt={`${event.series} #${event.no}: ${event.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 256px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Station transfers */}
        {(prev || next) && (
          <div className="mt-12 grid gap-3 sm:grid-cols-2 md:gap-4">
            {prev ? (
              <TransferCard
                event={prev}
                label={dict.events.prevStation}
                direction="prev"
                href={`${eventPrefix}/events/${prev.slug}`}
              />
            ) : (
              <div className="hidden sm:block" />
            )}
            {next && (
              <TransferCard
                event={next}
                label={dict.events.nextStation}
                direction="next"
                href={`${eventPrefix}/events/${next.slug}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
