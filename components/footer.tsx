import Link from "next/link";
import Image from "next/image";
import { Linkedin, Users, Instagram, Facebook } from "lucide-react";
import { SiMeetup } from "react-icons/si";
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

function XLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path fill="currentColor" d="M18.9 3H22l-5.84 6.68L22.36 21h-6.5l-4.08-5.33L6 21H2.9l6.24-7.14L1.64 3H8.3l3.7 4.87L18.9 3Zm-1.14 16h1.79L7.2 5h-1.9l12.46 14Z" />
    </svg>
  );
}

function LineLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.77.063 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

interface FooterDict {
  footer: {
    producedBy: string;
    stayConnected: string;
    onlineCommunity: string;
    blurb: string;
    copyright: string;
  };
  playbook: {
    footerLink: string;
  };
}

export function Footer({ locale, dict }: { locale: Locale; dict: FooterDict }) {
  const t = dict.footer;
  const iconColor = { color: "#4cccc3" };

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8">
          {/* Column 1: Logo and Tagline */}
          <div className="space-y-2">
            <p className="text-2xl font-semibold">
              <span className="text-[#4cccc3]">Net</span>
              <span className="text-muted-foreground">Walking</span>
            </p>
            <Image
              src="/images/NetWalking-Logo.jpg"
              alt="NetWalking Logo"
              width={175}
              height={117}
              className="w-[175px] h-auto"
            />
            <p className="max-w-sm text-sm text-muted-foreground">
              {t.blurb}
            </p>
          </div>

          {/* Column 2: Produced by + Playbook */}
          <div className="flex flex-col justify-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {t.producedBy}{" "}
              <a
                href="https://www.glokyo.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Glokyo
              </a>
            </p>
            <Link
              href={locale === "ja" ? "/playbook" : "/en/playbook"}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {dict.playbook.footerLink} &rarr;
            </Link>
          </div>

          {/* Column 3: Social Links */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {t.stayConnected}
            </p>
            <nav className="flex flex-col gap-2 text-sm" aria-label="Social links">
              <Link href={socialLinks.line} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <LineLogo className="h-4 w-4" style={iconColor} />
                <span>LINE</span>
              </Link>
              <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <Instagram className="h-4 w-4" style={iconColor} />
                <span>Instagram</span>
              </Link>
              <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <Facebook className="h-4 w-4" style={iconColor} />
                <span>Facebook</span>
              </Link>
              <Link href={socialLinks.meetup} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <SiMeetup className="h-4 w-4" style={iconColor} />
                <span>Meetup</span>
              </Link>
              <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <Linkedin className="h-4 w-4" style={iconColor} />
                <span>LinkedIn</span>
              </Link>
              <Link href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <XLogo className="h-4 w-4" style={iconColor} />
                <span>X</span>
              </Link>
              <Link href={socialLinks.skool} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                <Users className="h-4 w-4" style={iconColor} />
                <span>{t.onlineCommunity}</span>
              </Link>
            </nav>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} NetWalking. {t.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
