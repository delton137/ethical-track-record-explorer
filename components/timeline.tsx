"use client";
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
  arcY as arc,
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
  const [benchmarkTip, setBenchmarkTip] = useState<string | null>(null);
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
  const H = GEOMETRY.height,
    left = GEOMETRY.leftMargin,
    right = W - GEOMETRY.rightMargin;
  const from = filters.period.start,
    to = Math.max(from + 1, filters.period.end);
  const x = scaleLinear().domain([from, to]).range([left, right]);
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
  const ticks = x.ticks(
    to - from > 400 ? Math.min(12, Math.ceil((to - from) / 100)) : 7,
  );
  const clippedYear = (year: number) => Math.min(to, Math.max(from, year));
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
          aria-label="Written positions relative to the moral reference arc. Horizontal axis: writing year. Vertical offsets: lead or lag years. Use Tab to focus dots, arrow keys to move, Enter to select. An equivalent evidence table is available."
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
              height="495"
              fill="url(#future-pattern)"
            />
          )}
          {ticks
            .filter((t) => t >= from && t <= to)
            .map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1="65" y2="540" stroke="#e6ebf1" />
                <text
                  x={x(t)}
                  y="565"
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
            LEAD / LAG RELATIVE TO THE REFERENCE ARC
          </text>
          <text x={W / 2} y="604" textAnchor="middle" className="axis-title">
            YEAR OF WRITING
          </text>
          <text x="75" y="84" className="plot-direction">
            AHEAD OF THE BENCHMARK
          </text>
          <text x="75" y="106" className="chart-small">
            Higher = more years of anticipation
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
              ].indexOf(m.id);
              return (
                <g
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Benchmark: ${m.name}, ${formatYears(m.window)}`}
                  onClick={() => onBenchmark(m.id)}
                  onMouseEnter={() => setBenchmarkTip(m.id)}
                  onMouseLeave={() => setBenchmarkTip(null)}
                  onFocus={() => setBenchmarkTip(m.id)}
                  onBlur={() => setBenchmarkTip(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBenchmark(m.id);
                    }
                  }}
                  className="milestone-anchor"
                >
                  <title>{`${m.name} · ${formatYears(m.window)} · ${m.jurisdiction}`}</title>
                  <path
                    d={`M${x(clippedYear(m.window.start))},${arc(clippedYear(m.window.start))} L${x(clippedYear(m.window.end))},${arc(clippedYear(m.window.end))}`}
                    fill="none"
                    stroke="#879bb1"
                    strokeWidth="5"
                    opacity=".4"
                  />
                  <circle cx={x(t)} cy={arc(t)} r="9" fill="transparent" />
                  <circle
                    cx={x(t)}
                    cy={arc(t)}
                    r="3.5"
                    fill="#f7f9fc"
                    stroke="#9aa7b5"
                  />
                  {index >= 0 && (
                    <>
                      <line
                        x1={x(t)}
                        x2={x(t)}
                        y1={arc(t) + 8}
                        y2={arc(t) + 42 + index * 65}
                        stroke="#c9d1da"
                      />
                      <text
                        x={x(t)}
                        y={arc(t) + 58 + index * 65}
                        textAnchor="middle"
                        className="milestone-label"
                      >
                        {m.shortName}
                      </text>
                      <text
                        x={x(t)}
                        y={arc(t) + 75 + index * 65}
                        textAnchor="middle"
                        className="chart-small"
                      >
                        {formatYears(m.window)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          <g clipPath="url(#plot-clip)">
            <path
              d={`M${x(from)},${arc(from)} L${x(clippedYear(now))},${arc(clippedYear(now))}`}
              stroke="#9faab6"
              fill="none"
              strokeWidth="2"
            />
            {to > now && (
              <path
                d={`M${x(clippedYear(now))},${arc(clippedYear(now))} L${x(to)},${arc(to)}`}
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
              const label = `${f.name}: ${v.p.title}. ${formatYears(v.score.writing)}. ${v.score.min} to ${v.score.max} years ${v.score.provisional ? "(provisional)" : ""}.`;
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
                  {v.score.max !== v.score.min && (
                    <line
                      y1={-(v.score.max - v.score.midpoint) * factor}
                      y2={(v.score.midpoint - v.score.min) * factor}
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
            </text>
          ))}
          {now >= from && now <= to && (
            <g>
              <line
                x1={x(now)}
                x2={x(now)}
                y1="45"
                y2="541"
                stroke="#b2bcc9"
                strokeDasharray="3 5"
              />
              <text
                x={x(now) - 6}
                y="32"
                textAnchor="end"
                className="chart-small"
              >
                PRESENT · {now}
              </text>
            </g>
          )}
          <text
            x={x(clippedYear(1580))}
            y={arc(clippedYear(1580)) + 28}
            className="arc-label"
          >
            MORAL REFERENCE ARC
          </text>
          <text
            x={x(clippedYear(1580))}
            y={arc(clippedYear(1580)) + 47}
            className="chart-small"
          >
            An assumed direction of progress
          </text>
          <g transform="translate(80,220)">
            <line x1="0" x2="0" y1="0" y2={100 * factor} stroke="#afbbc8" />
            <line x1="-4" x2="4" y1="0" y2="0" stroke="#afbbc8" />
            <line
              x1="-4"
              x2="4"
              y1={100 * factor}
              y2={100 * factor}
              stroke="#afbbc8"
            />
            <text x="13" y={50 * factor + 4} className="chart-small">
              100 years of lead / lag
            </text>
          </g>
          {data.milestones
            .filter((m) => m.kind !== "historical")
            .map((m, index) => {
              const r = scenarios[m.id] ?? m.window;
              const y = 113 + index * 29;
              if (r.end < from || r.start > to) return null;
              const start = x(clippedYear(r.start)),
                end = x(clippedYear(r.end));
              return (
                <g
                  key={m.id}
                  className="milestone-anchor scenario-anchor"
                  role="button"
                  tabIndex={0}
                  aria-label={`${m.name}: ${formatYears(r)}, provisional window`}
                  onClick={() => onBenchmark(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBenchmark(m.id);
                    }
                  }}
                >
                  <title>{`${m.name}: ${formatYears(r)} — provisional comparison`}</title>
                  <text
                    x={Math.max(left + 200, start - 12)}
                    y={y + 4}
                    textAnchor="end"
                    className="scenario-label"
                  >
                    {m.shortName} · {formatYears(r)}
                  </text>
                  <line
                    x1={start}
                    x2={Math.max(start + 3, end)}
                    y1={y}
                    y2={y}
                    stroke="#6482a3"
                    strokeWidth="3"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={start}
                    cy={y}
                    r="3"
                    fill="white"
                    stroke="#6482a3"
                  />
                  <circle cx={end} cy={y} r="3" fill="white" stroke="#6482a3" />
                </g>
              );
            })}
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
      {benchmarkTip && (
        <div className="chart-tooltip" role="status">
          <strong>
            {data.milestones.find((m) => m.id === benchmarkTip)?.name}
          </strong>
          <span>
            {formatYears(
              data.milestones.find((m) => m.id === benchmarkTip)!.window,
            )}{" "}
            · Select to inspect benchmark
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
        <span>Filled: historical comparison</span>
        <span>
          <i className="hollow-key" /> Open: provisional scenario
        </span>
        <span>Whiskers: date uncertainty</span>
      </div>
    </div>
  );
}
