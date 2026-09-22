import test from "node:test";
import type { Score } from "../lib/types";
import assert from "node:assert/strict";
import { data } from "../research/corpus";
import { calculateScore, defaultScenarios } from "../lib/scoring";
import { arcY, GEOMETRY, positionCoordinates } from "../lib/geometry";

test("new authors retain evidence limits rather than acquiring fabricated scores", () => {
  for (const id of [
    "bodhi-insects",
    "du-vair-animals",
    "anscombe-gay",
    "iqbal-inheritance",
    "locke-hereditary-slavery",
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
  assert(
    data.figures
      .find((f) => f.id === "nietzsche")!
      .affiliations.every((a) => a.status === "contested"),
  );
  assert.equal(
    data.positions.find((p) => p.id === "ambedkar-women")!.composition.start,
    1951,
  );
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
    assert.equal(point.y, arcY(Math.min(point.year, m.window.start)));
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
  assert.equal(calculateScore(salt, m, {})!.midpoint, 19);
  assert.equal(calculateScore(salt, m, {}, false, true)!.midpoint, 0);
  assert.equal(calculateScore(bentham, m, {})!.midpoint, 122);
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
