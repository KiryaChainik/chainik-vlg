"use client";

import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/paths";
import { cn } from "@/lib/utils";

export type ArticleTagSection = "news" | "reviews";

type ArticleTagLinksProps = {
  tags: string[];
  section: ArticleTagSection;
  locale: Locale;
  size?: "sm" | "md";
  /** Спокойнее: для карточек списков, чтобы не перетягивать внимание с заголовка */
  tone?: "default" | "quiet";
  className?: string;
  tagsAriaLabel?: string;
};

const linkStyles = {
  sm: "rounded border border-zinc-200/80 bg-zinc-50/80 px-1.5 py-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600 no-underline transition-[color,background-color,border-color] duration-200 ease-out hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
  smQuiet:
    "rounded-md border border-zinc-200/55 bg-zinc-50/30 px-1.5 py-0.5 text-[10px] font-normal normal-case tracking-normal text-zinc-600 no-underline transition-[color,background-color,border-color] duration-200 ease-out hover:border-zinc-300/80 hover:bg-zinc-100/60 hover:text-zinc-800 dark:border-zinc-700/55 dark:bg-transparent dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/55 dark:hover:text-zinc-300",
  md: "rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 no-underline transition-[color,background-color] duration-200 ease-out hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50",
} as const;

export function ArticleTagLinks({
  tags,
  section,
  locale,
  size = "md",
  tone = "default",
  className,
  tagsAriaLabel = "Теги",
}: ArticleTagLinksProps) {
  if (tags.length === 0) return null;

  const prefix =
    section === "news" ? "/news/tag" : "/reviews/tag";

  const linkClass =
    size === "sm" && tone === "quiet"
      ? linkStyles.smQuiet
      : linkStyles[size];

  return (
    <ul
      className={cn(
        "flex flex-wrap gap-1.5",
        tone === "quiet" && "gap-1 opacity-95",
        className,
      )}
      aria-label={tagsAriaLabel}
    >
      {tags.map((tag, index) => (
        <li key={`${index}-${tag}`}>
          <Link
            href={withLocale(locale, `${prefix}/${encodeURIComponent(tag)}`)}
            className={linkClass}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
