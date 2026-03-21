"use client";

import { InfiniteFeedTail, useInfiniteArticleFeed } from "@/components/article/infinite-feed";
import { useLocaleContext } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/i18n/config";
import type { Article } from "@/types/article";

import { HomeArticleTeaser } from "./HomeArticleTeaser";

type HomeColumnFeedProps = {
  kind: "news" | "reviews";
  locale: Locale;
  pageSize: number;
  initialItems: Article[];
  total: number;
};

export function HomeColumnFeed({
  kind,
  locale,
  pageSize,
  initialItems,
  total,
}: HomeColumnFeedProps) {
  const hrefBase = kind === "news" ? "/news" : "/reviews";
  const { messages: m } = useLocaleContext();
  const { items, hasMore, loading, error, sentinelRef, retry } =
    useInfiniteArticleFeed(kind, pageSize, initialItems, total);

  return (
    <>
      <ul className="mt-4 divide-y divide-y-[0.5px] divide-zinc-200/18 dark:divide-zinc-800/24">
        {items.map((item, index) => (
          <HomeArticleTeaser
            key={item.slug}
            item={item}
            hrefBase={hrefBase}
            locale={locale}
            /* Один приоритет на главной — первая новость (типичный LCP); обзоры без priority. */
            coverPriority={kind === "news" && index === 0}
          />
        ))}
      </ul>
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
