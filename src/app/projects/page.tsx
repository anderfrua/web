'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    slug: 'project-one',
    title: 'Automatic Classification of Plasma States in an ECR-Type Ion Source',
    description: `In this work I present a methodology to infer the state of the plasma in an ECR source without using any sensor that modifies its behaviour,
                  applying automatic classification techniques.`,
    image: '/images/partacc.png',
    tags: ['Condition Monitoring', 'Machine Learning', 'Particle Physics', 'Particle Accelerators'],
  },
  {
    slug: 'project-two',
    title: 'Sociophysical approach to spanish voting dynamics',
    description: `This work analyzes Spanish politics using sociophysics, focusing on three goals: evaluating its suitability for study,
                  testing if the electoral system has memory with Markov models, and proposing a physical model that reproduces electoral dynamics based on real data.`,
    image: '/images/DiagramaTransiciones.png',
    width: 300,
    height: 140,
    tags: ['Sociophysics', 'Modelization', 'Ising', 'Monte Carlo'],
  },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <section className="min-h-screen p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-gray-900 dark:text-white"
        >
          My Projects
        </motion.h1>

        <motion.input
          type="text"
          placeholder="Filter projects..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 sm:mt-0 sm:ml-6 w-full sm:w-64 px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mb-8 max-w-3xl text-gray-700 dark:text-gray-300"
      >
        Feel free to explore my recent projects.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center col-span-full text-gray-500 dark:text-gray-400"
          >
            No project found :(
          </motion.p>
        ) : (
          filteredProjects.map(({ slug, title, description, image, tags, width, height }, index) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/projects/${slug}`}
                className="group flex flex-col rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-2xl hover:border-blue-500 border border-transparent transition cursor-pointer"
              >
                <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={image}
                    alt={title}
                    width={width ?? 400}
                    height={height ?? 140}
                    className="group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 flex-grow">{description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
