import type { Locale } from "@/i18n/config";
import { formatLongDate } from "@/lib/format-date";

type ArticleMetaProps = {
  date: string;
  extra?: string;
  locale: Locale;
};

export function ArticleMeta({ date, extra, locale }: ArticleMetaProps) {
  const formatted = formatLongDate(date, locale);

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      {formatted}
      {extra ? ` · ${extra}` : null}
    </p>
  );
}
