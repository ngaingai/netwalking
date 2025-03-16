import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
