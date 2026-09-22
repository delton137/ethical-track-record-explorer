import type {
  Affiliation,
  Figure,
  ImportanceAssessment,
  Quotation,
  Source,
  WrittenPosition,
  YearRange,
} from "@/lib/types";

export const figures: Figure[] = [];
export const sources: Source[] = [];
export const quotations: Quotation[] = [];
export const positions: WrittenPosition[] = [];
export const yr = (start: number, end = start): YearRange => ({ start, end });
export function figure(
  id: string,
  name: string,
  born: number,
  died: number | undefined,
  tradition: string | undefined,
  color: string,
  context: string,
  profile: string,
  basis: string,
  level: ImportanceAssessment["level"] = "central",
  extra: Affiliation[] = [],
) {
  if (figures.some((f) => f.id === id)) return;
  figures.push({
    id,
    name,
    born,
    died,
    context,
    primaryTraditionId: tradition,
    color,
    status: "included",
    affiliations: tradition
      ? [
          { traditionId: tradition, status: "core", basis, sourceUrl: profile },
          ...extra,
        ]
      : extra,
    importance: {
      level,
      rationale: `Editorial ${level} classification based on the linked account of the author's intellectual contribution. This affects stroke width only.`,
      sourceUrl: profile,
    },
    researchNote:
      "Primary passages have been checked in the specified witnesses. The cross-domain and counterevidence audit remains open; missing positions are unknown.",
  });
}
type EvidenceInput = {
  id: string;
  person: string;
  domain: string;
  title: string;
  summary: string;
  year: number;
  end?: number;
  publication?: number;
  publicationEnd?: number;
  private?: boolean;
  stance?: WrittenPosition["stance"];
  milestone?: string;
  quote: string;
  locator: string;
  work: string;
  url: string;
  edition?: string;
  language?: string;
  translation?: string;
  context: string;
  qualifications?: string[];
  counter?: string;
  qualified?: boolean;
  dateBasis?: string;
  match?: string;
  revisionOf?: string;
  sourceId?: string;
  author?: string;
  episodeId?: string;
};
export function evidence(i: EvidenceInput) {
  if (positions.some((p) => p.id === i.id)) return;
  const sourceId = i.sourceId ?? i.id + "-source";
  const source = sources.find((s) => s.id === sourceId);
  if (!source)
    sources.push({
      id: sourceId,
      title: i.work,
      author:
        i.author ?? figures.find((f) => f.id === i.person)?.name ?? i.person,
      url: i.url,
      edition:
        i.edition ??
        "Primary text in the linked digital transcription; locator refers to this witness.",
      originalLanguage: i.language ?? "English",
      translation: i.translation ?? "Original English; no translation.",
      publication: yr(
        i.publication ?? i.year,
        i.publicationEnd ?? i.publication ?? i.year,
      ),
      reuse:
        "Brief attributed excerpt; follow the source link for the surrounding work. Copyright in modern translations and editions may subsist.",
      checkedOn: "2026-09-22",
      verification: /\.pdf(?:$|\?)/.test(i.url)
        ? "primary-pdf"
        : "primary-transcription",
      verificationNote:
        "Wording checked against the linked primary-text witness. This is not a claim of manuscript collation or independent historical peer review.",
    });
  const quoteId =
    quotations.find((q) => q.sourceId === sourceId && q.text === i.quote)?.id ??
    i.id + "-quote";
  if (!quotations.some((q) => q.id === quoteId))
    quotations.push({
      id: quoteId,
      sourceId,
      text: i.quote,
      locator: i.locator,
      context: i.context,
    });
  positions.push({
    id: i.id,
    figureId: i.person,
    domainId: i.domain,
    title: i.title,
    summary: i.summary,
    composition: yr(i.year, i.end ?? i.year),
    dateBasis:
      i.dateBasis ??
      "Publication-year proxy: no earlier composition date has been securely established for this passage.",
    publication: yr(
      i.publication ?? i.year,
      i.publicationEnd ?? i.publication ?? i.year,
    ),
    visibility: i.private ? "private" : "public",
    stance: i.stance ?? "supports",
    quotationIds: [quoteId],
    milestoneId: i.milestone,
    evidence: i.qualified ? "qualified" : "checked",
    matchRationale:
      i.match ??
      (i.milestone
        ? "The stated position concerns the reform described in the benchmark. Its precise limits and jurisdiction are shown separately."
        : "No sufficiently equivalent benchmark has been assigned; evidence is retained without a numerical score."),
    qualifications: i.qualifications ?? [],
    counterevidence:
      i.counter ??
      "The surrounding passage was reviewed. A comprehensive search for contrary passages across the complete corpus remains open.",
    revisionOf: i.revisionOf,
    episodeId: i.episodeId ?? i.id,
  });
}
