'use client';

import { useEffect, useRef, useState } from 'react';
import { useWidth, AMBER, BLUE } from '@/components/socio/useWidth';

// Simulated crank–slider bench. Kinematics of an ideal mechanism; the bushing
// clearance grows with a run-in + steady wear law and adds to the slider's
// travel, which the "laser" reads with noise and the odd acquisition glitch.
// The estimate follows the wear module: crest of each cycle minus the first
// crest, reject jumps, then exponential smoothing.

const R_MM = 20; // crank radius
const L_MM = 120; // rod length
const N_CYCLES = 140;
const trueWear = (n: number) => 0.16 * (1 - Math.exp(-n / 12)) + 0.0055 * n; // mm
const NOISE = 0.025; // mm, laser noise on the crest
const GLITCH_P = 0.05;
const ALPHA = 0.18; // smoothing
const JUMP = 0.1; // mm, reject crests that jump more than this from the last accepted crest

type Pt = { n: number; truth: number; raw: number; rejected: boolean; est: number };

const PARTS = [
  { id: 'motor', name: 'Motor', text: 'MAXON EC-i40 brushless motor (100 W) behind a 15.88 : 1 gearbox, run by an EPOS4 controller. Its encoder gives angle, speed, torque and power.' },
  { id: 'bushing', name: 'Bushing', text: 'The brass bushing in the joint between crank and rod: the part that wears. Brass wears fast, so an experiment takes days instead of months.' },
  { id: 'rod', name: 'Rod and slider', text: 'The connecting rod turns rotation into the slider’s back-and-forth. As the bushing wears, the joint gains clearance and the slider travels a little further each cycle.' },
  { id: 'load', name: 'Spring and load cell', text: 'A spring resists the slider; an RSCC C3/50 kg load cell measures its force, a proxy for the load on the joint.' },
  { id: 'laser', name: 'Laser', text: 'A Keyence LK-G402 laser reads the slider position without touching it. Speed and acceleration are its derivatives. The crest of each cycle is the soft sensor for wear.' },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
}

export default function CrankBench() {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  const [fast, setFast] = useState(false);
  const [part, setPart] = useState<string | null>(null);
  const [theta, setTheta] = useState(0);
  const [pts, setPts] = useState<Pt[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const state = useRef({ theta: 0, n: 0, est: 0, last: 0, first: 0, r: rng(11) });
  const figRef = useRef<HTMLElement>(null);

  // autoplay when visible unless the reader prefers reduced motion
  useEffect(() => {
    const el = figRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPlaying(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      const speed = (fast ? 10 : 2) * 2 * Math.PI; // rad/s
      const prev = s.theta;
      s.theta += speed * dt;
      const crossed = Math.floor(s.theta / (2 * Math.PI)) - Math.floor(prev / (2 * Math.PI));
      const add: Pt[] = [];
      for (let k = 0; k < crossed && s.n < N_CYCLES; k++) {
        s.n += 1;
        const truth = trueWear(s.n);
        let raw = truth + NOISE * gauss(s.r);
        if (s.n > 1 && s.r() < GLITCH_P) raw += (s.r() < 0.5 ? -1 : 1) * (0.15 + 0.2 * s.r());
        if (s.n === 1) s.first = NOISE * gauss(s.r); // crest of the unworn bushing, read with the same noise
        const meas = raw - s.first;
        const rejected = s.n > 1 && Math.abs(meas - s.last) > JUMP;
        if (!rejected) {
          s.last = meas;
          s.est = s.n === 1 ? meas : s.est + ALPHA * (meas - s.est);
        }
        add.push({ n: s.n, truth, raw: meas, rejected, est: s.est });
      }
      if (add.length) setPts((p) => [...p, ...add]);
      setTheta(s.theta);
      if (s.n >= N_CYCLES) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, fast]);

  const reset = () => {
    state.current = { theta: 0, n: 0, est: 0, last: 0, first: 0, r: rng(Math.floor(Math.random() * 1e9)) };
    setPts([]);
    setTheta(0);
    setHover(null);
    setPlaying(true);
  };

  const n = pts.length;
  const wearNow = n ? trueWear(n) : 0;

  // ---- mechanism (fixed viewBox; text lives in HTML below) ----
  const S = 2.1; // px per mm
  const EX = 14; // drawing exaggeration of the clearance
  const cx = 70, cy = 92;
  const r = R_MM * S, l = L_MM * S;
  const clear = wearNow * S * EX;
  const pinX = cx + r * Math.cos(theta), pinY = cy - r * Math.sin(theta);
  const sliderX = pinX + Math.sqrt(l * l - (r * Math.sin(theta)) ** 2) + clear * (1 + Math.cos(theta)) / 2;
  const loadX = cx + r + l + 135; // fixed; the spring stretches
  const laserX = 640;
  const hl = (id: string) => (part === id ? AMBER : 'var(--color-muted)');
  const hlw = (id: string) => (part === id ? 2.5 : 1.5);
  const springPath = (() => {
    const x0 = sliderX + 22, x1 = loadX - 2, k = 9;
    let d = `M${x0},${cy}`;
    for (let i = 1; i <= k * 2; i++) d += ` L${x0 + ((x1 - x0) * i) / (k * 2)},${cy + (i % 2 ? -7 : 7)}`;
    return d + ` L${x1},${cy}`;
  })();

  // ---- wear chart ----
  const W = width, H = 210, m = { l: 44, r: 12, t: 24, b: 30 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const yMax = 1.0;
  const X = (c: number) => m.l + (c / N_CYCLES) * iw;
  const Y = (v: number) => m.t + ih - (Math.max(-0.1, Math.min(yMax, v)) / yMax) * ih;
  const line = (k: 'truth' | 'est') => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.n).toFixed(1)},${Y(p[k]).toFixed(1)}`).join(' ');
  const hp = hover !== null ? pts[hover] : null;

  return (
    <figure ref={figRef} className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
        <svg viewBox="0 20 680 160" className="h-auto w-full" role="img" aria-label="Animated top view of the crank–slider wear bench">
          {/* rail */}
          <line x1={cx + r + 60} y1={cy + 18} x2={loadX - 10} y2={cy + 18} stroke="var(--color-line)" strokeWidth={2} />
          {/* motor + crank disc */}
          <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={hl('motor')} strokeWidth={hlw('motor')} />
          <rect x={cx - 11} y={cy - 11} width={22} height={22} rx={3} fill="var(--color-ink)" stroke={hl('motor')} strokeWidth={hlw('motor')} />
          <circle cx={cx} cy={cy} r={4} fill="var(--color-muted)" />
          <line x1={cx} y1={cy} x2={pinX} y2={pinY} stroke="var(--color-muted)" strokeWidth={3} strokeLinecap="round" />
          {/* rod */}
          <line x1={pinX} y1={pinY} x2={sliderX} y2={cy} stroke={hl('rod')} strokeWidth={part === 'rod' ? 5 : 4} strokeLinecap="round" />
          {/* bushing with exaggerated clearance */}
          <circle cx={pinX} cy={pinY} r={7 + clear * 0.25} fill="var(--color-ink)" stroke={part === 'bushing' ? AMBER : '#b58a3c'} strokeWidth={part === 'bushing' ? 3 : 2} />
          <circle cx={pinX} cy={pinY} r={3} fill="var(--color-muted)" />
          {/* slider */}
          <rect x={sliderX - 20} y={cy - 15} width={42} height={30} rx={3} fill="var(--color-ink)" stroke={hl('rod')} strokeWidth={hlw('rod')} />
          <rect x={sliderX - 3} y={cy - 40} width={6} height={25} fill={part === 'laser' ? AMBER : 'var(--color-muted)'} />
          {/* spring + load cell */}
          <path d={springPath} fill="none" stroke={hl('load')} strokeWidth={hlw('load')} />
          <rect x={loadX} y={cy - 14} width={30} height={28} rx={2} fill="none" stroke={hl('load')} strokeWidth={hlw('load')} />
          <line x1={loadX + 30} y1={cy} x2={loadX + 46} y2={cy} stroke={hl('load')} strokeWidth={hlw('load')} />
          <rect x={loadX + 46} y={cy - 22} width={6} height={44} fill="var(--color-line)" />
          {/* laser head + beam */}
          <rect x={laserX} y={cy - 54} width={30} height={28} rx={2} fill="none" stroke={hl('laser')} strokeWidth={hlw('laser')} />
          <line x1={laserX} y1={cy - 34} x2={sliderX + 3} y2={cy - 34} stroke="#d0474a" strokeWidth={1.2} strokeDasharray="3 3" opacity={0.85} />
          {/* travel marks: crest at start vs now */}
          {n > 0 && (
            <g>
              <line x1={cx + r + l} y1={cy + 26} x2={cx + r + l} y2={cy + 40} stroke="var(--color-muted)" strokeWidth={1} />
              <line x1={cx + r + l + clear} y1={cy + 26} x2={cx + r + l + clear} y2={cy + 40} stroke={AMBER} strokeWidth={2} />
            </g>
          )}
        </svg>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Bench components">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPart(part === p.id ? null : p.id)}
              onMouseEnter={() => setPart(p.id)}
              aria-pressed={part === p.id}
              className={`rounded-sm border px-2.5 py-1 text-sm transition-colors ${part === p.id ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-muted" aria-live="polite">
          {part ? PARTS.find((p) => p.id === part)!.text : 'Pick a component to see what it does. The amber tick under the slider marks how much further it now travels than at the start.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <button type="button" onClick={() => (n >= N_CYCLES ? reset() : setPlaying(!playing))} className="rounded-sm bg-signal px-3 py-1.5 font-medium text-ink hover:bg-[#f0bb68]">
            {n >= N_CYCLES ? 'Run again' : playing ? 'Pause' : n ? 'Resume' : 'Run the bench'}
          </button>
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="accent-[#e8a849]" />
            Fast-forward
          </label>
          <span className="ml-auto tabular-nums text-muted">
            cycle {n} / {N_CYCLES} · wear {wearNow.toFixed(2)} mm
          </span>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Legend">
          <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full" style={{ background: BLUE }} />Crest of each cycle</li>
          <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full border" style={{ borderColor: BLUE }} />Rejected as a glitch</li>
          <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-4" style={{ background: AMBER }} />Wear estimate</li>
          <li className="flex items-center gap-2"><span className="inline-block w-4 border-t border-dashed border-muted" />True wear</li>
        </ul>

        <div ref={wrapRef} className="relative mt-2">
          <svg
            width={W}
            height={H}
            role="img"
            aria-label="Wear estimated from the slider crests against the true wear, cycle by cycle"
            onMouseLeave={() => setHover(null)}
            onMouseMove={(e) => {
              if (!n) return;
              const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
              const c = Math.round(((x - m.l) / iw) * N_CYCLES);
              setHover(Math.max(0, Math.min(n - 1, c - 1)));
            }}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={m.l} x2={W - m.r} y1={Y(v)} y2={Y(v)} stroke="var(--color-line)" strokeWidth={1} />
                <text x={m.l - 8} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v.toFixed(2)}</text>
              </g>
            ))}
            {[0, 35, 70, 105, 140].map((c) => (
              <text key={c} x={X(c)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{c}</text>
            ))}
            <text x={m.l - 8} y={11} textAnchor="end" fontSize={11} fill="var(--color-muted)">mm</text>
            {pts.map((p) => (
              <circle key={p.n} cx={X(p.n)} cy={Y(p.raw)} r={2.4} fill={p.rejected ? 'none' : BLUE} stroke={BLUE} strokeWidth={1} opacity={0.8} />
            ))}
            {n > 1 && <path d={line('truth')} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeDasharray="4 4" />}
            {n > 1 && <path d={line('est')} fill="none" stroke={AMBER} strokeWidth={2} />}
            {hp && (
              <g>
                <line x1={X(hp.n)} x2={X(hp.n)} y1={m.t} y2={m.t + ih} stroke="var(--color-muted)" strokeWidth={1} />
                <circle cx={X(hp.n)} cy={Y(hp.est)} r={4} fill={AMBER} stroke="var(--color-surface)" strokeWidth={2} />
              </g>
            )}
          </svg>
          {hp && (
            <div
              className="pointer-events-none absolute top-2 z-10 rounded-sm border border-line bg-ink px-2 py-1 text-xs tabular-nums text-text"
              style={{ left: Math.min(X(hp.n) + 8, W - 150) }}
            >
              cycle {hp.n}: estimate {hp.est.toFixed(3)} mm, true {hp.truth.toFixed(3)} mm{hp.rejected ? ', crest rejected' : ''}
            </div>
          )}
          <p className="text-center text-xs text-muted">cycles (each stands for hours of a real experiment)</p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        A simulation of the bench, not its data. The mechanism follows ideal crank–slider kinematics, with the
        clearance drawn {EX} times larger than life; wear follows a run-in phase and then a steady rate. The laser
        reading gets noise and occasional glitches, and the estimate is built the way the pipeline builds it: crest
        of each cycle minus the first crest, jumps rejected, then exponential smoothing.
      </figcaption>
    </figure>
  );
}
