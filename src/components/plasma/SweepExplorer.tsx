'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// Interactive version of the thesis figures, drawn from the original PIT30 data
// (data/plasma-sweeps.json is exported by reproducing the thesis notebook).

type Trace = { dbm: number; t: number[]; lum: number[]; adapt: number[]; noise: number[] };
type Jump = { t: number; lum: number; dbm: number; cluster: number };
type Cand = { t: number; lum: number; adapt: number; dbm: number; fp: boolean };
type Data = { traces: Trace[]; gas: { t: number[]; flow: number[] }; jumps: Jump[]; candidates: Cand[] };

export type View = 'detect' | 'nocam' | 'clusters';

let cache: Promise<Data> | null = null;
const load = () => (cache ??= fetch('/data/plasma-sweeps.json').then((r) => r.json()));

const GAS_H = 70;
const GAP = 28;
const M = { l: 40, r: 10, t: 10, b: 30 };
const T0 = 15;
const T1 = 138;

const AMBER = '#c0832c';
const BLUE = '#5f8fd6';
const PINK = '#c2577f';
const NEUTRAL = 'var(--color-text)';

// cluster styles: 3 validated hues + a neutral, each with its own marker shape
const CLUSTER = [
  { color: AMBER, shape: 'circle' },
  { color: BLUE, shape: 'square' },
  { color: PINK, shape: 'triangle' },
  { color: NEUTRAL, shape: 'diamond' },
] as const;

function Marker({ x, y, shape, color, hollow = false }: { x: number; y: number; shape: string; color: string; hollow?: boolean }) {
  const common = {
    fill: hollow ? 'var(--color-surface)' : color,
    stroke: hollow ? color : 'var(--color-surface)',
    strokeWidth: hollow ? 2 : 1.5,
  };
  const r = 5;
  if (shape === 'square') return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} rx={1} {...common} />;
  if (shape === 'triangle') return <polygon points={`${x},${y - r - 1} ${x + r + 1},${y + r} ${x - r - 1},${y + r}`} {...common} />;
  if (shape === 'diamond') return <polygon points={`${x},${y - r - 1} ${x + r + 1},${y} ${x},${y + r + 1} ${x - r - 1},${y}`} {...common} />;
  if (shape === 'cross')
    return (
      <g stroke={color} strokeWidth={2.2} strokeLinecap="round">
        <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
        <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
      </g>
    );
  return <circle cx={x} cy={y} r={r} {...common} />;
}

const VIEWS: { id: View; label: string }[] = [
  { id: 'detect', label: 'Jumps, with camera' },
  { id: 'nocam', label: 'Without camera' },
  { id: 'clusters', label: 'k-means clusters' },
];

export default function SweepExplorer({ initial, caption }: { initial: View; caption: React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null);
  const [view, setView] = useState<View>(initial);
  const [hover, setHover] = useState<{ x: number; label: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // draw at the real pixel width so text stays legible on phones
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const PLOT_H = Math.round(Math.min(260, Math.max(200, W * 0.4)));
  const H = M.t + PLOT_H + GAP + GAS_H + M.b;
  const ticks = W < 500 ? [20, 60, 100] : [20, 40, 60, 80, 100, 120];

  useEffect(() => {
    load().then(setData).catch(() => setData(null));
  }, []);

  const x = (t: number) => M.l + ((t - T0) / (T1 - T0)) * (W - M.l - M.r);
  const y = (v: number) => M.t + (1 - v) * PLOT_H;
  const gy = (f: number) => M.t + PLOT_H + GAP + (1 - f / 5.2) * GAS_H;

  // order clusters by RF power so the numbering reads high power -> low power
  const clusterOrder = useMemo(() => {
    if (!data) return [] as number[];
    const ids = [...new Set(data.jumps.map((j) => j.cluster))];
    const mean = (c: number) => {
      const js = data.jumps.filter((j) => j.cluster === c);
      return js.reduce((s, j) => s + j.dbm, 0) / js.length;
    };
    return ids.sort((a, b) => mean(b) - mean(a));
  }, [data]);

  const signal: keyof Pick<Trace, 'lum' | 'adapt'> = view === 'nocam' ? 'adapt' : 'lum';

  const paths = useMemo(() => {
    if (!data) return [];
    const dbms = data.traces.map((tr) => tr.dbm);
    const lo = Math.min(...dbms), hi = Math.max(...dbms);
    return data.traces.map((tr) => {
      let d = '';
      let prev = -1;
      tr.t.forEach((t, i) => {
        const v = tr[signal][i];
        if (t < T0 || t > T1) return;
        // break the line across gaps in the record
        d += `${prev >= 0 && t - tr.t[prev] < 1 ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`;
        prev = i;
      });
      return { d, dbm: tr.dbm, op: 0.3 + 0.5 * ((tr.dbm - lo) / (hi - lo || 1)) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, signal, W, PLOT_H]);

  const gasPath = useMemo(
    () => (data ? data.gas.t.map((t, i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${gy(data.gas.flow[i]).toFixed(1)}`).join('') : ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, W, PLOT_H],
  );

  const markers = useMemo(() => {
    if (!data) return [];
    if (view === 'nocam')
      return data.candidates.map((c) => ({
        t: c.t, v: c.adapt, color: c.fp ? PINK : AMBER, shape: c.fp ? 'cross' : 'circle', hollow: false,
        label: `${c.t.toFixed(1)} min · ${c.dbm} dBm · ${c.fp ? 'false alarm, removed by the filter' : 'state jump'}`,
      }));
    return data.jumps.map((j) => {
      const k = clusterOrder.indexOf(j.cluster);
      const st = view === 'clusters' ? CLUSTER[k] : { color: AMBER, shape: 'circle' };
      return {
        t: j.t, v: j.lum, color: st.color, shape: st.shape, hollow: false,
        label: `${j.t.toFixed(1)} min · ${j.dbm} dBm${view === 'clusters' ? ` · cluster ${k + 1}` : ' · detected jump'}`,
      };
    });
  }, [data, view, clusterOrder]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!data || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    if (px < M.l || px > W - M.r) return setHover(null);
    let best: { d: number; m: (typeof markers)[number] } | null = null;
    for (const m of markers) {
      const d = Math.hypot(x(m.t) - px, y(m.v) - py);
      if (d < 14 && (!best || d < best.d)) best = { d, m };
    }
    if (best) return setHover({ x: x(best.m.t), label: best.m.label });
    const t = T0 + ((px - M.l) / (W - M.l - M.r)) * (T1 - T0);
    let gi = 0;
    data.gas.t.forEach((gt, i) => { if (Math.abs(gt - t) < Math.abs(data.gas.t[gi] - t)) gi = i; });
    setHover({ x: px, label: `${t.toFixed(1)} min · gas flow ${data.gas.flow[gi].toFixed(2)} sccm` });
  };

  const legend =
    view === 'nocam'
      ? [
          { label: 'State jump', color: AMBER, shape: 'circle' },
          { label: 'False alarm (filtered out)', color: PINK, shape: 'cross' },
        ]
      : view === 'clusters'
        ? CLUSTER.map((c, i) => ({ label: `Cluster ${i + 1}`, color: c.color, shape: c.shape }))
        : [{ label: 'Detected jump', color: AMBER, shape: 'circle' }];

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Chart view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                view === v.id ? 'bg-line text-text' : 'text-muted hover:text-text'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <svg width="14" height="14" aria-hidden>
                <Marker x={7} y={7} shape={l.shape} color={l.color} />
              </svg>
              {l.label}
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span className="inline-block h-px w-4 bg-text/60" aria-hidden />
            {view === 'nocam' ? 'RF matching signal' : 'Luminosity'}, one line per RF power (brighter = more power)
          </li>
        </ul>

        <div ref={boxRef} className="relative mt-3">
          {!data && <div className="flex h-64 items-center justify-center text-sm text-muted">Loading measurements…</div>}
          {data && (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full touch-none select-none"
              role="img"
              aria-label={`Measured ${view === 'nocam' ? 'RF matching signal' : 'luminosity'} for eight RF power levels over two gas sweeps, with ${markers.length} marked events`}
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
            >
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth={1} />
                  <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v}</text>
                </g>
              ))}
              {paths.map((p) => (
                <path key={p.dbm} d={p.d} fill="none" stroke="var(--color-text)" strokeOpacity={p.op} strokeWidth={1.2} />
              ))}
              {markers.map((m, i) => (
                <Marker key={i} x={x(m.t)} y={y(m.v)} shape={m.shape} color={m.color} hollow={m.hollow} />
              ))}

              {/* gas flow strip */}
              <line x1={M.l} x2={W - M.r} y1={gy(0)} y2={gy(0)} stroke="var(--color-line)" />
              <path d={gasPath} fill="none" stroke="var(--color-muted)" strokeWidth={2} />
              <text x={M.l - 6} y={gy(5) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">5</text>
              <text x={M.l - 6} y={gy(0.7) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">0.7</text>
              <text x={W - M.r} y={gy(5) - 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">gas flow (sccm)</text>

              {ticks.map((t) => (
                <text key={t} x={x(t)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{t}</text>
              ))}
              <text x={W - M.r} y={H - 10} textAnchor="end" fontSize={11} fill="var(--color-muted)">min</text>
              <text x={M.l} y={M.t + 12} fontSize={11} fill="var(--color-muted)" dx={6}>
                {view === 'nocam' ? 'RF matching (normalised)' : 'luminosity (normalised)'}
              </text>

              {hover && <line x1={hover.x} x2={hover.x} y1={M.t} y2={H - M.b} stroke="var(--color-muted)" strokeDasharray="3 3" pointerEvents="none" />}
            </svg>
          )}
          {hover && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-line bg-ink px-2 py-1 text-xs text-text"
              style={{ left: `clamp(80px, ${(hover.x / W) * 100}%, calc(100% - 80px))` }}
            >
              {hover.label}
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}
