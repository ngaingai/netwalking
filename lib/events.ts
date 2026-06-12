import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

export interface Event {
  slug: string;
  no: string;
  series: string;
  title: string;
  titleJp: string;
  date: string;
  time: string;
  course: string;
  meetingPoint: string;
  meetingPointJp: string;
  mapLink: string;
  meetupLink: string;
  linkedinLink: string;
  linkedinReportLink: string;
  stravaLink: string;
  komootLink: string;
  attendees: number;
  coverImage: string;
  /* Actual walked distance from Garmin; null falls back to the flat 5km estimate */
  distanceKm: number | null;
  /* GPS route image, convention: /events/<slug>-route.png */
  routeImage: string;
  photos: string[];
  status: "past" | "upcoming";
  description: string;
  teaser: string;
  teaserJp: string;
}

interface EventFrontmatter {
  no: string;
  series?: string;
  title: string;
  titleJp?: string;
  date: string | Date;
  time: string;
  course: string;
  meetingPoint: string;
  meetingPointJp?: string;
  mapLink?: string;
  meetupLink?: string;
  linkedinLink?: string;
  linkedinReportLink?: string;
  stravaLink?: string;
  komootLink?: string;
  attendees?: number;
  coverImage?: string;
  distanceKm?: number;
  teaser?: string;
  teaserJp?: string;
}

function getEventStatus(date: string): "past" | "upcoming" {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? "past" : "upcoming";
}

function parseEventFile(filePath: string): Event {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as EventFrontmatter;

  const slug = path.basename(filePath, ".md");
  const dateStr =
    frontmatter.date instanceof Date
      ? frontmatter.date.toISOString().split("T")[0]
      : String(frontmatter.date);

  let routeImage = "";
  for (const ext of ["png", "webp", "jpg"]) {
    const candidate = path.join(
      process.cwd(),
      "public",
      "events",
      `${slug}-route.${ext}`
    );
    if (fs.existsSync(candidate)) {
      routeImage = `/events/${slug}-route.${ext}`;
      break;
    }
  }

  // Scan for post-walk photos in /public/events/[slug]/
  const photosDir = path.join(process.cwd(), "public", "events", slug);
  let photos: string[] = [];
  if (fs.existsSync(photosDir)) {
    photos = fs
      .readdirSync(photosDir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/events/${slug}/${f}`);
  }

  return {
    slug,
    no: frontmatter.no,
    series: frontmatter.series || "NetWalking",
    title: frontmatter.title,
    titleJp: frontmatter.titleJp || "",
    date: dateStr,
    time: frontmatter.time || "12:00",
    course: frontmatter.course,
    meetingPoint: frontmatter.meetingPoint,
    meetingPointJp: frontmatter.meetingPointJp || "",
    mapLink: frontmatter.mapLink || "",
    meetupLink: frontmatter.meetupLink || "",
    linkedinLink: frontmatter.linkedinLink || "",
    linkedinReportLink: frontmatter.linkedinReportLink || "",
    stravaLink: frontmatter.stravaLink || "",
    komootLink: frontmatter.komootLink || "",
    attendees: frontmatter.attendees || 0,
    coverImage: frontmatter.coverImage || `/events/${slug}.webp`,
    distanceKm:
      typeof frontmatter.distanceKm === "number" ? frontmatter.distanceKm : null,
    routeImage,
    photos,
    status: getEventStatus(dateStr),
    description: content.trim(),
    teaser: frontmatter.teaser || "",
    teaserJp: frontmatter.teaserJp || "",
  };
}

export function getAllEvents(): Event[] {
  if (!fs.existsSync(EVENTS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith(".md"));

  const events = files.map((file) =>
    parseEventFile(path.join(EVENTS_DIR, file))
  );

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEventBySlug(slug: string): Event | null {
  const filePath = path.join(EVENTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parseEventFile(filePath);
}

export function getPastEvents(): Event[] {
  return getAllEvents().filter((e) => e.status === "past");
}

export function getUpcomingEvents(): Event[] {
  return getAllEvents().filter((e) => e.status === "upcoming");
}

/* Odometer: real distances where recorded, flat 5km estimate otherwise */
export function getTotalKmWalked(): number {
  return getPastEvents().reduce((sum, e) => sum + (e.distanceKm ?? 5), 0);
}

/* Prev/next station within the same series, by event number */
export function getAdjacentEvents(event: Event): {
  prev: Event | null;
  next: Event | null;
} {
  const line = getAllEvents()
    .filter((e) => e.series === event.series)
    .sort((a, b) => parseInt(a.no, 10) - parseInt(b.no, 10));
  const index = line.findIndex((e) => e.slug === event.slug);
  return {
    prev: index > 0 ? line[index - 1] : null,
    next: index >= 0 && index < line.length - 1 ? line[index + 1] : null,
  };
}

export function getLatestUpcomingEvent(): Event | null {
  const upcoming = getUpcomingEvents();
  if (upcoming.length === 0) return null;
  return upcoming.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];
}
