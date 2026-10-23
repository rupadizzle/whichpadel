#!/usr/bin/env bash
# Build fresh, QA, deploy to preview, QA the preview, then deploy to main. Aborts on any failure.
set -euo pipefail
cd "$(dirname "$0")"
export CLOUDFLARE_ACCOUNT_ID=d8202fcd97eb92f367c3d0faf4b31372
W="npx -y -p node@22 -p wrangler@latest wrangler pages deploy dist --project-name whichpadel"
fail(){ echo "ABORT: $1"; exit 1; }
curl -sf -o /dev/null http://127.0.0.1:4987/ || (nohup npx astro preview --port 4987 --host 127.0.0.1 >/tmp/wp-preview.log 2>&1 &) ; node scripts/translate-missing.mjs | tee /tmp/wp-tm.log; grep -q "complete" /tmp/wp-tm.log || fail "translate-missing (untranslated keys, see /tmp/wp-tm.log)"
rm -rf dist && npm run build >/tmp/wp-build.log 2>&1 || fail "build (see /tmp/wp-build.log)"
node curtextqa.mjs | tee /tmp/wp-cur.log; grep -q "CURTEXT PASS" /tmp/wp-cur.log || fail curtextqa
node qa.mjs        2>&1 | tee /tmp/wp-qa.log;     grep -q "QA PASS" /tmp/wp-qa.log || fail qa
node layoutqa.mjs  | tee /tmp/wp-lqa.log;    grep -q "LAYOUT VIOLATIONS 0" /tmp/wp-lqa.log || fail layoutqa
node mixqa.mjs     | tee /tmp/wp-mix.log;    grep -q "^0 issues" /tmp/wp-mix.log || fail mixqa
node padqa.mjs     | tee /tmp/wp-pad.log;    grep -q "PASS" /tmp/wp-pad.log || fail padqa
node pxqa.mjs      | tee /tmp/wp-px.log;     grep -q "PXQA PASS" /tmp/wp-px.log || fail pxqa
node geoqa.mjs     | tee /tmp/wp-geo.log;    grep -q "GEOQA PASS" /tmp/wp-geo.log || fail geoqa
node cmpqa.mjs     | tee /tmp/wp-cmp.log;    grep -q "CMPQA PASS" /tmp/wp-cmp.log || fail cmpqa
URL=$($W --branch preview 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1)
[ -n "$URL" ] || fail "preview deploy"
echo "preview: $URL"; sleep 10
node parity.mjs "$URL" || fail "parity (preview)"
node curqa.mjs "$URL" || fail "curqa (preview)"
node subqa.mjs "$URL" || fail "subqa (preview)"
node pickerqa.mjs "$URL" || fail "pickerqa (preview)"
$W --branch main 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1
echo DEPLOYED
