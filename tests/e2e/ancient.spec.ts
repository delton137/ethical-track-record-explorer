import { test, expect } from "@playwright/test";
import type { ResearchData } from "../../lib/types";
import {
  buildTimelineAxis,
  axisX,
  positionCoordinates,
} from "../../lib/geometry";
import {
  calculateScore,
  defaultScenarios,
  exportSnapshot,
} from "../../lib/scoring";
import { DEFAULT_FILTERS } from "../../lib/state";
import { formatYears, formatYear, DEFAULT_PERIOD } from "../../lib/dates";
import { readFile } from "node:fs/promises";

const added = new Set([
  "aristotle",
  "aquinas",
  "musonius",
  "nagarjuna",
  "umasvati",
  "ibn-rushd",
  "sidgwick",
  "james-mill",
  "seneca",
  "epictetus",
]);

test("BCE controls, explicit legacy links, reset and axis-break focus preserve chronology", async ({
  page,
}) => {
  // Focus scrolls the SVG into view; avoid smooth-scroll motion while testing
  // the subsequent pointer target and keyboard disclosure.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?position=none");
  await expect(page.locator(".ancient-section")).toContainText(
    "Before 1500 · compressed scale",
  );
  const gap = page.locator(".axis-break").first();
  await gap.focus();
  await expect(page.getByRole("tooltip")).toContainText("Compressed gap:");
  // Hover the hit area's edge so the decorative slash cannot intercept it.
  await gap.locator("rect").first().hover({ position: { x: 1, y: 12 } });
  await expect(page.getByRole("tooltip")).toContainText(
    "scores use actual dates",
  );
  await page.getByRole("button", { name: /^Filters/ }).click();
  const from = page.getByRole("textbox", { name: "From", exact: true });
  const to = page.getByRole("textbox", { name: "To", exact: true });
  await expect(from).toHaveValue(formatYear(DEFAULT_PERIOD.start));
  await from.fill("400 BCE");
  await to.fill("300 BCE");
  await page.getByRole("button", { name: "Apply period" }).click();
  await expect(page.locator("[data-position]")).toHaveCount(2);
  await expect(page).toHaveURL(/to=-299/);
  await page.reload();
  await page.getByRole("button", { name: /^Filters/ }).click();
  await expect(to).toHaveValue("300 BCE");
  await from.fill("0");
  await page.getByRole("button", { name: "Apply period" }).click();
  await expect(page.locator(".field-error")).toContainText(
    "no displayed year zero",
  );
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(from).toHaveValue(formatYear(DEFAULT_PERIOD.start));
  await expect(to).toHaveValue("2100");
  await page.goto("/?from=1500&to=2100&position=none");
  await expect(page.locator(".ancient-section")).toHaveCount(0);
  await expect(page.locator('[data-position="aristotle-slavery"]')).toHaveCount(
    0,
  );
});

test("new dossiers retain quotations through deep links, table and public-only mode", async ({
  page,
  request,
}) => {
  const data: ResearchData = await (await request.get("/api/research")).json();
  const positions = data.positions.filter((p) => added.has(p.figureId));
  expect(positions).toHaveLength(18);
  for (const p of positions) {
    await page.goto(`/?position=${p.id}&view=table&public=1`);
    const panel = page.locator(".evidence-panel");
    await expect(panel.locator(".position-title")).toHaveText(p.title);
    await expect(panel.locator("blockquote")).toHaveText(
      p.quotationIds.map(
        (id) => data.quotations.find((q) => q.id === id)!.text,
      ),
    );
    const row = page
      .locator(".evidence-table tr")
      .filter({ has: page.getByRole("button").filter({ hasText: p.title }) });
    await expect(row).toContainText(formatYears(p.publication));
    if (!p.milestoneId) await expect(panel).toContainText("Unscored position");
    await panel.getByText("Date conventions & compressed axis").click();
    await expect(panel.locator(".date-conventions")).toContainText(
      "Astronomical integer years",
    );
    await expect(panel.locator(".date-conventions")).toContainText(
      "Compressed gap:",
    );
    if (p.id === "musonius-women") {
      await expect(panel).toContainText("Attributed teaching period");
      await expect(panel).toContainText("401–500 CE");
      await expect(panel).toContainText("Reported teaching");
    }
    if (p.id === "epictetus-slavery") {
      await expect(panel).toContainText("Reported teaching");
      await expect(panel).toContainText("101–200 CE");
      await expect(panel).toContainText("Arrian");
    }
  }
});

test("new plotted dots, uncertainty, chronological keyboard order and exports share stable coordinates", async ({
  page,
  request,
}) => {
  const data: ResearchData & { axis: ReturnType<typeof buildTimelineAxis> } =
    await (await request.get("/api/research")).json();
  expect(data.axis).toEqual(buildTimelineAxis(data));
  const newPlotted = data.positions.filter(
    (p) => added.has(p.figureId) && p.milestoneId,
  );
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/?position=none");
    await expect(
      page.locator('[data-position="aristotle-slavery"]'),
    ).toBeAttached();
    await expect
      .poll(async () => {
        const width = await page
          .locator("svg.timeline")
          .evaluate((el) => (el as SVGSVGElement).viewBox.baseVal.width);
        const axis = buildTimelineAxis(data, DEFAULT_FILTERS.period, width);
        const errors: string[] = [];
        for (const p of newPlotted) {
          const s = calculateScore(
            p,
            data.milestones.find((m) => m.id === p.milestoneId),
            defaultScenarios(data),
          )!;
          const expected = positionCoordinates(
            s,
            DEFAULT_FILTERS.period,
            width,
            1,
            axis,
          );
          const dot = page.locator(`[data-position="${p.id}"]`);
          const actual = (await dot.getAttribute("transform"))!.match(
            /translate\(([^,]+),([^\)]+)\)/,
          )!;
          if (
            Math.abs(Number(actual[1]) - expected.x) > 0.001 ||
            Math.abs(Number(actual[2]) - expected.y) > 0.001
          )
            errors.push(p.id);
          if (s.writing.start !== s.writing.end) {
            const line = dot.locator(".writing-uncertainty");
            if (
              Math.abs(
                Number(await line.getAttribute("x1")) +
                  expected.x -
                  axisX(axis, s.writing.start),
              ) > 0.001
            )
              errors.push(`${p.id} interval`);
          }
        }
        return errors;
      })
      .toEqual([]);
    const first = page.locator('[data-position="aristotle-slavery"]');
    const before = await first.getAttribute("transform");
    await page
      .getByRole("textbox", { name: "Search people and positions" })
      .fill("Aristotle");
    await expect(
      page.locator('[data-position="aristotle-women"]'),
    ).toBeAttached();
    await expect(first).toHaveAttribute("transform", before!);
    await first.focus();
    await first.press("ArrowRight");
    await expect(
      page.locator('[data-position="aristotle-women"]'),
    ).toBeFocused();
    await page.getByRole("button", { name: "Clear search" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?position=none");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export view" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile((await download.path())!, "utf8"));
  const expected = exportSnapshot(
    data,
    DEFAULT_FILTERS,
    defaultScenarios(data),
  );
  expect(exported.axis).toEqual(expected.axis);
  expect(exported.calculations).toEqual(expected.calculations);
  expect(exported.dateConvention).toContain("0 = 1 BCE");
});
