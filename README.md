# NetWalking

netwalking.net — Tokyo's walking community for meaningful connections. Built with Next.js 16, TypeScript, and Tailwind CSS. Deployed on Vercel.

## Stack

- Next.js 16 (App Router, static generation)
- Tailwind CSS
- Markdown event data (gray-matter)
- i18n via middleware + `[locale]` route segments
- All images local (no external services)

## Project Structure

```
app/
  layout.tsx              # Root layout (html/body shell)
  globals.css             # Tailwind + CSS variables
  sitemap.ts              # Locale-aware sitemap
  robots.ts
  [locale]/
    layout.tsx            # Header, footer, schema.org JSON-LD
    page.tsx              # Home (6 sections)
    events/
      page.tsx            # Past events archive
      [slug]/
        page.tsx          # Individual event detail
    playbook/
      page.tsx            # "How to Run a NetWalk" guide
components/
  header.tsx              # Logo, Glokyo credit, language toggle
  footer.tsx              # Social links, Skool, copyright
  language-toggle.tsx     # JP/EN switcher (sets cookie)
  line-cta.tsx            # LINE join button (primary CTA)
  photo-carousel.tsx      # Post-walk photo carousel
content/
  events/                 # One .md file per event (frontmatter + write-up)
  playbook/
    playbook.md           # English playbook
    playbook_jp.md        # Japanese playbook
dictionaries/
  ja.json                 # Japanese UI strings
  en.json                 # English UI strings
lib/
  events.ts               # Markdown parsing, event queries, photo scanning
  playbook.ts             # Playbook content loader
  i18n.ts                 # Locale config, dictionary loader
middleware.ts             # Browser language detection, locale rewriting
public/
  images/                 # Logo, favicon
  events/                 # Cover images + post-walk photo directories
  community/              # Social proof photos (placeholder)
```

## i18n Routing

- `/` serves Japanese (default). Middleware rewrites to `/ja/` internally.
- `/en/` serves English. Non-ja browsers are redirected here.
- Language toggle sets a `NEXT_LOCALE` cookie so the preference persists.
- UI strings live in `dictionaries/ja.json` and `dictionaries/en.json`.
- Event-specific bilingual content uses frontmatter fields (`titleJp`, `meetingPointJp`, etc.).

## Event Data

Each event is a markdown file in `content/events/`.

**Filename:** `netwalking-[number].md` (e.g., `netwalking-019.md`)

**Frontmatter:**

```yaml
---
no: "019"
title: "Yanaka & Nezu"
titleJp: "谷中・根津エリア"          # optional, only if different from title
date: "2026-03-15"
time: "12:00-14:00"
course: "Yanaka & Nezu"
meetingPoint: "Sendagi Station, Exit 1"
meetingPointJp: "千駄木駅 1番出口"    # optional
mapLink: "https://maps.app.goo.gl/..."
meetupLink: "https://www.meetup.com/netwalking/events/..."
linkedinLink: "https://www.linkedin.com/events/..."
linkedinReportLink: ""
coverImage: "/events/netwalking-019.jpg"
---

Post-walk write-up goes here (markdown body).
Pulled from Alex's LinkedIn post. Added post-event.
```

**Status is auto-derived from date.** If the date is in the future, it's upcoming. If in the past, it's past. No manual status field.

**Images:**
- Cover image: `/public/events/netwalking-[number].jpg`
- Post-walk photos: `/public/events/netwalking-[number]/` (directory, auto-scanned at build time)
- Community/social proof: `/public/community/`

## Workflows

### Adding a new event

Alex prompts Claude Code with event details. Claude Code:

1. Creates `content/events/netwalking-[number].md` with frontmatter
2. Places cover image in `public/events/netwalking-[number].jpg`
3. Commits and pushes (Vercel auto-deploys)
4. Generates paste-ready copy for LinkedIn event post and Meetup listing

### Post-event update

Alex provides the LinkedIn post-walk write-up. Claude Code:

1. Adds write-up to the markdown file body in `content/events/netwalking-[number].md`
2. Places post-walk photos in `public/events/netwalking-[number]/`
3. Commits and pushes (Vercel auto-deploys)
4. Updates attendance log in the private cowork repo (separate from this repo)

### Prompt template

```
NetWalking event: add new event

Number: [#]
Title (EN): [title]
Title (JP): [title]
Date: [YYYY-MM-DD]
Time: 12:00-14:00
Location (EN): [location]
Location (JP): [location]
Meeting point (EN): [station/exit]
Meeting point (JP): [station/exit]
Map: [Google Maps link]
Image: [attach or path]
Description (EN): [optional]
Description (JP): [optional]

Also generate:
- LinkedIn event copy
- Meetup event copy
```

## Development

```bash
npm install
npm run dev
```

No environment variables required. All content is static.

## Build

```bash
npm run build
```

Generates static HTML for all locale + event combinations. Currently 42 pages.

## Home Page Sections

1. **Hero** — Logo, tagline, LINE CTA, optional upcoming event teaser
2. **What This Is** — Compressed pitch (monthly walk, free, bilingual, 5km)
3. **Social Proof Strip** — Walk count, photo placeholders, archive link
4. **How It Works** — 3 steps for first-timers
5. **Next Walk** — Conditional, only renders when an upcoming event exists
6. **Footer** — Glokyo credit, social links, Skool community link, playbook link

## Pages

| Route | Purpose |
| --- | --- |
| `/`, `/en` | Home — hero, pitch, social proof, how it works, next walk, footer |
| `/events`, `/en/events` | Archive of all past walks |
| `/events/[slug]`, `/en/events/[slug]` | Individual event with write-up + photos |
| `/playbook`, `/en/playbook` | "How to Run a NetWalk" — open guide for anyone starting their own |

## Tracker

See [todo.md](todo.md) for what's done and what's next.
