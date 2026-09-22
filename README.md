# Ethical Track Record Explorer

A Next.js / React / TypeScript research app comparing dated **written positions** with explicitly named moral-reform benchmarks. D3 supplies the time scale; SVG renders the schematic moral arc, uncertainty intervals, stable author colors and connected positions. Prepared for Vercel; no database, accounts, API keys or environment variables are needed.

## Run

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, run `npm run build` then `npm start`.

## What is included

The default graph spans 1500–2100; resetting filters restores this period.

- 66 figures (59 plotted), 91 written positions, 86 quotation records and 77 primary-source records across 13 ethical families.
- 81 scored dots and ten unmatched positions retained in the evidence table.
- Separate extinction (2000–2030), wild-animal welfare including insects (2060–2100), AI-welfare (2040–2100), and factory-farming / veganism (2000–2100) scenario windows. All are provisional and excluded from historical rankings.
- Persistent quotation panel; desktop chart resizing; mobile bottom-sheet/full-screen reading; keyboard and overlap selection; equivalent table view.
- Search and filters; public/private sensitivity; date intervals; alternative dates and jurisdictions, including narrower 1822 livestock protections; shared-domain comparisons; coverage thresholds; URL-based views.
- Export of source data, filters, scenario dates, score intervals, placements and historical rankings. `/api/research` serves the full source corpus.

The initial corpus is an inspectable research edition, **not a completed scholarly audit**. Coverage is uneven and several traditions do not meet the historical ranking threshold. Some edition, composition and affiliation judgments are explicitly qualified. See [research status](research/STATUS.md), [protocol](research/PROTOCOL.md), and [candidate queue](research/CANDIDATES.md). Missing evidence does not become a score.

## Checks

```sh
npm run typecheck
npm test
npm run audit:data
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite runs against the production build on port 37841 and refuses to reuse an unrelated server. It exercises every plotted dot's quotation, overlaps, public/private filtering, deep links, focus restoration, unmatched evidence, benchmark dialogs, scenario reset/export and mobile reading. Automated axe checks cover the principal views against WCAG A/AA rules; these complement rather than replace manual accessibility review. Unit tests cover scoring and nested fractional aggregation, duplicates, uncertainty, rank eligibility, scenario exclusion, URLs and reproducible geometry. The data audit validates references, metadata, date ranges, revision links and excerpt budgets; it cannot prove historical completeness or interpretive correctness.

## Deploy to Vercel

Import this repository into Vercel as a **Next.js** project, with this directory as the root. Use Node.js 22 or 24, install with `npm ci`, and build with `npm run build`. Keep the default Next.js output settings. `vercel.json` selects the framework. Deployment itself has not been performed.

## Research and implementation map

| File                            | Purpose                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `research/catalog.ts`           | Tradition taxonomy, domains, benchmark register and historical source links  |
| `research/calibration.ts`       | Initial calibration dossiers, including private texts and extinction concern |
| `research/expanded.ts`          | Additional authors and position dossiers                                     |
| `research/evidence.ts`          | Typed constructors; separately stored sources and quotations                 |
| `lib/types.ts`                  | Research schema                                                              |
| `lib/scoring.ts`                | Pure scoring, filtering, historical rankings and export                      |
| `lib/geometry.ts`               | Shared plotting/export coordinate definitions                                |
| `lib/state.ts`                  | Shareable URL state                                                          |
| `components/timeline.tsx`       | SVG chart, connections, uncertainty and overlap selection                    |
| `components/evidence-panel.tsx` | Quotes, citations, editorial interpretation and calculations                 |
| `components/explorer.tsx`       | Filters, table, scenarios, ranking, methodology and roster                   |

To add a position, verify a primary witness and record the exact short passage, locator, language/translator, composition and publication dates, visibility, qualifications and contrary evidence. Establish the figure's affiliation and importance independently of the score. Reuse a source/quotation ID for coauthored material. Repeated statements of one episode share an `episodeId`; a real revision gets a new episode and `revisionOf`. Leave `milestone` absent when there is no substantively equivalent benchmark. Run the data audit and tests before including the change.

The app's arc expresses the project's assumed direction of progress. Its vertical offsets are years of lead or lag, never units of goodness. Connections identify the same writer across issues, not a continuous moral trajectory. Importance changes stroke width only.
