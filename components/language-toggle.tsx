"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const targetLocale = locale === "ja" ? "en" : "ja";
  const label = locale === "ja" ? "EN" : "JP";

  // Build the target path
  let targetPath: string;
  if (locale === "ja") {
    // Currently Japanese (no prefix in URL), switch to /en/...
    targetPath = `/en${pathname}`;
  } else {
    // Currently English (/en/...), switch to root
    targetPath = pathname.replace(/^\/en/, "") || "/";
  }

  const handleClick = () => {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
  };

  return (
    <Link
      href={targetPath}
      onClick={handleClick}
      className="rounded-md border border-border px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {label}
    </Link>
  );
}
