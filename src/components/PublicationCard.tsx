/*
  PublicationCard.tsx – version con diseño elegante
  · Fondo de tarjeta con vidrio esmerilado + gradiente suave
  · Sombra profunda + efecto lift & scale al hacer hover
  · Compatible con modo dark/light
*/

'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export type PublicationCardProps = {
  title: string;
  venue: string;
  year: string;
  abstract: string;
  pdf?: string;
  doi?: string;
  badge?: string; // p. ej. "JACoW · ECRIS 2024"
};

export default function PublicationCard({
  title,
  venue,
  year,
  abstract,
  pdf,
  doi,
  badge,
}: PublicationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 220, damping: 20 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative group rounded-3xl overflow-hidden p-[1px]"
    >
      {/* Capa de gradiente exterior */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/40 via-sky-500/30 to-purple-500/40
                       opacity-60 blur-lg transition-opacity duration-500 group-hover:opacity-90" />

      {/* Contenido */}
      <div
        className="relative z-10 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md
                       shadow-lg group-hover:shadow-2xl transition-shadow duration-300 p-6"
      >
        {/* Badge */}
        {badge && (
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-sm">
            {badge}
          </span>
        )}

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-snug pr-6">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {venue} · {year}
        </p>

        <p className="text-justify leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
          {abstract}
        </p>

        <div className="flex flex-wrap gap-4">
          {pdf && (
            <a
            href={pdf}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5
                             text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-800
                             transform transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            View PDF
          </a>
          )}
          
        </div>
      </div>
    </motion.div>
  );
}
