# Testing the Advisor iframe contingency

Related PRs:
- **Advisor frontend**: insights-advisor-frontend (this PR)
- **Foreman plugin**: [theforeman/foreman_rh_cloud#TBD](https://github.com/theforeman/foreman_rh_cloud/pull/TBD) (stacked on [#1273](https://github.com/theforeman/foreman_rh_cloud/pull/1273))
- **Development proxy**: [frontend-development-proxy#182](https://github.com/RedHatInsights/frontend-development-proxy/pull/182)

## Prerequisites

- Node.js (tested with v22)
- Podman or Docker (for local proxy)
- VPN access (for Broker instance)
- Chrome or Chromium (for browser harness)
- Sibling checkout of [frontend-development-proxy](https://github.com/RedHatInsights/frontend-development-proxy) on the `iop` branch

## 1. Automated checks (no Broker needed)

```bash
npm install --ignore-scripts --no-audit --no-fund

# Lint
npm run lint:js -- --quiet

# Existing tests (regression check)
npm run test:local -- --runInBand \
  src/Utilities/createAdvisorBaseQuery.test.js \
  src/Utilities/Hooks.test.js \
  src/PresentationalComponents/Common \
  src/Services/Acks.test.js \
  src/Services/Recs.test.js

# IoP-specific unit tests (bridge, routing, CSRF, interceptors)
npm run test:jest:iop

# HCC production build (must still work)
npm run build -- --stats errors-warnings

# IoP production build
npm run build:iop -- --stats errors-warnings

# Browser harness (requires IoP build above)
npm run test:iop:browser
```

### What the browser harness validates

The harness (`scripts/test-iop-browser.cjs`) starts a temporary same-origin HTTP server, loads the production Advisor IoP build inside an iframe with a synthetic Foreman parent, and runs these checks:

1. Advisor initializes with Foreman-supplied permissions and renders styled recommendations (verifies PF6 CSS loaded via computed `display: grid`)
2. Clicking a recommendation updates the parent URL
3. Refreshing on a detail page restores the recommendation
4. Query parameter changes synchronize with the parent
5. Revoking permissions removes recommendation access
6. No unexpected API requests, missing assets, or external service calls
7. Disabling a recommendation through the UI sends a POST with the parent's CSRF token

### What the browser harness does NOT validate

- Real Foreman/backend session or authorization
- Real Inventory integration (uses a labeled stub)
- Full filter widget behavior across all tables
- Cross-app navigation (CVE links, remediations)
- Deployed image layout
- PF5 CSS compatibility for Inventory remotes

## 2. Provision a Broker instance

Follow the [Broker setup docs](https://gitlab.cee.redhat.com/insights-platform/iop-dev) if you don't have credentials configured.

```bash
broker checkout --nick iop-devel --description "Advisor iframe testing"
broker inventory
```

Save the hostname from the output. Login credentials: `admin` / `changeme`.

### Set up the instance

SSH into the instance (password `changeme`):

```bash
ssh vagrant@<hostname>
```

Enable IoP:

```bash
sudo foreman-installer --scenario katello-devel \
  --katello-devel-enable-iop true \
  --enable-foreman-proxy-plugin-ansible
```

Check out the plugin PR branch:

```bash
cd /home/vagrant/foreman_rh_cloud
git remote add fork https://github.com/adonispuente/foreman_rh_cloud.git
git fetch fork advisor-iframe-contingency
git checkout -b advisor-iframe-contingency fork/advisor-iframe-contingency
```

Create and start the Foreman service:

```bash
sudo tee /etc/systemd/system/foreman.service > /dev/null << 'EOF'
[Unit]
Description=Foreman Background Service
After=network.target

[Service]
Type=simple
User=vagrant
WorkingDirectory=/home/vagrant/foreman/
ExecStart=/bin/bash -lc 'RAILS_DEVELOPMENT_HOSTS=iop.foo.redhat.com BIND=0.0.0.0 PORT=3000 bundle exec foreman start'
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start foreman
```

Wait for webpack to finish compiling (1-3 minutes). You can watch progress with:

```bash
sudo journalctl -u foreman -f | grep -i webpack
```

### Deploy Advisor assets to the instance

From your local machine, build and copy the IoP assets:

```bash
cd insights-advisor-frontend
npm run build:iop -- --stats errors-warnings
```

Copy the built assets to the VM. Since SSH uses password auth, use the iop-dev helper or `sshpass`:

```bash
sshpass -p changeme scp -r dist/assets/apps/advisor/* \
  vagrant@<hostname>:/var/lib/foreman/public/assets/apps/advisor/
```

Or use the [iop-dev CLI](https://gitlab.cee.redhat.com/insights-platform/iop-dev#iop-deploy-frontend).

## 3. Local development workflow

This lets you iterate on local code changes against the Broker backend.

Ensure `/etc/hosts` contains:

```
127.0.0.1 iop.foo.redhat.com
```

**Terminal 1** — asset watcher (from insights-advisor-frontend):

```bash
npm run static:iop
```

**Terminal 2** — local proxy (from insights-advisor-frontend):

```bash
IOP_URL=https://<hostname> npm run start:proxy:iop
```

**Browser**:

```
https://iop.foo.redhat.com:1337/foreman_rh_cloud/insights_advisor/recommendations
```

Login: `admin` / `changeme`

```
Browser → local HTTPS proxy :1337
          ├─ Advisor assets → local watcher :8003
          └─ Foreman pages, APIs, other app assets → Broker Foreman
```

## 4. Manual verification checklist

### Rendering and styles
- [ ] Advisor iframe renders within Foreman's navigation with complete styles and fonts
- [ ] Recommendation list loads with correct PatternFly 6 styling
- [ ] Detail pages render recommendation descriptions, risk ratings, and resolution steps

### Navigation
- [ ] Clicking a recommendation navigates and updates the Foreman URL
- [ ] Browser back/forward preserves the correct page
- [ ] Refreshing on a detail page restores the recommendation
- [ ] Filters and sort order update the URL query parameters
- [ ] Legacy `/foreman_rh_cloud/recommendations/:id` URLs reach the iframe

### Permissions
- [ ] A user with `view_advisor` sees recommendations
- [ ] A user with `edit_advisor` sees the disable/enable actions
- [ ] A user without `view_advisor` gets an access-denied state

### API and writes
- [ ] API requests use `/insights_cloud/api/insights/v1` (not `/api/insights/v1` or `/api/advisor/v1`)
- [ ] Disabling a recommendation succeeds (POST to `/insights_cloud/api/insights/v1/ack/` with CSRF token)
- [ ] Re-enabling the recommendation restores the original state
- [ ] Changes persist after page reload

### HCC regression
- [ ] `npm run build` still produces a working HCC build
- [ ] Existing tests pass without IoP environment variables set

### Unsupported features (should be absent/disabled)
- [ ] No Unleash polling or metrics requests
- [ ] No Kessel/RBAC cloud requests
- [ ] Topics and admin pages are not routed in IoP
- [ ] Edge management routes are not accessible
- [ ] The cloud Plan remediation button is absent; Download Playbook remains available. Foreman's remediation modal cannot be passed as a React component across the iframe boundary. Running remediation from the iframe requires a separate Foreman integration.

## 5. Troubleshooting

| Symptom | Check |
| --- | --- |
| Blank page after login | Wait for webpack to finish compiling; check `journalctl -u foreman` |
| 503 on Foreman | Foreman service not running; `sudo systemctl start foreman` |
| Iframe shows spinner indefinitely | Check message names match (`IOP_ADVISOR_READY` / `IOP_CHROME_INIT`); check browser console for errors |
| APIs return 404 | Verify routes are loaded: `curl -sk https://localhost/foreman_rh_cloud/insights_advisor/recommendations` should return HTML, not 404 |
| Write returns 422 | CSRF token not attached; check interceptors and that parent has a `csrf-token` meta tag |
| Proxy can't reach Foreman | Check VPN connection and that `IOP_URL` points to the correct hostname |
| `EADDRINUSE` on port 8003 | Kill the existing watcher: `lsof -nP -iTCP:8003 -sTCP:LISTEN` |
| Assets 404 through proxy | Confirm `custom_routes.json` maps `/assets/apps/advisor/*` to `http://host.docker.internal:8003` |
