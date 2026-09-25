import type { Figure, YearRange } from "./types";

// Astronomical numbering keeps subtraction correct across the BCE/CE boundary.
export const DATE_CONVENTION =
  "Astronomical integer years: 1 = 1 CE, 0 = 1 BCE, -399 = 400 BCE. Displayed historical dates have no year zero. Date intervals express uncertainty; inspected edition dates are separate from composition and attestation.";
export const DEFAULT_PERIOD: YearRange = { start: -799, end: 2100 };
export const MIN_TIMELINE_YEAR = -9999;
export const MAX_TIMELINE_YEAR = 2500;
export const bce = (year: number) => 1 - year;
export const formatYear = (year: number): string =>
  year <= 0 ? `${1 - year} BCE` : year < 1500 ? `${year} CE` : String(year);
export function formatYears(range: YearRange): string {
  const { start, end } = range;
  if (start === end) return formatYear(start);
  if (end <= 0) return `${1 - start}–${1 - end} BCE`;
  if (start <= 0) return `${formatYear(start)}–${end} CE`;
  return `${start}–${end}${end < 1500 ? " CE" : ""}`;
}
export function formatLifeDates(figure: Figure): string {
  if (figure.kind === "scripture" && figure.compositionPeriod)
    return `Selected passages c. ${formatYears(figure.compositionPeriod)}`;
  if (figure.floruit) return `fl. ${formatYears(figure.floruit)}`;
  if (figure.born === undefined)
    return figure.died === undefined
      ? "Life dates uncertain"
      : `d. ${formatYear(figure.died)}`;
  return figure.died === undefined
    ? `${formatYear(figure.born)}–present`
    : formatYears({ start: figure.born, end: figure.died });
}
/** Human-facing input: bare positive years are CE; use BCE/BC explicitly. */
export function parseYearInput(input: string): number | null {
  const match = input.trim().match(/^(\d+)\s*(BCE|BC|CE|AD)?$/i);
  if (!match) return null;
  const magnitude = Number(match[1]);
  if (!Number.isSafeInteger(magnitude) || magnitude < 1) return null;
  const year = /^BC/i.test(match[2] ?? "") ? bce(magnitude) : magnitude;
  return year >= MIN_TIMELINE_YEAR && year <= MAX_TIMELINE_YEAR ? year : null;
}
