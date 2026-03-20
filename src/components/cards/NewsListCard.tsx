import Link from "next/link";

import { ArticleTagLinks } from "@/components/article";
import { ARTICLE_CARD_SHELL_NEWS_LIST } from "./article-card-interactive";
import { ArticleCoverThumb } from "@/components/cards/ArticleCoverThumb";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

type NewsListCardProps = {
  item: Article;
  showTags?: boolean;
};

function formatListDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsListCard({ item, showTags = true }: NewsListCardProps) {
  const fm = item.frontmatter;
  const cover = fm.cover;
  const hasTags = showTags && fm.tags.length > 0;

  const stretchLinkClass =
    "absolute inset-0 z-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-500/45 dark:focus-visible:ring-offset-zinc-950";

  return (
    <article className="border-b border-b-[0.5px] border-zinc-200/14 pb-4 last:border-b-0 dark:border-zinc-800/22 sm:pb-5">
      <div className={cn(ARTICLE_CARD_SHELL_NEWS_LIST, "relative cursor-pointer")}>
        <Link
          href={`/news/${item.slug}`}
          className={stretchLinkClass}
          aria-label={`Открыть материал: ${fm.title}`}
        />
        <div
          className={cn(
            "relative z-10 flex flex-col gap-3 pointer-events-none sm:flex-row sm:items-center sm:gap-6",
            "px-4 pt-3.5 pb-3.5 sm:px-5 sm:pt-4 sm:pb-4",
            hasTags ? "pb-2 sm:pb-2" : null,
          )}
        >
          {cover ? (
            <div className="w-full shrink-0 sm:w-[15.5rem] md:w-[17.75rem] lg:w-80">
              <ArticleCoverThumb
                src={cover}
                alt={fm.title}
                className="w-full"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </div>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-0">
            <h2 className="text-lg font-semibold leading-snug tracking-normal text-zinc-900 sm:text-xl group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
              {fm.title}
            </h2>
            <p className="mt-2 font-mono text-xs tabular-nums leading-none text-zinc-400/80 dark:text-zinc-500/85">
              <time dateTime={fm.date}>{formatListDate(fm.date)}</time>
              <span
                aria-hidden
                className="mx-1.5 text-zinc-300/70 dark:text-zinc-600/70"
              >
                ·
              </span>
              {fm.category}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-[1.55] text-zinc-600 dark:text-zinc-400">
              {fm.description}
            </p>
          </div>
        </div>
        {hasTags ? (
          <ArticleTagLinks
            className="relative z-20 px-4 pb-2.5 pt-2 pointer-events-auto sm:px-5 sm:pb-3"
            tags={fm.tags}
            section="news"
            size="sm"
            tone="quiet"
          />
        ) : null}
      </div>
    </article>
  );
}
