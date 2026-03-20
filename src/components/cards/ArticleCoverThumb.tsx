"use client";

import Image from "next/image";

import { CoverPlaceholder } from "@/components/media/CoverPlaceholder";
import { cn } from "@/lib/utils";

type ArticleCoverThumbProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ArticleCoverThumb({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 32rem",
}: ArticleCoverThumbProps) {
  const url = src?.trim() ?? "";

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-[box-shadow,border-color] duration-[250ms] ease-out",
        "group-hover:border-zinc-300/90 group-hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-600 dark:group-hover:shadow-lg dark:group-hover:shadow-black/25",
        className,
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <CoverPlaceholder className="absolute inset-0" />
      )}
    </div>
  );
}
