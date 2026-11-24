import fs from "fs";
import path from "path";
import type { Locale } from "./i18n";
import { getCompletedEventCount } from "./events";

const PLAYBOOK_DIR = path.join(process.cwd(), "content", "playbook");

export function getPlaybookContent(locale: Locale): string {
  const filename = locale === "ja" ? "playbook_jp.md" : "playbook.md";
  const filePath = path.join(PLAYBOOK_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return "";
  }

  // {{eventCount}} in the playbook text is the live combined event count
  return fs
    .readFileSync(filePath, "utf8")
    .replace(/\{\{eventCount\}\}/g, String(getCompletedEventCount()));
}
