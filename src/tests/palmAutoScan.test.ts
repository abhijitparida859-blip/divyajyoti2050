import { describe, it, expect } from 'vitest';
import { analyzePalmImage, toRekhaObs, LineDet } from '../components/palm/palmAutoScan';
import { Img } from '../components/palm/palmPixel';

const W = 200, H = 260;
function px(r: number, g: number, b: number, a = 255) { return [r, g, b, a]; }
function fillRect(d: Uint8ClampedArray, x0: number, y0: number, x1: number, y1: number, c: number[]) {
  for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) {
    const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c[3];
  }
}
function syntheticPalm(): Img {
  const data = new Uint8ClampedArray(W * H * 4);
  fillRect(data, 0, 0, W - 1, H - 1, px(40, 60, 200)); // blue bg
  fillRect(data, 30, 30, 170, 230, px(225, 175, 145)); // skin palm
  const line = px(120, 80, 65);
  fillRect(data, 45, 129, 160, 131, line);            // heart
  fillRect(data, 88, 129, 97, 131, px(225, 175, 145)); // heart gap 1 (full line height)
  fillRect(data, 122, 129, 131, 131, px(225, 175, 145)); // heart gap 2 -> broken
  fillRect(data, 60, 169, 155, 171, line);            // head
  fillRect(data, 99, 118, 101, 228, line);            // fate (vertical)
  fillRect(data, 54, 118, 56, 225, line);             // life (left vertical)
  return { data, width: W, height: H };
}
describe('auto palm scan from photo pixels', () => {
  it('detects palm + quality fair/good on synthetic hand', () => {
    const a = analyzePalmImage(syntheticPalm());
    expect(a.quality === 'fair' || a.quality === 'good').toBe(true);
    expect(a.skinPct).toBeGreaterThan(0.3);
    expect(Object.keys(a.lines).length).toBe(7);
    expect(Object.keys(a.mounts).length).toBe(9);
  });
  it('heart with two gaps -> broken; head intact -> not broken', () => {
    const a = analyzePalmImage(syntheticPalm());
    const heart = toRekhaObs(a.lines.hridaya);
    expect(heart.visible).toBe('broken');
    const head = toRekhaObs(a.lines.buddhi);
    expect(head.visible === 'clear' || head.visible === 'faint').toBe(true);
    expect(head.visible).not.toBe('broken');
  });
  it('life line detected long + deep', () => {
    const a = analyzePalmImage(syntheticPalm());
    expect(a.lines.ayu.conf).toBeGreaterThan(0.4);
    const obs = toRekhaObs(a.lines.ayu);
    expect(obs.length).toBe('long');
    expect(obs.depth).toBe('deep');
  });
  it('non-hand image -> poor quality with warning', () => {
    const data = new Uint8ClampedArray(W * H * 4);
    fillRect(data, 0, 0, W - 1, H - 1, px(40, 60, 200));
    const a = analyzePalmImage({ data, width: W, height: H });
    expect(a.quality).toBe('poor');
    expect(a.warnings.length).toBeGreaterThan(0);
  });
  it('toRekhaObs mapping + cross mark', () => {
    const good: LineDet = { conf: 0.6, frac: 0.5, dark: 40, gaps: 0, runs: 1, thick: 2, cross: false };
    const o = toRekhaObs(good);
    expect(o.visible).toBe('clear');
    expect(o.length).toBe('medium');
    expect(o.depth).toBe('deep');
    const weak = toRekhaObs({ ...good, conf: 0.1 });
    expect(weak.visible).toBe('absent');
    const crossed = toRekhaObs({ ...good, cross: true });
    expect(crossed.marks).toContain('cross');
  });
});
