import Link from "next/link";

import {
  navInteractiveActive,
  navInteractiveBase,
  navInteractiveFocus,
  navInteractiveHover,
} from "@/components/layout/nav-interactive";
import {
  NEWS_DATE_PERIODS,
  type NewsDatePeriod,
} from "@/lib/content/articles";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { cn } from "@/lib/utils";

function periodLabel(m: Messages, p: NewsDatePeriod): string {
  switch (p) {
    case "today":
      return m.newsFilterToday;
    case "week":
      return m.newsFilterWeek;
    case "month":
      return m.newsFilterMonth;
    case "year":
      return m.newsFilterYear;
  }
}

function chipClass(active: boolean): string {
  return cn(
    navInteractiveBase,
    navInteractiveFocus,
    "inline-flex shrink-0 px-2.5 py-1.5 text-xs font-medium sm:text-sm",
    active ? navInteractiveActive : navInteractiveHover,
  );
}

export function NewsPeriodFilter({
  locale,
  current,
}: {
  locale: Locale;
  current: NewsDatePeriod | null;
}) {
  const m = getMessages(locale);
  const basePath = withLocale(locale, "/news");

  return (
    <nav
      aria-label={m.newsFilterAria}
      className="mt-6 flex flex-wrap gap-2 border-b border-zinc-200/25 pb-4 dark:border-zinc-800/35"
    >
      <Link href={basePath} className={chipClass(current === null)} prefetch={false}>
        {m.newsFilterAll}
      </Link>
      {NEWS_DATE_PERIODS.map((p) => (
        <Link
          key={p}
          href={`${basePath}?period=${p}`}
          className={chipClass(current === p)}
          prefetch={false}
        >
          {periodLabel(m, p)}
        </Link>
      ))}
    </nav>
  );
}

export function newsPageTitleForPeriod(
  m: Messages,
  period: NewsDatePeriod | null,
): string {
  if (!period) return m.newsIndexTitle;
  const suffix = periodLabel(m, period);
  return `${m.newsIndexTitle} — ${suffix}`;
}
