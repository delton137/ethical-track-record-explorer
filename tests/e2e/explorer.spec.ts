import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import type { ResearchData } from "../../lib/types";
import AxeBuilder from "@axe-core/playwright";

test("every plotted position opens its own primary quotation, including overlaps", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const data: ResearchData = await (await request.get("/api/research")).json();
  await page.goto("/");
  const dots = page.locator("[data-position]");
  await expect(dots).toHaveCount(
    data.positions.filter((p) => p.milestoneId && p.stance !== "ambiguous")
      .length,
  );
  const ids = await dots.evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute("data-position")!),
  );
  for (const id of ids) {
    const p = data.positions.find((p) => p.id === id)!;
    const figure = data.figures.find((f) => f.id === p.figureId)!;
    const dot = page.locator(`[data-position="${id}"]`);
    await dot.focus();
    await dot.press("Enter");
    const picker = page.getByRole("dialog", {
      name: "Choose an overlapping position",
    });
    if (await picker.isVisible())
      await picker
        .getByRole("button")
        .filter({ hasText: figure.name })
        .filter({ hasText: p.title })
        .click();
    const panel = page.getByRole("complementary", {
      name: "Primary-source evidence",
    });
    await expect(
      panel.getByRole("heading", { name: figure.name, exact: true }),
    ).toBeVisible();
    await expect(panel.locator(".position-title")).toHaveText(p.title);
    await expect(panel.locator("blockquote")).toHaveText(
      p.quotationIds.map(
        (id) => data.quotations.find((q) => q.id === id)!.text,
      ),
    );
    await expect(page).toHaveURL(new RegExp(`position=${id}`));
  }
  expect(errors).toEqual([]);
});

test("search, public/private filtering, deep links, evidence table and focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Search people and positions" })
    .fill("Bentham");
  await expect(page.locator("[data-position]")).toHaveCount(2);
  await page.locator('[data-position="bentham-gay"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[data-position="bentham-animals"]')).toBeFocused();
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.getByLabel("Public writings only").check();
  await expect(page.locator("[data-position]")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Search people and positions" }),
  ).toHaveValue("Bentham");
  await expect(page.locator("[data-position]")).toHaveCount(1);
  await page.getByRole("button", { name: "Show evidence table" }).click();
  const entry = page.locator(".evidence-table tbody button").first();
  await entry.click();
  await expect(page.locator(".evidence-panel blockquote")).toContainText(
    "Can they suffer?",
  );
  await page.getByRole("button", { name: "Close evidence panel" }).click();
  await expect(entry).toBeFocused();
  await page.reload();
  await expect(page.locator(".evidence-panel")).toHaveCount(0);
  await expect(page.locator(".evidence-table tbody tr")).toHaveCount(1);
});

test("future edits and reset preserve historical ranks; export is reproducible", async ({
  page,
}) => {
  await page.goto("/?position=none");
  const defaults = {
    "Taking extinction risks seriously": ["2000", "2030"],
    "Wild-animal welfare": ["2020", "2075"],
    "AI welfare": ["2030", "2100"],
  };
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.locator(".scenario-settings > summary").click();
  for (const [name, [start, end]] of Object.entries(defaults)) {
    await expect(page.getByLabel(`${name} start year`)).toHaveValue(start);
    await expect(page.getByLabel(`${name} end year`)).toHaveValue(end);
  }
  await page.locator(".leaderboard>summary").click();
  const rankText = await page.locator(".ranking-table").innerText();
  await page.getByLabel("AI welfare start year").fill("2200");
  await page.getByLabel("AI welfare end year").fill("2250");
  await page.getByRole("button", { name: "Apply scenarios" }).click();
  await expect(page).toHaveURL(/ai-welfare-from=2200&ai-welfare-to=2250/);
  expect(await page.locator(".ranking-table").innerText()).toBe(rankText);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export evidence" }).click();
  const downloaded = JSON.parse(
    await readFile((await (await downloadPromise).path())!, "utf8"),
  );
  expect(downloaded.scenarios["ai-welfare"]).toEqual({
    start: 2200,
    end: 2250,
  });
  expect(downloaded.geometry.arcStartYear).toBe(1500);
  expect(
    downloaded.calculations.find(
      (p: { positionId: string }) => p.positionId === "bentham-animals",
    ).placement,
  ).toHaveProperty("xFraction");
  expect(
    downloaded.historicalLeaderboard.filter(
      (r: { eligible: boolean }) => r.eligible,
    ).length,
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Reset specified windows" }).click();
  for (const [name, [start, end]] of Object.entries(defaults)) {
    await expect(page.getByLabel(`${name} start year`)).toHaveValue(start);
    await expect(page.getByLabel(`${name} end year`)).toHaveValue(end);
  }
  expect(await page.locator(".ranking-table").innerText()).toBe(rankText);
});

test("table retains unmatched evidence; benchmark dialog is keyboard operable", async ({
  page,
}) => {
  await page.goto("/?position=none&view=table&q=Wang%20Yangming");
  await expect(page.locator(".evidence-table tbody tr")).toHaveCount(1);
  await expect(page.locator(".evidence-table")).toContainText("Unscored");
  await page.locator(".evidence-table tbody button").click();
  await expect(page.locator(".comparison-block")).toContainText(
    "Unscored position",
  );
  await page.getByRole("button", { name: "Close evidence panel" }).click();
  await page.getByRole("button", { name: "Show timeline" }).click();
  await page.locator(".scenario-anchor").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("dialog[open]")).toContainText("2000–2030");
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(page.locator(".scenario-anchor").first()).toBeFocused();
});

test("mouse selection and author styling remain stable across filters", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator('[data-position="kant-women"] circle')
    .last()
    .scrollIntoViewIfNeeded();
  const target = await page
    .locator('[data-position="kant-women"] circle')
    .last()
    .boundingBox();
  // A physical click may land on another mark at the same coordinates; the picker resolves it.
  await page.mouse.click(
    target!.x + target!.width / 2,
    target!.y + target!.height / 2,
  );
  const picker = page.getByRole("dialog", {
    name: "Choose an overlapping position",
  });
  if (await picker.isVisible()) {
    await picker
      .getByRole("button")
      .filter({ hasText: "Immanuel Kant" })
      .filter({ hasText: "Women excluded" })
      .click();
  }
  await expect(page.locator(".evidence-panel h2")).toHaveText("Immanuel Kant");
  const color = await page
    .locator('[data-position="kant-women"] circle')
    .last()
    .getAttribute("stroke");
  const line = page.locator('polyline[data-figure="kant"]');
  await expect(line).toHaveAttribute("stroke-width", "3");
  await page
    .getByRole("textbox", { name: "Search people and positions" })
    .fill("Kant");
  await expect(
    page.locator('[data-position="kant-women"] circle').last(),
  ).toHaveAttribute("stroke", color!);
  await expect(line).toHaveAttribute("stroke-width", "3");
});

test("alternative benchmarks are identified in the evidence panel", async ({
  page,
}) => {
  await page.goto("/?position=marx-slavery&benchmark=alternative");
  await expect(page.locator(".comparison-block")).toContainText(
    "United States: Thirteenth Amendment",
  );
  await expect(page.locator(".comparison-block")).toContainText("1865");
  await expect(page.locator(".comparison-block .score-pill")).toContainText(
    "1",
  );
});

test("mobile offers bottom-sheet and full-screen reading without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("[data-position]")).not.toHaveCount(0);
  await expect(page.locator(".evidence-panel")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Show evidence table" }).click();
  await page.locator(".evidence-table tbody button").first().click();
  const panel = page.locator(".evidence-panel");
  await expect(panel).toBeVisible();
  const sheet = await panel.boundingBox();
  expect(sheet!.height).toBeLessThan(844 * 0.6);
  await page.getByRole("button", { name: "Read full screen" }).click();
  await expect(panel).toHaveClass(/reading-fullscreen/);
  expect((await panel.boundingBox())!.height).toBeGreaterThan(800);
  await expect(panel.locator("blockquote")).toBeVisible();
  await page.getByRole("button", { name: "Exit full-screen reading" }).click();
  await page.getByRole("button", { name: "Close evidence panel" }).click();
  await expect(panel).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("principal views and a qualified religious dossier pass automated accessibility checks", async ({
  page,
}) => {
  const check = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  };
  await page.goto("/");
  await expect(page.locator("[data-position]")).not.toHaveCount(0);
  await check();
  await page.getByRole("button", { name: /^Filters/ }).click();
  await check();
  await page.goto("/?position=dalai-autonomy&view=table");
  await check();
  await page.getByRole("button", { name: "Close evidence panel" }).click();
  await page.locator(".leaderboard>summary").click();
  await check();
  await page
    .getByRole("button", { name: "Research index", exact: true })
    .click();
  await check();
  await page.getByRole("button", { name: "Methodology", exact: true }).click();
  await check();
});

test("bulk tradition selection persists and progress intervals explain their endpoints", async ({
  page,
}) => {
  await page.goto("/");
  const legend = page.getByLabel("Tradition color legend");
  const count = await page.locator("[data-position]").count();
  await legend.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator("[data-position]")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("[data-position]")).toHaveCount(0);
  await page.getByRole("button", { name: /^Filters/ }).click();
  const drawer = page.getByRole("region", { name: "Detailed filters" });
  await expect(drawer.locator(".check-grid input:checked")).toHaveCount(0);
  await drawer.getByRole("button", { name: "Select all", exact: true }).click();
  await expect(page.locator("[data-position]")).toHaveCount(count);
  await expect(drawer.locator(".check-grid input:checked")).toHaveCount(13);
  await drawer.locator(".check-grid input").first().uncheck();
  await expect(drawer.locator(".check-grid input:checked")).toHaveCount(12);
  await expect(
    page.getByText("Reading the chart", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByText("Historical progress intervals", { exact: false })
    .click();
  await page
    .locator(".benchmark-list button")
    .filter({ hasText: "Recognition of colonial self-determination" })
    .click();
  await expect(page.locator("dialog[open]")).toContainText("1945–1960");
  await expect(page.locator("dialog[open]")).toContainText("UN Charter");
  await page.keyboard.press("Escape");
  await page
    .locator(".benchmark-list button")
    .filter({ hasText: "Decriminalization of same-sex relations" })
    .click();
  await expect(page.locator("dialog[open]")).toContainText("1967–2003");
  await expect(page.locator("dialog[open]")).toContainText("Lawrence v. Texas");
});

test("progress dates expand below titles on hover and keyboard focus", async ({
  page,
}) => {
  await page.goto("/?position=none");
  const religion = page.locator(".milestone-anchor").filter({
    has: page.locator(".milestone-label", { hasText: "Religious liberty" }),
  });
  await expect(page.locator(".progress-date-popup")).toHaveCount(0);
  await expect(religion.locator(".reform-date-label")).toHaveCount(0);
  await religion.locator(".milestone-label").hover();
  const popup = page.getByRole("tooltip");
  await expect(popup).toContainText("1689–1919");
  await expect(popup).toContainText("1919 — Germany");
  const titleBox = await religion.locator(".milestone-label").boundingBox();
  const popupBox = await popup.boundingBox();
  expect(popupBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height);
  await page.mouse.move(popupBox!.x + popupBox!.width / 2, popupBox!.y + 30);
  await expect(popup).toBeVisible();
  await page.mouse.move(5, 5);
  await expect(popup).toHaveCount(0);
  await religion.focus();
  await expect(popup).toContainText("1786 — Virginia");
  await page.keyboard.press("Tab");
  await expect(popup).not.toContainText("1786 — Virginia");
});
