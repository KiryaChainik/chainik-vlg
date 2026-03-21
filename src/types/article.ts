export type ArticleKind = "news" | "reviews";

export type VideoProvider = "vk";

export type ArticleVideo = {
  provider: VideoProvider;
  embedUrl: string;
  title: string;
  primary: boolean;
  /** Вертикальное VK: контейнер 9:16, высота не больше ~70vh (иначе 16:9). */
  orientation?: "portrait" | "landscape";
};

export type ArticleFrontmatter = {
  title: string;
  description: string;
  date: string;
  cover?: string;
  category: string;
  tags: string[];
  published: boolean;
  author: string;
  videos?: ArticleVideo[];
};

export type Article = {
  slug: string;
  kind: ArticleKind;
  frontmatter: ArticleFrontmatter;
};

export type ArticleWithBody = Article & {
  body: string;
};
