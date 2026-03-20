import type { Locale } from "./config";
import { isLocale } from "./config";

export function withLocale(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return `/${locale}`;
  return `/${locale}${p}`;
}

/** Убирает префикс /ru или /en из pathname Next.js (например /ru/news → /news). */
export function stripLocalePrefix(pathname: string): string {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length && isLocale(segs[0]!)) {
    const rest = segs.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function pathnameWithLocale(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  return withLocale(locale, base);
}

export function localeFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return null;
}
