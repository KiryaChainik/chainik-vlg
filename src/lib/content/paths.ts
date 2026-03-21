import fs from "fs";
import path from "path";

export type ContentSection = "news" | "reviews" | "videos";

function hasAnyMdxInDir(dir: string): boolean {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return false;
  return fs.readdirSync(dir).some((f) => f.endsWith(".mdx"));
}

/**
 * Каталог MDX для раздела (`news/`, `reviews/` или `videos/`).
 *
 * Без `CONTENT_DIR`: если в `content/<раздел>/` есть хотя бы один `.mdx` — берётся он;
 * иначе — `content.example/<раздел>/`. Так новости из Telegram могут жить в `content/news/`,
 * а демо обзоров и видео остаются из примера, пока вы не положите свои файлы в
 * `content/reviews/` или `content/videos/`.
 *
 * С `CONTENT_DIR`: один корень как раньше — только этот каталог, без смешения с примером.
 */
export function getContentDirForSection(section: ContentSection): string {
  const cwd = process.cwd();
  const override = process.env.CONTENT_DIR?.trim();
  if (override) {
    const root = path.isAbsolute(override)
      ? override
      : path.resolve(/* turbopackIgnore: true */ cwd, override);
    return path.join(root, section);
  }
  const privateDir = path.join(/* turbopackIgnore: true */ cwd, "content", section);
  const exampleDir = path.join(
    /* turbopackIgnore: true */ cwd,
    "content.example",
    section,
  );
  if (hasAnyMdxInDir(privateDir)) {
    return privateDir;
  }
  return exampleDir;
}
