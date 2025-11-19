"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const userCharCodes = [104, 101, 108, 108, 111];
const domainCharCodes = [
  110, 101, 116, 119, 97, 108, 107, 105, 110, 103, 46, 110, 101, 116,
];

function decodeCharCodes(codes: number[]) {
  return String.fromCharCode(...codes);
}

export function ObfuscatedEmailLink({
  className,
}: {
  className?: string;
}) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = decodeCharCodes(userCharCodes);
    const domain = decodeCharCodes(domainCharCodes);
    setEmail(`${user}@${domain}`);
  }, []);

  const combinedClassName = cn(
    "flex items-center gap-2 text-muted-foreground transition hover:text-primary",
    className,
  );

  if (!email) {
    return (
      <span className={combinedClassName}>
        <Mail className="h-4 w-4 animate-pulse" style={{ color: "#4cccc3" }} />
        <span>Loading…</span>
      </span>
    );
  }

  return (
    <Link href={`mailto:${email}`} className={combinedClassName}>
      <Mail className="h-4 w-4" style={{ color: "#4cccc3" }} />
      <span>{email}</span>
    </Link>
  );
}

