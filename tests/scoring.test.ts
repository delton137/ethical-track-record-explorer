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
  buildTimelineAxis,
  axisX,
  arcY,
  displayYear,
  averageReferenceY,
  referenceYears,
  positionCoordinates,
} from "../lib/geometry";
const p = data.positions[0];
test("tradition counts respect contested affiliations and remain useful across selections", () => {
  const counts = traditionCounts(data, {
    ...DEFAULT_FILTERS,
    includeContested: false,
  });
  assert.equal(counts.existential, 4);
  assert.equal(counts["secular-humanist"], 1);
  assert.equal(
    traditionCounts(data, { ...DEFAULT_FILTERS, includeContested: true })
      .existential,
    6,
  );
  assert.deepEqual(
    traditionCounts(data, {
      ...DEFAULT_FILTERS,
      includeContested: false,
      traditionIds: ["christian"],
    }),
    counts,
  );
  const searched = traditionCounts(data, {
    ...DEFAULT_FILTERS,
    query: "Russell",
  });
  assert.equal(searched["secular-humanist"], 1);
  assert.equal(searched.utilitarian, 1);
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
test("earlier opposition is penalized and later support earns no credit", () => {
  assert.equal(calculateScore(pos({ stance: "opposes" }), m, {})!.max, -20);
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
      buildTimelineAxis(data, DEFAULT_FILTERS.period, GEOMETRY.canonicalWidth),
    );
    const scripture =
      data.figures.find(
        (f) =>
          f.id ===
          data.positions.find((p) => p.id === calculation.positionId)!.figureId,
      )?.kind === "scripture";
    if (scripture) {
      assert.equal(calculation.placement!.x, canonical.x);
      assert(calculation.placement && "baseY" in calculation.placement);
      assert.equal(calculation.placement.baseY, canonical.y);
      assert(calculation.placement!.y >= canonical.y);
    } else assert.deepEqual(calculation.placement, canonical);
    const wideAxis = buildTimelineAxis(data, DEFAULT_FILTERS.period, 1400);
    const wide = positionCoordinates(
      calculation.score,
      DEFAULT_FILTERS.period,
      1400,
      snapshot.geometry.leadLagPixelsPerYear,
      wideAxis,
    );
    assert.ok(Number.isFinite(wide.y));
    assert.equal(wide.x, axisX(wideAxis, wide.year));
    if (wide.year < 1500) assert.equal(wide.x, canonical.x);
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
      filterPositions(data, DEFAULT_FILTERS).filter(
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
test("contested affiliations do not qualify when disabled; insufficient coverage has no rank", () => {
  const filters = {
    ...DEFAULT_FILTERS,
    includeContested: false,
    traditionIds: ["existential"],
  };
  const core = new Set(filterPositions(data, filters).map((p) => p.figureId));
  assert.deepEqual(
    core,
    new Set(["beauvoir", "sartre", "nietzsche", "kierkegaard"]),
  );
  assert(!core.has("camus"));
  assert(!filterPositions(data, filters).some((p) => p.figureId === "jonas"));
  assert(
    filterPositions(data, { ...filters, includeContested: true }).some(
      (p) => p.figureId === "jonas",
    ),
  );
  for (const row of leaderboard(data, data.positions, DEFAULT_FILTERS))
    if (!row.eligible) assert.equal(row.rank, null);
});
test("alternative benchmarks change matched scores", () => {
  const marx = data.positions.find((p) => p.id === "marx-slavery")!,
    milestone = data.milestones.find((m) => m.id === "abolition")!;
  assert.equal(calculateScore(marx, milestone, {})!.midpoint, 12);
  assert.equal(calculateScore(marx, milestone, {}, false, true)!.midpoint, 1);
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
    "?from=NaN&to=-10000&ai-welfare-from=2501&ai-welfare-to=abc",
    d,
  );
  assert.deepEqual(bad.filters.period, DEFAULT_FILTERS.period);
  assert.deepEqual(bad.scenarios, d);
});

test("reference line rises gently through 1700 and at 25 degrees afterward", () => {
  const earlyRise = arcY(1500) - arcY(1700);
  assert(earlyRise > 0);
  assert.equal(
    arcY(DEFAULT_FILTERS.period.start) - arcY(1700),
    GEOMETRY.earlyArcRise,
  );
  const earlySlope = earlyRise / (displayYear(1700) - displayYear(1500));
  const laterSlope =
    (arcY(1700) - arcY(1800)) / (displayYear(1800) - displayYear(1700));
  assert.ok(earlySlope < laterSlope / 10);
  for (const width of [720, 920, 1400]) {
    for (const year of [1700, 1800, 1900, 2000]) {
      const rise = arcY(year, width) - arcY(year + 100, width);
      const run = (100 * (width - 100 - GEOMETRY.ancientWidth)) / 450;
      assert.ok(Math.abs((Math.atan(rise / run) * 180) / Math.PI - 25) < 1e-10);
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
        [1949, 1949, 1949],
        [1900, 1900, 1900],
        [2000, 2000, 1949],
        [1940, 1950, 1945],
        [1940, 1960, 1949],
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

test("postdictions default to hidden and follow date, benchmark, and scenario controls", () => {
  const original = data.positions.find(
    (p) => p.stance === "supports" && p.milestoneId,
  )!;
  const milestone = data.milestones.find((m) => m.id === original.milestoneId)!;
  const fixture: ResearchData = {
    ...data,
    milestones: [
      {
        ...milestone,
        kind: "historical",
        window: { start: 1800, end: 1900 },
        alternatives: [
          {
            id: "later",
            name: "Later",
            jurisdiction: "Test",
            sourceUrl: "https://example.com",
            window: { start: 1800, end: 1950 },
          },
        ],
      },
    ],
    positions: [
      {
        ...original,
        id: "late",
        composition: { start: 1901, end: 1901 },
        publication: { start: 1960, end: 1960 },
        visibility: "public",
      },
      { ...original, id: "boundary", composition: { start: 1900, end: 1900 } },
      {
        ...original,
        id: "opposition",
        stance: "opposes",
        composition: { start: 1901, end: 1901 },
      },
      {
        ...original,
        id: "unmatched",
        milestoneId: undefined,
        composition: { start: 1901, end: 1901 },
      },
    ],
  };
  const ids = (filters = DEFAULT_FILTERS) =>
    filterPositions(fixture, filters).map((p) => p.id);
  assert.deepEqual(ids(), ["boundary", "opposition", "unmatched"]);
  assert(ids({ ...DEFAULT_FILTERS, showPostdictions: true }).includes("late"));
  assert(
    ids({ ...DEFAULT_FILTERS, benchmark: "alternative" }).includes("late"),
  );
  assert(
    !ids({
      ...DEFAULT_FILTERS,
      benchmark: "alternative",
      publicOnly: true,
    }).includes("late"),
  );
  fixture.milestones[0].kind = "projected";
  assert(
    filterPositions(fixture, DEFAULT_FILTERS, {
      [milestone.id]: { start: 1900, end: 1950 },
    }).some((p) => p.id === "late"),
  );
  const shown = { ...DEFAULT_FILTERS, showPostdictions: true };
  const url = serializeState(shown, {}, {}, null, "chart");
  assert.equal(parseState(url, {}).filters.showPostdictions, true);
  assert.equal(parseState("", {}).filters.showPostdictions, false);
  assert(
    !exportSnapshot(fixture, DEFAULT_FILTERS, {}).calculations.some(
      (p) => p.positionId === "late",
    ),
  );
});

test("comparisons always exclude postdictions before averaging, deduplication and coverage", () => {
  const figure = {
    ...data.figures[0],
    id: "early",
    affiliations: [data.figures[0].affiliations[0]],
  };
  const milestone = {
    ...m,
    id: "reform",
    kind: "historical" as const,
    window: { start: 1900, end: 1900 },
    alternatives: [
      {
        id: "later",
        name: "Later",
        window: { start: 2000, end: 2000 },
        jurisdiction: "Test",
        sourceUrl: "https://example.com",
      },
    ],
  };
  const early = pos({
    id: "early",
    figureId: figure.id,
    episodeId: "one",
    milestoneId: milestone.id,
    composition: { start: 1800, end: 1800 },
    publication: { start: 1950, end: 1950 },
    visibility: "public",
  });
  const late = {
    ...early,
    id: "late",
    episodeId: "late",
    composition: { start: 1950, end: 1950 },
  };
  const fixture: ResearchData = {
    ...data,
    figures: [figure, { ...figure, id: "late-only" }],
    milestones: [milestone],
    positions: [early],
  };
  const filters = {
    ...DEFAULT_FILTERS,
    traditionIds: [figure.affiliations[0].traditionId],
    showPostdictions: true,
  };
  const baseline = leaderboard(fixture, [early], filters);
  const extras = [
    late,
    { ...late, id: "late-duplicate", episodeId: early.episodeId },
    { ...late, id: "new-coverage", figureId: "late-only", domainId: "women" },
  ];
  assert.deepEqual(leaderboard(fixture, [early, ...extras], filters), baseline);
  assert.equal(baseline[0].midpoint, 100);
  assert.equal(baseline[0].figureCount, 1);
  assert.equal(baseline[0].domainCount, 1);
  assert.equal(baseline[0].positionCount, 1);
  assert.equal(baseline[0].unscoredCount, 0);
  // A later alternative restores the 1950 supportive episode.
  const alternative = leaderboard(fixture, [early, late], {
    ...filters,
    benchmark: "alternative",
  })[0];
  assert.equal(alternative.positionCount, 2);
  assert.equal(alternative.midpoint, 125);
  // Publication makes the otherwise early argument a postdiction.
  const published = leaderboard(fixture, [early], {
    ...filters,
    publicOnly: true,
  })[0];
  assert.equal(published.positionCount, 0);
  assert.equal(published.figureCount, 0);
  // Equality at the endpoint remains eligible, as does later opposition.
  const boundary = {
    ...early,
    id: "boundary",
    episodeId: "boundary",
    composition: { start: 1900, end: 1900 },
  };
  const opposed = {
    ...late,
    id: "opposed",
    episodeId: "opposed",
    stance: "opposes" as const,
  };
  const retained = leaderboard(fixture, [boundary, opposed], filters)[0];
  assert.equal(retained.positionCount, 2);
  assert.equal(retained.midpoint, -25);
});

test("comparison exports are identical with postdictions shown or hidden under every benchmark/date mode", () => {
  for (const publicOnly of [false, true])
    for (const benchmark of ["default", "alternative"] as const) {
      const filters = {
        ...DEFAULT_FILTERS,
        publicOnly,
        benchmark,
      };
      const defaults = defaultScenarios(data);
      const hidden = exportSnapshot(data, filters, defaults);
      const shown = exportSnapshot(
        data,
        { ...filters, showPostdictions: true },
        defaults,
      );
      assert.deepEqual(
        shown.historicalLeaderboard,
        hidden.historicalLeaderboard,
      );
      const changed = Object.fromEntries(
        Object.keys(defaults).map((id) => [id, { start: 1400, end: 1401 }]),
      );
      assert.deepEqual(
        exportSnapshot(data, filters, changed).historicalLeaderboard,
        hidden.historicalLeaderboard,
      );
    }
});

test("ethical foresight penalizes early opposition at half weight and handles date uncertainty", () => {
  const benchmark = { ...m, window: { start: 1900, end: 1900 } };
  const score = (start: number, end = start) =>
    calculateScore(
      pos({ stance: "opposes", composition: { start, end } }),
      benchmark,
      {},
      false,
      false,
    )!;
  assert.equal(score(1800).midpoint, -50);
  assert.equal(score(2000).midpoint, -100);
  assert.equal(score(1900).midpoint, 0);
  assert.deepEqual([score(1800, 1850).min, score(1800, 1850).max], [-50, -25]);
  assert.deepEqual([score(1850, 1920).min, score(1850, 1920).max], [-25, 0]);
  const uncertain = calculateScore(
    pos({ stance: "opposes" }),
    m,
    {},
    false,
    false,
  )!;
  assert.deepEqual([uncertain.min, uncertain.max], [-35, -20]);
  const support = pos({ stance: "supports" });
  const supportScore = calculateScore(support, m, {})!;
  assert.deepEqual(
    [supportScore.min, supportScore.max, supportScore.midpoint],
    [40, 70, 55],
  );
  const published = pos({
    stance: "opposes",
    visibility: "public",
    publication: { start: 2000, end: 2000 },
  });
  assert.equal(
    calculateScore(published, benchmark, {}, true, false)!.midpoint,
    -100,
  );
  const alternate: Milestone = {
    ...benchmark,
    alternatives: [
      {
        id: "test-alternative",
        name: "Test",
        jurisdiction: "Test",
        window: { start: 1800, end: 1800 },
        sourceUrl: "https://example.com",
      },
    ],
  };
  assert.equal(
    calculateScore(
      pos({ stance: "opposes", composition: { start: 1800, end: 1800 } }),
      alternate,
      {},
      false,
      true,
    )!.midpoint,
    0,
  );
});

test("exports always use ethical foresight and saved views have no scoring mode", () => {
  const scenarios = defaultScenarios(data);
  const filters = parseState("scoring=default", scenarios).filters;
  assert.deepEqual(filters, DEFAULT_FILTERS);
  assert(
    !serializeState(filters, scenarios, scenarios, null, "chart").includes(
      "scoring=",
    ),
  );
  const snapshot = exportSnapshot(data, filters, scenarios);
  assert.match(snapshot.scoringRule, /−0.5/);
  const early = snapshot.calculations.find(
    (c) =>
      c.score?.stance === "opposes" &&
      c.score.writing.end < c.score.benchmark.start,
  )!;
  assert(early.score.max < 0);
});
