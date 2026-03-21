import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleListCard } from "@/components/cards";
import { isLocale, type Locale } from "@/i18n/config";
import {
  enArticleCountLabel,
  getMessages,
  ruMaterialCountLabel,
} from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { SITE_NAME } from "@/lib/constants";
import {
  getReviewsByTagParam,
  getReviewsTagParamsForStatic,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; tag: string }>;
};

export function generateStaticParams() {
  return getReviewsTagParamsForStatic();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const decoded = decodeURIComponent(tag);
  const title = `${m.reviewsIndexTitle}: ${decoded}`;
  return {
    title,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(withLocale(locale, `/reviews/tag/${tag}`)),
    },
  };
}

export default async function ReviewsTagPage({ params }: PageProps) {
  const { tag, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const articles = getReviewsByTagParam(tag);
  if (articles.length === 0) notFound();

  const label = decodeURIComponent(tag);
  const countLabel =
    locale === "en"
      ? enArticleCountLabel(articles.length, m)
      : ruMaterialCountLabel(articles.length, m);

  const quoteOpen = locale === "en" ? '"' : "«";
  const quoteClose = locale === "en" ? '"' : "»";

  return (
    <div>
      <Link
        href={withLocale(locale, "/reviews")}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        {m.backAllReviews}
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {m.tagHeading} {quoteOpen}
        {label}
        {quoteClose}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {countLabel}
      </p>
      <div className="mt-8">
        {articles.map((item, index) => (
          <ArticleListCard
            key={item.slug}
            item={item}
            locale={locale}
            hrefBase="/reviews"
            coverPriority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}
