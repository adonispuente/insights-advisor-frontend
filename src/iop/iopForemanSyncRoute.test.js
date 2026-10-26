import { getForemanSyncRoute } from './iopForemanSyncRoute';

describe('Advisor iframe routes', () => {
  it.each([
    'recommendations',
    'recommendations/rule-id?limit=20',
    'recommendations/pathways/pathway-id',
    'systems',
    'systems/host-id',
  ])('syncs the supported page %s', (route) => {
    expect(getForemanSyncRoute('/' + route)).toBe(route);
  });
  it.each([
    'topics/admin/manage',
    'unknown',
    'recommendations/rule-id/manage-edge-inventory',
  ])('does not publish unsupported or modal route %s', (route) => {
    expect(getForemanSyncRoute(route)).toBeNull();
  });
});
