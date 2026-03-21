import Link from "next/link";

import { ArticleTagLinks } from "@/components/article";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import type { Article } from "@/types/article";
import { formatShortDate } from "@/lib/format-date";
import { stripTelegramSpoilerMarkers, TelegramSpoilerAsItalic } from "@/lib/telegram-text";
import { cn } from "@/lib/utils";

import { ARTICLE_CARD_SHELL_NEWS_LIST } from "./article-card-interactive";
import { ArticleCoverThumb } from "@/components/cards/ArticleCoverThumb";

type ArticleListCardProps = {
  item: Article;
  locale: Locale;
  hrefBase: "/news" | "/reviews";
  showTags?: boolean;
  coverPriority?: boolean;
};

const stretchLinkClass =
  "absolute inset-0 z-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-500/45 dark:focus-visible:ring-offset-zinc-950";

export function ArticleListCard({
  item,
  locale,
  hrefBase,
  showTags = true,
  coverPriority = false,
}: ArticleListCardProps) {
  const fm = item.frontmatter;
  const cover = fm.cover;
  const tagSection = hrefBase === "/news" ? "news" : "reviews";
  const hasTags = showTags && fm.tags.length > 0;
  const m = getMessages(locale);

  return (
    <article className="border-b border-b-[0.5px] border-zinc-200/14 pb-4 last:border-b-0 dark:border-zinc-800/22 sm:pb-5">
      <div className={cn(ARTICLE_CARD_SHELL_NEWS_LIST, "relative cursor-pointer")}>
        <Link
          href={withLocale(locale, `${hrefBase}/${item.slug}`)}
          className={stretchLinkClass}
          aria-label={`${m.openArticle}: ${stripTelegramSpoilerMarkers(fm.title)}`}
        />
        <div className="relative z-10 flex flex-col pointer-events-none">
          <ArticleCoverThumb
            src={cover}
            alt={stripTelegramSpoilerMarkers(fm.title)}
            className="w-full !rounded-t-xl !rounded-b-none border-x-0 border-t-0 border-b border-zinc-200 dark:border-zinc-800"
            sizes="(max-width: 768px) 100vw, 896px"
            priority={coverPriority}
          />
          <div
            className={cn(
              "px-4 pt-3.5 pb-3.5 sm:px-5 sm:pt-4 sm:pb-4",
              hasTags ? "pb-2 sm:pb-2" : null,
            )}
          >
            <h2 className="text-lg font-semibold leading-snug tracking-normal text-zinc-900 sm:text-xl group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
              <TelegramSpoilerAsItalic text={fm.title} />
            </h2>
            <p className="mt-2 font-mono text-xs tabular-nums leading-none text-zinc-400/80 dark:text-zinc-500/85">
              <time dateTime={fm.date}>{formatShortDate(fm.date, locale)}</time>
              <span
                aria-hidden
                className="mx-1.5 text-zinc-300/70 dark:text-zinc-600/70"
              >
                ·
              </span>
              {fm.category}
            </p>
            {fm.description.trim() ? (
              <p className="mt-3 line-clamp-2 text-sm leading-[1.55] text-zinc-600 dark:text-zinc-400">
                <TelegramSpoilerAsItalic text={fm.description} />
              </p>
            ) : null}
          </div>
        </div>
        {hasTags ? (
          <ArticleTagLinks
            className="relative z-20 px-4 pb-2.5 pt-2 pointer-events-auto sm:px-5 sm:pb-3"
            tags={fm.tags}
            section={tagSection}
            locale={locale}
            size="sm"
            tone="quiet"
            tagsAriaLabel={m.tagListAria}
          />
        ) : null}
      </div>
    </article>
  );
}
