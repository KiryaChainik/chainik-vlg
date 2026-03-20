import type { Metadata } from "next";

import { NewsListCard } from "@/components/cards";
import { SITE_NAME } from "@/lib/constants";
import { getAllNews } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Новости о технике, гаджетах и тенденциях рынка — подборка материалов редакции.";

export const metadata: Metadata = {
  title: "Новости",
  description,
  openGraph: {
    title: `Новости · ${SITE_NAME}`,
    description,
    url: absoluteUrl("/news"),
  },
  twitter: {
    title: `Новости · ${SITE_NAME}`,
    description,
  },
};

export default function NewsPage() {
  const articles = getAllNews();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Новости
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Все опубликованные новости о технике и периферии
      </p>

      {articles.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Пока нет материалов.
        </p>
      ) : (
        <div className="mt-8">
          {articles.map((item) => (
            <NewsListCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
