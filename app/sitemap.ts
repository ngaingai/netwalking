import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/events";
import { absoluteUrl } from "@/lib/site";

// Every indexable page in both languages, on the canonical host, with the
// other language listed as its alternate (matches each page's hreflang).
function pair(path: string, lastModified: Date): MetadataRoute.Sitemap {
  const languages = { ja: absoluteUrl("ja", path), en: absoluteUrl("en", path) };
  return [
    { url: languages.ja, lastModified, alternates: { languages } },
    { url: languages.en, lastModified, alternates: { languages } },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...pair("", now),
    ...pair("/events", now),
    ...pair("/playbook", now),
    ...getAllEvents().flatMap((event) => pair(`/events/${event.slug}`, new Date(event.date))),
  ];
}
