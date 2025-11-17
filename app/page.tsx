import { Suspense } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EventsList } from "@/components/events-list";
import { FeaturedEvent } from "@/components/featured-event";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { EventsPageSkeleton } from "@/components/events-page-skeleton";

const accentClass = "text-[#4cccc3]";
const Net = () => <span className={accentClass}>Net</span>;
const NetWalkingWord = () => (
  <span>
    <Net />
    Walking
  </span>
);

type FaqItem = {
  question: string;
  answer: string;
  questionDisplay: ReactNode;
  answerDisplay: ReactNode;
};

const faqItems: FaqItem[] = [
  {
    question: "What is NetWalking?",
    questionDisplay: (
      <>
        What is <NetWalkingWord />?
      </>
    ),
    answer:
      "NetWalking is a networking movement designed for walk-and-talk conversations with founders, freelancers, and parents across Tokyo.",
    answerDisplay: (
      <>
        <NetWalkingWord /> is a networking movement designed for walk-and-talk
        conversations with founders, freelancers, and parents across Tokyo.
      </>
    ),
  },
  {
    question: "Who can join NetWalking?",
    questionDisplay: (
      <>
        Who can join <NetWalkingWord />?
      </>
    ),
    answer:
      "Everyone is welcome! Most of the NetWalking community speaks both Japanese and English, so newcomers can jump right in.",
    answerDisplay: (
      <>
        Everyone is welcome! Most of the <NetWalkingWord /> community speaks
        both Japanese and English, so newcomers can jump right in.
      </>
    ),
  },
  {
    question: "How much does NetWalking cost?",
    questionDisplay: (
      <>
        How much does <NetWalkingWord /> cost?
      </>
    ),
    answer:
      "NetWalking will always be free. Participation is optional, but we donate ¥100 to charity for every kilometer walked.",
    answerDisplay: (
      <>
        <NetWalkingWord /> will always be free. Participation is optional, but
        we donate ¥100 to charity for every kilometer walked.
      </>
    ),
  },
];

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const nextEvent = upcomingEvents[0];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <main className="container mx-auto px-4 py-8">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <Image
            src="/images/NetWalking-Logo.jpg"
            alt="NetWalking Logo"
            width={320}
            height={213}
            className="w-60 h-auto"
            priority
          />
          <h1 className="text-3xl font-bold md:text-4xl">
            <span className={accentClass}>一歩ずつ</span>、つながりを強く。
            <br />
            <span className="text-lg font-medium text-muted-foreground md:text-xl">
              Building stronger relationships,{" "}
              <span className={accentClass}>step by step</span>.
            </span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Join bilingual networking walks across Tokyo and Yokohama. Meet
            founders, freelancers, and globally minded parents while exploring
            the city together.
          </p>
        </div>

        {nextEvent ? (
          <section className="mb-12" aria-labelledby="upcoming-event">
            <h2 id="upcoming-event" className="mb-6 text-2xl font-semibold">
              <span className={accentClass}>Upcoming</span> Event
            </h2>
            <FeaturedEvent event={nextEvent} />
          </section>
        ) : (
          <section className="mb-12" aria-labelledby="upcoming-event">
            <h2 id="upcoming-event" className="mb-6 text-2xl font-semibold">
              <span className={accentClass}>Upcoming</span> Event
            </h2>
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-center text-lg text-muted-foreground">
                  No upcoming events scheduled at this time.
                </p>
                <p className="text-center text-muted-foreground">
                  Check back soon for new walks around Tokyo.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* About Section */}
        <section className="mb-12" aria-labelledby="about-netwalking">
          <h2 id="about-netwalking" className="mb-6 text-2xl font-semibold">
            About <NetWalkingWord />
          </h2>
          <Card className="bg-muted/50">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-xl font-medium mb-4">
                  Hi! I'm{" "}
                  <a
                    href="https://www.linkedin.com/in/alex-ngai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Alex
                  </a>
                  !
                  <br />
                </p>
                <p className="mb-4">
                  起業家ですが、同時にパパでもあります👶👧
                  <br />
                  毎晩子どもたちと一緒にごはんを食べて、寝かしつけたいんです。
                  <br />
                  I'm an entrepreneur, but I'm also a dad👶👧
                  <br />I want to be home for dinner & tuck in my kids every
                  night.
                </p>
                <p className="mb-4">
                  だから、よくある夜のネットワーキングイベントはちょっと違う…。
                  <br />
                  そこで考えたのが、午後のオープンエア版！🍃
                  <br />
                  Typical after-work networking events aren't for me!
                  <br />
                  So this is the afternoon, open-air version!🍃
                </p>
                <p>
                  起業家、フリーランス、パパママ仲間たちと出会い、
                  <br />
                  東京の美しさを感じながら、深い会話を楽しみましょう！
                  <br />
                  Join us to meet other founders, freelancers, and parents.
                  <br />
                  Have a meaningful conversation & see the beauty of Tokyo!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12" aria-labelledby="faq">
          <h2 id="faq" className="mb-6 text-2xl font-semibold">
            <NetWalkingWord /> FAQs
          </h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <Card key={item.question} className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {item.questionDisplay}
                  </h3>
                  <p className="text-muted-foreground">{item.answerDisplay}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="past-events">
          <h2 id="past-events" className="mb-6 text-2xl font-semibold">
            <span className={accentClass}>Past</span> Events
          </h2>
          <Suspense fallback={<EventsPageSkeleton />}>
            {pastEvents.length > 0 ? (
              <EventsList events={pastEvents} />
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No past events to display.
                  </p>
                </CardContent>
              </Card>
            )}
          </Suspense>
        </section>
      </main>
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "NetWalking | Community Walks & Networking in Tokyo",
  description:
    "Join NetWalking for bilingual, family-friendly networking walks across Tokyo. Meet founders, freelancers, and globally minded parents while exploring the city.",
  alternates: {
    canonical: "https://netwalking.net/",
  },
  keywords: [
    "NetWalking",
    "Tokyo networking events",
    "family friendly networking",
    "walking meetups Tokyo",
    "Glokyo events",
  ],
  openGraph: {
    title: "NetWalking | Community Walks & Networking in Tokyo",
    description:
      "Discover NetWalking's upcoming bilingual walks across Tokyo. Build authentic relationships while exploring the city together.",
    type: "website",
    url: "https://netwalking.net/",
    images: [
      {
        url: "https://netwalking.net/images/NetWalking-Logo.jpg",
        width: 1200,
        height: 800,
        alt: "NetWalking Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NetWalking | Community Walks & Networking in Tokyo",
    description:
      "Bilingual networking walks that build stronger relationships across Tokyo, one step at a time.",
    images: ["https://netwalking.net/images/NetWalking-Logo.jpg"],
  },
};
