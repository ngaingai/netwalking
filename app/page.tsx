import { Suspense } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EventsList } from "@/components/events-list";
import { FeaturedEvent } from "@/components/featured-event";
import { FaqAccordion } from "@/components/faq-accordion";
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
        What is <NetWalkingWord />? <span style={{ color: "#4cccc3" }}>→</span>{" "}
        <NetWalkingWord /> って何？
      </>
    ),
    answer:
      "NetWalking is a movement. Literally! It's a walking-based alternative to traditional networking events. We blend connection, conversation, and community step-by-step. Join founders, freelancers, and parents for a mid-afternoon stroll in Tokyo's beautiful outdoors!",
    answerDisplay: (
      <>
        <NetWalkingWord /> is a movement. Literally! It's a walking-based
        alternative to traditional networking events. We blend connection,
        conversation, and community step-by-step. Join founders, freelancers,
        and parents for a mid-afternoon stroll in Tokyo's beautiful outdoors!
        <br />
        <br />
        <NetWalkingWord />{" "}
        は「ムーブメント」そのものです。文字通り、歩きながらつながる、新しいスタイルのネットワーキング。一歩ずつ、会話・つながり・コミュニニティを育てていくイベントです。東京の美しい屋外を、創業者、フリーランス、パパママたちと一緒にゆったり歩きませんか？午後のひとときを、みんなで楽しく共有しましょう！
      </>
    ),
  },
  {
    question: "Who can join NetWalking?",
    questionDisplay: (
      <>
        Who can join <NetWalkingWord />?{" "}
        <span style={{ color: "#4cccc3" }}>→</span> 誰が参加できるの？
      </>
    ),
    answer:
      "Everyone is welcome! The NetWalking community is as diverse as it gets. From babies to seniors, Japan to all over the world, CEO's to first-time visitors. Most of the regulars speak both Japanese and English so jump in and make new connections!",
    answerDisplay: (
      <>
        Everyone is welcome! The <NetWalkingWord /> community is as diverse as
        it gets. From babies to seniors, Japan to all over the world, CEO's to
        first-time visitors. Most of the regulars speak both Japanese and
        English so jump in and make new connections!
        <br />
        <br />
        誰でも大歓迎です！
        <NetWalkingWord />{" "}
        のコミュニティは、とにかく多様性にあふれています。赤ちゃんからシニアの方まで、日本の方も、世界中から来た方も、CEO
        もいれば、初めて日本に来たばかりの人もいます。常連さんの多くは日本語と英語の両方を話すので、気軽に会話に入って、新しいつながりを作ってくださいね！
      </>
    ),
  },
  {
    question: "How much is NetWalking?",
    questionDisplay: (
      <>
        How much is <NetWalkingWord /> ?{" "}
        <span style={{ color: "#4cccc3" }}>→</span> 参加費はいくら？
      </>
    ),
    answer:
      "NetWalking will always be free. It's a walk in the park, after all! We encourage our paricipants to donate ¥100 to charity for every kilometer walked, but this is completely optional!",
    answerDisplay: (
      <>
        <NetWalkingWord /> will always be free. It's a walk in the park, after
        all! We encourage our paricipants to donate ¥100 to charity for every
        kilometer walked, but this is completely optional!
        <br />
        <br />
        <NetWalkingWord />{" "}
        は、これからもずっと無料です。だって、ただのみんなで歩くイベントですから！参加者のみなさんには、歩いた1kmごとに100円をチャリティーに寄付していただく
        "任意の仕組み" をご案内していますが、もちろん強制ではありません。
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
          <h1 className="text-3xl font-bold md:text-4xl">
            <span style={{ color: "#4cccc3" }}>Net</span>
            <span className="text-muted-foreground">Walking</span>
          </h1>
          <Image
            src="/images/NetWalking-Logo.jpg"
            alt="NetWalking Logo"
            width={320}
            height={213}
            className="w-60 h-auto"
            priority
          />
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className={accentClass}>一歩ずつ</span>、つながりを強く。
            <br />
            <span className="text-lg font-medium text-muted-foreground md:text-xl">
              Building stronger relationships,{" "}
              <span className={accentClass}>step by step</span>.
            </span>
          </h2>
          <p className="max-w-2xl text-base italic font-light text-muted-foreground md:text-lg">
            5K walks with Tokyo's most{" "}
            <span style={{ color: "#4cccc3" }}>awesome</span> people. Monthly,
            12-2pm. Free!
            <br />
            東京の"<span style={{ color: "#4cccc3" }}>最高</span>
            の仲間たち"と歩く 5kmのお散歩。毎月開催、12〜14時。参加無料！
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
          <FaqAccordion items={faqItems} />
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
  title: "NetWalking | Tokyo's Walking Community for Meaningful Connections",
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
    title: "NetWalking | Tokyo's Walking Community for Meaningful Connections",
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
    title: "NetWalking | Tokyo's Walking Community for Meaningful Connections",
    description:
      "Bilingual networking walks that build stronger relationships across Tokyo, one step at a time.",
    images: ["https://netwalking.net/images/NetWalking-Logo.jpg"],
  },
};
