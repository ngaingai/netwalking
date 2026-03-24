import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const SITE_URL = "https://netwalking.net";

export const metadata: Metadata = {
  title: {
    default: "NetWalking",
    template: "%s | NetWalking",
  },
  description:
    "NetWalking produces bilingual walking meetups and outdoor networking events across Tokyo.",
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
    <html lang="ja" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
