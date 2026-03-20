import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<unknown>) => fn,
}));

import type { ArticleVideo } from "@/types/article";

import { parseVkVideoExtParams, pickPrimaryVkEmbed } from "./vk-video-thumbnail";

const embedOk =
  "https://vkvideo.ru/video_ext.php?oid=-169538098&id=456240162&hash=x&hd=4";

function vk(partial: Partial<ArticleVideo> & Pick<ArticleVideo, "embedUrl">) {
  return {
    provider: "vk" as const,
    title: "",
    primary: false,
    ...partial,
  };
}

describe("parseVkVideoExtParams", () => {
  it("parses oid and id from vkvideo embed URL", () => {
    expect(parseVkVideoExtParams(embedOk)).toEqual({
      oid: "-169538098",
      id: "456240162",
    });
  });

  it("returns null for non-VK embed URLs", () => {
    expect(parseVkVideoExtParams("https://youtube.com/watch?v=1")).toBeNull();
  });

  it("returns null when id is missing", () => {
    expect(
      parseVkVideoExtParams(
        "https://vkvideo.ru/video_ext.php?oid=-1",
      ),
    ).toBeNull();
  });
});

describe("pickPrimaryVkEmbed", () => {
  it("prefers primary video", () => {
    const a = vk({ embedUrl: embedOk, primary: false });
    const b = vk({
      embedUrl:
        "https://vkvideo.ru/video_ext.php?oid=-1&id=2&hash=x",
      primary: true,
    });
    expect(pickPrimaryVkEmbed([a, b])).toBe(b);
  });

  it("falls back to first entry", () => {
    const a = vk({ embedUrl: embedOk });
    expect(pickPrimaryVkEmbed([a])).toBe(a);
  });

  it("returns null for empty or undefined", () => {
    expect(pickPrimaryVkEmbed(undefined)).toBeNull();
    expect(pickPrimaryVkEmbed([])).toBeNull();
  });
});
