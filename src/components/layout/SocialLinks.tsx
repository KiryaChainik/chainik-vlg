import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINK_CLASS =
  "text-inherit underline decoration-zinc-300/70 underline-offset-[0.2em] transition-[color,decoration-color] duration-200 ease-out hover:text-zinc-900 hover:decoration-zinc-500/80 dark:decoration-zinc-600/60 dark:hover:text-zinc-100 dark:hover:decoration-zinc-500/50";

type SocialItem = { href: string; label: string };

type SocialLinksProps = {
  className?: string;
  align?: "start" | "end";
  /** Размер как у строки копирайта в футере */
  dense?: boolean;
  links?: readonly SocialItem[];
  ariaLabel?: string;
};

export function SocialLinks({
  className,
  align = "start",
  dense = false,
  links,
  ariaLabel = "Социальные сети",
}: SocialLinksProps) {
  const items = links ?? SOCIAL_LINKS;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        dense
          ? "text-xs text-zinc-400 dark:text-zinc-500"
          : "text-sm text-zinc-500 dark:text-zinc-400",
        align === "end" && "sm:text-right",
        className,
      )}
    >
      <ul
        className={cn(
          "inline-flex flex-wrap items-center gap-x-1.5 gap-y-1",
          align === "end" && "sm:justify-end",
        )}
      >
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-x-1.5">
            {i > 0 ? (
              <span
                aria-hidden
                className="select-none text-zinc-300 dark:text-zinc-600"
              >
                ·
              </span>
            ) : null}
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
