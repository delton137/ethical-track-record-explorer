# Research edition 03 — 22 September 2026

**66 included figures; 59 with plotted positions; 7 with unmatched evidence only.** The corpus contains 91 positions, 86 quotation records and 77 source records. Ten positions are unscored and 41 carry material qualifications. Exact coverage and the per-person review register are in [coverage.json](coverage.json), regenerated with `npx tsx scripts/research-report.ts`.

This edition adds 24 people, including Nietzsche. Three additions—du Vair, Anscombe and Iqbal—have only unmatched evidence. Their statements do not establish an equivalent reform: human-centered teleology is not permission for animal cruelty; moral disapproval is not criminalization; inheritance shares are not covered by the existing employment/education discrimination benchmark.

## New primary evidence

- Nietzsche: slavery and rejection of women’s equal rights/education, _Beyond Good and Evil_ §§238, 257–259. Existentialist affiliation is contested and excluded from default ranking.
- Bentham: women’s equal claim to the vote in principle, but political deferral, _Constitutional Code_, Book I, chapter XV. The editor dates these posthumously arranged manuscripts to 1818–1830; publication is recorded separately as 1843. The 1817 _Plan_ was also reviewed and does not provide an unqualified recommendation.
- Mill: defense of emancipation in his 1850 reply to Carlyle. Rousseau: subordinate female education in _Emile_. Locke: the punishment-based slavery dot has been removed. His rejection of inherited enslavement in _Second Treatise_ §189 is retained as unmatched evidence, without abolition credit. See [the slavery review](LOCKE-SLAVERY.md).
- New mixed and restrictive positions include Kang’s racial homogenization, Fichte’s married women’s rights, Kierkegaard’s worldly subordination, and Rida’s limited continuation of slavery. Positive views do not cancel these records.

## Historical review corrections

Salt’s animal-rights passage is dated to 1892 using contemporary attestation of its exact wording; the inspected 1922 book edition is recorded separately. Rawls, Becker and MacIntyre likewise distinguish original work publication from inspected editions without backdating uncollated passages. Bodhi’s insect precept remains available as unmatched moral concern, without credit for advocating future statutes.

The 1911 animal-protection benchmark now identifies its exclusion of Scotland and its 1912 commencement. An alternative 1822 livestock benchmark exposes sensitivity to earlier, narrower legislation. Obsolete static score claims were removed from the Marx/Engels and Rousseau notes; the evidence panel calculates values for the selected benchmark.

## Audit scope and remaining gaps

Every person’s recorded excerpts have been checked for whether they establish a slavery or women’s-rights position. The research index and export explicitly identify the works reviewed and unknown domains. **This is not a completed search of all 66 authors’ collected works.** Broader contrary-passage, revision and cross-domain research remains open; absence of a located passage is never treated as support.

Four original candidates remain unadmitted: Acharya Tulsi, Huang Zongxi, Dai Zhen and Muhammad Abduh. See [CANDIDATES.md](CANDIDATES.md). Liang Qichao is a same-family replacement; Nietzsche is an additional user-requested figure. Many additions have one qualifying position rather than the desired two or three.

Bibliographic qualifications remain visible: Kierkegaard’s scanned excerpt lacks title pages; several translated web witnesses do not credit translators; Vivekananda’s letter date is secure but first-publication date is unresolved; Virchand Gandhi uses posthumously collected lecture text rather than an inspected autograph. Revised editions of Rawls, Becker and MacIntyre are not silently backdated to original editions. Primary wording is checked in the specified witness; this does not substitute for critical-edition or manuscript collation.

## Placement and reproducibility

Opposition before a reform starts sits on the reference line at the writing-date midpoint. At or after the reform starts, opposition stays at the reference height of the reform-start year, so later opposition lies below the line. All issues use their own selected benchmark, with no separate women’s-suffrage anchor. Date ranges use the same midpoint as the horizontal position. There is no additional pixel offset. Support securely dated at or after an interval’s endpoint appears at that endpoint’s reference height; support before/during the interval uses its mean reference height. If the writing-date range crosses the endpoint, uncertainty is retained. These visual rules do not change lead/lag scores. Exports contain the dates, scenario assumptions, formulas and coordinates.

The source audit checks references, date ranges, unique episodes and short-excerpt budgets. Unit tests cover scoring, uncertain dates, opposition placement, endpoint placement and provenance safeguards. Browser tests exercise every plotted quotation, filters, overlapping points, exports, mobile reading and accessibility. All systematic historical conclusions remain limited by coverage and selection.
