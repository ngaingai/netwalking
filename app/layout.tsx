import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
<<<<<<< HEAD
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
=======

export const metadata: Metadata = {
  title: "NetWalking",
  description: "Produced by Glokyo",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
>>>>>>> origin/main
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NetWalking",
    url: SITE_URL,
    logo: `${SITE_URL}/images/NetWalking-Logo.jpg`,
    description:
      "NetWalking hosts bilingual community walks and networking events for globally minded families, founders, and freelancers in Tokyo.",
    sameAs: [
      "https://www.linkedin.com/company/netwalking",
      "https://x.com/_NetWalking",
      "https://www.skool.com/glokyo-4028",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@netwalking.net",
        contactType: "customer support",
        areaServed: "JP",
        availableLanguage: ["en", "ja"],
      },
    ],
  };

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
