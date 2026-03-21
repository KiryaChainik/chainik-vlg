import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeroMedia, ArticleMeta, ArticleTagLinks } from "@/components/article";
import { VideoSection } from "@/components/video";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import {
  compileArticleMdx,
  getAllNews,
  getArticleBySlug,
  shouldHideArticleHero,
} from "@/lib/content";
import { metadataForArticle } from "@/lib/seo";
import {
  stripTelegramSpoilerMarkers,
  TelegramSpoilerAsItalic,
} from "@/lib/telegram-text";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Разрешать slug, которых нет в generateStaticParams (новые MDX после сборки). */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllNews().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const item = getArticleBySlug(slug, "news");
  if (!item) return { title: m.notFoundTitle };
  return metadataForArticle(
    item,
    withLocale(locale, `/news/${slug}`),
    locale,
  );
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug, locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const item = getArticleBySlug(slug, "news");
  if (!item) notFound();

  const { content } = await compileArticleMdx(item.body);

  const { frontmatter: fm } = item;
  const cover = fm.cover;
  const hideHero = shouldHideArticleHero(item.body, cover, "news");

  return (
    <article>
      <Link
        href={withLocale(locale, "/news")}
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        {m.backAllNews}
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {m.newsKind} · {fm.category}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        <TelegramSpoilerAsItalic text={fm.title} />
      </h1>
      <div className="mt-3">
        <ArticleMeta date={fm.date} extra={fm.author} locale={locale} />
      </div>
      {fm.tags.length > 0 ? (
        <div className="mt-3">
          <ArticleTagLinks
            tags={fm.tags}
            section="news"
            locale={locale}
            tagsAriaLabel={m.tagListAria}
          />
        </div>
      ) : null}

      {hideHero ? null : (
        <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <ArticleHeroMedia
            cover={cover}
            title={stripTelegramSpoilerMarkers(fm.title)}
          />
        </div>
      )}

      <VideoSection videos={fm.videos} ariaLabel={m.embeddedVideoAria} />

      <div className="mdx-content">{content}</div>
    </article>
  );
}
