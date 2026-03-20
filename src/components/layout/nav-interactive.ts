import { cn } from "@/lib/utils";

/**
 * Общий «объёмный» интерактив для пунктов меню: фон + лёгкая рамка и тень,
 * как у ссылок «Все новости / Все обзоры» на главной.
 */
export const navInteractiveFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-500/50 dark:focus-visible:ring-offset-zinc-950";

export const navInteractiveBase =
  "rounded-lg border border-transparent transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out";

export const navInteractiveHover =
  "text-zinc-600 hover:-translate-y-px hover:border-zinc-300/80 hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-sm hover:shadow-zinc-900/8 active:scale-[0.98] dark:text-zinc-400 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/85 dark:hover:text-zinc-100 dark:hover:shadow-md dark:hover:shadow-black/25";

/** Текущая страница в шапке — чуть насыщеннее ховера, без инверсии цвета текста. */
export const navInteractiveActive =
  "border-zinc-300/90 bg-zinc-100 font-semibold text-zinc-900 shadow-sm shadow-zinc-900/6 dark:border-zinc-600/50 dark:bg-zinc-800/75 dark:text-zinc-50 dark:shadow-md dark:shadow-black/20";

export function headerNavLinkClasses(active: boolean) {
  return cn(
    navInteractiveBase,
    navInteractiveFocus,
    "px-3 py-2 text-xs font-medium sm:text-sm",
    active ? navInteractiveActive : navInteractiveHover,
  );
}

export function localeNavLinkClasses(active: boolean) {
  return cn(
    navInteractiveBase,
    navInteractiveFocus,
    "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
    active ? navInteractiveActive : navInteractiveHover,
  );
}
