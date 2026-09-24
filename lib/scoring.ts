import type {
  Filters,
  Figure,
  Milestone,
  ResearchData,
  Scenarios,
  Score,
  WrittenPosition,
  YearRange,
} from "./types";
import {
  GEOMETRY,
  PROGRESS_PHASES,
  leadLagFactor,
  positionCoordinates,
} from "./geometry";

export const ALGORITHM_VERSION = "1.2.0";
export const IMPORTANCE_WIDTH = {
  foundational: 3,
  central: 2.25,
  established: 1.5,
} as const;
export const midpoint = (r: YearRange) => (r.start + r.end) / 2;
export const formatYears = (r: YearRange) =>
  r.start === r.end ? String(r.start) : `${r.start}–${r.end}`;
export function defaultScenarios(data: ResearchData): Scenarios {
  return Object.fromEntries(
    data.milestones
      .filter((m) => m.kind !== "historical")
      .map((m) => [m.id, { ...m.window }]),
  );
}
export function effectiveBenchmark(
  m: Milestone,
  scenarios: Scenarios,
  alternative = false,
) {
  if (m.kind !== "historical") return scenarios[m.id] ?? m.window;
  return alternative && m.alternatives?.length
    ? m.alternatives[0].window
    : m.window;
}
export function calculateScore(
  p: WrittenPosition,
  milestone: Milestone | undefined,
  scenarios: Scenarios,
  publicOnly = false,
  alternative = false,
): Score | null {
  if (
    !milestone ||
    p.stance === "ambiguous" ||
    (publicOnly && p.visibility === "private")
  )
    return null;
  const writing = publicOnly ? p.publication : p.composition;
  const benchmark = effectiveBenchmark(milestone, scenarios, alternative);
  const difference = {
    min: benchmark.start - writing.end,
    max: benchmark.end - writing.start,
  };
  const clamp =
    p.stance === "supports"
      ? (n: number) => Math.max(n, 0)
      : (n: number) => Math.min(n, 0);
  const min = clamp(difference.min),
    max = clamp(difference.max);
  return {
    stance: p.stance,
    min,
    max,
    midpoint: (min + max) / 2,
    provisional: milestone.kind !== "historical",
    benchmark,
    writing,
    explanation: `${p.stance === "supports" ? "Support: max" : "Opposition: min"}(benchmark − writing year, 0). Writing ${formatYears(writing)}; benchmark ${formatYears(benchmark)}. Range ${min} to ${max} years. Lead/lag uses the interval midpoint; supportive dots written after the full reform interval use its endpoint height; earlier support uses the average reference height; opposition before reform sits on the reference line at its writing midpoint; at or after reform starts it stays at the reference height of the selected reform-start year. Numerical scores are unchanged.`,
  };
}
export function figureQualifies(f: Figure, filters: Filters) {
  return (
    f.status === "included" &&
    (!filters.traditionIds.length ||
      f.affiliations.some(
        (a) =>
          filters.traditionIds.includes(a.traditionId) &&
          (a.status === "core" || filters.includeContested),
      ))
  );
}
export function filterPositions(
  data: ResearchData,
  filters: Filters,
): WrittenPosition[] {
  const figures = new Map(data.figures.map((f) => [f.id, f]));
  const query = filters.query.trim().toLocaleLowerCase();
  return data.positions.filter((p) => {
    const f = figures.get(p.figureId);
    if (!f || !figureQualifies(f, filters)) return false;
    const date = filters.publicOnly ? p.publication : p.composition;
    return (
      (!filters.publicOnly || p.visibility === "public") &&
      (filters.evidence === "all" || p.evidence === filters.evidence) &&
      (!filters.domainIds.length || filters.domainIds.includes(p.domainId)) &&
      date.end >= filters.period.start &&
      date.start <= filters.period.end &&
      (!query ||
        `${f.name} ${p.title} ${p.summary}`.toLocaleLowerCase().includes(query))
    );
  });
}
export function traditionCounts(data: ResearchData, filters: Filters) {
  return Object.fromEntries(
    data.traditions.map((t) => [
      t.id,
      new Set(
        filterPositions(data, { ...filters, traditionIds: [t.id] }).map(
          (p) => p.figureId,
        ),
      ).size,
    ]),
  );
}
export type Ranking = {
  traditionId: string;
  min: number;
  max: number;
  midpoint: number;
  figureCount: number;
  domainCount: number;
  positionCount: number;
  unscoredCount: number;
  eligible: boolean;
  domains: string[];
  rank: number | null;
};
export function leaderboard(
  data: ResearchData,
  positions: WrittenPosition[],
  filters: Filters,
): Ranking[] {
  const milestoneMap = new Map(data.milestones.map((m) => [m.id, m]));
  const figures = new Map(data.figures.map((f) => [f.id, f]));
  // One record per substantive episode, regardless of duplicate quotation/record count.
  const episodes = [
    ...new Map(
      positions.map((p) => [`${p.figureId}:${p.domainId}:${p.episodeId}`, p]),
    ).values(),
  ];
  const histories = episodes.flatMap((p) => {
    const m = milestoneMap.get(p.milestoneId ?? "");
    if (!m || m.kind !== "historical") return [];
    const s = calculateScore(
      p,
      m,
      {},
      filters.publicOnly,
      filters.benchmark === "alternative",
    );
    return s ? [{ p, s }] : [];
  });
  const chosen = data.traditions.filter(
    (t) => !filters.traditionIds.length || filters.traditionIds.includes(t.id),
  );
  const available = new Map(
    chosen.map((t) => [
      t.id,
      new Set(
        histories
          .filter(({ p }) =>
            figures
              .get(p.figureId)!
              .affiliations.some(
                (a) =>
                  a.traditionId === t.id &&
                  (a.status === "core" || filters.includeContested),
              ),
          )
          .map(({ p }) => p.domainId),
      ),
    ]),
  );
  const shared = new Set(
    data.domains
      .filter((d) => chosen.every((t) => available.get(t.id)?.has(d.id)))
      .map((d) => d.id),
  );
  const rows = chosen.map((t) => {
    const cells = new Map<
      string,
      {
        min: number;
        max: number;
        n: number;
        weight: number;
        figureId: string;
        core: boolean;
        domain: string;
      }
    >();
    let positionCount = 0;
    for (const { p, s } of histories) {
      if (filters.sharedDomains && !shared.has(p.domainId)) continue;
      const f = figures.get(p.figureId)!;
      const affiliations = f.affiliations.filter(
        (a) => a.status === "core" || filters.includeContested,
      );
      const affiliation = affiliations.find((a) => a.traditionId === t.id);
      if (!affiliation) continue;
      const key = `${f.id}:${p.domainId}`;
      const c = cells.get(key) ?? {
        min: 0,
        max: 0,
        n: 0,
        weight: 1 / affiliations.length,
        figureId: f.id,
        core: affiliation.status === "core",
        domain: p.domainId,
      };
      c.min += s.min;
      c.max += s.max;
      c.n++;
      cells.set(key, c);
      positionCount++;
    }
    const domainCells = new Map<
      string,
      { min: number; max: number; weight: number }
    >();
    const coreFigures = new Set<string>();
    for (const c of cells.values()) {
      if (c.core) coreFigures.add(c.figureId);
      const d = domainCells.get(c.domain) ?? { min: 0, max: 0, weight: 0 };
      d.min += (c.min / c.n) * c.weight;
      d.max += (c.max / c.n) * c.weight;
      d.weight += c.weight;
      domainCells.set(c.domain, d);
    }
    const domainCount = domainCells.size;
    const values = [...domainCells.values()];
    const min = domainCount
      ? values.reduce((a, d) => a + d.min / d.weight, 0) / domainCount
      : 0;
    const max = domainCount
      ? values.reduce((a, d) => a + d.max / d.weight, 0) / domainCount
      : 0;
    const unscoredCount = episodes.filter((p) => {
      const f = figures.get(p.figureId)!;
      return (
        f.affiliations.some(
          (a) =>
            a.traditionId === t.id &&
            (a.status === "core" || filters.includeContested),
        ) && !histories.some((h) => h.p.id === p.id)
      );
    }).length;
    return {
      traditionId: t.id,
      min,
      max,
      midpoint: (min + max) / 2,
      figureCount: coreFigures.size,
      domainCount,
      positionCount,
      unscoredCount,
      eligible: coreFigures.size >= 3 && domainCount >= 3,
      domains: [...domainCells.keys()],
      rank: null as number | null,
    };
  });
  rows.sort(
    (a, b) =>
      Number(b.eligible) - Number(a.eligible) ||
      b.midpoint - a.midpoint ||
      a.traditionId.localeCompare(b.traditionId),
  );
  let rank = 0;
  for (const row of rows) if (row.eligible) row.rank = ++rank;
  return rows;
}
export function exportSnapshot(
  data: ResearchData,
  filters: Filters,
  scenarios: Scenarios,
) {
  const positions = filterPositions(data, filters);
  const scores = new Map(
    data.positions.map((p) => [
      p.id,
      calculateScore(
        p,
        data.milestones.find((m) => m.id === p.milestoneId),
        scenarios,
        filters.publicOnly,
        filters.benchmark === "alternative",
      ),
    ]),
  );
  const factor = leadLagFactor([...scores.values()]);
  return {
    algorithmVersion: ALGORITHM_VERSION,
    exportedAt: new Date().toISOString(),
    dataVersion: data.version,
    coordinateRule:
      "x=leftMargin+xFraction×(canvasWidth−leftMargin−rightMargin); xFraction=(displayYear(writingYear)−displayYear(from))/(displayYear(to)−displayYear(from)); displayYear(y)=earlyYearCutoff+(y−earlyYearCutoff)×earlyYearScale before earlyYearCutoff, otherwise y; referenceY anchors year 2100 at arcEndY. After 1700 it rises by tan(laterSlopeDegrees) times the horizontal pixel distance, using the current canvas width and displayed year range; before 1700 it rises only earlyArcRise over 1500–1700. If support writing.start >= benchmark.end, support y=referenceY(benchmark.end) and its whiskers collapse; otherwise support y is the time-weighted mean referenceY across the benchmark interval. Opposition y=referenceY(min(writing midpoint, benchmark.start)): before reform it sits on the line at its writing midpoint; at or after reform starts it remains at the reform-start height, with no pixel offset. Its vertical whiskers collapse to that position; writing-date uncertainty uses the horizontal interval. This rule applies to every issue and selected benchmark. The canonical progressPhases are included in geometry. Coordinates below use canonicalWidth; recalculate referenceY for other canvas widths. Unscored evidence is table-only. Out-of-period midpoints are not plotted.",
    geometry: {
      ...GEOMETRY,
      progressPhases: PROGRESS_PHASES,
      leadLagPixelsPerYear: factor,
    },
    filters,
    scenarios,
    data,
    calculations: positions.map((p) => {
      const score = scores.get(p.id)!;
      return {
        positionId: p.id,
        score,
        placement: score
          ? positionCoordinates(
              score,
              filters.period,
              GEOMETRY.canonicalWidth,
              factor,
            )
          : null,
      };
    }),
    historicalLeaderboard: leaderboard(data, positions, filters),
  };
}
