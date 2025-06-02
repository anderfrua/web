'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points: { x: number; y: number; vx: number; vy: number }[] = [];
  const numPoints = 100;
  const mouse = { x: -9999, y: -9999 }; // Fuera de pantalla inicialmente

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Crear puntos
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numPoints; i++) {
          const p = points[i];
        
          // Damping
          p.vx *= 0.95;
          p.vy *= 0.95;
        
          // Velocidad mínima
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const minSpeed = 0.15;
          if (speed < minSpeed) {
            const angle = Math.random() * 2 * Math.PI;
            p.vx += Math.cos(angle) * minSpeed * 0.5;
            p.vy += Math.sin(angle) * minSpeed * 0.5;
          }
      
          // Movimiento
          p.x += p.vx;
          p.y += p.vy;
      
          // Rebote en bordes
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
          // Repulsión por el ratón
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
      
          if (dist < 80) {
            const force = 200 / (dist * dist + 100);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
      
          // Dibujar punto
          const size = dist < 100 ? 3.5 : 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = dist < 100 ? '#ffcc00' : '#ffaa00';
          ctx.fill();
        }
    
        // Conexiones
        for (let i = 0; i < numPoints; i++) {
          for (let j = i + 1; j < numPoints; j++) {
            const a = points[i];
            const b = points[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {a
              ctx.strokeStyle = `rgba(255, 204, 0, ${1 - dist / 100})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
    
        animationFrameId = requestAnimationFrame(draw);
};

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
