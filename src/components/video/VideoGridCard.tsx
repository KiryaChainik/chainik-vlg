import Link from "next/link";

import type { SiteVideoItem } from "@/types/site-video";
import { cn } from "@/lib/utils";

function formatVideoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type VideoGridCardProps = {
  item: SiteVideoItem;
  className?: string;
};

export function VideoGridCard({ item, className }: VideoGridCardProps) {
  return (
    <Link
      href={`/videos/${item.slug}`}
      className={cn(
        "group block cursor-pointer outline-none transition-[transform,opacity] duration-[250ms] ease-out active:scale-[0.99]",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/5 transition-[box-shadow,ring-color,transform] duration-[250ms] ease-out group-hover:-translate-y-0.5 group-hover:ring-white/22 group-hover:shadow-lg group-hover:shadow-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
          {item.duration}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-100 group-hover:text-white">
            {item.title}
          </h2>
          <p className="mt-1 text-xs text-zinc-500/85">
            {formatVideoDate(item.date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
