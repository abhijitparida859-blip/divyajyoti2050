// Pure pixel utilities — no canvas, fully unit-testable
export interface Img { data: Uint8ClampedArray; width: number; height: number; }
export interface Box { x0: number; y0: number; x1: number; y1: number; }

export function toGray(img: Img): Float32Array {
  const n = img.width * img.height; const g = new Float32Array(n);
  for (let i = 0; i < n; i++) g[i] = 0.299 * img.data[i * 4] + 0.587 * img.data[i * 4 + 1] + 0.114 * img.data[i * 4 + 2];
  return g;
}

// YCbCr skin segmentation (classic RGB->YCbCr bands) + warm-channel test
export function skinMask(img: Img): Uint8Array {
  const n = img.width * img.height; const m = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = img.data[i * 4], g = img.data[i * 4 + 1], b = img.data[i * 4 + 2];
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    if (cb >= 77 && cb <= 132 && cr >= 133 && cr <= 180 && y >= 55 && y <= 245 && r > b) m[i] = 1;
  }
  return m;
}

// separable box blur (running sums)
export function boxMean(src: Float32Array, w: number, h: number, r: number): Float32Array {
  const tmp = new Float32Array(w * h); const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    let sum = 0; const row = y * w;
    for (let x = -r; x <= r; x++) sum += src[row + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / (2 * r + 1);
      sum -= src[row + Math.min(w - 1, Math.max(0, x - r))];
      sum += src[row + Math.min(w - 1, Math.max(0, x + r + 1))];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / (2 * r + 1);
      sum -= tmp[Math.min(h - 1, Math.max(0, y - r)) * w + x];
      sum += tmp[Math.min(h - 1, Math.max(0, y + r + 1)) * w + x];
    }
  }
  return out;
}

// positive where pixel darker than local surroundings (ridge = palm line)
export function darkMap(gray: Float32Array, mean: Float32Array): Float32Array {
  const n = gray.length; const d = new Float32Array(n);
  for (let i = 0; i < n; i++) d[i] = Math.max(0, mean[i] - gray[i]);
  return d;
}

// bbox by mask row/col projections (threshold 25% of peak)
export function palmBBox(mask: Uint8Array, w: number, h: number): Box | null {
  const cols = new Int32Array(w); const rows = new Int32Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) { cols[x]++; rows[y]++; }
  const maxC = Math.max(...cols) || 1; const maxR = Math.max(...rows) || 1;
  let x0 = -1, x1 = -1, y0 = -1, y1 = -1;
  for (let x = 0; x < w; x++) if (cols[x] >= maxC * 0.25) { if (x0 < 0) x0 = x; x1 = x; }
  for (let y = 0; y < h; y++) if (rows[y] >= maxR * 0.25) { if (y0 < 0) y0 = y; y1 = y; }
  if (x0 < 0 || y0 < 0 || x1 - x0 < w * 0.12 || y1 - y0 < h * 0.12) return null;
  return { x0, y0, x1, y1 };
}
