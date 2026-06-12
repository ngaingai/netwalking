/* Vermillion 完歩 hanko, pure CSS, stamped on completed walks */
export function KanpoStamp({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-flex -rotate-12 select-none items-center justify-center rounded-full border-[3px] border-vermillion font-display-jp font-bold text-vermillion opacity-75 ${className}`}
    >
      {label}
    </span>
  );
}
