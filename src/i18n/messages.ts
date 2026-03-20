import type { Locale } from "./config";
import { isLocale } from "./config";

export type Messages = {
  siteDescription: string;
  navHome: string;
  navNews: string;
  navReviews: string;
  navVideos: string;
  navAbout: string;
  socialNav: string;
  footerNav: string;
  mainNav: string;
  brandHome: string;
  language: string;
  languageRu: string;
  languageEn: string;
  homeTitle: string;
  homeTagline: string;
  homeNews: string;
  homeReviews: string;
  homeAllNews: string;
  homeAllReviews: string;
  emptyMaterials: string;
  newsIndexTitle: string;
  newsIndexIntro: string;
  newsMetaDesc: string;
  reviewsIndexTitle: string;
  reviewsIndexIntro: string;
  reviewsMetaDesc: string;
  videosIndexTitle: string;
  videosIndexIntro: string;
  videosMetaDesc: string;
  videosEmpty: string;
  aboutTitle: string;
  aboutMetaDesc: string;
  aboutAfterBrand: string;
  aboutP2: string;
  aboutFormatsLead: string;
  aboutFormatNews: string;
  aboutFormatReviews: string;
  aboutFormatVideos: string;
  aboutExtra: string;
  aboutClosing: string;
  aboutCoop: string;
  backAllNews: string;
  backAllReviews: string;
  backAllVideos: string;
  newsKind: string;
  reviewKind: string;
  openArticle: string;
  tagListAria: string;
  tagHeading: string;
  tagCountOneRu: string;
  tagCountFewRu: string;
  tagCountManyRu: string;
  tagCountOneEn: string;
  tagCountManyEn: string;
  notFoundTitle: string;
  watchOnVk: string;
  socialChat: string;
  embeddedVideoAria: string;
  feedLoading: string;
  feedLoadError: string;
  newsFilterAria: string;
  newsFilterAll: string;
  newsFilterToday: string;
  newsFilterWeek: string;
  newsFilterMonth: string;
  newsFilterYear: string;
  newsEmptyPeriod: string;
};

const ru: Messages = {
  siteDescription: "Разбираюсь, чтобы тебе было проще",
  navHome: "Главная",
  navNews: "Новости",
  navReviews: "Обзоры",
  navVideos: "Видео",
  navAbout: "О проекте",
  socialNav: "Социальные сети",
  footerNav: "Нижнее меню",
  mainNav: "Основное меню",
  brandHome: "на главную",
  language: "Язык",
  languageRu: "Русский",
  languageEn: "English",
  homeTitle: "Главная",
  homeTagline: "Блог о технике и периферии",
  homeNews: "Новости",
  homeReviews: "Обзоры",
  homeAllNews: "Все новости",
  homeAllReviews: "Все обзоры",
  emptyMaterials: "Пока нет материалов.",
  newsIndexTitle: "Новости",
  newsIndexIntro: "Все опубликованные новости о технике и периферии",
  newsMetaDesc:
    "Новости о технике, гаджетах и тенденциях рынка — подборка материалов редакции.",
  reviewsIndexTitle: "Обзоры",
  reviewsIndexIntro: "Все опубликованные обзоры",
  reviewsMetaDesc:
    "Обзоры техники и периферии — опыт использования и практические выводы.",
  videosIndexTitle: "Видео",
  videosIndexIntro:
    "Превью задаётся полем cover в MDX для сетки и соцпревью. Без cover можно подтянуть кадр с VK, если в frontmatter есть блок videos с встраиванием; иначе в сетке показывается SVG-заглушка. Файлы: content/videos/*.mdx.",
  videosMetaDesc:
    "Видеообзоры и ролики о технике и периферии — в том же формате, что и основной контент сайта.",
  videosEmpty: "Пока нет опубликованных роликов.",
  aboutTitle: "О проекте",
  aboutMetaDesc:
    "Киря Чайник — блог о периферии и технике: обзоры, новости, видео, тесты.",
  aboutAfterBrand:
    " — блог о компьютерной периферии и технике, который я делаю из любопытства и любви к деталям, в том числе чтобы упростить выбор для вас.",
  aboutP2:
    "Здесь я разбираю мышки, клавиатуры, наушники и другие периферийные (и не только) устройства, обращая внимание не только на характеристики, но и на реальный пользовательский опыт на длинной дистанции.",
  aboutFormatsLead: "Основные форматы проекта:",
  aboutFormatNews: "новости индустрии",
  aboutFormatReviews: "текстовые обзоры",
  aboutFormatVideos: "видеообзоры",
  aboutExtra: "Дополнительно — сравнения, тесты и модификации.",
  aboutClosing:
    "Я не ставлю цель быть «экспертом всея Интернета». Мне важнее разобраться самому и передать это понимание другим.",
  aboutCoop: "Сотрудничество:",
  backAllNews: "← Все новости",
  backAllReviews: "← Все обзоры",
  backAllVideos: "← Все видео",
  newsKind: "Новость",
  reviewKind: "Обзор",
  openArticle: "Открыть материал",
  tagListAria: "Теги",
  tagHeading: "Тег",
  tagCountOneRu: "материал",
  tagCountFewRu: "материала",
  tagCountManyRu: "материалов",
  tagCountOneEn: "",
  tagCountManyEn: "",
  notFoundTitle: "Страница не найдена",
  watchOnVk: "Смотреть на VK",
  socialChat: "Чат",
  embeddedVideoAria: "Встроенное видео",
  feedLoading: "Загружаем ещё…",
  feedLoadError: "Не удалось подгрузить. Повторить",
  newsFilterAria: "Фильтр новостей по дате",
  newsFilterAll: "Все",
  newsFilterToday: "Сегодня",
  newsFilterWeek: "Неделя",
  newsFilterMonth: "Месяц",
  newsFilterYear: "Год",
  newsEmptyPeriod: "За выбранный период новостей нет.",
};

const en: Messages = {
  siteDescription: "I dig in so you don’t have to",
  navHome: "Home",
  navNews: "News",
  navReviews: "Reviews",
  navVideos: "Video",
  navAbout: "About",
  socialNav: "Social links",
  footerNav: "Footer navigation",
  mainNav: "Main navigation",
  brandHome: "home",
  language: "Language",
  languageRu: "Русский",
  languageEn: "English",
  homeTitle: "Home",
  homeTagline: "A blog about gear and peripherals",
  homeNews: "News",
  homeReviews: "Reviews",
  homeAllNews: "All news",
  homeAllReviews: "All reviews",
  emptyMaterials: "No posts yet.",
  newsIndexTitle: "News",
  newsIndexIntro: "All published news on tech and peripherals",
  newsMetaDesc:
    "Tech news, gadgets, and market trends — curated notes from the desk.",
  reviewsIndexTitle: "Reviews",
  reviewsIndexIntro: "All published reviews",
  reviewsMetaDesc:
    "Hands-on hardware and peripheral reviews — long-term use and practical takeaways.",
  videosIndexTitle: "Video",
  videosIndexIntro:
    "The cover field in MDX sets the grid thumbnail and social preview. Without cover, a VK embed frame may be used when the videos block is present; otherwise the grid shows an SVG placeholder. Files: content/videos/*.mdx.",
  videosMetaDesc:
    "Video reviews and clips about tech and peripherals — same vibe as the rest of the site.",
  videosEmpty: "No published videos yet.",
  aboutTitle: "About",
  aboutMetaDesc:
    "Kirya Chainik — a blog about peripherals and tech: reviews, news, video, tests.",
  aboutAfterBrand:
    " is a blog about PC peripherals and hardware I run out of curiosity and love for the details — partly to make choosing gear easier for you.",
  aboutP2:
    "Here I break down mice, keyboards, headphones, and other peripheral (and not only) devices — not just specs, but real day-to-day experience over time.",
  aboutFormatsLead: "Main formats:",
  aboutFormatNews: "industry news",
  aboutFormatReviews: "written reviews",
  aboutFormatVideos: "video reviews",
  aboutExtra: "Plus comparisons, tests, and mods.",
  aboutClosing:
    "I’m not trying to be “the expert of the whole internet.” I’d rather figure things out myself and pass that understanding on.",
  aboutCoop: "Collaboration:",
  backAllNews: "← All news",
  backAllReviews: "← All reviews",
  backAllVideos: "← All video",
  newsKind: "News",
  reviewKind: "Review",
  openArticle: "Open article",
  tagListAria: "Tags",
  tagHeading: "Tag",
  tagCountOneRu: "",
  tagCountFewRu: "",
  tagCountManyRu: "",
  tagCountOneEn: "article",
  tagCountManyEn: "articles",
  notFoundTitle: "Page not found",
  watchOnVk: "Watch on VK",
  socialChat: "Chat",
  embeddedVideoAria: "Embedded video",
  feedLoading: "Loading more…",
  feedLoadError: "Couldn’t load. Try again",
  newsFilterAria: "Filter news by date",
  newsFilterAll: "All",
  newsFilterToday: "Today",
  newsFilterWeek: "Week",
  newsFilterMonth: "Month",
  newsFilterYear: "Year",
  newsEmptyPeriod: "No news for this period.",
};

const byLocale: Record<Locale, Messages> = { ru, en };

export function getMessages(locale: string): Messages {
  if (isLocale(locale)) return byLocale[locale];
  return byLocale.ru;
}

export function intlLocaleFor(locale: Locale): string {
  return locale === "en" ? "en-US" : "ru-RU";
}

/** Склонение для RU: 1 материал, 2–4 материала, 5+ материалов */
export function ruMaterialCountLabel(n: number, m: Messages): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${m.tagCountOneRu}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} ${m.tagCountFewRu}`;
  return `${n} ${m.tagCountManyRu}`;
}

export function enArticleCountLabel(n: number, m: Messages): string {
  const word = n === 1 ? m.tagCountOneEn : m.tagCountManyEn;
  return `${n} ${word}`;
}
