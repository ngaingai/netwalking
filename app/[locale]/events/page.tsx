import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import {
  getPastEvents,
  getUpcomingEvents,
  getTotalKmWalked,
  type Event,
} from "@/lib/events";
import { NwBadge } from "@/components/nw-badge";
import { KanpoStamp } from "@/components/kanpo-stamp";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import fs from "fs";
import path from "path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.events.lineTitle,
  };
}

function coverExists(coverImage: string): boolean {
  return fs.existsSync(
    path.join(process.cwd(), "public", coverImage.replace(/^\//, ""))
  );
}

export default async function EventsArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const pastEvents = getPastEvents();
  const upcomingEvents = getUpcomingEvents();
  const totalKm = getTotalKmWalked();
  const eventPrefix = locale === "ja" ? "" : "/en";
  const displayFont =
    locale === "ja" ? "font-display-jp" : "font-display-en font-expanded";

  const stationRow = (event: Event) => (
    <li key={event.slug} className="relative pl-9 md:pl-12">
      <span
        aria-hidden="true"
        className="absolute left-[9px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[3px] border-green bg-paper"
      />
      <Link
        href={`${eventPrefix}/events/${event.slug}`}
        className="relative flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition hover:translate-x-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green motion-reduce:hover:translate-x-0 md:gap-4 md:p-4"
      >
        <NwBadge series={event.series} no={event.no} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{event.title}</p>
          <p className="truncate text-xs text-slate md:text-sm">
            {event.course}
          </p>
          <p className="mt-0.5 font-mono text-xs tabular-nums text-slate">
            {format(new Date(event.date), "yyyy.MM.dd")}
          </p>
        </div>
        {coverExists(event.coverImage) && (
          <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-md sm:block">
            <Image
              src={event.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <KanpoStamp
          label={dict.events.stamp}
          className="absolute -top-3 right-2 h-11 w-11 text-xs"
        />
      </Link>
    </li>
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className={`text-3xl font-bold md:text-4xl ${displayFont}`}>
        {dict.events.lineTitle}
      </h1>
      <p aria-hidden="true" className="mt-1 text-xs tracking-wide text-slate">
        {dict.events.lineTitleAlt}
      </p>

      {/* Odometer */}
      <div className="mt-8 rounded-b-lg border-t-4 border-green bg-white px-5 py-6 shadow-sm">
        <p className="font-mono text-4xl font-semibold tabular-nums text-green md:text-5xl">
          {dict.events.odometerPrefix}
          {totalKm}
          <span className="text-2xl md:text-3xl">km</span>
        </p>
        <p className="mt-1 text-sm text-slate">{dict.events.odometerLabel}</p>
      </div>

      {pastEvents.length === 0 && upcomingEvents.length === 0 ? (
        <p className="mt-10 text-slate">{dict.events.noEvents}</p>
      ) : (
        <div className="relative mt-10">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[15px] w-0.5 bg-green"
          />
          <ul className="flex flex-col gap-4">
            {/* Upcoming pinned at the top of the line */}
            {upcomingEvents.map((event) => (
              <li key={event.slug} className="relative pl-9 md:pl-12">
                <span
                  aria-hidden="true"
                  className="pulse-dot absolute left-[9px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-green"
                />
                <Link
                  href={`${eventPrefix}/events/${event.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-green/40 bg-green/5 p-3 shadow-sm transition hover:translate-x-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green motion-reduce:hover:translate-x-0 md:gap-4 md:p-4"
                >
                  <NwBadge series={event.series} no={event.no} />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-semibold tracking-widest text-green">
                      {dict.events.nextDeparture}
                    </p>
                    <p className="truncate font-bold">{event.title}</p>
                    <p className="truncate text-xs text-slate md:text-sm">
                      {event.course}
                    </p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-slate">
                      {format(new Date(event.date), "yyyy.MM.dd")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            {pastEvents.map(stationRow)}
          </ul>
        </div>
      )}
    </div>
  );
}
