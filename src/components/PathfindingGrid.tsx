'use client';

import { useEffect, useState } from 'react';

export default function PathfindingGrid() {
  const [cellSize, setCellSize] = useState(20);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [blockedCells, setBlockedCells] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<Set<string>>(new Set());

  // 1. Configurar tamaño del grid
  useEffect(() => {
    const calculateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = 20;

      setCols(Math.floor(width / size));
      setRows(Math.floor(height / size));
      setCellSize(size);
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  // 2. Escaneo más robusto de obstáculos
  useEffect(() => {
    const newBlocked = new Set<string>();

    setTimeout(() => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const pointsToCheck = [
            [0.5, 0.5], // centro
            [0.2, 0.5], // izquierda
            [0.8, 0.5], // derecha
            [0.5, 0.2], // arriba
            [0.5, 0.8], // abajo
          ];

          const isBlocked = pointsToCheck.some(([dx, dy]) => {
            const x = col * cellSize + dx * cellSize;
            const y = row * cellSize + dy * cellSize;
            const el = document.elementFromPoint(x, y);
            return el && !el.closest('#grid');
          });

          if (isBlocked) {
            newBlocked.add(`${row}-${col}`);
          }
        }
      }

      setBlockedCells(newBlocked);
    }, 100); // pequeño delay para asegurar render
  }, [rows, cols, cellSize]);

  // 3. Pathfinding + animación paso a paso
  useEffect(() => {
    if (!start || !end) return;

    const visited = new Set<string>();
    const cameFrom = new Map<string, string>();
    const queue: [number, number][] = [start];
    const key = (r: number, c: number) => `${r}-${c}`;
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    let found = false;

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const currentKey = key(r, c);
      if (visited.has(currentKey)) continue;
      visited.add(currentKey);

      if (r === end[0] && c === end[1]) {
        found = true;
        break;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const neighborKey = key(nr, nc);

        if (
          nr >= 0 &&
          nc >= 0 &&
          nr < rows &&
          nc < cols &&
          !blockedCells.has(neighborKey) &&
          !visited.has(neighborKey)
        ) {
          queue.push([nr, nc]);
          cameFrom.set(neighborKey, currentKey);
        }
      }
    }

    if (found) {
      // reconstruir camino
      const pathList: string[] = [];
      let curr = key(end[0], end[1]);

      while (curr !== key(start[0], start[1])) {
        pathList.unshift(curr);
        curr = cameFrom.get(curr)!;
      }

      // animar paso a paso
      const newPath = new Set<string>();
      pathList.forEach((cellKey, i) => {
        setTimeout(() => {
          newPath.add(cellKey);
          setPath(new Set(newPath));
        }, i * 20); // delay entre celdas
      });
    } else {
      setPath(new Set()); // no hay camino
    }
  }, [start, end, blockedCells, rows, cols]);

  const handleClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (blockedCells.has(key)) return;

    if (!start) {
      setStart([row, col]);
      setPath(new Set());
    } else if (!end) {
      setEnd([row, col]);
    } else {
      setStart([row, col]);
      setEnd(null);
      setPath(new Set());
    }
  };

  return (
    <div
      id="grid"
      className="fixed inset-0 z-0 grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const key = `${row}-${col}`;
          const isStart = start?.[0] === row && start?.[1] === col;
          const isEnd = end?.[0] === row && end?.[1] === col;
          const isBlocked = blockedCells.has(key);
          const isPath = path.has(key);

          return (
            <div
              key={key}
              onClick={() => handleClick(row, col)}
              className={`cursor-pointer transition  ${
                isStart
                  ? 'bg-green-500'
                  : isEnd
                  ? 'bg-red-500'
                  : isPath
                  ? 'bg-blue-400 animate-pulse'
                  : isBlocked
                  ? 'bg-black/70'
                  : 'bg-black/20 hover:bg-black/30'
              }`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          );
        })
      )}
    </div>
  );
}
