import { expect, test } from "@playwright/test";

test("Dealflow is usable without page overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/dealflow");
  await expect(page.getByLabel("Search companies")).toBeVisible();

  const metrics = await page.evaluate(() => {
    const search = document.querySelector<HTMLInputElement>('[aria-label="Search companies"]');
    const stage = document.querySelector<HTMLSelectElement>('[aria-label="Filter by status"]');
    const sort = document.querySelector<HTMLSelectElement>('[aria-label="Sort companies"]');
    const list = document.querySelector<HTMLElement>('[data-testid="mobile-company-list"]');
    const cards = document.querySelectorAll('[data-testid="mobile-company-card"]');
    const rect = (element: Element | null) => element?.getBoundingClientRect();
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      searchWidth: rect(search)?.width ?? 0,
      stageWidth: rect(stage)?.width ?? 0,
      sortWidth: rect(sort)?.width ?? 0,
      listWidth: rect(list)?.width ?? 0,
      cardCount: cards.length,
    };
  });

  expect(metrics.scrollWidth).toBe(metrics.clientWidth);
  expect(metrics.searchWidth).toBeGreaterThan(250);
  expect(metrics.stageWidth).toBeGreaterThan(120);
  expect(metrics.sortWidth).toBeGreaterThan(120);
  expect(metrics.listWidth).toBeGreaterThan(340);
  expect(metrics.cardCount).toBe(10);
  await expect(page.getByRole("link", { name: "View company" }).first()).toBeVisible();
});
