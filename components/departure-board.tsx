interface DepartureBoardProps {
  cancelledRows: string[];
  onTimeRow: string;
  cancelledLabel: string;
  cancelledLabelAlt: string;
  onTimeLabel: string;
  onTimeLabelAlt: string;
  /* "board" is the dark sign panel; "plain" is the fallback Alex may prefer */
  variant?: "board" | "plain";
}

export function DepartureBoard({
  cancelledRows,
  onTimeRow,
  cancelledLabel,
  cancelledLabelAlt,
  onTimeLabel,
  onTimeLabelAlt,
  variant = "board",
}: DepartureBoardProps) {
  if (variant === "plain") {
    return (
      <ul className="flex flex-col gap-3 text-lg">
        {cancelledRows.map((row) => (
          <li key={row} className="board-strike text-slate">
            {row}
          </li>
        ))}
        <li className="font-bold text-green">{onTimeRow}</li>
      </ul>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-sign shadow-md">
      <ul className="flex flex-col">
        {cancelledRows.map((row) => (
          <li
            key={row}
            className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 md:gap-4 md:px-6"
          >
            <span className="shrink-0 font-mono text-[10px] font-semibold tracking-wider text-vermillion md:text-xs">
              {cancelledLabel} / {cancelledLabelAlt}
            </span>
            <span className="board-strike text-base text-white/60 md:text-lg">
              {row}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-3 px-4 py-4 md:gap-4 md:px-6">
          <span className="shrink-0 font-mono text-[10px] font-semibold tracking-wider text-green md:text-xs">
            {onTimeLabel} / {onTimeLabelAlt}
          </span>
          <span className="text-base font-bold text-white md:text-lg">
            {onTimeRow}
          </span>
        </li>
      </ul>
    </div>
  );
}
