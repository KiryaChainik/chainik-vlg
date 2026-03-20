import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { VideoSection } from "@/components/video";
import {
  getPublishedVideoSlugs,
  getVideoPageBySlug,
  mdxComponents,
} from "@/lib/content";
import { formatShortRuDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { metadataForVideoPage } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getVideoPageBySlug(slug);
  if (!item) return { title: "Страница не найдена" };
  return metadataForVideoPage(item, `/videos/${slug}`);
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getVideoPageBySlug(slug);
  if (!item) notFound();

  const { content } = await compileMDX({
    source: item.body,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  const fm = item.frontmatter;

  return (
    <article className="max-w-3xl">
      <Link
        href="/videos"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Все видео
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        {fm.title}
      </h1>
      <time
        dateTime={fm.date}
        className="mt-3 block font-mono text-xs tabular-nums leading-none text-zinc-400/80 dark:text-zinc-500/85"
      >
        {formatShortRuDate(fm.date)}
      </time>
      {fm.tags.length > 0 ? (
        <ul
          className="mt-3 flex flex-wrap gap-1.5"
          aria-label="Теги"
        >
          {fm.tags.map((tag, index) => (
            <li key={`${index}-${tag}`}>
              <span
                className={cn(
                  "rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600",
                  "dark:bg-zinc-800 dark:text-zinc-300",
                )}
              >
                {tag}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {fm.description}
      </p>

      <VideoSection videos={fm.videos} />

      {fm.watchUrl ? (
        <p className="mt-6">
          <a
            href={fm.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Смотреть на VK
          </a>
        </p>
      ) : null}

      <div className="mdx-content mt-10">{content}</div>
    </article>
  );
}
