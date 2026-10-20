#!/usr/bin/env bash
# Build fresh, QA, deploy to preview, QA the preview, then deploy to main. Aborts on any failure.
set -euo pipefail
cd "$(dirname "$0")"
export CLOUDFLARE_ACCOUNT_ID=d8202fcd97eb92f367c3d0faf4b31372
W="npx -y -p node@22 -p wrangler@latest wrangler pages deploy dist --project-name whichpadel"
fail(){ echo "ABORT: $1"; exit 1; }
curl -sf -o /dev/null http://127.0.0.1:4987/ || (nohup npx astro preview --port 4987 --host 127.0.0.1 >/tmp/wp-preview.log 2>&1 &) ; rm -rf dist && npm run build >/tmp/wp-build.log 2>&1 || fail "build (see /tmp/wp-build.log)"
node qa.mjs        2>&1 | tee /tmp/wp-qa.log;     grep -q "QA PASS" /tmp/wp-qa.log || fail qa
node layoutqa.mjs  | tee /tmp/wp-lqa.log;    grep -q "LAYOUT VIOLATIONS 0" /tmp/wp-lqa.log || fail layoutqa
node mixqa.mjs     | tee /tmp/wp-mix.log;    grep -q "^0 issues" /tmp/wp-mix.log || fail mixqa
URL=$($W --branch preview 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1)
[ -n "$URL" ] || fail "preview deploy"
echo "preview: $URL"; sleep 10
node parity.mjs "$URL" || fail "parity (preview)"
node curqa.mjs "$URL" || fail "curqa (preview)"
$W --branch main 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1
echo DEPLOYED
