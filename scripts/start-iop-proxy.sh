#!/usr/bin/env bash
set -euo pipefail

app_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
proxy_root="${IOP_PROXY_ROOT:-$(dirname "$app_root")/frontend-development-proxy}"
upstream="${IOP_URL:-http://host.docker.internal:3000}"
image="${IOP_PROXY_IMAGE:-localhost/advisor-iop-proxy:local}"

if command -v podman >/dev/null 2>&1; then
  runtime=podman
elif command -v docker >/dev/null 2>&1; then
  runtime=docker
else
  echo 'Install and start Podman or Docker before starting the IOP proxy.' >&2
  exit 1
fi

if [ ! -f "$proxy_root/Dockerfile" ]; then
  echo "Proxy repository not found at $proxy_root. Set IOP_PROXY_ROOT to its location." >&2
  exit 1
fi

"$runtime" build -t "$image" "$proxy_root"
echo "Proxy: https://iop.foo.redhat.com:1337; Foreman upstream: $upstream"
echo 'Start npm run static:iop in a separate terminal for assets on port 8003.'
exec "$runtime" run --rm --name advisor-iop-proxy \
  -p 1337:1337 \
  --add-host host.docker.internal:host-gateway \
  -e IOP=true -e HCC_ENV=iop -e PROXY_PORT=1337 \
  -e "HCC_ENV_URL=$upstream" \
  -v "$app_root/custom_routes.json:/config/custom_routes.iop.json:ro,z" \
  "$image"

