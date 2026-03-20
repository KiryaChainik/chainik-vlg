"use client";

import { cn } from "@/lib/utils";

type CoverPlaceholderProps = {
  className?: string;
};

/** SVG-заглушка 16:9 — та же визуальная роль, что и обложка без файла. */
export function CoverPlaceholder({ className }: CoverPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label="Нет изображения"
      className={cn(
        "flex size-full min-h-0 items-center justify-center bg-gradient-to-br from-zinc-200/95 via-zinc-100 to-zinc-200/80 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800/90",
        className,
      )}
    >
      <svg
        viewBox="0 0 120 68"
        className="aspect-[120/68] h-auto w-[min(42%,7rem)] opacity-50 dark:opacity-40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="3"
          y="6"
          width="114"
          height="56"
          rx="5"
          className="stroke-zinc-400/90 dark:stroke-zinc-500/85"
          strokeWidth="1.75"
        />
        <path
          d="M3 46 26 26 42 36 70 16 117 52"
          className="stroke-zinc-400/90 dark:stroke-zinc-500/85"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="84"
          cy="20"
          r="5.5"
          className="stroke-zinc-400/90 dark:stroke-zinc-500/85"
          strokeWidth="1.75"
        />
      </svg>
    </div>
  );
}
