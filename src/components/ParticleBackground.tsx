'use client';

import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log('INIT PARTICLES');
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: '#111111' },
        particles: {
          number: { value: 100 },
          size: { value: 4 },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.9 },
          color: { value: '#ffcc00' },
          links: {
            enable: true,
            color: '#ffcc00',
            distance: 150,
            opacity: 0.6,
            width: 2,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
