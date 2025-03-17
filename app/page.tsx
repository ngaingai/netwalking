import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventsList } from "@/components/events-list";
import { FeaturedEvent } from "@/components/featured-event";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { EventsPageSkeleton } from "@/components/events-page-skeleton";
import { Metadata } from "next";

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const nextEvent = upcomingEvents[0];

  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
          NetWalking Events
        </h1>

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
