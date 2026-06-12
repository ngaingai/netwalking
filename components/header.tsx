import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { KmCounter } from "@/components/km-counter";
import type { Locale } from "@/lib/i18n";

interface HeaderDict {
  header: {
    stationName: string;
    stationNameAlt: string;
  };
}

export function Header({
  locale,
  dict,
  latestWalkNumber,
}: {
  locale: Locale;
  dict: HeaderDict;
  latestWalkNumber: number;
}) {
  const homeHref = locale === "ja" ? "/" : "/en";

  return (
    <header className="sticky top-0 z-50 w-full bg-sign text-white shadow-md">
      <div className="container flex h-16 items-center justify-between gap-3 px-4">
        <Link
          href={homeHref}
          className="flex min-w-0 items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green md:gap-3"
        >
          <Image
            src="/images/NetWalking-Logo.jpg"
            alt="NetWalking Logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            priority
          />
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-md border-2 border-green font-mono leading-none"
          >
            <span className="text-[9px] text-white/80">NW</span>
            <span className="text-xs font-semibold text-green">
              {latestWalkNumber}
            </span>
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span
              className={`truncate text-base font-bold ${
                locale === "ja"
                  ? "font-display-jp"
                  : "font-display-en font-expanded tracking-wide"
              }`}
            >
              {dict.header.stationName}
            </span>
            <span className="hidden truncate text-[10px] text-white/60 sm:block">
              {dict.header.stationNameAlt}
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <KmCounter />
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
