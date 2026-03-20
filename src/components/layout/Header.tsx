"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { KchLogo } from "./KchLogo";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/news", label: "Новости" },
  { href: "/reviews", label: "Обзоры" },
  { href: "/videos", label: "Видео" },
  { href: "/about", label: "О проекте" },
] as const;

const brandLink =
  "group flex shrink-0 items-center gap-2.5 rounded-lg py-0.5 pl-0.5 pr-1 -ml-0.5 text-sm font-semibold tracking-tight text-zinc-900 transition-[color,opacity] duration-200 ease-out hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200";

const logoClassName =
  "transition-[border-color,background-color,box-shadow] duration-200 ease-out group-hover:border-zinc-400/90 group-hover:shadow-md dark:group-hover:border-zinc-500 dark:group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";

const navLinkBase =
  "relative rounded-lg border border-transparent px-3 py-2 text-xs font-medium transition-[color,background-color,box-shadow,transform,border-color] duration-200 ease-out sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-500/50 dark:focus-visible:ring-offset-zinc-950";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/45 bg-zinc-50/90 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ease-out dark:border-zinc-800/50 dark:bg-zinc-950/90 dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={brandLink}
          aria-label={`${SITE_NAME} — на главную`}
        >
          <KchLogo size="sm" className={logoClassName} />
          <span className="leading-none">{SITE_NAME}</span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-end gap-x-1 sm:gap-x-2"
          aria-label="Основное меню"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navLinkBase,
                  active
                    ? "border-zinc-900/15 bg-zinc-900 font-semibold text-white shadow-md ring-1 ring-black/10 dark:border-zinc-500/25 dark:bg-zinc-700 dark:font-semibold dark:text-zinc-50 dark:shadow-inner dark:ring-2 dark:ring-white/14"
                    : "text-zinc-600 hover:-translate-y-px hover:bg-zinc-100 hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/85 dark:hover:text-zinc-100",
                )}
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
