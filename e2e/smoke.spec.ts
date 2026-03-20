import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home shows main heading (Russian locale path)", async ({ page }) => {
    await page.goto("/ru");
    await expect(
      page.getByRole("heading", { level: 1, name: /Киря Чайник/i }),
    ).toBeVisible();
  });

  test("news index", async ({ page }) => {
    await page.goto("/ru/news");
    await expect(
      page.getByRole("heading", { level: 1, name: "Новости" }),
    ).toBeVisible();
  });

  test("reviews index", async ({ page }) => {
    await page.goto("/ru/reviews");
    await expect(
      page.getByRole("heading", { level: 1, name: "Обзоры" }),
    ).toBeVisible();
  });

  test("videos index", async ({ page }) => {
    await page.goto("/ru/videos");
    await expect(
      page.getByRole("heading", { level: 1, name: "Видео" }),
    ).toBeVisible();
  });

  test("English home shows translated nav", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "News" })).toBeVisible();
  });
});
