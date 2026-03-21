/**
 * Скрывать верхнее превью на странице материала, если в теле уже есть видео
 * или обложка — только кадр-превью ролика (экспорт Telegram).
 *
 * Для новостей: не дублировать cover сверху, если в MDX уже есть блок галереи
 * со всеми фото (экспорт Telegram / <ArticleGallery>).
 */
export type ArticleHeroKind = "news" | "reviews";

export function shouldHideArticleHero(
  body: string,
  cover?: string,
  kind?: ArticleHeroKind,
): boolean {
  if (/<video[\s/>]/i.test(body)) return true;
  const c = cover?.trim() ?? "";
  if (c.includes("video-thumb")) return true;
  if (kind === "news" && _bodyHasNewsGallery(body)) return true;
  return false;
}

function _bodyHasNewsGallery(body: string): boolean {
  if (/<ArticleGallery[\s/>]/i.test(body)) return true;
  return body.includes("## Галерея");
}
