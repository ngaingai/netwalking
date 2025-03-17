import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetWalking",
  description: "Produced by Glokyo",
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
