import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

export interface Event {
  slug: string;
  no: string;
  title: string;
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
  status: "past" | "upcoming";
  description: string;
  descriptionJp: string;
}

interface EventFrontmatter {
  no: string;
  title: string;
  titleJp?: string;
  date: string | Date;
  time: string;
  course: string;
  courseJp?: string;
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
  descriptionJp?: string;
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

  return {
    slug,
    no: frontmatter.no,
    title: frontmatter.title,
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
    coverImage: frontmatter.coverImage || `/events/netwalking-${frontmatter.no}.jpg`,
    status: getEventStatus(dateStr),
    description: content.trim(),
    descriptionJp: frontmatter.descriptionJp || "",
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

export function getLatestUpcomingEvent(): Event | null {
  const upcoming = getUpcomingEvents();
  if (upcoming.length === 0) return null;
  return upcoming.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];
}
