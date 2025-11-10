import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/events";

const SITE_URL = "https://netwalking.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();

  const eventEntries = events.map((event) => ({
    url: `${SITE_URL}/events/${event.id}`,
    lastModified: new Date(event.date),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    ...eventEntries,
  ];
}

