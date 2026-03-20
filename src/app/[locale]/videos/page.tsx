import type { Metadata } from "next";

import { VideoGridCard } from "@/components/video";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { SITE_NAME } from "@/lib/constants";
import { getPublishedVideos } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  return {
    title: m.videosIndexTitle,
    description: m.videosMetaDesc,
    openGraph: {
      title: `${m.videosIndexTitle} · ${SITE_NAME}`,
      description: m.videosMetaDesc,
      url: absoluteUrl(withLocale(locale, "/videos")),
    },
    twitter: {
      title: `${m.videosIndexTitle} · ${SITE_NAME}`,
      description: m.videosMetaDesc,
    },
  };
}

export default async function VideosPage({ params }: PageProps) {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  const videos = await getPublishedVideos();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {m.videosIndexTitle}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        {m.videosIndexIntro}
      </p>

      <div className="mt-8 -mx-4 min-h-[70vh] rounded-2xl bg-zinc-950 px-4 py-8 text-zinc-100 shadow-inner ring-1 ring-white/5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {videos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-700 py-16 text-center text-sm text-zinc-500">
            {m.videosEmpty}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((item) => (
              <li key={item.slug}>
                <VideoGridCard item={item} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
