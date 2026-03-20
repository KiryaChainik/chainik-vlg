import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges tailwind classes with last conflicting utility winning", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("filters falsy fragments", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });
});
