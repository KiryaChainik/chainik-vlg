import { cn } from "@/lib/utils";

type KchLogoProps = {
  className?: string;
  /** По умолчанию под высоту строки навигации */
  size?: "sm" | "md";
};

const sizes = {
  sm: "h-8 w-8 text-[0.62rem]",
  md: "h-10 w-10 text-[0.7rem]",
} as const;

/**
 * Монограмма «КЧ» (Киря Чайник) — лого для шапки и при необходимости hero.
 */
export function KchLogo({ className, size = "sm" }: KchLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300/90 bg-white font-bold leading-none tracking-tight text-zinc-900 tabular-nums shadow-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      КЧ
    </span>
  );
}
