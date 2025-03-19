import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetWalking",
  description: "Produced by Glokyo",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-xs p-1 text-center">
            Debug: Header should be below
          </div>
          <Header />
        </div>
        <main className="relative flex min-h-screen flex-col">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
