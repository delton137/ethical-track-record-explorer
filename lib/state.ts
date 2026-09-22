import type { Filters, Scenarios } from "./types";

export const DEFAULT_FILTERS: Filters = {
  query: "",
  traditionIds: [],
  domainIds: [],
  period: { start: 1500, end: 2125 },
  publicOnly: false,
  evidence: "all",
  includeContested: false,
  sharedDomains: false,
  benchmark: "default",
};
export function parseState(search: string, defaults: Scenarios) {
  const p = new URLSearchParams(search);
  const number = (key: string, fallback: number, min = 1400, max = 2500) => {
    const v = p.get(key);
    if (v === null || v.trim() === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) && n >= min && n <= max
      ? Math.round(n)
      : fallback;
  };
  let start = number("from", DEFAULT_FILTERS.period.start),
    end = number("to", 2125);
  if (start > end) [start, end] = [end, start];
  const filters: Filters = {
    ...DEFAULT_FILTERS,
    query: p.get("q") ?? "",
    traditionIds: (p.get("traditions") ?? "").split(",").filter(Boolean),
    domainIds: (p.get("issues") ?? "").split(",").filter(Boolean),
    period: { start, end },
    publicOnly: p.get("public") === "1",
    evidence:
      p.get("evidence") === "checked"
        ? "checked"
        : p.get("evidence") === "qualified"
          ? "qualified"
          : "all",
    includeContested: p.get("contested") === "1",
    sharedDomains: p.get("shared") === "1",
    benchmark: p.get("benchmark") === "alternative" ? "alternative" : "default",
  };
  const scenarios = Object.fromEntries(
    Object.entries(defaults).map(([id, r]) => {
      const a = number(`${id}-from`, r.start),
        b = number(`${id}-to`, r.end);
      return [id, a <= b ? { start: a, end: b } : { ...r }];
    }),
  );
  return {
    filters,
    scenarios,
    selected: p.get("position"),
    view: p.get("view") === "table" ? ("table" as const) : ("chart" as const),
  };
}
export function serializeState(
  filters: Filters,
  scenarios: Scenarios,
  defaults: Scenarios,
  selected: string | null,
  view: "chart" | "table",
) {
  const p = new URLSearchParams();
  if (filters.query) p.set("q", filters.query);
  if (filters.traditionIds.length)
    p.set("traditions", [...filters.traditionIds].sort().join(","));
  if (filters.domainIds.length)
    p.set("issues", [...filters.domainIds].sort().join(","));
  if (filters.period.start !== DEFAULT_FILTERS.period.start)
    p.set("from", String(filters.period.start));
  if (filters.period.end !== 2125) p.set("to", String(filters.period.end));
  if (filters.publicOnly) p.set("public", "1");
  if (filters.evidence !== "all") p.set("evidence", filters.evidence);
  if (filters.includeContested) p.set("contested", "1");
  if (filters.sharedDomains) p.set("shared", "1");
  if (filters.benchmark === "alternative") p.set("benchmark", "alternative");
  if (view === "table") p.set("view", "table");
  p.set("position", selected ?? "none");
  for (const [id, r] of Object.entries(scenarios))
    if (r.start !== defaults[id]?.start || r.end !== defaults[id]?.end) {
      p.set(`${id}-from`, String(r.start));
      p.set(`${id}-to`, String(r.end));
    }
  return p.toString();
}
