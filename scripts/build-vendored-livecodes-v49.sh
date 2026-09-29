#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/vendor-src/livecodes-v49"
DEST="$ROOT/assets/vendor/livecodes-v49"

if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
  # Build with the Node version pinned by LiveCodes v49.
  # shellcheck disable=SC1090
  source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  cd "$SRC"
  nvm install
  nvm use
else
  cd "$SRC"
fi

DEPS_STAMP=node_modules/.livecodes-v49-deps-ready
if [[ ! -f "$DEPS_STAMP" ]]; then
  rm -rf node_modules
  npm ci --ignore-scripts --no-audit --no-fund
  ./node_modules/.bin/patch-package
  touch "$DEPS_STAMP"
fi

BASE_URL=/assets/vendor/livecodes-v49/ \
DOCS_BASE_URL=null \
npm run build:app

test -f build/index.html
test -f build/sdk/livecodes.js

rm -rf "$DEST"
mkdir -p "$DEST"
cp -a build/. "$DEST/"

printf 'Vendored LiveCodes v49 built to %s\n' "$DEST"

# Remove non-runtime LiveCodes AI-agent documentation that Jekyll would parse as Liquid.
rm -rf "$DEST/sdk/skills"
