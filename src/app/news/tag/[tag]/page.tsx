import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsListCard } from "@/components/cards";
import { SITE_NAME } from "@/lib/constants";
import {
  getNewsByTagParam,
  getNewsTagParamsForStatic,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getNewsTagParamsForStatic();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const title = `Новости: ${decoded}`;
  return {
    title,
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      url: absoluteUrl(`/news/tag/${tag}`),
    },
  };
}

export default async function NewsTagPage({ params }: PageProps) {
  const { tag } = await params;
  const articles = getNewsByTagParam(tag);
  if (articles.length === 0) notFound();

  const label = decodeURIComponent(tag);

  return (
    <div>
      <Link
        href="/news"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Все новости
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
          <NewsListCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
