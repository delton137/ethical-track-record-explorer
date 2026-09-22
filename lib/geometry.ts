import type { Score, YearRange } from "./types";

// Shared by SVG rendering and the downloadable reproducibility snapshot.
export const GEOMETRY = {
  canonicalWidth: 920,
  minimumWidth: 720,
  height: 1060,
  leftMargin: 58,
  rightMargin: 42,
  arcStartYear: 1500,
  arcYearSpan: 600,
  arcBaseY: 445 + 2 + Math.tan((20 * Math.PI) / 180) * ((820 * 400) / 450),
  arcRise: 2 + Math.tan((20 * Math.PI) / 180) * ((820 * 400) / 450),
  laterSlopeDegrees: 20,
  arcEndY: 445,
  offsetBudget: 220,
  minimumMagnitude: 380,
  earlyYearCutoff: 1700,
  earlyYearScale: 0.25,
  earlyArcRise: 2,
  oppositionGap: 0,
} as const;
// A tiny early rise remains gentle even on the compressed x-axis.
// Later progress rises at 20 degrees; the future endpoint anchors the layout.
export const PROGRESS_PHASES = [
  {
    start: GEOMETRY.arcStartYear,
    end: GEOMETRY.earlyYearCutoff,
    rise: GEOMETRY.earlyArcRise,
    label: "Very gentle early progress",
  },
  {
    start: GEOMETRY.earlyYearCutoff,
    end: GEOMETRY.arcStartYear + GEOMETRY.arcYearSpan,
    rise: GEOMETRY.arcRise - GEOMETRY.earlyArcRise,
    label: "Steady later progress",
  },
] as const;
export const arcY = (
  year: number,
  width: number = GEOMETRY.canonicalWidth,
  period: YearRange = { start: 1500, end: 2100 },
) => {
  const pixelsPerYear =
    (width - GEOMETRY.leftMargin - GEOMETRY.rightMargin) /
    (displayYear(Math.max(period.start + 1, period.end)) -
      displayYear(period.start));
  const laterSlope =
    Math.tan((GEOMETRY.laterSlopeDegrees * Math.PI) / 180) * pixelsPerYear;
  const cutoffY =
    GEOMETRY.arcEndY +
    laterSlope *
      (GEOMETRY.arcStartYear + GEOMETRY.arcYearSpan - GEOMETRY.earlyYearCutoff);
  if (year <= GEOMETRY.earlyYearCutoff) {
    return (
      cutoffY +
      (GEOMETRY.earlyArcRise * (GEOMETRY.earlyYearCutoff - year)) /
        (GEOMETRY.earlyYearCutoff - GEOMETRY.arcStartYear)
    );
  }
  return cutoffY - laterSlope * (year - GEOMETRY.earlyYearCutoff);
};

export function referenceYears(start: number, end: number) {
  return [
    ...new Set([
      start,
      ...[
        GEOMETRY.earlyYearCutoff,
        ...PROGRESS_PHASES.flatMap((p) => [p.start, p.end]),
      ].filter((year) => year > start && year < end),
      end,
    ]),
  ].sort((a, b) => a - b);
}
export function averageReferenceY(
  range: YearRange,
  width: number = GEOMETRY.canonicalWidth,
  period: YearRange = { start: 1500, end: 2100 },
) {
  const referenceY = (year: number) => arcY(year, width, period);
  if (range.start === range.end) return referenceY(range.start);
  const years = referenceYears(range.start, range.end);
  let area = 0;
  for (let i = 1; i < years.length; i++) {
    area +=
      ((years[i] - years[i - 1]) *
        (referenceY(years[i - 1]) + referenceY(years[i]))) /
      2;
  }
  return area / (range.end - range.start);
}

export function leadLagFactor(scores: (Score | null)[]) {
  return (
    GEOMETRY.offsetBudget /
    Math.max(
      GEOMETRY.minimumMagnitude,
      ...scores.flatMap((s) => (s ? [Math.abs(s.midpoint)] : [])),
    )
  );
}
export function displayYear(year: number) {
  return year <= GEOMETRY.earlyYearCutoff
    ? GEOMETRY.earlyYearCutoff +
        (year - GEOMETRY.earlyYearCutoff) * GEOMETRY.earlyYearScale
    : year;
}

export function positionCoordinates(
  score: Score,
  period: YearRange,
  width: number,
  factor: number,
) {
  const year = (score.writing.start + score.writing.end) / 2;
  const end = Math.max(period.start + 1, period.end);
  const xFraction =
    (displayYear(year) - displayYear(period.start)) /
    (displayYear(end) - displayYear(period.start));
  const referenceY = (year: number) => arcY(year, width, period);
  const oppositionY = referenceY(
    score.oppositionAnchorYear ?? score.benchmark.start,
  );
  const laterSupport =
    score.stance === "supports" && score.writing.start >= score.benchmark.end;
  const supportY = laterSupport
    ? referenceY(score.benchmark.end)
    : averageReferenceY(score.benchmark, width, period);
  return {
    year,
    xFraction,
    x:
      GEOMETRY.leftMargin +
      xFraction * (width - GEOMETRY.leftMargin - GEOMETRY.rightMargin),
    y: score.stance === "opposes" ? oppositionY : supportY,
    uncertaintyTopY:
      score.stance === "opposes"
        ? oppositionY
        : referenceY(score.benchmark.end),
    uncertaintyBottomY:
      score.stance === "opposes"
        ? oppositionY
        : laterSupport
          ? supportY
          : referenceY(score.benchmark.start),
    inPeriod: year >= period.start && year <= end,
  };
}
