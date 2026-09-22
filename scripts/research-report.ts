import { writeFileSync } from "node:fs";
import { data } from "../research/corpus";
import { calculateScore, defaultScenarios } from "../lib/scoring";
const scored = data.positions.filter((p) =>
  calculateScore(
    p,
    data.milestones.find((m) => m.id === p.milestoneId),
    defaultScenarios(data),
  ),
);
const report = {
  version: data.version,
  figures: data.figures.length,
  plottedFigures: new Set(scored.map((p) => p.figureId)).size,
  unmatchedOnlyFigures: data.figures
    .filter((f) => !scored.some((p) => p.figureId === f.id))
    .map((f) => f.name),
  positions: data.positions.length,
  quotations: data.quotations.length,
  sources: data.sources.length,
  traditions: data.traditions.map((t) => ({
    id: t.id,
    coreFigures: data.figures.filter((f) =>
      f.affiliations.some((a) => a.traditionId === t.id && a.status === "core"),
    ).length,
  })),
  scope:
    "Recorded-excerpt review. Complete collected-works searches for slavery, women’s rights and other domains remain unfinished. Unknown is not endorsement.",
  focusAudit: data.figures.map((f) => ({
    figureId: f.id,
    name: f.name,
    review: f.researchNote,
  })),
};
writeFileSync("research/coverage.json", JSON.stringify(report, null, 2) + "\n");
