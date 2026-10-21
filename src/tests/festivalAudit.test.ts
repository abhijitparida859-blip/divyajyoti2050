import { describe, it, expect } from 'vitest';
import { calculateOdiaCalendarDay } from '../core/panjika/odia_calendar_engine';

describe('All-Year 2026 Canonical Odia Festival Audit', () => {
  it('scans all 365 days of 2026 and validates canonical Shastric dates', () => {
    const festivalDates: Record<string, string[]> = {};

    for (let i = 0; i < 365; i++) {
      const d = new Date(2026, 0, 1 + i);
      const dayInfo = calculateOdiaCalendarDay(d);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      dayInfo.festivals.forEach(f => {
        if (!festivalDates[f.id]) festivalDates[f.id] = [];
        festivalDates[f.id].push(dateKey);
      });
    }

    // 1. Saraswati Puja: Strictly 1 day, Purvahna Vyapini
    expect(festivalDates['saraswati_puja']).toHaveLength(1);
    expect(festivalDates['saraswati_puja']).toEqual(['2026-01-23']);

    // 2. Raja Parba 4-Day Solar Agrarian Festival in June (NOT May)
    expect(festivalDates['pahili_raja']).toEqual(['2026-06-15']);
    expect(festivalDates['raja_sankranti']).toEqual(['2026-06-16']);
    expect(festivalDates['shesa_raja']).toEqual(['2026-06-17']);
    expect(festivalDates['basumati_snana']).toEqual(['2026-06-18']);

    // 3. Jyestha / Deva Snana Purnima: strictly 15 days before Ratha Yatra
    expect(festivalDates['sabitri_amavasya']).toEqual(['2026-06-15']);
    expect(festivalDates['snana_purnima']).toEqual(['2026-06-30']);
    expect(festivalDates['ratha_yatra']).toEqual(['2026-07-16']);
    expect(festivalDates['bahuda_yatra']).toEqual(['2026-07-24']);

    // 4. Bhadraba Festivals: Janmashtami, Ganesh Puja, Nuakhai
    expect(festivalDates['janmashtami']).toEqual(['2026-09-04']);
    expect(festivalDates['ganesh_puja']).toEqual(['2026-09-14']);
    expect(festivalDates['nuakhai']).toEqual(['2026-09-15']);

    // 5. Complete Durga Puja Cycle in Aswina
    expect(festivalDates['maha_saptami']).toEqual(['2026-10-18']);
    expect(festivalDates['durga_ashtami']).toEqual(['2026-10-19']);
    expect(festivalDates['maha_navami']).toEqual(['2026-10-20']);
    expect(festivalDates['vijaya_dashami']).toEqual(['2026-10-21']);

    // 6. Kartika & Margasira Festivals
    expect(festivalDates['deepavali']).toEqual(['2026-11-09']);
    expect(festivalDates['kartika_purnima']).toEqual(['2026-11-24']);
    expect(festivalDates['prathamastami']).toEqual(['2026-12-01']);
  });
});
