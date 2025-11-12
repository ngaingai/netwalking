import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const EVENTS_FILE = path.join(process.cwd(), "data", "events.json");

export interface Event {
  id: string;
  no: string;
  title: string;
  date: string;
  time: string;
  meetingPoint: string;
  maplink?: string;
  course: string;
  description: string;
  meetuplink?: string;
  linkedinlink?: string;
  linkedinReportLink?: string;
  attendees?: number;
  stravaLink?: string;
  komootLink?: string;
  images?: CloudinaryImage[];
  status: "past" | "upcoming";
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

export function getEventImagePath(eventNo: string): string {
  return `/images/events/${eventNo}.jpg`;
}

// Read events directly from file system (for build time / server components)
async function readEventsFile(): Promise<{ events: Event[] }> {
  try {
    const fileContents = await fs.readFile(EVENTS_FILE, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading events file:", error);
    throw new Error("Failed to read events file");
  }
}

// Get events from file system (for build time / static generation)
export async function getEventsFromFile(): Promise<Event[]> {
  const data = await readEventsFile();
  // Update status based on current date
  return data.events.map((event: Event) => ({
    ...event,
    status: getEventStatus(event.date),
  }));
}

// Get events via API (for client-side / runtime)
export async function getEvents(): Promise<Event[]> {
  // During build time, use file system directly
  if (typeof window === "undefined" && process.env.NODE_ENV !== "development") {
    return getEventsFromFile();
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/events`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json() as Promise<Event[]>;
  } catch (error) {
    // Fallback to file system if API fails (e.g., during build)
    console.warn("API fetch failed, falling back to file system:", error);
    return getEventsFromFile();
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  // During build time, use file system directly
  if (typeof window === "undefined") {
    try {
      const events = await getEventsFromFile();
      const event = events.find((e) => e.id === id);
      return event || null;
    } catch (error) {
      console.warn("File system read failed, falling back to API:", error);
    }
  }
  
  // Fallback to API for client-side / runtime
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/events/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch event");
    }
    return response.json() as Promise<Event>;
  } catch (error) {
    // Final fallback to file system if API fails
    console.warn("API fetch failed, falling back to file system:", error);
    try {
      const events = await getEventsFromFile();
      return events.find((e) => e.id === id) || null;
    } catch {
      return null;
    }
  }
}

export async function getPastEvents(): Promise<Event[]> {
  // Use file system for server components / build time
  const events = await getEventsFromFile();
  return events.filter((event) => event.status === "past");
}

export async function getUpcomingEvents(): Promise<Event[]> {
  // Use file system for server components / build time
  const events = await getEventsFromFile();
  return events.filter((event) => event.status === "upcoming");
}

export async function getEventImages(
  eventNo: string
): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.search
      .expression(`folder:events/${eventNo}/*`)
      .execute();

    return result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
    }));
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    return [];
  }
}

// Helper function to determine event status
export function getEventStatus(date: string): "past" | "upcoming" {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? "past" : "upcoming";
}
