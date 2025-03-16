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

export async function GET() {
  try {
    const data = await readEventsFile();

    // Update status based on current date
    const events = data.events.map((event: Event) => ({
      ...event,
      status: getEventStatus(event.date),
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { error: "Failed to read events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newEvent: Event = await request.json();
    const data = await readEventsFile();

    // Add the new event
    data.events.push(newEvent);

    // Write back to the file
    await writeEventsFile(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      { error: "Failed to save event" },
      { status: 500 }
    );
  }
}
