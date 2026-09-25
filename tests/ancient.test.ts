import test from "node:test";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import {
  bce,
  formatYear,
  formatYears,
  formatLifeDates,
  parseYearInput,
  DEFAULT_PERIOD,
} from "../lib/dates";
import {
  ancientOccupiedIntervals,
  axisX,
  buildTimelineAxis,
  arcY,
  GEOMETRY,
  positionCoordinates,
} from "../lib/geometry";
import {
  calculateScore,
  defaultScenarios,
  exportSnapshot,
  filterPositions,
  leaderboard,
} from "../lib/scoring";
import { DEFAULT_FILTERS, parseState, serializeState } from "../lib/state";
import baseline from "./fixtures/existing-scores.json";

const added = [
  "aristotle",
  "aquinas",
  "musonius",
  "nagarjuna",
  "umasvati",
  "ibn-rushd",
  "sidgwick",
  "james-mill",
];

test("BCE/CE arithmetic, labels and human input never introduce a displayed year zero", () => {
  assert.equal(bce(1), 0);
  assert.equal(bce(400), -399);
  assert.equal(1 - bce(1), 1);
  assert.equal(formatYear(0), "1 BCE");
  assert.equal(formatYears({ start: -1, end: 1 }), "2 BCE–1 CE");
  assert.equal(formatYears({ start: -383, end: -321 }), "384–322 BCE");
  assert.equal(parseYearInput("400 BCE"), -399);
  assert.equal(parseYearInput("1 bc"), 0);
  assert.equal(parseYearInput("50 CE"), 50);
  assert.equal(parseYearInput("1850"), 1850);
  for (const bad of [
    "0",
    "0 BCE",
    "-399",
    "2.5 CE",
    "10001 BCE",
    "2501",
    "NaN",
  ])
    assert.equal(parseYearInput(bad), null, bad);
  const p = {
    ...data.positions[0],
    composition: { start: bce(1), end: bce(1) },
  };
  const m = { ...data.milestones[0], window: { start: 1, end: 1 } };
  assert.equal(calculateScore(p, m, {})!.midpoint, 1);
});

test("historical URL round trips preserve astronomical zero and negative years, while scenario limits remain separate", () => {
  const defaults = defaultScenarios(data);
  assert.deepEqual(parseState("", defaults).filters.period, DEFAULT_PERIOD);
  for (const period of [
    { start: -399, end: 2100 },
    { start: 0, end: 1 },
    { start: -399, end: -300 },
    { start: 1500, end: 2100 },
  ]) {
    const filters = { ...DEFAULT_FILTERS, period };
    assert.deepEqual(
      parseState(
        serializeState(
          filters,
          defaults,
          defaults,
          "aristotle-slavery",
          "table",
        ),
        defaults,
      ).filters,
      filters,
    );
  }
  assert.deepEqual(parseState("?from=1500&to=2100", defaults).filters.period, {
    start: 1500,
    end: 2100,
  });
  assert.deepEqual(
    parseState("?ai-welfare-from=-399&ai-welfare-to=0", defaults).scenarios,
    defaults,
  );
  assert.equal(
    parseState("?from=1.5", defaults).filters.period.start,
    DEFAULT_PERIOD.start,
  );
});

test("all eight dossiers preserve attribution, dates, affiliations and benchmark limits", () => {
  for (const id of added) {
    const f = data.figures.find((f) => f.id === id)!;
    assert(f.affiliations.length && f.importance.sourceUrl);
    for (const p of data.positions.filter((p) => p.figureId === id)) {
      assert(
        p.attribution && p.dateBasis && p.counterevidence && p.matchRationale,
      );
      assert.equal(p.evidence, "qualified");
      assert(p.quotationIds.length > 0);
    }
  }
  const musonius = data.positions.find((p) => p.id === "musonius-women")!;
  assert.equal(musonius.attribution, "reported-teaching");
  assert.deepEqual(musonius.composition, { start: 60, end: 102 });
  assert.deepEqual(musonius.textualAttestation, { start: 401, end: 500 });
  assert.deepEqual(musonius.publication, musonius.textualAttestation);
  const q = data.quotations.find((q) => q.id === musonius.quotationIds[0])!;
  assert.deepEqual(
    data.sources.find((s) => s.id === q.sourceId)!.witnessPublication,
    { start: 1947, end: 1947 },
  );
  for (const id of ["musonius", "nagarjuna", "umasvati"]) {
    const f = data.figures.find((f) => f.id === id)!;
    assert.equal(f.born, undefined);
    assert.equal(f.died, undefined);
    assert(f.floruit && f.lifeDateSourceUrl);
    assert.match(formatLifeDates(f), /^fl\./);
  }
  for (const id of ["musonius-women", "umasvati-noninjury"])
    assert.equal(
      data.positions.find((p) => p.id === id)!.milestoneId,
      undefined,
    );
  assert.equal(
    data.positions.find((p) => p.id === "sidgwick-suffrage")!.composition.start,
    1897,
  );
  assert.equal(
    data.positions.find((p) => p.id === "james-mill-suffrage")!.composition
      .start,
    1825,
  );
});

test("date filters use actual ranges and distinguish teaching from attestation", () => {
  const filters = { ...DEFAULT_FILTERS, period: { start: 40, end: 110 } };
  assert(filterPositions(data, filters).some((p) => p.id === "musonius-women"));
  assert(
    !filterPositions(data, { ...filters, publicOnly: true }).some(
      (p) => p.id === "musonius-women",
    ),
  );
  assert(
    filterPositions(data, {
      ...filters,
      publicOnly: true,
      period: { start: 401, end: 500 },
    }).some((p) => p.id === "musonius-women"),
  );
  assert.deepEqual(
    filterPositions(data, {
      ...DEFAULT_FILTERS,
      period: { start: -350, end: -300 },
    })
      .filter((p) => p.figureId === "aristotle")
      .map((p) => p.id)
      .sort(),
    ["aristotle-slavery", "aristotle-women"],
  );
});

test("full-corpus compression is ordered, protected, and stable under every search/filter", () => {
  const axis = buildTimelineAxis(data);
  assert.equal(axis.ancientEndX, GEOMETRY.leftMargin + 160);
  assert(axis.breaks.length > 0);
  const intervals = ancientOccupiedIntervals(data);
  for (const b of axis.breaks) {
    assert(b.end - b.start >= 200);
    assert(b.x1 - b.x0 <= GEOMETRY.breakWidth + 1e-10);
    for (const r of intervals) assert(r.end <= b.start || r.start >= b.end);
    for (const p of data.positions)
      for (const r of [p.composition, p.publication])
        assert(r.end <= b.start || r.start >= b.end, p.id);
  }
  for (let y = -399; y < 2100; y++) assert(axisX(axis, y) < axisX(axis, y + 1));
  const full = exportSnapshot(data, DEFAULT_FILTERS, defaultScenarios(data));
  for (const f of [
    { ...DEFAULT_FILTERS, query: "Aristotle" },
    { ...DEFAULT_FILTERS, traditionIds: ["buddhist"] },
    { ...DEFAULT_FILTERS, publicOnly: true },
  ]) {
    const filtered = exportSnapshot(data, f, defaultScenarios(data));
    assert.deepEqual(filtered.axis, full.axis);
    if (!f.publicOnly)
      for (const c of filtered.calculations)
        assert.deepEqual(
          c.placement,
          full.calculations.find((p) => p.positionId === c.positionId)!
            .placement,
        );
  }
});

test("uncertainty crossing an otherwise empty gap forbids that break", () => {
  const fixture = structuredClone(data);
  fixture.positions.push({
    ...fixture.positions[0],
    id: "bridge",
    figureId: "aristotle",
    composition: { start: 400, end: 1300 },
    publication: { start: 400, end: 1300 },
  });
  const axis = buildTimelineAxis(fixture);
  assert(!axis.breaks.some((b) => b.start < 1300 && b.end > 400));
  for (const width of [720, 920, 1440])
    for (const period of [
      DEFAULT_PERIOD,
      { start: -200, end: 1400 },
      { start: 1500, end: 2100 },
    ]) {
      const line = arcY(1700, width, period);
      for (const y of [-399, 0, 50, 500, 1126, 1500, 1699, 1700])
        assert(
          Math.abs(
            arcY(y, width, period) -
              line -
              (GEOMETRY.earlyArcRise * (1700 - y)) /
                (1700 - DEFAULT_PERIOD.start),
          ) < 1e-9,
        );
      const geometry = buildTimelineAxis(data, period, width);
      assert(geometry.segments.every((s) => s.end > s.start && s.x1 > s.x0));
    }
});

test("original records match reviewed benchmark scores and aggregation is independent of added figures", () => {
  for (const [id, expected] of Object.entries(baseline)) {
    const p = data.positions.find((p) => p.id === id)!;
    const score = calculateScore(
      p,
      data.milestones.find((m) => m.id === p.milestoneId),
      defaultScenarios(data),
    );
    if (!score) assert.equal(expected, null, id);
    else {
      const { explanation: _, ...numeric } = score;
      assert.deepEqual(numeric, expected, id);
    }
  }
  const original = {
    ...data,
    figures: data.figures.filter((f) => !added.includes(f.id)),
    positions: data.positions.filter((p) => !added.includes(p.figureId)),
  };
  assert.deepEqual(
    leaderboard(original, original.positions, DEFAULT_FILTERS),
    leaderboard(data, original.positions, DEFAULT_FILTERS),
  );
});

test("ancient scores use actual dates and exported geometry shares every coordinate and uncertainty endpoint", () => {
  const snapshot = exportSnapshot(
    data,
    DEFAULT_FILTERS,
    defaultScenarios(data),
  );
  const nagarjuna = snapshot.calculations.find(
    (c) => c.positionId === "nagarjuna-execution",
  )!;
  assert(nagarjuna.score!.midpoint > 1700);
  for (const c of snapshot.calculations.filter((c) => c.score)) {
    const s = c.score!;
    const base = positionCoordinates(
      s,
      DEFAULT_PERIOD,
      920,
      snapshot.geometry.leadLagPixelsPerYear,
      snapshot.axis,
    );
    if (c.placement && "displayOffsetY" in c.placement) {
      assert("baseY" in c.placement);
      assert.equal(c.placement.x, base.x);
      assert.equal(c.placement.baseY, base.y);
      assert.equal(c.placement.y, base.y + Number(c.placement.displayOffsetY));
    } else assert.deepEqual(c.placement, base);
    assert.equal(
      c.placement!.uncertaintyLeftX,
      axisX(snapshot.axis, s.writing.start),
    );
    assert.equal(
      c.placement!.uncertaintyRightX,
      axisX(snapshot.axis, s.writing.end),
    );
  }
});
