// NASA JPL Physical & Orbital Constants for Real Scientists & Students
export interface NasaPlanetPhysics {
  name: string;
  symbol: string;
  semiMajorAxisAU: number; // AU
  semiMajorAxisKm: number; // Millions of km
  orbitalPeriodDays: number; // Days
  orbitalSpeedKmS: number; // km/s
  eccentricity: number; // e
  inclinationDeg: number; // degrees to ecliptic
  equatorialRadiusKm: number; // km
  massKg: string; // kg in scientific notation
  massEarths: number; // relative to Earth
  surfaceGravityMs2: number; // m/s^2
  escapeVelocityKmS: number; // km/s
  rotationPeriodHours: number; // hours
  axialTiltDeg: number; // degrees
  meanTempC: number; // Celsius
  surfacePressureBar: number; // bar
  albedo: number; // Bond albedo
  moonsCount: number;
  solarIrradianceWm2: number; // W/m^2
  atmosphereComposition: string;
  isroNasaMissions: string;
}

export const NASA_SOLAR_PHYSICS: Record<string, NasaPlanetPhysics> = {
  Surya: {
    name: 'Sun (Surya)',
    symbol: '☀️',
    semiMajorAxisAU: 0,
    semiMajorAxisKm: 0,
    orbitalPeriodDays: 84000000000, // 230M years galactic
    orbitalSpeedKmS: 220, // around galactic center
    eccentricity: 0.07,
    inclinationDeg: 7.25,
    equatorialRadiusKm: 696340,
    massKg: '1.9885 × 10³⁰ kg',
    massEarths: 332946,
    surfaceGravityMs2: 274.0,
    escapeVelocityKmS: 617.7,
    rotationPeriodHours: 609.12, // 25.4 days equator
    axialTiltDeg: 7.25,
    meanTempC: 5505, // surface (core 15,000,000°C)
    surfacePressureBar: 0.125, // photosphere
    albedo: 0,
    moonsCount: 0, // 8 major planets (not moons)
    solarIrradianceWm2: 1361, // at 1 AU
    atmosphereComposition: '73.46% H, 24.85% He, 0.77% O, 0.29% C, 0.16% Fe, 0.12% Ne',
    isroNasaMissions: 'ISRO Aditya-L1 (Halo L1), NASA Parker Solar Probe, SOHO, SDO'
  },
  Budha: {
    name: 'Mercury (Budha)',
    symbol: '☿',
    semiMajorAxisAU: 0.3871,
    semiMajorAxisKm: 57.91,
    orbitalPeriodDays: 87.97,
    orbitalSpeedKmS: 47.36,
    eccentricity: 0.2056,
    inclinationDeg: 7.00,
    equatorialRadiusKm: 2439.7,
    massKg: '3.3011 × 10²³ kg',
    massEarths: 0.0553,
    surfaceGravityMs2: 3.7,
    escapeVelocityKmS: 4.25,
    rotationPeriodHours: 1407.6, // 58.65 days
    axialTiltDeg: 0.034,
    meanTempC: 167, // -180°C to +430°C
    surfacePressureBar: 1e-15,
    albedo: 0.068,
    moonsCount: 0,
    solarIrradianceWm2: 9082.7,
    atmosphereComposition: 'Trace Exosphere: 42% O₂, 29% Na, 22% H₂, 6% He, 0.5% K',
    isroNasaMissions: 'NASA MESSENGER, Mariner 10, ESA/JAXA BepiColombo'
  },
  Shukra: {
    name: 'Venus (Shukra)',
    symbol: '♀',
    semiMajorAxisAU: 0.7233,
    semiMajorAxisKm: 108.21,
    orbitalPeriodDays: 224.70,
    orbitalSpeedKmS: 35.02,
    eccentricity: 0.0067,
    inclinationDeg: 3.39,
    equatorialRadiusKm: 6051.8,
    massKg: '4.8675 × 10²⁴ kg',
    massEarths: 0.815,
    surfaceGravityMs2: 8.87,
    escapeVelocityKmS: 10.36,
    rotationPeriodHours: -5832.5, // 243 days retrograde
    axialTiltDeg: 177.36, // upside down
    meanTempC: 464, // hottest due to greenhouse
    surfacePressureBar: 92.0, // 92 atm
    albedo: 0.77,
    moonsCount: 0,
    solarIrradianceWm2: 2601.3,
    atmosphereComposition: '96.5% CO₂, 3.5% N₂, 0.015% SO₂, H₂SO₄ clouds',
    isroNasaMissions: 'ISRO Shukrayaan (Planned), NASA Magellan, Pioneer, Soviet Venera'
  },
  Prithvi: {
    name: 'Earth (Prithvi)',
    symbol: '🌍',
    semiMajorAxisAU: 1.0000,
    semiMajorAxisKm: 149.60,
    orbitalPeriodDays: 365.256,
    orbitalSpeedKmS: 29.78,
    eccentricity: 0.0167,
    inclinationDeg: 0.00, // reference ecliptic
    equatorialRadiusKm: 6378.1,
    massKg: '5.9722 × 10²⁴ kg',
    massEarths: 1.000,
    surfaceGravityMs2: 9.807,
    escapeVelocityKmS: 11.19,
    rotationPeriodHours: 23.934,
    axialTiltDeg: 23.44,
    meanTempC: 15,
    surfacePressureBar: 1.013,
    albedo: 0.306,
    moonsCount: 1,
    solarIrradianceWm2: 1361.0,
    atmosphereComposition: '78.08% N₂, 20.95% O₂, 0.93% Ar, 0.04% CO₂, H₂O vapor',
    isroNasaMissions: 'ISRO NavIC, EOS, NASA Landsat, Terra, Aqua, NOAA'
  },
  Chandra: {
    name: 'Moon (Chandra)',
    symbol: '🌙',
    semiMajorAxisAU: 0.00257, // from Earth
    semiMajorAxisKm: 0.3844, // 384,400 km
    orbitalPeriodDays: 27.322,
    orbitalSpeedKmS: 1.022,
    eccentricity: 0.0549,
    inclinationDeg: 5.14,
    equatorialRadiusKm: 1737.4,
    massKg: '7.342 × 10²² kg',
    massEarths: 0.0123,
    surfaceGravityMs2: 1.62,
    escapeVelocityKmS: 2.38,
    rotationPeriodHours: 655.7, // synchronous tidally locked
    axialTiltDeg: 6.68,
    meanTempC: -20, // -130°C night, +120°C day
    surfacePressureBar: 3e-15,
    albedo: 0.12,
    moonsCount: 0,
    solarIrradianceWm2: 1361.0,
    atmosphereComposition: 'Exosphere: He, Ne, H₂, Ar, trace Radon/Polonium',
    isroNasaMissions: 'ISRO Chandrayaan-1, 2, 3 (Historic South Pole Landing), NASA Apollo, Artemis'
  },
  Mangala: {
    name: 'Mars (Mangala)',
    symbol: '♂',
    semiMajorAxisAU: 1.5237,
    semiMajorAxisKm: 227.92,
    orbitalPeriodDays: 686.98,
    orbitalSpeedKmS: 24.07,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    equatorialRadiusKm: 3396.2,
    massKg: '6.4171 × 10²³ kg',
    massEarths: 0.107,
    surfaceGravityMs2: 3.72,
    escapeVelocityKmS: 5.03,
    rotationPeriodHours: 24.623,
    axialTiltDeg: 25.19,
    meanTempC: -63, // -140°C to +20°C
    surfacePressureBar: 0.00636, // 6.36 mbar
    albedo: 0.25,
    moonsCount: 2, // Phobos & Deimos
    solarIrradianceWm2: 586.2,
    atmosphereComposition: '95.32% CO₂, 2.6% N₂, 1.9% Ar, 0.13% O₂, 0.08% CO',
    isroNasaMissions: 'ISRO Mangalyaan (MOM - First attempt record), NASA Perseverance, Curiosity'
  },
  Guru: {
    name: 'Jupiter (Guru)',
    symbol: '♃',
    semiMajorAxisAU: 5.2044,
    semiMajorAxisKm: 778.57,
    orbitalPeriodDays: 4332.59, // 11.86 yrs
    orbitalSpeedKmS: 13.07,
    eccentricity: 0.0489,
    inclinationDeg: 1.30,
    equatorialRadiusKm: 71492,
    massKg: '1.8982 × 10²⁷ kg',
    massEarths: 317.83,
    surfaceGravityMs2: 24.79,
    escapeVelocityKmS: 59.5,
    rotationPeriodHours: 9.925,
    axialTiltDeg: 3.13,
    meanTempC: -108,
    surfacePressureBar: 1.0, // at 1 bar level
    albedo: 0.52,
    moonsCount: 95, // Europa, Ganymede, Io, Callisto
    solarIrradianceWm2: 50.26,
    atmosphereComposition: '89.8% H₂, 10.2% He, 0.3% CH₄, 0.026% NH₃',
    isroNasaMissions: 'NASA Juno, Galileo, Voyager 1 & 2, ESA JUICE'
  },
  Shani: {
    name: 'Saturn (Shani)',
    symbol: '♄',
    semiMajorAxisAU: 9.5826,
    semiMajorAxisKm: 1433.53,
    orbitalPeriodDays: 10759.22, // 29.46 yrs
    orbitalSpeedKmS: 9.69,
    eccentricity: 0.0565,
    inclinationDeg: 2.49,
    equatorialRadiusKm: 60268,
    massKg: '5.6834 × 10²⁶ kg',
    massEarths: 95.16,
    surfaceGravityMs2: 10.44,
    escapeVelocityKmS: 35.5,
    rotationPeriodHours: 10.656,
    axialTiltDeg: 26.73,
    meanTempC: -139,
    surfacePressureBar: 1.0,
    albedo: 0.47,
    moonsCount: 146, // Titan, Enceladus, Mimas
    solarIrradianceWm2: 14.82,
    atmosphereComposition: '96.3% H₂, 3.25% He, 0.45% CH₄, 0.0125% NH₃',
    isroNasaMissions: 'NASA/ESA Cassini-Huygens, Voyager 1 & 2, Pioneer 11'
  },
  Rahu: {
    name: 'North Lunar Node (Rahu)',
    symbol: '☊',
    semiMajorAxisAU: 0.00257,
    semiMajorAxisKm: 0.3844,
    orbitalPeriodDays: 6793.5, // 18.5996 years retrograde cycle
    orbitalSpeedKmS: 1.022,
    eccentricity: 0.0549,
    inclinationDeg: 5.145, // Moon orbital plane inclination to ecliptic
    equatorialRadiusKm: 0,
    massKg: '0 (Mathematical Point)',
    massEarths: 0, // Rahu is a mathematical lunar node, not a physical body
    surfaceGravityMs2: 0,
    escapeVelocityKmS: 0,
    rotationPeriodHours: 0, // Nodal regression period: ~18.6 years
    axialTiltDeg: 5.14,
    meanTempC: -270.42,
    surfacePressureBar: 0,
    albedo: 0,
    moonsCount: 0,
    solarIrradianceWm2: 1361.0,
    atmosphereComposition: 'Gravitational Celestial Node: Ascending intersection of Lunar Orbit with Ecliptic Plane (Eclipse Syzygy Alignment)',
    isroNasaMissions: 'NASA DE440/DE441 Ephemerides, ISRO Chandrayaan Trajectory Optimization, Surya Siddhanta'
  },
  Ketu: {
    name: 'South Lunar Node (Ketu)',
    symbol: '☋',
    semiMajorAxisAU: 0.00257,
    semiMajorAxisKm: 0.3844,
    orbitalPeriodDays: 6793.5, // 18.5996 years retrograde cycle
    orbitalSpeedKmS: 1.022,
    eccentricity: 0.0549,
    inclinationDeg: 5.145,
    equatorialRadiusKm: 0,
    massKg: '0 (Mathematical Point)',
    massEarths: 0, // Ketu is a mathematical lunar node, not a physical body
    surfaceGravityMs2: 0,
    escapeVelocityKmS: 0,
    rotationPeriodHours: 0, // Nodal regression period: ~18.6 years
    axialTiltDeg: 5.14,
    meanTempC: -270.42,
    surfacePressureBar: 0,
    albedo: 0,
    moonsCount: 0,
    solarIrradianceWm2: 1361.0,
    atmosphereComposition: 'Descending Celestial Node: Exactly 180° opposite to Rahu, determining Total Solar & Lunar Eclipses',
    isroNasaMissions: 'NASA JPL Horizons System, Lunar Reconnaissance Orbiter (LRO), Ancient Astronomical Treatises'
  }
};