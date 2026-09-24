import type { Figure, Filters, Tradition } from "./types";

// Keep the author's established shade unless a different selected affiliation
// supplies the color. Contested-only authors stay neutral until opted in.
export function affiliationColor(
  figure: Figure,
  traditions: Tradition[],
  filters: Pick<Filters, "includeContested" | "traditionIds">,
): string {
  const eligible = figure.affiliations.filter(
    (a) => a.status === "core" || filters.includeContested,
  );
  const selected = eligible.filter((a) =>
    filters.traditionIds.includes(a.traditionId),
  );
  const candidates = selected.length ? selected : eligible;
  const affiliation =
    candidates.find((a) => a.traditionId === figure.primaryTraditionId) ??
    candidates.find((a) => a.status === "core") ??
    candidates[0];
  if (!affiliation || affiliation.traditionId === figure.primaryTraditionId)
    return figure.color;
  return (
    traditions.find((t) => t.id === affiliation.traditionId)?.color ??
    figure.color
  );
}
