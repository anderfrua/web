'use client';

import { useEffect, useState } from 'react';

export type Scen = { mean: number[]; d: number[]; ci: number[] };
export type Cal = { base: { mean: number[]; lo: number[]; hi: number[] }; levels2021: number[]; scen: Record<string, Scen> };
export type AbmData = {
  years: number[];
  survey: { years: number[]; share16: number[]; levels2021: number[] };
  cal: Record<'C1' | 'C2', Cal>;
};

let cache: Promise<AbmData> | null = null;

// Re-runs of the language model (200 paired runs per scenario, two calibrations).
export function useAbm() {
  const [data, setData] = useState<AbmData | null>(null);
  useEffect(() => {
    cache ??= fetch('/data/euskara-abm.json').then((r) => r.json());
    cache.then(setData).catch(() => {});
  }, []);
  return data;
}

export const pct = (v: number, d = 0) => `${(v * 100).toFixed(d)}%`;
export const pp = (v: number, d = 1) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)} pts`;
