import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home shows main heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Киря Чайник/i }),
    ).toBeVisible();
  });

  test("news index", async ({ page }) => {
    await page.goto("/news");
    await expect(
      page.getByRole("heading", { level: 1, name: "Новости" }),
    ).toBeVisible();
  });

  test("reviews index", async ({ page }) => {
    await page.goto("/reviews");
    await expect(
      page.getByRole("heading", { level: 1, name: "Обзоры" }),
    ).toBeVisible();
  });

  test("videos index", async ({ page }) => {
    await page.goto("/videos");
    await expect(
      page.getByRole("heading", { level: 1, name: "Видео" }),
    ).toBeVisible();
  });
});
