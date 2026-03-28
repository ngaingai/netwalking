import type { Metadata } from "next";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { getPlaybookContent } from "@/lib/playbook";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.playbook.title,
  };
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const content = getPlaybookContent(locale as Locale);
  if (!content) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="prose prose-gray mx-auto max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
      </article>
    </div>
  );
}

function markdownToHtml(md: string): string {
  // Simple markdown to HTML conversion for the playbook
  // Handles: headings, paragraphs, bold, italic, lists, hrs, links
  let html = md
    // Escape HTML entities first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Horizontal rules (before headings to avoid conflicts)
  html = html.replace(/^---$/gm, "<hr />");

  // Headings
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(
    /^- (.+)$/gm,
    "<li>$1</li>"
  );
  html = html.replace(
    /(<li>.*<\/li>\n?)+/g,
    (match) => `<ul>${match}</ul>`
  );

  // Ordered lists
  html = html.replace(
    /^\d+\. (.+)$/gm,
    "<li>$1</li>"
  );
  // Wrap consecutive <li> not already in <ul> into <ol>
  html = html.replace(
    /(?<!<\/ul>)(<li>.*<\/li>\n?)+/g,
    (match) => {
      if (!match.includes("<ul>")) {
        return `<ol>${match}</ol>`;
      }
      return match;
    }
  );

  // Links
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2">$1</a>'
  );

  // Paragraphs: wrap lines that aren't already tagged
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  // Brand treatment: prefix in teal, suffix in regular text color
  html = html
    .replace(/NetWalking/g, '<span class="text-[#4cccc3]">Net</span>Walking')
    .replace(/NiteWalking/g, '<span class="text-[#4cccc3]">Nite</span>Walking')
    .replace(/NetRunning/g, '<span class="text-[#4cccc3]">Net</span>Running')
    .replace(/NetChilling/g, '<span class="text-[#4cccc3]">Net</span>Chilling')
    .replace(/Alex Ngai/g, '<a href="https://www.linkedin.com/in/alex-ngai/" target="_blank" rel="noopener noreferrer" class="text-[#4cccc3] hover:underline">Alex Ngai</a>');

  return html;
}
