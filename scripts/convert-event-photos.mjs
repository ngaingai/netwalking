#!/usr/bin/env node
/*
 * Convert event photos to web-ready webp.
 *
 * Usage:
 *   node scripts/convert-event-photos.mjs <sourceDir> <slug> [coverFilename]
 *
 * Example:
 *   node scripts/convert-event-photos.mjs ~/Dropbox/NetWalking/Ikebukuro netwalking-021 1.jpg
 *
 * Output (convention used across the site):
 *   public/events/<slug>.webp        <- cover  (coverFilename, or first file sorted)
 *   public/events/<slug>/NN.webp     <- carousel, zero-padded in sorted order
 *
 * Everything is 1600px wide, webp q82.
 *
 * IMPORTANT: every image is piped through sharp's `.rotate()` with NO args. That
 * auto-applies the EXIF orientation tag and bakes it into the pixels, so phone
 * photos that store "which way is up" as metadata can't end up sideways/upside
 * down once the tag is stripped on write. Do not remove the `.rotate()`.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const [, , sourceDir, slug, coverFilename] = process.argv;

if (!sourceDir || !slug) {
  console.error("Usage: node scripts/convert-event-photos.mjs <sourceDir> <slug> [coverFilename]");
  process.exit(1);
}

const WIDTH = 1600;
const QUALITY = 82;
const IMG_RE = /\.(jpe?g|png|heic|webp)$/i;

async function toWebp(input, output) {
  await sharp(input)
    .rotate() // auto-orient from EXIF, then bake it in — prevents upside-down/sideways
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  const m = await sharp(output).metadata();
  const kb = Math.round(fs.statSync(output).size / 1024);
  const src = await sharp(input).metadata();
  const flag = src.orientation && src.orientation !== 1 ? `  (source EXIF orientation ${src.orientation} → corrected)` : "";
  console.log(`${path.relative(process.cwd(), output).padEnd(40)} ${m.width}x${m.height}  ${kb}KB${flag}`);
}

const all = fs.readdirSync(sourceDir).filter((f) => IMG_RE.test(f)).sort();
const cover = coverFilename || all[0];
const carousel = all.filter((f) => f !== cover);

if (!cover) {
  console.error(`No images found in ${sourceDir}`);
  process.exit(1);
}

const destDir = path.join("public", "events", slug);
fs.mkdirSync(destDir, { recursive: true });

console.log(`Cover:`);
await toWebp(path.join(sourceDir, cover), path.join("public", "events", `${slug}.webp`));

console.log(`Carousel (${carousel.length}):`);
let i = 1;
for (const f of carousel) {
  const n = String(i).padStart(2, "0");
  await toWebp(path.join(sourceDir, f), path.join(destDir, `${n}.webp`));
  i++;
}

console.log(`\nDone. After converting, eyeball the results — metadata can't catch a photo that was already baked wrong upstream.`);
