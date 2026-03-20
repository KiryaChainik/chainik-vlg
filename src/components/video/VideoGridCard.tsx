import Image from "next/image";
import Link from "next/link";

import { CoverPlaceholder } from "@/components/media/CoverPlaceholder";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/paths";
import type { SiteVideoItem } from "@/types/site-video";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type VideoGridCardProps = {
  item: SiteVideoItem;
  locale: Locale;
  className?: string;
};

const THUMB_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

export function VideoGridCard({ item, locale, className }: VideoGridCardProps) {
  const thumb = item.thumbnail?.trim() ?? "";

  return (
    <Link
      href={withLocale(locale, `/videos/${item.slug}`)}
      className={cn(
        "group block cursor-pointer outline-none transition-[transform,opacity] duration-[250ms] ease-out active:scale-[0.99]",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/5 transition-[box-shadow,ring-color,transform] duration-[250ms] ease-out group-hover:-translate-y-0.5 group-hover:ring-white/22 group-hover:shadow-lg group-hover:shadow-black/40">
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.03]"
            sizes={THUMB_SIZES}
          />
        ) : (
          <CoverPlaceholder className="absolute inset-0 rounded-none bg-zinc-800/80 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950" />
        )}
        <span className="absolute bottom-2 right-2 z-10 rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
          {item.duration}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-100 group-hover:text-white">
            {item.title}
          </h2>
          <p className="mt-1 text-xs text-zinc-500/85">
            {formatShortDate(item.date, locale)}
          </p>
        </div>
      </div>
    </Link>
  );
}
