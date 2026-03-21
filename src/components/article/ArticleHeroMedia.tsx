import Image from "next/image";

import { CoverPlaceholder } from "@/components/media/CoverPlaceholder";

const VIDEO_RE = /\.(mp4|webm|mov|ogg)$/i;

type ArticleHeroMediaProps = {
  cover?: string;
  title: string;
};

export function ArticleHeroMedia({ cover, title }: ArticleHeroMediaProps) {
  const src = cover?.trim();
  if (!src) {
    return <CoverPlaceholder className="absolute inset-0 rounded-xl" />;
  }
  if (VIDEO_RE.test(src)) {
    return (
      <video
        className="absolute inset-0 h-full w-full max-h-[min(70dvh,70svh)] object-contain object-center"
        controls
        playsInline
        preload="metadata"
        src={src}
        aria-label={title}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-contain object-center"
      sizes="(max-width: 768px) 100vw, 42rem"
      priority
    />
  );
}
