import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { getLatestUpcomingEvent, getPastEvents } from "@/lib/events";
import { HankoCta } from "@/components/hanko-cta";
import { RouteRail } from "@/components/route-rail";
import { Station, SectionHeading } from "@/components/station";
import { DepartureBoard } from "@/components/departure-board";
import { NextWalkBoard } from "@/components/next-walk-board";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const upcomingEvent = getLatestUpcomingEvent();
  const pastEvents = getPastEvents();
  const pastCount = pastEvents.length;
  const recentPast = pastEvents.slice(0, 4);
  const eventsHref = locale === "ja" ? "/events" : "/en/events";
  const displayFont =
    locale === "ja" ? "font-display-jp" : "font-display-en font-expanded";

  return (
    <div className="relative overflow-x-clip">
      <RouteRail />

      {/* 0.0km 出発 Hero */}
      <Station km="0.0km" label={dict.hero.stationLabel} id="top" className="scroll-mt-20">
        <div className="flex flex-col items-start gap-6 pt-6 md:pt-12">
          <h1
            className={`text-4xl font-black leading-tight md:text-6xl ${displayFont}`}
          >
            {dict.hero.h1}
          </h1>
          <p className="text-lg leading-relaxed text-slate md:text-xl">
            {dict.hero.subLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="text-sm text-slate">{dict.hero.small}</p>
          <HankoCta label={dict.hero.cta} size="large" />
        </div>
      </Station>

      {/* 0.8km Manifesto departure board */}
      <Station km="0.8km" id="manifesto" className="scroll-mt-20">
        <SectionHeading
          text={dict.manifesto.heading}
          alt={dict.manifesto.headingAlt}
          locale={locale}
        />
        <DepartureBoard
          cancelledRows={dict.manifesto.cancelledRows}
          onTimeRow={dict.manifesto.onTimeRow}
          cancelledLabel={dict.manifesto.cancelledLabel}
          cancelledLabelAlt={dict.manifesto.cancelledLabelAlt}
          onTimeLabel={dict.manifesto.onTimeLabel}
          onTimeLabelAlt={dict.manifesto.onTimeLabelAlt}
        />
        <p className="mt-4 text-slate">{dict.manifesto.below}</p>
      </Station>

      {/* 1.6km Spec grid */}
      <Station km="1.6km" id="stats" className="scroll-mt-20">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {dict.specs.tiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-b-lg border-t-4 border-green bg-white px-4 py-5 shadow-sm"
            >
              <p className="font-mono text-2xl font-semibold tabular-nums md:text-3xl">
                {tile.value}
              </p>
              <p className="mt-1 text-xs text-slate md:text-sm">{tile.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate">
          {dict.specs.note}
        </p>
      </Station>

      {/* 2.4km Language */}
      <Station km="2.4km" id="language" className="scroll-mt-20">
        <SectionHeading
          text={dict.language.heading}
          alt={dict.language.headingAlt}
          locale={locale}
        />
        <div className="border-l-4 border-green pl-5 md:pl-6">
          {dict.language.lines.map((line) => (
            <p key={line} className="mb-3 leading-relaxed last:mb-0">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-7">
          <HankoCta label={dict.language.cta} />
        </div>
      </Station>

      {/* 3.2km Next walk (station collapses when nothing is scheduled) */}
      {upcomingEvent && (
        <Station km="3.2km" id="next-walk" className="scroll-mt-20">
          <NextWalkBoard
            event={upcomingEvent}
            dict={dict.nextWalk}
            locale={locale as Locale}
          />
        </Station>
      )}

      {/* 4.0km How it works */}
      <Station km="4.0km" id="how-it-works" className="scroll-mt-20">
        <SectionHeading
          text={dict.howItWorks.heading}
          alt={dict.howItWorks.headingAlt}
          locale={locale}
        />
        <ol className="flex flex-col gap-7">
          {dict.howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 font-mono text-lg font-semibold text-green"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Station>

      {/* 4.6km Why + proof */}
      <Station km="4.6km" id="why" className="scroll-mt-20">
        <SectionHeading
          text={dict.why.heading}
          alt={dict.why.headingAlt}
          locale={locale}
        />
        {dict.why.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className="font-bold text-slate">{dict.why.sig}</p>

        <div className="mt-12">
          <p className="text-2xl font-bold md:text-3xl">
            <span className="font-mono text-4xl tabular-nums text-green md:text-5xl">
              {pastCount}
            </span>
            {locale === "ja" ? "" : " "}
            {dict.proof.countSuffix}
          </p>
          <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
            {recentPast.map((event) => (
              <div
                key={event.slug}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={event.coverImage}
                  alt={`${event.series} #${event.no}: ${event.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 160px"
                />
              </div>
            ))}
          </div>
          <Link
            href={eventsHref}
            className="mt-5 inline-block font-mono text-sm font-semibold text-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            {dict.proof.archiveLink} &rarr;
          </Link>
        </div>
      </Station>
    </div>
  );
}
