import { expect, test } from "@playwright/test";

const navLinks = [
  ["Overview", /Opportunity Radar — Kae Healthtech Edition/, /\/app$/],
  ["Research intelligence", /From papers to perspective/, /\/app\/intelligence/],
  ["Dealflow", /Healthtech dealflow/, /\/app\/dealflow/],
  ["Companies", /^Companies$/, /\/app\/companies$/],
  ["Thesis map", /20 healthtech opportunity areas/, /\/app\/thesis/],
  ["Research runs", /Tata 1mg research run/, /\/app\/research/],
  ["Sources", /^Sources$/, /\/app\/sources/],
  ["Methodology", /Methodology and limitations/, /\/app\/methodology/],
] as const;

async function visibleCompanies(page: import("@playwright/test").Page) {
  return page.locator(".desktop-dealflow tbody tr").filter({
    has: page.locator(".company-cell"),
  });
}

test.describe("navigation clicks", () => {
  for (const [name, heading, url] of navLinks) {
    test(`sidebar ${name} navigates by click`, async ({ page }) => {
      await page.goto("/app");
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("settings link navigates by click", async ({ page }) => {
    await page.goto("/app");
    await page.getByRole("link", { name: /Settings/ }).click();
    await expect(page).toHaveURL(/\/app\/settings/);
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("company table link opens correct company", async ({ page }) => {
    await page.goto("/app/dealflow");
    await page.getByRole("link", { name: /Tata 1mg/ }).click();
    await expect(page).toHaveURL(/\/app\/companies\/tata-1mg/);
    await expect(page.getByRole("heading", { name: "Tata 1mg" })).toBeVisible();
  });

  test("mobile View company opens correct company", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/app/dealflow");
    await page.getByTestId("mobile-company-card").filter({ hasText: "Dozee" }).getByRole("link", { name: /View company/ }).click();
    await expect(page).toHaveURL(/\/app\/companies\/dozee/);
    await expect(page.getByRole("heading", { name: "Dozee" })).toBeVisible();
  });
});

test.describe("dealflow controls", () => {
  test("search for Dozee leaves only Dozee and persists in URL", async ({ page }) => {
    await page.goto("/app/dealflow");
    await page.getByLabel("Search companies").fill("  Dozee");
    await expect(page).toHaveURL(/q=Dozee/);
    await expect(await visibleCompanies(page)).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Dozee/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /CureSkin/ })).toHaveCount(0);
    await page.reload();
    await expect(await visibleCompanies(page)).toHaveCount(1);
  });

  test("search by opportunity works", async ({ page }) => {
    await page.goto("/app/dealflow");
    await page.getByLabel("Search companies").fill("remote patient monitoring");
    await expect(await visibleCompanies(page)).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Dozee/ })).toBeVisible();
  });

  test("status filter, sort, combined filter, and clear filters work", async ({ page }) => {
    await page.goto("/app/dealflow");
    await expect(await visibleCompanies(page)).toHaveCount(10);
    await page.getByLabel("Filter by status").selectOption("screened");
    await expect(page).toHaveURL(/status=screened/);
    await expect(await visibleCompanies(page)).toHaveCount(4);
    await expect(page.getByRole("link", { name: /CureSkin/ })).toHaveCount(0);

    await page.getByLabel("Sort companies").selectOption("score-desc");
    await expect(page).toHaveURL(/sort=score-desc/);
    await expect(page.locator(".desktop-dealflow tbody .company-cell").first()).toContainText("NIRAMAI");

    await page.getByLabel("Search companies").fill("Dozee");
    await expect(await visibleCompanies(page)).toHaveCount(1);
    await expect(page.locator(".desktop-dealflow tbody .company-cell").first()).toContainText("Dozee");

    await page.getByRole("button", { name: /Clear filters/ }).click();
    await expect(page).toHaveURL(/\/app\/dealflow$/);
    await expect(await visibleCompanies(page)).toHaveCount(10);
  });
});

test("CSV export downloads currently visible records", async ({ page }) => {
  await page.goto("/app/dealflow");
  await page.getByLabel("Search companies").fill("Dozee");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Export CSV/ }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("opportunity-radar-dealflow-2026-07-31.csv");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain("Company");
  expect(csv).toContain("Dozee");
  expect(csv).not.toContain("CureSkin");
  await expect(page.getByRole("status")).toContainText("CSV exported");
});

test("Columns menu hides and restores a desktop column", async ({ page }) => {
  await page.goto("/app/dealflow");
  await page.getByRole("button", { name: /Columns/ }).click();
  await expect(page.getByRole("menu", { name: "Column visibility" })).toBeVisible();
  await page.getByRole("menuitemcheckbox", { name: "Owner" }).click();
  await expect(page.locator(".desktop-dealflow th", { hasText: "Owner" })).toHaveCount(0);
  await page.getByRole("button", { name: /Restore defaults/ }).click();
  await expect(page.locator(".desktop-dealflow th", { hasText: "Owner" })).toHaveCount(1);
});

test("mobile sidebar opens, navigates, closes, and does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app");
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  await page.getByRole("button", { name: /Toggle navigation/ }).click();
  await expect(page.locator(".sidebar")).toHaveClass(/open/);
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Dealflow" }).click();
  await expect(page).toHaveURL(/\/app\/dealflow/);
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});

test("disabled research action makes no research API call", async ({ page }) => {
  const researchRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/research")) researchRequests.push(request.url());
  });
  await page.goto("/app/companies/tata-1mg");
  await expect(page.getByText("Live research unavailable in this demonstration. Seeded evidence screens remain available for review.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Run research/ })).toBeDisabled();
  await page.getByRole("button", { name: /Run research/ }).click({ force: true });
  await page.waitForTimeout(300);
  expect(researchRequests).toEqual([]);
});

test("global search supports keyboard navigation to company pages", async ({ page }) => {
  await page.goto("/app");
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  await page.getByLabel("Global search").fill("Dozee");
  await expect(page.getByRole("listbox", { name: "Global search results" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/app\/companies\/dozee/);
  await expect(page.getByRole("heading", { name: "Dozee" })).toBeVisible();
});

test("research intelligence switches evidence type and exposes quality diagnostics", async ({ page }) => {
  await page.goto("/app/intelligence");
  await expect(page.getByText("311,181")).toBeVisible();
  await page.getByRole("button", { name: "Keyphrases" }).click();
  await expect(page.locator(".intel-bar-label", { hasText: "rough heston" })).toBeVisible();
  await page.getByRole("tab", { name: "Signal evidence" }).click();
  await page.getByLabel("Filter research signals").fill("capital markets");
  await expect(page.getByRole("cell", { name: "capital markets kp:capital markets" })).toBeVisible();
  await page.getByRole("tab", { name: "Data quality" }).click();
  await expect(page.getByText("Missing abstracts")).toBeVisible();
  await expect(page.getByText("Semantic Scholar")).toBeVisible();
});

test("research intelligence does not overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/intelligence");
  await expect(page.getByRole("heading", { name: "From papers to perspective." })).toBeVisible();
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});
