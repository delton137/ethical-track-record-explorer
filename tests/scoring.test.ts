import test from "node:test";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import {
  calculateScore,
  defaultScenarios,
  filterPositions,
  leaderboard,
  exportSnapshot,
} from "../lib/scoring";
import { DEFAULT_FILTERS, parseState, serializeState } from "../lib/state";
import type { ResearchData, WrittenPosition, Milestone } from "../lib/types";
import { GEOMETRY, positionCoordinates } from "../lib/geometry";
const p = data.positions[0];
const m: Milestone = {
  ...data.milestones[0],
  window: { start: 1900, end: 1920 },
};
const pos = (changes: Partial<WrittenPosition>): WrittenPosition => ({
  ...p,
  composition: { start: 1850, end: 1860 },
  ...changes,
});
test("support propagates both writing and adoption intervals", () => {
  const s = calculateScore(pos({ stance: "supports" }), m, {})!;
  assert.deepEqual([s.min, s.max, s.midpoint], [40, 70, 55]);
});
test("earlier opposition and later support never earn credit", () => {
  assert.equal(calculateScore(pos({ stance: "opposes" }), m, {})!.max, 0);
  assert.equal(
    calculateScore(pos({ composition: { start: 1930, end: 1940 } }), m, {})!
      .max,
    0,
  );
});
test("later opposition earns a negative interval, including transitional cases", () => {
  assert.deepEqual(
    ((s) => [s!.min, s!.max])(
      calculateScore(
        pos({ stance: "opposes", composition: { start: 1910, end: 1940 } }),
        m,
        {},
      ),
    ),
    [-40, 0],
  );
});
test("ambiguous, private-only and unmatched evidence cannot acquire a score", () => {
  assert.equal(calculateScore(pos({ stance: "ambiguous" }), m, {}), null);
  assert.equal(calculateScore(p, undefined, {}), null);
  assert.equal(
    calculateScore(pos({ visibility: "private" }), m, {}, true),
    null,
  );
});
test("public-only uses publication date and excludes private manuscripts", () => {
  const filters = { ...DEFAULT_FILTERS, publicOnly: true };
  assert(
    !filterPositions(data, filters).some((p) => p.visibility === "private"),
  );
  const s = calculateScore(
    pos({ publication: { start: 1890, end: 1890 } }),
    m,
    {},
    true,
  )!;
  assert.deepEqual([s.min, s.max], [10, 30]);
});
test("the four requested scenario windows reset exactly", () => {
  assert.deepEqual(defaultScenarios(data), {
    "extinction-concern": { start: 2000, end: 2030 },
    "wild-welfare": { start: 2024, end: 2050 },
    "insect-welfare": { start: 2020, end: 2050 },
    "ai-welfare": { start: 2100, end: 2100 },
  });
});
test("exported placements reproduce the chart at different responsive widths", () => {
  const snapshot = exportSnapshot(
    data,
    DEFAULT_FILTERS,
    defaultScenarios(data),
  );
  for (const calculation of snapshot.calculations) {
    if (!calculation.score) {
      assert.equal(calculation.placement, null);
      continue;
    }
    const canonical = positionCoordinates(
      calculation.score,
      DEFAULT_FILTERS.period,
      GEOMETRY.canonicalWidth,
      snapshot.geometry.leadLagPixelsPerYear,
    );
    assert.deepEqual(calculation.placement, canonical);
    const wide = positionCoordinates(
      calculation.score,
      DEFAULT_FILTERS.period,
      1400,
      snapshot.geometry.leadLagPixelsPerYear,
    );
    assert.equal(wide.y, canonical.y);
    assert.equal(wide.xFraction, canonical.xFraction);
    assert.equal(wide.x, 58 + canonical.xFraction * (1400 - 58 - 42));
  }
});
test("future scenarios never enter or change historical rankings", () => {
  const defaults = defaultScenarios(data),
    changed = structuredClone(defaults);
  changed["wild-welfare"] = { start: 2300, end: 2400 };
  const a = exportSnapshot(data, DEFAULT_FILTERS, defaults),
    b = exportSnapshot(data, DEFAULT_FILTERS, changed);
  assert.deepEqual(a.historicalLeaderboard, b.historicalLeaderboard);
  assert.notDeepEqual(a.calculations, b.calculations);
  assert.deepEqual(
    leaderboard(
      data,
      data.positions.filter(
        (p) =>
          data.milestones.find((m) => m.id === p.milestoneId)?.kind ===
          "historical",
      ),
      DEFAULT_FILTERS,
    ).map((r) => [r.traditionId, r.min, r.max]),
    a.historicalLeaderboard.map((r) => [r.traditionId, r.min, r.max]),
  );
});
test("duplicate quotations and episode records never increase weight", () => {
  const baseline = leaderboard(data, data.positions, DEFAULT_FILTERS);
  const repeated = [
    ...data.positions,
    {
      ...data.positions[0],
      id: "duplicate",
      quotationIds: [...p.quotationIds, ...p.quotationIds],
    },
  ];
  assert.deepEqual(leaderboard(data, repeated, DEFAULT_FILTERS), baseline);
});
test("nested averaging gives people then domains equal weight and respects mixed membership", () => {
  const a = {
    ...data.figures[0],
    id: "a",
    affiliations: [
      { ...data.figures[0].affiliations[0], traditionId: "utilitarian" },
      { ...data.figures[0].affiliations[0], traditionId: "liberal" },
    ],
  };
  const b = { ...a, id: "b", affiliations: a.affiliations.slice(0, 1) },
    c = { ...b, id: "c" };
  const ms = ["slavery", "religion", "animals"].map((d, i) => ({
    ...m,
    id: "m" + i,
    domainId: d,
    window: { start: 1900, end: 1900 },
  }));
  const make = (
    id: string,
    figureId: string,
    domainId: string,
    year: number,
    index: number,
  ) =>
    pos({
      id,
      figureId,
      domainId,
      episodeId: id,
      milestoneId: "m" + index,
      composition: { start: year, end: year },
    });
  const ps = [
    make("a1", "a", "slavery", 1800, 0),
    make("a2", "a", "slavery", 1840, 0),
    make("b1", "b", "slavery", 1860, 0),
    make("c1", "c", "religion", 1880, 1),
    make("a3", "a", "animals", 1870, 2),
  ];
  const d: ResearchData = {
    ...data,
    figures: [a, b, c],
    positions: ps,
    milestones: ms,
  };
  const r = leaderboard(d, ps, DEFAULT_FILTERS).find(
    (r) => r.traditionId === "utilitarian",
  )!;
  // A's slavery mean=80, weight=.5; B=40, weight=1. Domain mean=53 1/3; other domains=20 and30.
  assert(Math.abs(r.midpoint - ((80 * 0.5 + 40) / 1.5 + 20 + 30) / 3) < 1e-9);
  assert.equal(r.eligible, true);
  assert.equal(r.figureCount, 3);
  assert.equal(r.domainCount, 3);
  assert.equal(
    leaderboard(
      d,
      ps.filter((p) => p.domainId !== "animals"),
      DEFAULT_FILTERS,
    ).find((r) => r.traditionId === "utilitarian")!.eligible,
    false,
  );
});
test("contested affiliations do not qualify by default; insufficient coverage has no rank", () => {
  const filters = { ...DEFAULT_FILTERS, traditionIds: ["existential"] };
  assert(!filterPositions(data, filters).some((p) => p.figureId === "jonas"));
  assert(
    filterPositions(data, { ...filters, includeContested: true }).some(
      (p) => p.figureId === "jonas",
    ),
  );
  for (const row of leaderboard(data, data.positions, DEFAULT_FILTERS))
    if (!row.eligible) assert.equal(row.rank, null);
});
test("alternative benchmarks change matched scores, while shared-domain comparisons show coverage", () => {
  const marx = data.positions.find((p) => p.id === "marx-slavery")!,
    milestone = data.milestones.find((m) => m.id === "abolition")!;
  assert.equal(calculateScore(marx, milestone, {})!.midpoint, 0);
  assert.equal(calculateScore(marx, milestone, {}, false, true)!.midpoint, 1);
  const f = {
    ...DEFAULT_FILTERS,
    traditionIds: ["utilitarian", "kantian"],
    sharedDomains: true,
  };
  const r = leaderboard(data, filterPositions(data, f), f);
  assert.deepEqual([...r[0].domains].sort(), [...r[1].domains].sort());
});
test("deep links round-trip filters, closed panels and edited scenarios; malformed dates are bounded", () => {
  const d = defaultScenarios(data),
    s = { ...d, "ai-welfare": { start: 2200, end: 2250 } },
    f = {
      ...DEFAULT_FILTERS,
      query: "Bentham & rights",
      publicOnly: true,
      period: { start: 1700, end: 2050 },
      domainIds: ["animals"],
      includeContested: true,
    };
  const parsed = parseState(serializeState(f, s, d, null, "table"), d);
  assert.deepEqual(parsed.filters, f);
  assert.deepEqual(parsed.scenarios, s);
  assert.equal(parsed.selected, "none");
  assert.equal(parsed.view, "table");
  const bad = parseState(
    "?from=NaN&to=-999&ai-welfare-from=2501&ai-welfare-to=abc",
    d,
  );
  assert.deepEqual(bad.filters.period, DEFAULT_FILTERS.period);
  assert.deepEqual(bad.scenarios, d);
});
