import { unstable_cache } from "next/cache";

import type { ArticleVideo } from "@/types/article";

function isVkVideoEmbedUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    const okHost =
      host === "vk.com" ||
      host === "vk.ru" ||
      host.endsWith(".vk.com") ||
      host.endsWith(".vk.ru") ||
      host === "vkvideo.ru" ||
      host.endsWith(".vkvideo.ru");
    return okHost && u.pathname === "/video_ext.php";
  } catch {
    return false;
  }
}

function decodeAttrEntities(s: string): string {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function parseVkVideoExtParams(
  embedUrl: string,
): { oid: string; id: string } | null {
  if (!isVkVideoEmbedUrl(embedUrl)) return null;
  try {
    const u = new URL(embedUrl);
    const oid = u.searchParams.get("oid");
    const id = u.searchParams.get("id");
    if (!oid || !id) return null;
    return { oid, id };
  } catch {
    return null;
  }
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const url = decodeAttrEntities(m[1]).trim();
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
    }
  }
  return null;
}

async function fetchOgImageFromPage(pageUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru,en-US;q=0.9,en;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86_400 },
    });

    if (!res.ok) return null;
    const html = await res.text();
    const og = extractOgImage(html);
    if (!og) return null;
    if (og.includes("vk.com/images/") && og.toLowerCase().includes("logo"))
      return null;
    return og;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function vkVideoPageUrlCandidates(oid: string, id: string): string[] {
  const path = `video${oid}_${id}`;
  return [`https://vk.com/${path}`, `https://vkvideo.ru/${path}`];
}

export function getCachedVkVideoOgThumbnail(
  embedUrl: string,
): Promise<string | null> {
  const p = parseVkVideoExtParams(embedUrl);
  if (!p) return Promise.resolve(null);
  const { oid, id } = p;
  return unstable_cache(
    async () => {
      for (const pageUrl of vkVideoPageUrlCandidates(oid, id)) {
        const og = await fetchOgImageFromPage(pageUrl);
        if (og) return og;
      }
      return null;
    },
    ["vk-og-video-thumb", "v2", oid, id],
    { revalidate: 86_400 },
  )();
}

export function pickPrimaryVkEmbed(
  videos: ArticleVideo[] | undefined,
): ArticleVideo | null {
  if (!videos?.length) return null;
  const primary = videos.find((v) => v.primary);
  return primary ?? videos[0] ?? null;
}
