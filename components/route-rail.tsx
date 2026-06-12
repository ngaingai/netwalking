"use client";

import { useEffect, useState } from "react";

export function RouteRail() {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFill(100);
      return undefined;
    }

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setFill(pct * 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[25px] w-0.5 md:left-[43px]"
    >
      <div className="absolute inset-0 bg-green/15" />
      <div
        className="absolute inset-x-0 top-0 bg-green"
        style={{ height: `${fill}%` }}
      />
    </div>
  );
}
