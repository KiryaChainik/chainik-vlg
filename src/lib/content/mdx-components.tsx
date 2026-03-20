import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mt-4 leading-[1.65] text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300"
      {...props}
    />
  ),
  li: (props) => <li className="leading-[1.65]" {...props} />,
  strong: (props) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
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
      className="my-10 border-0 border-t border-zinc-200/50 dark:border-zinc-800/55"
      {...props}
    />
  ),
};
