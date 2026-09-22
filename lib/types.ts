export type YearRange = { start: number; end: number };
export type Tradition = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  description: string;
};
export type Affiliation = {
  traditionId: string;
  status: "core" | "contested";
  basis: string;
  sourceUrl: string;
  branch?: string;
  period?: string;
};
export type ImportanceAssessment = {
  level: "foundational" | "central" | "established";
  rationale: string;
  sourceUrl: string;
};
export type Figure = {
  id: string;
  name: string;
  born: number;
  died?: number;
  context: string;
  affiliations: Affiliation[];
  primaryTraditionId?: string;
  color: string;
  importance: ImportanceAssessment;
  status: "included" | "candidate";
  researchNote: string;
};
export type Domain = {
  id: string;
  name: string;
  shortName: string;
  description: string;
};
export type Milestone = {
  id: string;
  domainId: string;
  name: string;
  shortName: string;
  window: YearRange;
  jurisdiction: string;
  measure: "law" | "institutions" | "interpretation" | "scenario";
  kind: "historical" | "stipulated" | "projected";
  description: string;
  sources: { title: string; url: string }[];
  reforms?: {
    year: number;
    jurisdiction: string;
    change: string;
    chartLabel: string;
    sourceUrl: string;
  }[];
  alternatives?: {
    id: string;
    name: string;
    window: YearRange;
    jurisdiction: string;
    sourceUrl: string;
  }[];
};
export type Source = {
  id: string;
  title: string;
  author: string;
  url: string;
  edition: string;
  originalLanguage: string;
  translation: string;
  publication: YearRange;
  workFirstPublication?: YearRange;
  witnessPublication?: YearRange;
  datingSourceUrl?: string;
  reuse: string;
  checkedOn: string;
  verification: "primary-transcription" | "primary-pdf";
  verificationNote: string;
};
export type Quotation = {
  id: string;
  sourceId: string;
  text: string;
  locator: string;
  context: string;
};
export type WrittenPosition = {
  id: string;
  figureId: string;
  domainId: string;
  title: string;
  summary: string;
  composition: YearRange;
  dateBasis: string;
  publication: YearRange;
  visibility: "public" | "private";
  stance: "supports" | "opposes" | "ambiguous";
  quotationIds: string[];
  milestoneId?: string;
  evidence: "checked" | "qualified";
  matchRationale: string;
  qualifications: string[];
  counterevidence: string;
  revisionOf?: string;
  episodeId: string;
};
export type ResearchData = {
  version: string;
  asOf: string;
  traditions: Tradition[];
  figures: Figure[];
  domains: Domain[];
  milestones: Milestone[];
  sources: Source[];
  quotations: Quotation[];
  positions: WrittenPosition[];
};
export type Score = {
  stance: "supports" | "opposes";
  min: number;
  max: number;
  midpoint: number;
  provisional: boolean;
  explanation: string;
  benchmark: YearRange;
  writing: YearRange;
};
export type Filters = {
  query: string;
  traditionIds: string[];
  domainIds: string[];
  period: YearRange;
  publicOnly: boolean;
  evidence: "all" | "checked" | "qualified";
  includeContested: boolean;
  sharedDomains: boolean;
  benchmark: "default" | "alternative";
};
export type Scenarios = Record<string, YearRange>;
