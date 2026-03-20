import type { Metadata } from "next";

import { ArticleFeed } from "@/components/article/ArticleFeed";
import {
  NewsPeriodFilter,
  newsPageTitleForPeriod,
} from "@/components/news/NewsPeriodFilter";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getNewsListWindow, parseNewsDatePeriod } from "@/lib/content";
import { withLocale } from "@/i18n/paths";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/constants/pagination";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ period?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale: loc } = await params;
  const { period: periodRaw } = await searchParams;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const period = parseNewsDatePeriod(periodRaw);
  const title = newsPageTitleForPeriod(m, period);
  const base = withLocale(locale, "/news");
  const path = period != null ? `${base}?period=${period}` : base;

  return {
    title,
    description: m.newsMetaDesc,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description: m.newsMetaDesc,
      url: absoluteUrl(path),
    },
    twitter: {
      title: `${title} · ${SITE_NAME}`,
      description: m.newsMetaDesc,
    },
  };
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const { locale: loc } = await params;
  const { period: periodRaw } = await searchParams;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const period = parseNewsDatePeriod(periodRaw);
  const { items: initialItems, total } = getNewsListWindow(
    0,
    ARTICLE_FEED_PAGE_SIZE,
    period,
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {newsPageTitleForPeriod(m, period)}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {m.newsIndexIntro}
      </p>

      <NewsPeriodFilter locale={locale} current={period} />

      {total === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {period ? m.newsEmptyPeriod : m.emptyMaterials}
        </p>
      ) : (
        <ArticleFeed
          key={period ?? "all"}
          kind="news"
          locale={locale}
          pageSize={ARTICLE_FEED_PAGE_SIZE}
          initialItems={initialItems}
          total={total}
          newsPeriod={period}
        />
      )}
    </div>
  );
}
