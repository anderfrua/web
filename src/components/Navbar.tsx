import Link from 'next/link';
// import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h1 className="hidden sm:block text-xl font-semibold text-gray-800 dark:text-white">Ander</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 sm:mt-0">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            Contact
          </Link>
          <Link
            href="/publications"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            Publications
          </Link>
        </div>
      </div>
    </nav>
  );
}
