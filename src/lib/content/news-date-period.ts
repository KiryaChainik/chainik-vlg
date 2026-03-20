import type { Article } from "@/types/article";

export type NewsDatePeriod = "today" | "week" | "month" | "year";

export const NEWS_DATE_PERIODS: readonly NewsDatePeriod[] = [
  "today",
  "week",
  "month",
  "year",
] as const;

export function parseNewsDatePeriod(
  raw: string | string[] | undefined | null,
): NewsDatePeriod | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || typeof v !== "string") return null;
  return NEWS_DATE_PERIODS.includes(v as NewsDatePeriod)
    ? (v as NewsDatePeriod)
    : null;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Дата из frontmatter: ISO `YYYY-MM-DD` — полночь по **локальному** времени,
 * чтобы не съезжал день из‑за UTC (`new Date("2025-02-05")`).
 */
export function articlePublishedStartOfDayMs(iso: string): number {
  const s = iso.trim();
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (ymd) {
    const y = Number(ymd[1]);
    const mo = Number(ymd[2]) - 1;
    const d = Number(ymd[3]);
    const local = new Date(y, mo, d);
    local.setHours(0, 0, 0, 0);
    return local.getTime();
  }
  const t = new Date(s).getTime();
  return t;
}

/**
 * Оставляет новости с датой публикации >= начала выбранного периода.
 * Отсчёт от локального времени сервера в момент запроса.
 *
 * **Год:** с 1 января **предыдущего календарного** года 00:00 (включая весь
 * прошлый год и текущий до сегодня) — иначе «год назад» отрезает всё раньше
 * той же даты в прошлом году.
 */
export function filterNewsByDatePeriod(
  articles: Article[],
  period: NewsDatePeriod,
  nowMs: number = Date.now(),
): Article[] {
  const now = new Date(nowMs);
  let cutoff: Date;

  switch (period) {
    case "today":
      cutoff = startOfLocalDay(now);
      break;
    case "week": {
      cutoff = startOfLocalDay(now);
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    }
    case "month": {
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    }
    case "year": {
      cutoff = new Date(now.getFullYear() - 1, 0, 1);
      cutoff.setHours(0, 0, 0, 0);
      break;
    }
  }

  const cutoffMs = cutoff.getTime();
  return articles.filter((a) => {
    const t = articlePublishedStartOfDayMs(a.frontmatter.date);
    return Number.isFinite(t) && t >= cutoffMs;
  });
}
