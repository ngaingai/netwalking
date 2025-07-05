import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventsList } from "@/components/events-list";
import { FeaturedEvent } from "@/components/featured-event";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { EventsPageSkeleton } from "@/components/events-page-skeleton";
import { Metadata } from "next";
import Image from "next/image";

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const nextEvent = upcomingEvents[0];

  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png?v=2"
            alt="NetWalking Logo"
            width={64}
            height={64}
            className="h-16 w-16"
          />
        </div>

        {nextEvent ? (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Upcoming Event</h2>
            <FeaturedEvent event={nextEvent} />
          </section>
        ) : (
          <section className="mb-12">
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-center text-lg text-muted-foreground">
                  No upcoming events scheduled at this time.
                </p>
                <p className="text-center text-muted-foreground">
                  Check back soon for new events!
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* About Section */}
        <section className="mb-12">
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

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Past Events</h2>
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
  title: "NetWalking",
  description: "Produced by Glokyo",
  openGraph: {
    title: "NetWalking",
    description: "Produced by Glokyo",
    type: "website",
  },
};
