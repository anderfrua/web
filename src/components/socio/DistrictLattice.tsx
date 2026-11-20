'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AMBER, BLUE } from './useWidth';

// One electoral district of the voting model, simulated live: voters on a periodic
// lattice, tension T_i = -(J/2) s_i Σ s_l - μ s_i, Metropolis updates at T = 1.
const N = 72;
const HIST = 200;
const RGB: Record<number, [number, number, number]> = { 1: [192, 131, 44], [-1]: [95, 143, 214] };

const PRESETS = [
  { label: 'Weak ties', J: 0.2, mu: 0 },
  { label: 'Strong ties', J: 0.6, mu: 0 },
  { label: 'Strong ties, leader pushes', J: 0.6, mu: -0.15 },
];

export default function DistrictLattice() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const grid = useRef<Int8Array>(new Int8Array(N * N));
  const params = useRef({ J: 0.5, mu: 0 });
  const [J, setJ] = useState(0.5);
  const [mu, setMu] = useState(0);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mean, setMean] = useState(0);
  const [hist, setHist] = useState<number[]>([]);

  params.current = { J, mu };

  const randomise = useCallback(() => {
    const g = grid.current;
    for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.5 ? 1 : -1;
    setHist([]);
  }, []);

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(N, N);
    const g = grid.current;
    let sum = 0;
    for (let i = 0; i < g.length; i++) {
      const [r, gg, b] = RGB[g[i]];
      img.data[4 * i] = r; img.data[4 * i + 1] = gg; img.data[4 * i + 2] = b; img.data[4 * i + 3] = 255;
      sum += g[i];
    }
    ctx.putImageData(img, 0, 0);
    const m = sum / g.length;
    setMean(m);
    return m;
  }, []);

  useEffect(() => {
    randomise();
    draw();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setRunning(!reduce);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    if (canvas.current) io.observe(canvas.current);
    return () => io.disconnect();
  }, [randomise, draw]);

  useEffect(() => {
    if (!running || !visible) return;
    let raf = 0;
    const step = () => {
      const g = grid.current;
      const { J, mu } = params.current;
      for (let k = 0; k < N * N * 2; k++) {
        const i = (Math.random() * N) | 0, j = (Math.random() * N) | 0;
        const id = i * N + j;
        const s = g[id];
        const nb = g[((i + 1) % N) * N + j] + g[((i + N - 1) % N) * N + j] + g[i * N + ((j + 1) % N)] + g[i * N + ((j + N - 1) % N)];
        const dE = 2 * s * (J * nb + mu);
        if (dE <= 0 || Math.random() < Math.exp(-dE)) g[id] = -s as -1 | 1;
      }
      const m = draw() ?? 0;
      setHist((h) => (h.length >= HIST ? [...h.slice(1), m] : [...h, m]));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, visible, draw]);

  const spark = hist.map((m, i) => `${i ? 'L' : 'M'}${((i / (HIST - 1)) * 200).toFixed(1)},${(30 - m * 28).toFixed(1)}`).join('');
  const share = Math.round(((mean + 1) / 2) * 100);

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,18rem)_1fr]">
          <canvas
            ref={canvas}
            width={N}
            height={N}
            className="aspect-square w-full max-w-[18rem] rounded-sm border border-line [image-rendering:pixelated]"
            role="img"
            aria-label={`Simulated district of ${N * N} voters: ${share}% vote for party A`}
          />
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => { setJ(p.J); setMu(p.mu); randomise(); setRunning(true); }}
                  className={`rounded-sm border px-2.5 py-1 transition-colors ${J === p.J && mu === p.mu ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="flex justify-between text-muted">Peer influence <span className="tabular-nums text-text">J = {J.toFixed(2)}</span></span>
              <input type="range" min={0} max={1.2} step={0.01} value={J} onChange={(e) => setJ(Number(e.target.value))} className="mt-2 w-full accent-[#c0832c]" />
            </label>
            <label className="block">
              <span className="flex justify-between text-muted">Leader’s field <span className="tabular-nums text-text">μ = {mu.toFixed(2)}</span></span>
              <input type="range" min={-0.5} max={0.5} step={0.01} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="mt-2 w-full accent-[#c0832c]" />
            </label>
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-muted">
                  <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: AMBER }} />Party A</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: BLUE }} />Party B</span>
                </span>
                <span className="tabular-nums text-text">A {share}% · s̄ = {mean.toFixed(2)}</span>
              </div>
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mt-2 h-14 w-full" aria-hidden>
                <line x1={0} x2={200} y1={30} y2={30} stroke="var(--color-line)" />
                <path d={spark} fill="none" stroke="var(--color-text)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              </svg>
              <p className="text-xs text-muted">Average vote over time, from −1 (all B) to +1 (all A)</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-sm bg-signal px-3 py-1.5 font-medium text-ink hover:bg-[#f0bb68]">
                {running ? 'Pause' : 'Run'}
              </button>
              <button type="button" onClick={() => { randomise(); draw(); }} className="rounded-sm border border-line px-3 py-1.5 text-text hover:border-muted">
                Shuffle voters
              </button>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        A live simulation of one district: {(N * N).toLocaleString('en')} voters, each nudged by its four
        neighbours (J) and by the field of the party in power (μ). Below J ≈ 0.44 opinions stay mixed;
        above it, blocs form and grow until the district settles on one party. Runs in your browser.
      </figcaption>
    </figure>
  );
}
