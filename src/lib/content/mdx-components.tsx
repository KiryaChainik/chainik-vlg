import type { MDXComponents } from "mdx/types";
import type { HTMLAttributes, ReactNode } from "react";

import { ArticleGallery, MdxImage } from "@/components/article/MdxImage";
import { cn } from "@/lib/utils";

export const mdxComponents: MDXComponents = {
  ArticleGallery,
  /* Без <figure>/<div>: Markdown `![]()` кладёт img внутрь <p>, туда нельзя вкладывать блочные теги — иначе hydration error. */
  img: ({ className, ...props }) => (
    <MdxImage className={className} {...props} />
  ),
  /*
   * Явный <video /> в MDX — «explicit JSX»: @mdx-js/mdx не подставляет components.video,
   * остаётся нативный тег. Ограничение высоты — в globals.css → .mdx-content video
   */
  h2: (props) => (
    <h2
      className="mt-8 text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mt-3 text-[1.0625rem] leading-[1.52] text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-3 list-disc space-y-1.5 pl-5 text-[1.0625rem] leading-[1.52] text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-3 list-decimal space-y-1.5 pl-5 text-[1.0625rem] leading-[1.52] text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  li: (props) => <li className="leading-[1.52] [text-wrap:pretty]" {...props} />,
  strong: (props) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
  em: (props) => (
    <em className="italic text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 transition-[color,text-decoration-color] duration-200 ease-out hover:decoration-zinc-600 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-300"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.9em] font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
      {...props}
    />
  ),
  hr: (props) => (
    <hr
      className="my-8 border-0 border-t border-zinc-200/50 dark:border-zinc-800/55"
      {...props}
    />
  ),
  u: (props) => (
    <u
      className="underline decoration-zinc-500 underline-offset-[0.12em] dark:decoration-zinc-400"
      {...props}
    />
  ),
  span: (props: HTMLAttributes<HTMLSpanElement> & { class?: string }) => {
    const raw = props as Record<string, unknown>;
    const children = raw.children as ReactNode;
    const cls = (raw.className ?? raw.class) as string | undefined;
    const rest = { ...raw };
    delete rest.class;
    delete rest.className;
    delete rest.children;

    if (cls === "tg-spoiler") {
      return (
        <span
          className={cn(
            "cursor-pointer rounded bg-zinc-200/40 px-0.5 text-zinc-400 blur-[7px] transition-[filter,color] duration-200 ease-out",
            "hover:blur-none hover:text-zinc-800 focus-visible:blur-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 dark:bg-zinc-700/45 dark:text-zinc-500 dark:hover:text-zinc-100",
          )}
          tabIndex={0}
          title="Показать"
          {...(rest as HTMLAttributes<HTMLSpanElement>)}
        >
          {children}
        </span>
      );
    }
    return (
      <span className={cls} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    );
  },
};
