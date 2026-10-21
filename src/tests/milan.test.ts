import { describe, it, expect } from 'vitest';
import { calculateAshtakootMilan } from '../core/milan/ashtakoot';
import { calculateBirthChart } from '../core/jataka/kundali_engine';

describe('Jataka & Kundali Milan Engine', () => {
  it('calculates birth chart houses and ascendant', () => {
    const birthDate = new Date('1998-05-15T09:30:00Z');
    const chart = calculateBirthChart('Arjun', birthDate, 28.6139, 77.2090);

    expect(chart.nativeName).toBe('Arjun');
    expect(chart.ascendantSign).toBeDefined();
    expect(chart.houses.length).toBe(12);
    expect(Object.keys(chart.planets).length).toBe(9);
    expect(chart.dashas.length).toBe(9);
  });

  it('calculates 36-Guna Ashtakoot matching score within 0 to 36 points', () => {
    // Groom: Rohini (idx 3), Vrishabha (idx 1); Bride: Hasta (idx 12), Kanya (idx 5)
    const result = calculateAshtakootMilan(3, 1, 12, 5, 'Karan', 'Sneha');

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(36);
    expect(result.kootas.length).toBe(8);
    expect(['Excellent', 'Very Good', 'Average', 'Not Recommended']).toContain(result.verdict);
  });
});
