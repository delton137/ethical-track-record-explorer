import test from "node:test";
import type { Score } from "../lib/types";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import { calculateScore, defaultScenarios } from "../lib/scoring";
import { arcY, GEOMETRY, positionCoordinates } from "../lib/geometry";

test("racial equality uses modern protections and retains the US-only alternative", () => {
  const m = data.milestones.find((m) => m.id === "racial-equality")!;
  assert.deepEqual(m.window, { start: 1949, end: 1996 });
  assert.deepEqual(
    m
      .reforms!.filter((r) => r.jurisdiction === "United States")
      .map((r) => r.year),
    [1964, 1965],
  );
  assert.equal(new Set(m.reforms!.map((r) => r.jurisdiction)).size, 7);
  assert.equal(Math.min(...m.reforms!.map((r) => r.year)), m.window.start);
  assert.equal(Math.max(...m.reforms!.map((r) => r.year)), m.window.end);
  const king = data.positions.find((p) => p.id === "king-racial")!;
  const score = calculateScore(king, m, {})!;
  assert.deepEqual([score.min, score.max], [0, 33]);
  const alternative = calculateScore(king, m, {}, false, true)!;
  assert.deepEqual([alternative.min, alternative.max], [0, 2]);
});

test("capital punishment counts only all-crimes abolition in the selected countries", () => {
  const m = data.milestones.find((m) => m.id === "execution-abolition")!;
  assert.deepEqual(m.window, { start: 1949, end: 1998 });
  assert.deepEqual(
    m.reforms!.map((r) => [r.jurisdiction, r.year]),
    [
      ["West Germany", 1949],
      ["France", 1981],
      ["UK", 1998],
      ["Canada", 1998],
    ],
  );
  const beccaria = data.positions.find((p) => p.id === "beccaria-execution")!;
  const score = calculateScore(beccaria, m, {})!;
  assert.deepEqual([score.min, score.max], [185, 234]);
});

test("new authors retain evidence limits rather than acquiring fabricated scores", () => {
  for (const id of [
    "bodhi-insects",
    "du-vair-animals",
    "anscombe-gay",
    "iqbal-inheritance",
    "locke-hereditary-slavery",
    "seneca-slavery",
    "epictetus-slavery",
  ]) {
    const p = data.positions.find((p) => p.id === id)!;
    assert(p);
    assert.equal(p.milestoneId, undefined);
    assert.equal(
      calculateScore(
        p,
        data.milestones.find((m) => m.id === p.milestoneId),
        defaultScenarios(data),
      ),
      null,
    );
  }
  assert.equal(
    data.positions.find((p) => p.id === "ambedkar-women")!.composition.start,
    1951,
  );
});

test("Sidgwick expansion preserves mixed positions and the inspected edition date", () => {
  const positions = data.positions.filter((p) => p.figureId === "sidgwick");
  assert.equal(positions.length, 5);
  assert.deepEqual(
    positions
      .filter((p) => p.stance === "opposes")
      .map((p) => p.domainId)
      .sort(),
    ["colonial", "racial"],
  );
  for (const p of positions) {
    assert.deepEqual(p.composition, { start: 1897, end: 1897 });
    assert.deepEqual(p.publication, p.composition);
    const quote = data.quotations.find((q) => q.id === p.quotationIds[0])!;
    const source = data.sources.find((s) => s.id === quote.sourceId)!;
    assert.equal(source.workFirstPublication!.start, 1891);
    assert.equal(source.witnessPublication!.start, 1897);
    assert.equal(source.verification, "primary-pdf");
  }
});

test("ancient Stoic evidence separates authorship, reported teachings and benchmark equivalence", () => {
  const execution = data.positions.find((p) => p.id === "seneca-execution")!;
  assert.deepEqual(execution.composition, { start: 55, end: 56 });
  assert.equal(execution.stance, "opposes");
  assert.equal(
    calculateScore(
      execution,
      data.milestones.find((m) => m.id === execution.milestoneId),
      defaultScenarios(data),
    )!.midpoint,
    -959,
  );
  const teaching = data.positions.find((p) => p.id === "epictetus-slavery")!;
  assert.equal(teaching.attribution, "reported-teaching");
  assert.deepEqual(teaching.textualAttestation, teaching.publication);
  assert(teaching.publication.end > teaching.composition.end);
  assert.match(teaching.attributionNote!, /Arrian/);
  assert(data.figures.find((f) => f.id === "epictetus")!.floruit);
});

test("Bentham suffrage preserves posthumous manuscript dates and political deferral", () => {
  const p = data.positions.find((p) => p.id === "bentham-suffrage")!;
  assert.equal(p.visibility, "private");
  assert(
    p.publication.start > data.figures.find((f) => f.id === "bentham")!.died!,
  );
  assert.match(p.counterevidence, /defers/);
  assert.equal(p.evidence, "qualified");
});

test("opposition dots use the earlier of writing date and reform start", () => {
  for (const id of [
    "nietzsche-women",
    "nietzsche-slavery",
    "rousseau-women",
    "fichte-suffrage",
    "rida-slavery",
  ]) {
    const p = data.positions.find((p) => p.id === id)!;
    const m = data.milestones.find((m) => m.id === p.milestoneId)!;
    const score = calculateScore(p, m, defaultScenarios(data))!;
    const point = positionCoordinates(
      score,
      { start: 1500, end: 2100 },
      920,
      1,
    );
    assert.equal(
      point.y,
      arcY(Math.min(point.year, m.window.start), 920, {
        start: 1500,
        end: 2100,
      }),
    );
  }
});

test("composition is not silently placed after death in new dossiers", () => {
  for (const p of data.positions) {
    const f = data.figures.find((f) => f.id === p.figureId)!;
    if (f.died) assert(p.composition.start <= f.died, p.id);
  }
});

test("opposition follows the line before reform and holds its start height afterward across widths and benchmarks", () => {
  let reviewed = 0;
  for (const p of data.positions.filter((p) => p.stance === "opposes")) {
    const m = data.milestones.find((m) => m.id === p.milestoneId);
    if (!m) continue;
    reviewed++;
    for (const alternative of [false, true]) {
      const s: Score = calculateScore(
        p,
        m,
        defaultScenarios(data),
        false,
        alternative,
      )!;
      const expectedYear = Math.min(
        (s.writing.start + s.writing.end) / 2,
        s.benchmark.start,
      );
      for (const width of [720, 920, 1440]) {
        for (const period of [
          { start: 1500, end: 2100 },
          { start: 1750, end: 2050 },
        ]) {
          const point = positionCoordinates(s, period, width, 1);
          assert.equal(point.y, arcY(expectedYear, width, period), p.id);
          assert.equal(point.uncertaintyTopY, point.y, p.id);
          assert.equal(point.uncertaintyBottomY, point.y, p.id);
        }
      }
    }
  }
  assert(reviewed > 10);
});

test("earlier Salt attestation and narrower animal benchmark change anticipation", () => {
  const salt = data.positions.find((p) => p.id === "salt-animals")!;
  const bentham = data.positions.find((p) => p.id === "bentham-animals")!;
  const m = data.milestones.find((m) => m.id === "animal-protection")!;
  assert.equal(calculateScore(salt, m, {})!.midpoint, 46.5);
  assert.equal(calculateScore(salt, m, {}, false, true)!.midpoint, 0);
  assert.equal(calculateScore(bentham, m, {})!.midpoint, 149.5);
  assert.equal(calculateScore(bentham, m, {}, false, true)!.midpoint, 33);
  const q = data.quotations.find((q) => q.id === salt.quotationIds[0])!;
  const source = data.sources.find((s) => s.id === q.sourceId)!;
  assert.equal(source.workFirstPublication!.start, 1892);
  assert.equal(source.witnessPublication!.start, 1922);
  assert(source.datingSourceUrl);
});

test("original publication metadata does not backdate uncollated revised passages", () => {
  for (const [id, original, witness] of [
    ["rawls-religion", 1971, 1999],
    ["becker-women", 1998, 2017],
  ] as const) {
    const p = data.positions.find((p) => p.id === id)!;
    const q = data.quotations.find((q) => q.id === p.quotationIds[0])!;
    const source = data.sources.find((s) => s.id === q.sourceId)!;
    assert.equal(source.workFirstPublication!.start, original);
    assert.equal(source.witnessPublication!.start, witness);
    const score = calculateScore(
      p,
      data.milestones.find((m) => m.id === p.milestoneId),
      {},
      true,
    )!;
    assert.equal(score.writing.start, witness);
  }
});
