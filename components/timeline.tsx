"use client";
import { progressColor } from "@/lib/progress-colors";
import { scaleLinear } from "d3-scale";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Filters,
  ResearchData,
  Scenarios,
  WrittenPosition,
  YearRange,
} from "@/lib/types";
import {
  calculateScore,
  formatYears,
  IMPORTANCE_WIDTH,
  midpoint,
} from "@/lib/scoring";
import {
  GEOMETRY,
  buildTimelineAxis,
  axisX,
  referenceYears,
  arcY,
  leadLagFactor,
  positionCoordinates,
  spreadScripturePositions,
} from "@/lib/geometry";

import { formatYear } from "@/lib/dates";

// Three-pixel strokes touch adjacent lanes and the two-pixel central arc.
const INTERVAL_OFFSETS: Record<string, number> = {
  abolition: 2.5,
  "racial-equality": -14.5,
  "self-determination": -11.5,
  "women-equality": 2.5,
  "votes-for-women": 2.5,
  "religious-freedom": -2.5,
  decriminalization: -11.5,
  "marriage-equality": 2.5,
  "torture-ban": -2.5,
  "execution-abolition": -8.5,
  "child-protection": -5.5,
  "animal-protection": 5.5,
  "farm-welfare": 5.5,
  "factory-farming-transition": 5.5,
  "extinction-concern": -2.5,
  "wild-welfare": -2.5,
  "ai-welfare": 2.5,
};
const intervalOffset = (id: string) => INTERVAL_OFFSETS[id] ?? 2.5;

type Props = {
  data: ResearchData;
  positions: WrittenPosition[];
  filters: Filters;
  scenarios: Scenarios;
  selected: string | null;
  showVerticalBars: boolean;
  onSelect: (id: string) => void;
  onBenchmark: (id: string) => void;
};
export default function Timeline({
  data,
  positions,
  filters,
  scenarios,
  selected,
  showVerticalBars,
  onSelect,
  onBenchmark,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [overlap, setOverlap] = useState<WrittenPosition[]>([]);
  const [breakTip, setBreakTip] = useState<YearRange | null>(null);
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
  const left = GEOMETRY.leftMargin,
    right = W - GEOMETRY.rightMargin;
  // Remove the headroom freed by lowering the upper progress labels.
  const viewTop = 130;
  const plotTop = viewTop + 65;
  const from = filters.period.start,
    to = Math.max(from + 1, filters.period.end);
  const axis = useMemo(
    () => buildTimelineAxis(data, filters.period, W),
    [data, filters.period, W],
  );
  const x = (year: number) => axisX(axis, year);
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
  const rawPoints = data.positions
    .flatMap((p) => {
      const score = calculateScore(
        p,
        data.milestones.find((m) => m.id === p.milestoneId),
        scenarios,
        filters.publicOnly,
        filters.benchmark === "alternative",
      );
      if (!score) return [];
      const coordinates = positionCoordinates(
        score,
        filters.period,
        W,
        factor,
        axis,
      );
      if (!coordinates.inPeriod) return [];
      return [{ p, score, ...coordinates }];
    })
    .sort((a, b) => a.year - b.year || a.p.id.localeCompare(b.p.id));
  const spread = spreadScripturePositions(
    data,
    new Map(rawPoints.map((p) => [p.p.id, p])),
    filters.period,
    W,
  );
  const visibleIds = new Set(positions.map((p) => p.id));
  const points = rawPoints
    .filter((p) => visibleIds.has(p.p.id))
    .map((p) => ({ ...p, ...spread.get(p.p.id)! }));
  const H = Math.max(
    GEOMETRY.height,
    arc(filters.period.start) + 150,
    ...[...spread.values()].map((p) => p.y + 170),
  );
  const selectedPerson = data.positions.find(
    (p) => p.id === selected,
  )?.figureId;
  const focused = hovered ?? selectedPerson;
  const traditionSelected = filters.traditionIds.some((id) => id !== "none");
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
  const modernTicks =
    to >= 1500
      ? scaleLinear()
          .domain([Math.max(from, 1500), to])
          .ticks(7)
      : [];
  const ancientTicks = axis.segments
    .filter((s) => s.kind === "time" && s.start < 1500)
    .map((s) =>
      s.start <= 0
        ? 1 - Math.floor((1 - s.start) / 100) * 100
        : Math.ceil(s.start / 100) * 100,
    )
    .filter(
      (t) => t < 1500 && !axis.breaks.some((b) => t > b.start && t < b.end),
    );
  const ticks = [...new Set([...ancientTicks, ...modernTicks])]
    .sort((a, b) => a - b)
    .filter((t, i, all) => i === 0 || x(t) - x(all[i - 1]) >= 35);
  const clippedYear = (year: number) => Math.min(to, Math.max(from, year));
  const referencePath = (start: number, end: number, offset = 0) =>
    [
      ...new Set([
        ...referenceYears(clippedYear(start), clippedYear(end)),
        ...axis.segments
          .flatMap((s) => [s.start, s.end])
          .filter(
            (year) => year > clippedYear(start) && year < clippedYear(end),
          ),
      ]),
    ]
      .sort((a, b) => a - b)
      .map((year, i) => `${i ? "L" : "M"}${x(year)},${arc(year) + offset}`)
      .join(" ");
  const windowArrows = (
    range: YearRange,
    labelY: number,
    provisional = false,
  ) => (
    <g
      className="progress-window-arrows"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      pointerEvents="none"
      aria-hidden="true"
    >
      {[range.start, range.end].map((year, i) => (
        <line
          key={i}
          x1={(x(clippedYear(range.start)) + x(clippedYear(range.end))) / 2}
          y1={labelY + 30}
          x2={x(clippedYear(year))}
          y2={labelY + 30}
          markerEnd="url(#progress-window-arrowhead)"
          strokeDasharray={provisional ? "4 3" : undefined}
        />
      ))}
    </g>
  );
  const historicalIntervals = data.milestones
    .filter((m) => m.kind === "historical")
    .sort(
      (a, b) =>
        Number(a.id === "execution-abolition") -
        Number(b.id === "execution-abolition"),
    )
    .flatMap((m) => {
      if (m.window.end < from || m.window.start > to) return [];
      const t = clippedYear(midpoint(m.window));
      const offset = intervalOffset(m.id);
      const index = [
        "abolition",
        "votes-for-women",
        "decriminalization",
        "religious-freedom",
        "execution-abolition",
        "child-protection",
        "animal-protection",
        "racial-equality",
      ].indexOf(m.id);
      const labelX =
        (x(clippedYear(m.window.start)) + x(clippedYear(m.window.end))) / 2;
      const labelY =
        m.id === "animal-protection"
          ? H - 385
          : m.id === "child-protection"
            ? 480
            : m.id === "religious-freedom"
              ? 320
              : m.id === "execution-abolition"
                ? 242
                : m.id === "decriminalization"
                  ? 380
                  : m.id === "votes-for-women"
                    ? H - 475
                    : m.id === "racial-equality"
                      ? 310
                      : arc(t) + 58 + index * 65;
      return [{ m, index, offset, labelX, labelY }];
    });
  const choose = (p: WrittenPosition) => {
    const a = points.find((v) => v.p.id === p.id)!;
    const near = points
      .filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 11)
      .map((b) => b.p);
    if (near.length > 1) setOverlap(near);
    else onSelect(p.id);
  };
  const labelPoints = points.filter((v) => v.p.figureId === focused);
  const scriptureLabelX = Math.max(left, ...labelPoints.map((p) => p.x)) + 18;
  const scriptureLabelY = new Map<string, number>();
  let lastLabelY = -Infinity;
  for (const point of labelPoints
    .filter((p) => byFigure.get(p.p.figureId)!.kind === "scripture")
    .sort((a, b) => a.y - b.y || a.p.id.localeCompare(b.p.id))) {
    const y = Math.max(point.y + 4, lastLabelY + 18);
    scriptureLabelY.set(point.p.id, y);
    lastLabelY = y;
  }

  return (
    <div className="timeline-wrap" ref={container}>
      <div className="chart-instructions">
        <span>
          <i className="key-dot" /> One dot = one documented position
        </span>
        <span className="subtle">Select a dot to read quotes</span>
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
          viewBox={`0 ${viewTop} ${W} ${H - viewTop}`}
          role="group"
          aria-label="Written positions relative to the moral reference arc. Horizontal axis: historical date. Before 1500 uses a compressed Ancient section; marked breaks compress empty gaps. The reference line rises gently from 800 BCE through 1700. Scores use actual dates. Colored parallel lines above and below the central arc show reform intervals; dashed interval lines are provisional scenarios. Support after the reform interval uses its endpoint height; earlier support uses the average interval height; opposition before reform sits on the line at its writing midpoint, while opposition at or after reform starts stays at the reform-start height. Opposition has a minus sign. Use Tab to focus dots, arrow keys to move, Enter to select. An equivalent evidence table is available."
        >
          <defs>
            <marker
              id="progress-window-arrowhead"
              viewBox="0 0 7 7"
              refX="6"
              refY="3.5"
              markerWidth="7"
              markerHeight="7"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path
                d="M1 1 L6 3.5 L1 6"
                fill="none"
                stroke="context-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
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
                y={viewTop + 30}
                width={right - left + 16}
                height={H - viewTop - 105}
              />
            </clipPath>
            <mask id="axis-break-mask">
              <rect width={W} height={H} fill="white" />
              {axis.breaks.map((b) => (
                <rect
                  key={b.start}
                  x={b.x0 + 1}
                  y={0}
                  width={Math.max(0, b.x1 - b.x0 - 2)}
                  height={H}
                  fill="black"
                />
              ))}
            </mask>
          </defs>
          {to > now && (
            <rect
              x={x(clippedYear(now))}
              y={viewTop + 42}
              width={Math.max(0, right - x(clippedYear(now)))}
              height={H - viewTop - 103}
              fill="url(#future-pattern)"
            />
          )}
          {benchmarkTip &&
            (() => {
              const milestone = data.milestones.find(
                (m) => m.id === benchmarkTip.id,
              );
              if (!milestone) return null;
              const range = scenarios[milestone.id] ?? milestone.window;
              const start = clippedYear(range.start);
              const end = clippedYear(range.end);
              const offset = intervalOffset(milestone.id);
              const edge = offset > 0 ? H - 100 : plotTop;
              return (
                <path
                  className="progress-hover-highlight"
                  data-milestone={milestone.id}
                  d={`${referencePath(start, end, offset)} L${x(end)},${edge} L${x(start)},${edge} Z`}
                  fill={progressColor(milestone.id)}
                  fillOpacity=".12"
                  pointerEvents="none"
                />
              );
            })()}
          {ticks
            .filter((t) => t >= from && t <= to)
            .map((t) => (
              <g key={t}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1={plotTop}
                  y2={H - 100}
                  stroke="#e6ebf1"
                />
                <text
                  x={x(t)}
                  y={
                    t < 1500 &&
                    axis.ancientEndX !== null &&
                    axis.ancientEndX - x(t) < 60
                      ? H - 62
                      : H - 75
                  }
                  textAnchor="middle"
                  className="axis-label"
                >
                  {formatYear(t)}
                </text>
              </g>
            ))}
          <path
            className="chart-axes"
            mask="url(#axis-break-mask)"
            d={`M${left},${plotTop} V${H - 100} H${right} M${left - 5},${plotTop + 8} L${left},${plotTop} L${left + 5},${plotTop + 8} M${right - 8},${H - 105} L${right},${H - 100} L${right - 8},${H - 95}`}
            fill="none"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <text
            x="27"
            y={(plotTop + H - 100) / 2}
            transform={`rotate(-90 27 ${(plotTop + H - 100) / 2})`}
            textAnchor="middle"
            className="axis-title"
            style={{ fill: "black" }}
          >
            ethical progress →
          </text>
          {axis.ancientEndX !== null && (
            <g className="ancient-section">
              <line
                x1={axis.ancientEndX}
                x2={axis.ancientEndX}
                y1={plotTop}
                y2={H - 100}
                stroke="#aeb8c5"
                strokeDasharray="3 5"
              />
              <text
                x={(left + axis.ancientEndX) / 2}
                y={H - 49}
                textAnchor="middle"
                className="axis-title"
              >
                Ancient
              </text>
            </g>
          )}
          <text
            x={
              axis.ancientEndX === null ? W / 2 : (axis.ancientEndX + right) / 2
            }
            y={H - 36}
            textAnchor="middle"
            className="axis-title"
            style={{ fill: "black" }}
          >
            Year
          </text>
          {historicalIntervals
            .filter(({ index }) => index >= 0)
            .map(({ m, labelY }) => (
              <g
                key={m.id}
                data-window={m.id}
                style={{ color: progressColor(m.id) }}
              >
                {windowArrows(m.window, labelY)}
              </g>
            ))}
          {historicalIntervals.map(({ m, index, offset, labelX, labelY }) => {
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
                <path
                  className="progress-interval-hit"
                  d={referencePath(m.window.start, m.window.end, offset)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="3"
                  pointerEvents="stroke"
                />
                <path
                  className="progress-interval-line"
                  data-milestone={m.id}
                  data-offset={offset}
                  d={referencePath(m.window.start, m.window.end, offset)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={benchmarkTip?.id === m.id ? 5 : 3}
                  strokeLinecap="round"
                  pointerEvents="none"
                />
                {index >= 0 && (
                  <>
                    <rect
                      x={labelX - 125}
                      y={
                        labelY -
                        ([
                          "decriminalization",
                          "animal-protection",
                          "racial-equality",
                        ].includes(m.id)
                          ? 29
                          : 14)
                      }
                      width={250}
                      height={
                        (benchmarkTip?.id === m.id
                          ? 73 + (m.reforms?.length ?? 1) * 14
                          : 52) +
                        ([
                          "decriminalization",
                          "animal-protection",
                          "racial-equality",
                        ].includes(m.id)
                          ? 15
                          : 0)
                      }
                      fill="transparent"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      className="milestone-label"
                    >
                      {m.id === "racial-equality" ? (
                        <>
                          <tspan x={labelX} y={labelY - 15}>
                            Racial equality
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            under the law
                          </tspan>
                        </>
                      ) : m.id === "decriminalization" ? (
                        <>
                          <tspan x={labelX} y={labelY - 15}>
                            Homosexuality
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            decriminalization
                          </tspan>
                        </>
                      ) : m.id === "animal-protection" ? (
                        <>
                          <tspan x={labelX} y={labelY - 15}>
                            Animal legal
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            protection
                          </tspan>
                        </>
                      ) : (
                        m.shortName
                      )}
                    </text>
                    <text
                      x={labelX}
                      y={labelY + 17}
                      textAnchor="middle"
                      className="chart-small progress-date-span"
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
              data-reference="historical"
              mask="url(#axis-break-mask)"
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
                opacity={
                  traditionSelected
                    ? 1
                    : focused && focused !== figure.id
                      ? 0.12
                      : 0.7
                }
                className="author-line"
                pointerEvents="none"
                mask="url(#axis-break-mask)"
              />
            ))}
            {points.map((v, index) => {
              const f = byFigure.get(v.p.figureId)!;
              const active = v.p.id === selected;
              const dim = !traditionSelected && focused && focused !== f.id;
              const label = `${f.name}: ${v.p.stance === "opposes" ? "Opposes reform. " : "Supports reform. "}${v.p.title}. ${formatYears(v.score.writing)}. ${v.score.min} to ${v.score.max} weighted years (ethical foresight) ${v.score.provisional ? "(provisional)" : ""}.`;
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
                  data-scored={Boolean(v.score)}
                  data-display-offset={v.displayOffsetY}
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
                  {v.uncertaintyLeftX !== v.uncertaintyRightX && (
                    <line
                      className="writing-uncertainty"
                      x1={v.uncertaintyLeftX - v.x}
                      x2={v.uncertaintyRightX - v.x}
                      y1={0}
                      y2={0}
                      stroke={f.color}
                      strokeWidth="1.5"
                      opacity={dim ? 0.12 : 0.55}
                      pointerEvents="none"
                    />
                  )}
                  {showVerticalBars &&
                    v.uncertaintyTopY !== v.uncertaintyBottomY && (
                      <line
                        className="reform-uncertainty"
                        y1={v.uncertaintyTopY - v.y}
                        y2={v.uncertaintyBottomY - v.y}
                        stroke={f.color}
                        strokeWidth="1"
                        opacity={traditionSelected ? 1 : dim ? 0.12 : 0.5}
                      />
                    )}
                  <circle
                    r={active ? 6 : 5.4}
                    fill={v.score ? f.color : "white"}
                    stroke={f.color}
                    strokeWidth={1.3}
                    opacity={dim ? 0.22 : 1}
                  />
                  {v.score && v.p.stance === "opposes" && (
                    <path d="M-2.5 0h5" stroke="white" strokeWidth="1.6" />
                  )}
                </g>
              );
            })}
          </g>
          {axis.breaks.map((b) => (
            <g
              key={b.start}
              className="axis-break"
              onMouseEnter={() => setBreakTip(b)}
              onMouseLeave={() => setBreakTip(null)}
              onFocus={() => setBreakTip(b)}
              onBlur={() => setBreakTip(null)}
              tabIndex={0}
              role="img"
              aria-label={`Compressed gap: ${formatYears(b)}. No documented lifetime or position interval in this gap.`}
            >
              <title>{`Compressed gap: ${formatYears(b)}. Display only; scores use actual dates.`}</title>
              {[H - 100, arc(b.start)].map((y, i) => (
                <g key={i}>
                  <rect
                    x={b.x0}
                    y={y - 12}
                    width={b.x1 - b.x0}
                    height={24}
                    fill="transparent"
                  />
                  <path
                    d={`M${(b.x0 + b.x1) / 2 - 4},${y + 5} l3,-10 m2,10 l3,-10`}
                    stroke="#687687"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </g>
              ))}
            </g>
          ))}
          {breakTip && (
            <g
              className="axis-break-tooltip"
              role="tooltip"
              pointerEvents="none"
            >
              <rect
                x={left}
                y={H - 158}
                width={240}
                height={39}
                rx={4}
                fill="#fff"
                stroke="#aeb8c5"
              />
              <text x={left + 10} y={H - 141} className="chart-small">
                Compressed gap: {formatYears(breakTip)}
              </text>
              <text x={left + 10} y={H - 127} className="chart-small">
                Display only · scores use actual dates
              </text>
            </g>
          )}
          {labelPoints.map((v, i) => (
            <g key={v.p.id} pointerEvents="none">
              {byFigure.get(v.p.figureId)!.kind === "scripture" && (
                <line
                  x1={v.x + 7}
                  y1={v.y}
                  x2={scriptureLabelX - 4}
                  y2={scriptureLabelY.get(v.p.id)! - 4}
                  stroke={byFigure.get(v.p.figureId)!.color}
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                />
              )}
              <text
                x={
                  byFigure.get(v.p.figureId)!.kind === "scripture"
                    ? scriptureLabelX
                    : v.x > right - 175
                      ? v.x - 14
                      : v.x + 14
                }
                y={
                  byFigure.get(v.p.figureId)!.kind === "scripture"
                    ? scriptureLabelY.get(v.p.id)!
                    : v.y + (i % 2 ? 20 : -14)
                }
                textAnchor={
                  byFigure.get(v.p.figureId)!.kind === "scripture"
                    ? "start"
                    : v.x > right - 175
                      ? "end"
                      : "start"
                }
                className="point-label"
                data-label-position={v.p.id}
                fill={byFigure.get(v.p.figureId)!.color}
                pointerEvents="none"
              >
                {byFigure.get(v.p.figureId)!.kind === "scripture" ? (
                  `${byFigure.get(v.p.figureId)!.name} · ${v.p.title.length > 46 ? v.p.title.slice(0, 43) + "…" : v.p.title}`
                ) : (
                  <>
                    {byFigure.get(v.p.figureId)!.name.split(" ").slice(-1)} ·{" "}
                    {data.domains.find((d) => d.id === v.p.domainId)?.shortName}
                    {v.p.stance === "opposes" ? " (opposes reform)" : ""}
                  </>
                )}
              </text>
            </g>
          ))}
          {now >= from && now <= to && (
            <g>
              <line
                x1={x(now)}
                x2={x(now)}
                y1={viewTop + 45}
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
                    y1={arc(r.year) + intervalOffset(m.id) - 5}
                    y2={arc(r.year) + intervalOffset(m.id) + 5}
                    stroke="currentColor"
                    strokeWidth="2"
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
                const foodTransition = m.id === "factory-farming-transition";
                const below = m.id === "ai-welfare" || foodTransition;
                const middle = clippedYear(midpoint(r));
                const offset = intervalOffset(m.id);
                const labelX = Math.max(
                  left + 100,
                  Math.min(right - (foodTransition ? 145 : 100), x(middle)),
                );
                const labelY =
                  arc(middle) +
                  (foodTransition
                    ? 220
                    : below
                      ? 130
                      : m.reforms?.length
                        ? -110
                        : -145) +
                  (m.id === "wild-welfare" ? 130 : 0);
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
                      className="progress-interval-hit"
                      d={referencePath(r.start, r.end, offset)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="3"
                      pointerEvents="stroke"
                    />
                    <path
                      className="progress-interval-line"
                      data-milestone={m.id}
                      data-offset={offset}
                      d={referencePath(r.start, r.end, offset)}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={benchmarkTip?.id === m.id ? 5 : 3}
                      strokeLinecap="round"
                      strokeDasharray="5 4"
                      pointerEvents="none"
                    />
                    {windowArrows(r, labelY, true)}
                    <rect
                      x={labelX - 125}
                      y={
                        labelY -
                        (m.id === "extinction-concern"
                          ? 44
                          : m.id === "wild-welfare"
                            ? 29
                            : 14)
                      }
                      width={250}
                      height={
                        (benchmarkTip?.id === m.id
                          ? 73 + (m.reforms?.length ?? 1) * 14
                          : 52) +
                        (m.id === "extinction-concern"
                          ? 30
                          : m.id === "wild-welfare"
                            ? 15
                            : 0)
                      }
                      fill="transparent"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      className="milestone-label"
                    >
                      {m.id === "extinction-concern" ? (
                        <>
                          <tspan x={labelX} y={labelY - 30}>
                            Humanity starts to
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            take extinction
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            risks seriously
                          </tspan>
                        </>
                      ) : m.id === "wild-welfare" ? (
                        <>
                          <tspan x={labelX} y={labelY - 15}>
                            Wild-animal welfare
                          </tspan>
                          <tspan x={labelX} dy={15}>
                            statutes
                          </tspan>
                        </>
                      ) : (
                        m.shortName
                      )}
                    </text>
                    <text
                      x={labelX}
                      y={labelY + 17}
                      textAnchor="middle"
                      className="chart-small progress-date-span"
                    >
                      {formatYears(r)}
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
              const lines =
                m.reforms?.map(
                  (event) => `${event.year} — ${event.chartLabel}`,
                ) ??
                (m.id === "animal-protection"
                  ? ["1911 — UK: Protection of Animals Act"]
                  : m.id === "factory-farming-transition"
                    ? [
                        "Assumes factory farming is abolished",
                        "and veganism becomes the norm by 2100",
                      ]
                    : m.id === "ai-welfare"
                      ? ["Hypothetical future interval"]
                      : m.id === "wild-welfare"
                        ? ["Including insect welfare · provisional"]
                        : []);
              if (!lines.length) return null;
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
                    y={benchmarkTip.y + 42}
                    width={250}
                    height={12 + lines.length * 14}
                    rx={5}
                    fill="#fff"
                    stroke="currentColor"
                    strokeOpacity=".3"
                  />
                  {lines.map((line, i) => (
                    <text
                      key={line}
                      x={center}
                      y={benchmarkTip.y + 60 + i * 14}
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
          <strong>No plotted positions match these filters.</strong>
          <p>
            Try a wider period or use the evidence table to inspect unmatched
            writings.
          </p>
        </div>
      )}
    </div>
  );
}
