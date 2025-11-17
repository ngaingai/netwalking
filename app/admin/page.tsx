"use client";

import { useEffect, useState } from "react";
import { AddEvent } from "@/components/add-event";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Event } from "@/lib/events";

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await fetch("/api/events");

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch events:", {
          status: response.status,
          errorData,
        });
        throw new Error(errorData.error || "Failed to fetch events");
      }

      const data = (await response.json()) as Event[];
      setEvents(data);
    } catch (error) {
      console.error("Error in admin page:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to load events"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border bg-destructive/10 p-8 text-destructive">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={() => router.refresh()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch("/api/auth/logout", {
                  method: "POST",
                });
                if (!response.ok) {
                  throw new Error("Failed to logout");
                }
                router.push("/admin/login");
              } catch (error) {
                console.error("Error logging out:", error);
                toast.error("Failed to logout");
              }
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <AddEvent onEventAdded={fetchEvents} />
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEventUpdated={fetchEvents}
          />
        ))}
      </div>
    </div>
  );
}
