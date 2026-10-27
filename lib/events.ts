import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

/*
 * Event slugs are file names in content/events, e.g. "netwalking-023":
 * lowercase letters and digits in hyphen-separated runs. Anything else (dots,
 * slashes, backslashes, percent-escapes, uppercase) is never a valid slug.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

export function isValidEventSlug(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    slug.length <= MAX_SLUG_LENGTH &&
    SLUG_PATTERN.test(slug)
  );
}

/*
 * Resolve a route slug to its event file, or null. The slug must match the
 * grammar, name an existing event file, and resolve (symlinks included) to a
 * file directly inside EVENTS_DIR. Nothing is read before all three pass.
 */
function resolveEventPath(slug: unknown): string | null {
  if (!isValidEventSlug(slug)) return null;
  if (!getAllEventSlugs().includes(slug)) return null;

  const root = fs.realpathSync(EVENTS_DIR);
  let filePath: string;
  try {
    filePath = fs.realpathSync(path.join(root, `${slug}.md`));
  } catch {
    return null;
  }
  if (path.dirname(filePath) !== root) return null;
  if (!fs.statSync(filePath).isFile()) return null;
  return filePath;
}

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
  peatixLink: string;
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
  peatixLink?: string;
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
    peatixLink: frontmatter.peatixLink || "",
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

/* Slugs of every regular event file (no symlinks) whose name fits the grammar */
export function getAllEventSlugs(): string[] {
  if (!fs.existsSync(EVENTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(EVENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.slice(0, -".md".length))
    .filter(isValidEventSlug);
}

export function getAllEvents(): Event[] {
  const events = getAllEventSlugs().map((slug) =>
    parseEventFile(path.join(EVENTS_DIR, `${slug}.md`))
  );

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEventBySlug(slug: string): Event | null {
  const filePath = resolveEventPath(slug);
  if (!filePath) {
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
