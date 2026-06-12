"use client";

import { useEffect, useState } from "react";

export function KmCounter() {
  const [km, setKm] = useState("0.0");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setKm("5.0");
      return undefined;
    }

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setKm((pct * 5).toFixed(1));
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
    <span
      className="font-mono text-sm font-semibold tabular-nums text-green"
      aria-hidden="true"
    >
      {km}km
    </span>
  );
}
