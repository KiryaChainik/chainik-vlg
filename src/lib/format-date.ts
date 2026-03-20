/** Короткая дата в стиле тизеров главной: «19 мар. 2025 г.» */
export function formatShortRuDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
