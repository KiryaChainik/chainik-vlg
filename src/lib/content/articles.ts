import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { cache } from "react";

import type {
  Article,
  ArticleFrontmatter,
  ArticleKind,
  ArticleWithBody,
} from "@/types/article";

import { normalizeMdxVkVideos } from "./mdx-vk-videos";
import {
  type NewsDatePeriod,
  filterNewsByDatePeriod,
} from "./news-date-period";
import { getContentDirForSection } from "./paths";

export type { NewsDatePeriod } from "./news-date-period";
export {
  NEWS_DATE_PERIODS,
  articlePublishedStartOfDayMs,
  filterNewsByDatePeriod,
  parseNewsDatePeriod,
} from "./news-date-period";

function articleDir(kind: ArticleKind): string {
  return getContentDirForSection(kind === "news" ? "news" : "reviews");
}

/** Декодирует сегмент пути (на случай двойного кодирования в URL). */
function decodeSlugParam(slug: string): string {
  let s = slug;
  for (let i = 0; i < 3; i += 1) {
    if (!s.includes("%")) break;
    try {
      const next = decodeURIComponent(s);
      if (next === s) break;
      s = next;
    } catch {
      break;
    }
  }
  return s;
}

/**
 * Находит файл *.mdx по slug из маршрута: учитывает NFC/NFD (macOS/APFS) и
 * расхождения между URL и именем файла на диске.
 */
function resolveMdxFile(
  kind: ArticleKind,
  slugParam: string,
): { filePath: string; canonicalSlug: string } | null {
  const dir = articleDir(kind);
  if (!fs.existsSync(dir)) return null;

  const decoded = decodeSlugParam(slugParam);
  const nfc = decoded.normalize("NFC");

  const tryNames = [
    decoded,
    nfc,
    decoded.normalize("NFD"),
    nfc.normalize("NFD"),
  ];
  const seen = new Set<string>();
  for (const name of tryNames) {
    if (seen.has(name)) continue;
    seen.add(name);
    const fp = path.join(dir, `${name}.mdx`);
    if (fs.existsSync(fp)) return { filePath: fp, canonicalSlug: name };
  }

  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".mdx")) continue;
    const base = f.slice(0, -4);
    if (base.normalize("NFC") === nfc) {
      return { filePath: path.join(dir, f), canonicalSlug: base };
    }
  }
  return null;
}

function listSlugs(kind: ArticleKind): string[] {
  const dir = articleDir(kind);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.basename(f, ".mdx"));
}

function toStrArray(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeFrontmatter(raw: unknown): ArticleFrontmatter | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;

  const title = d.title != null ? String(d.title).trim() : "";
  const description =
    d.description != null ? String(d.description).trim() : "";
  const date = d.date != null ? String(d.date).trim() : "";
  const category =
    d.category != null ? String(d.category).trim() : "";
  const author = d.author != null ? String(d.author).trim() : "";

  if (!title || !date || !category || !author) return null;

  const published = Boolean(d.published);
  const tags = toStrArray(d.tags);

  const cover =
    d.cover != null && String(d.cover).trim() !== ""
      ? String(d.cover).trim()
      : undefined;

  const videos = normalizeMdxVkVideos(d.videos);

  return {
    title,
    description,
    date,
    cover,
    category,
    tags,
    published,
    author,
    videos,
  };
}

function loadArticleWithBody(
  kind: ArticleKind,
  slug: string,
  options: { requirePublished: boolean },
): ArticleWithBody | null {
  const resolved = resolveMdxFile(kind, slug);
  if (!resolved) return null;

  const { filePath, canonicalSlug } = resolved;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = normalizeFrontmatter(data);

  if (!frontmatter) {
    console.warn(
      `[content] пропуск «${kind}/${canonicalSlug}.mdx»: некорректный frontmatter`,
    );
    return null;
  }

  if (options.requirePublished && !frontmatter.published) return null;

  return {
    slug: canonicalSlug,
    kind,
    frontmatter,
    body: content.trim(),
  };
}

function toArticleListItem(entry: ArticleWithBody): Article {
  const { slug, kind, frontmatter } = entry;
  return { slug, kind, frontmatter };
}

function byDateDesc(a: Article, b: Article): number {
  return (
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime()
  );
}

function getAllNewsUncached(): Article[] {
  const items: Article[] = [];

  for (const slug of listSlugs("news")) {
    const full = loadArticleWithBody("news", slug, { requirePublished: true });
    if (full) items.push(toArticleListItem(full));
  }

  return items.sort(byDateDesc);
}

export const getAllNews = cache(getAllNewsUncached);

function getAllReviewsUncached(): Article[] {
  const items: Article[] = [];

  for (const slug of listSlugs("reviews")) {
    const full = loadArticleWithBody("reviews", slug, {
      requirePublished: true,
    });
    if (full) items.push(toArticleListItem(full));
  }

  return items.sort(byDateDesc);
}

export const getAllReviews = cache(getAllReviewsUncached);

export type ArticleListWindow = {
  items: Article[];
  total: number;
};

/** Срез отсортированного списка новостей (для страницы списка и API подгрузки). */
export function getNewsListWindow(
  offset: number,
  limit: number,
  period?: NewsDatePeriod | null,
): ArticleListWindow {
  const all = getAllNews();
  const list =
    period != null ? filterNewsByDatePeriod(all, period) : all;
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);
  return {
    items: list.slice(safeOffset, safeOffset + safeLimit),
    total: list.length,
  };
}

/** Срез отсортированного списка обзоров. */
export function getReviewsListWindow(
  offset: number,
  limit: number,
): ArticleListWindow {
  const all = getAllReviews();
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(0, limit);
  return {
    items: all.slice(safeOffset, safeOffset + safeLimit),
    total: all.length,
  };
}

export function getAllArticles(): Article[] {
  return [...getAllNews(), ...getAllReviews()].sort(byDateDesc);
}

export const getArticleBySlug = cache(
  (slug: string, kind: ArticleKind): ArticleWithBody | null =>
    loadArticleWithBody(kind, slug, { requirePublished: true }),
);

export function getNewsByTagParam(tagParam: string): Article[] {
  const tag = decodeURIComponent(tagParam);
  return getAllNews().filter((a) => a.frontmatter.tags.includes(tag));
}

export function getReviewsByTagParam(tagParam: string): Article[] {
  const tag = decodeURIComponent(tagParam);
  return getAllReviews().filter((a) => a.frontmatter.tags.includes(tag));
}

export function getNewsTagParamsForStatic(): { tag: string }[] {
  const seen = new Set<string>();
  const out: { tag: string }[] = [];
  for (const a of getAllNews()) {
    for (const t of a.frontmatter.tags) {
      const enc = encodeURIComponent(t);
      if (!seen.has(enc)) {
        seen.add(enc);
        out.push({ tag: enc });
      }
    }
  }
  return out;
}

export function getReviewsTagParamsForStatic(): { tag: string }[] {
  const seen = new Set<string>();
  const out: { tag: string }[] = [];
  for (const a of getAllReviews()) {
    for (const t of a.frontmatter.tags) {
      const enc = encodeURIComponent(t);
      if (!seen.has(enc)) {
        seen.add(enc);
        out.push({ tag: enc });
      }
    }
  }
  return out;
}
