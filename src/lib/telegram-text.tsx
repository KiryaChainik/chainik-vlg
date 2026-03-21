import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const SPOILER_PIPE_RE = /\|\|([^|]+)\|\|/g;

/** Для alt, aria-label, SEO — убираем маркеры `||`, оставляем текст. */
export function stripTelegramSpoilerMarkers(text: string): string {
  return text.replace(/\|\|([^|]+)\|\|/g, "$1");
}

type TelegramSpoilerAsItalicProps = {
  text: string;
  className?: string;
};

/** Рендерит `||фрагмент||` как курсив (вместо TG-спойлера). */
export function TelegramSpoilerAsItalic({
  text,
  className,
}: TelegramSpoilerAsItalicProps): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  const re = new RegExp(SPOILER_PIPE_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    nodes.push(text.slice(last, m.index));
    nodes.push(
      <em
        key={key}
        className={cn("italic text-zinc-600 dark:text-zinc-400", className)}
      >
        {m[1]}
      </em>,
    );
    key += 1;
    last = m.index + m[0].length;
  }
  if (last === 0 && nodes.length === 0) {
    return text;
  }
  nodes.push(text.slice(last));
  return <>{nodes}</>;
}
