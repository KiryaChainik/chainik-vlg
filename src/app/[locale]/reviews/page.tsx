import type { Metadata } from "next";

import { ArticleFeed } from "@/components/article/ArticleFeed";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/constants/pagination";
import { SITE_NAME } from "@/lib/constants";
import { getReviewsListWindow } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  return {
    title: m.reviewsIndexTitle,
    description: m.reviewsMetaDesc,
    openGraph: {
      title: `${m.reviewsIndexTitle} · ${SITE_NAME}`,
      description: m.reviewsMetaDesc,
      url: absoluteUrl(withLocale(locale, "/reviews")),
    },
    twitter: {
      title: `${m.reviewsIndexTitle} · ${SITE_NAME}`,
      description: m.reviewsMetaDesc,
    },
  };
}

export default async function ReviewsPage({ params }: PageProps) {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const { items: initialItems, total } = getReviewsListWindow(
    0,
    ARTICLE_FEED_PAGE_SIZE,
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {m.reviewsIndexTitle}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {m.reviewsIndexIntro}
      </p>

      {total === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {m.emptyMaterials}
        </p>
      ) : (
        <ArticleFeed
          kind="reviews"
          locale={locale}
          pageSize={ARTICLE_FEED_PAGE_SIZE}
          initialItems={initialItems}
          total={total}
        />
      )}
    </div>
  );
}
