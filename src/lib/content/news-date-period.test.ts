import { describe, expect, it } from "vitest";

import type { Article } from "@/types/article";

import { articlePublishedStartOfDayMs, filterNewsByDatePeriod } from "./news-date-period";

function article(isoDate: string, slug: string): Article {
  return {
    slug,
    kind: "news",
    frontmatter: {
      title: "t",
      description: "d",
      date: isoDate,
      category: "c",
      tags: [],
      published: true,
      author: "a",
    },
  };
}

describe("articlePublishedStartOfDayMs", () => {
  it("parses YYYY-MM-DD as local midnight", () => {
    const t = articlePublishedStartOfDayMs("2025-02-05");
    const d = new Date(t);
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(5);
    expect(d.getHours()).toBe(0);
  });
});

describe("filterNewsByDatePeriod", () => {
  const t0 = new Date("2025-06-15T12:00:00.000Z").getTime();
  const items = [
    article("2025-06-15", "a"),
    article("2025-06-08", "b"),
    article("2025-05-01", "c"),
  ];

  it("week keeps items within last 7 local days from start of today", () => {
    const out = filterNewsByDatePeriod(items, "week", t0);
    expect(out.map((x) => x.slug).sort()).toEqual(["a", "b"]);
  });

  it("year starts at Jan 1 of previous calendar year", () => {
    const tMarch2026 = new Date("2026-03-20T12:00:00.000Z").getTime();
    const mixed = [
      article("2025-01-27", "jan"),
      article("2025-04-01", "apr"),
      article("2024-12-01", "dec24"),
      article("2023-12-31", "old"),
    ];
    const out = filterNewsByDatePeriod(mixed, "year", tMarch2026);
    // cutoff 2025-01-01 00:00 local
    expect(out.map((x) => x.slug).sort()).toEqual(["apr", "jan"]);
  });
});
