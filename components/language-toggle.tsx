"use client";

import { usePathname } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const targetLocale: Locale = locale === "ja" ? "en" : "ja";
  const label = locale === "ja" ? "EN" : "JP";

  // Swap the locale segment rather than appending. The current path may or
  // may not carry a locale prefix (ja is served at both / and /ja), so strip
  // any leading locale segment first, then prefix for the target locale.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments.shift();
  }
  const rest = segments.length > 0 ? `/${segments.join("/")}` : "";
  const targetPath = targetLocale === "ja" ? rest || "/" : `/en${rest}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000;samesite=lax`;
    // Full page navigation ensures the new cookie is sent with the request
    // and bypasses any stale RSC cache or edge-cached middleware response.
    window.location.href = targetPath;
  };

  return (
    <a
      href={targetPath}
      onClick={handleClick}
      className="rounded-md border border-white/30 px-2.5 py-1 font-mono text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
    >
      {label}
    </a>
  );
}
