#!/usr/bin/env bash
# Fast by default (~2 min): build, parallel smoke QA on ~50 sample pages at 390/1280 (+ static checks on every page), deploy, live check.
# ./deploy.sh --full : complete suite at all sizes on every page type, deploy to preview + full preview QA first, then production.
set -euo pipefail; cd "$(dirname "$0")"; . scripts/qa-lib.sh
build
if [ "${1:-}" = --full ]; then
 full
 URL=$($W --branch preview 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1); [ -n "$URL" ] || fail "preview deploy"; step "preview $URL"; sleep 8
 par "parity|, 0 mismatches|node parity.mjs $URL" "cur|curqa: pass|node curqa.mjs $URL" "picker|PICKERQA PASS|node pickerqa.mjs $URL"; live "$URL"
else smoke; fi
step deploy; $W --branch main >$L/deploy.log 2>&1 || { cat $L/deploy.log; fail "wrangler deploy"; }
live https://whichpadel.com
step DEPLOYED
