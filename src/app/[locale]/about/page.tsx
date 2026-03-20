import type { Metadata } from "next";

import { SocialLinks } from "@/components/layout";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { withLocale } from "@/i18n/paths";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);
  return {
    title: m.aboutTitle,
    description: m.aboutMetaDesc,
    openGraph: {
      title: `${m.aboutTitle} · ${SITE_NAME}`,
      description: m.aboutMetaDesc,
      url: absoluteUrl(withLocale(locale, "/about")),
    },
  };
}

const LEAD = "text-zinc-700 dark:text-zinc-300";
const BODY = "text-zinc-600 dark:text-zinc-400";
const EMPH = "font-semibold text-zinc-900 dark:text-zinc-100";
const PAREN = "italic text-zinc-500 dark:text-zinc-500";

export default async function AboutPage({ params }: PageProps) {
  const { locale: loc } = await params;
  const locale = (isLocale(loc) ? loc : "ru") as Locale;
  const m = getMessages(locale);

  const socialItems = SOCIAL_LINKS.map((item) =>
    item.label === "Чат" ? { ...item, label: m.socialChat } : item,
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {m.aboutTitle}
      </h1>

      <p className={`mt-6 leading-relaxed ${LEAD}`}>
        <span className={EMPH}>{SITE_NAME}</span>
        {m.aboutAfterBrand}
      </p>

      <p className={`mt-4 leading-relaxed ${BODY}`}>{m.aboutP2}</p>

      <p className={`mt-6 font-medium ${LEAD}`}>{m.aboutFormatsLead}</p>
      <ul className={`mt-3 space-y-2.5 leading-relaxed ${BODY}`} role="list">
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>{m.aboutFormatNews}</span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>{m.aboutFormatReviews}</span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>{m.aboutFormatVideos}</span>
        </li>
      </ul>

      <p className={`mt-6 leading-relaxed ${BODY}`}>{m.aboutExtra}</p>

      <p className={`mt-6 leading-relaxed ${BODY}`}>{m.aboutClosing}</p>

      <p
        className={`mt-8 border-t border-zinc-200/40 pt-8 leading-relaxed dark:border-zinc-800/50 ${BODY}`}
      >
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {m.aboutCoop}
        </span>{" "}
        <a
          href="mailto:nefekirik@gmail.com"
          className="font-medium text-zinc-800 underline decoration-zinc-300/80 underline-offset-2 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:text-zinc-50 dark:hover:decoration-zinc-500"
        >
          nefekirik@gmail.com
        </a>
      </p>

      <SocialLinks
        className="mt-6"
        align="start"
        links={socialItems}
        ariaLabel={m.socialNav}
      />
    </div>
  );
}
