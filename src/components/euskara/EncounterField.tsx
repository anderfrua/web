'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AMBER, useWidth } from '../socio/useWidth';

// The encounter rule of the model, isolated: no births, deaths, school or migration.
// Every "year" each agent moves, finds its nearest neighbour and the pair talks once.
// Parameters are the calibrated ones used on this page (calibration C1).
const N = 900, L = 100, MOVE = 10, BIAS = 0.05, SIGMA = 5;
const GAIN = [24, 45, 1.5], LOSE_SHY = [12, 9, 15], LOSE_NON = [5, 1, 40], EXPOSURE = 0.12;
const LEVELS = [0.7, 0.12, 0.085, 0.095];
const YEARS = 60;
const COLORS = ['#34405a', '#7a5a2c', '#b07f33', '#f0b55a'];
const band = (f: number) => (f <= 33 ? 0 : f <= 66 ? 1 : 2);

type World = { x: Float32Array; y: Float32Array; f: Float32Array; shy: Uint8Array; u: Float32Array; cl: Uint8Array; cx: number[]; cy: number[] };

function makeWorld(brave: number): World {
  const cx = [0, 1, 2].map(() => Math.random() * L), cy = [0, 1, 2].map(() => Math.random() * L);
  const w: World = { x: new Float32Array(N), y: new Float32Array(N), f: new Float32Array(N), shy: new Uint8Array(N), u: new Float32Array(N), cl: new Uint8Array(N), cx, cy };
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    const lv = r < LEVELS[0] ? 0 : r < LEVELS[0] + LEVELS[1] ? 1 : r < 1 - LEVELS[3] ? 2 : 3;
    w.f[i] = lv === 0 ? 0 : [0, 1, 34, 67][lv] + Math.floor(Math.random() * 33);
    w.cl[i] = (Math.random() * 3) | 0;
    w.u[i] = Math.random();
    w.shy[i] = w.u[i] >= brave ? 1 : 0;
    const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2 * SIGMA;
    if (w.f[i] > 0) { w.x[i] = (cx[w.cl[i]] + g() + L) % L; w.y[i] = (cy[w.cl[i]] + g() + L) % L; }
    else { w.x[i] = Math.random() * L; w.y[i] = Math.random() * L; }
  }
  return w;
}

const gauss = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
const wrap = (d: number) => (d > L / 2 ? d - L : d < -L / 2 ? d + L : d);

function step(w: World) {
  for (let i = 0; i < N; i++) {
    if (w.f[i] > 0) { w.x[i] += BIAS * wrap(w.cx[w.cl[i]] - w.x[i]); w.y[i] += BIAS * wrap(w.cy[w.cl[i]] - w.y[i]); }
    w.x[i] = (((w.x[i] + MOVE * gauss()) % L) + L) % L;
    w.y[i] = (((w.y[i] + MOVE * gauss()) % L) + L) % L;
  }
  // nearest neighbour on the torus with a 10x10 bucket grid
  const B = 10, cell = L / B, buckets: number[][] = Array.from({ length: B * B }, () => []);
  for (let i = 0; i < N; i++) buckets[Math.min(B - 1, (w.y[i] / cell) | 0) * B + Math.min(B - 1, (w.x[i] / cell) | 0)].push(i);
  const nn = new Int32Array(N);
  for (let i = 0; i < N; i++) {
    const bx = Math.min(B - 1, (w.x[i] / cell) | 0), by = Math.min(B - 1, (w.y[i] / cell) | 0);
    let best = Infinity, bj = -1;
    for (let r = 1; bj < 0 || r <= 2; r++) {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        for (const j of buckets[((by + dy + B) % B) * B + ((bx + dx + B) % B)]) {
          if (j === i) continue;
          const ddx = wrap(w.x[j] - w.x[i]), ddy = wrap(w.y[j] - w.y[i]), d = ddx * ddx + ddy * ddy;
          if (d < best) { best = d; bj = j; }
        }
      }
      if (r > 4) break;
    }
    nn[i] = bj;
  }
  const df = new Float32Array(N), seen = new Set<number>();
  for (let i = 0; i < N; i++) {
    const j = nn[i];
    if (j < 0) continue;
    const a = Math.min(i, j), b = Math.max(i, j), key = a * N + b;
    if (seen.has(key)) continue;
    seen.add(key);
    const fa = w.f[a], fb = w.f[b];
    if (fa > 0 && fb > 0) {
      if (w.shy[a] && w.shy[b]) { df[a] -= LOSE_SHY[band(fa)]; df[b] -= LOSE_SHY[band(fb)]; }
      else { df[a] += GAIN[band(fa)]; df[b] += GAIN[band(fb)]; }
    } else if (fa > 0) { df[a] -= LOSE_NON[band(fa)]; if (Math.random() < EXPOSURE) df[b] += 1; }
    else if (fb > 0) { df[b] -= LOSE_NON[band(fb)]; if (Math.random() < EXPOSURE) df[a] += 1; }
  }
  let s = 0;
  for (let i = 0; i < N; i++) { w.f[i] = Math.max(0, Math.min(100, w.f[i] + df[i])); if (w.f[i] > 0) s++; }
  return s / N;
}

export default function EncounterField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  const [brave, setBrave] = useState(0.35);
  const braveRef = useRef(0.35);
  const [hist, setHist] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [chart, CW] = useWidth<HTMLDivElement>(300);

  const draw = useCallback(() => {
    const c = canvas.current, w = world.current;
    if (!c || !w) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const S = c.width;
    ctx.fillStyle = '#0f1625';
    ctx.fillRect(0, 0, S, S);
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) {
        const sp = w.f[i] > 0;
        if ((pass === 0) === sp) continue;
        ctx.fillStyle = COLORS[sp ? 1 + band(w.f[i]) : 0];
        ctx.beginPath();
        ctx.arc((w.x[i] / L) * S, (w.y[i] / L) * S, sp ? S / 150 : S / 190, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);

  const reset = useCallback(() => {
    world.current = makeWorld(braveRef.current);
    let s = 0;
    for (let i = 0; i < N; i++) if (world.current.f[i] > 0) s++;
    setHist([s / N]);
    draw();
  }, [draw]);

  useEffect(() => {
    reset();
    setRunning(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    if (canvas.current) io.observe(canvas.current);
    return () => io.disconnect();
  }, [reset]);

  const setShare = (b: number) => {
    setBrave(b);
    braveRef.current = b;
    const w = world.current;
    if (w) for (let i = 0; i < N; i++) w.shy[i] = w.u[i] >= b ? 1 : 0;
  };

  const done = hist.length > YEARS;
  useEffect(() => {
    if (!running || !visible || done) return;
    const id = window.setInterval(() => {
      const w = world.current;
      if (!w) return;
      const s = step(w);
      draw();
      setHist((h) => (h.length > YEARS ? h : [...h, s]));
    }, 110);
    return () => window.clearInterval(id);
  }, [running, visible, done, draw]);

  const now = hist[hist.length - 1] ?? 0;
  const H = 150, m = { l: 34, r: 8, t: 8, b: 22 };
  const px = (t: number) => m.l + (t / YEARS) * (CW - m.l - m.r);
  const py = (v: number) => m.t + (1 - v) * (H - m.t - m.b);
  const line = hist.map((v, t) => `${t ? 'L' : 'M'}${px(t).toFixed(1)},${py(v).toFixed(1)}`).join('');
  const trend = hist.length > 6 ? now - hist[0] : 0;
  const verdict =
    hist.length < 6
      ? 'Running…'
      : Math.abs(trend) < 0.02
        ? 'Roughly break-even: what speakers gain in Basque conversations they lose in the ones that slip into Spanish.'
        : trend > 0
          ? 'Basque grows: enough speakers open in Basque that more conversations reinforce it than erode it.'
          : 'Basque shrinks: too many conversations between two speakers end up in Spanish, and fluency drains away.';

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,20rem)_1fr]">
          <canvas
            ref={canvas}
            width={600}
            height={600}
            role="img"
            aria-label={`Simulated agents; ${Math.round(now * 100)}% speak Basque`}
            className="aspect-square w-full rounded-sm"
          />
          <div className="flex flex-col gap-4 text-sm">
            <label className="block">
              <span className="flex justify-between text-muted">
                Speakers who open in Basque <span className="tabular-nums text-text">{Math.round(brave * 100)}%</span>
              </span>
              <input type="range" min={0} max={1} step={0.05} value={brave} onChange={(e) => setShare(Number(e.target.value))} className="mt-2 w-full accent-[#c0832c]" />
              <span className="mt-1 block text-xs text-muted">35% is the value calibrated for the Basque Autonomous Community.</span>
            </label>
            <div ref={chart}>
              <svg viewBox={`0 0 ${CW} ${H}`} className="w-full" role="img" aria-label="Share of agents who speak Basque, by simulated year">
                {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                  <g key={v}>
                    <line x1={m.l} x2={CW - m.r} y1={py(v)} y2={py(v)} stroke="var(--color-line)" />
                    <text x={m.l - 6} y={py(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v * 100}%</text>
                  </g>
                ))}
                <text x={CW - m.r} y={H - 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">years</text>
                <text x={m.l} y={H - 4} fontSize={11} fill="var(--color-muted)">0</text>
                <path d={line} fill="none" stroke={AMBER} strokeWidth={2} />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-sm border border-line px-3 py-1.5 text-text hover:border-muted">
                {running ? 'Pause' : 'Play'}
              </button>
              <button type="button" onClick={reset} className="rounded-sm border border-line px-3 py-1.5 text-text hover:border-muted">
                Restart
              </button>
              <span className="ml-auto tabular-nums text-text">{Math.round(now * 100)}% speak Basque</span>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {['No Basque', 'Fluency 1–33', '34–66', '67–100'].map((t, i) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 min-h-[2.5rem] text-sm leading-relaxed text-text" aria-live="polite">{verdict}</p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Only the conversation rule, with nobody born, dying, schooled or arriving. Each dot is a person; each
        year everyone talks once with whoever is closest. Speakers drift towards three Basque-speaking
        communities. Move the slider while it runs: the break-even point sits near one speaker in two opening in
        Basque.
      </figcaption>
    </figure>
  );
}
