import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetWalking | Professional Networking Walks",
  description:
    "Join NetWalking for professional networking events that combine walking and networking in Seattle. Connect with fellow professionals while exploring the city.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="relative flex min-h-screen flex-col">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
