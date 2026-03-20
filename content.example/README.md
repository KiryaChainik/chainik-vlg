# Пример контента (в git)

Скопируйте весь каталог в **`content/`** в корне проекта и правьте файлы там — папка `content/` в `.gitignore` и не попадёт в репозиторий.

```bash
cp -r content.example content
```

Структура: `news/`, `reviews/`, `videos/` — только файлы `.mdx`.

Если каталога **`content/`** нет, сайт при сборке и в dev берёт материалы отсюда (`content.example`).

Опционально: переменная окружения **`CONTENT_DIR`** — другой путь к корню с тремя подпапками.

## Заглушки вместо картинок

| Файл | Назначение |
|------|------------|
| `news/news-demo-placeholder.mdx` | новость без `cover` |
| `reviews/review-demo-placeholder.mdx` | обзор без `cover` |

**Видео:** в сетке несколько роликов — у **`vid-01`…`vid-07`** задано **`cover`** (разные превью через Picsum). Один файл **`videos/vid-demo-placeholder.mdx`** без `cover` и без VK в `videos` — в сетке только у него SVG-заглушка.
