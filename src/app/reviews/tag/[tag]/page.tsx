import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleListCard } from "@/components/cards";
import { SITE_NAME } from "@/lib/constants";
import {
  getReviewsByTagParam,
  getReviewsTagParamsForStatic,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getReviewsTagParamsForStatic();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const title = `Обзоры: ${decoded}`;
  return {
    title,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(`/reviews/tag/${tag}`),
    },
  };
}

export default async function ReviewsTagPage({ params }: PageProps) {
  const { tag } = await params;
  const articles = getReviewsByTagParam(tag);
  if (articles.length === 0) notFound();

  const label = decodeURIComponent(tag);

  return (
    <div>
      <Link
        href="/reviews"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Все обзоры
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Тег «{label}»
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {articles.length}{" "}
        {articles.length === 1 ? "материал" : "материалов"}
      </p>
      <div className="mt-8">
        {articles.map((item) => (
          <ArticleListCard key={item.slug} item={item} hrefBase="/reviews" />
        ))}
      </div>
    </div>
  );
}
