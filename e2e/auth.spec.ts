import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/app");
    // Should redirect to /login due to middleware
    await expect(page).toHaveURL(/\/login/);
  });

  test("displays login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Kae Thesis Radar")).toBeVisible();
    await expect(page.locator("text=Email address")).toBeVisible();
    await expect(page.locator("text=Continue with Email")).toBeVisible();
  });

  test("protected pages require authentication", async ({ page }) => {
    const protectedRoutes = [
      "/app",
      "/app/dealflow",
      "/app/companies",
      "/app/thesis",
      "/app/methodology",
      "/app/settings",
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("API routes require authentication", async ({ page }) => {
    const response = await page.request.get("/api/companies");
    expect(response.status()).toBe(401);
  });

  test("health endpoints are public", async ({ page }) => {
    const response = await page.request.get("/api/health");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("status");
  });
});

test.describe("Protected Routes", () => {
  test.skip("dashboard shows seeded companies", async ({ page }) => {
    // Requires auth setup - skipped until auth flow tested
    await page.goto("/app/dealflow");
    await expect(page.locator("text=Qure.ai")).toBeVisible();
  });

  test.skip("company detail page loads", async ({ page }) => {
    // Requires auth and specific company ID
    await page.goto("/app/companies/20000000-0000-0000-0000-000000000001");
    await expect(page.locator("text=Back to Companies")).toBeVisible();
  });
});
