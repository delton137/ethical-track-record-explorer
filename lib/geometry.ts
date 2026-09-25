import type { ResearchData, Score, YearRange } from "./types";
import { DEFAULT_PERIOD } from "./dates";

// Shared by SVG rendering and the downloadable reproducibility snapshot.
export const GEOMETRY = {
  canonicalWidth: 920,
  minimumWidth: 720,
  height: 1060,
  leftMargin: 58,
  rightMargin: 42,
  arcStartYear: 1500,
  arcYearSpan: 600,
  laterSlopeDegrees: 25,
  arcEndY: 445,
  offsetBudget: 220,
  minimumMagnitude: 380,
  earlyYearCutoff: 1700,
  earlyYearScale: 0.25,
  earlyArcRise: 24,
  scriptureSpacing: 12,
  oppositionGap: 0,
  ancientEnd: 1500,
  ancientWidth: 160,
  intervalPadding: 25,
  minimumBreakYears: 200,
  breakWidth: 12,
} as const;
export const PROGRESS_PHASES = [
  {
    start: DEFAULT_PERIOD.start,
    end: 1700,
    rise: GEOMETRY.earlyArcRise,
    label: "Gentle rise from 800 BCE through 1700",
  },
  { start: 1700, end: 2100, label: "Steady later progress" },
] as const;
export type AxisSegment = YearRange & {
  x0: number;
  x1: number;
  kind: "time" | "break";
};
export type TimelineAxis = {
  period: YearRange;
  width: number;
  ancientEndX: number | null;
  segments: AxisSegment[];
  breaks: AxisSegment[];
  occupiedIntervals: YearRange[];
};
const ancientWidth = (period: YearRange, width: number) => {
  const available = width - GEOMETRY.leftMargin - GEOMETRY.rightMargin;
  return period.start >= 1500
    ? 0
    : period.end <= 1500
      ? available
      : Math.min(GEOMETRY.ancientWidth, available * 0.3);
};

// Both composition and attestation are protected, irrespective of active filters.
export function ancientOccupiedIntervals(data: ResearchData): YearRange[] {
  const ranges: YearRange[] = [];
  for (const figure of data.figures.filter((f) => f.status === "included")) {
    const positions = data.positions.filter((p) => p.figureId === figure.id);
    const dates = positions.flatMap((p) => [p.composition, p.publication]);
    // A Renaissance author born before 1500 also occupies the ancient section.
    if (
      !dates.some((r) => r.start < 1500) &&
      (figure.floruit?.start ?? figure.born ?? Infinity) >= 1500
    )
      continue;
    ranges.push(...dates);
    if (figure.floruit) ranges.push(figure.floruit);
    else if (figure.born !== undefined)
      ranges.push({
        start: figure.born,
        end: figure.died ?? Math.max(figure.born, ...dates.map((r) => r.end)),
      });
  }
  const padded = ranges
    .filter((r) => r.start < 1500)
    .map((r) => ({
      start: r.start - GEOMETRY.intervalPadding,
      end: Math.min(1500, r.end + GEOMETRY.intervalPadding),
    }))
    .sort((a, b) => a.start - b.start);
  const merged: YearRange[] = [];
  for (const range of padded) {
    const last = merged.at(-1);
    if (last && range.start <= last.end)
      last.end = Math.max(last.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

type Placement = ReturnType<typeof positionCoordinates>;

/** Stable vertical separation from the complete corpus, independent of search. */
export function spreadScripturePositions(
  data: ResearchData,
  placements: ReadonlyMap<string, Placement>,
  period: YearRange,
  width: number,
) {
  const scriptures = new Set(
    data.figures.filter((f) => f.kind === "scripture").map((f) => f.id),
  );
  const result = new Map(
    [...placements].map(([id, p]) => [
      id,
      { ...p, baseY: p.y, displayOffsetY: 0 },
    ]),
  );
  for (const figureId of scriptures) {
    const passages = data.positions
      .filter((p) => p.figureId === figureId && placements.get(p.id)?.inPeriod)
      .sort(
        (a, b) =>
          placements.get(a.id)!.year - placements.get(b.id)!.year ||
          a.id.localeCompare(b.id),
      );
    if (!passages.length) continue;
    const anchor =
      arcY(placements.get(passages[0].id)!.year, width, period) + 12;
    passages.forEach((p, index) => {
      const c = placements.get(p.id)!;
      const y = anchor + index * GEOMETRY.scriptureSpacing;
      const offset = y - c.y;
      result.set(p.id, {
        ...c,
        y,
        baseY: c.y,
        displayOffsetY: offset,
        uncertaintyTopY: c.uncertaintyTopY + offset,
        uncertaintyBottomY: c.uncertaintyBottomY + offset,
      });
    });
  }
  return result;
}

export function buildTimelineAxis(
  data: ResearchData | undefined,
  period: YearRange = DEFAULT_PERIOD,
  width: number = GEOMETRY.canonicalWidth,
): TimelineAxis {
  const { leftMargin: left, rightMargin } = GEOMETRY;
  const right = width - rightMargin;
  const earlyWidth = ancientWidth(period, width);
  const end = Math.max(period.start + 1, period.end);
  const occupiedIntervals = data
    ? ancientOccupiedIntervals(data)
    : [{ start: period.start, end: 1500 }];
  const segments: AxisSegment[] = [];
  if (earlyWidth) {
    const earlyEnd = Math.min(1500, end);
    const gaps: YearRange[] = [];
    let cursor = period.start;
    for (const r of occupiedIntervals) {
      if (r.end <= cursor || r.start >= earlyEnd) continue;
      if (r.start - cursor >= GEOMETRY.minimumBreakYears)
        gaps.push({ start: cursor, end: r.start });
      cursor = Math.max(cursor, r.end);
    }
    if (earlyEnd - cursor >= GEOMETRY.minimumBreakYears)
      gaps.push({ start: cursor, end: earlyEnd });
    const boundaries = [
      ...new Set([
        period.start,
        earlyEnd,
        ...gaps.flatMap((r) => [r.start, r.end]),
      ]),
    ].sort((a, b) => a - b);
    const pieces = boundaries.slice(1).map((end, i) => ({
      start: boundaries[i],
      end,
      kind: gaps.some((g) => boundaries[i] >= g.start && end <= g.end)
        ? ("break" as const)
        : ("time" as const),
    }));
    const times = pieces.filter((p) => p.kind === "time");
    const breakCount = pieces.length - times.length;
    const breakPixels = times.length
      ? Math.min(GEOMETRY.breakWidth, earlyWidth / (pieces.length * 2))
      : earlyWidth / Math.max(1, breakCount);
    const timePixels = earlyWidth - breakCount * breakPixels;
    const minimum = Math.min(18, timePixels / Math.max(1, times.length));
    const years = times.reduce((sum, p) => sum + p.end - p.start, 0);
    let x0 = left;
    for (const piece of pieces) {
      const pixels =
        piece.kind === "break"
          ? breakPixels
          : minimum +
            ((timePixels - minimum * times.length) *
              (piece.end - piece.start)) /
              years;
      segments.push({ ...piece, x0, x1: x0 + pixels });
      x0 += pixels;
    }
  }
  const modernStart = Math.max(1500, period.start);
  if (end > modernStart) {
    const boundaries = [
      modernStart,
      ...(modernStart < 1700 && end > 1700 ? [1700] : []),
      end,
    ];
    const denominator = displayYear(end) - displayYear(modernStart);
    const x = (year: number) =>
      left +
      earlyWidth +
      ((right - left - earlyWidth) *
        (displayYear(year) - displayYear(modernStart))) /
        denominator;
    for (let i = 1; i < boundaries.length; i++)
      segments.push({
        start: boundaries[i - 1],
        end: boundaries[i],
        x0: x(boundaries[i - 1]),
        x1: x(boundaries[i]),
        kind: "time",
      });
  }
  return {
    period,
    width,
    ancientEndX: earlyWidth ? left + earlyWidth : null,
    occupiedIntervals,
    segments,
    breaks: segments.filter((s) => s.kind === "break"),
  };
}
export function axisX(axis: TimelineAxis, year: number) {
  const segment =
    axis.segments.find((s) => year >= s.start && year <= s.end) ??
    (year < axis.period.start ? axis.segments[0] : axis.segments.at(-1))!;
  return (
    segment.x0 +
    ((segment.x1 - segment.x0) * (year - segment.start)) /
      (segment.end - segment.start)
  );
}
export function displayYear(year: number) {
  return year <= 1700 ? 1700 + (year - 1700) * GEOMETRY.earlyYearScale : year;
}
export function arcY(
  year: number,
  width: number = GEOMETRY.canonicalWidth,
  period: YearRange = DEFAULT_PERIOD,
) {
  const modernStart = Math.max(period.start, 1500);
  const modernEnd =
    period.end > 1500 ? Math.max(modernStart + 1, period.end) : 2100;
  const earlyWidth =
    period.end <= 1500 ? GEOMETRY.ancientWidth : ancientWidth(period, width);
  const pixelsPerYear =
    (width - GEOMETRY.leftMargin - GEOMETRY.rightMargin - earlyWidth) /
    (displayYear(modernEnd) - displayYear(modernStart));
  return (
    GEOMETRY.arcEndY +
    Math.tan((GEOMETRY.laterSlopeDegrees * Math.PI) / 180) *
      pixelsPerYear *
      (2100 - Math.max(1700, year)) +
    GEOMETRY.earlyArcRise *
      Math.min(1, Math.max(0, (1700 - year) / (1700 - DEFAULT_PERIOD.start)))
  );
}
export function referenceYears(start: number, end: number) {
  return [
    ...new Set([
      start,
      ...[DEFAULT_PERIOD.start, 1500, 1700].filter((y) => y > start && y < end),
      end,
    ]),
  ].sort((a, b) => a - b);
}
export function averageReferenceY(
  range: YearRange,
  width: number = GEOMETRY.canonicalWidth,
  period: YearRange = DEFAULT_PERIOD,
) {
  if (range.start === range.end) return arcY(range.start, width, period);
  const years = referenceYears(range.start, range.end);
  let area = 0;
  for (let i = 1; i < years.length; i++)
    area +=
      ((years[i] - years[i - 1]) *
        (arcY(years[i - 1], width, period) + arcY(years[i], width, period))) /
      2;
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
export function positionCoordinates(
  score: Score,
  period: YearRange,
  width: number,
  _factor: number,
  axis: TimelineAxis = buildTimelineAxis(undefined, period, width),
) {
  const year = (score.writing.start + score.writing.end) / 2;
  const x = axisX(axis, year);
  const referenceY = (year: number) => arcY(year, width, period);
  const oppositionY = referenceY(Math.min(year, score.benchmark.start));
  const laterSupport =
    score.stance === "supports" && score.writing.start >= score.benchmark.end;
  const supportY = laterSupport
    ? referenceY(score.benchmark.end)
    : averageReferenceY(score.benchmark, width, period);
  return {
    year,
    x,
    xFraction:
      (x - GEOMETRY.leftMargin) /
      (width - GEOMETRY.leftMargin - GEOMETRY.rightMargin),
    y: score.stance === "opposes" ? oppositionY : supportY,
    uncertaintyLeftX: axisX(axis, score.writing.start),
    uncertaintyRightX: axisX(axis, score.writing.end),
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
    inPeriod: year >= period.start && year <= period.end,
  };
}
