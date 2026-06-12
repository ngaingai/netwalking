import Link from "next/link";
import { Linkedin, Users, Instagram, Facebook } from "lucide-react";
import { SiMeetup } from "react-icons/si";
import { HankoCta } from "@/components/hanko-cta";
import type { Locale } from "@/lib/i18n";

const socialLinks = {
  line: "https://lin.ee/nB41KHn",
  instagram: "https://www.instagram.com/_netwalking",
  facebook: "https://www.facebook.com/NetWalking.official/",
  meetup: "https://www.meetup.com/netwalking/",
  linkedin: "https://www.linkedin.com/company/netwalking",
  x: "https://x.com/_NetWalking",
  skool: "https://www.skool.com/glokyo-4028",
};

function XLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M18.9 3H22l-5.84 6.68L22.36 21h-6.5l-4.08-5.33L6 21H2.9l6.24-7.14L1.64 3H8.3l3.7 4.87L18.9 3Zm-1.14 16h1.79L7.2 5h-1.9l12.46 14Z" />
    </svg>
  );
}

function LineLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.77.063 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

interface FooterDict {
  footer: {
    stationLabel: string;
    stationLabelAlt: string;
    arrival: string;
    cta: string;
    tagline: string;
    producedBy: string;
    stayConnected: string;
    onlineCommunity: string;
    copyright: string;
  };
  playbook: {
    footerLink: string;
  };
}

export function Footer({ locale, dict }: { locale: Locale; dict: FooterDict }) {
  const t = dict.footer;

  return (
    <footer className="bg-sign text-white">
      <div className="container px-4 py-12 md:py-16">
        {/* 5.0km arrival station */}
        <div className="flex items-center gap-3 font-mono text-xs font-semibold tracking-wider text-green">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-green bg-sign"
          />
          <span>5.0km</span>
          <span>
            {t.stationLabel} / {t.stationLabelAlt}
          </span>
        </div>

        <p
          className={`mt-5 max-w-xl text-2xl font-bold leading-snug md:text-3xl ${
            locale === "ja"
              ? "font-display-jp"
              : "font-display-en font-expanded"
          }`}
        >
          {t.arrival}
        </p>

        <div className="mt-7">
          <HankoCta label={t.cta} />
        </div>

        <p className="mt-6 text-sm text-white/70">{t.tagline}</p>

        <hr className="my-10 border-white/10" />

        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/70">
              {t.producedBy}{" "}
              <a
                href="https://www.glokyo.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium !text-white/90 hover:underline"
              >
                Glokyo
              </a>
            </p>
            <Link
              href={locale === "ja" ? "/playbook" : "/en/playbook"}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green/50 px-4 py-2 text-sm font-medium !text-green transition-colors hover:bg-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              {dict.playbook.footerLink} &rarr;
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/50">
              {t.stayConnected}
            </p>
            <nav
              className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3 md:grid-cols-2"
              aria-label="Social links"
            >
              <Link href={socialLinks.line} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <LineLogo className="h-4 w-4 text-green" />
                <span>LINE</span>
              </Link>
              <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <Instagram className="h-4 w-4 text-green" />
                <span>Instagram</span>
              </Link>
              <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <Facebook className="h-4 w-4 text-green" />
                <span>Facebook</span>
              </Link>
              <Link href={socialLinks.meetup} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <SiMeetup className="h-4 w-4 text-green" />
                <span>Meetup</span>
              </Link>
              <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <Linkedin className="h-4 w-4 text-green" />
                <span>LinkedIn</span>
              </Link>
              <Link href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <XLogo className="h-4 w-4 text-green" />
                <span>X</span>
              </Link>
              <Link href={socialLinks.skool} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 !text-white/70 transition hover:!text-white">
                <Users className="h-4 w-4 text-green" />
                <span>{t.onlineCommunity}</span>
              </Link>
            </nav>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/50">
          &copy; {new Date().getFullYear()} NetWalking. {t.copyright}
        </p>
      </div>
    </footer>
  );
}
