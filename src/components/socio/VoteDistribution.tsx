'use client';

import { useEffect, useMemo, useState } from 'react';
import { AMBER, BLUE, PINK, useWidth } from './useWidth';

// Distribution of v·Q/N for Spanish Senate candidates, recomputed from the
// historical results used in the thesis (single-candidate lists left out).

type Year = { year: number; n: number; nq1: number; counts_noq1: number[]; sl_noq1: number; sl2_noq1: number };
type Data = { edges: number[]; years: Year[] };

const UNIVERSAL = { mu: -0.54, s2: 1.08 }; // Fortunato & Castellano (2007)
// density of ln(v): a log-normal in v is a Gaussian in ln v, so areas on the log axis stay honest
const lognormal = (v: number, mu: number, s2: number) =>
  Math.exp(-((Math.log(v) - mu) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);

const X0 = 0.08, X1 = 5;
const M = { l: 38, r: 10, t: 12, b: 34 };
const H = 300;

export default function VoteDistribution() {
  const [data, setData] = useState<Data | null>(null);
  const [year, setYear] = useState<number | 'all'>('all');
  const [show, setShow] = useState({ fit: true, universal: true });
  const [hover, setHover] = useState<number | null>(null);
  const [box, W] = useWidth<HTMLDivElement>();

  useEffect(() => {
    fetch('/data/senate-vq.json').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const agg = useMemo(() => {
    if (!data) return null;
    const ys = year === 'all' ? data.years : data.years.filter((y) => y.year === year);
    const n = ys.reduce((s, y) => s + (y.n - y.nq1), 0);
    const counts = data.edges.slice(1).map((_, i) => ys.reduce((s, y) => s + y.counts_noq1[i], 0));
    const sl = ys.reduce((s, y) => s + y.sl_noq1, 0), sl2 = ys.reduce((s, y) => s + y.sl2_noq1, 0);
    const mu = sl / n, s2 = sl2 / n - mu * mu;
    const dens = counts.map((c, i) => c / (n * Math.log(data.edges[i + 1] / data.edges[i])));
    return { n, counts, dens, mu, s2 };
  }, [data, year]);

  const lx = (v: number) => M.l + ((Math.log(v) - Math.log(X0)) / (Math.log(X1) - Math.log(X0))) * (W - M.l - M.r);
  const yMax = agg ? Math.max(...agg.dens) * 1.12 : 2.4;
  const ly = (d: number) => M.t + (1 - Math.min(d, yMax) / yMax) * (H - M.t - M.b);

  const curve = (mu: number, s2: number) => {
    let d = '';
    for (let i = 0; i <= 160; i++) {
      const v = Math.exp(Math.log(X0) + (i / 160) * (Math.log(X1) - Math.log(X0)));
      d += `${i ? 'L' : 'M'}${lx(v).toFixed(1)},${ly(lognormal(v, mu, s2)).toFixed(1)}`;
    }
    return d;
  };

  const years = data?.years.map((y) => y.year) ?? [];
  const label = (y: number) => (y === 2019 ? '2019 (both)' : String(y));

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <label className="flex items-center gap-2 text-muted">
            Elections
            <select
              value={String(year)}
              onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-sm border border-line bg-ink px-2 py-1 text-text"
            >
              <option value="all">All, 1977–2023</option>
              {years.map((y) => (
                <option key={y} value={y}>{label(y)}</option>
              ))}
            </select>
          </label>
          {(
            [
              ['fit', 'Spain, log-normal fit', AMBER],
              ['universal', 'Universal curve (Italy, Poland, Finland)', PINK],
            ] as const
          ).map(([k, l, c]) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 text-muted hover:text-text">
              <input type="checkbox" checked={show[k]} onChange={() => setShow((s) => ({ ...s, [k]: !s[k] }))} className="accent-[#c0832c]" />
              <span className="inline-block h-0.5 w-4" style={{ background: c }} aria-hidden />
              {l}
            </label>
          ))}
        </div>

        <div ref={box} className="relative mt-4">
          {!agg || !data ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted">Loading election results…</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img"
              aria-label={`Histogram of candidate vote ratios for ${year === 'all' ? 'all Senate elections' : `the ${year} Senate election`}, peaked at 1, with log-normal curves`}
              onPointerLeave={() => setHover(null)}>
              {[0, 0.5, 1, 1.5, 2].filter((v) => v < yMax).map((v) => (
                <g key={v}>
                  <line x1={M.l} x2={W - M.r} y1={ly(v)} y2={ly(v)} stroke="var(--color-line)" />
                  <text x={M.l - 6} y={ly(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v}</text>
                </g>
              ))}
              <line x1={lx(1)} x2={lx(1)} y1={M.t} y2={H - M.b} stroke="var(--color-muted)" strokeDasharray="3 4" />
              {agg.dens.map((d, i) => {
                const x0 = lx(Math.max(data.edges[i], X0)), x1 = lx(Math.min(data.edges[i + 1], X1));
                if (data.edges[i + 1] <= X0 || x1 - x0 < 1) return null;
                const on = hover === i;
                return (
                  <g key={i} onPointerEnter={() => setHover(i)}>
                    <rect x={x0} y={M.t} width={x1 - x0} height={H - M.t - M.b} fill="transparent" />
                    {d > 0 && (
                      <rect x={x0 + 1} y={ly(d)} width={Math.max(1, x1 - x0 - 2)} height={H - M.b - ly(d)} rx={2}
                        fill={BLUE} fillOpacity={hover === null || on ? 0.85 : 0.4} />
                    )}
                  </g>
                );
              })}
              {show.universal && <path d={curve(UNIVERSAL.mu, UNIVERSAL.s2)} fill="none" stroke={PINK} strokeWidth={2} pointerEvents="none" />}
              {show.fit && <path d={curve(agg.mu, agg.s2)} fill="none" stroke={AMBER} strokeWidth={2} pointerEvents="none" />}
              {[0.1, 0.2, 0.5, 1, 2, 5].map((v) => (
                <text key={v} x={lx(v)} y={H - M.b + 16} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{v}</text>
              ))}
              <text x={W - M.r} y={H - 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">
                {W < 520 ? 'v·Q/N (log scale)' : 'v·Q/N, a candidate’s votes relative to the list average (log scale)'}
              </text>
              <text x={M.l + 6} y={M.t + 12} fontSize={11} fill="var(--color-muted)">{W < 520 ? 'density' : 'density (per unit of log v·Q/N)'}</text>
            </svg>
          )}
          {hover !== null && agg && data && (
            <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-line bg-ink px-2 py-1 text-xs text-text"
              style={{ left: `clamp(90px, ${(lx(Math.sqrt(data.edges[hover] * data.edges[hover + 1])) / W) * 100}%, calc(100% - 90px))` }}>
              {data.edges[hover].toFixed(2)}–{data.edges[hover + 1].toFixed(2)}: {agg.counts[hover].toLocaleString('en')} candidates (
              {((100 * agg.counts[hover]) / agg.n).toFixed(1)}%)
            </div>
          )}
        </div>

        {agg && (
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
            <div><dt className="text-muted">Candidates</dt><dd className="tabular-nums text-text">{agg.n.toLocaleString('en')}</dd></div>
            <div><dt className="text-muted">Spread in Spain, σ</dt><dd className="tabular-nums text-text">{Math.sqrt(agg.s2).toFixed(2)}</dd></div>
            <div><dt className="text-muted">Universal curve, σ</dt><dd className="tabular-nums text-text">{Math.sqrt(UNIVERSAL.s2).toFixed(2)}</dd></div>
          </dl>
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Every Senate candidate since 1977, each compared with the average of their own party list in their
        province. Hover a bar for its count; pick a single election to see how stable the shape is.
        Single-candidate lists, where the ratio is 1 by definition, are left out. Recomputed from the
        Senate’s historical results with the thesis code.
      </figcaption>
    </figure>
  );
}
