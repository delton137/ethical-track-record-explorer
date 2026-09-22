import { figures, positions, quotations, sources } from "./evidence";

/** Scope is the recorded excerpt set, never an inference about an author's entire corpus. */
export function recordFocusAudit() {
  for (const figure of figures) {
    const ps = positions.filter((p) => p.figureId === figure.id);
    const outcome = (domains: string[]) => {
      const found = ps.filter((p) => domains.includes(p.domainId));
      return found.length
        ? found
            .map(
              (p) =>
                `${p.title} (${p.stance}; ${p.milestoneId ? "benchmark assigned" : "unmatched"})`,
            )
            .join("; ")
        : "No qualifying statement in the recorded excerpts; wider primary-text search unfinished";
    };
    const works = [
      ...new Set(
        ps.flatMap((p) =>
          p.quotationIds.map((id) => {
            const q = quotations.find((q) => q.id === id)!;
            return sources.find((s) => s.id === q.sourceId)!.title;
          }),
        ),
      ),
    ];
    figure.researchNote = `Slavery / women audit, 22 September 2026. Scope: the recorded passages and their documented context in ${works.join("; ")}. Slavery: ${outcome(["slavery"])}. Women’s rights: ${outcome(["women", "suffrage"])}. This is an excerpt-level review, not a completed search of the author's collected writings. No located opposition does not establish support. All other issue and revision searches remain open unless a position documents them.`;
  }
}
