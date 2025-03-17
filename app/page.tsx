import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EventsList } from "@/components/events-list";
import { FeaturedEvent } from "@/components/featured-event";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { EventsPageSkeleton } from "@/components/events-page-skeleton";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetWalking Events | Connect While Walking",
  description:
    "Join our NetWalking events in Tokyo - a unique way to network while enjoying a walk through the city's most interesting areas.",
  openGraph: {
    title: "NetWalking Events | Connect While Walking",
    description:
      "Join our NetWalking events in Tokyo - a unique way to network while enjoying a walk through the city's most interesting areas.",
    type: "website",
  },
};

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const nextEvent = upcomingEvents[0];

  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                NetWalking Events
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Connect with professionals while exploring Tokyo
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{upcomingEvents.length} upcoming events</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 pb-12">
          {/* Upcoming Event Section */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold flex items-center gap-2">
              <span className="inline-block h-6 w-1 rounded-full bg-primary"></span>
              Next Event
            </h2>
            {nextEvent ? (
              <FeaturedEvent event={nextEvent} />
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-2 text-lg font-medium">
                    No upcoming events scheduled
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    We're planning new events. Check back soon or follow us on
                    LinkedIn to stay updated!
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Events Section */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold flex items-center gap-2">
              <span className="inline-block h-6 w-1 rounded-full bg-primary/50"></span>
              Past Events
            </h2>
            <Suspense fallback={<EventsPageSkeleton />}>
              {pastEvents.length > 0 ? (
                <div className="grid gap-8">
                  <EventsList events={pastEvents} />
                  <p className="text-center text-sm text-muted-foreground">
                    Showing {pastEvents.length} past events
                  </p>
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Past events will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </Suspense>
          </section>
        </div>
      </main>
    </Suspense>
  );
}
