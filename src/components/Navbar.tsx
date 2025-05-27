import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Ander</h1>
        <div className="flex items-center gap-6">
          <Link href="#home" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300">
            Home
          </Link>
          <Link href="#projects" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300">
            Projects
          </Link>
          <Link href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300">
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
