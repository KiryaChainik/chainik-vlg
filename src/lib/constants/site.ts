/**
 * Публичный URL сайта без завершающего слэша.
 * В продакшене задайте в .env: NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Киря Чайник";

export const SITE_DESCRIPTION =
  "Разбираюсь, чтобы тебе было проще";

export const MAIN_NAV = [
  { href: "/", label: "Главная" },
  { href: "/news", label: "Новости" },
  { href: "/reviews", label: "Обзоры" },
  { href: "/videos", label: "Видео" },
  { href: "/about", label: "О проекте" },
] as const;

function socialHref(envKey: string, fallback: string): string {
  const v = process.env[envKey];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}

/**
 * Внешние ссылки. При необходимости задайте в .env:
 * NEXT_PUBLIC_SOCIAL_YOUTUBE, …_TELEGRAM_CHANNEL, …_TELEGRAM_CHAT,
 * …_TIKTOK, …_VK, …_BOOSTY
 *
 * ВК по умолчанию — сообщество из oid встраиваемых роликов (-169538098).
 */
export const SOCIAL_LINKS = [
  {
    href: socialHref(
      "NEXT_PUBLIC_SOCIAL_YOUTUBE",
      "https://www.youtube.com/",
    ),
    label: "YouTube",
  },
  {
    href: socialHref(
      "NEXT_PUBLIC_SOCIAL_TELEGRAM_CHANNEL",
      "https://t.me/",
    ),
    label: "Telegram",
  },
  {
    href: socialHref("NEXT_PUBLIC_SOCIAL_TELEGRAM_CHAT", "https://t.me/"),
    label: "Чат",
  },
  {
    href: socialHref("NEXT_PUBLIC_SOCIAL_TIKTOK", "https://www.tiktok.com/"),
    label: "TikTok",
  },
  {
    href: socialHref(
      "NEXT_PUBLIC_SOCIAL_VK",
      "https://vk.com/club169538098",
    ),
    label: "VK",
  },
  {
    href: socialHref("NEXT_PUBLIC_SOCIAL_BOOSTY", "https://boosty.to/"),
    label: "Boosty",
  },
] as const satisfies ReadonlyArray<{ href: string; label: string }>;
