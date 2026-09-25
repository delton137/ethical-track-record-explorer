import { test, expect } from "@playwright/test";

test("showing postdictions changes chart points but never Comparisons", async ({
  page,
}) => {
  await page.goto("/?position=none");
  const checkbox = page.getByRole("checkbox", { name: "Show postdictions" });
  await expect(checkbox).not.toBeChecked();
  // Wait for hydration and the responsive chart before recording the baseline.
  await page
    .getByRole("textbox", { name: "Search people and positions" })
    .fill("Bentham");
  await page
    .getByRole("textbox", { name: "Search people and positions" })
    .fill("");
  const rows = page.locator(".ranking-table tbody tr");
  const before = await rows.allTextContents();
  const points = await page.locator("[data-position]").count();
  await checkbox.check();
  await page.waitForURL(/postdictions=1/);
  await expect
    .poll(() => page.locator("[data-position]").count())
    .toBeGreaterThan(points);
  expect(await rows.allTextContents()).toEqual(before);
  await checkbox.uncheck();
  await expect(page.locator("[data-position]")).toHaveCount(points);
  expect(await rows.allTextContents()).toEqual(before);
});

test("ethical foresight is the only scoring rule, including old saved views", async ({
  page,
}) => {
  await page.goto("/?position=none&scoring=default");
  await expect(
    page.getByRole("columnheader", { name: "Mean foresight score" }),
  ).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Ethical foresight scoring" }),
  ).toHaveCount(0);
  const rows = page.locator(".ranking-table tbody tr");
  const before = await rows.allTextContents();
  await page.reload();
  await expect(
    page.getByRole("columnheader", { name: "Mean foresight score" }),
  ).toBeVisible();
  expect(await rows.allTextContents()).toEqual(before);
});
