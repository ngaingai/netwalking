export function ExternalLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
}
