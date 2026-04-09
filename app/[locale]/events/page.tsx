import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { getPastEvents } from "@/lib/events";
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
    title: dict.events.heading,
  };
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
  const eventPrefix = locale === "ja" ? "" : "/en";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-10 text-3xl font-bold">{dict.events.heading}</h1>

      {pastEvents.length === 0 ? (
        <p className="text-muted-foreground">{dict.events.noEvents}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <Link
              key={event.slug}
              href={`${eventPrefix}/events/${event.slug}`}
              className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-[3/2] relative bg-muted/40 border-b border-border/30 overflow-hidden">
                {fs.existsSync(path.join(process.cwd(), "public", "events", `${event.slug}.jpg`)) && (
                  <Image
                    src={event.coverImage}
                    alt={`${event.series} #${event.no}: ${event.title}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#4cccc3]">
                  {event.series} #{event.no}
                </p>
                <h2 className="mb-2 text-lg font-semibold group-hover:text-[#4cccc3] transition-colors">
                  {event.title}
                </h2>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(event.date), "MMMM d, yyyy")}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.course}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
