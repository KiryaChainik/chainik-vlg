"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocaleContext } from "@/components/i18n/LocaleProvider";
import { SITE_NAME } from "@/lib/constants";
import { withLocale } from "@/i18n/paths";

import { headerNavLinkClasses } from "./nav-interactive";
import { KchLogo } from "./KchLogo";

const brandLink =
  "group flex shrink-0 items-center gap-2.5 rounded-lg py-0.5 pl-0.5 pr-1 -ml-0.5 text-sm font-semibold tracking-tight text-zinc-900 transition-[color,opacity] duration-200 ease-out hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200";

const logoClassName =
  "transition-[border-color,background-color,box-shadow] duration-200 ease-out group-hover:border-zinc-400/90 group-hover:shadow-md dark:group-hover:border-zinc-500 dark:group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";

export function Header() {
  const pathname = usePathname();
  const { locale, messages: m } = useLocaleContext();

  const nav = [
    { href: "/", label: m.navHome },
    { href: "/news", label: m.navNews },
    { href: "/reviews", label: m.navReviews },
    { href: "/videos", label: m.navVideos },
    { href: "/about", label: m.navAbout },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/45 bg-zinc-50/90 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ease-out dark:border-zinc-800/50 dark:bg-zinc-950/90 dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={withLocale(locale, "/")}
          className={brandLink}
          aria-label={`${SITE_NAME} — ${m.brandHome}`}
        >
          <KchLogo size="sm" className={logoClassName} />
          <span className="leading-none">{SITE_NAME}</span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-end gap-x-1 sm:gap-x-2"
          aria-label={m.mainNav}
        >
          {nav.map((item) => {
            const fullHref = withLocale(locale, item.href);
            const pathWithoutLocale =
              pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
            const itemPath = item.href;
            const active =
              itemPath === "/"
                ? pathWithoutLocale === "/" || pathWithoutLocale === ""
                : pathWithoutLocale === itemPath ||
                  pathWithoutLocale.startsWith(`${itemPath}/`);
            return (
              <Link
                key={item.href}
                href={fullHref}
                className={headerNavLinkClasses(active)}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
