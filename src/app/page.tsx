'use client';

//import PathfindingGrid from '@/components/PathfindingGrid';



export default function Home() {
  return (
    <>
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center transition-colors duration-300"
    >
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Hi, I&apos;m <span className="text-blue-400">Andeeeer Fernandez</span>
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Physicist & Electronics Engineer exploring Data Science.
          I build smart solutions and clean user experiences.
        </p>
        <a
          href="#projects"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
        >
          View My Work
        </a>
      </div>
    </section>

    <section className="min-h-screen flex flex-col items-center justify-center p-10">
    </section>
  </>
);
}

//<h1 className="text-3xl font-bold mb-6">Demo Pathfinding</h1>
//<PathfindingGrid />