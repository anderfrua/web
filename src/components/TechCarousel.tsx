import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

const techLogos = [
  { name: 'Python', src: '/images/logos/python.svg' },
  { name: 'keras', src: '/images/logos/keras.svg' },
  { name: 'TensorFlow', src: '/images/logos/tensorflow.svg' },
  { name: 'MongoDB', src: '/images/logos/mongodb.svg' },
  { name: 'jupyter', src: '/images/logos/jupyter.svg' },
  { name: 'googlecloud', src: '/images/logos/googlecloud.svg' },
  { name: 'ollama', src: '/images/logos/ollama.svg' },
  { name: 'scilab', src: '/images/logos/scilab.svg' },
  { name: 'scikitlearn', src: '/images/logos/scikitlearn.svg' },
];

export default function TechCarousel() {
  const x = useMotionValue(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const speed = 50;

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (!isPaused) {
        x.set(x.get() - speed / 60);
        if (x.get() <= -window.innerWidth) {
          x.set(0);
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, x]);

  const logosLoop = techLogos.concat(techLogos);

  return (
    <div className="flex justify-center px-12">
      <div className="overflow-hidden py-6 max-w-3xl w-full relative mb-20">
        <motion.div
          style={{ x }}
          className="inline-flex gap-10 whitespace-nowrap"
        >
          {logosLoop.map(({ name, src }, index) => (
            <div
              key={index}
              className="min-w-[80px] flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setHoveredIndex(index);
                setIsPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setIsPaused(false);
              }}
            >
              <motion.div
                animate={{ scale: hoveredIndex === index ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white rounded-lg p-2 shadow-md flex flex-col items-center"
                style={{ transformOrigin: 'center center', width: '100%' }}
              >
                <img src={src} alt={name} className="h-16 w-auto" title={name} />
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="text-sm font-semibold text-gray-800 overflow-hidden"
                      key="text"
                    >
                      {name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
