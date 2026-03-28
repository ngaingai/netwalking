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
        <div className="flex items-center gap-3">
          <Link
            href={locale === "ja" ? "/playbook" : "/en/playbook"}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#4cccc3]/30 bg-[#4cccc3]/10 px-3 py-1.5 text-xs font-medium text-[#4cccc3] transition-colors hover:bg-[#4cccc3]/20"
          >
            {locale === "ja" ? "自分で始める" : "Start your own"} &rarr;
          </Link>
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}
