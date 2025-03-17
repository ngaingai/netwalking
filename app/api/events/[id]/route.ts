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
    console.log("Updating event with ID:", id);

    const updatedEvent = (await request.json()) as Partial<Event>;
    console.log("Received updated event data:", updatedEvent);

    const eventIndex = eventsData.events.findIndex((event) => event.id === id);
    console.log("Found event at index:", eventIndex);

    if (eventIndex === -1) {
      console.log("Event not found with ID:", id);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Merge the updated event data with existing data
    const mergedEvent = {
      ...eventsData.events[eventIndex],
      ...updatedEvent,
      id: eventsData.events[eventIndex].id,
      no: eventsData.events[eventIndex].no,
    };
    console.log("Merged event data:", mergedEvent);

    // Update the event in the array
    const updatedEvents = [...eventsData.events];
    updatedEvents[eventIndex] = mergedEvent;

    // Only attempt to write to file in development environment
    if (process.env.NODE_ENV === "development") {
      const eventsFilePath = path.join(process.cwd(), "data", "events.json");
      console.log("Writing to file:", eventsFilePath);

      try {
        await fs.writeFile(
          eventsFilePath,
          JSON.stringify({ events: updatedEvents }, null, 2)
        );
        console.log("Successfully wrote to file");
      } catch (writeError) {
        console.error("Error writing to file:", writeError);
        // Don't throw the error, just log it
      }
    } else {
      console.log("Skipping file write in production environment");
      // TODO: Implement proper database storage
    }

    // Return success even if we couldn't write to the file
    // This allows the UI to update even though changes won't persist in production
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
