'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // oscuro por defecto

  // Aplica el tema según lo guardado en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const root = document.documentElement;

    if (saved === 'light') {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      setIsDark(false);
    } else {
      // oscuro por defecto o si saved es 'dark'
      root.style.setProperty('--background', '#0f172a');
      root.style.setProperty('--foreground', '#f8fafc');
      setIsDark(true);
    }
  }, []);

  const toggleColors = () => {
    const root = document.documentElement;

    if (isDark) {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      localStorage.setItem('theme', 'light');
    } else {
      root.style.setProperty('--background', '#0f172a');
      root.style.setProperty('--foreground', '#f8fafc');
      localStorage.setItem('theme', 'dark');
    }

    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleColors}
      className={`text-lg p-1 rounded-full transition ${
        'bg-blue-950 hover:bg-blue-900 text-white'
      }`}
      title="Cambiar fondo"
    >
      {!isDark ? '🌙' : '☀️'}
    </button>
  );
}
