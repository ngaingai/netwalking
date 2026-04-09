# NetWalking Refactor — Tracker

## What We Shipped

### Architecture
- Migrated from Cloudinary + JSON + admin panel → markdown-based data layer
- Created `content/events/` with 17 events as `.md` files (gray-matter frontmatter)
- New `lib/events.ts` reads markdown at build time, auto-derives `status` from date
- Removed Cloudinary, bcrypt, admin panel, HubSpot, dnd-kit, react-hook-form, sonner, theme-provider, next-themes
- Removed entire `app/admin/`, `app/api/`, `app/zoo-lloween2025/`
- Removed unused components: `add-event`, `edit-event`, `event-card` (admin), `image-upload`, `faq-accordion`, `hubspot-form*`, `events-page-skeleton`, `theme-provider`
- Cleaned up `package.json`, `.env.example`, `next.config.*`

### i18n
- Middleware-based locale detection (`middleware.ts`) — JP default at `/`, EN at `/en/`
- Browser language detection via `accept-language` header
- `NEXT_LOCALE` cookie for user preference
- `[locale]` route segment (`app/[locale]/...`)
- Locale dictionaries at `dictionaries/ja.json` and `dictionaries/en.json`
- Language toggle in header
- Static generation for both locales (44 pages total)

### Pages
- **Home (`/`, `/en`)** — 6 sections: Hero, What This Is, Social Proof Strip, How It Works, Next Walk (conditional), Footer
- **Archive (`/events`, `/en/events`)** — grid of all past events
- **Event detail (`/events/[slug]`, `/en/events/[slug]`)** — title, date, location, map, write-up, external links
- **Playbook (`/playbook`, `/en/playbook`)** — renders `content/playbook/playbook.md` and `playbook_jp.md` with brand-color treatment for NetWalking/NiteWalking/etc. and Alex Ngai linkified to LinkedIn

### SEO foundation
- `sitemap.ts` generates entries for all pages in both locales
- Per-locale metadata with `alternates.languages` for hreflang
- Organization schema.org JSON-LD on every page
- Event schema.org JSON-LD on event detail pages
- `robots.ts` configured

### Workflow / Content
- Playbook EN + JP files in `content/playbook/`
- Footer "Start your own / 自分で始める" link to playbook
- Plain-text-only event markdown bodies render as write-ups

---

## Remaining Work

### Content (waiting on Alex)
- [ ] Source candid walk photos for `/public/community/` (social proof strip)
- [x] Real event cover images for `/public/events/netwalking-XXX.jpg`
- [x] Post-walk photo galleries in `/public/events/netwalking-XXX/` directories
- [ ] Post-walk write-ups for past events (backfill from LinkedIn posts → markdown bodies)
- [ ] Gather data for all past NetWalking variants (NiteWalking, NetRunning, NetChilling) — dates, locations, write-ups, photos
- [ ] Gather attendee names from past walks (LinkedIn posts → attendance log in cowork repo)
- [ ] Optional: attendee quote for social proof section
- [ ] Verify LINE link `https://lin.ee/nB41KHn` is still active before launch

### Design / polish
- [ ] Visual refresh pass: light/airy, outdoor park energy, warm accents
- [ ] Mobile-first audit at 375px (hero CTA, upcoming event, "what this is" must all be above the fold)
- [ ] Friendlier typography (currently Inter — may want something warmer)
- [ ] Soft-toned photo placeholders (not harsh boxes)
- [ ] Subtle scroll fade-ins (optional)
- [ ] Photo carousel on event detail pages (CSS scroll-snap, no deps) — currently just a `photos` field is unused

### Features
- [ ] Read photos from `/public/events/netwalking-XXX/` directory at build time, render carousel on event detail page
- [ ] Surface upcoming event teaser in hero (date/time/location line) when one exists
- [ ] Social proof numbers wired up from data layer (walk count, attendee count if available)

### SEO/AEO pass (post-content)
- [ ] Final meta titles + descriptions in both languages
- [ ] OG images per locale
- [ ] Event schema markup for upcoming events (already partial)
- [ ] FAQ schema if warranted
- [ ] AEO-targeted content review

### Workflow tooling
- [ ] Build a Claude Code skill for "add new event" — takes Alex's prompt, creates markdown file, places cover image, generates LinkedIn + Meetup paste-ready copy
- [ ] Build a Claude Code skill for "post-event update" — takes LinkedIn write-up, updates event markdown body, places photos in directory, updates attendance log in cowork repo (cross-repo)
- [ ] Set up the attendance log file in the cowork repo (`Glokyo/NetWalking/attendance.md`)

### Housekeeping
- [x] Update `README.md` to reflect new architecture
- [ ] Optional: `npm i baseline-browser-mapping@latest -D` (warning on dev start)
- [ ] Migrate `middleware.ts` → `proxy.ts` (Next.js 16 deprecation warning)
- [ ] Remove `eslint` key from `next.config.js` (Next.js 16 unrecognized key warning)

### Open questions
- [ ] Confirm playbook footer link copy ("Start your own" / "自分で始める") feels right
- [ ] Decide if individual event detail pages need a LINE CTA at the bottom for past events (currently only on upcoming)
