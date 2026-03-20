import type { VideoProvider } from "@/types/article";

type VideoEmbedProps = {
  provider: VideoProvider;
  embedUrl: string;
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

export function VideoEmbed({ provider, embedUrl }: VideoEmbedProps) {
  if (provider !== "vk") return null;

  if (!isVkVideoEmbedUrlAllowed(embedUrl)) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-sm ring-1 ring-black/5 dark:border-zinc-700 dark:ring-white/10">
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={embedUrl}
        title="Видео VK"
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
    </div>
  );
}
