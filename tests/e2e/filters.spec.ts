import { test, expect, type Page } from "@playwright/test";
import type { ResearchData, WrittenPosition } from "../../lib/types";
import { readFile } from "node:fs/promises";
import { DEFAULT_PERIOD } from "../../lib/dates";

test("Include contested is visible and usable with detailed filters closed at every layout", async ({
  page,
}) => {
  for (const width of [304, 390, 768, 1100, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/?traditions=existential&position=none");
    await expect(
      page.getByRole("textbox", { name: "Search people and positions" }),
    ).toBeEnabled();
    const toggle = page.getByRole("checkbox", {
      name: "Include contested",
      exact: true,
    });
    await expect(
      page.getByRole("region", { name: "Detailed filters" }),
    ).toHaveCount(0);
    await expect(toggle).toBeVisible();
    const bounds = await page.locator(".contested-toggle").boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await toggle.check();
    await expect(
      page.locator('[data-position="camus-execution"]'),
    ).toBeAttached();
    await toggle.uncheck();
    await expect(page.locator('[data-position="camus-execution"]')).toHaveCount(
      0,
    );
    await expect(
      page.locator('[data-position="nietzsche-slavery"]'),
    ).toBeAttached();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

// Postdictions are hidden by default, independently of the other filters.
function visiblePositions(
  data: ResearchData,
  positions: WrittenPosition[],
  url: string,
) {
  const params = new URL(url).searchParams;
  if (params.get("postdictions") === "1") return positions;
  return positions.filter((p) => {
    if (p.stance !== "supports") return true;
    const milestone = data.milestones.find((m) => m.id === p.milestoneId);
    if (!milestone) return true;
    const date = params.get("public") === "1" ? p.publication : p.composition;
    const benchmark =
      params.get("benchmark") === "alternative" &&
      milestone.kind === "historical"
        ? (milestone.alternatives?.[0]?.window ?? milestone.window)
        : milestone.window;
    return (date.start + date.end) / 2 <= benchmark.end;
  });
}

// Check actual rendered membership against the records, including passages
// that belong in the table but cannot be plotted against an equivalent reform.
async function expectPositions(
  page: Page,
  data: ResearchData,
  positions: WrittenPosition[],
) {
  const params = new URL(page.url()).searchParams;
  const publicOnly = params.get("public") === "1";
  const from = Number(params.get("from") ?? DEFAULT_PERIOD.start);
  const to = Number(params.get("to") ?? DEFAULT_PERIOD.end);
  positions = visiblePositions(data, positions, page.url());
  const plotted = positions
    .filter((p) => {
      const date = publicOnly ? p.publication : p.composition;
      const middle = (date.start + date.end) / 2;
      return (
        p.milestoneId &&
        p.stance !== "ambiguous" &&
        middle >= from &&
        middle <= to
      );
    })
    .map((p) => p.id)
    .sort();
  await expect
    .poll(() =>
      page
        .locator("[data-position]")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute("data-position")!).sort(),
        ),
    )
    .toEqual(plotted);
  await page.getByRole("button", { name: "Show evidence table" }).click();
  await expect(page.locator(".evidence-table tbody button small")).toHaveText(
    positions.map((p) => p.title),
  );
  await page.getByRole("button", { name: "Show timeline" }).click();
}

for (const contested of [false, true]) {
  test(`all tradition filters agree across controls, chart, table and shared links (contested: ${contested})`, async ({
    page,
    request,
  }) => {
    const data: ResearchData = await (
      await request.get("/api/research")
    ).json();
    await page.goto(
      `/?position=none${contested ? "&contested=1" : "&contested=0"}`,
    );
    await expect(
      page.getByRole("textbox", { name: "Search people and positions" }),
    ).toBeEnabled();
    const select = page.getByRole("combobox", {
      name: "Tradition",
      exact: true,
    });
    for (const tradition of data.traditions) {
      const members = new Set(
        data.figures
          .filter(
            (f) =>
              f.status === "included" &&
              f.affiliations.some(
                (a) =>
                  a.traditionId === tradition.id &&
                  (a.status === "core" || contested),
              ),
          )
          .map((f) => f.id),
      );
      const expected = data.positions.filter((p) => members.has(p.figureId));
      await select.selectOption(tradition.id);
      const badge = page
        .getByLabel("Tradition color legend")
        .getByRole("button", {
          name: new RegExp(`^${tradition.shortName}`),
        });
      await expect(badge).toHaveAttribute("aria-pressed", "true");
      await expect(badge.locator("small")).toHaveText(
        String(
          new Set(
            visiblePositions(data, expected, page.url()).map((p) => p.figureId),
          ).size,
        ),
      );
      await expectPositions(page, data, expected);
      await page.reload();
      await expect(select).toHaveValue(tradition.id);
      await page.getByRole("button", { name: /^Filters/ }).click();
      await expect(
        page.getByLabel("Include contested", { exact: true }),
      ).toBeChecked({ checked: contested });
      const drawer = page.getByRole("region", { name: "Detailed filters" });
      await expect(
        drawer.getByRole("checkbox", {
          name: tradition.shortName,
          exact: true,
        }),
      ).toBeChecked();
      await expect(drawer.locator(".check-grid input:checked")).toHaveCount(1);
      await page.getByRole("button", { name: /^Filters/ }).click();
      // The active legend badge clears its selection; clicking again isolates it.
      await badge.click();
      await expect(select).toHaveValue("");
      await badge.click();
      await expectPositions(page, data, expected);
    }
  });
}

test("all 16 issue filters and search show exactly their matching passages", async ({
  page,
  request,
}) => {
  const data: ResearchData = await (await request.get("/api/research")).json();
  await page.goto("/?position=none");
  const search = page.getByRole("textbox", {
    name: "Search people and positions",
  });
  await expect(search).toBeEnabled();
  const issue = page.getByRole("combobox", { name: "Issue", exact: true });
  for (const domain of data.domains) {
    await issue.selectOption(domain.id);
    const expected = data.positions.filter((p) => p.domainId === domain.id);
    await expectPositions(page, data, expected);
    await page.reload();
    await expect(issue).toHaveValue(domain.id);
    await expectPositions(page, data, expected);
  }
  await issue.selectOption("");
  for (const query of [
    "Nietzsche",
    "  SENECA  ",
    "animal",
    "no-matching-thinker-123",
  ]) {
    await search.fill(query);
    const expected = data.positions.filter((p) => {
      const name = data.figures.find((f) => f.id === p.figureId)!.name;
      return `${name} ${p.title} ${p.summary}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase());
    });
    await expectPositions(page, data, expected);
    await page.reload();
    await expect(search).toHaveValue(query);
    await expectPositions(page, data, expected);
  }
  await page.getByRole("button", { name: "Clear search" }).click();
  await expectPositions(page, data, data.positions);
});

test("evidence, public-only and period filters intersect and survive reload", async ({
  page,
  request,
}) => {
  const data: ResearchData = await (await request.get("/api/research")).json();
  await page.goto("/?position=none");
  await expect(
    page.getByRole("textbox", { name: "Search people and positions" }),
  ).toBeEnabled();
  for (const evidence of ["all", "checked", "qualified"] as const) {
    for (const publicOnly of [false, true]) {
      await page.getByRole("button", { name: /^Filters/ }).click();
      await page
        .getByRole("combobox", { name: "Passage status" })
        .selectOption(evidence);
      await page
        .getByLabel("Public writings only", { exact: true })
        .setChecked(publicOnly);
      await expectPositions(
        page,
        data,
        data.positions.filter(
          (p) =>
            (evidence === "all" || p.evidence === evidence) &&
            (!publicOnly || p.visibility === "public"),
        ),
      );
      await page
        .getByRole("textbox", { name: "From", exact: true })
        .fill("1800 CE");
      await page
        .getByRole("textbox", { name: "To", exact: true })
        .fill("1900 CE");
      await page.getByRole("button", { name: "Apply period" }).click();
      const expected = data.positions.filter((p) => {
        const date = publicOnly ? p.publication : p.composition;
        return (
          (evidence === "all" || p.evidence === evidence) &&
          (!publicOnly || p.visibility === "public") &&
          date.end >= 1800 &&
          date.start <= 1900
        );
      });
      await expectPositions(page, data, expected);
      await page.reload();
      await page.getByRole("button", { name: /^Filters/ }).click();
      await expect(
        page.getByRole("combobox", { name: "Passage status" }),
      ).toHaveValue(evidence);
      await expect(
        page.getByLabel("Public writings only", { exact: true }),
      ).toBeChecked({ checked: publicOnly });
      await expect(
        page.getByRole("textbox", { name: "From", exact: true }),
      ).toHaveValue("1800");
      await expect(
        page.getByRole("textbox", { name: "To", exact: true }),
      ).toHaveValue("1900");
      await expectPositions(page, data, expected);
      await page
        .getByRole("button", { name: "Reset filters", exact: true })
        .click();
      await expectPositions(page, data, data.positions);
      await page.getByRole("button", { name: /^Filters/ }).click();
    }
  }
});

test("multiple traditions and issues combine correctly with search, exports and comparison controls", async ({
  page,
  request,
}) => {
  const data: ResearchData = await (await request.get("/api/research")).json();
  const traditions = ["existential", "stoic", "utilitarian"];
  await page.goto("/?position=none&issues=slavery,women");
  await expect(
    page.getByRole("textbox", { name: "Search people and positions" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: /^Filters/ }).click();
  const drawer = page.getByRole("region", { name: "Detailed filters" });
  await drawer.getByRole("button", { name: "Clear all", exact: true }).click();
  await expectPositions(page, data, []);
  for (const id of traditions) {
    const tradition = data.traditions.find((t) => t.id === id)!;
    await drawer
      .getByRole("checkbox", { name: tradition.shortName, exact: true })
      .check();
  }
  const expected = data.positions.filter((p) => {
    const f = data.figures.find((f) => f.id === p.figureId)!;
    return (
      ["slavery", "women"].includes(p.domainId) &&
      f.affiliations.some(
        (a) => a.status === "core" && traditions.includes(a.traditionId),
      )
    );
  });
  await expectPositions(page, data, expected);
  await page.reload();
  await expectPositions(page, data, expected);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export view" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(
    exported.calculations
      .map((p: { positionId: string }) => p.positionId)
      .sort(),
  ).toEqual(
    visiblePositions(data, expected, page.url())
      .map((p) => p.id)
      .sort(),
  );
  await page
    .getByRole("textbox", { name: "Search people and positions" })
    .fill("Nietzsche");
  await expectPositions(
    page,
    data,
    expected.filter((p) => p.figureId === "nietzsche"),
  );
  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByRole("combobox", { name: "Benchmark set" })
    .selectOption("alternative");
  await expect(page).toHaveURL(/benchmark=alternative/);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Benchmark set" }),
  ).toHaveValue("alternative");
  await expectPositions(page, data, expected);
});

test("Nietzsche appears under existentialist by default on desktop and mobile deep links", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?traditions=existential&position=nietzsche-slavery");
    await expect(page.locator(".evidence-panel h2")).toHaveText(
      "Friedrich Nietzsche",
    );
    for (const id of ["nietzsche-slavery", "nietzsche-women"])
      await expect(
        page.locator(`[data-position="${id}"] circle`).last(),
      ).toHaveAttribute("fill", "#aa4c7d");
    await page.getByRole("button", { name: /^Filters/ }).click();
    await expect(
      page.getByLabel("Include contested", { exact: true }),
    ).toBeChecked();
  }
});
