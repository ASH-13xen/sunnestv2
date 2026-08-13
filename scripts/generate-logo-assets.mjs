/**
 * Derives every shipped logo asset from the master artwork in brand/.
 *
 *   node scripts/generate-logo-assets.mjs
 *
 * Re-run this after replacing brand/sunnest-logo.png. The crop rectangles below
 * are measured against that exact file — if the artwork is re-exported at a
 * different size or with different padding, they must be re-measured.
 *
 * sharp is not a direct dependency; it resolves from the copy Next.js installs
 * for its image optimizer.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'brand/sunnest-logo.png');
// Separate emblem-only export: just the S and solar panel, no sunburst, no
// wordmark, clean alpha. The full lockup can't produce this by cropping — its
// sunburst is painted behind the wordmark, so an emblem cut from it is clipped
// along the bottom.
const EMBLEM_SRC = path.join(ROOT, 'brand/sunnest-emblem.png');
const PUB = path.join(ROOT, 'public');
const APP = path.join(ROOT, 'app');

// ── Measured against brand/sunnest-logo.png (3375 x 4219) ───────────────────
// Full lockup: first content row (the rays) through the last row of the tagline.
const LOCKUP = { left: 32, top: 712, width: 3307, height: 3009 };
// Measured against brand/sunnest-emblem.png (1951 x 2048), which is mostly
// empty canvas — the artwork's alpha bbox is only 764 x 730 at (591, 563).
// Trimmed to that, plus an 8px transparent margin so antialiased edges aren't
// clipped by downstream resizes.
const EMBLEM = { left: 583, top: 555, width: 780, height: 746 };
// The gold "S" + solar-panel sphere. The bbox of saturated gold/blue — which
// excludes the pale-yellow rays — is x 918..2426, y 1204..2656. Squared and
// centred on that, with the bottom pinned to 2696: the "SunNest" wordmark's
// ascenders start at y=2705 and the crop has to clear them.
const MARK = { left: 904, top: 1160, width: 1536, height: 1536 };
// The tagline "TURNING SUNLIGHT INTO SAVINGS" is pure black in the source, so
// it is invisible on the navy backgrounds it has to sit on. Rows 3537..3637 are
// empty, so everything past this row is tagline and nothing else.
const TAGLINE_FROM = 3600;

const NAVY = { r: 0x0a, g: 0x16, b: 0x28 };
const TAGLINE_GOLD = { r: 0xe6, g: 0xc8, b: 0x78 };

const rows = [];
const report = async (label, file) => {
  const { width, height } = await sharp(file).metadata();
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  rows.push(
    `${label.padEnd(24)} ${`${width}x${height}`.padEnd(10)} ${kb.padStart(7)} KB  ${path
      .relative(ROOT, file)
      .replace(/\\/g, '/')}`
  );
};

// ── 1. Recolor the black tagline to gold, preserving its alpha ──────────────
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
for (let y = TAGLINE_FROM; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (data[i + 3] > 0) {
      data[i] = TAGLINE_GOLD.r;
      data[i + 1] = TAGLINE_GOLD.g;
      data[i + 2] = TAGLINE_GOLD.b;
    }
  }
}
const base = () => sharp(data, { raw: { width: W, height: H, channels: C } });

// ── 2. Full lockup — Open Graph card + schema.org logo ──────────────────────
// WebP rather than PNG: photographic gold gradients over alpha cost ~950 KB as
// PNG and a fraction of that as WebP with no visible loss.
const lockupBuf = await base().extract(LOCKUP).png().toBuffer();
const lockupFile = path.join(PUB, 'logo-lockup.webp');
await sharp(lockupBuf).resize({ width: 900 }).webp({ quality: 90, effort: 6 }).toFile(lockupFile);
await report('lockup', lockupFile);

// Emblem — loading screen. 512px is ~4x the largest size it renders at.
const emblemFile = path.join(PUB, 'logo-emblem.webp');
await sharp(EMBLEM_SRC)
  .extract(EMBLEM)
  .resize({ width: 512 })
  .webp({ quality: 92, effort: 6 })
  .toFile(emblemFile);
await report('emblem', emblemFile);

// ── 3. Navy tile — navbar, footer, favicon, app icon ────────────────────────
// The emblem's glow is opaque right up to the crop edge, so a bare transparent
// mark clips into a visible square patch once scaled to ~32px. Seating it on a
// tile makes that edge deliberate, and matches the rounded-square language the
// navbar toggle and footer already use.
const markBuf = await base().extract(MARK).png().toBuffer();

const tile = async (size, radius, { opaque = false, border = false } = {}) => {
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <defs>
         <radialGradient id="g" cx="50%" cy="46%" r="50%">
           <stop offset="0%" stop-color="#FFCA28" stop-opacity="0.22"/>
           <stop offset="60%" stop-color="#FFCA28" stop-opacity="0.06"/>
           <stop offset="100%" stop-color="#FFCA28" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#0A1628"/>
       <circle cx="${size / 2}" cy="${size * 0.46}" r="${Math.round(size * 0.46)}" fill="url(#g)"/>
     </svg>`
  );
  const inner = Math.round(size * 0.7);
  const layers = [
    { input: await sharp(markBuf).resize({ width: inner, height: inner }).png().toBuffer(), gravity: 'center' },
  ];
  if (border) {
    // Hairline so the tile still reads where it sits on a dark background.
    const w = Math.max(1, size / 128);
    layers.push({
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
           <rect x="${w / 2}" y="${w / 2}" width="${size - w}" height="${size - w}"
                 rx="${radius}" ry="${radius}" fill="none"
                 stroke="rgba(255,202,40,0.28)" stroke-width="${w}"/>
         </svg>`
      ),
      top: 0,
      left: 0,
    });
  }
  let img = sharp(bg).composite(layers);
  if (opaque) img = img.flatten({ background: NAVY });
  return img.png({ compressionLevel: 9 }).toBuffer();
};

const tileFile = path.join(PUB, 'logo-tile.webp');
await sharp(await tile(256, 56, { border: true })).webp({ quality: 92, effort: 6 }).toFile(tileFile);
await report('ui tile', tileFile);

const icon512 = await tile(512, 112);
const iconFile = path.join(APP, 'icon.png');
fs.writeFileSync(iconFile, icon512);
await report('tab icon', iconFile);

// iOS applies its own rounded mask, so this one must be square and opaque.
const appleFile = path.join(APP, 'apple-icon.png');
fs.writeFileSync(appleFile, await tile(180, 0, { opaque: true }));
await report('apple touch icon', appleFile);

// ── 4. Square logo for schema.org Organization.logo ─────────────────────────
// Google reads this for the logo rich result / knowledge panel. It is flattened
// onto navy rather than left transparent because the recoloured tagline is a
// pale gold that would wash out on a white surface.
const schemaFile = path.join(PUB, 'logo-schema.png');
await sharp({ create: { width: 512, height: 512, channels: 4, background: { ...NAVY, alpha: 1 } } })
  .composite([
    { input: await sharp(lockupBuf).resize({ width: 430, height: 430, fit: 'inside' }).png().toBuffer(), gravity: 'centre' },
  ])
  .flatten({ background: NAVY })
  .png({ compressionLevel: 9 })
  .toFile(schemaFile);
await report('schema.org logo', schemaFile);

// ── 5. favicon.ico — 16/32/48 PNG-in-ICO ────────────────────────────────────
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(
  icoSizes.map((s) => sharp(icon512).resize({ width: s, height: s }).png({ compressionLevel: 9 }).toBuffer())
);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(1, 2); // type: icon
icoHeader.writeUInt16LE(icoSizes.length, 4);
const icoDir = Buffer.alloc(16 * icoSizes.length);
let icoOffset = 6 + icoDir.length;
icoSizes.forEach((s, i) => {
  const e = i * 16;
  icoDir.writeUInt8(s, e);
  icoDir.writeUInt8(s, e + 1);
  icoDir.writeUInt16LE(1, e + 4); // planes
  icoDir.writeUInt16LE(32, e + 6); // bpp
  icoDir.writeUInt32LE(icoPngs[i].length, e + 8);
  icoDir.writeUInt32LE(icoOffset, e + 12);
  icoOffset += icoPngs[i].length;
});
const icoFile = path.join(APP, 'favicon.ico');
fs.writeFileSync(icoFile, Buffer.concat([icoHeader, icoDir, ...icoPngs]));
rows.push(
  `${'favicon.ico'.padEnd(24)} ${'16/32/48'.padEnd(10)} ${(fs.statSync(icoFile).size / 1024)
    .toFixed(1)
    .padStart(7)} KB  app/favicon.ico`
);

// ── 6. Open Graph / Twitter card ────────────────────────────────────────────
const OG_W = 1200;
const OG_H = 630;
const heroPath = path.join(PUB, 'images/hero-bg.png');
const ogLayers = [];

if (fs.existsSync(heroPath)) {
  ogLayers.push({
    input: await sharp(heroPath)
      .resize({ width: OG_W, height: OG_H, fit: 'cover', position: 'centre' })
      .modulate({ brightness: 0.42, saturation: 0.35 })
      .png()
      .toBuffer(),
  });
}

ogLayers.push({
  input: Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
       <defs>
         <radialGradient id="glow" cx="50%" cy="44%" r="46%">
           <stop offset="0%" stop-color="#FFCA28" stop-opacity="0.20"/>
           <stop offset="55%" stop-color="#FF9100" stop-opacity="0.06"/>
           <stop offset="100%" stop-color="#0A1628" stop-opacity="0"/>
         </radialGradient>
         <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stop-color="#0A1628" stop-opacity="0.55"/>
           <stop offset="45%" stop-color="#0A1628" stop-opacity="0.72"/>
           <stop offset="100%" stop-color="#0A1628" stop-opacity="0.94"/>
         </linearGradient>
       </defs>
       <rect width="${OG_W}" height="${OG_H}" fill="url(#vig)"/>
       <rect width="${OG_W}" height="${OG_H}" fill="url(#glow)"/>
       <rect x="0" y="${OG_H - 6}" width="${OG_W}" height="6" fill="#D4A017"/>
     </svg>`
  ),
});
ogLayers.push({ input: await sharp(lockupBuf).resize({ height: 486 }).png().toBuffer(), gravity: 'centre' });

const ogFile = path.join(APP, 'opengraph-image.png');
await sharp({ create: { width: OG_W, height: OG_H, channels: 4, background: { ...NAVY, alpha: 1 } } })
  .composite(ogLayers)
  .flatten({ background: NAVY })
  .png({ compressionLevel: 9 })
  .toFile(ogFile);
await report('open graph card', ogFile);

fs.copyFileSync(ogFile, path.join(APP, 'twitter-image.png'));
await report('twitter card', path.join(APP, 'twitter-image.png'));

console.log(rows.join('\n'));
