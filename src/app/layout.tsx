import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import PathfindingGrid from '@/components/PathfindingGrid';
import ParticleBackground from '@/components/ParticleBackground';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfolio | Ander Fernandez',
  description: 'Personal portfolio of Ander Fernandez.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10 pt-20">{children}</main>
      </body>
    </html>
  );
}

//<PathfindingGrid /> {/* Fondo interactivo */}