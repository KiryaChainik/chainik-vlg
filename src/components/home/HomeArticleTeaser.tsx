"use client";

import Link from "next/link";

import { ArticleTagLinks } from "@/components/article/ArticleTagLinks";
import {
  ARTICLE_CARD_SHELL,
  ARTICLE_CARD_TEASER_LINK,
  ArticleCoverThumb,
} from "@/components/cards";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { formatShortDate } from "@/lib/format-date";
import { stripTelegramSpoilerMarkers, TelegramSpoilerAsItalic } from "@/lib/telegram-text";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

const HOME_TEASER_IMAGE_SIZES =
  "(max-width: 1024px) 100vw, (max-width: 1536px) 48vw, 720px";

type HomeArticleTeaserProps = {
  item: Article;
  hrefBase: "/news" | "/reviews";
  locale: Locale;
  coverPriority?: boolean;
};

export function HomeArticleTeaser({
  item,
  hrefBase,
  locale,
  coverPriority = false,
}: HomeArticleTeaserProps) {
  const fm = item.frontmatter;
  const cover = fm.cover;
  const tagSection = hrefBase === "/news" ? "news" : "reviews";
  const msgs = getMessages(locale);

  return (
    <li className="py-4 first:pt-0">
      <div className={cn(ARTICLE_CARD_SHELL, "px-0")}>
        <Link
          href={withLocale(locale, `${hrefBase}/${item.slug}`)}
          className={ARTICLE_CARD_TEASER_LINK}
        >
          <div className="flex flex-col gap-0">
            <ArticleCoverThumb
              src={cover}
              alt={stripTelegramSpoilerMarkers(fm.title)}
              className="w-full !rounded-t-xl !rounded-b-none border-x-0 border-t-0 border-b border-zinc-200 dark:border-zinc-800"
              sizes={HOME_TEASER_IMAGE_SIZES}
              priority={coverPriority}
            />
            <div
              className={cn(
                "min-w-0 px-3 pt-3",
                fm.tags.length === 0 && "pb-3",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-normal text-zinc-900 group-hover:text-zinc-800 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                  <TelegramSpoilerAsItalic text={fm.title} />
                </h3>
                <time
                  dateTime={fm.date}
                  className="shrink-0 font-mono text-xs tabular-nums leading-none text-zinc-400/80 dark:text-zinc-500/85"
                >
                  {formatShortDate(fm.date, locale)}
                </time>
              </div>
              {fm.description.trim() ? (
                <p className="mt-2 line-clamp-2 text-sm leading-[1.72] text-zinc-600 dark:text-zinc-300/95">
                  <TelegramSpoilerAsItalic text={fm.description} />
                </p>
              ) : null}
            </div>
          </div>
        </Link>
        {fm.tags.length > 0 ? (
          <ArticleTagLinks
            className="relative z-20 px-3 pb-3 pt-2"
            tags={fm.tags.slice(0, 4)}
            section={tagSection}
            locale={locale}
            size="sm"
            tone="quiet"
            tagsAriaLabel={msgs.tagListAria}
          />
        ) : null}
      </div>
    </li>
  );
}
