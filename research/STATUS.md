# Research edition 01 — audit status

As of 22 September 2026: **42 included figures, 53 positions, 51 quotation records, 48 source records, 13 ethical families and 17 issue domains**. Five substantively unmatched positions remain in the table without plotted coordinates or scores. Fourteen records carry material interpretive or bibliographic qualifications.

## What has been done

- Located primary-text witnesses, selected brief attributable passages, and recorded locators, work/edition information, language/translation, composition or declared date proxy, and publication separately.
- Read the relevant passages in context, preserving stated restrictions and identified contrary passages. Exact witnesses and caveats are displayed in each dossier.
- Included Bentham's private manuscript; Mill and Kant on executions; Rousseau's restriction of toleration; Luther's substantially different earlier and later writings; modern Kantian animal concern; and explicit human-extinction arguments from Parfit, Leslie, Bostrom, Ord, MacAskill/Greaves, Russell and Jonas.
- Kept framework use distinct from exclusive allegiance. Russell's and Jonas's disputed classifications are excluded from default tradition comparisons. Coauthored quotations use shared source records.
- Checked structural integrity, scoring rules, excerpt length budgets, source references and revision links with executable tests. Source-link checks found several obsolete profile URLs, which were replaced.

These checks do **not** mean that every edition has been collated, every affiliation has received expert adjudication, or every figure's full corpus has been searched for all 17 domains.

## Coverage

Counts below are core affiliations, with mixed affiliations counted in each applicable row. They consequently do not sum to the number of people. Historical rank eligibility is computed dynamically from scored evidence, not from this headcount.

| Family                         | Core figures | Main limitation                                                        |
| ------------------------------ | -----------: | ---------------------------------------------------------------------- |
| Utilitarian / consequentialist |           12 | Many recent authors contribute only provisional future comparisons     |
| Christian                      |            7 | Selected branches and reform debates; far from a representative sample |
| Kantian                        |            2 | Below the three-core-figure ranking threshold                          |
| Buddhist                       |            1 | Current autonomy passage is not assigned a colonial-independence score |
| Stoic / Neo-Stoic              |            1 | Modern exponent only; early modern revival remains to be researched    |
| Hindu                          |            2 | Two distinct branches, with limited domain coverage                    |
| Jain                           |            1 | Broad nonviolence; no inferred insect-sentience position               |
| Existentialist                 |            1 | Beauvoir is core; Jonas is explicitly contested                        |
| Aristotelian / virtue          |            1 | Nussbaum's capabilities approach also has a rights affiliation         |
| Liberal / rights-based         |            8 | Broad umbrella; significant internal differences                       |
| Marxist / socialist            |            5 | Authorship and mixed affiliations retained; not a census               |
| Confucian                      |            1 | Wang's moral concern is retained without an equivalent legal benchmark |
| Islamic                        |            1 | One modern author cannot represent the tradition's range               |

Only four families currently meet the default threshold of three core figures with historical evidence and three scored historical domains. No conclusion about the remaining nine follows from that absence. The target of roughly four figures per family has **not** been reached; the next roster priorities are recorded in [CANDIDATES.md](CANDIDATES.md).

## Specific unresolved work

1. **Balanced selection and counterevidence:** complete the same domain-by-domain search for every figure. The in-app checklist currently distinguishes located evidence from unknown/open domains; it does not imply an exhaustive search has already happened. The first roster was assembled iteratively, not preregistered before positions were known.
2. **Edition and composition precision:** replace declared publication proxies with securely dated manuscripts where available. Singer's teaching excerpt has incomplete anthology metadata; Salt uses a checked revised edition; Maududi uses a later English reprint; Wang's first-publication interval is broad. These caveats remain visible rather than silently backdating passages.
3. **Translations:** some translations are modern copyrighted witnesses, and not every translation's complete editorial history is established. The app uses brief excerpts and links; it does not redistribute complete works or scans.
4. **Affiliations and importance:** linked scholarly or institutional profiles support many classifications, but some modern or religious affiliations use author/institution accounts. Importance tiers are sourced editorial judgments, not a settled quantitative measure. A specialist review is still needed, especially for broad families and mixed cases.
5. **Benchmark equivalence:** all historical dates are named legal or institutional reference cases. They are not empirical estimates of society-wide moral consensus. International torture codification is later than some national bans; British factory protection is narrower than a prohibition of all child labor. Do not read a zero score as agreement with an author's position or as a denial of historical influence.
6. **Extinction denial:** no securely checked authored passage explicitly claiming human extinction impossible is included. Missing denial evidence remains unknown.
7. **Source durability:** some repositories restrict automated access. An HTTP access error is recorded as an access limitation, not grounds to replace a quotation with an unsourced paraphrase. Archival persistence and a fuller witness-by-witness scan audit remain desirable.

## Reproduction and review

`npm run audit:data` validates record integrity; `npm test` checks the mathematical rules. `Export evidence` includes the complete corpus and current view's calculations. It records the coordinate constants and normalized horizontal positions, so the exported placements can be reconstructed at any viewport width. The arc itself remains schematic.

Changes to a quotation, date, affiliation, benchmark match or substantive episode should be reviewed as research changes, with a new data version. Formatting and app tests do not substitute for that review. No actual conduct or practical consequences are scored.
