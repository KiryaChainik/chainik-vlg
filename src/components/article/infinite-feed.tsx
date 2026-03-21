"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { NewsDatePeriod } from "@/lib/content/articles";
import type { Article } from "@/types/article";

type FeedKind = "news" | "reviews";

type FeedResponse = { items: Article[]; total: number };

export function useInfiniteArticleFeed(
  kind: FeedKind,
  pageSize: number,
  initialItems: Article[],
  total: number,
  newsPeriod?: NewsDatePeriod | null,
) {
  const [items, setItems] = useState<Article[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const offsetRef = useRef(initialItems.length);
  const loadingRef = useRef(false);
  const errorRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = items.length < total;

  const loadMore = useCallback(async () => {
    if (offsetRef.current >= total || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    errorRef.current = false;
    try {
      const path = kind === "news" ? "/api/news/feed" : "/api/reviews/feed";
      const params = new URLSearchParams({
        offset: String(offsetRef.current),
        limit: String(pageSize),
      });
      if (kind === "news" && newsPeriod != null) {
        params.set("period", newsPeriod);
      }
      const res = await fetch(`${path}?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as FeedResponse;
      if (!Array.isArray(data.items)) throw new Error("invalid payload");
      if (data.items.length === 0) {
        offsetRef.current = total;
        return;
      }
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.slug));
        const fresh = data.items.filter((item) => !seen.has(item.slug));
        return [...prev, ...fresh];
      });
      offsetRef.current += data.items.length;
    } catch {
      errorRef.current = true;
      setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [kind, newsPeriod, pageSize, total]);

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          !errorRef.current &&
          !loadingRef.current
        ) {
          void loadMoreRef.current();
        }
      },
      { rootMargin: "320px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  const retry = useCallback(() => {
    errorRef.current = false;
    setError(false);
    void loadMore();
  }, [loadMore]);

  return { items, hasMore, loading, error, sentinelRef, retry };
}

type InfiniteFeedTailProps = {
  hasMore: boolean;
  loading: boolean;
  error: boolean;
  feedLoading: string;
  feedLoadError: string;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onRetry: () => void;
};

export function InfiniteFeedTail({
  hasMore,
  loading,
  error,
  feedLoading,
  feedLoadError,
  sentinelRef,
  onRetry,
}: InfiniteFeedTailProps) {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div
        ref={sentinelRef}
        className="h-1 w-full max-w-xs"
        aria-hidden
      />
      {loading ? (
        <p
          className="text-xs text-zinc-500 dark:text-zinc-400"
          role="status"
          aria-live="polite"
        >
          {feedLoading}
        </p>
      ) : null}
      {error ? (
        <button
          type="button"
          className="text-xs font-medium text-zinc-700 underline decoration-zinc-400/80 underline-offset-2 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-zinc-100"
          onClick={onRetry}
        >
          {feedLoadError}
        </button>
      ) : null}
    </div>
  );
}
