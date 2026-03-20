/**
 * Оболочка карточки на главной: hover/active совпадают с ссылкой, но снаружи можно
 * разместить теги (отдельные ссылки) без вложенных ссылок друг в друге.
 */
export const ARTICLE_CARD_SHELL = [
  "group flex flex-col overflow-hidden rounded-xl border border-transparent bg-transparent origin-center",
  "transition-[color,transform,box-shadow,border-color,background-color] duration-[250ms] ease-out",
  "hover:-translate-y-0.5 hover:scale-[1.02] hover:border-zinc-200/70 hover:bg-zinc-50/60 hover:shadow-lg hover:shadow-zinc-900/[0.09]",
  "active:scale-[0.995] active:translate-y-0",
  "dark:hover:border-zinc-600/80 dark:hover:bg-zinc-900/50 dark:hover:shadow-xl dark:hover:shadow-black/35",
].join(" ");

/**
 * Списки новостей (/news): очень лёгкий hover — чуть фон и тень, без заметного scale.
 */
export const ARTICLE_CARD_SHELL_NEWS_LIST = [
  "group flex flex-col overflow-hidden rounded-xl border border-zinc-200/50 bg-white/55",
  "transition-[background-color,box-shadow,border-color,transform] duration-[250ms] ease-out",
  "hover:-translate-y-px hover:border-zinc-200/70 hover:bg-white/75 hover:shadow-sm hover:shadow-zinc-900/[0.05]",
  "active:translate-y-0",
  "dark:border-zinc-800/60 dark:bg-zinc-900/45",
  "dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900/58 dark:hover:shadow-md dark:hover:shadow-black/22",
].join(" ");

/** Ссылка на материал внутри ARTICLE_CARD_SHELL (только фокус-кольцо). */
export const ARTICLE_CARD_TEASER_LINK = [
  "relative z-10 block w-full min-w-0 cursor-pointer rounded-xl text-left",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
  "dark:focus-visible:ring-zinc-500/45 dark:focus-visible:ring-offset-zinc-950",
].join(" ");

/**
 * Общие стили кликабельной области карточки (главная + списки новостей/обзоров).
 */
export const ARTICLE_CARD_INTERACTIVE_LINK =
  [
    "group block cursor-pointer rounded-xl border border-transparent bg-transparent origin-center",
    "transition-[color,transform,box-shadow,border-color,background-color] duration-[250ms] ease-out",
    "hover:-translate-y-0.5 hover:scale-[1.02] hover:border-zinc-200/70 hover:bg-zinc-50/60 hover:shadow-lg hover:shadow-zinc-900/[0.09]",
    "active:scale-[0.995] active:translate-y-0",
    "dark:hover:border-zinc-600/80 dark:hover:bg-zinc-900/50 dark:hover:shadow-xl dark:hover:shadow-black/35",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
    "dark:focus-visible:ring-zinc-500/45 dark:focus-visible:ring-offset-zinc-950",
  ].join(" ");
