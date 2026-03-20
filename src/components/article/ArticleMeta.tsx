type ArticleMetaProps = {
  date: string;
  extra?: string;
};

export function ArticleMeta({ date, extra }: ArticleMetaProps) {
  const formatted = new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      {formatted}
      {extra ? ` · ${extra}` : null}
    </p>
  );
}
