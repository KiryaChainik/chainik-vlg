import type { ArticleVideo } from "./article";

export type VideoPageFrontmatter = {
  title: string;
  description: string;
  date: string;
  duration: string;
  /** Превью для сетки /videos и og:image; на странице ролика не показывается. */
  cover?: string;
  published: boolean;
  author: string;
  watchUrl?: string;
  videos?: ArticleVideo[];
  tags: string[];
};

export type VideoPageWithBody = {
  slug: string;
  frontmatter: VideoPageFrontmatter;
  body: string;
};
