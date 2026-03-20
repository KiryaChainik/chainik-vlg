import type { Metadata } from "next";
import Link from "next/link";

import { ArticleTagLinks } from "@/components/article";
import {
  ARTICLE_CARD_SHELL,
  ARTICLE_CARD_TEASER_LINK,
  ArticleCoverThumb,
} from "@/components/cards";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getAllNews, getAllReviews } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

const LATEST_LIMIT = 3;

export const metadata: Metadata = {
  title: "Главная",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

function formatTeaserDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const HOME_TEASER_IMAGE_SIZES =
  "(max-width: 1024px) 100vw, (max-width: 1536px) 48vw, 720px";

function HomeArticleTeaser({
  item,
  hrefBase,
}: {
  item: Article;
  hrefBase: "/news" | "/reviews";
}) {
  const fm = item.frontmatter;
  const cover = fm.cover;
  const tagSection = hrefBase === "/news" ? "news" : "reviews";

  return (
    <li className="py-4 first:pt-0">
      <div className={cn(ARTICLE_CARD_SHELL, "px-0")}>
        <Link
          href={`${hrefBase}/${item.slug}`}
          className={ARTICLE_CARD_TEASER_LINK}
        >
          <div className="flex flex-col gap-0">
            <ArticleCoverThumb
              src={cover}
              alt={fm.title}
              className="w-full !rounded-t-xl !rounded-b-none border-x-0 border-t-0 border-b border-zinc-200 dark:border-zinc-800"
              sizes={HOME_TEASER_IMAGE_SIZES}
            />
            <div
              className={cn(
                "min-w-0 px-3 pt-3",
                fm.tags.length === 0 && "pb-3",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-normal text-zinc-900 group-hover:text-zinc-800 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                  {fm.title}
                </h3>
                <time
                  dateTime={fm.date}
                  className="shrink-0 font-mono text-xs tabular-nums leading-none text-zinc-400/80 dark:text-zinc-500/85"
                >
                  {formatTeaserDate(fm.date)}
                </time>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-[1.72] text-zinc-600 dark:text-zinc-300/95">
                {fm.description}
              </p>
            </div>
          </div>
        </Link>
        {fm.tags.length > 0 ? (
          <ArticleTagLinks
            className="relative z-20 px-3 pb-3 pt-2"
            tags={fm.tags.slice(0, 4)}
            section={tagSection}
            size="sm"
            tone="quiet"
          />
        ) : null}
      </div>
    </li>
  );
}

export default function HomePage() {
  const news = getAllNews().slice(0, LATEST_LIMIT);
  const reviews = getAllReviews().slice(0, LATEST_LIMIT);

  return (
    <div className="-mt-2 pb-8 sm:-mt-3">
      <header className="border-b border-zinc-200/30 pb-8 dark:border-zinc-800/35 sm:pb-8">
        <p className="max-w-xl font-mono text-xs tabular-nums leading-none text-zinc-500 dark:text-zinc-400">
          Блог о технике и периферии
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {SITE_NAME}
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-medium leading-[1.55] text-zinc-700 sm:mt-4 sm:text-xl dark:text-zinc-300">
          {SITE_DESCRIPTION}
        </p>
      </header>

      <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
        <section className="min-w-0" aria-labelledby="latest-news-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-zinc-200/25 pb-3 dark:border-zinc-800/35">
            <h2
              id="latest-news-heading"
              className="text-base font-semibold tracking-normal text-zinc-900 sm:text-lg dark:text-zinc-100"
            >
              Новости
            </h2>
            <Link
              href="/news"
              className="group inline-flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-semibold text-zinc-800 transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-zinc-300/80 hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-sm hover:shadow-zinc-900/8 active:scale-[0.98] dark:text-zinc-200 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-50 dark:hover:shadow-md dark:hover:shadow-black/25"
            >
              Все новости
              <span
                aria-hidden
                className="translate-y-px text-zinc-600 transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
              >
                →
              </span>
            </Link>
          </div>
          {news.length === 0 ? (
            <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
              Пока нет материалов.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-y-[0.5px] divide-zinc-200/18 dark:divide-zinc-800/24">
              {news.map((item) => (
                <HomeArticleTeaser key={item.slug} item={item} hrefBase="/news" />
              ))}
            </ul>
          )}
        </section>

        <section className="min-w-0" aria-labelledby="latest-reviews-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-zinc-200/25 pb-3 dark:border-zinc-800/35">
            <h2
              id="latest-reviews-heading"
              className="text-base font-semibold tracking-normal text-zinc-900 sm:text-lg dark:text-zinc-100"
            >
              Обзоры
            </h2>
            <Link
              href="/reviews"
              className="group inline-flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-semibold text-zinc-800 transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-zinc-300/80 hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-sm hover:shadow-zinc-900/8 active:scale-[0.98] dark:text-zinc-200 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-50 dark:hover:shadow-md dark:hover:shadow-black/25"
            >
              Все обзоры
              <span
                aria-hidden
                className="translate-y-px text-zinc-600 transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
              >
                →
              </span>
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
              Пока нет материалов.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-y-[0.5px] divide-zinc-200/18 dark:divide-zinc-800/24">
              {reviews.map((item) => (
                <HomeArticleTeaser
                  key={item.slug}
                  item={item}
                  hrefBase="/reviews"
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
