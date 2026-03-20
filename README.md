# Киря Чайник · chainik-vlg

Сайт-блог о компьютерной периферии и технике: новости, обзоры, видео. Статический контент в **MDX**, сборка на **Next.js** (App Router).

**Языки документации:** [Русский](#ru) · [English](#en)

---

<a id="ru"></a>

## Русский

### Требования

- Node.js 20+ (рекомендуется LTS)
- npm

### Установка и запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) — с корня выполнится редирект на **`/ru`** или **`/en`** в зависимости от языка браузера (`Accept-Language`) и cookie **`NEXT_LOCALE`** (ставится при переключении языка в футере). Публичные пути: `/ru/...`, `/en/...` (например `/ru/news`, `/en/about`).

### Скрипты

| Команда     | Описание              |
| ----------- | --------------------- |
| `npm run dev`   | режим разработки      |
| `npm run build` | продакшен-сборка      |
| `npm run start` | запуск после `build`  |
| `npm run lint`  | ESLint                |
| `npm run test`  | Vitest (watch)        |
| `npm run test:run` | Vitest, один прогон |
| `npm run test:e2e` | Playwright (smoke); один раз: `npx playwright install` |

**Тесты**

- **Vitest** — `vitest.config.ts`, файлы `*.test.ts` рядом с кодом в `src/lib/` (`format-date`, `utils`, `vk-video-thumbnail`). Команда: `npm run test` (watch) или `npm run test:run` (CI).
- **Playwright** — `playwright.config.ts`, сценарии в `e2e/`: `/ru`, `/ru/news`, `/ru/reviews`, `/ru/videos`, быстрый чек `/en`. Перед первым запуском: `npx playwright install`. Поднимает `npm run dev` сам или подключается к уже запущенному (порт 3000).

**Картинки:** удалённые обложки и превью идут через `next/image` (AVIF/WebP). Разрешённые хосты — в `next.config.ts` (`remotePatterns`); для нового CDN добавь запись туда.

### Переменные окружения

Скопируй `.env.example` в `.env.local` и при необходимости задай:

- `NEXT_PUBLIC_SITE_URL` — публичный URL сайта (SEO, Open Graph)
- `NEXT_PUBLIC_SOCIAL_*` — ссылки на соцсети (см. комментарии в `.env.example`)

Секреты в репозиторий не коммитить: `.env*` игнорируются, кроме `.env.example`.

### Где что лежит

| Путь | Назначение |
| ---- | ---------- |
| `src/app/` | маршруты Next.js: сегмент **`[locale]`** (`ru` / `en`), страницы главная, новости, обзоры, видео, о проекте |
| `src/middleware.ts` | редирект с `/` на `/ru` или `/en`, cookie локали |
| `src/i18n/` | локали, словари UI (`messages.ts`), хелперы путей |
| `content/` | твой MDX-контент (не в git): `news/`, `reviews/`, `videos/` |
| `content.example/` | пример MDX в репозитории; скопируй в `content/` (подробности и таблица демо с заглушками — `content.example/README.md`) |
| `src/components/` | UI: шапка, футер, карточки, видео |
| `src/lib/` | контент-логика, SEO, константы сайта |

Тексты разделов и метаданные бренда — в `src/lib/constants/site.ts`. Контент читается из `content/`, если папка есть, иначе из `content.example/`. Переменная **`CONTENT_DIR`** переопределяет корень (см. `.env.example`).

### Контент (MDX)

- **Новости и обзоры** — см. `content.example/news/`, `content.example/reviews/`. Поле `cover` необязательно: без него показывается SVG-заглушка (см. `news-demo-placeholder.mdx`, `review-demo-placeholder.mdx`).
- **Видео** — `content.example/videos/`: у большинства роликов задано `cover` (превью в сетке); один файл **`vid-demo-placeholder.mdx`** без обложки — демо заглушки. Поля `duration`, опционально `videos[]` с VK `embedUrl` — подсказки на `/ru/videos` или `/en/videos`.

Тексты статей в MDX на стороне контента не переводятся; переводится оболочка сайта (навигация, футер, подписи, страница «О проекте»).

**Списки новостей и обзоров** (включая **две колонки на главной**) грузятся порциями при прокрутке (infinite scroll): первая порция в HTML, дальше — `GET /api/news/feed` и `/api/reviews/feed` (размер порции — `ARTICLE_FEED_PAGE_SIZE` в `src/lib/constants/pagination.ts`).

На **`/news`** доступен фильтр по дате публикации: query `period=today|week|month|year` и пункт «Все»; та же отсечка участвует в подгрузке (`/api/news/feed?period=…`). Даты в MDX вида `YYYY-MM-DD` сравниваются как **календарный день в локальном времени сервера**. **Год:** с **1 января предыдущего календарного года** 00:00 (не «ровно 365 дней назад»). **Неделя:** с полуночи (сегодня − 7 дней). **Месяц:** та же дата − 1 месяц.

После правок контента: `npm run dev` или `npm run build`.

### Лицензия и вклад

Приватный/личный проект; если откроешь лицензию — допиши сюда блок «Лицензия».

---

<a id="en"></a>

## English

Blog site about PC peripherals and tech: **news**, **reviews**, and **videos**. Editorial content lives in **MDX**; built with **Next.js** (App Router) and **React 19**.

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm

### Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to **`/ru`** or **`/en`** from the browser `Accept-Language` header and the **`NEXT_LOCALE`** cookie (set when you switch language in the footer). Public routes look like `/ru/news`, `/en/about`, etc.

### Scripts

| Script          | Description        |
| --------------- | ----------------- |
| `npm run dev`   | development server |
| `npm run build` | production build   |
| `npm run start` | run after `build`  |
| `npm run lint`  | ESLint             |
| `npm run test`  | Vitest (watch)      |
| `npm run test:run` | Vitest, single run |
| `npm run test:e2e` | Playwright smoke tests; once run `npx playwright install` |

**Testing**

- **Vitest** — `vitest.config.ts`, colocated `*.test.ts` under `src/lib/`. Use `npm run test` or `npm run test:run` (CI).
- **Playwright** — `playwright.config.ts`, specs in `e2e/`: `/ru` section pages + `/en` nav smoke. Run `npx playwright install` once; dev server on port 3000 is started or reused.

**Images:** remote covers and video thumbs use `next/image` (AVIF/WebP). Allowed hosts are listed in `next.config.ts` under `remotePatterns`—add entries for new CDNs.

### Environment

Copy `.env.example` to `.env.local` and set as needed:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (SEO / Open Graph)
- `NEXT_PUBLIC_SOCIAL_*` — social profile URLs (see `.env.example`)

Do not commit real secrets; `.env*` files are gitignored except `.env.example`.

### Project layout

| Path | Role |
| ---- | ---- |
| `src/app/` | Next.js App Router under **`[locale]`** (`ru` / `en`): home, news, reviews, video, about |
| `src/middleware.ts` | redirects `/` → `/ru` or `/en`, persists locale cookie |
| `src/i18n/` | locales, UI strings (`messages.ts`), path helpers |
| `content/` | your MDX (`news/`, `reviews/`, `videos/`) — gitignored |
| `content.example/` | sample MDX in repo; copy to `content/` (see `content.example/README.md` for demo placeholders) |
| `src/components/` | layout, cards, video UI |
| `src/lib/` | content loading, SEO, site constants |

Site name, nav, and social defaults: `src/lib/constants/site.ts`. MDX is loaded from `content/` if present, otherwise `content.example/`. Override with **`CONTENT_DIR`** (see `.env.example`).

### MDX content

- **News & reviews** — see `content.example/news/`, `content.example/reviews/`. Optional `cover`; without it an SVG placeholder is shown (`*-demo-placeholder.mdx`).
- **Videos** — `content.example/videos/`: most entries set `cover`; **`vid-demo-placeholder.mdx`** has no cover (grid placeholder demo). See `/ru/videos` or `/en/videos` for `duration`, `videos[]`, VK `embedUrl`.

MDX article bodies stay as written; only site chrome (nav, footer, labels, About copy) is localized.

**News and reviews indexes** and the **two home columns** use infinite scroll: the first batch is server-rendered; more loads via `GET /api/news/feed` and `/api/reviews/feed` (page size: `ARTICLE_FEED_PAGE_SIZE` in `src/lib/constants/pagination.ts`).

**`/news`** supports a date filter via `?period=today|week|month|year` (plus “All”). The same filter is applied in `/api/news/feed`. `YYYY-MM-DD` in frontmatter is parsed as **local midnight**. **year:** from **Jan 1 of the previous calendar year** 00:00 (not “a rolling 365 days from this clock time”).

Run `npm run dev` or `npm run build` after content edits.

### License

Private / personal project; add a **License** section here if you publish under an open license.
