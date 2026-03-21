import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { stripTelegramSpoilerMarkers } from "@/lib/telegram-text";
import type { ArticleWithBody } from "@/types/article";
import type { VideoPageWithBody } from "@/types/video-page";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

const VIDEO_COVER_RE = /\.(mp4|webm|mov|ogg)$/i;

function coverToOgImage(
  cover: string | undefined,
  alt: string,
): { url: string; alt: string }[] | undefined {
  if (!cover?.trim()) return undefined;
  if (VIDEO_COVER_RE.test(cover.trim())) return undefined;
  const url =
    cover.startsWith("http://") || cover.startsWith("https://")
      ? cover
      : absoluteUrl(cover);
  return [{ url, alt }];
}

function ogLocale(locale: Locale | undefined): string {
  return locale === "en" ? "en_US" : "ru_RU";
}

/** Короткий snippet для &lt;meta&gt; / Open Graph (поле description в frontmatter может быть длинным). */
export function truncateMetaDescription(text: string, maxLen = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const head = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  return `${head}…`;
}

export function metadataForVideoPage(
  item: VideoPageWithBody,
  pathname: string,
  contentLocale?: Locale,
): Metadata {
  const { title, description, cover, author } = item.frontmatter;
  const url = absoluteUrl(pathname);
  const images = coverToOgImage(cover, title);
  const socialTitle = `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: "website",
      locale: ogLocale(contentLocale),
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export function metadataForArticle(
  item: ArticleWithBody,
  pathname: string,
  contentLocale?: Locale,
): Metadata {
  const { title, description, date, cover, author } = item.frontmatter;
  const titlePlain = stripTelegramSpoilerMarkers(title);
  const descPlain = stripTelegramSpoilerMarkers(description);
  const metaSnippet = truncateMetaDescription(
    descPlain.trim() ? descPlain : titlePlain,
  );
  const url = absoluteUrl(pathname);
  const images = coverToOgImage(cover, titlePlain);
  const socialTitle = `${titlePlain} · ${SITE_NAME}`;

  return {
    title: titlePlain,
    description: metaSnippet,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: "article",
      locale: ogLocale(contentLocale),
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description: metaSnippet,
      publishedTime: date,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: socialTitle,
      description: metaSnippet,
      images: images?.map((i) => i.url),
    },
  };
}
