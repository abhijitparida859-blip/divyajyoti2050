/**
 * Cut ONE mantra cycle out of a long recording → app-ready loop file.
 *
 * Usage (after installing ffmpeg — see tools/README-audio.md):
 *   node tools/cut_mantra.cjs <input.mp3> <startSec> <endSec> <outSlug>
 *
 * Example (Gayatri — 1 jap, adjust times after listening):
 *   node tools/cut_mantra.cjs incoming/gayatri_full.mp3 12 20 gayatri
 *
 * Produces: public/audio/gayatri.mp3 (mono 44.1kHz 96k — small, loops well)
 * Then wire it into src/core/japa/mantra_library.ts:
 *   audio: { url: '/audio/gayatri.mp3', start: 0, end: <duration>, credit: '...' }
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [input, startS, endS, slug] = process.argv.slice(2);
if (!input || !startS || !endS || !slug) {
  console.error('Usage: node tools/cut_mantra.cjs <input> <startSec> <endSec> <outSlug>');
  process.exit(1);
}

const start = parseFloat(startS);
const end = parseFloat(endS);
if (!(end > start)) {
  console.error('endSec must be greater than startSec');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'public', 'audio');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${slug}.mp3`);

// 50ms fades so the 108x loop has no clicks at the seam
const dur = (end - start).toFixed(3);
const fadeOutAt = Math.max(0, end - start - 0.05).toFixed(3);
const args = [
  '-y',
  '-ss', String(start),
  '-t', String(dur),
  '-i', input,
  '-ac', '1',
  '-ar', '44100',
  '-b:a', '96k',
  '-af', `afade=t=in:st=0:d=0.05,afade=t=out:st=${fadeOutAt}:d=0.05`,
  out,
];

try {
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  const size = fs.statSync(out).size;
  console.log(`OK → ${out} (${(size / 1024).toFixed(1)} KB, ${dur}s loop)`);
} catch (e) {
  console.error('ffmpeg failed — is it installed? See tools/README-audio.md');
  process.exit(1);
}
