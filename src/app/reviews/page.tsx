import type { Metadata } from "next";

import { ArticleListCard } from "@/components/cards";
import { SITE_NAME } from "@/lib/constants";
import { getAllReviews } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Обзоры техники и периферии — опыт использования и практические выводы.";

export const metadata: Metadata = {
  title: "Обзоры",
  description,
  openGraph: {
    title: `Обзоры · ${SITE_NAME}`,
    description,
    url: absoluteUrl("/reviews"),
  },
  twitter: {
    title: `Обзоры · ${SITE_NAME}`,
    description,
  },
};

export default function ReviewsPage() {
  const articles = getAllReviews();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Обзоры
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Все опубликованные обзоры
      </p>

      {articles.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Пока нет материалов.
        </p>
      ) : (
        <div className="mt-8">
          {articles.map((item) => (
            <ArticleListCard key={item.slug} item={item} hrefBase="/reviews" />
          ))}
        </div>
      )}
    </div>
  );
}
