import Link from "next/link";

import {
  MAIN_NAV,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200/45 bg-zinc-50 transition-colors duration-300 ease-out dark:border-zinc-800/50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {SITE_NAME}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {SITE_DESCRIPTION}
            </p>
          </div>
          <nav aria-label="Нижнее меню" className="sm:self-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:justify-end">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 transition-[color,opacity] duration-200 ease-out hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-zinc-200/35 pt-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8 dark:border-zinc-800/45">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year} {SITE_NAME}
          </p>
          <SocialLinks dense align="end" className="min-w-0 shrink" />
        </div>
      </div>
    </footer>
  );
}
