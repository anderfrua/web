'use client';

import { useEffect, useRef, useState } from 'react';

// Track an element's content width so SVG charts can draw at real pixel size
// (keeps 11px labels legible on phones instead of scaling them down).
export function useWidth<T extends HTMLElement>(initial = 680) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export const AMBER = '#c0832c';
export const BLUE = '#5f8fd6';
export const PINK = '#c2577f';
