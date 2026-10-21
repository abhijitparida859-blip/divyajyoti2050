import { describe, it, expect } from 'vitest';
import { judgeRekha, REKHA_TITLES, RekhaObs } from '../components/palm/palmShastra1';
import { judgeParvat, judgeHasta, overallNirnaya, PARVAT_T } from '../components/palm/palmShastra2';

describe('Hasta Samudrika genuine + trilingual engine', () => {
  const deep: RekhaObs = { visible: 'clear', length: 'long', depth: 'deep', marks: [], conf: 0.9 };
  it('Odia verdict is in Odia script', () => {
    const v = judgeRekha('ayu', deep, 'or');
    expect(v.phala).toMatch(/ଶୁଭ/);
    expect(REKHA_TITLES.ayu.or).toMatch(/ଆୟୁ/);
  });
  it('Hindi verdict is in Devanagari', () => {
    const v = judgeRekha('ayu', deep, 'hi');
    expect(v.phala).toMatch(/शुभ/);
    expect(REKHA_TITLES.ayu.hi).toMatch(/आयु/);
  });
  it('English verdict is English', () => {
    const v = judgeRekha('ayu', deep, 'en');
    expect(v.phala).toMatch(/auspicious/i);
    expect(REKHA_TITLES.ayu.en).toMatch(/Life Line/);
  });
  it('khandit rekha = obstacle, no fake score', () => {
    const v: any = judgeRekha('bhagya', { visible: 'broken', length: 'medium', depth: 'medium', marks: ['island'], conf: 0.5 }, 'en');
    expect(v.phala).toMatch(/obstacle/i);
    expect(JSON.stringify(v)).not.toMatch(/\/100|"score"/i);
  });
  it('cross/star/square phala per language', () => {
    expect(judgeRekha('hridaya', { visible: 'clear', length: 'medium', depth: 'medium', marks: ['cross'], conf: 0.8 }, 'or').phala).toMatch(/ସଂଘର୍ଷ/);
    expect(judgeRekha('hridaya', { visible: 'clear', length: 'medium', depth: 'medium', marks: ['cross'], conf: 0.8 }, 'hi').phala).toMatch(/संघर्ष/);
    expect(judgeRekha('surya', { visible: 'clear', length: 'medium', depth: 'deep', marks: ['square'], conf: 0.8 }, 'en').phala).toMatch(/shield/i);
  });
  it('all 9 parvat trilingual titles + karaka', () => {
    const keys = ['guru', 'shani', 'surya', 'budha', 'mangalPos', 'mangalNeg', 'chandra', 'shukra', 'ketuRahu'] as const;
    for (const k of keys) {
      const o = judgeParvat(k, { level: 'raised', marks: [] }, 'or');
      expect(o.title).toBe(PARVAT_T[k].or);
      expect(o.phala.length).toBeGreaterThan(5);
      expect(judgeParvat(k, { level: 'raised', marks: [] }, 'hi').title).toBe(PARVAT_T[k].hi);
      expect(judgeParvat(k, { level: 'raised', marks: [] }, 'en').title).toBe(PARVAT_T[k].en);
    }
  });
  it('hasta verdicts have source in all langs', () => {
    for (const l of ['or', 'hi', 'en'] as const) {
      const h = judgeHasta('vayu', 'flexible', 'conic', 'smooth', l);
      expect(h.length).toBe(3);
      expect(h.map((x) => x.source).join('|')).toMatch(/Sen|Benham/);
    }
  });
  it('samagra nirnaya never claims percent', () => {
    const r = ['ayu', 'buddhi', 'hridaya'].map((k: any) => judgeRekha(k, deep, 'en'));
    expect(overallNirnaya(r, 'en')).not.toMatch(/100%/);
    expect(overallNirnaya(r, 'or')).not.toMatch(/100%/);
  });
});
