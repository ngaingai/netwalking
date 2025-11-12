import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Event } from "@/lib/events";
import { getEventStatus } from "@/lib/events";

const EVENTS_FILE = path.join(process.cwd(), "data", "events.json");

async function readEventsFile(): Promise<{ events: Event[] }> {
  try {
    const fileContents = await fs.readFile(EVENTS_FILE, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading events file:", error);
    throw new Error("Failed to read events file");
  }
}

async function writeEventsFile(data: { events: Event[] }): Promise<void> {
  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing events file:", error);
    throw new Error("Failed to write events file");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readEventsFile();
    const updatedEvent = (await request.json()) as Partial<Event>;
    const eventIndex = data.events.findIndex((event: Event) => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the event while preserving the id and no
    data.events[eventIndex] = {
      ...data.events[eventIndex],
      ...updatedEvent,
      id: data.events[eventIndex].id,
      no: data.events[eventIndex].no,
    };

    await writeEventsFile(data);

    return NextResponse.json(data.events[eventIndex]);
  } catch (error) {
    console.error("Error in PUT /api/events/[id]:", error);
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
    const data = await readEventsFile();
    const event = data.events.find((e: Event) => e.id === id);

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
