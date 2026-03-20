"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocaleContext } from "@/components/i18n/LocaleProvider";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { withLocale } from "@/i18n/paths";

import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  const { locale, messages: m } = useLocaleContext();

  const nav = [
    { href: "/", label: m.navHome },
    { href: "/news", label: m.navNews },
    { href: "/reviews", label: m.navReviews },
    { href: "/videos", label: m.navVideos },
    { href: "/about", label: m.navAbout },
  ] as const;

  const socialItems = SOCIAL_LINKS.map((item) =>
    item.label === "Чат" ? { ...item, label: m.socialChat } : item,
  );

  return (
    <footer className="mt-auto border-t border-zinc-200/45 bg-zinc-50 transition-colors duration-300 ease-out dark:border-zinc-800/50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {SITE_NAME}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {m.siteDescription}
            </p>
          </div>
          <nav aria-label={m.footerNav} className="sm:self-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:justify-end">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={withLocale(locale, item.href)}
                    className="text-zinc-600 transition-[color,opacity] duration-200 ease-out hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-zinc-200/35 pt-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center dark:border-zinc-800/45">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 sm:justify-self-start">
            © {year} {SITE_NAME}
          </p>
          <LanguageSwitcher className="justify-self-start sm:justify-self-center" />
          <SocialLinks
            dense
            align="end"
            className="min-w-0 shrink justify-self-start sm:justify-self-end"
            links={socialItems}
            ariaLabel={m.socialNav}
          />
        </div>
      </div>
    </footer>
  );
}
