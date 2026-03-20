import fs from "fs";
import path from "path";

/**
 * Корень MDX-контента.
 * - По умолчанию: каталог `content/` в корне проекта, если он есть.
 * - Иначе: `content.example/` из репозитория (демо для сборки и клона).
 * - Переопределение: переменная `CONTENT_DIR` (путь от корня проекта или абсолютный).
 */
export function getContentRoot(): string {
  const cwd = process.cwd();
  const override = process.env.CONTENT_DIR?.trim();
  if (override) {
    return path.isAbsolute(override)
      ? override
      : path.resolve(
          /* turbopackIgnore: true */ cwd,
          override,
        );
  }
  const privateRoot = path.join(/* turbopackIgnore: true */ cwd, "content");
  if (fs.existsSync(privateRoot)) {
    return privateRoot;
  }
  return path.join(/* turbopackIgnore: true */ cwd, "content.example");
}
