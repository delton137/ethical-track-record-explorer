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
  buildTimelineAxis,
  PROGRESS_PHASES,
  leadLagFactor,
  positionCoordinates,
  spreadScripturePositions,
} from "./geometry";

import { formatYears, DATE_CONVENTION } from "./dates";
export { formatYears } from "./dates";
export const ALGORITHM_VERSION = "2.0.0";
export const IMPORTANCE_WIDTH = {
  foundational: 3,
  central: 2.25,
  established: 1.5,
} as const;
export const midpoint = (r: YearRange) => (r.start + r.end) / 2;
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
  const scoreAt = (gap: number) =>
    p.stance === "supports" ? Math.max(gap, 0) : gap > 0 ? -0.5 * gap : gap;
  const endpoints = [scoreAt(difference.min), scoreAt(difference.max)];
  const min = Math.min(...endpoints);
  // Opposition peaks at zero when writing and reform intervals overlap.
  const max =
    p.stance === "opposes" && difference.min <= 0 && difference.max >= 0
      ? 0
      : Math.max(...endpoints);
  return {
    stance: p.stance,
    min,
    max,
    midpoint: (min + max) / 2,
    provisional: milestone.kind !== "historical",
    benchmark,
    writing,
    explanation: `${p.stance === "supports" ? "Support: max(benchmark − writing year, 0)" : "Ethical foresight opposition: −0.5 × years before reform; −1 × years after reform; zero at reform"}. Writing ${formatYears(writing)}; benchmark ${formatYears(benchmark)}. Range ${min} to ${max} weighted years. Lead/lag uses the interval midpoint; supportive dots written after the full reform interval use its endpoint height; earlier support uses the average reference height; opposition before reform sits on the reference line at its writing midpoint; at or after reform starts it stays at the reference height of the selected reform-start year. Chart placement follows stance and dates; ethical foresight determines numerical scores.`,
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
export function isPostdiction(
  position: WrittenPosition,
  milestone: Milestone | undefined,
  filters: Filters,
  scenarios: Scenarios = {},
): boolean {
  if (position.stance !== "supports" || !milestone) return false;
  const writing = filters.publicOnly
    ? position.publication
    : position.composition;
  return (
    midpoint(writing) >
    effectiveBenchmark(
      milestone,
      scenarios,
      filters.benchmark === "alternative",
    ).end
  );
}

export function filterPositions(
  data: ResearchData,
  filters: Filters,
  scenarios: Scenarios = defaultScenarios(data),
): WrittenPosition[] {
  const figures = new Map(data.figures.map((f) => [f.id, f]));
  const query = filters.query.trim().toLocaleLowerCase();
  return data.positions.filter((p) => {
    const f = figures.get(p.figureId);
    if (!f || !figureQualifies(f, filters)) return false;
    const date = filters.publicOnly ? p.publication : p.composition;
    const milestone = data.milestones.find((m) => m.id === p.milestoneId);
    if (
      !filters.showPostdictions &&
      isPostdiction(p, milestone, filters, scenarios)
    )
      return false;
    return (
      (!filters.publicOnly || p.visibility === "public") &&
      (filters.evidence === "all" || p.evidence === filters.evidence) &&
      (!filters.domainIds.length || filters.domainIds.includes(p.domainId)) &&
      date.end >= filters.period.start &&
      date.start <= filters.period.end &&
      (!query ||
        `${f.name} ${f.aliases?.join(" ") ?? ""} ${p.title} ${p.summary}`
          .toLocaleLowerCase()
          .includes(query))
    );
  });
}
export function traditionCounts(
  data: ResearchData,
  filters: Filters,
  scenarios: Scenarios = defaultScenarios(data),
) {
  return Object.fromEntries(
    data.traditions.map((t) => [
      t.id,
      new Set(
        filterPositions(
          data,
          { ...filters, traditionIds: [t.id] },
          scenarios,
        ).map((p) => p.figureId),
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
      positions
        // Exclude before deduplication and averaging: postdictions must not
        // dilute a mean, create coverage, or replace an earlier episode.
        .filter((p) => {
          const milestone = milestoneMap.get(p.milestoneId ?? "");
          return (
            milestone?.kind !== "historical" ||
            !isPostdiction(p, milestone, filters)
          );
        })
        .map((p) => [`${p.figureId}:${p.domainId}:${p.episodeId}`, p]),
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
export function comparisons(data: ResearchData, filters: Filters): Ranking[] {
  // Chart visibility and editable future scenarios must not change comparisons,
  // including their coverage counts. Historical postdictions are removed inside
  // leaderboard even when a caller supplies all records directly.
  const positions = filterPositions(data, {
    ...filters,
    showPostdictions: true,
  });
  return leaderboard(data, positions, filters);
}

export function exportSnapshot(
  data: ResearchData,
  filters: Filters,
  scenarios: Scenarios,
) {
  const positions = filterPositions(data, filters, scenarios);
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
  const axis = buildTimelineAxis(data, filters.period, GEOMETRY.canonicalWidth);
  const rawPlacements = new Map(
    data.positions.flatMap((p) => {
      const score = scores.get(p.id);
      const placement = score
        ? positionCoordinates(
            score,
            filters.period,
            GEOMETRY.canonicalWidth,
            factor,
            axis,
          )
        : null;
      return placement ? [[p.id, placement] as const] : [];
    }),
  );
  const spread = spreadScripturePositions(
    data,
    rawPlacements,
    filters.period,
    GEOMETRY.canonicalWidth,
  );
  return {
    algorithmVersion: ALGORITHM_VERSION,
    exportedAt: new Date().toISOString(),
    dataVersion: data.version,
    dateConvention: DATE_CONVENTION,
    axis,
    coordinateRule:
      "Actual astronomical years determine scores, filtering and rankings. Display x linearly interpolates within the exported axis.segments. The Ancient section reserves 160 pixels in a mixed period; full-corpus lifetimes/floruit and both date ranges, padded 25 years, protect occupied intervals. Empty gaps of at least 200 years become marked breaks. Filters never recompute occupied intervals. The reference line rises by 24 display pixels from 800 BCE through 1700, then rises at 25 degrees using the modern display scale, anchored at y=445 in 2100. Support after the benchmark uses its end height; earlier support uses the time-weighted mean benchmark height. Opposition uses referenceY(min(writing midpoint, benchmark.start)). Writing uncertainty endpoints use this same x-axis. Coordinates use canonicalWidth; rebuild the shared axis for other widths. Only interval-matched scored positions are plotted. Each scripture forms a compact group with 12-pixel vertical spacing, anchored 12 pixels below the reference at its earliest plotted date; hover labels are spaced independently. Exported baseY and displayOffsetY distinguish score geometry from readability offsets; x dates and numerical scores never change. All unscored records and out-of-period midpoints are table-only. Connections group records by figure, including scriptural texts, without asserting one author or doctrinal evolution.",
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
        placement:
          data.figures.find((f) => f.id === p.figureId)?.kind === "scripture"
            ? (spread.get(p.id) ?? null)
            : (rawPlacements.get(p.id) ?? null),
      };
    }),
    historicalLeaderboard: comparisons(data, filters),
    scoringRule:
      "Ethical foresight: support = max(benchmark − writing year, 0); opposition = −0.5 × years before reform or −1 × years after reform. Uncertainty ranges include zero when writing and reform intervals overlap. Units are weighted years.",
    comparisonRule:
      "Historical episodes only; supportive writings with date midpoint strictly after the selected benchmark end are always excluded before deduplication, averaging, coverage and eligibility. Show postdictions affects display only. Average episodes within figure/domain, then people with fractional affiliation weights, then covered domains equally.",
  };
}
