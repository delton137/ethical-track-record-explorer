import assert from "node:assert/strict";
import { data } from "../research/corpus";
import {
  calculateScore,
  defaultScenarios,
  IMPORTANCE_WIDTH,
} from "../lib/scoring";
for (const [name, items] of Object.entries(data))
  if (Array.isArray(items)) {
    assert.equal(
      new Set(items.map((x) => x.id)).size,
      items.length,
      `${name}: unique IDs`,
    );
  }
const ids = (items: { id: string }[]) => new Set(items.map((i) => i.id));
const people = ids(data.figures),
  domains = ids(data.domains),
  traditions = ids(data.traditions),
  sources = ids(data.sources),
  quotes = ids(data.quotations);
const validRange = (r: { start: number; end: number }) =>
  Number.isInteger(r.start) && Number.isInteger(r.end) && r.start <= r.end;
for (const f of data.figures) {
  assert(f.affiliations.length, `${f.id}: affiliation`);
  assert.equal(
    new Set(f.affiliations.map((a) => a.traditionId)).size,
    f.affiliations.length,
    `${f.id}: duplicate affiliations`,
  );
  if (f.primaryTraditionId)
    assert(
      f.affiliations.some(
        (a) => a.traditionId === f.primaryTraditionId && a.status === "core",
      ),
      `${f.id}: primary tradition must be a core affiliation`,
    );
  assert(IMPORTANCE_WIDTH[f.importance.level]);
  for (const a of f.affiliations) {
    assert(traditions.has(a.traditionId));
    assert(a.basis.length > 25);
    new URL(a.sourceUrl);
  }
  if (f.status === "included")
    assert(data.positions.some((p) => p.figureId === f.id));
}
for (const m of data.milestones) {
  assert(domains.has(m.domainId));
  assert(validRange(m.window));
  assert(m.sources.length || m.kind !== "historical");
}
for (const p of data.positions) {
  assert(people.has(p.figureId));
  assert(domains.has(p.domainId));
  assert(p.quotationIds.length);
  for (const q of p.quotationIds) assert(quotes.has(q));
  assert(validRange(p.composition) && validRange(p.publication));
  assert(p.dateBasis && p.counterevidence && p.matchRationale);
  if (p.milestoneId) {
    const m = data.milestones.find((m) => m.id === p.milestoneId);
    assert(m, `${p.id}: missing benchmark`);
    assert.equal(m.domainId, p.domainId);
  }
  if (p.revisionOf)
    assert(
      data.positions.some(
        (q) =>
          q.id === p.revisionOf &&
          q.figureId === p.figureId &&
          q.composition.start <= p.composition.start,
      ),
    );
}
const wordsByWork = new Map<string, number>();
const episodes = new Set<string>();
const repeatedPassages = new Set<string>();
for (const p of data.positions) {
  const episode = `${p.figureId}:${p.domainId}:${p.episodeId}`;
  assert(
    !episodes.has(episode),
    `${p.id}: duplicate episode; attach quotations to the existing record`,
  );
  episodes.add(episode);
  assert.equal(
    new Set(p.quotationIds).size,
    p.quotationIds.length,
    `${p.id}: duplicated quotation reference`,
  );
  for (const id of p.quotationIds) {
    const q = data.quotations.find((q) => q.id === id)!;
    const s = data.sources.find((s) => s.id === q.sourceId)!;
    const passage = `${p.figureId}:${p.domainId}:${s.title}:${q.locator}:${q.text}`;
    assert(
      !repeatedPassages.has(passage),
      `${p.id}: repeated primary passage cannot create another episode`,
    );
    repeatedPassages.add(passage);
  }
}
for (const q of data.quotations) {
  assert(sources.has(q.sourceId));
  assert(q.locator && q.context);
  const s = data.sources.find((s) => s.id === q.sourceId)!;
  const work = s.author + "|" + s.title;
  wordsByWork.set(
    work,
    (wordsByWork.get(work) ?? 0) +
      q.text.match(/\S+/g)!.filter((w) => /[\p{L}\p{N}]/u.test(w)).length,
  );
}
for (const [work, count] of wordsByWork)
  assert(
    count <= 25,
    `${work}: ${count} excerpt words exceeds per-work budget`,
  );
for (const s of data.sources) {
  new URL(s.url);
  if (s.datingSourceUrl) new URL(s.datingSourceUrl);
  if (s.workFirstPublication) assert(validRange(s.workFirstPublication));
  if (s.witnessPublication) assert(validRange(s.witnessPublication));
  if (s.workFirstPublication && s.witnessPublication)
    assert(s.workFirstPublication.start <= s.witnessPublication.start);
  assert(s.edition && s.originalLanguage && s.translation && s.checkedOn);
}
const scored = data.positions.filter((p) =>
  calculateScore(
    p,
    data.milestones.find((m) => m.id === p.milestoneId),
    defaultScenarios(data),
  ),
);
console.log(
  JSON.stringify(
    {
      figures: data.figures.filter((f) => f.status === "included").length,
      plottedFigures: new Set(scored.map((p) => p.figureId)).size,
      unmatchedOnlyFigures: data.figures
        .filter((f) => !scored.some((p) => p.figureId === f.id))
        .map((f) => f.name),
      candidates: data.figures.filter((f) => f.status === "candidate").length,
      traditions: data.traditions.length,
      positions: data.positions.length,
      quotations: data.quotations.length,
      sources: data.sources.length,
      scored: scored.length,
      unscored: data.positions.length - scored.length,
      qualificationCount: data.positions.filter(
        (p) => p.evidence === "qualified",
      ).length,
      checks:
        "Reference integrity, date ranges, provenance fields, revisions and excerpt budgets passed. Not a substitute for scholarly review.",
    },
    null,
    2,
  ),
);
