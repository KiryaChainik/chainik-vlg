import type { ArticleVideo } from "@/types/article";

type ArticleVideoOrientation = NonNullable<ArticleVideo["orientation"]>;

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

    const orientRaw = o.orientation != null ? String(o.orientation).toLowerCase() : "";
    const orientation: ArticleVideoOrientation | undefined =
      orientRaw === "portrait" || orientRaw === "vertical"
        ? "portrait"
        : orientRaw === "landscape"
          ? "landscape"
          : undefined;

    out.push({
      provider: "vk",
      embedUrl,
      title,
      primary: Boolean(o.primary),
      ...(orientation ? { orientation } : {}),
    });
  }

  return out.length ? out : undefined;
}
