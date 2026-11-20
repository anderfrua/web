'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; vx: number; vy: number };

// Quiet network of nodes and links behind the content (reads as a connectome).
const POINT_DENSITY = 0.00011; // nodes per CSS pixel²
const LINK_DISTANCE = 130;
const MOUSE_RADIUS = 90;
const NODE = '232, 168, 73'; // --color-signal as RGB

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const seed = () => {
      const count = Math.min(160, Math.floor(width * height * POINT_DENSITY));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = () => {
      for (const p of points) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = 0.6 / (dist + 20);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        if (Math.hypot(p.vx, p.vy) < 0.08) {
          const a = Math.random() * Math.PI * 2;
          p.vx += Math.cos(a) * 0.04;
          p.vy += Math.sin(a) * 0.04;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${NODE}, ${0.22 * (1 - d / LINK_DISTANCE)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of points) {
        const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < MOUSE_RADIUS;
        ctx.fillStyle = `rgba(${NODE}, ${near ? 0.9 : 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 2.2 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onResize = () => {
      resize();
      if (reduceMotion) draw();
    };

    resize();
    if (reduceMotion) {
      draw();
    } else {
      loop();
      window.addEventListener('mousemove', onMove);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
    />
  );
}
