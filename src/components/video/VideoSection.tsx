import type { ArticleVideo } from "@/types/article";

import { isVkVideoEmbedUrlAllowed, VideoEmbed } from "./VideoEmbed";

type VideoSectionProps = {
  videos?: ArticleVideo[];
  ariaLabel?: string;
};

export function VideoSection({ videos, ariaLabel = "Встроенное видео" }: VideoSectionProps) {
  if (!videos?.length) return null;

  const primary = videos.find((v) => v.primary);
  const video = primary ?? videos[0];

  if (!video) return null;

  if (video.provider !== "vk" || !isVkVideoEmbedUrlAllowed(video.embedUrl)) {
    return null;
  }

  return (
    <section
      className="mt-8 w-full min-w-0 max-w-3xl overflow-x-clip"
      aria-label={ariaLabel}
    >
      <VideoEmbed
        provider={video.provider}
        embedUrl={video.embedUrl}
        orientation={video.orientation}
      />
    </section>
  );
}
