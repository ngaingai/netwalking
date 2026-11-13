import { NextResponse } from "next/server";

import { getAllEvents } from "@/lib/events";

const SITE_URL = "https://netwalking.net";

// Machine-readable list of walks for the Hashi LINE account's events menu
// (Hashi-jp, HS-011). Built at deploy time, so it lists every walk dated
// today or later at build; consumers drop walks whose date has passed.
export const dynamic = "force-static";

export function GET() {
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const events = getAllEvents()
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      slug: e.slug,
      series: e.series,
      no: e.no,
      title: e.title,
      titleJp: e.titleJp || null,
      date: e.date,
      time: e.time,
      course: e.course,
      url: `${SITE_URL}/ja/events/${e.slug}`,
    }));
  return NextResponse.json({ events });
}
