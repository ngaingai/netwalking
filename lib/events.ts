import { v2 as cloudinary } from "cloudinary";
import eventsData from "@/data/events.json";

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
  course: string;
  meetingPoint: string;
  maplink: string;
  meetuplink: string;
  linkedinlink: string;
  linkedinReportLink?: string;
  description: string;
  attendees: number;
  status: "past" | "upcoming";
  stravaLink?: string;
  komootLink?: string;
  images?: CloudinaryImage[];
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  tags?: string[];
}

interface OrderedImage {
  public_id: string;
  secure_url: string;
  order: string | null;
}

export async function getEvents(): Promise<Event[]> {
  // Update status based on current date
  return eventsData.events.map((event) => ({
    ...event,
    status: getEventStatus(event.date),
  }));
}

export async function getEvent(id: string): Promise<Event | null> {
  const event = eventsData.events.find((e) => e.id === id);
  if (!event) return null;

  return {
    ...event,
    status: getEventStatus(event.date),
  };
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
      .with_field("tags")
      .max_results(500)
      .execute();

    const images = result.resources
      .map(
        (resource: CloudinaryResource): OrderedImage => ({
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          order: resource.tags
            ? resource.tags
                .filter((tag: string) => tag.startsWith("order_"))
                .sort(
                  (a, b) =>
                    parseInt(b.split("_")[1]) - parseInt(a.split("_")[1])
                )[0]
                ?.split("_")[1] ?? null
            : null,
        })
      )
      .sort((a: OrderedImage, b: OrderedImage) => {
        // If both have order tags, sort by order
        if (a.order !== null && b.order !== null) {
          return parseInt(a.order) - parseInt(b.order);
        }
        // If only one has order, put the one without order at the end
        if (a.order === null) return 1;
        if (b.order === null) return -1;
        // If neither has order, maintain original order
        return 0;
      })
      .map(({ public_id, secure_url }: OrderedImage) => ({
        public_id,
        secure_url,
      }));

    return images;
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
