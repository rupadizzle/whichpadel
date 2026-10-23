#!/usr/bin/env bash
# Branch preview, same fast path as deploy.sh (use --full for the complete suite). Never touches production.
set -euo pipefail; cd "$(dirname "$0")"; . scripts/qa-lib.sh
BR=$(git rev-parse --abbrev-ref HEAD | tr "/_" "--"); [ "$BR" != main ] || fail "on main"
build
if [ "${1:-}" = --full ]; then full; else smoke; fi
step "deploy $BR"; URL=$($W --branch "$BR" 2>&1 | grep -o 'https://[a-z0-9.-]*pages\.dev' | tail -1); [ -n "$URL" ] || fail "preview deploy"
live "$URL"
step "PREVIEW READY $URL"
