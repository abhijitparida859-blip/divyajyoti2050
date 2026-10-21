import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { I18nProvider } from '../localization/i18n';
import { calculateBirthChart } from '../core/jataka/kundali_engine';
import {
  GoogleEarthGlobeExplorer,
  LANDMARKS,
  REAL_LANDMARKS,
  EARTH_INTERIOR_LAYERS,
  ATMOSPHERE_LAYERS
} from '../components/3d/GoogleEarthGlobeExplorer';
import { NASA_SOLAR_PHYSICS } from '../components/3d/nasaPhysicsData';
import { CosmosView } from '../components/cosmos/CosmosView';
import orTranslations from '../localization/or.json';
import hiTranslations from '../localization/hi.json';
import enTranslations from '../localization/en.json';

describe('Brahmanda Darshan 3D (Cosmos & Earth) Feature Regression Suite', () => {
  const originalLocalStorage = globalThis.localStorage;

  afterEach(() => {
    if (originalLocalStorage) {
      globalThis.localStorage = originalLocalStorage;
    }
  });

  it('verifies exact NASA JPL planetary physics parameters to prevent data regressions', () => {
    // Mars equatorial radius must be 3396.2 km (NASA Fact Sheet standard, not volumetric mean)
    expect(NASA_SOLAR_PHYSICS.Mangala.equatorialRadiusKm).toBe(3396.2);

    // Jupiter equatorial radius must be 71492 km (NASA standard)
    expect(NASA_SOLAR_PHYSICS.Guru.equatorialRadiusKm).toBe(71492);

    // Saturn equatorial radius must be 60268 km (NASA standard)
    expect(NASA_SOLAR_PHYSICS.Shani.equatorialRadiusKm).toBe(60268);

    // Sun has 0 moons (planets are not moons)
    expect(NASA_SOLAR_PHYSICS.Surya.moonsCount).toBe(0);

    // Sun photosphere pressure is ~0.125 bar
    expect(NASA_SOLAR_PHYSICS.Surya.surfacePressureBar).toBe(0.125);

    // Sun atmospheric hydrogen is atomic/ionized H, not molecular H2
    expect(NASA_SOLAR_PHYSICS.Surya.atmosphereComposition).toContain('73.46% H');

    // Jupiter & Saturn surface standard reference pressures are 1.0 bar
    expect(NASA_SOLAR_PHYSICS.Guru.surfacePressureBar).toBe(1.0);
    expect(NASA_SOLAR_PHYSICS.Shani.surfacePressureBar).toBe(1.0);

    // Rahu and Ketu are mathematical nodes with radius 0 and cosmic background temperature
    expect(NASA_SOLAR_PHYSICS.Rahu.equatorialRadiusKm).toBe(0);
    expect(NASA_SOLAR_PHYSICS.Ketu.equatorialRadiusKm).toBe(0);
    expect(NASA_SOLAR_PHYSICS.Rahu.meanTempC).toBe(-270.42);
    expect(NASA_SOLAR_PHYSICS.Ketu.meanTempC).toBe(-270.42);
  });

  it('calculates live space telemetry chart data without error', () => {
    const now = new Date();
    const chart = calculateBirthChart('Live Space Telemetry', now, 19.8135, 85.8312, 'Puri Jagannath Dham', 'neutral');
    expect(chart).toBeDefined();
    expect(chart.planets.Surya).toBeDefined();
    expect(chart.planets.Chandra).toBeDefined();
    expect(chart.planets.Mangala).toBeDefined();
    expect(chart.planets.Budha).toBeDefined();
    expect(chart.planets.Guru).toBeDefined();
    expect(chart.planets.Shukra).toBeDefined();
    expect(chart.planets.Shani).toBeDefined();
  });

  it('verifies complete landmarks and presets data integrity', () => {
    expect(REAL_LANDMARKS.length).toBeGreaterThan(15);
    
    // Key Odisha heritage sites must exist
    const landmarkIds = REAL_LANDMARKS.map(l => l.id);
    expect(landmarkIds).toContain('puri');
    expect(landmarkIds).toContain('konark');
    expect(landmarkIds).toContain('bhubaneswar_lingaraj');
    expect(landmarkIds).toContain('cuttack_barabati');
    expect(landmarkIds).toContain('chilika_lake');
    expect(landmarkIds).toContain('deomali_koraput');
    expect(landmarkIds).toContain('hirakud_dam');

    // All landmarks must have valid geo coordinates
    for (const landmark of REAL_LANDMARKS) {
      expect(Number.isFinite(landmark.lat)).toBe(true);
      expect(Number.isFinite(landmark.lon)).toBe(true);
      expect(landmark.nameOr.length).toBeGreaterThan(0);
      expect(landmark.nameEn.length).toBeGreaterThan(0);
    }
  });

  it('verifies Earth Interior strata and Atmospheric layer specifications', () => {
    expect(EARTH_INTERIOR_LAYERS.length).toBe(4);
    expect(EARTH_INTERIOR_LAYERS[0].nameEn).toContain('Earth Crust');
    expect(EARTH_INTERIOR_LAYERS[3].nameEn).toContain('Inner Core');

    expect(ATMOSPHERE_LAYERS.length).toBe(5);
    expect(ATMOSPHERE_LAYERS[0].nameEn).toBe('Troposphere');
    expect(ATMOSPHERE_LAYERS[4].nameEn).toBe('Exosphere');
  });

  it('locks in Brahmanda Darshan 3D trilingual navigation labels', () => {
    expect(orTranslations.nav_cosmos).toBe('ବ୍ରହ୍ମାଣ୍ଡ ଦର୍ଶନ ୩D');
    expect(hiTranslations.nav_cosmos).toBe('ब्रह्माण्ड दर्शन 3D');
    expect(enTranslations.nav_cosmos).toBe('Brahmanda 3D');
  });

  it('renders CosmosView in Odia without crashing and displays updated Brahmanda title', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'or',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(CosmosView))
    );
    expect(html).toContain('ବ୍ରହ୍ମାଣ୍ଡ ଦର୍ଶନ ୩D');
    expect(html).toContain('ସୌରମଣ୍ଡଳ');
    expect(html).toContain('ଗୁଗୁଲ୍ ଆର୍ଥ୍');
  });

  it('renders CosmosView in Hindi without crashing and displays updated Brahmanda title', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'hi',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(CosmosView))
    );
    expect(html).toContain('ब्रह्माण्ड दर्शन 3D');
    expect(html).toContain('सौर मंडल');
    expect(html).toContain('गूगल अर्थ');
  });

  it('renders CosmosView in English without crashing and displays updated Brahmanda title', () => {
    (globalThis as any).localStorage = {
      getItem: () => 'en',
      setItem: () => {}
    };
    const html = renderToString(
      React.createElement(I18nProvider, null, React.createElement(CosmosView))
    );
    expect(html).toContain('Brahmanda 3D');
    expect(html).toContain('Solar System');
    expect(html).toContain('Google Earth');
  });
});

