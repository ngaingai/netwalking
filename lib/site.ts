import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

// One production host for canonicals, hreflang, the sitemap and JSON-LD.
// www.netwalking.net is the host the published links use (2026-11-27 SEO
// review). If the Vercel primary domain changes, change only this line.
export const SITE_URL = "https://www.netwalking.net";

// Japanese is served without a prefix, English under /en.
// path is "" for a homepage or starts with "/" (for example "/events").
export function localePath(locale: Locale, path = ""): string {
  return locale === "ja" ? path || "/" : `/en${path}`;
}

export function absoluteUrl(locale: Locale, path = ""): string {
  return `${SITE_URL}${locale === "ja" ? path : `/en${path}`}`;
}

// Each page declares its own URL as canonical, and the ja and en versions of
// the same content as alternates of each other. x-default is the unprefixed
// URL, which chooses the language from the browser for first-time visitors.
export function pageAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ja: absoluteUrl("ja", path),
      en: absoluteUrl("en", path),
      "x-default": absoluteUrl("ja", path),
    },
  };
}
