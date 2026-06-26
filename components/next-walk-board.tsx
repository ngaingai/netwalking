import Image from "next/image";
import { format } from "date-fns";
import { ja as jaLocale } from "date-fns/locale";
import { localized, type Locale } from "@/lib/i18n";
import type { Event } from "@/lib/events";

interface NextWalkDict {
  boardLabel: string;
  date: string;
  time: string;
  meetingPoint: string;
  map: string;
}

export function NextWalkBoard({
  event,
  dict,
  locale,
}: {
  event: Event;
  dict: NextWalkDict;
  locale: Locale;
}) {
  const walkNumber = parseInt(event.no, 10);
  const eventDate = new Date(event.date);
  const dateLabel =
    locale === "ja"
      ? format(eventDate, "yyyy年M月d日（E）", { locale: jaLocale })
      : format(eventDate, "EEE, MMMM d, yyyy");

  const rows = [
    { label: dict.date, value: dateLabel },
    { label: dict.time, value: event.time },
    {
      label: dict.meetingPoint,
      value: localized(event, "meetingPoint", locale),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-sign/10 bg-white shadow-md">
      {event.coverImage && (
        <div className="relative h-32 w-full sm:h-40 md:h-44">
          <Image
            src={event.coverImage}
            alt={`${event.series} #${walkNumber}: ${event.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}
      <div className="flex items-center gap-2.5 bg-sign px-4 py-3 md:px-6">
        <span
          aria-hidden="true"
          className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-green"
        />
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
          {dict.boardLabel} · {event.series} #{walkNumber}
        </p>
      </div>
      <div className="flex flex-col gap-5 p-5 md:p-7">
        <p className="font-display-en font-expanded text-3xl font-bold md:text-4xl">
          {event.title}
        </p>
        <dl className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline gap-3">
              <dt className="w-24 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-slate">
                {row.label}
              </dt>
              <dd className="text-sm md:text-base">{row.value}</dd>
            </div>
          ))}
        </dl>
        {event.mapLink && (
          <a
            href={event.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-semibold text-green hover:underline"
          >
            {dict.map} &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
