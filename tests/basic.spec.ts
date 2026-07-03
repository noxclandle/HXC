import { test, expect } from "@playwright/test";

test.describe("Basic Accessibility", () => {
  test("landing page should load successfully", async ({ page }) => {
    await page.goto("/");
    // ページタイトルに "Hexa Card" が含まれているか確認
    await expect(page).toHaveTitle(/Hexa Card/);
  });

  test("login page should load successfully", async ({ page }) => {
    await page.goto("/login");
    // ログインフォームの主要な文言が表示されているか確認
    await expect(page.getByText(/Log In/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });

  test("about page should load successfully", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/Resonance/i).first()).toBeVisible();
  });
});
