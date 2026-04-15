import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock } from "lucide-react";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { getAllEvents, getLatestUpcomingEvent } from "@/lib/events";
import { LineCta } from "@/components/line-cta";
import { BrandedText } from "@/components/branded-text";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const upcomingEvent = getLatestUpcomingEvent();
  const allEvents = getAllEvents();
  const pastCount = allEvents.filter((e) => e.status === "past").length;
  const eventsHref = locale === "ja" ? "/events" : "/en/events";

  return (
    <div className="flex flex-col">
      {/* Section 1: Hero */}
      <section className="flex flex-col items-center gap-6 px-4 pt-12 pb-16 text-center">
        <Image
          src="/images/NetWalking-Logo.jpg"
          alt="NetWalking Logo"
          width={280}
          height={187}
          className="w-56 md:w-64 h-auto"
          priority
        />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {locale === "ja" ? (
            <>
              <span className="text-[#4cccc3]">一歩ずつ</span>、つながりを強く。
            </>
          ) : (
            <>
              Building stronger relationships,{" "}
              <span className="text-[#4cccc3]">step by step</span>.
            </>
          )}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {dict.hero.subtitle}
        </p>
        <LineCta label={dict.hero.cta} size="large" />
      </section>

      {/* Section 2: Next Walk (conditional, shown right after hero) */}
      {upcomingEvent && (
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-semibold">
              {dict.nextWalk.heading}
            </h2>
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="aspect-[2/1] relative bg-muted/40">
                <Image
                  src={upcomingEvent.coverImage}
                  alt={`${upcomingEvent.series} #${upcomingEvent.no}: ${upcomingEvent.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#4cccc3]">
                    {upcomingEvent.series} #{upcomingEvent.no}
                  </p>
                  <h3 className="text-xl font-semibold">{upcomingEvent.title}</h3>
                </div>
                {(locale === "ja" ? upcomingEvent.teaserJp : upcomingEvent.teaser) && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <BrandedText text={locale === "ja" ? upcomingEvent.teaserJp : upcomingEvent.teaser} />
                  </p>
                )}
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#4cccc3]" />
                    {format(new Date(upcomingEvent.date), "MMMM d, yyyy")}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#4cccc3]" />
                    {upcomingEvent.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#4cccc3]" />
                    {upcomingEvent.meetingPoint}
                  </p>
                  {upcomingEvent.mapLink && (
                    <a
                      href={upcomingEvent.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4cccc3] hover:underline"
                    >
                      {dict.nextWalk.map} &rarr;
                    </a>
                  )}
                </div>
                <div className="flex justify-center pt-2">
                  <LineCta label={dict.nextWalk.cta} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: What This Is */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-2xl">
          <h2 className="mb-6 text-2xl font-semibold"><BrandedText text={dict.whatThisIs.heading} /></h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            <BrandedText text={dict.whatThisIs.pitch} />
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            {dict.whatThisIs.dadAngle}
          </p>
        </div>
      </section>

      {/* Section 3: Social Proof Strip */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-4xl font-bold text-[#4cccc3]">{pastCount}+</p>
              <p className="text-muted-foreground">{dict.socialProof.walkCount}</p>
            </div>

            {/* Community photos from recent walks */}
            <div className="flex gap-3">
              {[19, 18, 17, 16].map((n) => (
                <div
                  key={n}
                  className="relative h-20 w-20 overflow-hidden rounded-xl md:h-24 md:w-24"
                >
                  <Image
                    src={`/events/netwalking-${String(n).padStart(3, "0")}.jpg`}
                    alt={`NetWalking #${n}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ))}
            </div>

            <Link
              href={eventsHref}
              className="text-sm font-medium text-[#4cccc3] hover:underline"
            >
              {dict.socialProof.seeAll} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-semibold">
            {dict.howItWorks.heading}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: "1", title: dict.howItWorks.step1Title, desc: dict.howItWorks.step1Desc },
              { num: "2", title: dict.howItWorks.step2Title, desc: dict.howItWorks.step2Desc },
              { num: "3", title: dict.howItWorks.step3Title, desc: dict.howItWorks.step3Desc },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4cccc3] text-lg font-bold text-white">
                  {step.num}
                </span>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
