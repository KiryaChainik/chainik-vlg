import Image from "next/image";

import { cn } from "@/lib/utils";

type ArticleCoverThumbProps = {
  src: string;
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
  const remote = src.startsWith("http://") || src.startsWith("https://");

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-[box-shadow,border-color] duration-[250ms] ease-out",
        "group-hover:border-zinc-300/90 group-hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-600 dark:group-hover:shadow-lg dark:group-hover:shadow-black/25",
        className,
      )}
    >
      {remote ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      )}
    </div>
  );
}
