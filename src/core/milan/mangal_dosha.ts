import { MangalDoshaResult } from '../../types/milan';

const DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

/**
 * Classical Manglik (Kuja) Dosha Evaluation with Cancellations
 */
export function calculateMangalDosha(marsHouses: number[], moonSignIndex: number): MangalDoshaResult {
  const affected = marsHouses.filter(h => DOSHA_HOUSES.includes(h));
  const hasDosha = affected.length > 0;

  if (!hasDosha) {
    return {
      hasDosha: false,
      intensity: 'None',
      affectedHouses: [],
      isCancelled: true
    };
  }

  // Check classical cancellation: Mars in Aries (0), Scorpio (7), or Capricorn (9)
  const isOwnOrExalted = moonSignIndex === 0 || moonSignIndex === 7 || moonSignIndex === 9;
  const isCancelled = isOwnOrExalted;

  let intensity: MangalDoshaResult['intensity'] = 'Low';
  if (affected.includes(7) || affected.includes(8)) intensity = 'High';
  else if (affected.includes(1) || affected.includes(4)) intensity = 'Medium';

  return {
    hasDosha,
    intensity,
    affectedHouses: affected,
    isCancelled,
    cancellationReason: isCancelled ? 'Mars in own or exalted dignity cancels adverse effects' : undefined
  };
}
