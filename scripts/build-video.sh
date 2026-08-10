#!/usr/bin/env bash
# Transcode source field footage into graded web deliverables.
#
# The source is WhatsApp-compressed phone video (576x1024 portrait). It will
# never be sharp, so we grade it hard and let the shared CSS grain layer supply
# film texture. The softness then reads as emulsion rather than as low
# resolution. These clips are never presented full-bleed at 1:1.
#
# Three decisions here were corrections to an obvious first instinct:
#
#   1. NO WebM. VP9 came out 3-4x LARGER than H.264 on this material, grainy,
#      already-compressed phone footage is close to the worst case for VP9 at a
#      sane crf, and H.264 plays everywhere the audience is. A second codec that
#      is bigger is not a fallback, it is dead weight.
#
#   2. NO ffmpeg grain. Temporal noise is nearly incompressible and was inflating
#      every file. The .grain overlay in globals.css applies film texture over
#      the entire page, photography, video and WebGL alike, for the cost of one
#      tiled SVG. Grain belongs in the compositor, not in the codec.
#
#   3. Denoise FIRST. Stripping the source's existing compression mush before
#      grading both cleans up the grade and gives the encoder far less noise to
#      spend bits on. Denoise -> grade -> CSS grain is the order that works.
set -euo pipefail

SRC="_source/videos"
OUT="public/media/video"
mkdir -p "$OUT"
rm -f "$OUT"/*.webm "$OUT"/*.png

# Light denoise, then a filmic grade: lifted-but-crushed blacks, rolled
# highlights, green push, vignette. Applied identically to every clip so the set
# cuts together as one shoot.
GRADE="hqdn3d=2:1.5:3:3,\
eq=contrast=1.14:saturation=1.12:gamma=0.97,\
colorbalance=rs=-0.05:gs=0.02:bs=-0.03:rm=-0.03:gm=0.05:bm=-0.04:rh=0.02:gh=0.03:bh=-0.05,\
curves=all='0/0.015 0.22/0.16 0.78/0.84 1/0.985',\
vignette=PI/4.5"

# name|source file|start|duration, trimmed to the strongest beat of each clip
CLIPS=(
  "broadcast-elder|WhatsApp Video 2026-08-09 at 21.44.44.mp4|0|3.6"
  "broadcast-strawhat|WhatsApp Video 2026-08-09 at 22.18.47 (1).mp4|0.5|7"
  "broadcast-headwrap|WhatsApp Video 2026-08-09 at 22.18.47.mp4|2|8"
  "broadcast-mountains|WhatsApp Video 2026-08-09 at 22.18.48 (1).mp4|0|7"
  "broadcast-braids|WhatsApp Video 2026-08-09 at 22.18.48.mp4|1|8"
  "training-tiller|WhatsApp Video 2026-08-09 at 21.46.01.mp4|0|9"
)

for entry in "${CLIPS[@]}"; do
  IFS='|' read -r name src start dur <<< "$entry"
  printf '→ %-22s' "$name"

  # 576 = native width, for desktop panels. 384 = phones, roughly half the bytes
  # and indistinguishable at the size it is actually displayed.
  for spec in "576:30" "384:32"; do
    w="${spec%%:*}"; crf="${spec##*:}"
    ffmpeg -v error -y -ss "$start" -t "$dur" -i "$SRC/$src" \
      -vf "${GRADE},fps=24,scale=${w}:-2:flags=lanczos" \
      -an -movflags +faststart \
      -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p \
      -crf "$crf" -preset slower -g 48 \
      "$OUT/${name}-${w}.mp4"
  done

  # Poster taken 25% into the trim, so it is never a black leader frame.
  # This ffmpeg build has no libwebp, so it emits PNG and sharp converts below.
  poster_at=$(awk "BEGIN{printf \"%.2f\", $start + $dur*0.25}")
  ffmpeg -v error -y -ss "$poster_at" -i "$SRC/$src" \
    -vf "${GRADE},scale=576:-2:flags=lanczos" -frames:v 1 \
    "$OUT/${name}-poster.png"

  printf ' %5.0f KB (576)  %5.0f KB (384)\n' \
    "$(stat -f%z "$OUT/${name}-576.mp4" | awk '{print $1/1024}')" \
    "$(stat -f%z "$OUT/${name}-384.mp4" | awk '{print $1/1024}')"
done

echo "→ converting posters to webp"
node --input-type=module -e "
import sharp from 'sharp';
import { readdir, unlink } from 'node:fs/promises';
const dir = 'public/media/video';
for (const f of (await readdir(dir)).filter(f => f.endsWith('-poster.png'))) {
  const out = f.replace(/\.png$/, '.webp');
  await sharp(\`\${dir}/\${f}\`).webp({ quality: 66, effort: 5 }).toFile(\`\${dir}/\${out}\`);
  await unlink(\`\${dir}/\${f}\`);
}
"

echo
echo "total: $(du -sh "$OUT" | cut -f1)"
ls -la "$OUT" | tail -n +4 | awk '{printf "  %-34s %6.0f KB\n", $9, $5/1024}'
