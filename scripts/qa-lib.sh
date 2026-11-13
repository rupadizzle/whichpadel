# Shared by deploy.sh / preview.sh. Sourced; expects set -euo pipefail.
if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then echo "ABORT: CLOUDFLARE_ACCOUNT_ID is not set" >&2; exit 1; fi
W="npx -y -p node@22 -p wrangler@latest wrangler pages deploy dist --project-name whichpadel"
L=${WPQA_DIR:-/tmp/wpqa}; mkdir -p $L
fail(){ echo "ABORT: $1"; exit 1; }
T0=$(date +%s); step(){ echo "[$(( $(date +%s)-T0 ))s] $*"; }
build(){
 step translate; node scripts/translate-missing.mjs >$L/tm.log 2>&1; grep -q complete $L/tm.log || fail "translate-missing ($L/tm.log)"
 step lint; npx stylelint "src/**/*.{css,astro}" >$L/lint.log 2>&1 || fail "stylelint: raw values or hacks outside the design system ($L/lint.log)"
 step redirects; node scripts/redirectsqa.mjs >$L/redirects.log 2>&1 || fail "_redirects: rules Cloudflare would drop ($L/redirects.log)"
 step build; rm -rf dist && npm run build >$L/build.log 2>&1 || fail "build ($L/build.log)"
 # always restart the local server: astro preview caches the file list at start, a stale one serves false 404s
 pkill -f "astro preview --port ${QA_PORT:-4987}" || true; (nohup npx astro preview --port ${QA_PORT:-4987} --host 127.0.0.1 >$L/srv.log 2>&1 &)
 for i in $(seq 40); do curl -sf -o /dev/null http://127.0.0.1:${QA_PORT:-4987}/ && break; sleep 0.25; done
}
# run "name|expected-regex|command" jobs in parallel, fail if any misses its PASS marker
par(){ local pids=() names=() pats=(); for j in "$@"; do IFS='|' read -r n p c <<<"$j"; (bash -c "$c" >$L/$n.log 2>&1; true) & pids+=($!); names+=($n); pats+=("$p"); done
 local bad=0; for i in "${!pids[@]}"; do wait ${pids[$i]}; grep -qE "${pats[$i]}" $L/${names[$i]}.log || { echo "FAIL ${names[$i]} (see $L/${names[$i]}.log)"; tail -15 $L/${names[$i]}.log; bad=1; }; done
 [ $bad = 0 ] || fail QA; }
smoke(){
 step "smoke QA (parallel, 360+390+1280)"; export QA_FAST=1 QA_WIDTHS=360,390,1280 QA_PAGES=$(node scripts/smoke-pages.mjs)
 par "curtext|CURTEXT PASS|node qa/curtextqa.mjs" "mix|^0 issues|node qa/mixqa.mjs" "px|PXQA PASS|node qa/pxqa.mjs" "seo|0 issues|NODE_OPTIONS=--max-old-space-size=6144 node qa/seoqa.mjs" \
     "qa|QA PASS|node qa/qa.mjs" "layout|LAYOUT VIOLATIONS 0|node qa/layoutqa.mjs" "parity|, 0 mismatches|node qa/parity.mjs http://127.0.0.1:${QA_PORT:-4987}" \
     "pad|PASS|node qa/padqa.mjs" "geo|GEOQA PASS|node qa/geoqa.mjs" "cmp|CMPQA PASS|node qa/cmpqa.mjs" "picker|PICKERQA PASS|node qa/pickerqa.mjs" "cur|curqa: pass|node qa/curqa.mjs http://127.0.0.1:${QA_PORT:-4987}"
 unset QA_FAST QA_WIDTHS QA_PAGES; }
full(){
 step "full QA (all pages/sizes)"
 par "curtext|CURTEXT PASS|node qa/curtextqa.mjs" "mix|^0 issues|node qa/mixqa.mjs" "px|PXQA PASS|node qa/pxqa.mjs" "cmp|CMPQA PASS|node qa/cmpqa.mjs" "geo|GEOQA PASS|node qa/geoqa.mjs" "pad|PAD .*PASS|node qa/padqa.mjs"
 par "qa|QA PASS|node qa/qa.mjs" "layout|LAYOUT VIOLATIONS 0|node qa/layoutqa.mjs"; }
live(){ # post-deploy check against a deployed URL
 step "check $1"; sleep 3
 for p in / /es/ /rackets/head-evo-speed-2025/ /compare/ /best/best-round-padel-rackets/ /api/prices /api/all-prices /api/shoe-prices; do c=$(curl -s -o /dev/null -w '%{http_code}' "$1$p"); [ "$c" = 200 ] || fail "$1$p -> $c"; done
 node qa/subqa.mjs "$1" >$L/sub.log 2>&1 || { cat $L/sub.log; fail "subqa $1"; } }
