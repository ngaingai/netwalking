import { NextResponse } from "next/server";
import { getEventStatus } from "@/lib/events";
import eventsData from "@/data/events.json";

export async function GET() {
  try {
    // Update status based on current date
    const events = eventsData.events.map((event) => ({
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
    await request.json(); // Parse but don't store since we're not using it

    // Since we're using static data, just return success
    // In a real app, this would save to a database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      { error: "Failed to save event" },
      { status: 500 }
    );
  }
}
