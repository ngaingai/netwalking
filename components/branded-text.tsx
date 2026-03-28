import React from "react";

const BRAND_PATTERN = /(NetWalking|NiteWalking|NetRunning|NetChilling|Alex Ngai)/g;
const BRAND_PREFIX: Record<string, [string, string]> = {
  NetWalking: ["Net", "Walking"],
  NiteWalking: ["Nite", "Walking"],
  NetRunning: ["Net", "Running"],
  NetChilling: ["Net", "Chilling"],
};

/**
 * Renders a string with all occurrences of Net/Nite-branded names styled:
 * prefix in teal (#4cccc3), suffix in the inherited text color.
 */
export function BrandedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(BRAND_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part === "Alex Ngai") {
          return (
            <a key={i} href="https://www.linkedin.com/in/alex-ngai/" target="_blank" rel="noopener noreferrer" className="text-[#4cccc3] hover:underline">
              {part}
            </a>
          );
        }
        const brand = BRAND_PREFIX[part];
        return brand ? (
          <span key={i}>
            <span className="text-[#4cccc3]">{brand[0]}</span>{brand[1]}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </span>
  );
}
