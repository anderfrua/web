'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center transition-colors duration-300"
      >
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Hi, I&apos;m <span className="text-blue-400">Ander Fernandez</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Physicist & Electronics Engineer exploring Data Science.
            I build smart solutions and clean user experiences.
          </p>
          <a
            href="#timeline"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
          >
            View My Work
          </a>
        </div>
      </section>

      {/* Sección Sobre Mí y Línea de Tiempo */}
      <section
        id="timeline"
        className="min-h-screen py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">
            My Journey
          </h2>

          {/* Línea de tiempo */}
          <div className="relative">
            {/* La línea vertical */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-1 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Etapas de la línea de tiempo */}
            <div className="space-y-16">
              {/* Carreras - 2025 */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center md:justify-start relative"
              >
                {/* Círculo con la fecha */}
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-xl font-semibold absolute left-1/2 transform -translate-x-1/2">
                  
                </div>
                {/* Texto a la derecha del círculo, limitando el ancho para evitar que cruce la línea */}
                <div className="ml-16 pl-6 text-left max-w-[40%]">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Bachelor&apos;s Degree in Physics & Electronics Engineering
                  </h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Completed my Bachelor&apos;s degree in Physics and Electronics Engineering, gaining a solid foundation in science and technology.
                  </p>
                </div>

                <div className="ml-16 pl-6 text-right max-w-[40%]">
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    2025/02
                  </p>
                </div>


              </motion.div>

              {/* Máster - 2025/02 */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center md:justify-end relative"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-xl font-semibold absolute left-1/2 transform -translate-x-1/2">
                  
                </div>
                {/* Fecha a la izquierda del texto */}
                <div className="mr-30 pr-6 text-left max-w-[40%]">
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    2025/02
                  </p>
                </div>

                {/* Texto a la derecha de la fecha */}
                <div className="text-right max-w-[40%]">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Master in Big Data & Visual Analytics
                  </h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    I pursued a Master&apos;s in Big Data and Visual Analytics to expand my expertise in data science and analytics.
                  </p>
                </div>
              </motion.div>


              {/* Trabajo en Ikerlan - 2025/03 */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center md:justify-start relative"
              >
                {/* Círculo con la fecha */}
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-xl font-semibold absolute left-1/2 transform -translate-x-1/2">
                  
                </div>
                {/* Texto a la derecha del círculo, limitando el ancho para evitar que cruce la línea */}
                <div className="ml-16 pl-6 text-left max-w-[40%]">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Working at Ikerlan
                  </h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    While completing my Master&apos;s, I started working at Ikerlan, applying my skills in electronics and data science.
                  </p>
                </div>
                <div className="ml-16 pl-6 text-left max-w-[40%]">
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    2025/03
                  </p>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
