import path from "path";
import { promises as fs } from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface Event {
  id: string;
  no: string;
  title: string;
  date: string;
  time: string;
  location: string;
  course: string;
  description: string;
  stravaLink?: string;
  komootLink?: string;
  images?: CloudinaryImage[];
  status: "past" | "upcoming";
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

export async function getEvents(): Promise<Event[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json() as Promise<Event[]>;
}

export async function getEvent(id: string): Promise<Event | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/events/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch event");
  }
  return response.json() as Promise<Event>;
}

export async function getPastEvents(): Promise<Event[]> {
  const events = await getEvents();
  return events.filter((event) => event.status === "past");
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const events = await getEvents();
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
