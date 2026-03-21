import type { VideoProvider } from "@/types/article";

type VideoEmbedProps = {
  provider: VideoProvider;
  embedUrl: string;
  orientation?: "portrait" | "landscape";
};

export function isVkVideoEmbedUrlAllowed(raw: string): boolean {
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
    if (!okHost) return false;
    return u.pathname === "/video_ext.php";
  } catch {
    return false;
  }
}

/** Не выше ~70% высоты окна (dvh/svh — моб. панели и динамический viewport). */
const MAX_EMBED_VH = "min(70dvh, 70svh)" as const;

const EMBED_LANDSCAPE_STYLE = {
  aspectRatio: "16 / 9",
  maxHeight: MAX_EMBED_VH,
  maxWidth: "min(100%, calc(100vw - 2rem))",
  width: "100%",
} as const;

/** Вертикальное: высота ограничена, ширина от соотношения сторон (узкая колонка по центру). */
const EMBED_PORTRAIT_STYLE = {
  aspectRatio: "9 / 16",
  maxHeight: MAX_EMBED_VH,
  maxWidth: "min(100%, calc(100vw - 2rem))",
  width: "auto",
  marginLeft: "auto",
  marginRight: "auto",
} as const;

export function VideoEmbed({ provider, embedUrl, orientation }: VideoEmbedProps) {
  if (provider !== "vk") return null;

  if (!isVkVideoEmbedUrlAllowed(embedUrl)) return null;

  const portrait = orientation === "portrait";
  const boxStyle = portrait ? EMBED_PORTRAIT_STYLE : EMBED_LANDSCAPE_STYLE;

  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-sm ring-1 ring-black/5 dark:border-zinc-700 dark:ring-white/10"
      style={boxStyle}
    >
      <iframe
        className="absolute inset-0 h-full w-full max-w-full border-0"
        src={embedUrl}
        title="Видео VK"
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
    </div>
  );
}
