export const locales = ["ja", "en"] as const;
export const defaultLocale = "ja";

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

const dictionaries = {
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export function localized<T extends object>(
  obj: T,
  field: keyof T & string,
  locale: Locale,
): string {
  const record = obj as Record<string, unknown>;
  if (locale === "ja") {
    const jpValue = record[`${field}Jp`];
    if (typeof jpValue === "string" && jpValue) return jpValue;
  }
  const value = record[field];
  return typeof value === "string" ? value : "";
}
