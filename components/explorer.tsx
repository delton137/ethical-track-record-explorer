"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowDownToLine,
  RotateCcw,
  ArrowUpRight,
  ChevronDown,
  X,
  Table2,
  ChartNoAxesCombined,
  BookOpen,
  Check,
  Link2,
  ArrowRight,
  Users,
  ExternalLink,
} from "lucide-react";
import { progressColor } from "@/lib/progress-colors";
import { data } from "@/research/corpus";
import type { Filters, Scenarios, YearRange } from "@/lib/types";
import {
  calculateScore,
  defaultScenarios,
  exportSnapshot,
  filterPositions,
  formatYears,
  leaderboard,
} from "@/lib/scoring";
import { DEFAULT_FILTERS, parseState, serializeState } from "@/lib/state";
import Timeline from "./timeline";
import EvidencePanel from "./evidence-panel";

const scenarioDefaults = defaultScenarios(data);
const formatScore = (n: number) => `${n > 0 ? "+" : ""}${Math.round(n)}`;
// An empty filter means all traditions; this URL-safe value explicitly selects none.
const NO_TRADITIONS = "none";

export default function Explorer() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [scenarios, setScenarios] = useState<Scenarios>(scenarioDefaults);
  const [selected, setSelected] = useState<string | null>("bentham-animals");
  const [view, setView] = useState<"chart" | "table">("chart");
  const [tab, setTab] = useState<"explore" | "method" | "roster">("explore");
  const [filterOpen, setFilterOpen] = useState(false);
  const [benchmark, setBenchmark] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [periodDraft, setPeriodDraft] = useState({
    start: String(DEFAULT_FILTERS.period.start),
    end: "2100",
  });
  const [periodError, setPeriodError] = useState("");
  const lastDot = useRef<string | null>(null);
  const evidenceOpener = useRef<Element | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalOpener = useRef<HTMLElement | null>(null);
  const positions = useMemo(() => filterPositions(data, filters), [filters]);
  const ranks = useMemo(
    () => leaderboard(data, positions, filters),
    [positions, filters],
  );
  const selectedTraditions = filters.traditionIds.length
    ? filters.traditionIds.filter((id) => id !== NO_TRADITIONS)
    : data.traditions.map((t) => t.id);
  function toggleTradition(id: string) {
    const next = selectedTraditions.includes(id)
      ? selectedTraditions.filter((value) => value !== id)
      : [...selectedTraditions, id];
    patch({ traditionIds: next.length ? next : [NO_TRADITIONS] });
  }
  const selectionActions = (
    <div
      className="selection-actions"
      role="group"
      aria-label="Tradition selection"
    >
      <button
        type="button"
        className="text-button"
        onClick={() => patch({ traditionIds: [] })}
      >
        Select all
      </button>
      <button
        type="button"
        className="text-button"
        onClick={() => patch({ traditionIds: [NO_TRADITIONS] })}
      >
        Clear all
      </button>
    </div>
  );
  const position = data.positions.find((p) => p.id === selected);
  const patch = (next: Partial<Filters>) =>
    setFilters((f) => ({ ...f, ...next }));
  useEffect(() => {
    const restore = () => {
      const state = parseState(window.location.search, scenarioDefaults);
      state.filters.traditionIds = state.filters.traditionIds.filter(
        (id) =>
          id === NO_TRADITIONS || data.traditions.some((t) => t.id === id),
      );
      state.filters.domainIds = state.filters.domainIds.filter((id) =>
        data.domains.some((d) => d.id === id),
      );
      setFilters(state.filters);
      setScenarios(state.scenarios);
      setView(state.view);
      setPeriodDraft({
        start: String(state.filters.period.start),
        end: String(state.filters.period.end),
      });
      setSelected(
        window.location.search === ""
          ? window.matchMedia("(max-width: 760px)").matches
            ? null
            : "bentham-animals"
          : data.positions.some((p) => p.id === state.selected)
            ? state.selected
            : null,
      );
      setHydrated(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const query = serializeState(
      filters,
      scenarios,
      scenarioDefaults,
      selected,
      view,
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? "?" + query : ""}`,
    );
  }, [filters, scenarios, selected, view, hydrated]);
  useEffect(() => {
    if (benchmark) {
      modalOpener.current = document.activeElement as HTMLElement;
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
      modalOpener.current?.focus();
    }
  }, [benchmark]);
  const select = (id: string) => {
    if (!document.activeElement?.closest(".evidence-panel"))
      evidenceOpener.current = document.activeElement;
    lastDot.current = id;
    setSelected(id);
    setTab("explore");
  };
  const closePanel = () => {
    setSelected(null);
    requestAnimationFrame(() => {
      const opener = evidenceOpener.current;
      if (
        opener?.isConnected &&
        (opener instanceof HTMLElement || opener instanceof SVGElement)
      )
        opener.focus();
      else
        document
          .querySelector<SVGGElement>(`[data-position="${lastDot.current}"]`)
          ?.focus();
    });
  };
  const reset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setPeriodDraft({
      start: String(DEFAULT_FILTERS.period.start),
      end: "2100",
    });
    setPeriodError("");
  };
  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify(exportSnapshot(data, filters, scenarios), null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ethical-track-record-explorer.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  const applyPeriod = () => {
    const start = Number(periodDraft.start),
      end = Number(periodDraft.end);
    if (
      !periodDraft.start ||
      !periodDraft.end ||
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 1400 ||
      end > 2500 ||
      start >= end
    ) {
      setPeriodError(
        "Enter whole years from 1400 to 2500, with the start before the end.",
      );
      return;
    }
    patch({ period: { start, end } });
    setPeriodError("");
  };
  const benchmarkData = data.milestones.find((m) => m.id === benchmark);
  const filterCount =
    filters.traditionIds.length +
    filters.domainIds.length +
    Number(filters.publicOnly) +
    Number(filters.evidence !== "all") +
    Number(filters.includeContested) +
    Number(
      filters.period.start !== DEFAULT_FILTERS.period.start ||
        filters.period.end !== 2100,
    );
  return (
    <>
      <a className="skip-link" href="#explorer-main">
        Skip to explorer
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="/"
          aria-label="Ethical Track Record Explorer home"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <rect width="30" height="30" rx="7" fill="#2466c5" />
            <path
              d="M7 22V8M7 22h16M10 19l5-5 4 1 5-8"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="15" cy="14" r="2" fill="white" />
          </svg>
          <span>
            Ethical Track Record<span>EXPLORER</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={tab === "explore" ? "active" : ""}
            onClick={() => setTab("explore")}
          >
            Explorer
          </button>
          <button
            className={tab === "roster" ? "active" : ""}
            onClick={() => setTab("roster")}
          >
            Research index
          </button>
          <button
            className={tab === "method" ? "active" : ""}
            onClick={() => setTab("method")}
          >
            Methodology
          </button>
        </nav>
      </header>
      <main id="explorer-main">
        {tab === "explore" && (
          <>
            <section className="intro-bar">
              <div>
                <h1>
                  Tracing the moral arc and mapping the expanding moral circle
                </h1>
                <p>
                  Explore who correctly anticipated ethical advances and who got
                  things wrong.
                </p>
              </div>
              <div className="intro-actions">
                <button className="quiet-button" onClick={share}>
                  {copied ? <Check size={16} /> : <Link2 size={16} />}{" "}
                  {copied ? "Link copied" : "Copy view link"}
                </button>
                <button
                  className="quiet-button export-button"
                  onClick={exportData}
                >
                  <ArrowDownToLine size={16} /> Export evidence
                </button>
              </div>
            </section>
            <section className="toolbar" aria-label="Explorer controls">
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search people and positions"
                  disabled={!hydrated}
                  placeholder="Search a thinker or idea…"
                  value={filters.query}
                  onChange={(e) => patch({ query: e.target.value })}
                />
                {filters.query && (
                  <button
                    aria-label="Clear search"
                    onClick={() => patch({ query: "" })}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <label className="select-wrap">
                <span className="sr-only">Tradition</span>
                <select
                  value={
                    filters.traditionIds.length === 1
                      ? filters.traditionIds[0]
                      : ""
                  }
                  onChange={(e) =>
                    patch({
                      traditionIds: e.target.value ? [e.target.value] : [],
                    })
                  }
                >
                  <option value="">
                    {filters.traditionIds.length > 1
                      ? `${filters.traditionIds.length} traditions`
                      : "All traditions"}
                  </option>
                  <option value={NO_TRADITIONS}>No traditions selected</option>
                  {data.traditions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.shortName}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
              <label className="select-wrap">
                <span className="sr-only">Issue</span>
                <select
                  value={
                    filters.domainIds.length === 1 ? filters.domainIds[0] : ""
                  }
                  onChange={(e) =>
                    patch({ domainIds: e.target.value ? [e.target.value] : [] })
                  }
                >
                  <option value="">
                    {filters.domainIds.length > 1
                      ? `${filters.domainIds.length} issues`
                      : "All issues"}
                  </option>
                  {data.domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.shortName}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
              <button
                className={`filter-button ${filterOpen ? "pressed" : ""}`}
                aria-expanded={filterOpen}
                aria-controls="filter-drawer"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <SlidersHorizontal size={16} /> Filters{" "}
                {filterCount > 0 && (
                  <span className="count-badge">{filterCount}</span>
                )}
              </button>
              <div className="toolbar-end">
                <div
                  className="view-switch"
                  role="group"
                  aria-label="Display mode"
                >
                  <button
                    className={view === "chart" ? "active" : ""}
                    aria-pressed={view === "chart"}
                    aria-label="Show timeline"
                    onClick={() => setView("chart")}
                  >
                    <ChartNoAxesCombined size={17} />
                    <span>Timeline</span>
                  </button>
                  <button
                    className={view === "table" ? "active" : ""}
                    aria-pressed={view === "table"}
                    aria-label="Show evidence table"
                    onClick={() => setView("table")}
                  >
                    <Table2 size={17} />
                    <span>Table</span>
                  </button>
                </div>
              </div>
            </section>
            {filterOpen && (
              <section
                className="filter-drawer"
                id="filter-drawer"
                aria-label="Detailed filters"
              >
                <div>
                  <h3>Traditions</h3>
                  {selectionActions}
                  <div className="check-grid">
                    {data.traditions.map((t) => (
                      <label key={t.id}>
                        <input
                          type="checkbox"
                          checked={selectedTraditions.includes(t.id)}
                          onChange={() => toggleTradition(t.id)}
                        />
                        <span
                          className="legend-dot"
                          style={{ background: t.color }}
                        />
                        {t.shortName}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Evidence</h3>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={filters.publicOnly}
                      onChange={(e) => patch({ publicOnly: e.target.checked })}
                    />{" "}
                    Public writings only
                  </label>
                  <p className="help-text">
                    Uses publication dates and excludes private manuscripts.
                  </p>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={filters.includeContested}
                      onChange={(e) =>
                        patch({ includeContested: e.target.checked })
                      }
                    />{" "}
                    Include contested affiliations in comparisons
                  </label>
                  <label className="field-label">
                    Passage status
                    <select
                      value={filters.evidence}
                      onChange={(e) =>
                        patch({
                          evidence: e.target.value as Filters["evidence"],
                        })
                      }
                    >
                      <option value="all">All checked passages</option>
                      <option value="checked">
                        Without material qualification
                      </option>
                      <option value="qualified">
                        Qualified interpretations
                      </option>
                    </select>
                  </label>
                </div>
                <div>
                  <h3>Writing period</h3>
                  <div className="period-fields">
                    <label>
                      From
                      <input
                        type="number"
                        min="1400"
                        max="2499"
                        value={periodDraft.start}
                        onChange={(e) =>
                          setPeriodDraft({
                            ...periodDraft,
                            start: e.target.value,
                          })
                        }
                      />
                    </label>
                    <span>–</span>
                    <label>
                      To
                      <input
                        type="number"
                        min="1401"
                        max="2500"
                        value={periodDraft.end}
                        onChange={(e) =>
                          setPeriodDraft({
                            ...periodDraft,
                            end: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <button className="small-button" onClick={applyPeriod}>
                    Apply period
                  </button>
                  {periodError && (
                    <p role="alert" className="field-error">
                      {periodError}
                    </p>
                  )}
                  <button className="text-button reset-filters" onClick={reset}>
                    <RotateCcw size={14} /> Reset filters
                  </button>
                </div>
                <details className="scenario-settings">
                  <summary>Edit future scenarios</summary>
                  <ScenarioEditor
                    scenarios={scenarios}
                    onChange={setScenarios}
                  />
                </details>
              </section>
            )}
            <div className="explorer-workspace">
              <div className="main-surface">
                {view === "table" && (
                  <div className="chart-topline">
                    <h2>The written record</h2>
                  </div>
                )}
                <div
                  className="tradition-legend"
                  aria-label="Tradition color legend"
                >
                  {selectionActions}
                  {data.traditions.map((t) => {
                    const count = new Set(
                      positions
                        .filter((p) =>
                          data.figures
                            .find((f) => f.id === p.figureId)
                            ?.affiliations.some((a) => a.traditionId === t.id),
                        )
                        .map((p) => p.figureId),
                    ).size;
                    return (
                      <button
                        key={t.id}
                        aria-pressed={selectedTraditions.includes(t.id)}
                        className={
                          filters.traditionIds.length &&
                          !filters.traditionIds.includes(t.id)
                            ? "muted"
                            : ""
                        }
                        onClick={() =>
                          patch({
                            traditionIds:
                              filters.traditionIds.length === 1 &&
                              filters.traditionIds[0] === t.id
                                ? []
                                : [t.id],
                          })
                        }
                        title={`${t.name}: ${count} thinkers in this view`}
                      >
                        <span
                          className="legend-dot"
                          style={{ background: t.color }}
                        />
                        {t.shortName}
                        <small>{count}</small>
                      </button>
                    );
                  })}
                </div>
                {view === "chart" ? (
                  <Timeline
                    data={data}
                    positions={positions}
                    filters={filters}
                    scenarios={scenarios}
                    selected={selected}
                    onSelect={select}
                    onBenchmark={setBenchmark}
                  />
                ) : (
                  <div className="evidence-table-wrap">
                    <table className="evidence-table">
                      <caption className="sr-only">
                        Written positions, dates, stance and computed lead or
                        lag. Select a position to inspect primary evidence.
                      </caption>
                      <thead>
                        <tr>
                          <th>Thinker & position</th>
                          <th>Writing</th>
                          <th>Position</th>
                          <th>Lead / lag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((p) => {
                          const f = data.figures.find(
                            (f) => f.id === p.figureId,
                          )!;
                          const score = calculateScore(
                            p,
                            data.milestones.find((m) => m.id === p.milestoneId),
                            scenarios,
                            filters.publicOnly,
                            filters.benchmark === "alternative",
                          );
                          return (
                            <tr
                              key={p.id}
                              className={
                                selected === p.id ? "selected-row" : ""
                              }
                            >
                              <td>
                                <button onClick={() => select(p.id)}>
                                  <span
                                    className="legend-dot"
                                    style={{ background: f.color }}
                                  />
                                  <span>
                                    <strong>{f.name}</strong>
                                    <small>{p.title}</small>
                                  </span>
                                  <ArrowUpRight size={14} />
                                </button>
                              </td>
                              <td>
                                {formatYears(
                                  filters.publicOnly
                                    ? p.publication
                                    : p.composition,
                                )}
                                {p.visibility === "private" && (
                                  <small>Private</small>
                                )}
                              </td>
                              <td>
                                <span className={`stance ${p.stance}`}>
                                  {p.stance === "supports"
                                    ? "Supports reform"
                                    : p.stance === "opposes"
                                      ? "Opposes reform"
                                      : "Ambiguous"}
                                </span>
                              </td>
                              <td>
                                {score ? (
                                  <>
                                    {score.min === score.max
                                      ? formatScore(score.midpoint)
                                      : `${formatScore(score.min)} to ${formatScore(score.max)}`}
                                    <small>
                                      {score.provisional
                                        ? "Provisional"
                                        : "Historical"}{" "}
                                      · years
                                    </small>
                                  </>
                                ) : (
                                  <small>Unscored · unmatched</small>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {!positions.length && (
                      <div className="empty-table">
                        <h3>No matching passages</h3>
                        <p>Broaden the filters to explore other thinkers.</p>
                        <button onClick={reset}>Reset filters</button>
                      </div>
                    )}
                  </div>
                )}
                <details className="benchmark-register">
                  <summary>
                    <BookOpen size={16} /> Historical progress intervals{" "}
                    <span>
                      {
                        data.milestones.filter((m) => m.kind === "historical")
                          .length
                      }{" "}
                      reforms
                    </span>
                  </summary>
                  <p className="progress-interval-help">
                    Each range spans selected legal or institutional milestones.
                    Single years mark individual reforms. Dates apply to the
                    places named below, not worldwide acceptance. Select a
                    reform for its endpoints and sources.
                  </p>
                  <div className="benchmark-list">
                    {data.milestones
                      .filter((m) => m.kind === "historical")
                      .map((m) => (
                        <button key={m.id} onClick={() => setBenchmark(m.id)}>
                          <strong style={{ color: progressColor(m.id) }}>
                            {m.name}
                          </strong>
                          <span style={{ color: progressColor(m.id) }}>
                            {formatYears(m.window)}
                          </span>
                          <small>{m.jurisdiction}</small>
                          <ArrowUpRight size={14} />
                        </button>
                      ))}
                  </div>
                </details>
              </div>
              {position && (
                <EvidencePanel
                  data={data}
                  position={position}
                  filters={filters}
                  scenarios={scenarios}
                  hidden={!positions.some((p) => p.id === position.id)}
                  onSelect={select}
                  onClose={closePanel}
                  onReveal={reset}
                />
              )}
            </div>
            <details className="leaderboard" open>
              <summary>
                <div>
                  <h2>Comparisons (read with a heavy dose of salt!)</h2>
                </div>
                <span className="leaderboard-summary">
                  <ChevronDown size={20} />
                </span>
              </summary>
              <div className="ranking-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.sharedDomains}
                    onChange={(e) => patch({ sharedDomains: e.target.checked })}
                  />{" "}
                  Shared historical domains only
                </label>
                <label>
                  Benchmark set
                  <select
                    value={filters.benchmark}
                    onChange={(e) =>
                      patch({
                        benchmark: e.target.value as Filters["benchmark"],
                      })
                    }
                  >
                    <option value="default">Default reference cases</option>
                    <option value="alternative">
                      Alternative dates / jurisdictions
                    </option>
                  </select>
                </label>
                <p>
                  Ranking requires 3 core figures with scored historical
                  evidence and 3 domains. Filtered results describe this corpus,
                  not a representative census. Rankings depend on the chosen
                  dates and legal scope. The alternative set includes narrower
                  animal protections from 1822 instead of the 1911
                  consolidation; Bentham’s lead changes from 122 to 33 years.
                  Compare both sets before drawing conclusions about traditions.
                  Future scenario changes cannot alter this ranking.
                </p>
              </div>
              <div className="ranking-table-wrap">
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Tradition</th>
                      <th>Mean lead / lag</th>
                      <th>Core figures</th>
                      <th>Domains</th>
                      <th>Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranks.map((r) => {
                      const t = data.traditions.find(
                        (t) => t.id === r.traditionId,
                      )!;
                      return (
                        <tr key={t.id}>
                          <td>
                            <span className="rank-number">{r.rank ?? "—"}</span>
                            <span
                              className="legend-dot"
                              style={{ background: t.color }}
                            />
                            {t.shortName}
                          </td>
                          <td>
                            {r.eligible ? (
                              <>
                                <strong>{formatScore(r.midpoint)} yrs</strong>
                                <small>
                                  {formatScore(r.min)} to {formatScore(r.max)}
                                </small>
                              </>
                            ) : (
                              <span className="subtle">
                                Insufficient coverage
                              </span>
                            )}
                          </td>
                          <td>{r.figureCount}</td>
                          <td>{r.domainCount}</td>
                          <td>
                            <small>
                              {r.positionCount} historical episodes
                              <br />
                              {r.unscoredCount} provisional / unscored
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
        {tab === "method" && (
          <Methodology onExplore={() => setTab("explore")} />
        )}
        {tab === "roster" && (
          <section className="research-index">
            <p className="eyebrow">AN INSPECTABLE CORPUS</p>
            <h1>Research index</h1>
            <p>
              {data.figures.filter((f) => f.status === "included").length}{" "}
              figures with primary-text records ·{" "}
              {data.figures.filter((f) => f.status === "candidate").length}{" "}
              candidates awaiting eligible evidence. Every figure uses the same
              issue checklist. Blank domains remain unknown.
            </p>
            <div className="roster-grid">
              {data.traditions.map((t) => (
                <section key={t.id}>
                  <h2>
                    <span
                      className="legend-dot"
                      style={{ background: t.color }}
                    />
                    {t.name}
                  </h2>
                  {data.figures
                    .filter((f) =>
                      f.affiliations.some((a) => a.traditionId === t.id),
                    )
                    .map((f) => {
                      const ps = data.positions.filter(
                        (p) => p.figureId === f.id,
                      );
                      return (
                        <article key={f.id}>
                          <div className="row-between">
                            <h3>{f.name}</h3>
                            <span className="status-label">
                              {ps.length
                                ? `${ps.length} positions`
                                : "Research candidate"}
                            </span>
                          </div>
                          <p>{f.context}</p>
                          <details>
                            <summary>Evidence & issue checklist</summary>
                            <p>{f.researchNote}</p>
                            <ul className="issue-checklist">
                              {data.domains.map((d) => (
                                <li key={d.id}>
                                  <span>{d.shortName}</span>
                                  <strong>
                                    {ps.some((p) => p.domainId === d.id)
                                      ? "Primary text located"
                                      : "Unknown / open"}
                                  </strong>
                                </li>
                              ))}
                            </ul>
                            <a
                              href={f.importance.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Affiliation / importance source ↗
                            </a>
                          </details>
                          {ps.length > 0 && (
                            <button
                              className="text-button"
                              onClick={() => select(ps[0].id)}
                            >
                              Read a primary passage <ArrowRight size={14} />
                            </button>
                          )}
                        </article>
                      );
                    })}
                  {!data.figures.some((f) =>
                    f.affiliations.some((a) => a.traditionId === t.id),
                  ) && (
                    <p className="subtle">
                      Primary-source research remains open for this tradition.
                    </p>
                  )}
                </section>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer>
        <span>Ethical Track Record Explorer</span>
        <p>
          Written ideas, not lives or deeds. Sources checked {data.asOf}.
          Version {data.version}.
        </p>
        <a href="/api/research" download>
          Download full corpus <ArrowDownToLine size={13} />
        </a>
      </footer>
      <dialog
        ref={modalRef}
        className="benchmark-dialog"
        onCancel={() => setBenchmark(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setBenchmark(null);
        }}
      >
        {benchmarkData && (
          <>
            <div className="row-between">
              <p className="eyebrow">
                {benchmarkData.kind === "historical"
                  ? benchmarkData.window.start === benchmarkData.window.end
                    ? "HISTORICAL PROGRESS MILESTONE"
                    : "HISTORICAL PROGRESS INTERVAL"
                  : "PROVISIONAL SCENARIO"}
              </p>
              <button
                className="icon-button"
                onClick={() => setBenchmark(null)}
                aria-label="Close benchmark"
              >
                <X size={20} />
              </button>
            </div>
            <h2 style={{ color: progressColor(benchmarkData.id) }}>
              {benchmarkData.name}
            </h2>
            <div
              className="benchmark-big-date"
              style={{ color: progressColor(benchmarkData.id) }}
            >
              {formatYears(scenarios[benchmarkData.id] ?? benchmarkData.window)}
            </div>
            <p>{benchmarkData.jurisdiction}</p>
            <p>{benchmarkData.description}</p>
            <p className="subtle">
              Measure: {benchmarkData.measure}.{" "}
              {benchmarkData.kind !== "historical"
                ? "Excluded from historical ranking."
                : "This benchmark measures the stated legal or institutional transition, not universal public acceptance."}
            </p>
            {benchmarkData.reforms && (
              <ul>
                {benchmarkData.reforms.map((r) => (
                  <li key={`${r.year}-${r.jurisdiction}`}>
                    <a href={r.sourceUrl} target="_blank" rel="noreferrer">
                      {r.year} — {r.jurisdiction}
                    </a>
                    : {r.change}
                  </li>
                ))}
              </ul>
            )}
            {benchmarkData.sources.map((s) => (
              <a
                key={s.url}
                className="source-link"
                href={s.url}
                target="_blank"
                rel="noreferrer"
              >
                {s.title}
                <ExternalLink size={14} />
              </a>
            ))}
            {benchmarkData.alternatives?.map((a) => (
              <p key={a.id}>
                Alternative:{" "}
                <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                  {a.name}, {formatYears(a.window)}
                </a>
                . Select alternative benchmarks in Comparisons.
              </p>
            ))}
          </>
        )}
      </dialog>
    </>
  );
}

function ScenarioEditor({
  scenarios,
  onChange,
}: {
  scenarios: Scenarios;
  onChange: (s: Scenarios) => void;
}) {
  const [draft, setDraft] = useState<
    Record<string, { start: string; end: string }>
  >(() =>
    Object.fromEntries(
      Object.entries(scenarios).map(([id, r]) => [
        id,
        { start: String(r.start), end: String(r.end) },
      ]),
    ),
  );
  const [error, setError] = useState("");
  const apply = () => {
    const next: Scenarios = {};
    for (const [id, r] of Object.entries(draft)) {
      const start = Number(r.start),
        end = Number(r.end);
      if (
        !r.start ||
        !r.end ||
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1400 ||
        end > 2500 ||
        start > end
      ) {
        setError(
          "Use whole years between 1400 and 2500. A window’s start must not exceed its end.",
        );
        return;
      }
      next[id] = { start, end };
    }
    onChange(next);
    setError("");
  };
  const reset = () => {
    onChange(defaultScenarios(data));
    setDraft(
      Object.fromEntries(
        Object.entries(scenarioDefaults).map(([id, r]) => [
          id,
          { start: String(r.start), end: String(r.end) },
        ]),
      ),
    );
    setError("");
  };
  return (
    <div className="scenario-editor">
      <div className="scenario-inputs">
        {data.milestones
          .filter((m) => m.kind !== "historical")
          .map((m) => (
            <fieldset key={m.id}>
              <legend>{m.shortName}</legend>
              <div className="period-fields">
                <label>
                  Start
                  <input
                    type="number"
                    min="1400"
                    max="2500"
                    aria-label={`${m.shortName} start year`}
                    value={draft[m.id].start}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [m.id]: { ...draft[m.id], start: e.target.value },
                      })
                    }
                  />
                </label>
                <span>–</span>
                <label>
                  End
                  <input
                    type="number"
                    min="1400"
                    max="2500"
                    aria-label={`${m.shortName} end year`}
                    value={draft[m.id].end}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [m.id]: { ...draft[m.id], end: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            </fieldset>
          ))}
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <div className="scenario-actions">
        <button className="primary-button" onClick={apply}>
          Apply scenarios
        </button>
        <button className="quiet-button" onClick={reset}>
          <RotateCcw size={14} /> Reset specified windows
        </button>
      </div>
    </div>
  );
}

function Methodology({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="methodology">
      <h1>Assumptions</h1>
      <div className="method-intro">
        <div className="method-assumptions">
          <p>
            There are many assumptions! You may disagree with some. But I (Dan
            Elton) think the following hold:
          </p>
          <ol>
            <li>Ethical progress is real (see Steven Pinker's books).</li>
            <li>
              Ethical progress is intertwined with scientific, technological,
              and economic progress (see "The Moral Arc" by Michael Shermer).
            </li>
            <li>
              We can measure the "state of ethical progress" in terms of what
              the majority thinks is ethically correct in a set of the largest
              and most advanced countries.
            </li>
            <li>
              Some philosophical systems yield insights well ahead of that
              curve, others lag behind.
            </li>
            <li>
              We can measure this by focusing on individuals working within a
              given ethical framework who may be ahead of the curve or behind
              the curve in what they find.
            </li>
          </ol>
          <p>
            <strong>
              Note that we don't look at the ethical impact of the individuals,
              only whether the ideas they obtained from working within an
              ethical system ended up being right or wrong.
            </strong>{" "}
            Some individuals have achieved great good, others massive harm.
            Quantifying the good/harm caused per unit individual working within
            a system is a totally separate project not attempted here.
          </p>
        </div>
        <button className="primary-button" onClick={onExplore}>
          Explore the evidence <ArrowRight size={16} />
        </button>
      </div>
      <div className="method-grid">
        <section>
          <span className="method-number">01</span>
          <h2>The unit is a written position</h2>
          <p>
            A dot belongs to one person, one issue and one dated episode.
            Quotations from the same episode do not add weight. Changes of view
            can create new episodes; an absence of writing is unknown.
          </p>
          <p>
            Composition and publication are separate. Where composition is
            uncertain, a conservative publication-year proxy is disclosed. The
            public-only filter excludes private manuscripts and uses publication
            dates.
          </p>
        </section>
        <section>
          <span className="method-number">02</span>
          <h2>Years ahead—or behind</h2>
          <p>
            Support before a benchmark earns lead years. Opposition after it
            earns lag years. Later support and earlier opposition earn zero.
            Ambiguous or substantively unmatched claims remain unscored and are
            available in the evidence table.
          </p>
          <div className="formula">
            Support: max(adoption − writing, 0)
            <br />
            Opposition: min(adoption − writing, 0)
          </div>
          <p>
            Date ranges propagate through the lead/lag calculation. On the
            chart, support securely dated at or after the end of a reform
            interval sits at its endpoint height, with no vertical whisker.
            Earlier supportive positions sit at the time-weighted average height
            of the reference line across their reform interval; whiskers span
            that interval’s reference heights. Their x-position is the writing
            date. Opposition before a reform starts sits on the reference line
            at its writing date. At or after the start, it stays at the line’s
            height for the reform-start year, placing later opposition below the
            line. This uses the writing-date midpoint for uncertain dates and
            applies to every issue and selected benchmark. Opposition carries a
            minus sign. Numerical lead/lag scores are unchanged. Vertical
            distances are not a uniform scale of years.
          </p>
        </section>
        <section>
          <span className="method-number">03</span>
          <h2>Traditions overlap</h2>
          <p>
            Affiliation requires substantive philosophical commitment or
            framework use. Religious membership alone is insufficient. Mixed and
            contested classifications remain visible. Neutral-colored authors
            have no defensible single primary tradition in this release.
          </p>
          <p>
            Foundational, central and established figures use 3, 2.25 and 1.5 px
            connecting lines. Importance is an editorial, sourced assessment and
            never increases a ranking weight. Lines connect writings across
            issues; they do not interpolate an author’s views between them.
          </p>
        </section>
        <section>
          <span className="method-number">04</span>
          <h2>Compare with coverage in view</h2>
          <p>
            First average episodes within each person/domain. Then average
            people within each tradition/domain, using equal fractional weights
            for qualifying mixed affiliations. Finally average covered domains
            equally.
          </p>
          <p>
            Overall rankings require three core figures with scored historical
            evidence and three historical domains. Shared-domain and
            alternative-benchmark controls expose sensitivity. Small and
            selective samples cannot establish the causal superiority of an
            ethical system.
          </p>
        </section>
        <section>
          <span className="method-number">05</span>
          <h2>The future remains conditional</h2>
          <p>
            Humanity starts to take extinction risks seriously (2000–2030) is a
            stipulated interpretive window. Wild-animal welfare statutes,
            including insects (2030–2100), AI welfare statutes (2040–2100), and
            the factory-farming / veganism transition (2000–2100) are
            hypothetical. These concern proposed wider adoption, not the
            invention of the ideas.
          </p>
          <p>
            All four are provisional and excluded from historical rankings.
            Resetting scenarios restores these exact defaults. A dashed line and
            hatched region indicate dates beyond the corpus’s present-day
            boundary.
          </p>
        </section>
        <section>
          <span className="method-number">06</span>
          <h2>Sources before scores</h2>
          <p>
            Each plotted dot has a brief primary quotation, a work and locator,
            dates, witness details and an outbound source. Editorial
            interpretations and qualifications are kept apart from the author’s
            words. A checked transcription is not a claim that every manuscript
            variant has been collated.
          </p>
          <p>
            Research is incomplete and coverage is uneven. The research index
            exposes open issues and candidates. The JSON export includes the
            full corpus, current settings, calculations and algorithm version so
            the comparisons can be reproduced.
          </p>
          <a className="source-link" href="/api/research">
            Download the source corpus <ArrowDownToLine size={14} />
          </a>
        </section>
      </div>
    </section>
  );
}
