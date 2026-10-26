// Real production child in a same-origin protocol harness, with synthetic APIs.
// This does not validate a real Foreman session, backend, or deployed image.
/* eslint-disable testing-library/prefer-screen-queries -- Playwright queries target the iframe. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const appRoot = path.resolve(__dirname, '..');
const assetRoot = path.resolve(
  appRoot,
  process.env.IOP_ASSET_ROOT || 'dist/assets/apps/advisor',
);
const prefix = '/foreman_rh_cloud/insights_advisor';
const fixture = JSON.parse(
  fs.readFileSync(path.join(appRoot, 'cypress/fixtures/recommendations.json')),
);
const rule = { ...fixture.data[0], impacted_systems_count: 0 };
const pathway = {
  ...JSON.parse(
    fs.readFileSync(
      path.join(appRoot, 'cypress/fixtures/pathway_upgrade_kernel.json'),
    ),
  ),
  impacted_systems_count: 0,
};
const requests = [];
const failures = [];
const writes = [];
const token = 'foreman-test-session-token';
const host = `<!doctype html><html><head><meta name="csrf-token" content="${token}"></head><body>
<h1>Foreman protocol test host</h1><iframe title="Advisor" src="/assets/apps/advisor/index.html" style="width:100%;height:1000px"></iframe>
<script>
const frame = document.querySelector('iframe');
window.testPermissions = [
  {permission:'advisor:recommendation-results:read'},
  {permission:'advisor:disable-recommendations:write'},
  {permission:'inventory:hosts:read'}
];
window.sendChrome = () => frame.contentWindow.postMessage({type:'IOP_CHROME_INIT',payload:{
  permissions:window.testPermissions, user:{identity:{user:{is_org_admin:false}}},
  appRoute:location.pathname.slice('${prefix}/'.length)+location.search
}}, location.origin);
addEventListener('message', event => {
  if(event.origin !== location.origin || event.source !== frame.contentWindow) return;
  if(event.data?.type === 'IOP_ADVISOR_READY') window.sendChrome();
  if(event.data?.type === 'IOP_ADVISOR_NAVIGATE') {
    const next = '${prefix}/'+event.data.payload.appRoute;
    if(location.pathname+location.search !== next) {
      if(new URL(next, location.origin).pathname === location.pathname) history.replaceState({},'',next);
      else history.pushState({},'',next);
    }
    window.sendChrome();
  }
});
addEventListener('popstate', window.sendChrome);
</script></body></html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  requests.push(`${req.method} ${url.pathname}`);
  const json = (data, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
  if (url.pathname.startsWith(prefix)) {
    res.setHeader('Content-Type', 'text/html');
    return res.end(host);
  }
  if (url.pathname.startsWith('/assets/apps/advisor/')) {
    const file = path.resolve(
      assetRoot,
      url.pathname.slice('/assets/apps/advisor/'.length),
    );
    if (file.startsWith(assetRoot + path.sep) && fs.existsSync(file)) {
      const types = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
      };
      res.setHeader(
        'Content-Type',
        types[path.extname(file)] || 'application/octet-stream',
      );
      return fs.createReadStream(file).pipe(res);
    }
  }
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/rule/'
  )
    return json({ data: [rule], meta: { count: 1 } });
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/pathway/'
  )
    return json({ data: [pathway], meta: { count: 1 } });
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/system/'
  )
    return json({ data: [], meta: { count: 0 } });
  if (
    req.method === 'GET' &&
    url.pathname === `/insights_cloud/api/insights/v1/pathway/${pathway.slug}/`
  )
    return json(pathway);
  if (
    req.method === 'GET' &&
    decodeURIComponent(url.pathname) ===
      `/insights_cloud/api/insights/v1/rule/${rule.rule_id}/`
  )
    return json(rule);
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/stats/overview/'
  )
    return json({ pathways: 0, incidents: 0, critical: 0, important: 0 });
  if (
    req.method === 'GET' &&
    url.pathname.endsWith('/systems/') &&
    url.pathname.startsWith('/insights_cloud/api/insights/v1/rule/')
  )
    return json({ data: [], meta: { count: 0 } });
  if (
    req.method === 'GET' &&
    url.pathname.endsWith('/systems_detail/') &&
    url.pathname.startsWith('/insights_cloud/api/insights/v1/rule/')
  )
    return json({ data: [], meta: { count: 0 } });
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/topic/'
  )
    return json([]);
  if (
    req.method === 'GET' &&
    url.pathname.startsWith('/insights_cloud/api/insights/v1/ack/')
  )
    return json({ data: [], meta: { count: 0 } });
  if (
    req.method === 'GET' &&
    url.pathname === '/insights_cloud/api/insights/v1/hostack/'
  )
    return json({ data: [], meta: { count: 0 } });
  if (
    req.method === 'GET' &&
    url.pathname === '/assets/apps/inventory/fed-mods.json'
  ) {
    return json({
      name: 'inventory',
      version: '1.0.0',
      extensions: [],
      registrationMethod: 'callback',
      baseURL: '/assets/apps/inventory/',
      loadScripts: ['inventory-test.js'],
    });
  }
  if (
    req.method === 'GET' &&
    url.pathname === '/assets/apps/inventory/inventory-test.js'
  ) {
    const inventoryStub = `
// Stub: does NOT validate real Inventory integration, styling, or data.
window.__load_plugin_entry__('inventory', {
  init: () => Promise.resolve(),
  get: async (moduleName) => () => ({
    default: () => '[Inventory stub: ' + moduleName + ']'
  })
});
    `.trim();
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(inventoryStub);
  }
  if (
    req.method === 'POST' &&
    url.pathname === '/insights_cloud/api/insights/v1/ack/'
  ) {
    if (req.headers['x-csrf-token'] !== token) {
      failures.push('Advisor write did not send the parent CSRF token');
      return json({ error: 'Invalid authenticity token' }, 422);
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      writes.push(JSON.parse(body));
      json({ rule_id: rule.rule_id });
    });
    return;
  }
  if (url.pathname === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }
  failures.push(`Unexpected request: ${req.method} ${url.pathname}`);
  return json({ error: 'Unhandled harness request' }, 404);
});

(async () => {
  assert.ok(
    fs.existsSync(path.join(assetRoot, 'index.html')),
    'Run npm run build:iop first',
  );
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const macChrome =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath =
    process.env.IOP_BROWSER_EXECUTABLE ||
    (fs.existsSync(macChrome) ? macChrome : undefined);
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin)
      failures.push(`Unexpected external request: ${request.url()}`);
  });
  try {
    await page.goto(`${origin}${prefix}/recommendations`);
    const frame = page.frameLocator('iframe');
    const recommendation = frame
      .getByRole('link', { name: rule.description, exact: true })
      .first();
    await recommendation.waitFor();
    await frame.getByRole('tab', { name: /Pathways/i }).click();
    await frame.getByRole('link', { name: pathway.name, exact: true }).click();
    await frame
      .getByRole('heading', { name: pathway.name, exact: true })
      .waitFor();
    await page.waitForURL((url) =>
      url.pathname.endsWith(`/recommendations/pathways/${pathway.slug}`),
    );
    await page.reload();
    await frame
      .getByRole('heading', { name: pathway.name, exact: true })
      .waitFor();
    console.log(
      'PASS: Pathways tab, detail navigation and deep-link refresh work',
    );
    await page.evaluate(() => {
      history.pushState(
        {},
        '',
        '/foreman_rh_cloud/insights_advisor/recommendations',
      );
      window.sendChrome();
    });
    await recommendation.waitFor();
    assert.equal(
      await frame
        .locator('.pf-v6-c-page')
        .evaluate((element) => getComputedStyle(element).display),
      'grid',
    );
    console.log(
      'PASS: Advisor initializes with Foreman permissions and styled recommendations',
    );
    await recommendation.click();
    await page.waitForURL((url) =>
      decodeURIComponent(url.pathname).endsWith(
        `/recommendations/${rule.rule_id}`,
      ),
    );
    console.log('PASS: recommendation navigation updates the parent URL');
    await page.reload();
    await frame
      .getByRole('heading', { name: rule.description, exact: true })
      .waitFor();
    console.log('PASS: recommendation deep-link refresh restores the detail');
    await page.evaluate(() => {
      history.pushState(
        {},
        '',
        '/foreman_rh_cloud/insights_advisor/recommendations?limit=10',
      );
      window.sendChrome();
    });
    await recommendation.waitFor();
    await frame.locator('body').evaluate(() => {
      window.location.hash = '/recommendations?limit=20';
    });
    await page.waitForURL((url) => url.searchParams.get('limit') === '20');
    console.log('PASS: query parameters synchronize with the parent');
    await page.evaluate(() => {
      window.testPermissions = [];
      window.sendChrome();
    });
    await frame
      .getByText(/do not have|don't have|permission|access/i)
      .first()
      .waitFor();
    assert.equal(await recommendation.count(), 0);
    console.log('PASS: revoked permissions remove recommendation access');
    // Restore permissions for write test
    await page.evaluate(() => {
      window.testPermissions = [
        { permission: 'advisor:recommendation-results:read' },
        { permission: 'advisor:disable-recommendations:write' },
        { permission: 'inventory:hosts:read' },
      ];
      window.sendChrome();
    });
    await page.goto(`${origin}${prefix}/recommendations`);
    const recLink = frame
      .getByRole('link', { name: rule.description, exact: true })
      .first();
    await recLink.waitFor();
    // PF6 ActionsColumn renders a kebab toggle with aria-label "Kebab toggle"
    const kebab = frame.getByRole('button', { name: 'Kebab toggle' }).first();
    await kebab.waitFor();
    await kebab.click();
    const disableItem = frame
      .getByRole('menuitem', { name: /disable recommendation/i })
      .first();
    await disableItem.waitFor();
    await disableItem.click();
    // DisableRule modal — heading "Disable recommendation", confirm button "Save"
    const modal = frame.getByRole('dialog');
    await modal.waitFor();
    const saveBtn = modal.getByRole('button', { name: /save/i });
    await saveBtn.waitFor();
    await saveBtn.click();
    // Wait for the write to land
    await new Promise((r) => setTimeout(r, 1000));
    assert.ok(
      requests.some((request) =>
        request.includes('/insights_cloud/api/insights/v1/rule/'),
      ),
    );
    assert.deepEqual(failures, []);
    console.log(
      'PASS: no missing assets, external services, or unexpected API prefixes',
    );
    assert.ok(
      writes.length > 0,
      'Expected at least one acknowledgement write via UI',
    );
    assert.ok(
      writes.some((w) => w.rule_id === rule.rule_id),
      'Write payload contains correct rule_id',
    );
    console.log(
      `PASS: acknowledgement write successful (${writes.length} write(s) with parent CSRF token)`,
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  console.error(failures);
  server.close();
  process.exitCode = 1;
});
