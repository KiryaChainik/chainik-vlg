import type { Locale } from "@/i18n/config";
import { intlLocaleFor } from "@/i18n/messages";

const shortDateOpts: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

/** Короткая дата для тизеров и списков (локаль из сегмента сайта). */
export function formatShortDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(intlLocaleFor(locale), shortDateOpts);
}

/** Длинная дата для шапки статьи. */
export function formatLongDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(intlLocaleFor(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Короткая дата в стиле тизеров главной: «19 мар. 2025 г.» */
export function formatShortRuDate(iso: string): string {
  return formatShortDate(iso, "ru");
}
