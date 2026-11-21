import type { MetadataRoute } from 'next';

const BASE = 'https://www.anderfernandez.me';

// Public pages only. Keep this list explicit so nothing unpublished is ever announced.
const ROUTES: [string, number][] = [
  ['/', 1],
  ['/projects', 0.8],
  ['/publications', 0.8],
  ['/projects/project1', 0.7],
  ['/projects/project2', 0.7],
  ['/projects/project3', 0.7],
  ['/projects/project4', 0.6],
  ['/contact', 0.4],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([path, priority]) => ({ url: `${BASE}${path}`, priority, changeFrequency: 'monthly' }));
}
