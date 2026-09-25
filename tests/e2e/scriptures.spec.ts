import { test, expect } from "@playwright/test";
import type { ResearchData } from "../../lib/types";

test("Bible and Quran plot only interval-matched connected points", async ({
  page,
  request,
}) => {
  const data: ResearchData = await (await request.get("/api/research")).json();
  for (const [id, query] of [
    ["bible", "Bible"],
    ["quran", "Quoran"],
  ]) {
    await page.goto(`/?q=${query}&position=none`);
    const passages = data.positions.filter(
      (p) => p.figureId === id && p.milestoneId,
    );
    await expect(page.locator("[data-position]")).toHaveCount(passages.length);
    const line = page.locator(`polyline[data-figure="${id}"]`);
    await expect(line).toHaveCount(1);
    expect((await line.getAttribute("points"))!.split(" ")).toHaveLength(
      passages.length,
    );
    await expect(
      page.locator(`[data-position="${id}-eternal-life"]`),
    ).toHaveCount(0);
    const dot = page.locator(`[data-position="${id}-execution"]`);
    await expect(dot).toHaveAttribute("data-scored", "true");
    await dot.focus();
    await dot.press("Enter");
    const picker = page.getByRole("dialog", {
      name: "Choose an overlapping position",
    });
    if (await picker.isVisible()) {
      await picker
        .getByRole("button")
        .filter({
          hasText: passages.find((p) => p.id === `${id}-execution`)!.title,
        })
        .click();
    }
    const panel = page.locator(".evidence-panel");
    await expect(panel).toContainText("Scriptural text.");
    await expect(panel).not.toContainText("Unscored position");
    await expect(panel).toContainText("Passage composition / redaction");

    await expect(panel.locator("blockquote")).toBeVisible();
  }
});

test("scripture dates remain ancient in table and public-only mode, on desktop and mobile", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(
      "/?q=Quran&public=1&position=quran-eternal-life&view=table",
    );
    await expect(page.locator(".evidence-table tbody tr")).toHaveCount(11);
    await expect(
      page.locator(".evidence-table tbody tr").first(),
    ).toContainText("644–656 CE");
    await expect(page.locator(".evidence-panel")).toContainText("622–632 CE");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("scripture groups stay compact with readable hover labels", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/?q=Bible&position=none");
    const dot = page.locator('[data-position="bible-slavery"]');
    await dot.focus();
    await expect(page.locator("[data-label-position]")).toHaveCount(5);
    const ys = await page
      .locator("[data-position]")
      .evaluateAll((nodes) =>
        nodes.map((n) =>
          Number(
            n
              .getAttribute("transform")!
              .match(/translate\([^,]+,([^\)]+)\)/)![1],
          ),
        ),
      );
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThanOrEqual(48);
    const boxes = await page
      .locator("[data-label-position]")
      .evaluateAll((nodes) =>
        nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        }),
      );
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j];
        expect(
          a.right <= b.left ||
            b.right <= a.left ||
            a.bottom <= b.top ||
            b.bottom <= a.top,
        ).toBe(true);
      }
    expect(
      Number(await dot.getAttribute("data-display-offset")),
    ).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
