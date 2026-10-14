#!/bin/sh
# ./build.sh <video-name>   prep -> music -> frames -> final mp4 -> check
# Needs Node 22+, ffmpeg and Chromium. Narration clips must already be in videos/<name>/narration/.
set -e
cd "$(dirname "$0")"
NAME="$1"
[ -n "$NAME" ] || { echo "usage: ./build.sh <video-name>"; exit 1; }

# Chromium running as root needs --no-sandbox; wrap it if CHROME_PATH is not already set
if [ -z "$CHROME_PATH" ]; then
  for c in /opt/pw-browsers/chromium "$(command -v chromium)" "$(command -v chromium-browser)" "$(command -v google-chrome)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then
      W="$(mktemp -d)/chrome-nosandbox.sh"
      printf '#!/bin/sh\nexec "%s" --no-sandbox "$@"\n' "$c" > "$W"; chmod +x "$W"
      export CHROME_PATH="$W"; break
    fi
  done
fi

node prep.js "$NAME"
node song.js
node engine/render.js video
node engine/render.js mux
node engine/render.js check
echo "done: out/$(basename "$PWD").mp4  (copy it to videos/$NAME/final.mp4)"
