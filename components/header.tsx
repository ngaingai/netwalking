import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/NetWalking-Logo2.png"
            alt="NetWalking Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-bold">
            <span style={{ color: "#4cccc3" }}>Net</span>Walking
          </span>
        </Link>
        <span className="text-sm text-muted-foreground">
          Produced by{" "}
          <a
            href="https://www.glokyo.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Glokyo
          </a>
        </span>
      </div>
    </header>
  );
}
