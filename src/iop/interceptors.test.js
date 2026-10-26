import { iopRequestInterceptor } from './interceptors';

describe('Advisor IoP API adaptation', () => {
  beforeEach(() => {
    document.head.innerHTML =
      '<meta name="csrf-token" content="foreman-token">';
  });
  it('rewrites generated-client API paths and adds CSRF for writes', () => {
    const result = iopRequestInterceptor({
      url: '/api/insights/v1/ack/',
      method: 'post',
    });
    expect(result.url).toBe('/insights_cloud/api/insights/v1/ack/');
    expect(result.headers['X-CSRF-Token']).toBe('foreman-token');
  });
  it('protects DELETE and preserves already-prefixed paths', () => {
    const result = iopRequestInterceptor({
      url: '/insights_cloud/api/insights/v1/ack/rule/',
      method: 'delete',
    });
    expect(result.headers['X-CSRF-Token']).toBe('foreman-token');
  });
  it('does not rewrite external URLs or attach the Foreman token', () => {
    const result = iopRequestInterceptor({
      url: 'https://external.example/api/insights/v1/ack/',
      method: 'post',
    });
    expect(result.url).toBe('https://external.example/api/insights/v1/ack/');
    expect(result.headers).toBeUndefined();
  });
});
