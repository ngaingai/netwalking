import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Event } from "@/lib/events";
import { getEventStatus } from "@/lib/events";

interface EventsData {
  events: Event[];
}

// Helper function to read events data
async function getEventsData(): Promise<EventsData> {
  const eventsFilePath = path.join(process.cwd(), "data", "events.json");
  const fileContents = await fs.readFile(eventsFilePath, "utf8");
  return JSON.parse(fileContents);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedEvent = (await request.json()) as Partial<Event>;

    // Read current data
    const eventsData = await getEventsData();
    const eventIndex = eventsData.events.findIndex(
      (event: Event) => event.id === id
    );

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

    if (process.env.NODE_ENV !== "production") {
      // Write the updated events array back to the file
      const eventsFilePath = path.join(process.cwd(), "data/events.json");
      const fileContent = JSON.stringify({ events: updatedEvents }, null, 2);
      await fs.writeFile(eventsFilePath, fileContent, "utf-8");

      // Verify the data was written correctly
      const verifyData = await fs.readFile(eventsFilePath, "utf-8");
      const parsedData = JSON.parse(verifyData);
      if (!parsedData.events[eventIndex]) {
        throw new Error("Failed to verify event update");
      }
    } else {
      // In production, we'll use a proper database
      // TODO: Implement database storage for events
    }

    return NextResponse.json(mergedEvent);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in PUT /api/events/[id]:", error);
    }
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventsData = await getEventsData();
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
    // Log error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in GET /api/events/[id]:", error);
    }
    return NextResponse.json(
      { error: "Failed to read event" },
      { status: 500 }
    );
  }
}
