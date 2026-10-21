import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from '../localization/i18n';
import { DigitalMala108 } from '../components/mala/DigitalMala108';
import { MANTRA_LIBRARY, getMantraById } from '../core/japa/mantra_library';
import { JapaAudioEngine } from '../core/japa/japa_audio_engine';

describe('108 Digital Japa Mala & Audio System Tests', () => {
  it('wires authentic 432Hz/136.1Hz Om chant to beej-om mantra', () => {
    const om = getMantraById('beej-om');
    expect(om).toBeDefined();
    expect(om?.audio).toBeDefined();
    expect(om?.audio?.url).toBe('/audio/mantras/om.wav');
    expect(om?.audio?.start).toBe(0);
    expect(om?.audio?.end).toBe(4.0);
    expect(JapaAudioEngine.hasAudio(om!)).toBe(true);
  });

  it('includes Jagannath Mahaprabhu mantra in the sacred deity library', () => {
    const jagannath = getMantraById('deity-jagannath');
    expect(jagannath).toBeDefined();
    expect(jagannath?.category).toBe('deity');
    expect(jagannath?.name.or).toContain('ଜଗନ୍ନାଥ');
    expect(jagannath?.text.original).toContain('नयनपथगामी');
    expect(jagannath?.audio?.url).toBe('/audio/mantras/jagannath.mp3');
  });

  it('pre-configures audio paths for Gayatri and Maha Mrityunjaya mantras', () => {
    const gayatri = getMantraById('suktam-gayatri');
    expect(gayatri?.audio?.url).toBe('/audio/mantras/gayatri.mp3');

    const mrityunjaya = getMantraById('suktam-mrityunjaya');
    expect(mrityunjaya?.audio?.url).toBe('/audio/mantras/mrityunjaya.mp3');
  });

  it('renders DigitalMala108 with audio cutter button and status without crashing', () => {
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(DigitalMala108))
    );

    expect(html).toContain('108');
    // Verifies audio cutter button presence
    expect(html).toMatch(/Cutter|ଅଡିଓ|କଟର୍/i);
    // Verifies Maha Mrityunjaya text renders pure
    expect(html).toContain('मृत्योर्मुक्षीय');
  });
});
