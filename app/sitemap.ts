import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/events";

const SITE_URL = "https://netwalking.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const events = getAllEvents();

  const eventEntries = events.flatMap((event) => [
    {
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: new Date(event.date),
    },
    {
      url: `${SITE_URL}/en/events/${event.slug}`,
      lastModified: new Date(event.date),
    },
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/en/events`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/playbook`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/en/playbook`,
      lastModified: new Date(),
    },
    ...eventEntries,
  ];
}
