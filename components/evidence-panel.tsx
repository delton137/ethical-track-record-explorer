"use client";
import {
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import type {
  Filters,
  ResearchData,
  Scenarios,
  WrittenPosition,
} from "@/lib/types";
import { calculateScore, formatYears, IMPORTANCE_WIDTH } from "@/lib/scoring";
import { useEffect, useRef, useState } from "react";

export default function EvidencePanel({
  data,
  position,
  filters,
  scenarios,
  hidden,
  onSelect,
  onClose,
  onReveal,
}: {
  data: ResearchData;
  position: WrittenPosition;
  filters: Filters;
  scenarios: Scenarios;
  hidden: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  onReveal: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [position.id]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);
  const figure = data.figures.find((f) => f.id === position.figureId)!;
  const milestone = data.milestones.find((m) => m.id === position.milestoneId);
  const alternative =
    filters.benchmark === "alternative"
      ? milestone?.alternatives?.[0]
      : undefined;
  const score = calculateScore(
    position,
    milestone,
    scenarios,
    filters.publicOnly,
    filters.benchmark === "alternative",
  );
  const benchmarkJurisdiction =
    filters.benchmark === "alternative" && milestone?.alternatives?.length
      ? milestone.alternatives[0].jurisdiction
      : milestone?.jurisdiction;
  return (
    <aside
      className={`evidence-panel ${expanded ? "reading-fullscreen" : ""}`}
      aria-label="Primary-source evidence"
      key={position.id}
    >
      <div className="panel-top">
        <span>
          <FileText size={15} /> THE PRIMARY RECORD
        </span>
        <div>
          <button
            className="icon-button mobile-expand"
            onClick={() => setExpanded(!expanded)}
            aria-label={
              expanded ? "Exit full-screen reading" : "Read full screen"
            }
          >
            {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close evidence panel"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="panel-scroll" ref={scroll}>
        {hidden && (
          <div className="notice">
            Outside the current filters.{" "}
            <button onClick={onReveal}>Show this position</button>
          </div>
        )}
        <div className="person-heading">
          <span className="person-rule" style={{ background: figure.color }} />
          <p className="eyebrow">
            {data.domains.find((d) => d.id === position.domainId)?.name}
          </p>
          <h2>{figure.name}</h2>
          <p className="life-dates">
            {figure.born}–{figure.died ?? "present"} <span>·</span>{" "}
            {figure.context}
          </p>
        </div>
        <div className="affiliation-badges">
          {figure.affiliations.map((a) => (
            <a
              key={a.traditionId}
              href={a.sourceUrl}
              target="_blank"
              rel="noreferrer"
              title={a.basis}
              className="affiliation"
              style={{
                borderColor: data.traditions.find((t) => t.id === a.traditionId)
                  ?.color,
              }}
            >
              {data.traditions.find((t) => t.id === a.traditionId)?.shortName}
              {a.status === "contested" ? " · contested" : ""}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </div>
        <h3 className="position-title">{position.title}</h3>
        <p className="position-summary">{position.summary}</p>
        <dl className="dates-grid">
          <div>
            <dt>Writing / date proxy</dt>
            <dd>{formatYears(position.composition)}</dd>
          </div>
          <div>
            <dt>Passage publication / dated edition</dt>
            <dd>{formatYears(position.publication)}</dd>
          </div>
        </dl>
        <p className="date-note">{position.dateBasis}</p>
        <div className="status-row">
          <span
            className={`status-label ${position.visibility === "private" ? "private" : ""}`}
          >
            {position.visibility === "private"
              ? "Private at composition"
              : "Public writing"}
          </span>
          <span className="status-label">
            {position.evidence === "checked"
              ? "Text checked"
              : "Text checked · qualified"}
          </span>
        </div>
        {position.quotationIds.map((id) => {
          const quote = data.quotations.find((q) => q.id === id)!;
          const source = data.sources.find((s) => s.id === quote.sourceId)!;
          return (
            <article className="quotation-card" key={id}>
              <div className="quote-mark" aria-hidden="true">
                “
              </div>
              <blockquote>{quote.text}</blockquote>
              <p className="quote-context">
                <strong>Context.</strong> {quote.context}
              </p>
              <a
                className="source-link"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
                <ExternalLink size={15} />
              </a>
              <p className="source-locator">{quote.locator}</p>
              <details className="source-details">
                <summary>Edition, language & verification</summary>
                <dl>
                  <dt>Author</dt>
                  <dd>{source.author}</dd>
                  <dt>Edition</dt>
                  <dd>{source.edition}</dd>
                  {source.workFirstPublication && (
                    <>
                      <dt>Work first published</dt>
                      <dd>{formatYears(source.workFirstPublication)}</dd>
                    </>
                  )}
                  {source.witnessPublication && (
                    <>
                      <dt>Inspected edition published</dt>
                      <dd>{formatYears(source.witnessPublication)}</dd>
                    </>
                  )}
                  {source.datingSourceUrl && (
                    <>
                      <dt>Passage dating evidence</dt>
                      <dd>
                        <a
                          href={source.datingSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Contemporary attestation
                        </a>
                      </dd>
                    </>
                  )}
                  <dt>Original language</dt>
                  <dd>{source.originalLanguage}</dd>
                  <dt>Translation</dt>
                  <dd>{source.translation}</dd>
                  <dt>Verification</dt>
                  <dd>
                    {source.verificationNote} Checked {source.checkedOn}.
                  </dd>
                  <dt>Reuse</dt>
                  <dd>{source.reuse}</dd>
                </dl>
              </details>
            </article>
          );
        })}
        <section className="comparison-block">
          <p className="eyebrow">EDITORIAL COMPARISON</p>
          <div className="row-between">
            <h3>
              {score
                ? score.midpoint > 0
                  ? "Ahead of the benchmark"
                  : score.midpoint < 0
                    ? "Behind the benchmark"
                    : "No lead or lag"
                : "Unscored position"}
            </h3>
            {score && (
              <strong
                className={`score-pill ${score.midpoint < 0 ? "negative" : ""}`}
              >
                {score.min === score.max
                  ? `${Math.round(score.midpoint)}`
                  : `${Math.round(score.min)}–${Math.round(score.max)}`}{" "}
                <small>years</small>
              </strong>
            )}
          </div>
          {score?.provisional && (
            <p className="provisional-note">
              Provisional scenario · excluded from historical rankings
            </p>
          )}
          <p>{position.matchRationale}</p>
          {milestone && (
            <>
              <h4>{alternative?.name ?? milestone.name}</h4>
              <p className="source-locator">
                {score
                  ? formatYears(score.benchmark)
                  : formatYears(milestone.window)}{" "}
                · {benchmarkJurisdiction}
              </p>
              <p>
                {alternative
                  ? "Alternative named-jurisdiction comparison. The original reference window remains available in the benchmark register."
                  : milestone.description}
              </p>
              {(alternative
                ? [{ title: alternative.name, url: alternative.sourceUrl }]
                : milestone.sources
              ).map((s) => (
                <a
                  key={s.url}
                  className="small-source"
                  target="_blank"
                  rel="noreferrer"
                  href={s.url}
                >
                  {s.title}
                  <ExternalLink size={12} />
                </a>
              ))}
            </>
          )}
          {score && (
            <details>
              <summary>How this is calculated</summary>
              <p>{score.explanation}</p>
              <p>
                Zero means no measured anticipation or post-adoption lag. It is
                not an endorsement of the position.
              </p>
            </details>
          )}
        </section>
        <section className="qualifications">
          <h3>Qualifications & counterevidence</h3>
          {position.qualifications.length > 0 && (
            <ul>
              {position.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          )}
          <p>{position.counterevidence}</p>
          {position.revisionOf && (
            <button
              className="text-button"
              onClick={() => onSelect(position.revisionOf!)}
            >
              Read the earlier position →
            </button>
          )}
        </section>
        <details className="source-details">
          <summary>Affiliation & historical importance</summary>
          {figure.affiliations.map((a) => (
            <p key={a.traditionId}>
              {a.basis}{" "}
              <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                Evidence ↗
              </a>
            </p>
          ))}
          <p>
            <strong className="capitalize">{figure.importance.level}</strong> ·{" "}
            {IMPORTANCE_WIDTH[figure.importance.level]} px line.{" "}
            {figure.importance.rationale}{" "}
            <a
              href={figure.importance.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source ↗
            </a>
          </p>
        </details>
        <section className="other-positions">
          <h3>More from {figure.name.split(" ").slice(-1)}</h3>
          {data.positions
            .filter((p) => p.figureId === figure.id && p.id !== position.id)
            .map((p) => (
              <button key={p.id} onClick={() => onSelect(p.id)}>
                <span>
                  {p.title}
                  <small>
                    {formatYears(p.composition)} ·{" "}
                    {data.domains.find((d) => d.id === p.domainId)?.shortName}
                  </small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          {data.positions.filter((p) => p.figureId === figure.id).length ===
            1 && (
            <p className="subtle">
              One position documented so far. Other issues remain unknown.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
