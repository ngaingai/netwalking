import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { Linkedin, Users, Instagram, Facebook } from "lucide-react";
import { SiMeetup } from "react-icons/si";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";

const linkedinUrl = "https://www.linkedin.com/company/netwalking";
const xUrl = "https://x.com/_NetWalking";
const skoolUrl = "https://www.skool.com/glokyo-4028";
const meetupUrl = "https://www.meetup.com/netwalking/";
const instagramUrl = "https://www.instagram.com/_netwalking";
const lineUrl = "https://lin.ee/nB41KHn";
const facebookUrl = "https://www.facebook.com/NetWalking.official/";
const accentClass = "text-[#4cccc3]";

function XLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        fill="currentColor"
        d="M18.9 3H22l-5.84 6.68L22.36 21h-6.5l-4.08-5.33L6 21H2.9l6.24-7.14L1.64 3H8.3l3.7 4.87L18.9 3Zm-1.14 16h1.79L7.2 5h-1.9l12.46 14Z"
      />
    </svg>
  );
}

function LineLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        fill="currentColor"
        d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.77.063 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
      />
    </svg>
  );
}


export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8">
          {/* Column 1: Logo and Tagline */}
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-primary">
              <span className={accentClass}>Net</span>
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
              <span className={accentClass}>一歩ずつ</span>、つながりを強く。
              <br />
              Building stronger relationships, <span className={accentClass}>step by step</span>.
            </p>
          </div>
          
          {/* Column 2: Blurb (Middle) */}
          <div className="max-w-sm space-y-2 text-sm text-muted-foreground">
            <p>
              <span className={accentClass}>Net</span>
              <span className="text-muted-foreground">Walking</span>
              は、東京で毎月集まって歩くコミュニティです。
              <br />
              つながり、会話、ちょっとした冒険を一緒に。
              <br />
              いつでも自由に参加できます。
            </p>
            <p>
              <span className={accentClass}>Net</span>
              <span className="text-muted-foreground">Walking</span>
              {" "}is a monthly walk in Tokyo. We're a community that connects, converses, and explores the city together. Always friendly, always free!
            </p>
          </div>
          
          {/* Column 3: Social Links */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Stay Connected
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <LineLogo className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>LINE</span>
              </Link>
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Instagram className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>Instagram</span>
              </Link>
              <Link
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Facebook className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>Facebook</span>
              </Link>
              <Link
                href={meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <SiMeetup className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>Meetup</span>
              </Link>
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Linkedin className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>LinkedIn</span>
              </Link>
              <Link
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <XLogo className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>Follow on X</span>
              </Link>
              <Link
                href={skoolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Users className="h-4 w-4" style={{ color: "#4cccc3" }} />
                <span>Skool Community</span>
              </Link>
              <ObfuscatedEmailLink />
            </nav>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} <span className={accentClass}>Net</span>
              <span className="text-muted-foreground">Walking</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

