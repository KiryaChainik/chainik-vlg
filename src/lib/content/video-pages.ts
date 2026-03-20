import fs from "fs";
import path from "path";

import matter from "gray-matter";

import type { SiteVideoItem } from "@/types/site-video";
import type {
  VideoPageFrontmatter,
  VideoPageWithBody,
} from "@/types/video-page";

import {
  getCachedVkVideoOgThumbnail,
  pickPrimaryVkEmbed,
} from "@/lib/vk-video-thumbnail";

import { normalizeMdxVkVideos } from "./mdx-vk-videos";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const VIDEOS_DIR = path.join(CONTENT_ROOT, "videos");

function listVideoSlugs(): string[] {
  if (!fs.existsSync(VIDEOS_DIR)) return [];

  return fs
    .readdirSync(VIDEOS_DIR)
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

function normalizeVideoPageFrontmatter(
  raw: unknown,
): VideoPageFrontmatter | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;

  const title = d.title != null ? String(d.title).trim() : "";
  const description =
    d.description != null ? String(d.description).trim() : "";
  const date = d.date != null ? String(d.date).trim() : "";
  const duration = d.duration != null ? String(d.duration).trim() : "";
  const author = d.author != null ? String(d.author).trim() : "";

  if (!title || !description || !date || !duration || !author) return null;

  const published = Boolean(d.published);
  const tags = toStrArray(d.tags);

  const cover =
    d.cover != null && String(d.cover).trim() !== ""
      ? String(d.cover).trim()
      : undefined;

  const watchUrl =
    d.watchUrl != null && String(d.watchUrl).trim() !== ""
      ? String(d.watchUrl).trim()
      : undefined;

  const videos = normalizeMdxVkVideos(d.videos);

  return {
    title,
    description,
    date,
    duration,
    cover,
    published,
    author,
    watchUrl,
    videos,
    tags,
  };
}

function loadVideoPage(
  slug: string,
  options: { requirePublished: boolean },
): VideoPageWithBody | null {
  const filePath = path.join(VIDEOS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = normalizeVideoPageFrontmatter(data);

  if (!frontmatter) {
    console.warn(
      `[content] пропуск videos/${slug}.mdx: некорректный frontmatter`,
    );
    return null;
  }

  if (options.requirePublished && !frontmatter.published) return null;

  return {
    slug,
    frontmatter,
    body: content.trim(),
  };
}

export function getVideoPageBySlug(slug: string): VideoPageWithBody | null {
  return loadVideoPage(slug, { requirePublished: true });
}

export function getPublishedVideoSlugs(): string[] {
  const slugs: string[] = [];
  for (const slug of listVideoSlugs()) {
    if (loadVideoPage(slug, { requirePublished: true })) slugs.push(slug);
  }
  return slugs;
}

export async function getPublishedVideos(): Promise<SiteVideoItem[]> {
  const rows: SiteVideoItem[] = [];

  for (const slug of listVideoSlugs()) {
    const full = loadVideoPage(slug, { requirePublished: true });
    if (!full) continue;
    const fm = full.frontmatter;

    let thumbnail = fm.cover?.trim() ?? "";
    if (!thumbnail) {
      const vk = pickPrimaryVkEmbed(fm.videos);
      if (vk?.provider === "vk") {
        const og = await getCachedVkVideoOgThumbnail(vk.embedUrl);
        if (og) thumbnail = og;
      }
    }
    if (!thumbnail) {
      thumbnail = `https://picsum.photos/seed/${encodeURIComponent(slug)}/640/360`;
    }

    rows.push({
      slug,
      title: fm.title,
      thumbnail,
      duration: fm.duration,
      date: fm.date,
    });
  }

  return rows.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
