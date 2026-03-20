import type { Metadata } from "next";

import { VideoGridCard } from "@/components/video";
import { getPublishedVideos } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Видеообзоры и ролики о технике и периферии — в том же формате, что и основной контент сайта.";

const CODE =
  "rounded bg-zinc-200/90 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";

export const metadata: Metadata = {
  title: "Видео",
  description,
  openGraph: {
    title: `Видео · ${SITE_NAME}`,
    description,
    url: absoluteUrl("/videos"),
  },
  twitter: {
    title: `Видео · ${SITE_NAME}`,
    description,
  },
};

export default async function VideosPage() {
  const videos = await getPublishedVideos();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Видео
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Превью задаётся полем <code className={CODE}>cover</code> в MDX для сетки
        и соцпревью. Без <code className={CODE}>cover</code> можно подтянуть кадр с
        VK, если в frontmatter есть блок <code className={CODE}>videos</code> с
        встраиванием; иначе в сетке показывается SVG-заглушка. Файлы:{" "}
        <code className={CODE}>content/videos/*.mdx</code>.
      </p>

      <div className="mt-8 -mx-4 min-h-[70vh] rounded-2xl bg-zinc-950 px-4 py-8 text-zinc-100 shadow-inner ring-1 ring-white/5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {videos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-700 py-16 text-center text-sm text-zinc-500">
            Пока нет опубликованных роликов.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((item) => (
              <li key={item.slug}>
                <VideoGridCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
