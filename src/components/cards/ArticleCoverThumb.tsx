"use client";

import Image from "next/image";

import { CoverPlaceholder } from "@/components/media/CoverPlaceholder";
import { cn } from "@/lib/utils";

/** Превью в списках: 16:9 + object-cover. На странице статьи см. ArticleHeroMedia (object-contain). */
const VIDEO_COVER_RE = /\.(mp4|webm|mov|ogg)$/i;

type ArticleCoverThumbProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  /** Первые карточки «над сгибом»: eager + высокий fetch priority для LCP. */
  priority?: boolean;
};

export function ArticleCoverThumb({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 32rem",
  priority = false,
}: ArticleCoverThumbProps) {
  const url = src?.trim() ?? "";
  const isVideo = url.length > 0 && VIDEO_COVER_RE.test(url);

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-[box-shadow,border-color] duration-[250ms] ease-out",
        "group-hover:border-zinc-300/90 group-hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-600 dark:group-hover:shadow-lg dark:group-hover:shadow-black/25",
        className,
      )}
    >
      {url ? (
        isVideo ? (
          <video
            src={url.includes("#") ? url : `${url}#t=0.001`}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            aria-hidden
            title={alt}
          />
        ) : (
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes}
            priority={priority}
            /* priority подразумевает eager; явный loading иногда даёт ложное предупреждение LCP в dev */
            {...(priority
              ? { fetchPriority: "high" as const }
              : { loading: "lazy" as const })}
            unoptimized={url.endsWith(".svg")}
          />
        )
      ) : (
        <CoverPlaceholder className="absolute inset-0" />
      )}
    </div>
  );
}
