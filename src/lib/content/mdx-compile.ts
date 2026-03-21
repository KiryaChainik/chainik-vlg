import { compileMDX } from "next-mdx-remote/rsc";
import { cache } from "react";

import { mdxComponents } from "./mdx-components";

/**
 * Дедупликация компиляции MDX в рамках одного запроса (RSC + cache()).
 */
export const compileArticleMdx = cache(async (source: string) =>
  compileMDX({
    source,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  }),
);
