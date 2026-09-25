import test from "node:test";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import { DEFAULT_FILTERS } from "../lib/state";
import { bce, formatLifeDates } from "../lib/dates";
import {
  calculateScore,
  defaultScenarios,
  exportSnapshot,
  filterPositions,
} from "../lib/scoring";
import { axisX, buildTimelineAxis, positionCoordinates } from "../lib/geometry";

test("both scriptures have sourced passage dates and cover the requested issues without invented lives", () => {
  for (const [id, count] of [
    ["bible", 10],
    ["quran", 11],
  ] as const) {
    const f = data.figures.find((f) => f.id === id)!;
    assert.equal(f.kind, "scripture");
    assert.equal(f.born, undefined);
    assert.equal(f.died, undefined);
    assert.match(formatLifeDates(f), /^Selected passages c\./);
    const passages = data.positions.filter((p) => p.figureId === id);
    assert.equal(passages.length, count);
    for (const domain of [
      "slavery",
      "execution",
      "women",
      "gay",
      ...(id === "quran" ? ["animals", "farmed"] : []),
      "children",
      "extinction",
    ])
      assert(
        passages.some((p) => p.domainId === domain),
        `${id}: ${domain}`,
      );
    for (const p of passages) {
      assert.equal(p.attribution, "scriptural-text");
      assert.equal(p.evidence, "qualified");
      assert(p.dateBasis && p.attributionNote && p.counterevidence);
      assert(p.composition.start >= f.compositionPeriod!.start);
      assert(p.composition.end <= f.compositionPeriod!.end);
      assert(p.composition.start >= DEFAULT_FILTERS.period.start);
      for (const qid of p.quotationIds) {
        const q = data.quotations.find((q) => q.id === qid)!;
        const s = data.sources.find((s) => s.id === q.sourceId)!;
        assert(s.datingSourceUrl && s.publicDomainUrl && s.translation);
        assert(q.locator && q.context);
      }
    }
  }
  assert.deepEqual(
    data.positions.find((p) => p.id === "bible-slavery")!.composition,
    { start: bce(600), end: bce(400) },
  );
  assert.deepEqual(
    data.positions.find((p) => p.id === "quran-execution")!.composition,
    { start: 622, end: 632 },
  );
  assert.deepEqual(
    data.positions.find((p) => p.id === "quran-execution")!.publication,
    { start: 644, end: 656 },
  );
});

test("afterlife, child labor, and moral condemnation do not acquire unsupported benchmark scores", () => {
  for (const id of [
    "bible-eternal-life",
    "bible-no-more-death",
    "quran-eternal-life",
    "bible-children-rest",
    "quran-children",
    "quran-gay",
    "quran-animals",
    "quran-farmed",
    "quran-manumission",
  ]) {
    const p = data.positions.find((p) => p.id === id)!;
    assert.equal(p.milestoneId, undefined, id);
    assert.equal(calculateScore(p, undefined, defaultScenarios(data)), null);
  }
  for (const id of [
    "bible-execution",
    "bible-slavery",
    "bible-gay",
    "quran-execution",
    "quran-slavery",
    "quran-women-inheritance",
  ]) {
    const p = data.positions.find((p) => p.id === id)!;
    assert.equal(
      calculateScore(
        p,
        data.milestones.find((m) => m.id === p.milestoneId),
        {},
      )!.stance,
      "opposes",
    );
  }
});

test("Quran spellings find the same passages; public-only exports preserve codification and exclude unmatched points", () => {
  for (const query of ["Quran", "Qur’an", "Qur'an", "Koran", "Quoran"]) {
    const found = filterPositions(data, { ...DEFAULT_FILTERS, query });
    assert.equal(found.filter((p) => p.figureId === "quran").length, 11);
  }
  for (const publicOnly of [false, true]) {
    const filters = { ...DEFAULT_FILTERS, query: "Quran", publicOnly };
    const snapshot = exportSnapshot(data, filters, defaultScenarios(data));
    const c = snapshot.calculations.find(
      (c) => c.positionId === "quran-eternal-life",
    )!;
    assert.equal(c.score, null);
    assert.equal(c.placement, null);
    const scored = snapshot.calculations.find(
      (c) => c.positionId === "quran-execution",
    )!;
    assert.equal(scored.placement!.year, publicOnly ? 650 : 627);
    for (const width of [720, 1400]) {
      const p = data.positions.find((p) => p.id === scored.positionId)!;
      const axis = buildTimelineAxis(data, filters.period, width);
      const point = positionCoordinates(
        scored.score!,
        filters.period,
        width,
        1,
        axis,
      );
      assert.equal(point.x, axisX(axis, publicOnly ? 650 : 627));
      assert(point.inPeriod && Number.isFinite(point.y));
    }
  }
});

test("scripture points form tight matched-only groups without moving dates or scores", () => {
  const scenarios = defaultScenarios(data);
  const full = exportSnapshot(data, DEFAULT_FILTERS, scenarios);
  for (const figureId of ["bible", "quran"]) {
    const passages = full.calculations.filter(
      (c) =>
        data.positions.find((p) => p.id === c.positionId)!.figureId ===
          figureId && c.score,
    );
    const sorted = passages.map((c) => c.placement!).sort((a, b) => a.y - b.y);
    for (let i = 1; i < sorted.length; i++)
      assert.equal(sorted[i].y - sorted[i - 1].y, 12);
    assert.equal(sorted.length, figureId === "bible" ? 5 : 3);
    assert(sorted.at(-1)!.y - sorted[0].y <= (figureId === "bible" ? 48 : 24));
    const filtered = exportSnapshot(
      data,
      { ...DEFAULT_FILTERS, query: figureId },
      scenarios,
    );
    for (const c of passages) {
      assert.equal(c.placement!.x, axisX(full.axis, c.placement!.year));
      assert.deepEqual(
        filtered.calculations.find((p) => p.positionId === c.positionId),
        c,
      );
      const p = data.positions.find((p) => p.id === c.positionId)!;
      assert.deepEqual(
        c.score,
        calculateScore(
          p,
          data.milestones.find((m) => m.id === p.milestoneId),
          scenarios,
        ),
      );
    }
  }
});
