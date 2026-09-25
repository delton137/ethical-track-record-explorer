import { test, expect } from "@playwright/test";
import type { ResearchData } from "../../lib/types";
import AxeBuilder from "@axe-core/playwright";

test("tradition badges match filtering and Russell is selectable as a secular humanist", async ({
  page,
}) => {
  await page.goto("/?contested=0");
  const legend = page.getByLabel("Tradition color legend");
  const existential = legend.getByRole("button", { name: /^Existentialist/ });
  const humanist = legend.getByRole("button", { name: /^Secular humanist/ });
  await expect(existential.locator("small")).toHaveText("4");
  await expect(humanist.locator("small")).toHaveText("1");
  await existential.click();
  await expect(existential.locator("small")).toHaveText("4");
  for (const id of [
    "nietzsche-slavery",
    "nietzsche-women",
    "kierkegaard-women",
  ])
    await expect(page.locator(`[data-position="${id}"]`)).toBeVisible();
  await expect(humanist.locator("small")).toHaveText("1");
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.getByLabel("Include contested").check();
  await expect(existential.locator("small")).toHaveText("6");
  await humanist.click();
  await expect(page.locator("[data-position]")).toHaveCount(1);
  await expect(
    page.locator('[data-position="russell-extinction"]'),
  ).toBeVisible();
  await page.reload();
  await expect(humanist).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator('[data-position="russell-extinction"]'),
  ).toBeVisible();
  await page.goto(
    "/?traditions=utilitarian&position=russell-extinction&contested=0",
  );
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page
    .getByRole("combobox", { name: "Tradition", exact: true })
    .selectOption("utilitarian");
  await expect(
    page.getByLabel("Include contested", { exact: true }),
  ).not.toBeChecked();
  await expect(
    page.locator('[data-position="russell-extinction"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-position="russell-extinction"] circle').last(),
  ).toHaveAttribute("fill", "#2868c7");
});

test("Include contested updates author colors, filters, and shared views", async ({
  page,
}) => {
  await page.goto("/?position=none&contested=0");
  const dot = page.locator('[data-position="camus-execution"] circle').last();
  const original = await dot.getAttribute("fill");
  await page.getByRole("button", { name: /^Filters/ }).click();
  const toggle = page.getByLabel("Include contested", { exact: true });
  await toggle.check();
  await expect(dot).toHaveAttribute("fill", "#aa4c7d");
  await page
    .getByRole("combobox", { name: "Tradition", exact: true })
    .selectOption("existential");
  await expect(dot).toHaveCount(1);
  await page.reload();
  await expect(dot).toHaveAttribute("fill", "#aa4c7d");
  await page.getByRole("button", { name: /^Filters/ }).click();
  await toggle.uncheck();
  await expect(dot).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Tradition", exact: true })
    .selectOption("");
  await expect(dot).toHaveAttribute("fill", original!);
});

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
  await expect(page.locator("[data-position]")).toHaveCount(3);
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

test("future edits and reset preserve historical ranks", async ({ page }) => {
  await page.goto("/?position=none");
  const defaults = {
    "Ending factory farming / veganism": ["2000", "2100"],
    "Humanity starts to take extinction risks seriously": ["2000", "2030"],
    "Wild-animal welfare statutes": ["2060", "2100"],
    "AI welfare statutes": ["2040", "2100"],
  };
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.locator(".scenario-settings > summary").click();
  for (const [name, [start, end]] of Object.entries(defaults)) {
    await expect(page.getByLabel(`${name} start year`)).toHaveValue(start);
    await expect(page.getByLabel(`${name} end year`)).toHaveValue(end);
  }
  await page.locator(".leaderboard>summary").click();
  const rankText = await page.locator(".ranking-table").innerText();
  await page.getByLabel("AI welfare statutes start year").fill("2200");
  await page.getByLabel("AI welfare statutes end year").fill("2250");
  await page.getByRole("button", { name: "Apply scenarios" }).click();
  await expect(page).toHaveURL(/ai-welfare-from=2200&ai-welfare-to=2250/);
  expect(await page.locator(".ranking-table").innerText()).toBe(rankText);
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
  const extinctionAnchor = page.locator(
    '.scenario-anchor[aria-label^="Humanity starts to take extinction risks seriously:"]',
  );
  await extinctionAnchor.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("dialog[open]")).toContainText("2000–2030");
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(extinctionAnchor).toBeFocused();
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
  const traditionCount = await drawer.locator(".check-grid input").count();
  await expect(drawer.locator(".check-grid input:checked")).toHaveCount(
    traditionCount,
  );
  await drawer.locator(".check-grid input").first().uncheck();
  await expect(drawer.locator(".check-grid input:checked")).toHaveCount(
    traditionCount - 1,
  );
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
  await expect(religion.locator(".progress-date-span")).toHaveText("1689–1919");
  await expect(popup).not.toContainText("1689–1919");
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

test("closing reform details restores focus without a box around the graph", async ({
  page,
}) => {
  await page.goto("/?position=none");
  const interval = page.getByRole("button", {
    name: /Progress interval \/ date: Legal reforms toward ending child labor/,
  });
  await interval.locator(".milestone-label").click();
  await expect(page.locator(".benchmark-dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Close benchmark", exact: true })
    .click();
  await expect(page.locator(".benchmark-dialog")).not.toBeVisible();
  await expect(interval).toBeFocused();
  await expect(interval).toHaveCSS("outline-style", "none");
  await expect(interval.locator(".progress-interval-line")).toHaveCSS(
    "stroke-width",
    "5px",
  );
});

test("interval hover bands extend to the chart edge on their side of the arc", async ({
  page,
}) => {
  await page.goto("/?position=none");
  const band = page.locator(".progress-hover-highlight");
  await expect(band).toHaveCount(0);
  for (const [label, below] of [
    ["Religious liberty", false],
    ["Women’s suffrage", true],
  ] as const) {
    await page.locator(".milestone-label").filter({ hasText: label }).hover();
    await expect(band).toBeVisible();
    const bounds = await band.evaluate((element) => {
      const path = element as SVGPathElement;
      const box = path.getBBox();
      const svg = path.ownerSVGElement!;
      const interval = svg.querySelector<SVGPathElement>(
        `.progress-interval-line[data-milestone="${path.dataset.milestone}"]`,
      )!;
      const line = interval.getBBox();
      return {
        top: box.y,
        bottom: box.y + box.height,
        x: box.x,
        width: box.width,
        lineX: line.x,
        lineWidth: line.width,
        height: svg.viewBox.baseVal.height,
        viewTop: svg.viewBox.baseVal.y,
      };
    });
    expect(bounds.x).toBeCloseTo(bounds.lineX);
    expect(bounds.width).toBeCloseTo(bounds.lineWidth);
    if (below)
      expect(bounds.bottom).toBeCloseTo(bounds.viewTop + bounds.height - 100);
    else expect(bounds.top).toBeCloseTo(bounds.viewTop + 65);
  }
  await page.mouse.move(5, 5);
  await expect(band).toHaveCount(0);
});

test("every rendered point matches its placement rule at desktop and mobile widths", async ({
  page,
  request,
}) => {
  const { calculateScore, defaultScenarios } =
    await import("../../lib/scoring");
  const { arcY, averageReferenceY, GEOMETRY } =
    await import("../../lib/geometry");
  const data: ResearchData = await (await request.get("/api/research")).json();
  const { DEFAULT_PERIOD: period } = await import("../../lib/dates");
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/?position=none");
    await expect(
      page.locator('[data-position="nietzsche-women"]'),
    ).toBeAttached();
    await expect
      .poll(async () => {
        const rendered = await page.locator("svg.timeline").evaluate((svg) => ({
          width: (svg as SVGSVGElement).viewBox.baseVal.width,
          points: Array.from(svg.querySelectorAll("[data-position]")).map(
            (el) => ({
              id: el.getAttribute("data-position"),
              offset: Number(el.getAttribute("data-display-offset") ?? 0),
              transform: el.getAttribute("transform"),
            }),
          ),
        }));
        const errors: string[] = [];
        for (const dot of rendered.points) {
          const p = data.positions.find((p) => p.id === dot.id)!;
          const m = data.milestones.find((m) => m.id === p.milestoneId)!;
          const s = calculateScore(p, m, defaultScenarios(data))!;
          const actual = Number(
            dot.transform!.match(/translate\([^,]+,([^\)]+)\)/)![1],
          );
          const expected = !s
            ? Math.max(
                GEOMETRY.height,
                arcY(period.start, rendered.width, period) + 150,
              ) - 145
            : p.stance === "opposes"
              ? arcY(
                  Math.min(
                    (s.writing.start + s.writing.end) / 2,
                    s.benchmark.start,
                  ),
                  rendered.width,
                  period,
                )
              : s.writing.start >= s.benchmark.end
                ? arcY(s.benchmark.end, rendered.width, period)
                : averageReferenceY(s.benchmark, rendered.width, period);
          if (Math.abs(actual - expected - dot.offset) > 0.001)
            errors.push(p.id);
        }
        return errors;
      })
      .toEqual([]);
  }
});

test("publication witnesses and animal benchmark sensitivity remain visible", async ({
  page,
}) => {
  await page.goto("/?position=rawls-religion");
  const panel = page.locator(".evidence-panel");
  await expect(panel).toContainText("Passage publication / dated edition");
  await panel.getByText("Edition, language & verification").click();
  await expect(panel.locator(".quotation-card .source-details")).toContainText(
    "1971",
  );
  await expect(panel.locator(".quotation-card .source-details")).toContainText(
    "1999",
  );
  await page.goto("/?position=bentham-animals&benchmark=alternative");
  await expect(page.locator(".comparison-block")).toContainText("1822");
  await expect(page.locator(".comparison-block .score-pill")).toContainText(
    "33",
  );
  await expect(page.locator('[data-position="bodhi-insects"]')).toHaveCount(0);
});
