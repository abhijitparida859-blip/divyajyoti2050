// Auto palm analysis: photo pixels -> shastra observations (no manual input)
import { Img, toGray, skinMask, boxMean, darkMap, palmBBox, Box } from './palmPixel';
import { RekhaKey, RekhaObs, ParvatKey, ParvatObs, HastaType } from './palmShastra1';

export interface LineDet { conf: number; frac: number; dark: number; gaps: number; runs: number; thick: number; cross: boolean; }
export interface AutoPalm {
  lines: Record<RekhaKey, LineDet>;
  mounts: Record<ParvatKey, ParvatObs>;
  hasta: HastaType;
  skinPct: number; aspect: number; quality: 'good' | 'fair' | 'poor';
  warnings: string[]; // codes: low_skin | no_palm | cropped | flat_light
}
const R = (n: number) => Math.max(0, Math.min(1, n));

function scanH(d: Float32Array, w: number, x0: number, x1: number, y0: number, y1: number, t: number): LineDet {
  const cols = x1 - x0; const det: LineDet = { conf: 0, frac: 0, dark: 0, gaps: 0, runs: 0, thick: 0, cross: false };
  if (cols < 8 || y1 <= y0) return det;
  let bestY = y0, bestS = -1;
  for (let y = y0; y < y1; y++) {
    let hits = 0, sum = 0;
    for (let x = x0; x < x1; x++) { const v = d[y * w + x]; if (v > t) { hits++; sum += v; } }
    const s = hits > 0 ? (hits / cols) * 0.5 + 0.5 * Math.min(1, sum / hits / 45) : -1;
    if (s > bestS) { bestS = s; bestY = y; }
  }
  const yA = Math.max(y0, bestY - 3), yB = Math.min(y1 - 1, bestY + 3);
  const prof = new Float32Array(cols);
  for (let x = x0; x < x1; x++) {
    let m = 0;
    for (let y = yA; y <= yB; y++) m = Math.max(m, d[y * w + x]);
    prof[x - x0] = m;
  }
  let first = -1, last = -1, hits = 0, sum = 0;
  for (let i = 0; i < cols; i++) if (prof[i] > t) { if (first < 0) first = i; last = i; hits++; sum += prof[i]; }
  if (first < 0) return det;
  det.frac = (last - first + 1) / cols;
  det.dark = sum / hits;
  let gaps = 0, runs = 0, inRun = false;
  for (let i = first; i <= last; i++) {
    if (prof[i] > t) { if (!inRun) { runs++; inRun = true; } }
    else { if (inRun) inRun = false; if (i > first && i < last) { let g = 0; let j = i; while (j <= last && prof[j] <= t) { g++; j++; } if (g >= 6) gaps++; i = j - 1; } }
  }
  det.gaps = gaps; det.runs = runs;
  let thick = 0, n = 0;
  for (let i = first; i <= last; i += Math.max(1, Math.floor(cols / 12))) {
    const x = x0 + i; let t2 = 0;
    for (let y = yA; y <= yB; y++) if (d[y * w + x] > t) t2++;
    if (t2 > 0) { thick += t2; n++; }
  }
  det.thick = n ? thick / n : 0;
  const hitRate = hits / cols;
  det.conf = R(hitRate * 0.55 + Math.min(1, det.dark / 45) * 0.45 * (det.frac > 0.15 ? 1 : 0.4));
  return det;
}
function scanV(d: Float32Array, w: number, x0: number, x1: number, y0: number, y1: number, t: number): LineDet {
  const rows = y1 - y0; const det: LineDet = { conf: 0, frac: 0, dark: 0, gaps: 0, runs: 0, thick: 0, cross: false };
  if (rows < 8 || x1 <= x0) return det;
  let bestX = x0, bestS = -1;
  for (let x = x0; x < x1; x++) {
    let hits = 0, sum = 0;
    for (let y = y0; y < y1; y++) { const v = d[y * w + x]; if (v > t) { hits++; sum += v; } }
    const s = hits > 0 ? (hits / rows) * 0.5 + 0.5 * Math.min(1, sum / hits / 45) : -1;
    if (s > bestS) { bestS = s; bestX = x; }
  }
  const xA = Math.max(x0, bestX - 3), xB = Math.min(x1 - 1, bestX + 3);
  const prof = new Float32Array(rows);
  for (let y = y0; y < y1; y++) {
    let m = 0;
    for (let x = xA; x <= xB; x++) m = Math.max(m, d[y * w + x]);
    prof[y - y0] = m;
  }
  let first = -1, last = -1, hits = 0, sum = 0;
  for (let i = 0; i < rows; i++) if (prof[i] > t) { if (first < 0) first = i; last = i; hits++; sum += prof[i]; }
  if (first < 0) return det;
  det.frac = (last - first + 1) / rows;
  det.dark = sum / hits;
  let gaps = 0, runs = 0, inRun = false;
  for (let i = first; i <= last; i++) {
    if (prof[i] > t) { if (!inRun) { runs++; inRun = true; } }
    else { if (inRun) inRun = false; if (i > first && i < last) { let g = 0; let j = i; while (j <= last && prof[j] <= t) { g++; j++; } if (g >= 6) gaps++; i = j - 1; } }
  }
  det.gaps = gaps; det.runs = runs;
  det.conf = R((hits / rows) * 0.55 + Math.min(1, det.dark / 45) * 0.45 * (det.frac > 0.15 ? 1 : 0.4));
  return det;
}
function mountLevel(d: Float32Array, mask: Uint8Array, w: number, cx: number, cy: number, rad: number, med: number): ParvatObs {
  let skin = 0, sum = 0, n = 0;
  for (let y = cy - rad; y <= cy + rad; y++) for (let x = cx - rad; x <= cx + rad; x++) {
    const dx = x - cx, dy = y - cy; if (dx * dx + dy * dy > rad * rad) continue;
    const i = y * w + x; if (i < 0 || i >= d.length) continue;
    n++; if (mask[i]) skin++; sum += d[i];
  }
  const fill = n ? skin / n : 0; const dk = n ? sum / n : 0;
  let level: ParvatObs['level'] = 'normal';
  if (fill < 0.6) level = 'flat'; else if (dk > med * 1.35 + 4) level = 'depressed';
  else if (dk < med * 0.75 && fill > 0.85) level = 'raised';
  return { level, marks: [] };
}
export function toRekhaObs(det: LineDet): RekhaObs {
  const visible: RekhaObs['visible'] = det.conf < 0.22 ? 'absent' : det.gaps >= 2 && det.conf >= 0.35 ? 'broken' : det.conf >= 0.55 ? 'clear' : 'faint';
  const length: RekhaObs['length'] = det.frac > 0.6 ? 'long' : det.frac > 0.3 ? 'medium' : 'short';
  const depth: RekhaObs['depth'] = det.dark >= 30 ? 'deep' : det.dark >= 16 ? 'medium' : 'shallow';
  const marks: string[] = [];
  if (det.thick > 5.5 && det.frac > 0.2) marks.push('island');
  if (det.runs >= 3 && det.frac > 0.5) marks.push('fork');
  if (det.gaps === 1) marks.push('chain');
  if (det.cross) marks.push('cross');
  return { visible, length, depth, marks, conf: Math.min(1, det.frac + 0.2) };
}
export function analyzePalmImage(img: Img): AutoPalm {
  const { width: w, height: h } = img;
  const gray = toGray(img);
  const mask = skinMask(img);
  const mean = boxMean(gray, w, h, 9);
  const dark = darkMap(gray, mean);
  let skinN = 0; for (let i = 0; i < mask.length; i++) skinN += mask[i];
  const skinPct = skinN / mask.length;
  const box = palmBBox(mask, w, h);
  const warnings: string[] = [];
  if (skinPct < 0.18) warnings.push('low_skin');
  if (!box) warnings.push('no_palm');
  const fallback: AutoPalm = {
    lines: {} as any, mounts: {} as any, hasta: 'akasha', skinPct, aspect: 0,
    quality: 'poor', warnings: warnings.length ? warnings : ['no_palm'],
  };
  if (!box) return fallback;
  if (box.x0 <= 1 || box.y0 <= 1 || box.x1 >= w - 2 || box.y1 >= h - 2) warnings.push('cropped');
  const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
  const aspect = bh / Math.max(1, bw);
  const palmTop = Math.round(box.y0 + bh * 0.44);
  const palmBot = box.y1;
  // darkness stats for thresholds
  let sum = 0, n = 0; const vals: number[] = [];
  for (let y = palmTop; y < palmBot; y += 3) for (let x = box.x0; x < box.x1; x += 3) {
    const i = y * w + x; if (mask[i]) { sum += dark[i]; n++; vals.push(dark[i]); }
  }
  const med = n ? sum / n : 8;
  const t = Math.max(9, med * 1.9 + 5);
  if (med < 2.5) warnings.push('flat_light');
  vals.sort((a, b) => a - b);
  const medS = vals.length ? vals[Math.floor(vals.length / 2)] : med;
  const px = (fx: number) => Math.round(box.x0 + bw * fx);
  const py = (fy: number) => Math.round(box.y0 + bh * fy);
  // thumb side: band with more darkness in lower palm
  let leftD = 0, rightD = 0;
  for (let y = palmTop; y < palmBot; y += 2) for (let x = box.x0; x < box.x0 + bw * 0.3; x += 2) leftD += dark[y * w + x];
  for (let y = palmTop; y < palmBot; y += 2) for (let x = box.x1 - bw * 0.3; x < box.x1; x += 2) rightD += dark[y * w + x];
  const thumbLeft = leftD >= rightD;
  const life = scanV(dark, w, thumbLeft ? box.x0 : box.x1 - Math.round(bw * 0.3), thumbLeft ? box.x0 + Math.round(bw * 0.3) : box.x1, palmTop, palmBot, t);
  const lifeCrossV = scanH(dark, w, box.x0, box.x1, palmTop + Math.round((palmBot - palmTop) * 0.2), palmTop + Math.round((palmBot - palmTop) * 0.5), t);
  life.cross = life.conf > 0.5 && lifeCrossV.conf > 0.5;
  const heart = scanH(dark, w, px(0.08), px(0.97), palmTop + 3, palmTop + Math.round((palmBot - palmTop) * 0.3), t);
  const head = scanH(dark, w, px(0.15), px(0.95), palmTop + Math.round((palmBot - palmTop) * 0.35), palmTop + Math.round((palmBot - palmTop) * 0.62), t);
  const bhagya = scanV(dark, w, px(0.42), px(0.64), palmTop, palmBot, t);
  const surya = scanV(dark, w, px(0.62), px(0.84), palmTop + 6, palmBot, t);
  const vivaha = scanH(dark, w, px(0.7), px(0.99), palmTop + 3, palmTop + Math.round((palmBot - palmTop) * 0.3), t);
  const swasthya = scanV(dark, w, px(0.28), px(0.5), palmTop + 10, palmBot, t);
  const crossify = (a: LineDet, b: LineDet) => { if (a.conf > 0.5 && b.conf > 0.5) { a.cross = true; b.cross = true; } };
  crossify(heart, bhagya); crossify(head, bhagya); crossify(head, surya); crossify(head, life);
  const lines: Record<RekhaKey, LineDet> = { ayu: life, buddhi: head, hridaya: heart, bhagya, surya, vivaha, swasthya };
  const med2 = Math.max(1, medS);
  const M = (fx: number, fy: number) => mountLevel(dark, mask, w, px(fx), py(fy), Math.max(6, Math.round(bw * 0.07)), med2);
  const mounts: Record<ParvatKey, ParvatObs> = {
    guru: M(0.24, 0.5), shani: M(0.42, 0.5), surya: M(0.62, 0.5), budha: M(0.82, 0.5),
    mangalPos: M(0.5, 0.6), mangalNeg: M(thumbLeft ? 0.34 : 0.66, 0.78),
    chandra: M(thumbLeft ? 0.9 : 0.1, 0.68), shukra: M(thumbLeft ? 0.14 : 0.86, 0.66),
    ketuRahu: M(0.5, 0.95),
  };
  let hasta: HastaType = 'akasha';
  if (skinPct >= 0.2) {
    if (aspect >= 1.75) hasta = 'jala';
    else if (aspect >= 1.5) hasta = 'vayu';
    else if (aspect >= 1.3) hasta = 'agni';
    else hasta = 'prithvi';
  }
  const quality: AutoPalm['quality'] = warnings.length === 0 ? 'good' : warnings.includes('no_palm') || warnings.includes('low_skin') ? 'poor' : 'fair';
  return { lines, mounts, hasta, skinPct, aspect, quality, warnings };
}
