"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const targetLocale = locale === "ja" ? "en" : "ja";
  const label = locale === "ja" ? "EN" : "JP";

  let targetPath: string;
  if (locale === "ja") {
    targetPath = `/en${pathname === "/" ? "" : pathname}`;
  } else {
    targetPath = pathname.replace(/^\/en/, "") || "/";
  }

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
      className="rounded-md border border-border px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {label}
    </a>
  );
}
