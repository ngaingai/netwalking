import { NextResponse } from "next/server";
import type { Event } from "@/lib/events";
import { getEventStatus } from "@/lib/events";
import eventsData from "@/data/events.json";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updatedEvent = (await request.json()) as Partial<Event>;
    const eventIndex = eventsData.events.findIndex(
      (event: Event) => event.id === id
    );

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Since we're using static data, we'll just return the merged event without persisting
    const mergedEvent = {
      ...eventsData.events[eventIndex],
      ...updatedEvent,
      id: eventsData.events[eventIndex].id,
      no: eventsData.events[eventIndex].no,
    };

    return NextResponse.json(mergedEvent);
  } catch (error) {
    console.error("Error in PUT /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const event = eventsData.events.find((e: Event) => e.id === id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update status based on current date
    const updatedEvent = {
      ...event,
      status: getEventStatus(event.date),
    };

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error in GET /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Failed to read event" },
      { status: 500 }
    );
  }
}
