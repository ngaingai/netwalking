import Link from "next/link";
import { Linkedin, Users } from "lucide-react";
import { ObfuscatedEmailLink } from "@/components/obfuscated-email-link";

const linkedinUrl = "https://www.linkedin.com/company/netwalking";
const xUrl = "https://x.com/_NetWalking";
const skoolUrl = "https://www.skool.com/glokyo-4028";
<<<<<<< HEAD
const accentClass = "text-[#4cccc3]";
=======
>>>>>>> origin/main

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M18.9 3H22l-5.84 6.68L22.36 21h-6.5l-4.08-5.33L6 21H2.9l6.24-7.14L1.64 3H8.3l3.7 4.87L18.9 3Zm-1.14 16h1.79L7.2 5h-1.9l12.46 14Z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
<<<<<<< HEAD
            <p className="text-2xl font-semibold text-primary">
              <span className={accentClass}>Net</span>Walking
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              <span className={accentClass}>一歩ずつ</span>、つながりを強く。
              <br />
              Building stronger relationships, <span className={accentClass}>step by step</span>.
=======
            <p className="text-2xl font-semibold text-primary">NetWalking</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              一歩ずつ、つながりを強く。
              <br />
              Building stronger relationships, step by step.
>>>>>>> origin/main
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Stay Connected
            </p>
            <nav className="flex flex-col gap-3 text-sm md:items-end">
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Link>
              <ObfuscatedEmailLink />
              <Link
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <XLogo className="h-4 w-4" />
                <span>Follow on X</span>
              </Link>
              <Link
                href={skoolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
              >
                <Users className="h-4 w-4" />
                <span>Skool Community</span>
              </Link>
            </nav>
            <p className="text-xs text-muted-foreground">
<<<<<<< HEAD
              © {new Date().getFullYear()} <span className={accentClass}>Net</span>Walking. All rights reserved.
=======
              © {new Date().getFullYear()} NetWalking. All rights reserved.
>>>>>>> origin/main
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

