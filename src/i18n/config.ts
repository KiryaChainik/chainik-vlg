export const LOCALES = ["ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
