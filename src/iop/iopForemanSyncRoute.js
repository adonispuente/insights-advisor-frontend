import { matchPath } from 'react-router-dom';

export const iopRoutes = [
  '/recommendations',
  '/recommendations/:id',
  '/recommendations/pathways',
  '/recommendations/pathways/:id',
  '/recommendations/pathways/systems/:id',
  '/recommendations/:id/:inventoryId',
  '/recommendations/pathways/:id/:inventoryId',
  '/recommendations/pathways/systems/:id/:inventoryId',
  '/systems',
  '/systems/:inventoryId',
];

export function getForemanSyncRoute(route = '') {
  const normalized = String(route).replace(/^\/+/, '') || 'recommendations';
  const pathname = normalized.split('?')[0];
  if (pathname.endsWith('/manage-edge-inventory')) return null;
  if (!iopRoutes.some((path) => matchPath({ path, end: true }, '/' + pathname)))
    return null;
  return normalized;
}
