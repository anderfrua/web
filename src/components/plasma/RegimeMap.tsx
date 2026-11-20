'use client';

import { useState } from 'react';

// Schematic regime map: which ion dominates the hydrogen plasma as a function of
// neutral gas density n0 (x, log) and microwave power density P (y, log).
// Boundaries traced from the global-model map used in the thesis (Romera, 2022).
const X0 = Math.log10(3e13), X1 = Math.log10(5e14);
const Y0 = 5, Y1 = Math.log10(6e6);
const W = 600, H = 320, L = 56, R = 12, T = 12, B = 44;
const px = (n: number) => L + ((Math.log10(n) - X0) / (X1 - X0)) * (W - L - R);
const py = (p: number) => T + (1 - (Math.log10(p) - Y0) / (Y1 - Y0)) * (H - T - B);
const pts = (a: [number, number][]) => a.map(([n, p]) => `${px(n).toFixed(1)},${py(p).toFixed(1)}`).join(' ');

const top: [number, number][] = [[3e13, 1.35e6], [5e13, 1.1e6], [7e13, 8.2e5], [8.3e13, 7e5], [1.2e14, 7.6e5], [2e14, 8.2e5], [5e14, 9e5]];
const split: [number, number][] = [[8.3e13, 7e5], [7.6e13, 4e5], [6.9e13, 2e5], [6.6e13, 1e5]];

type Pt = [number, number];
const regions: { id: string; label: string; color: string; note: string; poly: Pt[]; at: Pt }[] = [
  {
    id: 'h1',
    label: 'H⁺ dominant',
    color: '#c0832c',
    note: 'High power: mostly protons. The regime you want for a proton beam.',
    poly: [[3e13, 6e6], [5e14, 6e6], ...[...top].reverse()],
    at: [1.1e14, 2.6e6],
  },
  {
    id: 'h2',
    label: 'H₂⁺ dominant',
    color: '#5f8fd6',
    note: 'Low power and thin gas: molecular ions dominate.',
    poly: [[3e13, 1e5], ...[...split].reverse(), [8.3e13, 7e5], ...top.slice(0, 4).reverse()],
    at: [4.1e13, 3e5],
  },
  {
    id: 'h3',
    label: 'H₃⁺ dominant',
    color: '#3fa37a',
    note: 'Low power and denser gas: triatomic ions take over.',
    poly: [...split, [5e14, 1e5], ...[...top.slice(3)].reverse()],
    at: [2.2e14, 2.6e5],
  },
];

export default function RegimeMap() {
  const [active, setActive] = useState<string | null>(null);
  const current = regions.find((r) => r.id === active);

  return (
    <figure className="my-10">
      <div className="relative rounded-sm border border-line bg-surface/80 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Map of the three plasma regimes versus gas density and power density">
          {regions.map((r) => (
            <polygon
              key={r.id}
              points={pts(r.poly)}
              fill={r.color}
              fillOpacity={active && active !== r.id ? 0.18 : 0.55}
              stroke="var(--color-surface)"
              strokeWidth={2}
              onMouseEnter={() => setActive(r.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r.id)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              aria-label={`${r.label}. ${r.note}`}
              className="cursor-default outline-none transition-[fill-opacity]"
            />
          ))}
          {regions.map((r) => (
            <text key={r.id} x={px(r.at[0])} y={py(r.at[1])} textAnchor="middle" fill="var(--color-text)" fontSize={14} pointerEvents="none">
              {r.label}
            </text>
          ))}
          {[1e14].map((n) => (
            <text key={n} x={px(n)} y={H - B + 18} textAnchor="middle" fill="var(--color-muted)" fontSize={11}>10¹⁴</text>
          ))}
          {[1e5, 1e6].map((p) => (
            <text key={p} x={L - 8} y={py(p) + 4} textAnchor="end" fill="var(--color-muted)" fontSize={11}>{p === 1e5 ? '10⁵' : '10⁶'}</text>
          ))}
          <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fill="var(--color-muted)" fontSize={12}>neutral gas density n₀ (cm⁻³)</text>
          <text x={14} y={(T + H - B) / 2} textAnchor="middle" fill="var(--color-muted)" fontSize={12} transform={`rotate(-90 14 ${(T + H - B) / 2})`}>power density (W/m³)</text>
        </svg>
        <p className="mt-2 min-h-[1.5rem] text-sm text-text" aria-live="polite">
          {current ? current.note : 'Hover or tab through a region.'}
        </p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Which ion dominates the hydrogen plasma, by power and gas density. A jump between regions is a
        change of state. Schematic redrawn from the global plasma model the thesis builds on (Romera, 2022).
      </figcaption>
    </figure>
  );
}
