import type { Metadata } from "next";

import { SocialLinks } from "@/components/layout";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

const ABOUT_DESCRIPTION =
  "Киря Чайник — блог о периферии и технике: обзоры, новости, видео, тесты.";

export const metadata: Metadata = {
  title: "О проекте",
  description: ABOUT_DESCRIPTION,
  openGraph: {
    title: `О проекте · ${SITE_NAME}`,
    description: ABOUT_DESCRIPTION,
    url: absoluteUrl("/about"),
  },
};

const LEAD =
  "text-zinc-700 dark:text-zinc-300";
const BODY =
  "text-zinc-600 dark:text-zinc-400";
const EMPH =
  "font-semibold text-zinc-900 dark:text-zinc-100";
const PAREN =
  "italic text-zinc-500 dark:text-zinc-500";

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        О проекте
      </h1>

      <p className={`mt-6 leading-relaxed ${LEAD}`}>
        <span className={EMPH}>Киря Чайник</span> — блог о компьютерной
        периферии и технике, который я делаю из любопытства и любви к деталям,
        в том числе чтобы упростить выбор для вас.
      </p>

      <p className={`mt-4 leading-relaxed ${BODY}`}>
        Здесь я разбираю мышки, клавиатуры, наушники и другие периферийные{" "}
        <em className={PAREN}>(и не только)</em> устройства, обращая внимание не
        только на характеристики, но и на реальный пользовательский опыт на
        длинной дистанции.
      </p>

      <p className={`mt-6 font-medium ${LEAD}`}>
        Основные форматы проекта:
      </p>
      <ul
        className={`mt-3 space-y-2.5 leading-relaxed ${BODY}`}
        role="list"
      >
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>новости индустрии</span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>текстовые-обзоры</span>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 font-mono text-zinc-400 tabular-nums dark:text-zinc-600">
            —
          </span>
          <span>видео-обзоры</span>
        </li>
      </ul>

      <p className={`mt-6 leading-relaxed ${BODY}`}>
        Дополнительно — сравнения, тесты и модификации.
      </p>

      <p className={`mt-6 leading-relaxed ${BODY}`}>
        Я не ставлю цель быть «экспертом всея Интернета». Мне важнее разобраться
        самому и передать это понимание другим.
      </p>

      <p className={`mt-8 border-t border-zinc-200/40 pt-8 leading-relaxed dark:border-zinc-800/50 ${BODY}`}>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Сотрудничество:
        </span>{" "}
        <a
          href="mailto:nefekirik@gmail.com"
          className="font-medium text-zinc-800 underline decoration-zinc-300/80 underline-offset-2 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:text-zinc-50 dark:hover:decoration-zinc-500"
        >
          nefekirik@gmail.com
        </a>
      </p>

      <SocialLinks className="mt-6" align="start" />
    </div>
  );
}
