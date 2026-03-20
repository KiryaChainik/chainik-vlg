import type { Metadata } from "next";
import Link from "next/link";

import { HomeColumnFeed } from "@/components/home/HomeColumnFeed";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/constants/pagination";
import { SITE_NAME } from "@/lib/constants";
import { getNewsListWindow, getReviewsListWindow } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  return {
    title: m.homeTitle,
    description: m.siteDescription,
    openGraph: {
      title: SITE_NAME,
      description: m.siteDescription,
      url: absoluteUrl(withLocale(locale, "/")),
    },
    twitter: {
      title: SITE_NAME,
      description: m.siteDescription,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);

  const { items: newsInitial, total: newsTotal } = getNewsListWindow(
    0,
    ARTICLE_FEED_PAGE_SIZE,
  );
  const { items: reviewsInitial, total: reviewsTotal } = getReviewsListWindow(
    0,
    ARTICLE_FEED_PAGE_SIZE,
  );

  return (
    <div className="-mt-2 pb-8 sm:-mt-3">
      <header className="border-b border-zinc-200/30 pb-8 dark:border-zinc-800/35 sm:pb-8">
        <p className="max-w-xl font-mono text-xs tabular-nums leading-none text-zinc-500 dark:text-zinc-400">
          {m.homeTagline}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {SITE_NAME}
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-medium leading-[1.55] text-zinc-700 sm:mt-4 sm:text-xl dark:text-zinc-300">
          {m.siteDescription}
        </p>
      </header>

      <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
        <section className="min-w-0" aria-labelledby="latest-news-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-zinc-200/25 pb-3 dark:border-zinc-800/35">
            <h2
              id="latest-news-heading"
              className="text-base font-semibold tracking-normal text-zinc-900 sm:text-lg dark:text-zinc-100"
            >
              {m.homeNews}
            </h2>
            <Link
              href={withLocale(locale, "/news")}
              className="group inline-flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-semibold text-zinc-800 transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-zinc-300/80 hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-sm hover:shadow-zinc-900/8 active:scale-[0.98] dark:text-zinc-200 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-50 dark:hover:shadow-md dark:hover:shadow-black/25"
            >
              {m.homeAllNews}
              <span
                aria-hidden
                className="translate-y-px text-zinc-600 transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
              >
                →
              </span>
            </Link>
          </div>
          {newsTotal === 0 ? (
            <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
              {m.emptyMaterials}
            </p>
          ) : (
            <HomeColumnFeed
              kind="news"
              locale={locale}
              pageSize={ARTICLE_FEED_PAGE_SIZE}
              initialItems={newsInitial}
              total={newsTotal}
            />
          )}
        </section>

        <section className="min-w-0" aria-labelledby="latest-reviews-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-zinc-200/25 pb-3 dark:border-zinc-800/35">
            <h2
              id="latest-reviews-heading"
              className="text-base font-semibold tracking-normal text-zinc-900 sm:text-lg dark:text-zinc-100"
            >
              {m.homeReviews}
            </h2>
            <Link
              href={withLocale(locale, "/reviews")}
              className="group inline-flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-semibold text-zinc-800 transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-zinc-300/80 hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-sm hover:shadow-zinc-900/8 active:scale-[0.98] dark:text-zinc-200 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-50 dark:hover:shadow-md dark:hover:shadow-black/25"
            >
              {m.homeAllReviews}
              <span
                aria-hidden
                className="translate-y-px text-zinc-600 transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
              >
                →
              </span>
            </Link>
          </div>
          {reviewsTotal === 0 ? (
            <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
              {m.emptyMaterials}
            </p>
          ) : (
            <HomeColumnFeed
              kind="reviews"
              locale={locale}
              pageSize={ARTICLE_FEED_PAGE_SIZE}
              initialItems={reviewsInitial}
              total={reviewsTotal}
            />
          )}
        </section>
      </div>
    </div>
  );
}
