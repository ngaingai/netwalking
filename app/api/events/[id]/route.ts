import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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
    const eventIndex = eventsData.events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Merge the updated event data with existing data
    const mergedEvent = {
      ...eventsData.events[eventIndex],
      ...updatedEvent,
      id: eventsData.events[eventIndex].id,
      no: eventsData.events[eventIndex].no,
    };

    // Update the event in the array
    const updatedEvents = [...eventsData.events];
    updatedEvents[eventIndex] = mergedEvent;

    // Write the updated data back to the file
    const eventsFilePath = path.join(process.cwd(), "data", "events.json");
    await fs.writeFile(
      eventsFilePath,
      JSON.stringify({ events: updatedEvents }, null, 2)
    );

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
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const event = eventsData.events.find((e) => e.id === id);

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
