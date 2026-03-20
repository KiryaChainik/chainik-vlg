"use client";

import { ArticleListCard } from "@/components/cards/ArticleListCard";
import { NewsListCard } from "@/components/cards/NewsListCard";
import { useLocaleContext } from "@/components/i18n/LocaleProvider";
import type { NewsDatePeriod } from "@/lib/content/articles";
import type { Locale } from "@/i18n/config";
import type { Article } from "@/types/article";

import { InfiniteFeedTail, useInfiniteArticleFeed } from "./infinite-feed";

type ArticleFeedProps = {
  kind: "news" | "reviews";
  locale: Locale;
  pageSize: number;
  initialItems: Article[];
  total: number;
  /** Только для kind === "news": фильтр по дате (должен совпадать с query на странице). */
  newsPeriod?: NewsDatePeriod | null;
};

export function ArticleFeed({
  kind,
  locale,
  pageSize,
  initialItems,
  total,
  newsPeriod = null,
}: ArticleFeedProps) {
  const { messages: m } = useLocaleContext();
  const { items, hasMore, loading, error, sentinelRef, retry } =
    useInfiniteArticleFeed(
      kind,
      pageSize,
      initialItems,
      total,
      kind === "news" ? newsPeriod : null,
    );

  return (
    <>
      <div className="mt-8">
        {items.map((item) =>
          kind === "news" ? (
            <NewsListCard key={item.slug} item={item} locale={locale} />
          ) : (
            <ArticleListCard
              key={item.slug}
              item={item}
              locale={locale}
              hrefBase="/reviews"
            />
          ),
        )}
      </div>
      <InfiniteFeedTail
        hasMore={hasMore}
        loading={loading}
        error={error}
        feedLoading={m.feedLoading}
        feedLoadError={m.feedLoadError}
        sentinelRef={sentinelRef}
        onRetry={retry}
      />
    </>
  );
}
