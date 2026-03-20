import fs from "fs";
import path from "path";

import matter from "gray-matter";

import type {
  Article,
  ArticleFrontmatter,
  ArticleKind,
  ArticleWithBody,
} from "@/types/article";

import { normalizeMdxVkVideos } from "./mdx-vk-videos";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

const NEWS_DIR = path.join(CONTENT_ROOT, "news");
const REVIEWS_DIR = path.join(CONTENT_ROOT, "reviews");

function articleDir(kind: ArticleKind): string {
  return kind === "news" ? NEWS_DIR : REVIEWS_DIR;
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

  if (!title || !description || !date || !category || !author) return null;

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
  const filePath = path.join(articleDir(kind), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = normalizeFrontmatter(data);

  if (!frontmatter) {
    console.warn(`[content] пропуск «${kind}/${slug}.mdx»: некорректный frontmatter`);
    return null;
  }

  if (options.requirePublished && !frontmatter.published) return null;

  return {
    slug,
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

export function getAllNews(): Article[] {
  const items: Article[] = [];

  for (const slug of listSlugs("news")) {
    const full = loadArticleWithBody("news", slug, { requirePublished: true });
    if (full) items.push(toArticleListItem(full));
  }

  return items.sort(byDateDesc);
}

export function getAllReviews(): Article[] {
  const items: Article[] = [];

  for (const slug of listSlugs("reviews")) {
    const full = loadArticleWithBody("reviews", slug, {
      requirePublished: true,
    });
    if (full) items.push(toArticleListItem(full));
  }

  return items.sort(byDateDesc);
}

export function getAllArticles(): Article[] {
  return [...getAllNews(), ...getAllReviews()].sort(byDateDesc);
}

export function getArticleBySlug(
  slug: string,
  kind: ArticleKind,
): ArticleWithBody | null {
  return loadArticleWithBody(kind, slug, { requirePublished: true });
}

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
