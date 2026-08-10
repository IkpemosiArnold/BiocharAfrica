/**
 * Build responsive image derivatives + LQIP placeholders from the field photos.
 *
 * Source reality: nothing exceeds 1280px on the long edge, so we never upscale.
 * Widths are clamped to the original. Anything asking for more than the source
 * has gets the source width instead.
 *
 * Two photos carry phone-brand burn-ins ("Shot on M7", "Infinix NOTE 12i") which
 * are pure noise and get cropped. The GPS Map Camera stamps are deliberately
 * KEPT: they are verifiable provenance for the field-log section, not a defect.
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = "_source/photos";
const OUT = "public/media/photos";
const WIDTHS = [400, 640, 960, 1280];

// Bottom-edge burn-ins to crop away, as a fraction of height to KEEP.
const CROP_KEEP = {
  "_wm-wm-char-bed-hand": 0.87, // "Shot on M7 Gionee Dual Camera"
  "production-sacks-stored": 0.9, // "Infinix NOTE 12i"
};

// Photos whose GPS stamp is the point, surfaced as field evidence.
const PROVENANCE = new Set([
  "_wm-gps-bida-tilling",
  "_wm-gps-jima-transplanting",
  "_wm-gps-suntale-char-spread",
]);

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
const manifest = {};

for (const file of files) {
  const slug = path.basename(file, path.extname(file)).replace(/^_wm-/, "");
  const rawKey = path.basename(file, path.extname(file));

  let pipeline = sharp(path.join(SRC, file)).rotate();
  const meta = await pipeline.metadata();

  const keep = CROP_KEEP[rawKey];
  let w = meta.width;
  let h = meta.height;
  if (keep) {
    h = Math.round(meta.height * keep);
    pipeline = pipeline.extract({ left: 0, top: 0, width: w, height: h });
  }

  const buf = await pipeline.toBuffer();
  const widths = WIDTHS.filter((x) => x <= w);
  if (widths.length === 0 || widths[widths.length - 1] < w) widths.push(w);

  for (const width of widths) {
    const base = sharp(buf).resize({ width, withoutEnlargement: true });
    await base
      .clone()
      .avif({ quality: 52, effort: 6 })
      .toFile(path.join(OUT, `${slug}-${width}.avif`));
    await base
      .clone()
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT, `${slug}-${width}.webp`));
  }

  // LQIP: a 20px-wide blur the browser can paint instantly under the real image.
  const lqip = await sharp(buf)
    .resize({ width: 20 })
    .blur(1.2)
    .webp({ quality: 30 })
    .toBuffer();

  manifest[slug] = {
    width: w,
    height: h,
    aspect: +(w / h).toFixed(4),
    widths,
    provenance: PROVENANCE.has(rawKey),
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };

  console.log(
    `  ${slug.padEnd(32)} ${String(w).padStart(4)}x${String(h).padEnd(4)} → ${widths.join(", ")}`
  );
}

await writeFile(
  "app/lib/photo-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n"
);
console.log(`\n${Object.keys(manifest).length} photos processed.`);
