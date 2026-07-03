#!/bin/bash
# Ensambla index.html desde la fuente maestra (game.html) y versiona el
# service worker. La fuente maestra no lleva <html>/<head>/<body> porque
# también se publica como Artifact de claude.ai (que la envuelve solo).
set -euo pipefail
cd "$(dirname "$0")"

LINE=$(grep -n '</style>' game.html | head -1 | cut -d: -f1)
{
  echo '<!DOCTYPE html>'
  echo '<html lang="es">'
  echo '<head>'
  head -n "$LINE" game.html
  cat head-extra.html
  echo '</head>'
  echo '<body>'
  tail -n +"$((LINE+1))" game.html
  cat body-extra.html
  echo '</body>'
  echo '</html>'
} > index.html

sed "s/__BUILD__/$(date +%Y%m%d%H%M%S)/" sw.template.js > sw.js
echo "✓ index.html y sw.js generados"
