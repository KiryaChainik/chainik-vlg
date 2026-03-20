import type { ArticleVideo } from "@/types/article";

export function normalizeMdxVkVideos(raw: unknown): ArticleVideo[] | undefined {
  if (raw == null) return undefined;
  if (!Array.isArray(raw)) return undefined;

  const out: ArticleVideo[] = [];

  for (const entry of raw) {
    if (entry == null || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;

    if (o.provider !== "vk") continue;

    const embedUrl =
      o.embedUrl != null ? String(o.embedUrl).trim() : "";
    if (!embedUrl) continue;

    const title =
      o.title != null && String(o.title).trim() !== ""
        ? String(o.title).trim()
        : "Видео";

    out.push({
      provider: "vk",
      embedUrl,
      title,
      primary: Boolean(o.primary),
    });
  }

  return out.length ? out : undefined;
}
