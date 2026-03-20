import type { Locale } from "./config";

/** Предпочтительная локаль из Accept-Language: en*, если в списке есть английский выше других совпадений. */
export function localeFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage?.trim()) return "ru";

  const parts = acceptLanguage.split(",").map((p) => p.trim().split(";")[0]!.toLowerCase());
  for (const lang of parts) {
    if (lang.startsWith("en")) return "en";
    if (
      lang.startsWith("ru") ||
      lang.startsWith("uk") ||
      lang.startsWith("be") ||
      lang.startsWith("kk")
    ) {
      return "ru";
    }
  }

  return "ru";
}
