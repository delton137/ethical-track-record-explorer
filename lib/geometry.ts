import type { Score, YearRange } from "./types";

// Shared by SVG rendering and the downloadable reproducibility snapshot.
export const GEOMETRY = {
  canonicalWidth: 920,
  minimumWidth: 720,
  height: 640,
  leftMargin: 58,
  rightMargin: 42,
  arcStartYear: 1400,
  arcYearSpan: 725,
  arcBaseY: 518,
  arcRise: 320,
  offsetBudget: 220,
  minimumMagnitude: 380,
} as const;
export const arcY = (year: number) =>
  GEOMETRY.arcBaseY -
  GEOMETRY.arcRise * ((year - GEOMETRY.arcStartYear) / GEOMETRY.arcYearSpan);
export function leadLagFactor(scores: (Score | null)[]) {
  return (
    GEOMETRY.offsetBudget /
    Math.max(
      GEOMETRY.minimumMagnitude,
      ...scores.flatMap((s) => (s ? [Math.abs(s.midpoint)] : [])),
    )
  );
}
export function positionCoordinates(
  score: Score,
  period: YearRange,
  width: number,
  factor: number,
) {
  const year = (score.writing.start + score.writing.end) / 2;
  const end = Math.max(period.start + 1, period.end);
  const xFraction = (year - period.start) / (end - period.start);
  return {
    year,
    xFraction,
    x:
      GEOMETRY.leftMargin +
      xFraction * (width - GEOMETRY.leftMargin - GEOMETRY.rightMargin),
    y: arcY(year) - score.midpoint * factor,
    uncertaintyTopY: arcY(year) - score.max * factor,
    uncertaintyBottomY: arcY(year) - score.min * factor,
    inPeriod: year >= period.start && year <= end,
  };
}
