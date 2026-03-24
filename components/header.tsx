import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import type { Locale } from "@/lib/i18n";

export function Header({ locale }: { locale: Locale }) {
  const homeHref = locale === "ja" ? "/" : "/en";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={homeHref} className="flex items-center space-x-2">
          <Image
            src="/images/NetWalking-Logo.jpg"
            alt="NetWalking Logo"
            width={120}
            height={80}
            className="h-10 w-auto"
            priority
          />
          <span className="font-bold">
            <span style={{ color: "#4cccc3" }}>Net</span>
            <span className="text-muted-foreground">Walking</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            Produced by{" "}
            <a
              href="https://www.glokyo.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Glokyo
            </a>
          </span>
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
