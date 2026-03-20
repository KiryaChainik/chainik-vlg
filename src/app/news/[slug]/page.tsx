import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CoverPlaceholder } from "@/components/media/CoverPlaceholder";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { ArticleMeta, ArticleTagLinks } from "@/components/article";
import {
  getAllNews,
  getArticleBySlug,
  mdxComponents,
} from "@/lib/content";
import { metadataForArticle } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNews().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getArticleBySlug(slug, "news");
  if (!item) return { title: "Страница не найдена" };
  return metadataForArticle(item, `/news/${slug}`);
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const item = getArticleBySlug(slug, "news");
  if (!item) notFound();

  const { content } = await compileMDX({
    source: item.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  const { frontmatter: fm } = item;
  const cover = fm.cover;

  return (
    <article>
      <Link
        href="/news"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Все новости
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Новость · {fm.category}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        {fm.title}
      </h1>
      <div className="mt-3">
        <ArticleMeta date={fm.date} extra={fm.author} />
      </div>
      {fm.tags.length > 0 ? (
        <div className="mt-3">
          <ArticleTagLinks tags={fm.tags} section="news" />
        </div>
      ) : null}
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {fm.description}
      </p>

      <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {cover?.trim() ? (
          <Image
            src={cover.trim()}
            alt={fm.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
            priority
          />
        ) : (
          <CoverPlaceholder className="absolute inset-0 rounded-xl" />
        )}
      </div>

      <div className="mdx-content">{content}</div>
    </article>
  );
}
