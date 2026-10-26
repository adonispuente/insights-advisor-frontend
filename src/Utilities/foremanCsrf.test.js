import axios from 'axios';
import { foremanCsrfInterceptor } from './foremanCsrf';

const endpoint = '/insights_cloud/api/advisor/v1/cves/business_risk';
let client;
let parentDocument;

const addToken = (target, value) => {
  const meta = target.createElement('meta');
  meta.name = 'csrf-token';
  meta.content = value;
  target.head.appendChild(meta);
  return meta;
};

beforeEach(() => {
  parentDocument = document.implementation.createHTMLDocument('Foreman');
  jest.spyOn(window, 'parent', 'get').mockReturnValue({
    location: { origin: window.location.origin },
    document: parentDocument,
  });
  client = axios.create({
    // Inspect the final outgoing request without contacting a backend.
    adapter: async (config) => ({
      data: config.headers.toJSON(),
      status: 200,
      config,
    }),
  });
  client.interceptors.request.use(foremanCsrfInterceptor);
});

afterEach(() => {
  document.querySelector('meta[name="csrf-token"]')?.remove();
  jest.restoreAllMocks();
});

it.each(['post', 'put', 'patch', 'delete'])(
  '%s sends the Foreman parent token',
  async (method) => {
    addToken(parentDocument, 'parent-session-token');
    const response = await client.request({ method, url: endpoint, data: {} });
    expect(response.data['X-CSRF-Token']).toBe('parent-session-token');
  },
);

it('reads a rotated parent token on the next request', async () => {
  const meta = addToken(parentDocument, 'initial-token');
  await client.patch(endpoint, {});
  meta.content = 'rotated-token';
  const response = await client.patch(endpoint, {});
  expect(response.data['X-CSRF-Token']).toBe('rotated-token');
});

it('uses the current document token when rendered directly in Foreman', async () => {
  addToken(document, 'local-session-token');
  const response = await client.patch(endpoint, {});
  expect(response.data['X-CSRF-Token']).toBe('local-session-token');
});

it('resolves relative endpoints against the Axios base URL', async () => {
  addToken(parentDocument, 'parent-session-token');
  const response = await client.patch(
    'cves/business_risk',
    {},
    {
      baseURL: '/insights_cloud/api/advisor/v1',
    },
  );
  expect(response.data['X-CSRF-Token']).toBe('parent-session-token');
});

it.each([
  ['get', endpoint],
  ['head', endpoint],
  ['options', endpoint],
  ['patch', '/api/advisor/v1/cves/business_risk'],
  ['patch', `https://other.example${endpoint}`],
  ['patch', `//other.example${endpoint}`],
])('does not attach the token to %s %s', async (method, url) => {
  addToken(parentDocument, 'parent-session-token');
  const response = await client.request({ method, url });
  expect(response.data).not.toHaveProperty('X-CSRF-Token');
});

it('does not throw or invent a token when none is available', async () => {
  const response = await client.patch(endpoint, {});
  expect(response.data).not.toHaveProperty('X-CSRF-Token');
});

it('handles an inaccessible cross-origin parent without reading its document', async () => {
  const foreignParent = {};
  Object.defineProperty(foreignParent, 'location', {
    get() {
      throw new DOMException('Blocked cross-origin access', 'SecurityError');
    },
  });
  jest.spyOn(window, 'parent', 'get').mockReturnValue(foreignParent);
  const response = await client.patch(endpoint, {});
  expect(response.data).not.toHaveProperty('X-CSRF-Token');
});
