import {
  Archivo,
  IBM_Plex_Mono,
  Zen_Kaku_Gothic_New,
  Zen_Maru_Gothic,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const displayJp = Zen_Maru_Gothic({
  weight: ["700", "900"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-display-jp",
});

const displayEn = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-display-en",
});

const body = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_URL = "https://netwalking.net";

export const metadata: Metadata = {
  title: {
    default: "NetWalking",
    template: "%s | NetWalking",
  },
  description:
    "名刺より、5km。東京を歩く、月1回のコミュニティ。売り込みなし。予約不要。参加無料。",
  icons: {
    icon: [{ url: "/images/NetWalking-Logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/images/NetWalking-Logo.jpg", type: "image/jpeg" }],
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`scroll-smooth ${displayJp.variable} ${displayEn.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
