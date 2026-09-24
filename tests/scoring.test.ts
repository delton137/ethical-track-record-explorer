import test from "node:test";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import {
  calculateScore,
  defaultScenarios,
  filterPositions,
  leaderboard,
  exportSnapshot,
  traditionCounts,
} from "../lib/scoring";
import { DEFAULT_FILTERS, parseState, serializeState } from "../lib/state";
import type { ResearchData, WrittenPosition, Milestone } from "../lib/types";
import {
  GEOMETRY,
  arcY,
  displayYear,
  averageReferenceY,
  referenceYears,
  positionCoordinates,
} from "../lib/geometry";
const p = data.positions[0];
test("tradition counts respect contested affiliations and remain useful across selections", () => {
  const counts = traditionCounts(data, DEFAULT_FILTERS);
  assert.equal(counts.existential, 2);
  assert.equal(counts["secular-humanist"], 1);
  assert.equal(
    traditionCounts(data, { ...DEFAULT_FILTERS, includeContested: true })
      .existential,
    6,
  );
  assert.deepEqual(
    traditionCounts(data, { ...DEFAULT_FILTERS, traditionIds: ["christian"] }),
    counts,
  );
  const searched = traditionCounts(data, {
    ...DEFAULT_FILTERS,
    query: "Russell",
  });
  assert.equal(searched["secular-humanist"], 1);
  assert.equal(searched.utilitarian, 0);
  assert.equal(searched.existential, 0);
  assert.deepEqual(
    [
      ...new Set(
        filterPositions(data, {
          ...DEFAULT_FILTERS,
          traditionIds: ["secular-humanist"],
        }).map((p) => p.figureId),
      ),
    ],
    ["russell"],
  );
});
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
test("the merged scenario windows reset exactly", () => {
  assert.deepEqual(defaultScenarios(data), {
    "factory-farming-transition": { start: 2000, end: 2100 },
    "extinction-concern": { start: 2000, end: 2030 },
    "wild-welfare": { start: 2060, end: 2100 },
    "ai-welfare": { start: 2040, end: 2100 },
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
    assert.ok(Number.isFinite(wide.y));
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
  assert.equal(calculateScore(marx, milestone, {})!.midpoint, 12);
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

test("early reference slope is tiny even after horizontal compression", () => {
  const earlyRise = arcY(1500) - arcY(1700);
  assert.ok(earlyRise > 0 && earlyRise <= 2.01);
  const earlySlope = earlyRise / (displayYear(1700) - displayYear(1500));
  const laterSlope =
    (arcY(1700) - arcY(1800)) / (displayYear(1800) - displayYear(1700));
  assert.ok(earlySlope < laterSlope / 10);
  for (const width of [720, 920, 1400]) {
    for (const year of [1700, 1800, 1900, 2000]) {
      const rise = arcY(year, width) - arcY(year + 100, width);
      const run = (100 * (width - 100)) / 450;
      assert.ok(Math.abs((Math.atan(rise / run) * 180) / Math.PI - 20) < 1e-10);
    }
  }
  assert.ok(Math.abs(arcY(2100) - 445) < 1e-10);
  assert.deepEqual(referenceYears(1500, 1800), [1500, 1700, 1800]);
});

test("support before or during reform uses average interval height", () => {
  const bentham = data.positions.find((p) => p.id === "bentham-gay")!;
  const milestone = data.milestones.find((m) => m.id === "decriminalization")!;
  const score = calculateScore(bentham, milestone, {})!;
  const placement = positionCoordinates(score, DEFAULT_FILTERS.period, 920, 1);
  assert.equal(placement.y, averageReferenceY(milestone.window));
  assert.equal(placement.uncertaintyTopY, arcY(2003));
  assert.equal(placement.uncertaintyBottomY, arcY(1967));
  const later = { ...score, writing: { start: 1950, end: 1950 } };
  assert.equal(
    positionCoordinates(later, DEFAULT_FILTERS.period, 920, 1).y,
    placement.y,
  );
  assert.ok(
    Math.abs(
      averageReferenceY({ start: 1833, end: 1840 }) -
        (arcY(1833) + arcY(1840)) / 2,
    ) < 1e-10,
  );
});

test("opposition before reform sits on the reference line", () => {
  for (const id of ["kant-execution", "luther-religion"]) {
    const p = data.positions.find((p) => p.id === id)!;
    const m = data.milestones.find((m) => m.id === p.milestoneId)!;
    const score = calculateScore(p, m, {})!;
    const placement = positionCoordinates(
      score,
      DEFAULT_FILTERS.period,
      920,
      1,
    );
    assert.equal(score.stance, "opposes");
    assert.equal(placement.y, arcY(placement.year));
    assert.equal(placement.uncertaintyTopY, placement.y);
  }
});

test("early centuries occupy a quarter of the width of later centuries", () => {
  assert.equal(displayYear(1600) - displayYear(1500), 25);
  assert.equal(displayYear(1700) - displayYear(1600), 25);
  assert.equal(displayYear(1800) - displayYear(1700), 100);
});

test("insect evidence joins wild-animal welfare without losing its quotation", () => {
  const p = data.positions.find((p) => p.id === "tomasik-insects")!;
  assert.equal(p.domainId, "wild");
  assert.equal(p.milestoneId, "wild-welfare");
  assert.ok(p.quotationIds.length > 0);
  assert.ok(!data.domains.some((d) => d.id === "insects"));
  assert.ok(!data.milestones.some((m) => m.id === "insect-welfare"));
  assert.deepEqual(
    parseState("?issues=insects", defaultScenarios(data)).filters.domainIds,
    ["wild"],
  );
});

test("support after reform uses its endpoint; uncertain dates crossing the end retain the interval", () => {
  const p = data.positions.find((p) => p.id === "becker-slavery")!;
  const m = data.milestones.find((m) => m.id === p.milestoneId)!;
  const score = calculateScore(p, m, {})!;
  for (const width of [720, 920, 1400]) {
    const point = positionCoordinates(score, DEFAULT_FILTERS.period, width, 1);
    assert.equal(point.y, arcY(m.window.end, width, DEFAULT_FILTERS.period));
    assert.equal(point.uncertaintyTopY, point.y);
    assert.equal(point.uncertaintyBottomY, point.y);
  }
  const crossing = {
    ...score,
    writing: { start: m.window.end - 1, end: m.window.end + 1 },
  };
  assert.equal(
    positionCoordinates(crossing, DEFAULT_FILTERS.period, 920, 1).y,
    averageReferenceY(m.window),
  );
});

test("opposition placement is continuous at reform onset and uses the displayed midpoint", () => {
  const p = data.positions.find((p) => p.id === "kant-execution")!;
  const m = data.milestones.find((m) => m.id === p.milestoneId)!;
  for (const width of [720, 1440]) {
    for (const period of [
      { start: 1500, end: 2100 },
      { start: 1750, end: 2050 },
    ]) {
      for (const [start, end, anchor] of [
        [1800, 1800, 1800],
        [1867, 1867, 1867],
        [1900, 1900, 1867],
        [2000, 2000, 1867],
        [1860, 1870, 1865],
        [1860, 1880, 1867],
      ]) {
        const score = calculateScore(
          { ...p, composition: { start, end } },
          m,
          {},
        )!;
        const point = positionCoordinates(score, period, width, 1);
        assert.equal(point.y, arcY(anchor, width, period));
        if (point.year > m.window.start)
          assert(point.y > arcY(point.year, width, period));
        else assert.equal(point.y, arcY(point.year, width, period));
      }
    }
  }
});
