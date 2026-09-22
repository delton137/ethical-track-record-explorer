"use client";
import { progressColor } from "@/lib/progress-colors";
import { scaleLinear } from "d3-scale";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Filters,
  ResearchData,
  Scenarios,
  WrittenPosition,
} from "@/lib/types";
import {
  calculateScore,
  formatYears,
  IMPORTANCE_WIDTH,
  midpoint,
} from "@/lib/scoring";
import {
  GEOMETRY,
  displayYear,
  referenceYears,
  arcY,
  leadLagFactor,
  positionCoordinates,
} from "@/lib/geometry";

type Props = {
  data: ResearchData;
  positions: WrittenPosition[];
  filters: Filters;
  scenarios: Scenarios;
  selected: string | null;
  onSelect: (id: string) => void;
  onBenchmark: (id: string) => void;
};
export default function Timeline({
  data,
  positions,
  filters,
  scenarios,
  selected,
  onSelect,
  onBenchmark,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [overlap, setOverlap] = useState<WrittenPosition[]>([]);
  const [tip, setTip] = useState<WrittenPosition | null>(null);
  const [benchmarkTip, setBenchmarkTip] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const nodes = useRef(new Map<string, SVGGElement>());
  const container = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const [W, setWidth] = useState(920);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(720, Math.round(entry.contentRect.width))),
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (overlap.length)
      picker.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [overlap]);
  const arc = (year: number) => arcY(year, W, filters.period);
  const H = Math.max(GEOMETRY.height, arc(filters.period.start) + 150),
    left = GEOMETRY.leftMargin,
    right = W - GEOMETRY.rightMargin;
  const from = filters.period.start,
    to = Math.max(from + 1, filters.period.end);
  const timeScale = scaleLinear()
    .domain([displayYear(from), displayYear(to)])
    .range([left, right]);
  const x = (year: number) => timeScale(displayYear(year));
  const allScores = data.positions.map((p) =>
    calculateScore(
      p,
      data.milestones.find((m) => m.id === p.milestoneId),
      scenarios,
      filters.publicOnly,
      filters.benchmark === "alternative",
    ),
  );
  const factor = leadLagFactor(allScores);
  const points = positions
    .flatMap((p) => {
      const score = calculateScore(
        p,
        data.milestones.find((m) => m.id === p.milestoneId),
        scenarios,
        filters.publicOnly,
        filters.benchmark === "alternative",
      );
      if (!score) return [];
      const coordinates = positionCoordinates(score, filters.period, W, factor);
      if (!coordinates.inPeriod) return [];
      return [{ p, score, ...coordinates }];
    })
    .sort((a, b) => a.year - b.year || a.p.id.localeCompare(b.p.id));
  const selectedPerson = data.positions.find(
    (p) => p.id === selected,
  )?.figureId;
  const focused = hovered ?? selectedPerson;
  const byFigure = useMemo(
    () => new Map(data.figures.map((f) => [f.id, f])),
    [data.figures],
  );
  const groups = [...new Set(points.map((p) => p.p.figureId))].map((id) => ({
    figure: byFigure.get(id)!,
    points: points
      .filter((p) => p.p.figureId === id)
      .sort((a, b) => a.year - b.year || a.p.id.localeCompare(b.p.id)),
  }));
  const now = new Date(data.asOf).getUTCFullYear();
  const ticks = scaleLinear()
    .domain([from, to])
    .ticks(to - from > 400 ? Math.min(12, Math.ceil((to - from) / 100)) : 7);
  const clippedYear = (year: number) => Math.min(to, Math.max(from, year));
  const referencePath = (start: number, end: number) =>
    referenceYears(clippedYear(start), clippedYear(end))
      .map((year, i) => `${i ? "L" : "M"}${x(year)},${arc(year)}`)
      .join(" ");
  const choose = (p: WrittenPosition) => {
    const a = points.find((v) => v.p.id === p.id)!;
    const near = points
      .filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 11)
      .map((b) => b.p);
    if (near.length > 1) setOverlap(near);
    else onSelect(p.id);
  };
  const labelPoints = points.filter((v) => v.p.figureId === focused);
  return (
    <div className="timeline-wrap" ref={container}>
      <div className="chart-instructions">
        <span>
          <i className="key-dot" /> One dot = one written position
        </span>
        <span className="subtle">Select a dot to read the evidence</span>
      </div>
      <p className="mobile-chart-hint">
        Swipe horizontally through the timeline, or switch to Table.
      </p>
      <div
        className="timeline-scroll"
        tabIndex={0}
        aria-label="Scrollable timeline"
      >
        <svg
          className="timeline"
          style={{ width: W }}
          viewBox={`0 0 ${W} ${H}`}
          role="group"
          aria-label="Written positions relative to the moral reference arc. Horizontal axis: writing year. Support uses the average reference height of its reform interval; opposition sits below the interval and has a minus sign. Use Tab to focus dots, arrow keys to move, Enter to select. An equivalent evidence table is available."
        >
          <defs>
            <pattern
              id="future-pattern"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 7L7 0" stroke="#e4e9f0" strokeWidth=".65" />
            </pattern>
            <clipPath id="plot-clip">
              <rect
                x={left - 8}
                y={30}
                width={right - left + 16}
                height={H - 105}
              />
            </clipPath>
          </defs>
          {to > now && (
            <rect
              x={x(clippedYear(now))}
              y="42"
              width={Math.max(0, right - x(clippedYear(now)))}
              height={H - 103}
              fill="url(#future-pattern)"
            />
          )}
          {ticks
            .filter((t) => t >= from && t <= to)
            .map((t) => (
              <g key={t}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1="65"
                  y2={H - 100}
                  stroke="#e6ebf1"
                />
                <text
                  x={x(t)}
                  y={H - 75}
                  textAnchor="middle"
                  className="axis-label"
                >
                  {t}
                </text>
              </g>
            ))}
          <text
            x="27"
            y="324"
            transform="rotate(-90 27 324)"
            className="axis-title"
          >
            ILLUSTRATIVE REFORM LEVEL
          </text>
          <text x={W / 2} y={H - 36} textAnchor="middle" className="axis-title">
            Year
          </text>
          {data.milestones
            .filter((m) => m.kind === "historical")
            .map((m) => {
              const t = midpoint(m.window);
              if (t < from || t > to) return null;
              const index = [
                "abolition",
                "votes-for-women",
                "decriminalization",
                "religious-freedom",
                "execution-abolition",
                "child-protection",
              ].indexOf(m.id);
              const labelAbove = [
                "religious-freedom",
                "execution-abolition",
                "decriminalization",
                "child-protection",
              ].includes(m.id);
              const labelX =
                m.id === "child-protection"
                  ? left + (right - left) * 0.37
                  : m.id === "religious-freedom"
                    ? left + (right - left) * 0.25 + 40
                    : m.id === "decriminalization"
                      ? left + (right - left) * 0.75
                      : x(t);
              const labelY =
                m.id === "child-protection"
                  ? 350
                  : m.id === "religious-freedom"
                    ? 190
                    : m.id === "execution-abolition"
                      ? 112
                      : m.id === "decriminalization"
                        ? 235
                        : m.id === "votes-for-women"
                          ? 750
                          : arc(t) + 58 + index * 65;
              return (
                <g
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Progress interval / date: ${m.name}, ${formatYears(m.window)}`}
                  onClick={() => onBenchmark(m.id)}
                  onMouseEnter={() =>
                    setBenchmarkTip({ id: m.id, x: labelX, y: labelY })
                  }
                  onMouseLeave={() => setBenchmarkTip(null)}
                  onFocus={() =>
                    setBenchmarkTip({ id: m.id, x: labelX, y: labelY })
                  }
                  onBlur={() => setBenchmarkTip(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBenchmark(m.id);
                    }
                  }}
                  className="milestone-anchor"
                  style={{ color: progressColor(m.id) }}
                >
                  <title>{`${m.name} · ${formatYears(m.window)} · ${m.jurisdiction}`}</title>
                  {m.reforms && (
                    <path
                      className="progress-shaded-region"
                      d={`${referencePath(m.window.start, m.window.end)} ${referenceYears(
                        clippedYear(m.window.start),
                        clippedYear(m.window.end),
                      )
                        .reverse()
                        .map(
                          (year) =>
                            `L${x(year)},${arc(year) + (labelAbove ? -18 : 18)}`,
                        )
                        .join(" ")} Z`}
                      fill="currentColor"
                      opacity=".12"
                    />
                  )}
                  <path
                    d={referencePath(m.window.start, m.window.end)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    opacity=".85"
                  />
                  <circle cx={x(t)} cy={arc(t)} r="9" fill="transparent" />
                  <circle
                    cx={x(t)}
                    cy={arc(t)}
                    r="3.5"
                    fill="#f7f9fc"
                    stroke="currentColor"
                  />
                  {index >= 0 && (
                    <>
                      <line
                        x1={labelX}
                        x2={x(t)}
                        y1={labelAbove ? labelY + 12 : arc(t) + 8}
                        y2={labelAbove ? arc(t) - 8 : labelY - 16}
                        stroke="currentColor"
                      />

                      <rect
                        x={labelX - 125}
                        y={labelY - 14}
                        width={250}
                        height={
                          benchmarkTip?.id === m.id
                            ? 56 + (m.reforms?.length ?? 1) * 14
                            : 22
                        }
                        fill="transparent"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        className="milestone-label"
                      >
                        {m.shortName}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          <g clipPath="url(#plot-clip)">
            <path
              d={referencePath(from, now)}
              stroke="#9faab6"
              fill="none"
              strokeWidth="2"
            />
            {to > now && (
              <path
                d={referencePath(now, Math.min(to, 2100))}
                stroke="#9faab6"
                fill="none"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            )}
            {groups.map(({ figure, points: ps }) => (
              <polyline
                key={figure.id}
                data-figure={figure.id}
                points={ps.map((p) => `${p.x},${p.y}`).join(" ")}
                stroke={figure.color}
                fill="none"
                strokeWidth={IMPORTANCE_WIDTH[figure.importance.level]}
                opacity={focused && focused !== figure.id ? 0.12 : 0.7}
                className="author-line"
              />
            ))}
            {points.map((v, index) => {
              const f = byFigure.get(v.p.figureId)!;
              const active = v.p.id === selected;
              const dim = focused && focused !== f.id;
              const label = `${f.name}: ${v.p.stance === "opposes" ? "Opposes reform. " : "Supports reform. "}${v.p.title}. ${formatYears(v.score.writing)}. ${v.score.min} to ${v.score.max} years ${v.score.provisional ? "(provisional)" : ""}.`;
              return (
                <g
                  key={v.p.id}
                  ref={(node) => {
                    if (node) nodes.current.set(v.p.id, node);
                    else nodes.current.delete(v.p.id);
                  }}
                  transform={`translate(${v.x},${v.y})`}
                  className={`position-dot ${active ? "is-selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  aria-pressed={active}
                  data-position={v.p.id}
                  onMouseEnter={() => {
                    setHovered(f.id);
                    setTip(v.p);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    setTip(null);
                  }}
                  onFocus={() => {
                    setHovered(f.id);
                    setTip(v.p);
                  }}
                  onBlur={() => {
                    setHovered(null);
                    setTip(null);
                  }}
                  onClick={() => choose(v.p)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      choose(v.p);
                    }
                    if (
                      [
                        "ArrowRight",
                        "ArrowLeft",
                        "ArrowDown",
                        "ArrowUp",
                      ].includes(event.key)
                    ) {
                      event.preventDefault();
                      const offset = ["ArrowRight", "ArrowDown"].includes(
                        event.key,
                      )
                        ? 1
                        : -1;
                      const next =
                        points[
                          (index + offset + points.length) % points.length
                        ];
                      nodes.current.get(next.p.id)?.focus();
                    }
                    if (event.key === "Escape") {
                      setOverlap([]);
                      setTip(null);
                    }
                  }}
                >
                  <title>{label}</title>
                  <circle r="12" fill="transparent" />
                  {active && (
                    <circle
                      r="11"
                      fill="white"
                      stroke={f.color}
                      strokeWidth="1.8"
                    />
                  )}
                  {v.uncertaintyTopY !== v.uncertaintyBottomY && (
                    <line
                      y1={v.uncertaintyTopY - v.y}
                      y2={v.uncertaintyBottomY - v.y}
                      stroke={f.color}
                      strokeWidth="1"
                      opacity={dim ? 0.12 : 0.5}
                    />
                  )}
                  <circle
                    r={active ? 6 : 5.4}
                    fill={v.score.provisional ? "#fff" : f.color}
                    stroke={f.color}
                    strokeWidth={v.score.provisional ? 2 : 1.3}
                    opacity={dim ? 0.22 : 1}
                  />
                  {v.p.stance === "opposes" && (
                    <path
                      d="M-2.5 0h5"
                      stroke={v.score.provisional ? f.color : "white"}
                      strokeWidth="1.6"
                    />
                  )}
                </g>
              );
            })}
          </g>
          {labelPoints.map((v, i) => (
            <text
              key={v.p.id}
              x={v.x > right - 175 ? v.x - 14 : v.x + 14}
              y={v.y + (i % 2 ? 20 : -14)}
              textAnchor={v.x > right - 175 ? "end" : "start"}
              className="point-label"
              fill={byFigure.get(v.p.figureId)!.color}
              pointerEvents="none"
            >
              {byFigure.get(v.p.figureId)!.name.split(" ").slice(-1)} ·{" "}
              {data.domains.find((d) => d.id === v.p.domainId)?.shortName}
              {v.p.stance === "opposes" ? " (opposes reform)" : ""}
            </text>
          ))}
          {now >= from && now <= to && (
            <g>
              <line
                x1={x(now)}
                x2={x(now)}
                y1="45"
                y2={H - 99}
                stroke="#b2bcc9"
                strokeDasharray="3 5"
              />
            </g>
          )}
          {data.milestones.flatMap((m) =>
            (m.reforms ?? [])
              .filter((r) => r.year >= from && r.year <= to)
              .map((r) => (
                <g
                  key={`${m.id}-${r.year}-${r.jurisdiction}`}
                  className="reform-marker"
                  style={{ color: progressColor(m.id) }}
                >
                  <title>{`${r.year} — ${r.jurisdiction}: ${r.change}`}</title>
                  <line
                    x1={x(r.year)}
                    x2={x(r.year)}
                    y1={arc(r.year) - 7}
                    y2={arc(r.year) + 7}
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx={x(r.year)}
                    cy={arc(r.year)}
                    r="3"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </g>
              )),
          )}
          {data.milestones
            .filter((m) => m.kind !== "historical")
            .map((m) => {
              const r = scenarios[m.id] ?? m.window;
              {
                if (r.end < from || r.start > to) return null;
                const below = m.id === "ai-welfare";
                const middle = clippedYear(midpoint(r));
                const labelX = Math.max(
                  left + 100,
                  Math.min(right - 100, x(middle)),
                );
                const labelY =
                  arc(middle) + (below ? 130 : m.reforms?.length ? -110 : -145);
                return (
                  <g
                    key={m.id}
                    className="milestone-anchor scenario-anchor scenario-region"
                    style={{ color: progressColor(m.id) }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${m.name}: ${formatYears(r)}, provisional interval`}
                    onClick={() => onBenchmark(m.id)}
                    onMouseEnter={() =>
                      setBenchmarkTip({ id: m.id, x: labelX, y: labelY })
                    }
                    onMouseLeave={() => setBenchmarkTip(null)}
                    onFocus={() =>
                      setBenchmarkTip({ id: m.id, x: labelX, y: labelY })
                    }
                    onBlur={() => setBenchmarkTip(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onBenchmark(m.id);
                      }
                    }}
                  >
                    <title>{`${m.name}: ${formatYears(r)} — illustrative scenario`}</title>
                    <path
                      className="progress-shaded-region"
                      d={`${referencePath(r.start, r.end)} ${referenceYears(
                        clippedYear(r.start),
                        clippedYear(r.end),
                      )
                        .reverse()
                        .map(
                          (year) =>
                            `L${x(year)},${arc(year) + (below ? 18 : -18)}`,
                        )
                        .join(" ")} Z`}
                      fill="currentColor"
                      opacity=".24"
                    />
                    <path
                      d={referencePath(r.start, r.end)}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="4 3"
                    />
                    <line
                      x1={labelX}
                      x2={x(middle)}
                      y1={below ? labelY - 14 : labelY + 12}
                      y2={arc(middle) + (below ? 8 : -8)}
                      stroke="currentColor"
                    />
                    <circle
                      cx={x(middle)}
                      cy={arc(middle)}
                      r="3.5"
                      fill="white"
                      stroke="currentColor"
                    />
                    <rect
                      x={labelX - 125}
                      y={labelY - 14}
                      width={250}
                      height={
                        benchmarkTip?.id === m.id
                          ? 56 + (m.reforms?.length ?? 1) * 14
                          : 22
                      }
                      fill="transparent"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      className="milestone-label"
                    >
                      {m.shortName}
                    </text>
                  </g>
                );
              }
            })}
          {benchmarkTip &&
            (() => {
              const m = data.milestones.find(
                (item) => item.id === benchmarkTip.id,
              )!;
              const range = scenarios[m.id] ?? m.window;
              const lines =
                m.reforms?.map(
                  (event) => `${event.year} — ${event.chartLabel}`,
                ) ??
                (m.id === "ai-welfare"
                  ? ["Hypothetical future interval"]
                  : m.id === "wild-welfare"
                    ? ["Including insect welfare · provisional"]
                    : []);
              const center = Math.max(130, Math.min(W - 130, benchmarkTip.x));
              return (
                <g
                  className="progress-date-popup"
                  role="tooltip"
                  pointerEvents="none"
                  style={{ color: progressColor(m.id) }}
                >
                  <rect
                    x={center - 125}
                    y={benchmarkTip.y + 7}
                    width={250}
                    height={34 + lines.length * 14}
                    rx={5}
                    fill="#fff"
                    stroke="currentColor"
                    strokeOpacity=".3"
                  />
                  <text
                    x={center}
                    y={benchmarkTip.y + 26}
                    textAnchor="middle"
                    className="chart-small"
                    style={{ fill: "currentColor" }}
                  >
                    {formatYears(range)}
                  </text>
                  {lines.map((line, i) => (
                    <text
                      key={line}
                      x={center}
                      y={benchmarkTip.y + 43 + i * 14}
                      textAnchor="middle"
                      className="reform-date-label"
                      style={{ fill: "currentColor" }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })()}
        </svg>
      </div>
      {tip && (
        <div className="chart-tooltip" role="status">
          <strong>{byFigure.get(tip.figureId)?.name}</strong>
          <span>
            {tip.title} · {formatYears(tip.composition)}
          </span>
        </div>
      )}
      {overlap.length > 0 && (
        <div
          ref={picker}
          className="overlap-picker"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOverlap([]);
              nodes.current.get(overlap[0]?.id)?.focus();
            }
          }}
          role="dialog"
          aria-label="Choose an overlapping position"
        >
          <div className="row-between">
            <strong>{overlap.length} overlapping positions</strong>
            <button
              onClick={() => setOverlap([])}
              aria-label="Close overlapping positions"
            >
              ×
            </button>
          </div>
          <p>These positions share the same chart location.</p>
          {overlap.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelect(p.id);
                setOverlap([]);
              }}
            >
              <span style={{ color: byFigure.get(p.figureId)?.color }}>●</span>{" "}
              {byFigure.get(p.figureId)?.name}
              <small>{p.title}</small>
            </button>
          ))}
        </div>
      )}
      {!points.length && (
        <div className="chart-empty">
          <strong>No scored positions match these filters.</strong>
          <p>
            Try a wider period or use the evidence table to inspect unmatched
            writings.
          </p>
        </div>
      )}
      <div className="chart-caption">
        <span>1500–1700 uses a compressed time scale</span>
        <span>Filled: historical comparison</span>
        <span>
          <i className="hollow-key" /> Open: provisional scenario
        </span>
        <span>
          Support: average reform height · Opposition: below interval, minus
          sign
        </span>
      </div>
    </div>
  );
}
