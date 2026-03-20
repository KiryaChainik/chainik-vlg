import { describe, expect, it } from "vitest";

import { formatShortRuDate } from "./format-date";

describe("formatShortRuDate", () => {
  it("formats ISO date with short Russian month", () => {
    const s = formatShortRuDate("2025-03-19");
    expect(s).toMatch(/2025/);
    expect(s).toMatch(/19/);
    expect(s.toLowerCase()).toMatch(/мар/);
  });
});
