/* Station-code badge: rounded square, green border, series initials over number */
export function NwBadge({
  series,
  no,
  size = "default",
}: {
  series: string;
  no: string;
  size?: "default" | "large";
}) {
  const initials = (series.match(/[A-Z]/g) || ["N", "W"]).join("");
  const sizeClasses =
    size === "large" ? "h-14 w-14 rounded-lg border-[3px]" : "h-10 w-10 rounded-md border-2";
  const textClasses =
    size === "large"
      ? { code: "text-xs", num: "text-lg" }
      : { code: "text-[9px]", num: "text-sm" };

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 flex-col items-center justify-center border-green bg-white font-mono leading-none ${sizeClasses}`}
    >
      <span className={`${textClasses.code} text-slate`}>{initials}</span>
      <span className={`${textClasses.num} font-semibold text-green`}>
        {parseInt(no, 10)}
      </span>
    </span>
  );
}
