import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsListCard } from "@/components/cards";
import { isLocale, type Locale } from "@/i18n/config";
import {
  enArticleCountLabel,
  getMessages,
  ruMaterialCountLabel,
} from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { SITE_NAME } from "@/lib/constants";
import {
  getNewsByTagParam,
  getNewsTagParamsForStatic,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; tag: string }>;
};

export function generateStaticParams() {
  return getNewsTagParamsForStatic();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const decoded = decodeURIComponent(tag);
  const title = `${m.newsIndexTitle}: ${decoded}`;
  return {
    title,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(withLocale(locale, `/news/tag/${tag}`)),
    },
  };
}

export default async function NewsTagPage({ params }: PageProps) {
  const { tag, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const articles = getNewsByTagParam(tag);
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
        href={withLocale(locale, "/news")}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        {m.backAllNews}
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
        {articles.map((item) => (
          <NewsListCard key={item.slug} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}
