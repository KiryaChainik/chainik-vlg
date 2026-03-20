"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeNavLinkClasses } from "@/components/layout/nav-interactive";
import type { Locale } from "@/i18n/config";
import { LOCALE_COOKIE } from "@/i18n/config";
import { pathnameWithLocale } from "@/i18n/paths";
import { cn } from "@/lib/utils";

import { useLocaleContext } from "./LocaleProvider";

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const { locale, messages: m } = useLocaleContext();

  const ruHref = pathnameWithLocale(pathname, "ru");
  const enHref = pathnameWithLocale(pathname, "en");

  return (
    <nav
      aria-label={m.language}
      className={cn(
        "inline-flex flex-wrap items-center gap-x-1.5 text-xs text-zinc-500 dark:text-zinc-500",
        className,
      )}
    >
      {locale === "ru" ? (
        <span className={cn(localeNavLinkClasses(true), "cursor-default")}>
          {m.languageRu}
        </span>
      ) : (
        <Link
          href={ruHref}
          hrefLang="ru"
          className={localeNavLinkClasses(false)}
          prefetch={false}
          onClick={() => persistLocale("ru")}
        >
          {m.languageRu}
        </Link>
      )}
      <span
        aria-hidden
        className="select-none text-zinc-300 dark:text-zinc-600"
      >
        ·
      </span>
      {locale === "en" ? (
        <span className={cn(localeNavLinkClasses(true), "cursor-default")}>
          {m.languageEn}
        </span>
      ) : (
        <Link
          href={enHref}
          hrefLang="en"
          className={localeNavLinkClasses(false)}
          prefetch={false}
          onClick={() => persistLocale("en")}
        >
          {m.languageEn}
        </Link>
      )}
    </nav>
  );
}
