import { NextResponse } from "next/server";

import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  getNewsListWindow,
  parseNewsDatePeriod,
} from "@/lib/content/articles";

const MAX_LIMIT = 50;

function parseOffset(raw: string | null): number {
  const n = parseInt(raw ?? "0", 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseLimit(raw: string | null): number {
  const n = parseInt(raw ?? String(ARTICLE_FEED_PAGE_SIZE), 10);
  if (!Number.isFinite(n) || n < 1) return ARTICLE_FEED_PAGE_SIZE;
  return Math.min(MAX_LIMIT, n);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseOffset(searchParams.get("offset"));
  const limit = parseLimit(searchParams.get("limit"));
  const period = parseNewsDatePeriod(searchParams.get("period"));
  const { items, total } = getNewsListWindow(offset, limit, period);
  return NextResponse.json({ items, total });
}
