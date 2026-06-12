export function Station({
  km,
  label,
  id,
  children,
  className,
}: {
  km: string;
  label?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative pl-[52px] pr-4 md:pl-[88px] md:pr-8 ${className ?? ""}`}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-12 flex w-[52px] flex-col items-center gap-1 md:top-16 md:w-[88px]"
      >
        <span className="h-3.5 w-3.5 rounded-full border-[3px] border-green bg-paper" />
        <span className="font-mono text-[10px] font-semibold text-green md:text-xs">
          {km}
        </span>
        {label && (
          <span className="text-center font-mono text-[10px] text-slate">
            {label}
          </span>
        )}
      </div>
      <div className="mx-auto w-full max-w-2xl py-10 md:py-14">{children}</div>
    </section>
  );
}

export function SectionHeading({
  text,
  alt,
  locale,
}: {
  text: string;
  alt: string;
  locale: string;
}) {
  return (
    <div className="mb-6">
      <h2
        className={`text-2xl font-bold md:text-3xl ${
          locale === "ja" ? "font-display-jp" : "font-display-en font-expanded"
        }`}
      >
        {text}
      </h2>
      <p
        aria-hidden="true"
        className="mt-1 text-xs tracking-wide text-slate"
      >
        {alt}
      </p>
    </div>
  );
}
