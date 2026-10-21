export interface PlanetaryDossier {
  id: string;
  nameOr: string;
  nameEn: string;
  sanskritName: string;
  symbol: string;
  category: 'star' | 'rocky' | 'gas_giant' | 'ice_giant' | 'lunar_node' | 'moon';
  themeColor: string;
  gradientBg: string;
  borderColor: string;
  badgeBg: string;
  
  // Real NASA & ESA Physical & Orbital Data
  massKg: string;
  massEarthRel: string;
  equatorialDiameterKm: string;
  polarDiameterKm?: string;
  volumeEarthRel: string;
  meanDensityGcm3: string;
  surfaceGravityMs2: string;
  gravityG: number;
  escapeVelocityKms: string;
  semiMajorAxisKm: string;
  semiMajorAxisAU: string;
  perihelionKm: string;
  aphelionKm: string;
  eccentricity: string;
  orbitalPeriodDays: string;
  orbitalPeriodYears: string;
  synodicPeriodDays?: string;
  meanOrbitalSpeedKms: string;
  orbitalInclinationDeg: string;
  axialTiltDeg: string;
  rotationPeriodHours: string;
  dayLength: string;
  surfaceTempC: string;
  surfacePressureBar?: string;
  knownMoonsCount: number;
  ringSystem: boolean;

  // Atmospheric breakdown (percentages)
  atmosphereBreakdown: { gas: string; percentage: number; formula: string }[];

  // Major natural satellites / moons
  majorMoons?: {
    name: string;
    diameterKm: string;
    distKm: string;
    featureOr: string;
    featureEn: string;
  }[];

  // NASA / ESA Missions
  spaceMissions: {
    name: string;
    agency: string;
    year: string;
    type: string;
    discoveryOr: string;
    discoveryEn: string;
  }[];

  // Deep Astrophysical Narrative
  astrophysicalNarrativeOr: string;
  astrophysicalNarrativeEn: string;

  // Vedic Astrological Heritage & Surya Siddhanta
  vedic: {
    rulingDeity: string;
    consortOrEnergy?: string;
    gemstone: string;
    metal: string;
    element: string;
    guna: string;
    varna: string;
    direction: string;
    beejaMantra: string;
    gayatriMantra: string;
    karakatwaOr: string;
    karakatwaEn: string;
    ownSigns: string;
    exaltationSign: string;
    debilitationSign: string;
    specialAspects: string;
    vimshottariYears: number;
    friendPlanets: string;
    enemyPlanets: string;
    neutralPlanets: string;
    suryaSiddhantaMotion: string;
    suryaSiddhantaDiameterYojanas: string;
    charitableUpayasOr: string;
  };
}

export const PLANETARY_SCIENCE_DATA: Record<string, PlanetaryDossier> = {
  Guru: {
    id: 'Guru',
    nameOr: 'ବୃହସ୍ପତି (Jupiter)',
    nameEn: 'Jupiter (The King of Planets)',
    sanskritName: 'बृहस्पति (Brihaspati / Guru)',
    symbol: '♃',
    category: 'gas_giant',
    themeColor: '#eab308',
    gradientBg: 'from-amber-950/70 via-yellow-950/40 to-[#02040a]',
    borderColor: 'border-amber-500/50',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',

    // Real NASA Planetary Metrics
    massKg: '1.89813 × 10²⁷ kg',
    massEarthRel: '317.83 M⊕ (Earth Masses)',
    equatorialDiameterKm: '142,984 km (11.21x Earth)',
    polarDiameterKm: '133,708 km (High Oblateness: 0.06487)',
    volumeEarthRel: '1,321.3x Earth Volume',
    meanDensityGcm3: '1.326 g/cm³',
    surfaceGravityMs2: '24.79 m/s²',
    gravityG: 2.528,
    escapeVelocityKms: '59.5 km/s (214,200 km/h)',
    semiMajorAxisKm: '778,570,000 km',
    semiMajorAxisAU: '5.2044 AU',
    perihelionKm: '740,520,000 km (4.95 AU)',
    aphelionKm: '816,620,000 km (5.46 AU)',
    eccentricity: '0.0489',
    orbitalPeriodDays: '4,332.59 Earth Days',
    orbitalPeriodYears: '11.862 Julian Years',
    synodicPeriodDays: '398.88 Days',
    meanOrbitalSpeedKms: '13.07 km/s',
    orbitalInclinationDeg: '1.304° to Ecliptic',
    axialTiltDeg: '3.13° (Negligible Seasons)',
    rotationPeriodHours: '9 Hours 55 Minutes 30 Seconds (System III)',
    dayLength: '9 Hours 55 Minutes',
    surfaceTempC: '-110°C (1-bar cloud top) / +24,000°C (Core)',
    surfacePressureBar: '1 bar reference level (Extends thousands of bars downward)',
    knownMoonsCount: 95,
    ringSystem: true,

    atmosphereBreakdown: [
      { gas: 'Molecular Hydrogen', percentage: 89.8, formula: 'H₂' },
      { gas: 'Helium', percentage: 10.2, formula: 'He' },
      { gas: 'Methane', percentage: 0.3, formula: 'CH₄' },
      { gas: 'Ammonia', percentage: 0.026, formula: 'NH₃' },
      { gas: 'Hydrogen Deuteride', percentage: 0.003, formula: 'HD' },
      { gas: 'Water Vapor (trace)', percentage: 0.0004, formula: 'H₂O' }
    ],

    majorMoons: [
      {
        name: 'Ganymede (ଗ୍ୟାନିମେଡ୍)',
        diameterKm: '5,268 km',
        distKm: '1,070,400 km',
        featureOr: 'ସୌରମଣ୍ଡଳର ସର୍ବବୃହତ ଉପଗ୍ରହ (ବୁଧ ଗ୍ରହ ଠାରୁ ମଧ୍ୟ ବଡ଼)। ଏକମାତ୍ର ଉପଗ୍ରହ ଯାହାର ନିଜସ୍ୱ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Magnetic Field) ଅଛି।',
        featureEn: 'Largest moon in the Solar System (larger than Mercury). The only natural satellite possessing an intrinsic magnetic dipole.'
      },
      {
        name: 'Europa (ୟୁରୋପା)',
        diameterKm: '3,122 km',
        distKm: '670,900 km',
        featureOr: 'ବରଫ ଆସ୍ତରଣ ତଳେ ବିଶାଳ ଲବଣାକ୍ତ ମହାସାଗର ରହିଛି, ଯେଉଁଥିରେ ପୃଥିବୀର ସମସ୍ତ ସମୁଦ୍ର ତୁଳନାରେ ଦୁଇଗୁଣରୁ ଅଧିକ ଜଳ ରହିଛି। ଅନ୍ୟ ଗ୍ରହରେ ଜୀବନ ସନ୍ଧାନ ପାଇଁ ଶ୍ରେଷ୍ଠ ସ୍ଥାନ!',
        featureEn: 'Hosts a subsurface global saltwater ocean containing more than 2x the water of all Earth oceans combined, protected under a 15-25 km ice shell.'
      },
      {
        name: 'Io (ଆୟୋ)',
        diameterKm: '3,643 km',
        distKm: '421,700 km',
        featureOr: 'ସୌରମଣ୍ଡଳର ସବୁଠାରୁ ଆଗ୍ନେୟଗିରି ସକ୍ରିୟ ପିଣ୍ଡ (୪୦୦ରୁ ଅଧିକ ଜୀବନ୍ତ ଆଗ୍ନେୟଗିରି)। ପ୍ରଚଣ୍ଡ ଜୁଆରିଆ ବଳ (Tidal Friction) ଦ୍ୱାରା ତରଳ ଗନ୍ଧକ ଉଦ୍‌ଗୀରଣ ହୁଏ।',
        featureEn: 'The most volcanically active body in the Solar System, driven by extreme tidal flexing from Jupiter and orbital resonances with Europa and Ganymede.'
      },
      {
        name: 'Callisto (କାଲିଷ୍ଟୋ)',
        diameterKm: '4,821 km',
        distKm: '1,882,700 km',
        featureOr: 'ସୌରମଣ୍ଡଳର ସର୍ବାଧିକ ଗର୍ତ୍ତମୟ (Most Heavily Cratered) ପ୍ରାଚୀନ ପୃଷ୍ଠଭାଗ।',
        featureEn: 'Heavily cratered, geologically inert ancient surface dating back 4 billion years to the Late Heavy Bombardment.'
      }
    ],

    spaceMissions: [
      {
        name: 'Pioneer 10 & 11',
        agency: 'NASA',
        year: '1973 - 1974',
        type: 'Flyby',
        discoveryOr: 'ପ୍ରଥମ ମହାକାଶଯାନ ଭାବେ ବୃହସ୍ପତିର ତୀବ୍ର ବିକିରଣ ବଳୟ ଓ ବିଶାଳ ଚୁମ୍ବକମଣ୍ଡଳ ମାପିଥିଲା।',
        discoveryEn: 'First spacecraft to cross the asteroid belt and capture close-up images of Jupiter radiation belts.'
      },
      {
        name: 'Voyager 1 & 2',
        agency: 'NASA',
        year: '1979',
        type: 'Flyby',
        discoveryOr: 'ବୃହସ୍ପତିର ଧୂଳିକଣା ନିର୍ମିତ ରିଙ୍ଗ୍ ସିଷ୍ଟମ୍ ଏବଂ ଆୟୋ ଉପଗ୍ରହରେ ସକ୍ରିୟ ଆଗ୍ନେୟଗିରି ପ୍ରଥମ ଥର ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'Discovered Jupiter ring system, active volcanism on Io, and fractured ice plains on Europa.'
      },
      {
        name: 'Galileo Orbiter & Atmospheric Probe',
        agency: 'NASA',
        year: '1995 - 2003',
        type: 'Orbiter & Atmospheric Entry',
        discoveryOr: 'ପ୍ରଥମ ମହାକାଶଯାନ ଯାହା ବୃହସ୍ପତି କକ୍ଷପଥରେ ୮ ବର୍ଷ ଘୁରିଲା ଏବଂ ବାୟୁମଣ୍ଡଳ ଭିତରକୁ ଏକ ପ୍ରୋବ୍ ଛାଡ଼ିଥିଲା। ୟୁରୋପାର ଭୂଗର୍ଭସ୍ଥ ସମୁଦ୍ର ନିଶ୍ଚିତ କଲା।',
        discoveryEn: 'First mission to orbit Jupiter and drop a parachute probe directly into its crushing atmosphere. Confirmed liquid ocean under Europa.'
      },
      {
        name: 'Juno Spacecraft',
        agency: 'NASA',
        year: '2016 - Present',
        type: 'Polar Orbit Science',
        discoveryOr: 'ବୃହସ୍ପତିର ମେରୁ ଅଞ୍ଚଳର ଚିତ୍ର, ଗ୍ରେଟ୍ ରେଡ୍ ସ୍ପଟ୍ ର ୩୦୦ କିମି ଗଭୀରତା ଏବଂ ବିରାଟ ମେଟାଲିକ୍ ହାଇଡ୍ରୋଜେନ୍ କୋର୍ ମାପୁଛି।',
        discoveryEn: 'Currently orbiting Jupiter in an elliptical polar orbit, revealing deep atmospheric ammonia plumes and complex 3D magnetic dynamo.'
      },
      {
        name: 'Europa Clipper & JUICE',
        agency: 'NASA & ESA',
        year: '2023 - 2024 (En Route)',
        type: 'Astrobiology & Icy Moons',
        discoveryOr: 'ୟୁରୋପା କ୍ଲିପର୍ (୨୦୨୪ ଅକ୍ଟୋବରରେ ଉତକ୍ଷେପିତ) ୟୁରୋପା ମହାସାଗରରେ ଜୀବନଧାରଣର ଉପାଦାନ ଖୋଜିବା ପାଇଁ ଯାତ୍ରାରତ।',
        discoveryEn: 'NASA Europa Clipper (launched Oct 2024) and ESA JUICE are traveling to probe habitability of Jovian ocean worlds.'
      }
    ],

    astrophysicalNarrativeOr: 'ବୃହସ୍ପତି ଏତେ ବିଶାଳ ଯେ ସୌରମଣ୍ଡଳର ଅନ୍ୟ ସମସ୍ତ ଗ୍ରହ, ଉପଗ୍ରହ ଓ ଗ୍ରହାଣୁପୁଞ୍ଜ ଏକତ୍ର ହେଲେ ମଧ୍ୟ ବୃହସ୍ପତିର ଅଧା ଓଜନ ହେବ ନାହିଁ! ଏହା ପ୍ରକୃତରେ ଏକ "ବିଫଳ ତାରକା" (Failed Star)—ଯଦି ଏହାର ବସ୍ତୁତ୍ୱ ଆଉ ୮୦ ଗୁଣ ଅଧିକ ହୋଇଥାନ୍ତା, ତେବେ ଏହାର କେନ୍ଦ୍ରରେ ଆଣବିକ ଫ୍ୟୁଜନ୍ ଆରମ୍ଭ ହୋଇ ଆମ ସୌରମଣ୍ଡଳ ଏକ ଯୁଗ୍ମ-ତାରକା ମଣ୍ଡଳ (Binary Star System) ହୋଇଥାନ୍ତା। ଏହାର ପ୍ରସିଦ୍ଧ "ଗ୍ରେଟ୍ ରେଡ୍ ସ୍ପଟ୍" (Great Red Spot) ହେଉଛି ପୃଥିବୀ ଠାରୁ ୧.୩ ଗୁଣ ବଡ଼ ଏକ ପ୍ରଳୟଙ୍କରୀ ବାତ୍ୟା ଯାହା ଗତ ୩୫୦ ବର୍ଷରୁ ଅଧିକ ସମୟ ଧରି ଘୂର୍ଣ୍ଣିବାତ୍ୟା ସୃଷ୍ଟି କରି ଚାଲିଛି। ବୃହସ୍ପତି ନିଜ ପ୍ରଚଣ୍ଡ ମାଧ୍ୟାକର୍ଷଣ ଦ୍ୱାରା ଅନେକ ଧୂମକେତୁ ଓ ଗ୍ରହାଣୁକୁ ନିଜ ଆଡ଼କୁ ଟାଣି ନେଇ ପୃଥିବୀକୁ ବିନାଶରୁ ରକ୍ଷା କରୁଛି—ଏହା ସୌରମଣ୍ଡଳର "କସ୍ମିକ୍ ଭାକ୍ୟୁମ୍ କ୍ଲିନର୍" ବା ସୁରକ୍ଷା କବଚ!',
    astrophysicalNarrativeEn: 'Jupiter is so immense that its mass is 2.5 times that of all other planets in the solar system combined. Often described as a "failed star," it has a solar-like composition of hydrogen and helium; had it acquired 80 times more mass during formation, nuclear fusion would have ignited, turning our solar system into a binary star system. Its iconic Great Red Spot is an anticyclonic vortex larger than Earth that has persisted for over 350 years with wind speeds exceeding 430 km/h. Jupiter acts as the gravitational shield of the inner solar system, sweeping up potentially catastrophic comets and asteroids.',

    vedic: {
      rulingDeity: 'ଦେବଗୁରୁ ବୃହସ୍ପତି / ଭଗବାନ ଶ୍ରୀ ବ୍ରହ୍ମା (Brihaspati / Lord Brahma)',
      consortOrEnergy: 'ତାରା ଦେବୀ (Tara)',
      gemstone: 'ପୋଖରାଜ (Natural Yellow Sapphire / Pushparaga)',
      metal: 'ଶୁଦ୍ଧ ସୁନା (Pure Gold)',
      element: 'ଆକାଶ ତତ୍ତ୍ୱ (Aakash / Ether / Space)',
      guna: 'ସାତ୍ତ୍ୱିକ (Sattva Guna - Pure Divine Light)',
      varna: 'ବ୍ରାହ୍ମଣ ବର୍ଣ୍ଣ (Scholar, Sage, Teacher)',
      direction: 'ଐଶାନ୍ୟ କୋଣ (North-East)',
      beejaMantra: 'ॐ ଗ୍ରାଂ ଗ୍ରୀଂ ଗ୍ରୌଂ ସଃ ଗୁରବେ ନମଃ ॥',
      gayatriMantra: 'ॐ ବୃହସ୍ପତୟେ ଚ ବିଦ୍ମହେ ସୁରାଚାର୍ଯ୍ୟାୟ ଧୀମହି ତନ୍ନୋ ଗୁରୁଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ଜ୍ଞାନ, ବେଦ, ଉଚ୍ଚ ଶିକ୍ଷା, ଧର୍ମ, ସନ୍ତାନ ସନ୍ତତି, ଗୁରୁ କୃପା, ଭାଗ୍ୟ, ଧନ ସମ୍ପତ୍ତି, ନ୍ୟାୟ ଓ ଆଧ୍ୟାତ୍ମିକ ମୁକ୍ତିର ପ୍ରଧାନ କାରକ ଗ୍ରହ।',
      karakatwaEn: 'Supreme significator (Kāraka) of divine wisdom, higher knowledge, spiritual enlightenment, progeny (Putrakaraka), wealth (Dhanakaraka), and righteous destiny.',
      ownSigns: 'ଧନୁ (Sagittarius) ଏବଂ ମୀନ (Pisces)',
      exaltationSign: 'କର୍କଟ ରାଶି ୫° ରେ ପରମ ଉଚ୍ଚ (Exalted in Cancer at 5°)',
      debilitationSign: 'ମକର ରାଶି ୫° ରେ ପରମ ନୀଚ (Debilitated in Capricorn at 5°)',
      specialAspects: 'ନିଜ ସ୍ଥାନରୁ ୫ମ, ୭ମ ଏବଂ ୯ମ ଘରକୁ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (5th, 7th, 9th House Special Drishti)',
      vimshottariYears: 16,
      friendPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ମଙ୍ଗଳ (Surya, Chandra, Mangala)',
      enemyPlanets: 'ବୁଧ, ଶୁକ୍ର (Budha, Shukra)',
      neutralPlanets: 'ଶନି, ରାହୁ, କେତୁ (Shani, Rahu, Ketu)',
      suryaSiddhantaMotion: '୩,୬୪,୨୨୦ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଦୈନିକ ହାରାହାରି ଗତି ୦° ୪\' ୫୯\'\')',
      suryaSiddhantaDiameterYojanas: '୪,୧୯୨ ଯୋଜନ (Surya Siddhanta Chapter 7)',
      charitableUpayasOr: 'ଗୁରୁବାର ଦିନ ହଳଦିଆ ବସ୍ତ୍ର ପରିଧାନ, ବୃହସ୍ପତି ସ୍ତୋତ୍ର ପାଠ, ବୁଟ ଡାଲି, ହଳଦୀ, କଦଳୀ, ସୁନା, କେଶର ଏବଂ ଧାର୍ମିକ ପୁସ୍ତକ ବିଦ୍ୱାନ ବ୍ରାହ୍ମଣଙ୍କୁ ଦାନ।'
    }
  },

  Surya: {
    id: 'Surya',
    nameOr: 'ସୂର୍ଯ୍ୟ ଦେବ (The Sun)',
    nameEn: 'The Sun (Central Star)',
    sanskritName: 'सूर्य (Surya / Aditya)',
    symbol: '☀️',
    category: 'star',
    themeColor: '#f59e0b',
    gradientBg: 'from-amber-950/70 via-orange-950/40 to-[#02040a]',
    borderColor: 'border-amber-500/50',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',

    massKg: '1.9885 × 10³⁰ kg',
    massEarthRel: '333,000 M⊕ (99.86% Solar System Mass)',
    equatorialDiameterKm: '1,392,700 km (109x Earth)',
    volumeEarthRel: '1,300,000x Earth',
    meanDensityGcm3: '1.408 g/cm³',
    surfaceGravityMs2: '274.0 m/s²',
    gravityG: 27.94,
    escapeVelocityKms: '617.7 km/s',
    semiMajorAxisKm: '0 km (Center of Solar System)',
    semiMajorAxisAU: '0 AU',
    perihelionKm: 'Galactic Center: 26,000 Light Years',
    aphelionKm: 'Galactic Orbit: 230 Million Years',
    eccentricity: '0.07',
    orbitalPeriodDays: '84 Billion Days (Galactic Year)',
    orbitalPeriodYears: '230 Million Years',
    meanOrbitalSpeedKms: '220 km/s (Orbiting Milky Way Core)',
    orbitalInclinationDeg: '60.19° to Galactic Plane',
    axialTiltDeg: '7.25° to Ecliptic',
    rotationPeriodHours: '25.38 Days (Equator) / 34.4 Days (Poles)',
    dayLength: 'Differential Rotation (25 - 34 Days)',
    surfaceTempC: '5,500°C (Photosphere) / 15,000,000°C (Nuclear Core)',
    surfacePressureBar: 'Core: 265 Billion Bar',
    knownMoonsCount: 8,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Hydrogen', percentage: 73.46, formula: 'H' },
      { gas: 'Helium', percentage: 24.85, formula: 'He' },
      { gas: 'Oxygen', percentage: 0.77, formula: 'O' },
      { gas: 'Carbon', percentage: 0.29, formula: 'C' },
      { gas: 'Iron', percentage: 0.16, formula: 'Fe' },
      { gas: 'Neon', percentage: 0.12, formula: 'Ne' }
    ],

    spaceMissions: [
      {
        name: 'Aditya-L1',
        agency: 'ISRO (India)',
        year: '2023 - Present',
        type: 'Sun-Earth L1 Halo Orbit',
        discoveryOr: 'ଭାରତର ପ୍ରଥମ ସୌର ମିଶନ୍! L1 ପଏଣ୍ଟରୁ ସୂର୍ଯ୍ୟଙ୍କ କରୋନାଲ୍ ମାସ୍ ଇଜେକ୍ସନ୍ (CME) ଓ ସୌର ଝଡ଼ର ନିରବଚ୍ଛିନ୍ନ ନିରୀକ୍ଷଣ।',
        discoveryEn: 'India premier solar observatory studying coronal heating, coronal mass ejections, and space weather at Sun-Earth L1.'
      },
      {
        name: 'Parker Solar Probe',
        agency: 'NASA',
        year: '2018 - Present',
        type: 'Solar Corona Penetration',
        discoveryOr: 'ଇତିହାସର ସବୁଠାରୁ ଦ୍ରୁତତମ ମାନବ ନିର୍ମିତ ଯାନ (୭୦୦,୦୦୦ କିମି/ଘଣ୍ଟା), ଯାହା ସୂର୍ଯ୍ୟଙ୍କ କରୋନା ଭିତରକୁ ସିଧାସଳଖ ପ୍ରବେଶ କଲା।',
        discoveryEn: 'Fastest human-made object touching the Sun, flying through the upper corona at speeds exceeding 690,000 km/h.'
      },
      {
        name: 'SOHO & SDO',
        agency: 'NASA & ESA',
        year: '1995 - Present',
        type: 'Continuous Solar Helioseismology',
        discoveryOr: '୨୮ ବର୍ଷ ଧରି ୪୦୦୦ରୁ ଅଧିକ ସନ୍-ଗ୍ରେଜିଂ ଧୂମକେତୁ ଓ ସୌର କଳଙ୍କ (Sunspots) ଚିହ୍ନଟ କରିଛି।',
        discoveryEn: 'Pioneered continuous 24/7 ultra-high-definition multi-wavelength monitoring of the solar magnetic cycle.'
      }
    ],

    astrophysicalNarrativeOr: 'ସୂର୍ଯ୍ୟ ହେଉଛି ସମଗ୍ର ସୌରମଣ୍ଡଳର ମାଧ୍ୟାକର୍ଷଣ ଓ ଶକ୍ତିର ଉତ୍ସ, ଯେଉଁଥିରେ ସମୁଦାୟ ସୌରମଣ୍ଡଳର ୯୯.୮୬% ବସ୍ତୁତ୍ୱ ରହିଛି। ଏହାର କୋର୍‌ରେ ପ୍ରତି ସେକେଣ୍ଡରେ ୬୦୦ ନିୟୁତ ଟନ୍ ହାଇଡ୍ରୋଜେନ୍ ନ୍ୟୁକ୍ଲିୟର ଫ୍ୟୁଜନ୍ ଦ୍ୱାରା ହିଲିୟମ୍‌ରେ ରୂପାନ୍ତରିତ ହୋଇ ୪ ନିୟୁତ ଟନ୍ ଶକ୍ତି (E = mc²) ଆଲୋକ ଓ ଉତ୍ତାପ ରୂପେ ବିକିରିତ କରେ। ସୂର୍ଯ୍ୟଙ୍କ କୋର୍‌ରୁ ଗୋଟିଏ ଫୋଟୋନ୍ ପୃଷ୍ଠଭାଗକୁ ଆସିବା ପାଇଁ ୧,୦୦,୦୦୦ରୁ ଅଧିକ ବର୍ଷ ଲାଗିଥାଏ, କିନ୍ତୁ ପୃଷ୍ଠଭାଗରୁ ପୃଥିବୀରେ ପହଞ୍ଚିବା ପାଇଁ ମାତ୍ର ୮ ମିନିଟ୍ ୨୦ ସେକେଣ୍ଡ ଲାଗେ!',
    astrophysicalNarrativeEn: 'The Sun contains 99.86% of the solar system mass. In its core, gravitational pressure sustains proton-proton chain nuclear fusion, converting 600 million tons of hydrogen into helium every single second. The photons generated in the core take over 100,000 years to diffuse through the dense radiative zone before streaming into space, reaching Earth in just 8 minutes and 20 seconds.',

    vedic: {
      rulingDeity: 'ଭଗବାନ ଶିବ / ଅଗ୍ନି ଦେବ / ଗାୟତ୍ରୀ ସାବିତ୍ରୀ (Lord Shiva / Savitur)',
      consortOrEnergy: 'ସଂଜ୍ଞା ଓ ଛାୟା ଦେବୀ (Sanjna & Chhaya)',
      gemstone: 'ମାଣିକ୍ୟ (Natural Ruby / Manikya)',
      metal: 'ତମ୍ବା ଓ ଶୁଦ୍ଧ ସୁନା (Copper / Gold)',
      element: 'ଅଗ୍ନି ତତ୍ତ୍ୱ (Fire / Tejas)',
      guna: 'ସାତ୍ତ୍ୱିକ (Sattva Guna - Illuminating Consciousness)',
      varna: 'କ୍ଷତ୍ରିୟ (King, Emperor, Authority)',
      direction: 'ପୂର୍ବ ଦିଗ (East)',
      beejaMantra: 'ॐ ହ୍ରାଂ ହ୍ରୀଂ ହ୍ରୌଂ ସଃ ସୂର୍ଯ୍ୟାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ଆଦିତ୍ୟାୟ ବିଦ୍ମହେ ମାର୍ତ୍ତଣ୍ଡାୟ ଧୀମହି ତନ୍ନଃ ସୂର୍ଯ୍ୟଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ଆତ୍ମାର କାରକ (Atmakaraka), ପ୍ରାଣଶକ୍ତି, ପିତା, ପ୍ରଶାସନିକ ଶକ୍ତି, ଉଚ୍ଚ ପଦବୀ, ହୃଦୟ, ତେଜ ଓ ଆରୋଗ୍ୟର ଅଧିପତି।',
      karakatwaEn: 'Significator of the Soul (Atma), divine vitality, father, sovereign power, willpower, and physical vitality.',
      ownSigns: 'ସିଂହ ରାଶି (Leo)',
      exaltationSign: 'ମେଷ ରାଶି ୧୦° ରେ ପରମ ଉଚ୍ଚ (Exalted in Aries at 10°)',
      debilitationSign: 'ତୁଳା ରାଶି ୧୦° ରେ ପରମ ନୀଚ (Debilitated in Libra at 10°)',
      specialAspects: '୭ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (7th House Aspect)',
      vimshottariYears: 6,
      friendPlanets: 'ଚନ୍ଦ୍ର, ମଙ୍ଗଳ, ବୃହସ୍ପତି (Chandra, Mangala, Guru)',
      enemyPlanets: 'ଶନି, ଶୁକ୍ର, ରାହୁ, କେତୁ (Shani, Shukra, Rahu, Ketu)',
      neutralPlanets: 'ବୁଧ (Budha)',
      suryaSiddhantaMotion: '୪୩,୨୦,୦୦୦ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଦୈନିକ ଗତି ଠିକ୍ ୧° ୦\' ୦\'\')',
      suryaSiddhantaDiameterYojanas: '୬,୫୦୦ ଯୋଜନ (Surya Siddhanta Chapter 4)',
      charitableUpayasOr: 'ପ୍ରତିଦିନ ସୂର୍ଯ୍ୟ ନମସ୍କାର, ତମ୍ବା ପାତ୍ରରେ ଜଳ ଅର୍ଘ୍ୟ ପ୍ରଦାନ, ଗାୟତ୍ରୀ ମନ୍ତ୍ର ଜପ, ଗହମ, ଗୁଡ଼, ତମ୍ବା ଓ ରକ୍ତ ଚନ୍ଦନ ଦାନ।'
    }
  },

  Budha: {
    id: 'Budha',
    nameOr: 'ବୁଧ ଗ୍ରହ (Mercury)',
    nameEn: 'Mercury (The Swift Planet)',
    sanskritName: 'बुध (Budha / Saumya)',
    symbol: '☿',
    category: 'rocky',
    themeColor: '#38bdf8',
    gradientBg: 'from-slate-950/80 via-cyan-950/40 to-[#02040a]',
    borderColor: 'border-cyan-500/50',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',

    massKg: '3.3011 × 10²³ kg',
    massEarthRel: '0.0553 M⊕ (5.5% of Earth)',
    equatorialDiameterKm: '4,879.4 km (38% of Earth)',
    volumeEarthRel: '0.056x Earth',
    meanDensityGcm3: '5.427 g/cm³ (Second densest planet)',
    surfaceGravityMs2: '3.70 m/s²',
    gravityG: 0.38,
    escapeVelocityKms: '4.25 km/s',
    semiMajorAxisKm: '57,909,050 km',
    semiMajorAxisAU: '0.3871 AU',
    perihelionKm: '46,001,200 km (0.307 AU)',
    aphelionKm: '69,816,900 km (0.467 AU)',
    eccentricity: '0.2056 (Most eccentric planet)',
    orbitalPeriodDays: '87.969 Earth Days',
    orbitalPeriodYears: '0.2408 Julian Years',
    synodicPeriodDays: '115.88 Days',
    meanOrbitalSpeedKms: '47.36 km/s (Fastest in Solar System)',
    orbitalInclinationDeg: '7.005° to Ecliptic',
    axialTiltDeg: '0.034° (Virtually zero tilt)',
    rotationPeriodHours: '1,407.6 Hours (58.646 Earth Days)',
    dayLength: '176 Earth Days (Solar Day due to 3:2 spin-orbit resonance)',
    surfaceTempC: '-180°C (Night) to +430°C (Day)',
    surfacePressureBar: '10⁻¹⁴ bar (Trace Exosphere)',
    knownMoonsCount: 0,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Oxygen (O₂)', percentage: 42.0, formula: 'O₂' },
      { gas: 'Sodium (Na)', percentage: 29.0, formula: 'Na' },
      { gas: 'Hydrogen (H₂)', percentage: 22.0, formula: 'H₂' },
      { gas: 'Helium (He)', percentage: 6.0, formula: 'He' },
      { gas: 'Potassium (K)', percentage: 0.5, formula: 'K' }
    ],

    spaceMissions: [
      {
        name: 'MESSENGER',
        agency: 'NASA',
        year: '2004 - 2015',
        type: 'Orbiter',
        discoveryOr: 'ମେରୁ ଅଞ୍ଚଳର ଚିର ଅନ୍ଧକାର ଗର୍ତ୍ତରେ ପାଣି ବରଫ (Water Ice) ଏବଂ ଜୈବିକ କାର୍ବନ୍ ଯୌଗିକ ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'First orbiter of Mercury; discovered abundant water ice in permanently shadowed polar craters.'
      },
      {
        name: 'BepiColombo',
        agency: 'ESA & JAXA',
        year: '2018 - Present (En Route)',
        type: 'Dual Orbiter',
        discoveryOr: 'ବୁଧର ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର, ଧାତବ କୋର୍ ଏବଂ ଭୂ-ତାତ୍ତ୍ୱିକ ଗଠନର ଅଧ୍ୟୟନ ପାଇଁ ଯାତ୍ରାରତ।',
        discoveryEn: 'Joint European-Japanese mission carrying two orbiters to analyze Mercury composition and magnetic exosphere.'
      }
    ],

    astrophysicalNarrativeOr: 'ବୁଧ ଗ୍ରହ ସୌରମଣ୍ଡଳର ସବୁଠାରୁ ଦ୍ରୁତଗାମୀ ଗ୍ରହ (ପ୍ରତି ସେକେଣ୍ଡରେ ୪୭ କିମି)। ଏହାର ବାୟୁମଣ୍ଡଳ ନଥିବାରୁ ସୌରମଣ୍ଡଳର ସର୍ବାଧିକ ତାପମାତ୍ରା ପାର୍ଥକ୍ୟ (-୧୮୦°C ରୁ +୪୩୦°C) ଏଠାରେ ଦେଖାଯାଏ। ବୁଧର ଅଭ୍ୟନ୍ତରର ୮୫% ଏକ ବିରାଟ ଲୌହ କୋର୍ (Metallic Iron Core) ଦ୍ୱାରା ଗଠିତ। ଏହାର କକ୍ଷପଥର ଅଗ୍ରଗତି (Perihelion Precession) ନ୍ୟୁଟନ୍‌ଙ୍କ ମାଧ୍ୟାକର୍ଷଣ ନିୟମ ଦ୍ୱାରା ସମ୍ପୂର୍ଣ୍ଣ ବ୍ୟାଖ୍ୟା ହୋଇପାରିନଥିଲା—ଆଇନଷ୍ଟାଇନ୍‌ଙ୍କ ସାଧାରଣ ଆପେକ୍ଷିକତା ତତ୍ତ୍ୱ (General Relativity) ଏହି ଅତିରିକ୍ତ ୪୩ ଆର୍କସେକେଣ୍ଡ ବିଚ୍ୟୁତିକୁ ପ୍ରମାଣ କରି ଇତିହାସ ସୃଷ୍ଟି କରିଥିଲା!',
    astrophysicalNarrativeEn: 'Mercury is the smallest and fastest planet, completing an orbit in just 88 days. Its 3:2 spin-orbit resonance means it rotates three times for every two orbits around the Sun, resulting in a single solar day lasting 176 Earth days. The anomalous 43-arcsecond-per-century precession of Mercury perihelion provided the first observational confirmation of Albert Einstein General Theory of Relativity.',

    vedic: {
      rulingDeity: 'ଭଗବାନ ଶ୍ରୀ ବିଷ୍ଣୁ (Lord Vishnu / Narayana)',
      consortOrEnergy: 'ଇଳା ଦେବୀ (Ila)',
      gemstone: 'ପନ୍ନା (Natural Emerald / Panna)',
      metal: 'କଂସା ଓ ପିତ୍ତଳ (Bronze / Brass)',
      element: 'ପୃଥିବୀ ତତ୍ତ୍ୱ (Prithvi / Earth)',
      guna: 'ରଜୋ ଗୁଣ (Rajas - Activity & Intellect)',
      varna: 'ବୈଶ୍ୟ ବର୍ଣ୍ଣ (Commerce, Trade, Logic)',
      direction: 'ଉତ୍ତର ଦିଗ (North)',
      beejaMantra: 'ॐ ବ୍ରାଂ ବ୍ରୀଂ ବ୍ରୌଂ ସଃ ବୁଧାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ସୌମ୍ୟରୂପାୟ ବିଦ୍ମହେ ବାଣେଶାୟ ଧୀମହି ତନ୍ନୋ ବୁଧଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ବୁଦ୍ଧି (Buddhi), ବିବେକ, ବାକ୍ ଶକ୍ତି, ବାଣିଜ୍ୟ, ଗାଣିତିକ ଯୋଗ୍ୟତା, ତର୍କଶକ୍ତି, ତନ୍ତ୍ରିକା ତନ୍ତ୍ର (Nervous System) ଓ ସମ୍ପାଦନାର କାରକ।',
      karakatwaEn: 'Significator of analytical intellect, speech, commercial acumen, mathematics, writing, nervous system, and diplomacy.',
      ownSigns: 'ମିଥୁନ (Gemini) ଏବଂ କନ୍ୟା (Virgo)',
      exaltationSign: 'କନ୍ୟା ରାଶି ୧୫° ରେ ପରମ ଉଚ୍ଚ (Exalted in Virgo at 15°)',
      debilitationSign: 'ମୀନ ରାଶି ୧୫° ରେ ପରମ ନୀଚ (Debilitated in Pisces at 15°)',
      specialAspects: '୭ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (7th House Aspect)',
      vimshottariYears: 17,
      friendPlanets: 'ସୂର୍ଯ୍ୟ, ଶୁକ୍ର (Surya, Shukra)',
      enemyPlanets: 'ଚନ୍ଦ୍ର (Chandra)',
      neutralPlanets: 'ମଙ୍ଗଳ, ବୃହସ୍ପତି, ଶନି (Mangala, Guru, Shani)',
      suryaSiddhantaMotion: '୧,୭୯,୩୭,୦୬୦ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ସୂର୍ଯ୍ୟଙ୍କ ଶୀଘ୍ରୋଚ୍ଚ)',
      suryaSiddhantaDiameterYojanas: '୩,୦୦୮ ଯୋଜନ (Surya Siddhanta Chapter 7)',
      charitableUpayasOr: 'ବୁଧବାର ଦିନ ସବୁଜ ବସ୍ତ୍ର ପରିଧାନ, ବିଷ୍ଣୁ ସହସ୍ରନାମ ପାଠ, ମୁଗ ଡାଲି, ସବୁଜ ପନିପରିବା, କଂସା ବାସନ ଓ ଗାଈକୁ ସବୁଜ ଘାସ ଖୁଆଇବା।'
    }
  },

  Shukra: {
    id: 'Shukra',
    nameOr: 'ଶୁକ୍ର ଗ୍ରହ (Venus)',
    nameEn: 'Venus (Earth Twin & Morning Star)',
    sanskritName: 'शुक्र (Shukra / Bhrigu)',
    symbol: '♀',
    category: 'rocky',
    themeColor: '#f43f5e',
    gradientBg: 'from-rose-950/70 via-pink-950/40 to-[#02040a]',
    borderColor: 'border-rose-500/50',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',

    massKg: '4.8675 × 10²⁴ kg',
    massEarthRel: '0.815 M⊕ (81.5% Earth)',
    equatorialDiameterKm: '12,103.6 km (95% Earth)',
    volumeEarthRel: '0.857x Earth',
    meanDensityGcm3: '5.243 g/cm³',
    surfaceGravityMs2: '8.87 m/s²',
    gravityG: 0.904,
    escapeVelocityKms: '10.36 km/s',
    semiMajorAxisKm: '108,208,000 km',
    semiMajorAxisAU: '0.7233 AU',
    perihelionKm: '107,477,000 km (0.718 AU)',
    aphelionKm: '108,939,000 km (0.728 AU)',
    eccentricity: '0.0067 (Most circular orbit in solar system)',
    orbitalPeriodDays: '224.70 Earth Days',
    orbitalPeriodYears: '0.6152 Julian Years',
    synodicPeriodDays: '583.92 Days',
    meanOrbitalSpeedKms: '35.02 km/s',
    orbitalInclinationDeg: '3.394° to Ecliptic',
    axialTiltDeg: '177.36° (Retrograde Rotation - Spins Backwards!)',
    rotationPeriodHours: '5,832.5 Hours (243.02 Earth Days)',
    dayLength: '116.75 Earth Days',
    surfaceTempC: '465°C (Hottest Planet in Solar System)',
    surfacePressureBar: '92 bar (Equivalent to 900 meters underwater on Earth!)',
    knownMoonsCount: 0,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Carbon Dioxide (CO₂)', percentage: 96.5, formula: 'CO₂' },
      { gas: 'Nitrogen (N₂)', percentage: 3.5, formula: 'N₂' },
      { gas: 'Sulfur Dioxide (SO₂)', percentage: 0.015, formula: 'SO₂' },
      { gas: 'Argon (Ar)', percentage: 0.007, formula: 'Ar' },
      { gas: 'Water Vapor (trace)', percentage: 0.002, formula: 'H₂O' }
    ],

    spaceMissions: [
      {
        name: 'Venera 7, 9 & 13',
        agency: 'Soviet Union',
        year: '1970 - 1982',
        type: 'Lander & Surface Photography',
        discoveryOr: 'ଇତିହାସରେ ପ୍ରଥମ ଯାନ ଯାହା ଅନ୍ୟ ଏକ ଗ୍ରହର ଭୂପୃଷ୍ଠରେ ଅବତରଣ କରି ୪୬୫°C ତାପରେ ପ୍ରଥମ ରଙ୍ଗୀନ ଫଟୋ ପଠାଇଥିଲା।',
        discoveryEn: 'First human spacecraft to land on another planet and transmit color panoramas of Venusian basalt plains.'
      },
      {
        name: 'Magellan Radar Orbiter',
        agency: 'NASA',
        year: '1989 - 1994',
        type: 'SAR Radar Mapping',
        discoveryOr: 'ଘନ ମେଘ ଭେଦ କରି ଶୁକ୍ରର ୯୮% ଭୂପୃଷ୍ଠର ଆଗ୍ନେୟଗିରି ଓ ଲାଭା ପ୍ରବାହର 3D ରାଡାର୍ ମାନଚିତ୍ର ପ୍ରସ୍ତୁତ କଲା।',
        discoveryEn: 'Mapped 98% of Venus surface through opaque cloud cover using Synthetic Aperture Radar.'
      },
      {
        name: 'DAVINCI & VERITAS',
        agency: 'NASA & ESA EnVision',
        year: '2029 - 2031 (Planned)',
        type: 'Atmospheric Probe & High-Res Imaging',
        discoveryOr: 'ବାୟୁମଣ୍ଡଳରେ ଫସଫିନ୍ (Phosphine) ଓ ପ୍ରାଚୀନ ମହାସାଗରର ପ୍ରମାଣ ଖୋଜିବା ପାଇଁ ପରବର୍ତ୍ତୀ ପିଢ଼ିର ମିଶନ୍।',
        discoveryEn: 'Upcoming NASA missions to drop an atmospheric descent sphere and map surface mineralogy at 1-meter resolution.'
      }
    ],

    astrophysicalNarrativeOr: 'ଶୁକ୍ର ଗ୍ରହ ଆକାର ଓ ବସ୍ତୁତ୍ୱରେ ପୃଥିବୀର ପ୍ରାୟ ସମାନ (Earth\'s Twin)। କିନ୍ତୁ ଏହାର ଘନ କାର୍ବନ୍ ଡାଇଅକ୍ସାଇଡ୍ ବାୟୁମଣ୍ଡଳ ଓ ସଲଫ୍ୟୁରିକ୍ ଏସିଡ୍ ମେଘମାଳା ଯୋଗୁଁ ଏଠାରେ ପ୍ରଚଣ୍ଡ ରନ୍-ଆୱେ ଗ୍ରୀନ୍‌ହାଉସ୍ ଇଫେକ୍ଟ୍ (Runaway Greenhouse Effect) ସୃଷ୍ଟି ହୋଇଛି, ଯାହା ଏହାକୁ ସୂର୍ଯ୍ୟଙ୍କ ନିକଟତର ବୁଧ ଠାରୁ ମଧ୍ୟ ଅଧିକ ଉତ୍ତପ୍ତ (୪୬୫°C—ସୀସା ତରଳାଇ ଦେବା ଭଳି ତାପ) କରିଦେଇଛି! ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ଶୁକ୍ର ସମସ୍ତ ଗ୍ରହଙ୍କ ବିପରୀତ ଦିଗରେ (କ୍ଲକ୍‌ୱାଇଜ୍ ବା ପୂର୍ବରୁ ପଶ୍ଚିମ) ଘୁରେ, ଏବଂ ଏହାର ଗୋଟିଏ ଦିନ (୨୪୩ ପୃଥିବୀ ଦିନ) ଏହାର ବର୍ଷ (୨୨୫ ଦିନ) ଠାରୁ ମଧ୍ୟ ବଡ଼!',
    astrophysicalNarrativeEn: 'Venus is Earth near-twin in size and mass, but possesses a hellish runaway greenhouse atmosphere composed of 96.5% CO₂ and sulfuric acid clouds. Surface pressure reaches 92 atmospheres with temperatures of 465°C. Venus rotates backwards (retrograde) compared to all other planets, likely due to a massive primordial collision, resulting in a rotational period (243 days) that exceeds its orbital period (225 days).',

    vedic: {
      rulingDeity: 'ମାତା ଶ୍ରୀ ମହାଲକ୍ଷ୍ମୀ / ଶୁକ୍ରାଚାର୍ଯ୍ୟ (Goddess Lakshmi / Shukracharya)',
      consortOrEnergy: 'ଜୟନ୍ତୀ ଦେବୀ (Jayanti)',
      gemstone: 'ହୀରା (Natural Diamond / Heera) କିମ୍ବା ଶ୍ୱେତ ଓପାଲ୍',
      metal: 'ଶୁଦ୍ଧ ରୂପା ଓ ପ୍ଲାଟିନମ୍ (Silver / Platinum)',
      element: 'ଜଳ ତତ୍ତ୍ୱ (Jala / Water)',
      guna: 'ରଜୋ ଗୁଣ (Rajas - Creative & Aesthetic Passion)',
      varna: 'ବ୍ରାହ୍ମଣ ବର୍ଣ୍ଣ (Poet, Artist, Master of Sanjivani Vidya)',
      direction: 'ଦକ୍ଷିଣ-ପୂର୍ବ / ଆଗ୍ନେୟ କୋଣ (South-East)',
      beejaMantra: 'ॐ ଦ୍ରାଂ ଦ୍ରୀଂ ଦ୍ରୌଂ ସଃ ଶୁକ୍ରାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ଭୃଗୁସୁତାୟ ବିଦ୍ମହେ ଦିବ୍ୟଦେହାୟ ଧୀମହି ତନ୍ନଃ ଶୁକ୍ରଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ପ୍ରେମ, ସୌନ୍ଦର୍ଯ୍ୟ, ବିବାହ, ସୁଖ, ସଙ୍ଗୀତ, ଚଳଚ୍ଚିତ୍ର, କଳା, ଯାନବାହନ, ଭୌଗିକ ଐଶ୍ୱର୍ଯ୍ୟ ଓ ସଞ୍ଜୀବନୀ ଶକ୍ତିର କାରକ।',
      karakatwaEn: 'Significator of divine love, marital bliss, aesthetics, arts, luxury vehicles, fertility (Shukra/Ojas), and revitalizing life-force.',
      ownSigns: 'ବୃଷ (Taurus) ଏବଂ ତୁଳା (Libra)',
      exaltationSign: 'ମୀନ ରାଶି ୨୭° ରେ ପରମ ଉଚ୍ଚ (Exalted in Pisces at 27°)',
      debilitationSign: 'କନ୍ୟା ରାଶି ୨୭° ରେ ପରମ ନୀଚ (Debilitated in Virgo at 27°)',
      specialAspects: '୭ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (7th House Aspect)',
      vimshottariYears: 20,
      friendPlanets: 'ବୁଧ, ଶନି (Budha, Shani)',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର (Surya, Chandra)',
      neutralPlanets: 'ମଙ୍ଗଳ, ବୃହସ୍ପତି (Mangala, Guru)',
      suryaSiddhantaMotion: '୭୦,୨୨,୩୭୬ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଶୁକ୍ର ଶୀଘ୍ରୋଚ୍ଚ)',
      suryaSiddhantaDiameterYojanas: '୪,୦୩୫ ଯୋଜନ (Surya Siddhanta Chapter 7)',
      charitableUpayasOr: 'ଶୁକ୍ରବାର ଦିନ ଧଳା ବସ୍ତ୍ର ପରିଧାନ, କନକଧାରା ସ୍ତୋତ୍ର ପାଠ, ଖିରି, ଘିଅ, ଚାଉଳ, କର୍ପୂର, ଧଳା ଚନ୍ଦନ ଓ ରୂପା ଦାନ।'
    }
  },

  PrithviChandra: {
    id: 'PrithviChandra',
    nameOr: 'ପୃଥିବୀ ଓ ଚନ୍ଦ୍ର (Earth & Moon)',
    nameEn: 'Earth & Moon (The Living Oasis)',
    sanskritName: 'पृथ्वी व चन्द्र (Bhoomi & Chandra)',
    symbol: '🌍 🌙',
    category: 'rocky',
    themeColor: '#10b981',
    gradientBg: 'from-emerald-950/70 via-teal-950/40 to-[#02040a]',
    borderColor: 'border-emerald-500/50',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',

    massKg: '5.9722 × 10²⁴ kg (Earth) / 7.342 × 10²² kg (Moon)',
    massEarthRel: '1.000 M⊕ (Moon is 0.0123 M⊕)',
    equatorialDiameterKm: '12,756.2 km (Earth) / 3,474.8 km (Moon)',
    volumeEarthRel: '1.000x Earth',
    meanDensityGcm3: '5.514 g/cm³ (Densest major planet)',
    surfaceGravityMs2: '9.80665 m/s² (Earth) / 1.62 m/s² (Moon)',
    gravityG: 1.000,
    escapeVelocityKms: '11.186 km/s (Earth) / 2.38 km/s (Moon)',
    semiMajorAxisKm: '149,598,023 km (1 AU)',
    semiMajorAxisAU: '1.0000 AU',
    perihelionKm: '147,095,000 km (0.983 AU)',
    aphelionKm: '152,100,000 km (1.017 AU)',
    eccentricity: '0.0167',
    orbitalPeriodDays: '365.256363 Earth Days',
    orbitalPeriodYears: '1.0000 Sidereal Year',
    synodicPeriodDays: '29.53 Days (Lunar Month / Tithi Cycle)',
    meanOrbitalSpeedKms: '29.78 km/s (107,200 km/h)',
    orbitalInclinationDeg: '0.000° (Reference Ecliptic)',
    axialTiltDeg: '23.44° (Generates 4 Seasons)',
    rotationPeriodHours: '23 Hours 56 Minutes 4.1 Seconds (Sidereal Day)',
    dayLength: '24 Hours 00 Minutes 00 Seconds (Solar Day)',
    surfaceTempC: '15°C Mean (-89.2°C Antarctica to +56.7°C Death Valley)',
    surfacePressureBar: '1.013 bar (Sea level)',
    knownMoonsCount: 1,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Nitrogen (N₂)', percentage: 78.08, formula: 'N₂' },
      { gas: 'Oxygen (O₂)', percentage: 20.95, formula: 'O₂' },
      { gas: 'Argon (Ar)', percentage: 0.93, formula: 'Ar' },
      { gas: 'Carbon Dioxide (CO₂)', percentage: 0.042, formula: 'CO₂' },
      { gas: 'Water Vapor (variable)', percentage: 0.4, formula: 'H₂O' }
    ],

    spaceMissions: [
      {
        name: 'Apollo 11 - 17',
        agency: 'NASA',
        year: '1969 - 1972',
        type: 'Human Lunar Landing',
        discoveryOr: 'ମାନବଜାତିର ଚନ୍ଦ୍ରପୃଷ୍ଠରେ ପଦାର୍ପଣ ଏବଂ ୩୮୨ କି.ଗ୍ରା. ଚନ୍ଦ୍ର ଶିଳା ପୃଥିବୀକୁ ଆଣିଥିଲା।',
        discoveryEn: 'First human footsteps on another celestial world, returning 382 kg of lunar regolith and pristine basalt.'
      },
      {
        name: 'Chandrayaan-1, 2, & 3',
        agency: 'ISRO (India)',
        year: '2008, 2019, 2023',
        type: 'Orbiter, Lander & Rover',
        discoveryOr: 'ଚନ୍ଦ୍ରଯାନ-୧ ପ୍ରଥମ ଥର ଚନ୍ଦ୍ରରେ ଜଳ ଅଣୁ (H₂O/OH) ଆବିଷ୍କାର କଲା; ଚନ୍ଦ୍ରଯାନ-୩ ବିଶ୍ୱର ପ୍ରଥମ ଯାନ ଭାବେ ଚନ୍ଦ୍ରର ଦକ୍ଷିଣ ମେରୁରେ ସଫ୍ଟ ଲ୍ୟାଣ୍ଡିଂ କଲା।',
        discoveryEn: 'Chandrayaan-1 discovered water molecules across the lunar surface; Chandrayaan-3 achieved history first soft landing at the Lunar South Pole.'
      }
    ],

    astrophysicalNarrativeOr: 'ପୃଥିବୀ ହେଉଛି ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡରେ ଜଣାଶୁଣା ଏକମାତ୍ର ଗ୍ରହ ଯେଉଁଠାରେ ତରଳ ଜଳ, ପ୍ରାଣୀ ଜୀବନ ଓ ପ୍ରଚୁର ଅମ୍ଳଜାନ ରହିଛି। ଏହାର ୨୩.୪୪° ଅକ୍ଷୀୟ ଢଳାଣ (Axial Tilt) ଯୋଗୁଁ ଋତୁ ପରିବର୍ତ୍ତନ ହୁଏ। ପୃଥିବୀର ଏକମାତ୍ର ଉପଗ୍ରହ ଚନ୍ଦ୍ର ପୃଥିବୀ ସହ ଟାଇଡାଲ୍ ଲକ୍ (Tidally Locked) ହୋଇ ରହିଛି, ଯାହା ଫଳରେ ଚନ୍ଦ୍ରର ଗୋଟିଏ ପାଖ ସବୁବେଳେ ପୃଥିବୀ ଆଡ଼କୁ ମୁହଁ କରି ରହିଥାଏ। ଚନ୍ଦ୍ରର ମାଧ୍ୟାକର୍ଷଣ ପୃଥିବୀର ସମୁଦ୍ରରେ ଜୁଆର-ଭଟ୍ଟା ସୃଷ୍ଟି କରେ ଏବଂ ପୃଥିବୀର ଢଳାଣକୁ ସ୍ଥିର ରଖି ଜୀବନଧାରଣ ଅନୁକୂଳ ପରିବେଶ ପ୍ରଦାନ କରେ।',
    astrophysicalNarrativeEn: 'Earth is the only confirmed haven for life in the cosmos, situated in the circumstellar habitable zone with liquid water oceans covering 70.8% of its surface. Its magnetic dynamo shields the biosphere from sterilizing solar winds. The Moon, formed via a giant impact 4.5 billion years ago, is tidally locked to Earth and stabilizes Earth axial precession, preventing catastrophic climatic shifts.',

    vedic: {
      rulingDeity: 'ମାତା ଭୂଦେବୀ (Earth) / ଭଗବାନ ଚନ୍ଦ୍ରଦେବ (Moon) / ମାତା ପାର୍ବତୀ',
      consortOrEnergy: 'ରୋହିଣୀ ଦେବୀ (Rohini)',
      gemstone: 'ମୋତି (Natural Basra Pearl / Moti) କିମ୍ବା ଚନ୍ଦ୍ରକାନ୍ତ ମଣି',
      metal: 'ରୂପା ଓ କଂସା (Silver)',
      element: 'ଜଳ ତତ୍ତ୍ୱ (Jala - Mind, Fluidity, Nurturing)',
      guna: 'ସାତ୍ତ୍ୱିକ (Sattva Guna - Peaceful Nurturing)',
      varna: 'ବୈଶ୍ୟ (Nurturer, Agriculture, Commerce)',
      direction: 'ବାୟବ୍ୟ କୋଣ (North-West)',
      beejaMantra: 'ॐ ଶ୍ରାଂ ଶ୍ରୀଂ ଶ୍ରୌଂ ସଃ ଚନ୍ଦ୍ରମସେ ନମଃ ॥',
      gayatriMantra: 'ॐ କ୍ଷୀରପୁତ୍ରାୟ ବିଦ୍ମହେ ଅମୃତତତ୍ତ୍ୱାୟ ଧୀମହି ତନ୍ନଶ୍ଚନ୍ଦ୍ରଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ମନ (Manas), ଭାବନା, ମାତୃତ୍ୱ, ଚିତ୍ତଶାନ୍ତି, ଶରୀରର ରକ୍ତ ପ୍ରବାହ, ଜଳୀୟ ଅଂଶ, ସ୍ମୃତି ଶକ୍ତି ଓ କଳ୍ପନା ଶକ୍ତିର ଅଧିପତି।',
      karakatwaEn: 'Significator of the conscious mind (Manas), mother, emotional stability, memory, intuition, bodily fluids, and lunar rhythms.',
      ownSigns: 'କର୍କଟ ରାଶି (Cancer)',
      exaltationSign: 'ବୃଷ ରାଶି ୩° ରେ ପରମ ଉଚ୍ଚ (Exalted in Taurus at 3° - Rohini)',
      debilitationSign: 'ବିଛା ରାଶି ୩° ରେ ପରମ ନୀଚ (Debilitated in Scorpio at 3°)',
      specialAspects: '୭ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (7th House Aspect)',
      vimshottariYears: 10,
      friendPlanets: 'ସୂର୍ଯ୍ୟ, ବୁଧ (Surya, Budha)',
      enemyPlanets: 'କୌଣସି ଗ୍ରହକୁ ଶତ୍ରୁ ମାନେ ନାହିଁ (None)',
      neutralPlanets: 'ମଙ୍ଗଳ, ବୃହସ୍ପତି, ଶୁକ୍ର, ଶନି (Mangala, Guru, Shukra, Shani)',
      suryaSiddhantaMotion: '୫,୭୭,୫୩,୩୩୬ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଦୈନିକ ହାରାହାରି ଗତି ୧୩° ୧୦\' ୩୫\'\')',
      suryaSiddhantaDiameterYojanas: '୪୮୦ ଯୋଜନ (ଚନ୍ଦ୍ର ବିମ୍ବ)',
      charitableUpayasOr: 'ସୋମବାର ଦିନ ଶିବ ଲିଙ୍ଗରେ କ୍ଷୀର ଓ ଜଳ ଅଭିଷେକ, ଚାଉଳ, ଦୁଧ, ରୂପା, ଧଳା ବସ୍ତ୍ର ଓ ଶଙ୍ଖ ଦାନ।'
    }
  },

  Mangala: {
    id: 'Mangala',
    nameOr: 'ମଙ୍ଗଳ ଗ୍ରହ (Mars)',
    nameEn: 'Mars (The Red Planet)',
    sanskritName: 'मङ्गल (Mangala / Kuja / Angaraka)',
    symbol: '♂',
    category: 'rocky',
    themeColor: '#ef4444',
    gradientBg: 'from-red-950/70 via-rose-950/40 to-[#02040a]',
    borderColor: 'border-red-500/50',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',

    massKg: '6.4171 × 10²³ kg',
    massEarthRel: '0.107 M⊕ (10.7% Earth)',
    equatorialDiameterKm: '6,792.4 km (53% Earth)',
    volumeEarthRel: '0.151x Earth',
    meanDensityGcm3: '3.934 g/cm³',
    surfaceGravityMs2: '3.72 m/s²',
    gravityG: 0.379,
    escapeVelocityKms: '5.03 km/s',
    semiMajorAxisKm: '227,939,200 km',
    semiMajorAxisAU: '1.5237 AU',
    perihelionKm: '206,650,000 km (1.381 AU)',
    aphelionKm: '249,230,000 km (1.666 AU)',
    eccentricity: '0.0934',
    orbitalPeriodDays: '686.98 Earth Days',
    orbitalPeriodYears: '1.8808 Julian Years',
    synodicPeriodDays: '779.94 Days',
    meanOrbitalSpeedKms: '24.07 km/s',
    orbitalInclinationDeg: '1.850° to Ecliptic',
    axialTiltDeg: '25.19° (Almost identical to Earth 23.4°!)',
    rotationPeriodHours: '24 Hours 37 Minutes 22.7 Seconds (1 Sol)',
    dayLength: '24 Hours 39 Minutes 35 Seconds (Sol)',
    surfaceTempC: '-65°C Mean (-140°C Winter Poles to +20°C Summer Equator)',
    surfacePressureBar: '0.0063 bar (Less than 1% of Earth)',
    knownMoonsCount: 2,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Carbon Dioxide (CO₂)', percentage: 95.32, formula: 'CO₂' },
      { gas: 'Nitrogen (N₂)', percentage: 2.6, formula: 'N₂' },
      { gas: 'Argon (Ar)', percentage: 1.9, formula: 'Ar' },
      { gas: 'Oxygen (O₂)', percentage: 0.13, formula: 'O₂' },
      { gas: 'Carbon Monoxide (CO)', percentage: 0.08, formula: 'CO' },
      { gas: 'Water Vapor (trace)', percentage: 0.03, formula: 'H₂O' }
    ],

    majorMoons: [
      {
        name: 'Phobos (ଫୋବୋସ୍)',
        diameterKm: '22.2 km',
        distKm: '9,376 km',
        featureOr: 'ମଙ୍ଗଳ ପୃଷ୍ଠର ଏତେ ନିକଟରେ ଘୁରୁଛି ଯେ ପ୍ରତି ୭ ଘଣ୍ଟାରେ ୧ ଥର ପରିକ୍ରମା କରେ। ଆଗାମୀ ୫ କୋଟି ବର୍ଷ ମଧ୍ୟରେ ଏହା ମଙ୍ଗଳରେ ଧକ୍କା ଖାଇ ଏକ ରିଙ୍ଗ୍ ସୃଷ୍ଟି କରିବ!',
        featureEn: 'Orbits faster than Mars rotates; tidal forces are drawing it inward toward eventual fragmentation into a ring.'
      },
      {
        name: 'Deimos (ଡିମୋସ୍)',
        diameterKm: '12.4 km',
        distKm: '23,463 km',
        featureOr: 'ଏକ କ୍ଷୁଦ୍ର ଗ୍ରହାଣୁ ସଦୃଶ ଉପଗ୍ରହ, ଯାହା ମଙ୍ଗଳର ଦୂର କକ୍ଷପଥରେ ୩୦ ଘଣ୍ଟାରେ ଥରେ ଘୁରେ।',
        featureEn: 'Outer tiny moon composed of carbon-rich rock resembling C-type asteroids.'
      }
    ],

    spaceMissions: [
      {
        name: 'Mangalyaan (Mars Orbiter Mission)',
        agency: 'ISRO (India)',
        year: '2013 - 2022',
        type: 'Mars Orbiter',
        discoveryOr: 'ବିଶ୍ୱର ପ୍ରଥମ ଦେଶ ଭାବେ ଭାରତ ପ୍ରଥମ ପ୍ରୟାସରେ ହିଁ ମଙ୍ଗଳ କକ୍ଷପଥରେ ସଫଳ ହେଲା। ମାତ୍ର $74 ନିୟୁତ ଡଲାର ଖର୍ଚ୍ଚରେ ଇତିହାସ ରଚିଲା।',
        discoveryEn: 'India historic first interplanetary mission; succeeded on its maiden attempt at a fraction of Western budgets.'
      },
      {
        name: 'Curiosity & Perseverance Rovers',
        agency: 'NASA',
        year: '2012 - Present',
        type: 'Surface Nuclear Rover',
        discoveryOr: 'ମଙ୍ଗଳର ପ୍ରାଚୀନ ନଦୀ ଉପତ୍ୟକା ଓ ହ୍ରଦର ଶିଳାରେ ଜୈବିକ ଅଣୁ (Organic Carbon) ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'Discovered ancient riverbed conglomerates, lacustrine mudstones, and organic molecules in Gale and Jezero craters.'
      }
    ],

    astrophysicalNarrativeOr: 'ମଙ୍ଗଳ ଗ୍ରହର ମାଟିରେ ଥିବା ଆଇରନ୍ ଅକ୍ସାଇଡ୍ (ଲୁହା କଳଙ୍କି / Rust) ଯୋଗୁଁ ଏହା ଲାଲ୍ ଦେଖାଯାଏ। ସୌରମଣ୍ଡଳର ସର୍ବବୃହତ ଆଗ୍ନେୟଗିରି "ଅଲିମ୍ପସ୍ ମନ୍ସ" (Olympus Mons) ଏଠାରେ ଅବସ୍ଥିତ, ଯାହାର ଉଚ୍ଚତା ୨୨ କିଲୋମିଟର (ମାଉଣ୍ଟ ଏଭରେଷ୍ଟ ଠାରୁ ପ୍ରାୟ ତିନିଗୁଣ ଉଚ୍ଚ!)। ଏହା ବ୍ୟତୀତ ସୌରମଣ୍ଡଳର ସର୍ବବୃହତ କ୍ୟାନ୍ୟନ "ଭାଲିସ୍ ମାରିନେରିସ୍" (Valles Marineris) ଏଠାରେ ଅଛି, ଯାହା ୪୦୦୦ କିମି ଲମ୍ବା (ଯୁକ୍ତରାଷ୍ଟ୍ର ଆମେରିକାର ଚଉଡ଼ା ସହିତ ସମାନ)। ମଙ୍ଗଳର ଦକ୍ଷିଣ ଓ ଉତ୍ତର ମେରୁରେ ଜଳ-ବରଫ ଓ ଶୁଷ୍କ ବରଫ (Frozen CO₂) ର ବିଶାଳ ଆସ୍ତରଣ ରହିଛି।',
    astrophysicalNarrativeEn: 'Mars is characterized by its ferric oxide (rust) reddish soil. It hosts Olympus Mons, a shield volcano rising 21.9 km above datum—making it the tallest planetary mountain in the Solar System. It also contains Valles Marineris, a canyon system 4,000 km long and up to 7 km deep. Liquid water flowed across its surface billions of years ago before its magnetic dynamo ceased and solar wind stripped its atmosphere.',

    vedic: {
      rulingDeity: 'ଭଗବାନ ଶ୍ରୀ କାର୍ତ୍ତିକେୟ / ଶ୍ରୀ ହନୁମାନଜୀ (Lord Kartikeya / Hanuman)',
      consortOrEnergy: 'ଭୂମି ଦେବୀ ପୁତ୍ର (Bhauma)',
      gemstone: 'ପୋହଳା (Red Coral / Moonga)',
      metal: 'ତମ୍ବା (Pure Copper)',
      element: 'ଅଗ୍ନି ତତ୍ତ୍ୱ (Agni / Fire & Energy)',
      guna: 'ତାମସିକ / ରଜୋ (Dynamic Warrior Energy)',
      varna: 'କ୍ଷତ୍ରିୟ (Commander-in-Chief / Senapati)',
      direction: 'ଦକ୍ଷିଣ ଦିଗ (South)',
      beejaMantra: 'ॐ କ୍ରାଂ କ୍ରୀଂ କ୍ରୌଂ ସଃ ଭୌମାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ଅଙ୍ଗାରକାୟ ବିଦ୍ମହେ ଶକ୍ତିହସ୍ତାୟ ଧୀମହି ତନ୍ନୋ ଭୌମଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ସାହସ, ଶୌର୍ଯ୍ୟ, ଶକ୍ତି, ଭୂମି, ଯନ୍ତ୍ରପାତି, ରକ୍ତ, ଭ୍ରାତୃତ୍ୱ, ଶତ୍ରୁ ବିଜୟ, ଶଲ୍ୟ ଚିକିତ୍ସା (Surgery) ଓ ସେନାବାହିନୀର ପ୍ରଧାନ କାରକ।',
      karakatwaEn: 'Significator of physical strength, courage (Parakrama), real estate/land (Bhoomikaraka), younger siblings, military, engineering, and surgery.',
      ownSigns: 'ମେଷ (Aries) ଏବଂ ବିଛା (Scorpio)',
      exaltationSign: 'ମକର ରାଶି ୨୮° ରେ ପରମ ଉଚ୍ଚ (Exalted in Capricorn at 28°)',
      debilitationSign: 'କର୍କଟ ରାଶି ୨୮° ରେ ପରମ ନୀଚ (Debilitated in Cancer at 28°)',
      specialAspects: '୪ର୍ଥ, ୭ମ ଏବଂ ୮ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (4th, 7th, 8th House Special Aspects)',
      vimshottariYears: 7,
      friendPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ବୃହସ୍ପତି (Surya, Chandra, Guru)',
      enemyPlanets: 'ବୁଧ (Budha)',
      neutralPlanets: 'ଶୁକ୍ର, ଶନି (Shukra, Shani)',
      suryaSiddhantaMotion: '୨୨,୯୬,୮୩୨ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଦୈନିକ ହାରାହାରି ଗତି ୦° ୩୧\' ୨୬\'\')',
      suryaSiddhantaDiameterYojanas: '୩,୭୫୦ ଯୋଜନ (Surya Siddhanta Chapter 7)',
      charitableUpayasOr: 'ମଙ୍ଗଳବାର ଦିନ ହନୁମାନ ଚାଳିସା ପାଠ, ସୁନ୍ଦରକାଣ୍ଡ, ନାଲି ବସ୍ତ୍ର, ମସୁର ଡାଲି, ତମ୍ବା, ଗୁଡ଼ ଓ ଲାଲ୍ ଫୁଲ ଦାନ।'
    }
  },

  Shani: {
    id: 'Shani',
    nameOr: 'ଶନି ଦେବ (Saturn)',
    nameEn: 'Saturn (The Jewel of the Solar System)',
    sanskritName: 'शनि (Shani / Shanaishchara)',
    symbol: '♄',
    category: 'gas_giant',
    themeColor: '#6366f1',
    gradientBg: 'from-indigo-950/70 via-slate-950/40 to-[#02040a]',
    borderColor: 'border-indigo-500/50',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',

    massKg: '5.6834 × 10²୬ kg',
    massEarthRel: '95.16 M⊕ (95x Earth)',
    equatorialDiameterKm: '120,536 km (9.45x Earth)',
    polarDiameterKm: '108,728 km (Flattening: 0.09796)',
    volumeEarthRel: '763.59x Earth',
    meanDensityGcm3: '0.687 g/cm³ (Less dense than water!)',
    surfaceGravityMs2: '10.44 m/s²',
    gravityG: 1.065,
    escapeVelocityKms: '35.5 km/s',
    semiMajorAxisKm: '1,433,530,000 km',
    semiMajorAxisAU: '9.5826 AU',
    perihelionKm: '1,352,550,000 km (9.041 AU)',
    aphelionKm: '1,514,500,000 km (10.124 AU)',
    eccentricity: '0.0565',
    orbitalPeriodDays: '10,759.22 Earth Days',
    orbitalPeriodYears: '29.457 Julian Years',
    synodicPeriodDays: '378.09 Days',
    meanOrbitalSpeedKms: '9.68 km/s',
    orbitalInclinationDeg: '2.485° to Ecliptic',
    axialTiltDeg: '26.73° (Magnificent ring tilt seen from Earth)',
    rotationPeriodHours: '10 Hours 33 Minutes 38 Seconds',
    dayLength: '10 Hours 33 Minutes',
    surfaceTempC: '-140°C (1-bar cloud deck)',
    surfacePressureBar: '1 bar reference level',
    knownMoonsCount: 146,
    ringSystem: true,

    atmosphereBreakdown: [
      { gas: 'Molecular Hydrogen (H₂)', percentage: 96.3, formula: 'H₂' },
      { gas: 'Helium (He)', percentage: 3.25, formula: 'He' },
      { gas: 'Methane (CH₄)', percentage: 0.45, formula: 'CH₄' },
      { gas: 'Ammonia (NH₃)', percentage: 0.0125, formula: 'NH₃' },
      { gas: 'Hydrogen Deuteride (HD)', percentage: 0.011, formula: 'HD' }
    ],

    majorMoons: [
      {
        name: 'Titan (ଟାଇଟାନ୍)',
        diameterKm: '5,150 km',
        distKm: '1,221,870 km',
        featureOr: 'ସୌରମଣ୍ଡଳର ଏକମାତ୍ର ଉପଗ୍ରହ ଯାହାର ପୃଥିବୀ ଠାରୁ ଘନ ବାୟୁମଣ୍ଡଳ (୯୮% ନାଇଟ୍ରୋଜେନ୍) ଏବଂ ତରଳ ମିଥେନ୍/ଇଥେନ୍ ହ୍ରଦ ଅଛି!',
        featureEn: 'Only moon with a dense atmosphere (1.5 bar) and liquid hydrocarbon lakes on its frozen surface.'
      },
      {
        name: 'Enceladus (ଏନସେଲାଡସ୍)',
        diameterKm: '504 km',
        distKm: '238,000 km',
        featureOr: 'ଦକ୍ଷିଣ ମେରୁରୁ ତରଳ ଜଳ ଓ ବରଫର ଗିଜର୍ (Geysers) ମହାକାଶକୁ ଉଦ୍‌ଗୀରଣ ହୁଏ। ଏହାର ବରଫ ତଳେ ଉଷ୍ମ ଜଳ ସାଗର ବିଦ୍ୟମାନ!',
        featureEn: 'Active cryovolcanic geysers venting water vapor and organic macromolecules from a warm global subsurface ocean.'
      }
    ],

    spaceMissions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA & ESA',
        year: '1997 - 2017',
        type: 'Orbiter & Titan Lander',
        discoveryOr: 'ଶନି କକ୍ଷପଥରେ ୧୩ ବର୍ଷ ରହି ଏହାର ରିଙ୍ଗ୍ ସିଷ୍ଟମ୍, ଟାଇଟାନ୍ ଭୂପୃଷ୍ଠରେ ହୁଇଜେନ୍ସ ଅବତରଣ ଏବଂ ଏନସେଲାଡସ୍ର ଗିଜର୍ ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'Historic 13-year mission; deployed Huygens probe onto Titan and sampled Enceladus hydrothermal plumes.'
      }
    ],

    astrophysicalNarrativeOr: 'ଶନି ଗ୍ରହ ହେଉଛି ସୌରମଣ୍ଡଳର ସବୁଠାରୁ ସୁନ୍ଦର ଗ୍ରହ। ଏହାର ବିଶାଳ ରିଙ୍ଗ୍ ସିଷ୍ଟମ୍ (Rings) ପ୍ରାୟ ୨,୮୨,୦୦୦ କିମି ଚଉଡ଼ା, କିନ୍ତୁ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ଏହାର ମୋଟେଇ ମାତ୍ର ୧୦ ମିଟରରୁ ୧ କିଲୋମିଟର! ଏହି ବଳୟଗୁଡ଼ିକ ୯୯% ଶୁଦ୍ଧ ପାଣି ବରଫର ଖଣ୍ଡ ଦ୍ୱାରା ନିର୍ମିତ। ଶନି ଗ୍ରହର ହାରାହାରି ଘନତା ପାଣି ଠାରୁ ମଧ୍ୟ କମ୍ (୦.୬୮୭ g/cm³)—ଅର୍ଥାତ୍ ଯଦି କୌଣସି ବିଶାଳ ସମୁଦ୍ର ମିଳେ, ତେବେ ସମଗ୍ର ଶନି ଗ୍ରହ ସେଥିରେ ଭାସିବ! ଶନିର ଉତ୍ତର ମେରୁରେ ଏକ ଅଦ୍ଭୁତ ଷଡ଼ଭୁଜ ଆକୃତିର ବାତ୍ୟା (Hexagon Jet Stream) ରହିଛି, ଯାହା ଭିତରେ ୪ଟି ପୃଥିବୀ ସମାଇଯିବ। ବର୍ତ୍ତମାନ ସୁଦ୍ଧା ଶନିର ସର୍ବାଧିକ ୧୪୬ଟି ଚନ୍ଦ୍ର ଆବିଷ୍କୃତ ହୋଇଛି।',
    astrophysicalNarrativeEn: 'Saturn is famous for its extensive ring system, spanning 282,000 km in width yet only 10 to 100 meters in thickness, composed of pure water ice. Saturn is the only planet less dense than water (0.687 g/cm³). Its north pole features a persistent hexagonal jet stream spanning 30,000 km across. With 146 confirmed moons, it leads the solar system in satellite count.',

    vedic: {
      rulingDeity: 'ଭଗବାନ ଶନିଦେବ / ଯମରାଜ / କାଳଭୈରବ (Lord Shani / Yama)',
      consortOrEnergy: 'ମନ୍ଦାକିନୀ ଓ ଚ୍ଛାୟା ଦେବୀ (Chhaya Putra)',
      gemstone: 'ଇନ୍ଦ୍ରନୀଳ (Natural Blue Sapphire / Neelam) କିମ୍ବା ଆମେଥିଷ୍ଟ୍',
      metal: 'ଲୁହା ଓ କଳା ସୀସା (Iron / Lead)',
      element: 'ବାୟୁ ତତ୍ତ୍ୱ (Vayu / Air - Detachment & Time)',
      guna: 'ତାମସିକ (Tamas - Discipline, Austerity, Enduring Patience)',
      varna: 'ଶୂଦ୍ର (Labor, Hard Work, Servants, Mass Masses)',
      direction: 'ପଶ୍ଚିମ ଦିଗ (West)',
      beejaMantra: 'ॐ ପ୍ରାଂ ପ୍ରୀଂ ପ୍ରୌଂ ସଃ ଶନୈଶ୍ଚରାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ଶନୈଶ୍ଚରାୟ ବିଦ୍ମହେ ସୂର୍ଯ୍ୟପୁତ୍ରାୟ ଧୀମହି ତନ୍ନୋ ମନ୍ଦଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'କର୍ମ (Karma), ନ୍ୟାୟ, ଆୟୁଷ (Ayushkaraka), ଧୈର୍ଯ୍ୟ, ଅନୁଶାସନ, ବୈରାଗ୍ୟ, ଦୁଃଖ ମୁକ୍ତି, ପରିଶ୍ରମ ଓ ଆଧ୍ୟାତ୍ମିକ ସାଧନା।',
      karakatwaEn: 'Lord of Karma and Divine Justice, significator of longevity (Ayushkaraka), discipline, patience, hard labor, detachment, and democratic masses.',
      ownSigns: 'ମକର (Capricorn) ଏବଂ କୁମ୍ଭ (Aquarius)',
      exaltationSign: 'ତୁଳା ରାଶି ୨୦° ରେ ପରମ ଉଚ୍ଚ (Exalted in Libra at 20°)',
      debilitationSign: 'ମେଷ ରାଶି ୨୦° ରେ ପରମ ନୀଚ (Debilitated in Aries at 20°)',
      specialAspects: '୩ୟ, ୭ମ ଏବଂ ୧୦ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (3rd, 7th, 10th House Special Aspects)',
      vimshottariYears: 19,
      friendPlanets: 'ବୁଧ, ଶୁକ୍ର (Budha, Shukra)',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ମଙ୍ଗଳ (Surya, Chandra, Mangala)',
      neutralPlanets: 'ବୃହସ୍ପତି (Guru)',
      suryaSiddhantaMotion: '୧,୪୬,୫୬୮ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ଦୈନିକ ହାରାହାରି ଗତି ୦° ୨\' ୦\'\')',
      suryaSiddhantaDiameterYojanas: '୪,୩୨୦ ଯୋଜନ (Surya Siddhanta Chapter 7)',
      charitableUpayasOr: 'ଶନିବାର ସନ୍ଧ୍ୟାରେ ଅଶ୍ୱତ୍ଥ ବୃକ୍ଷ ମୂଳରେ ରାଶି ତେଲ ଦୀପ, ହନୁମାନ ଚାଳିସା, କଳା ରାଶି, କଳା କପଡ଼ା, ଲୁହା, ଜୋତା ଓ ଗରିବଙ୍କୁ ଅନ୍ନ ଦାନ।'
    }
  },

  RahuKetu: {
    id: 'RahuKetu',
    nameOr: 'ରାହୁ ଓ କେତୁ (Rahu & Ketu - Lunar Nodes)',
    nameEn: 'Rahu & Ketu (Astronomical Lunar Nodes)',
    sanskritName: 'राहु व केतु (North & South Lunar Intersection Nodes)',
    symbol: '☊ ☋',
    category: 'lunar_node',
    themeColor: '#a855f7',
    gradientBg: 'from-purple-950/70 via-violet-950/40 to-[#02040a]',
    borderColor: 'border-purple-500/50',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',

    massKg: '0 kg (Mathematical Intersection Coordinates of Ecliptic & Moon Orbit)',
    massEarthRel: 'Shadow Nodes (Chhaya Grahas)',
    equatorialDiameterKm: 'Astronomical Celestial Nexus Points',
    volumeEarthRel: 'Non-physical / Orbital Nodal Points',
    meanDensityGcm3: '0 g/cm³',
    surfaceGravityMs2: '0 m/s²',
    gravityG: 0,
    escapeVelocityKms: '0 km/s',
    semiMajorAxisKm: 'Moon Orbit Plane: 384,400 km from Earth',
    semiMajorAxisAU: '0.00257 AU',
    perihelionKm: 'Ecliptic Node Precession',
    aphelionKm: 'Retrograde Orbital Motion',
    eccentricity: '0.0549 (Moon orbit eccentricity)',
    orbitalPeriodDays: '6,793.5 Earth Days',
    orbitalPeriodYears: '18.5996 Julian Years (Nodal Precession Cycle)',
    synodicPeriodDays: '346.62 Days (Eclipse Year)',
    meanOrbitalSpeedKms: '1.022 km/s (Moon velocity at nodal crossing)',
    orbitalInclinationDeg: '5.145° (Moon orbit tilt to Earth Ecliptic)',
    axialTiltDeg: '0°',
    rotationPeriodHours: 'Precession: 19° 20\' per year in reverse',
    dayLength: 'Retrograde Precession',
    surfaceTempC: '-270.4°C (Cosmic Vacuum Temperature 2.7 K)',
    surfacePressureBar: '0 bar (Interplanetary Vacuum)',
    knownMoonsCount: 0,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Solar Wind Plasma', percentage: 95.0, formula: 'H⁺ / e⁻' },
      { gas: 'Helium Ions', percentage: 4.0, formula: 'He²⁺' },
      { gas: 'Interplanetary Magnetic Flux', percentage: 1.0, formula: 'B-field' }
    ],

    spaceMissions: [
      {
        name: 'LRO & DSCOVR (Earth-Moon Eclipse Observation)',
        agency: 'NASA & NOAA',
        year: '2009 - Present',
        type: 'Deep Space Orbital Observatory',
        discoveryOr: 'ରାହୁ ଓ କେତୁ ବିନ୍ଦୁରେ ପୃଥିବୀ ଓ ଚନ୍ଦ୍ରର ଛାୟା ପତନ ଦ୍ୱାରା ସୂର୍ଯ୍ୟପରାଗ ଓ ଚନ୍ଦ୍ରଗ୍ରହଣର ସଠିକ୍ ପୂର୍ବାନୁମାନ।',
        discoveryEn: 'Monitors the precise geometry of solar and lunar eclipses occurring strictly at lunar orbital node crossings.'
      }
    ],

    astrophysicalNarrativeOr: 'ଖଗୋଳ ବିଜ୍ଞାନ ଅନୁସାରେ ରାହୁ ଏବଂ କେତୁ କୌଣସି କଠିନ ପିଣ୍ଡ ନୁହଁନ୍ତି, ବରଂ ମହାକାଶର ଦୁଇଟି ଅତି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଗାଣିତିକ ଛେଦ ବିନ୍ଦୁ (Orbital Intersection Nodes)! ଚନ୍ଦ୍ରର କକ୍ଷପଥ ପୃଥିବୀର ସୂର୍ଯ୍ୟ ପରିକ୍ରମଣ କକ୍ଷପଥ (Ecliptic) ସହିତ ୫.୧୪୫° କୋଣରେ ଢଳି ରହିଛି। ଚନ୍ଦ୍ର ଯେତେବେଳେ ଦକ୍ଷିଣରୁ ଉତ୍ତର ଆଡ଼କୁ ଏହି କକ୍ଷପଥକୁ ଛେଦ କରେ ତାହାକୁ "ଆସେଣ୍ଡିଂ ନୋଡ୍" (Ascending Node / ରାହୁ) ଏବଂ ଉତ୍ତରରୁ ଦକ୍ଷିଣକୁ ଛେଦ କଲେ ତାହାକୁ "ଡିସେଣ୍ଡିଂ ନୋଡ୍" (Descending Node / କେତୁ) କୁହାଯାଏ। ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡରେ ସୂର୍ଯ୍ୟପରାଗ କିମ୍ବା ଚନ୍ଦ୍ରଗ୍ରହଣ କେବଳ ଏହି ଦୁଇଟି ବିନ୍ଦୁରେ ହିଁ ସମ୍ଭବ ହୋଇଥାଏ। ଏହି ଦୁଇଟି ବିନ୍ଦୁ ସର୍ବଦା ପରସ୍ପର ଠାରୁ ଠିକ୍ ୧୮୦° ବିପରୀତରେ ଥାଆନ୍ତି ଏବଂ ୧୮.୬ ବର୍ଷରେ ସମ୍ପୂର୍ଣ୍ଣ ଆକାଶ ପଛୁଆ (Retrograde) ପରିକ୍ରମା କରନ୍ତି।',
    astrophysicalNarrativeEn: 'Astronomically, Rahu and Ketu are not physical masses, but the mathematical intersection nodes where the tilted orbit of the Moon (inclined at 5.145°) crosses the plane of the Earth ecliptic. The Ascending Node is Rahu, and the Descending Node is Ketu. Eclipses can ONLY occur when a Full Moon or New Moon coincides with these orbital nodes. The nodal axis regresses westward across the celestial sphere in an 18.6-year cycle.',

    vedic: {
      rulingDeity: 'ମାତା ଦୁର୍ଗା / ସରସ୍ୱତୀ (Rahu) ଏବଂ ଭଗବାନ ଶ୍ରୀ ଗଣେଶ / ମତ୍ସ୍ୟ ଅବତାର (Ketu)',
      consortOrEnergy: 'ସିଂହିକା ପୁତ୍ର (Svarbhanu)',
      gemstone: 'ରାହୁ: ଗୋମେଦ (Hessonite) • କେତୁ: ବୈଦୁର୍ଯ୍ୟ (Cat\'s Eye / Chrysoberyl)',
      metal: 'ସୀସା ଓ ପଞ୍ଚଧାତୁ (Lead / Mixed Alloys)',
      element: 'ବାୟୁ ଓ ଧୂମ ତତ୍ତ୍ୱ (Air, Illusion & Quantum Vacuum)',
      guna: 'ତାମସିକ (Tamas - Intense Obsession & Ultimate Renunciation)',
      varna: 'ମ୍ଳେଚ୍ଛ / ଚଣ୍ଡାଳ (Foreigners, Outcastes, Renegades)',
      direction: 'ଦକ୍ଷିଣ-ପଶ୍ଚିମ / ନୈରୃତ କୋଣ (South-West)',
      beejaMantra: 'ରାହୁ: ॐ ଭ୍ରାଂ ଭ୍ରୀଂ ଭ୍ରୌଂ ସଃ ରାହବେ ନମଃ • କେତୁ: ॐ ସ୍ରାଂ ସ୍ରୀଂ ସ୍ରୌଂ ସଃ କେତବେ ନମଃ',
      gayatriMantra: 'ॐ ନାଗଧ୍ୱଜାୟ ବିଦ୍ମହେ ପଦ୍ମହସ୍ତାୟ ଧୀମହି ତନ୍ନୋ ରାହୁଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ରାହୁ: ମାୟା, ବିଦେଶ ଯାତ୍ରା, କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (AI), ବିପ୍ଳବ, ରାଜନୀତି ଓ ତୀବ୍ର ମହତ୍ତ୍ୱାକାଂକ୍ଷା। କେତୁ: ମୋକ୍ଷ (Mokshakaraka), ଆଧ୍ୟାତ୍ମିକତା, ତପସ୍ୟା, ଗୁପ୍ତ ବିଦ୍ୟା ଓ ବୈରାଗ୍ୟ।',
      karakatwaEn: 'Rahu drives worldly illusion (Maya), revolutionary research, obsession, and foreign travels. Ketu governs final spiritual liberation (Mokshakaraka), ascetic renunciation, intuition, and occult realization.',
      ownSigns: 'ରାହୁ: କୁମ୍ଭ / କେତୁ: ବିଛା (Co-rulers in Jaimini astrology)',
      exaltationSign: 'ବୃଷ କିମ୍ବା ମିଥୁନ ରାଶିରେ ଉଚ୍ଚ',
      debilitationSign: 'ବିଛା କିମ୍ବା ଧନୁ ରାଶିରେ ନୀଚ',
      specialAspects: '୫ମ, ୭ମ ଏବଂ ୯ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (5th, 7th, 9th Aspects)',
      vimshottariYears: 18,
      friendPlanets: 'ବୁଧ, ଶୁକ୍ର, ଶନି (Budha, Shukra, Shani)',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ମଙ୍ଗଳ (Surya, Chandra, Mangala)',
      neutralPlanets: 'ବୃହସ୍ପତି (Guru)',
      suryaSiddhantaMotion: '୨,୩୨,୨୨୬ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ସର୍ବଦା ବକ୍ରି ବା ପଛୁଆ ଗତି)',
      suryaSiddhantaDiameterYojanas: 'ଛାୟା ଗ୍ରହ (ଶୂନ୍ୟ ଭୌତିକ ଆକାର)',
      charitableUpayasOr: 'ରାହୁ: ଭୈରବ ସାଧନା, କୋଇଲା, ନୀଳ ବସ୍ତ୍ର, ଗୋମେଦ ଦାନ। କେତୁ: ଗଣେଶ ପୂଜା, କୁକୁରକୁ ରୁଟି ଖୁଆଇବା, କମ୍ବଳ ଓ ତିଳ ଦାନ।'
    }
  },

  Rahu: {
    id: 'Rahu',
    nameOr: 'ରାହୁ (North Lunar Node)',
    nameEn: 'Rahu (Ascending Node / Dragon\'s Head)',
    sanskritName: 'राहु (Svarbhanu / Rahu)',
    symbol: '☊',
    category: 'lunar_node',
    themeColor: '#8b5cf6',
    gradientBg: 'from-purple-950/70 via-indigo-950/40 to-[#02040a]',
    borderColor: 'border-purple-500/50',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',

    massKg: '0 kg (Ascending Mathematical Ecliptic Intersection Node)',
    massEarthRel: 'Chhaya Graha (Shadow Point)',
    equatorialDiameterKm: 'Celestial Geometric Axis Point',
    volumeEarthRel: 'Non-physical / Intersection Node',
    meanDensityGcm3: '0 g/cm³',
    surfaceGravityMs2: '0 m/s²',
    gravityG: 0,
    escapeVelocityKms: '0 km/s',
    semiMajorAxisKm: 'Moon Orbit Crosses Earth Ecliptic at 384,400 km',
    semiMajorAxisAU: '0.00257 AU',
    perihelionKm: 'Ecliptic Node',
    aphelionKm: 'Retrograde Orbital Motion',
    eccentricity: '0.0549',
    orbitalPeriodDays: '6,793.5 Earth Days',
    orbitalPeriodYears: '18.5996 Julian Years (Nodal Cycle)',
    synodicPeriodDays: '346.62 Days (Draconic Year)',
    meanOrbitalSpeedKms: '1.022 km/s (Lunar speed at node)',
    orbitalInclinationDeg: '5.145° (Moon orbit tilt)',
    axialTiltDeg: '0°',
    rotationPeriodHours: 'Precession: 19° 20\'/year',
    dayLength: 'Retrograde Precession',
    surfaceTempC: '-270.4°C (Cosmic Vacuum)',
    surfacePressureBar: '0 bar (Deep Space Vacuum)',
    knownMoonsCount: 0,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Solar Wind Protons', percentage: 95.0, formula: 'p⁺' },
      { gas: 'Electrons & Alpha Particles', percentage: 5.0, formula: 'e⁻ / α' }
    ],

    spaceMissions: [
      {
        name: 'NASA Lunar Reconnaissance Orbiter (LRO)',
        agency: 'NASA',
        year: '2009 - Present',
        type: 'Lunar Orbiter',
        discoveryOr: 'ରାହୁ ବିନ୍ଦୁରେ ପୃଥିବୀ ଉପରେ ଚନ୍ଦ୍ରର ଛାୟା (ଉମ୍ରା ଓ ପେନୁମ୍ରା) ପତନର ଉଚ୍ଚ ରେଜୋଲ୍ୟୁସନ୍ ମାନଚିତ୍ରଣ।',
        discoveryEn: 'Tracks precise shadow trajectory during solar eclipses governed by lunar nodal crossings.'
      }
    ],

    astrophysicalNarrativeOr: 'ଆଷ୍ଟ୍ରୋନୋମିକାଲି ରାହୁ ହେଉଛି ଚନ୍ଦ୍ରର କକ୍ଷପଥ ପୃଥିବୀର କକ୍ଷପଥକୁ ଦକ୍ଷିଣରୁ ଉତ୍ତର ଆଡ଼କୁ ଛେଦ କରୁଥିବା ଆସେଣ୍ଡିଂ ନୋଡ୍ (Ascending Node)। ସୂର୍ଯ୍ୟପରାଗ କେବଳ ଏହି ବିନ୍ଦୁ ନିକଟରେ ଅମାବାସ୍ୟା ହେଲେ ହିଁ ସମ୍ଭବ ହୁଏ।',
    astrophysicalNarrativeEn: 'Astronomically, Rahu is the ascending lunar node where the Moon crosses the ecliptic northward. Solar eclipses occur when a new Moon aligns within roughly 18.5° of this node.',

    vedic: {
      rulingDeity: 'ମାତା ଦୁର୍ଗା ଦେବୀ (Goddess Durga)',
      consortOrEnergy: 'ସିଂହିକା ପୁତ୍ର',
      gemstone: 'ଗୋମେଦ (Natural Hessonite / Gomedh)',
      metal: 'ସୀସା (Lead)',
      element: 'ବାୟୁ ତତ୍ତ୍ୱ (Air / Uncharted Frontiers)',
      guna: 'ତାମସିକ (Tamas - Relentless Ambition)',
      varna: 'ମ୍ଳେଚ୍ଛ (Global Foreign Trade & Out-of-the-Box Innovator)',
      direction: 'ଦକ୍ଷିଣ-ପଶ୍ଚିମ / ନୈରୃତ (South-West)',
      beejaMantra: 'ॐ ଭ୍ରାଂ ଭ୍ରୀଂ ଭ୍ରୌଂ ସଃ ରାହବେ ନମଃ ॥',
      gayatriMantra: 'ॐ ନାଗଧ୍ୱଜାୟ ବିଦ୍ମହେ ପଦ୍ମହସ୍ତାୟ ଧୀମହି ତନ୍ନୋ ରାହୁଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (AI), ମହାକାଶ ବିଜ୍ଞାନ, ବୈପ୍ଳବିକ ଆବିଷ୍କାର, ରାଜନୀତି, ବିଦେଶ ବାସ ଓ କଳ୍ପନାତୀତ ସଫଳତାର କାରକ।',
      karakatwaEn: 'Significator of revolutionary thinking, artificial intelligence, deep technology, foreign affairs, obsession, and unexpected windfalls.',
      ownSigns: 'କୁମ୍ଭ ରାଶି (Aquarius - Co-lord)',
      exaltationSign: 'ବୃଷ ରାଶି (Taurus) / ମିଥୁନ (Gemini)',
      debilitationSign: 'ବିଛା ରାଶି (Scorpio) / ଧନୁ (Sagittarius)',
      specialAspects: '୫ମ, ୭ମ ଏବଂ ୯ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (5th, 7th, 9th Drishti)',
      vimshottariYears: 18,
      friendPlanets: 'ବୁଧ, ଶୁକ୍ର, ଶନି (Budha, Shukra, Shani)',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ମଙ୍ଗଳ (Surya, Chandra, Mangala)',
      neutralPlanets: 'ବୃହସ୍ପତି (Guru)',
      suryaSiddhantaMotion: '୨,୩୨,୨୨୬ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ସର୍ବଦା ବକ୍ରି ବା ପଛୁଆ)',
      suryaSiddhantaDiameterYojanas: 'ଛାୟା ବିନ୍ଦୁ',
      charitableUpayasOr: 'ମା’ ଦୁର୍ଗାଙ୍କ କବଚ ପାଠ, କଳା କମ୍ବଳ, କୋଇଲା, ମୂଳା ଓ ଗୋମେଦ ଦାନ।'
    }
  },

  Ketu: {
    id: 'Ketu',
    nameOr: 'କେତୁ (South Lunar Node)',
    nameEn: 'Ketu (Descending Node / Dragon\'s Tail)',
    sanskritName: 'केतु (Mokshakaraka / Ketu)',
    symbol: '☋',
    category: 'lunar_node',
    themeColor: '#c084fc',
    gradientBg: 'from-violet-950/70 via-fuchsia-950/40 to-[#02040a]',
    borderColor: 'border-fuchsia-500/50',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',

    massKg: '0 kg (Descending Mathematical Ecliptic Intersection Node)',
    massEarthRel: 'Chhaya Graha (South Node)',
    equatorialDiameterKm: 'Celestial Geometric Axis Point (180° Opposite to Rahu)',
    volumeEarthRel: 'Non-physical / Intersection Node',
    meanDensityGcm3: '0 g/cm³',
    surfaceGravityMs2: '0 m/s²',
    gravityG: 0,
    escapeVelocityKms: '0 km/s',
    semiMajorAxisKm: 'Moon Orbit Crosses Earth Ecliptic Southward',
    semiMajorAxisAU: '0.00257 AU',
    perihelionKm: 'Ecliptic Node',
    aphelionKm: 'Retrograde Orbital Motion',
    eccentricity: '0.0549',
    orbitalPeriodDays: '6,793.5 Earth Days',
    orbitalPeriodYears: '18.5996 Julian Years',
    synodicPeriodDays: '346.62 Days',
    meanOrbitalSpeedKms: '1.022 km/s',
    orbitalInclinationDeg: '5.145°',
    axialTiltDeg: '0°',
    rotationPeriodHours: 'Precession: 19° 20\'/year',
    dayLength: 'Retrograde Precession',
    surfaceTempC: '-270.4°C (Cosmic Vacuum)',
    surfacePressureBar: '0 bar (Vacuum)',
    knownMoonsCount: 0,
    ringSystem: false,

    atmosphereBreakdown: [
      { gas: 'Interplanetary Plasma Field', percentage: 98.0, formula: 'Plasma' },
      { gas: 'Quantum Vacuum Fluctuations', percentage: 2.0, formula: 'Vacuum' }
    ],

    spaceMissions: [
      {
        name: 'SOHO & DSCOVR Space Weather Observatories',
        agency: 'NASA & ESA',
        year: '1995 - Present',
        type: 'Lagrange Point 1 Observatory',
        discoveryOr: 'ନୋଡାଲ୍ ଆକ୍ସିସ୍ ମାଧ୍ୟମରେ ପୃଥିବୀ-ଚନ୍ଦ୍ର ସୂର୍ଯ୍ୟପରାଗ ଜ୍ୟାମିତିର ଅଧ୍ୟୟନ।',
        discoveryEn: 'Continuous observation of lunar transit across Earth disk at nodal alignment.'
      }
    ],

    astrophysicalNarrativeOr: 'ଆଷ୍ଟ୍ରୋନୋମିକାଲି କେତୁ ହେଉଛି ଚନ୍ଦ୍ରର କକ୍ଷପଥ ପୃଥିବୀର କକ୍ଷପଥକୁ ଉତ୍ତରରୁ ଦକ୍ଷିଣ ଆଡ଼କୁ ଛେଦ କରୁଥିବା ଡିସେଣ୍ଡିଂ ନୋଡ୍ (Descending Node)। ଏହା ରାହୁ ଠାରୁ ଠିକ୍ ୧୮୦° ସମ୍ମୁଖରେ ଅବସ୍ଥିତ।',
    astrophysicalNarrativeEn: 'Astronomically, Ketu is the descending lunar node where the Moon crosses the ecliptic southward, diametrically opposite (180°) to Rahu.',

    vedic: {
      rulingDeity: 'ଭଗବାନ ଶ୍ରୀ ଗଣେଶ / ମତ୍ସ୍ୟ ଅବତାର (Lord Ganesha / Matsya)',
      consortOrEnergy: 'ମହା କାଳୀ ଶକ୍ତି',
      gemstone: 'ବୈଦୁର୍ଯ୍ୟ (Natural Cat\'s Eye / Chrysoberyl)',
      metal: 'ପଞ୍ଚଧାତୁ ଓ ଲୁହା (Alloys)',
      element: 'ଅଗ୍ନି ଓ ଆକାଶ ତତ୍ତ୍ୱ (Moksha & Spiritual Illumination)',
      guna: 'ସାତ୍ତ୍ୱିକ / ତାମସିକ (Transcendental Asceticism)',
      varna: 'ସନ୍ନ୍ୟାସୀ (Sage, Mystic, Healer, Monk)',
      direction: 'ଐଶାନ୍ୟ କୋଣ (North-East Transcendental)',
      beejaMantra: 'ॐ ସ୍ରାଂ ସ୍ରୀଂ ସ୍ରୌଂ ସଃ କେତବେ ନମଃ ॥',
      gayatriMantra: 'ॐ ପଦ୍ମପୁତ୍ରାୟ ବିଦ୍ମହେ ଅମୃତେଶାୟ ଧୀମହି ତନ୍ନଃ କେତୁଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ମୋକ୍ଷ (Mokshakaraka), ଆଧ୍ୟାତ୍ମିକ ସାଧନା, କୁଣ୍ଡଳିନୀ ଜାଗରଣ, ତପସ୍ୟା, ସୂକ୍ଷ୍ମ ଅନ୍ତର୍ଦୃଷ୍ଟି, ଡାକ୍ତରୀ ଚିକିତ୍ସା ଓ ଗଣିତର କାରକ।',
      karakatwaEn: 'Supreme significator of spiritual enlightenment (Mokshakaraka), ascetic detachment, psychic intuition, occult mastery, and healing arts.',
      ownSigns: 'ବିଛା ରାଶି (Scorpio - Co-lord)',
      exaltationSign: 'ଧନୁ ରାଶି (Sagittarius)',
      debilitationSign: 'ମିଥୁନ ରାଶି (Gemini)',
      specialAspects: '୫ମ, ୭ମ ଏବଂ ୯ମ ଘର ଉପରେ ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି (5th, 7th, 9th Drishti)',
      vimshottariYears: 7,
      friendPlanets: 'ଶୁକ୍ର, ଶନି, ବୁଧ (Shukra, Shani, Budha)',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର (Surya, Chandra)',
      neutralPlanets: 'ମଙ୍ଗଳ, ବୃହସ୍ପତି (Mangala, Guru)',
      suryaSiddhantaMotion: '୨,୩୨,୨୨୬ ପରିଭ୍ରମଣ ପ୍ରତି ମହାଯୁଗ (ପଛୁଆ ଗତି)',
      suryaSiddhantaDiameterYojanas: 'ଛାୟା ବିନ୍ଦୁ',
      charitableUpayasOr: 'ଗଣପତି ଅଥର୍ବଶୀର୍ଷ ପାଠ, କୁକୁରକୁ ରୁଟି ଦାନ, କଳା-ଧଳା କମ୍ବଳ, ରାଶି ଓ ବୈଦୁର୍ଯ୍ୟ ମଣି ଧାରଣ।'
    }
  },

  Aruna: {
    id: 'Aruna',
    nameOr: 'ୟୁରେନସ୍ (Uranus / Aruna)',
    nameEn: 'Uranus (The Sideways Ice Giant)',
    sanskritName: 'अरुण / इन्द्र (Aruna / Indra)',
    symbol: '♅',
    category: 'ice_giant',
    themeColor: '#06b6d4',
    gradientBg: 'from-cyan-950/70 via-teal-950/40 to-[#02040a]',
    borderColor: 'border-cyan-500/50',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',

    massKg: '8.6810 × 10²⁵ kg',
    massEarthRel: '14.536 M⊕ (14.5x Earth)',
    equatorialDiameterKm: '51,118 km (4.01x Earth)',
    polarDiameterKm: '49,946 km',
    volumeEarthRel: '63.08x Earth',
    meanDensityGcm3: '1.270 g/cm³',
    surfaceGravityMs2: '8.69 m/s²',
    gravityG: 0.886,
    escapeVelocityKms: '21.3 km/s',
    semiMajorAxisKm: '2,870,972,200 km',
    semiMajorAxisAU: '19.191 AU',
    perihelionKm: '2,741,300,000 km (18.33 AU)',
    aphelionKm: '3,003,620,000 km (20.08 AU)',
    eccentricity: '0.0463',
    orbitalPeriodDays: '30,685.4 Earth Days',
    orbitalPeriodYears: '84.01 Julian Years',
    synodicPeriodDays: '369.66 Days',
    meanOrbitalSpeedKms: '6.80 km/s',
    orbitalInclinationDeg: '0.772° to Ecliptic',
    axialTiltDeg: '97.77° (Rotates Completely on its Side!)',
    rotationPeriodHours: '17 Hours 14 Minutes 24 Seconds (Retrograde)',
    dayLength: '17 Hours 14 Minutes',
    surfaceTempC: '-224°C (Coldest atmosphere in Solar System)',
    surfacePressureBar: '1 bar reference level',
    knownMoonsCount: 28,
    ringSystem: true,

    atmosphereBreakdown: [
      { gas: 'Molecular Hydrogen (H₂)', percentage: 82.5, formula: 'H₂' },
      { gas: 'Helium (He)', percentage: 15.2, formula: 'He' },
      { gas: 'Methane (CH₄)', percentage: 2.3, formula: 'CH₄' },
      { gas: 'Hydrogen Deuteride (HD)', percentage: 0.009, formula: 'HD' }
    ],

    spaceMissions: [
      {
        name: 'Voyager 2 Flyby',
        agency: 'NASA',
        year: '1986',
        type: 'Planetary Flyby',
        discoveryOr: 'ଇତିହାସରେ ଏକମାତ୍ର ମହାକାଶଯାନ ଯାହା ୟୁରେନସ୍ର ନିକଟ ଦେଇ ଯାଇ ଏହାର ୧୧ଟି ନୂତନ ଚନ୍ଦ୍ର ଓ ବିଚିତ୍ର ଢଳିଥିବା ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'Only spacecraft to visit Uranus, discovering 11 new moons, faint rings, and a magnetic field tilted 59° from its rotation axis.'
      }
    ],

    astrophysicalNarrativeOr: 'ୟୁରେନସ୍ ସୌରମଣ୍ଡଳର ଏକମାତ୍ର ଗ୍ରହ ଯାହା ସମ୍ପୂର୍ଣ୍ଣ ଭାବେ ନିଜ କଡ଼ ଉପରେ (୯୭.୭୭° ଢଳି ରହି) ଗଡ଼ି ଗଡ଼ି ସୂର୍ଯ୍ୟଙ୍କୁ ପରିକ୍ରମା କରେ! ଏହାର ଅର୍ଥ ହେଉଛି ଏହାର ପ୍ରତ୍ୟେକ ମେରୁ ୪୨ ବର୍ଷ ଧରି ଲଗାତାର ସୂର୍ଯ୍ୟାଲୋକ ପାଏ ଏବଂ ପରବର୍ତ୍ତୀ ୪୨ ବର୍ଷ ଚିର ଅନ୍ଧକାରରେ ବୁଡ଼ି ରହେ। ଏହାର ବାୟୁମଣ୍ଡଳର ମିଥେନ୍ ଗ୍ୟାସ୍ ଲାଲ୍ ଆଲୋକକୁ ଶୋଷଣ କରି ନୀଳ-ସବୁଜ (Cyan) ରଙ୍ଗ ପ୍ରଦାନ କରେ। -୨୨୪°C ତାପମାତ୍ରା ସହିତ ଏହା ସୌରମଣ୍ଡଳର ସବୁଠାରୁ ଶୀତଳତମ ବାୟୁମଣ୍ଡଳ ବିଶିଷ୍ଟ ଗ୍ରହ।',
    astrophysicalNarrativeEn: 'Uranus is unique for its extreme axial tilt of 97.77°, causing it to rotate virtually on its side. Each pole experiences 42 years of continuous daylight followed by 42 years of darkness. Methane in its upper atmosphere absorbs red light, giving it a soft cyan hue. With temperatures dipping to -224°C (49 K), it holds the record for the coldest planetary atmosphere in the Solar System.',

    vedic: {
      rulingDeity: 'ଦେବରାଜ ଇନ୍ଦ୍ର / ଅରୁଣ ଦେବ (Lord Indra / Aruna)',
      consortOrEnergy: 'ଶଚୀ ଦେବୀ (Indrani)',
      gemstone: 'ମିଡ୍‌ନାଇଟ୍ ବ୍ଲୁ ଟପାଜ୍ / ଫିରୋଜା (Turquoise)',
      metal: 'ୟୁରାନିୟମ୍ / ପ୍ଲାଟିନମ୍',
      element: 'ବିଦ୍ୟୁତ୍ ଓ ବାୟୁ ତତ୍ତ୍ୱ (Electromagnetism & Lightning)',
      guna: 'ରଜୋ / ସାତ୍ତ୍ୱିକ (Sudden Awakening)',
      varna: 'ଦେବତା (King of Senses)',
      direction: 'ଉର୍ଦ୍ଧ୍ୱ ଦିଗ (Zenith)',
      beejaMantra: 'ॐ ଇନ୍ଦ୍ରାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ସହସ୍ରନେତ୍ରାୟ ବିଦ୍ମହେ ବଜ୍ରହସ୍ତାୟ ଧୀମହି ତନ୍ନୋ ଇନ୍ଦ୍ରଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ହଠାତ୍ ପରିବର୍ତ୍ତନ, ଆବିଷ୍କାର, ଇଲେକ୍ଟ୍ରୋନିକ୍ସ, ଆଲୋକନ, ବିଜ୍ଞାନ ଓ ସାମାଜିକ ବିପ୍ଳବ।',
      karakatwaEn: 'Modern significator of sudden breakthroughs, revolutionary genius, lightning insights, high-tech aviation, and independence.',
      ownSigns: 'କୁମ୍ଭ (Modern Western Astrological Affinity)',
      exaltationSign: 'ବିଛା ରାଶି',
      debilitationSign: 'ବୃଷ ରାଶି',
      specialAspects: '୭ମ ଘର ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି',
      vimshottariYears: 84,
      friendPlanets: 'ବୁଧ, ଶନି',
      enemyPlanets: 'ସୂର୍ଯ୍ୟ, ମଙ୍ଗଳ',
      neutralPlanets: 'ବୃହସ୍ପତି',
      suryaSiddhantaMotion: 'ପ୍ରଜାପତି / ଇନ୍ଦ୍ର ଗ୍ରହ ରୂପେ ପ୍ରାଚୀନ ଗ୍ରନ୍ଥରେ ଉଲ୍ଲେଖ',
      suryaSiddhantaDiameterYojanas: '୪,୧୫୦ ଯୋଜନ',
      charitableUpayasOr: 'ପରିବେଶ ସୁରକ୍ଷା, ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଗ୍ୟାଜେଟ୍ କାରିଗରଙ୍କୁ ସାହାଯ୍ୟ ଓ ଗାୟତ୍ରୀ ଜପ।'
    }
  },

  Varuna: {
    id: 'Varuna',
    nameOr: 'ନେପଚ୍ୟୁନ୍ (Neptune / Varuna)',
    nameEn: 'Neptune (The Deep Blue Ice Giant)',
    sanskritName: 'वरुण (Varuna - Lord of Cosmic Oceans)',
    symbol: '♆',
    category: 'ice_giant',
    themeColor: '#3b82f6',
    gradientBg: 'from-blue-950/70 via-sky-950/40 to-[#02040a]',
    borderColor: 'border-blue-500/50',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',

    massKg: '1.02413 × 10²⁶ kg',
    massEarthRel: '17.147 M⊕ (17x Earth)',
    equatorialDiameterKm: '49,528 km (3.88x Earth)',
    polarDiameterKm: '48,682 km',
    volumeEarthRel: '57.74x Earth',
    meanDensityGcm3: '1.638 g/cm³ (Densest Giant Planet)',
    surfaceGravityMs2: '11.15 m/s²',
    gravityG: 1.137,
    escapeVelocityKms: '23.5 km/s',
    semiMajorAxisKm: '4,495,060,000 km',
    semiMajorAxisAU: '30.047 AU',
    perihelionKm: '4,459,630,000 km (29.81 AU)',
    aphelionKm: '4,536,870,000 km (30.33 AU)',
    eccentricity: '0.0086 (Extremely circular)',
    orbitalPeriodDays: '60,190.0 Earth Days',
    orbitalPeriodYears: '164.79 Julian Years',
    synodicPeriodDays: '367.49 Days',
    meanOrbitalSpeedKms: '5.43 km/s',
    orbitalInclinationDeg: '1.769° to Ecliptic',
    axialTiltDeg: '28.32° (Similar to Earth & Mars)',
    rotationPeriodHours: '16 Hours 6 Minutes 36 Seconds',
    dayLength: '16 Hours 6 Minutes',
    surfaceTempC: '-218°C (Upper atmosphere)',
    surfacePressureBar: '1 bar reference level',
    knownMoonsCount: 16,
    ringSystem: true,

    atmosphereBreakdown: [
      { gas: 'Molecular Hydrogen (H₂)', percentage: 80.0, formula: 'H₂' },
      { gas: 'Helium (He)', percentage: 19.0, formula: 'He' },
      { gas: 'Methane (CH₄)', percentage: 1.5, formula: 'CH₄' },
      { gas: 'Hydrogen Deuteride (HD)', percentage: 0.019, formula: 'HD' }
    ],

    majorMoons: [
      {
        name: 'Triton (ଟ୍ରାଇଟନ୍)',
        diameterKm: '2,706.8 km',
        distKm: '354,760 km',
        featureOr: 'ସୌରମଣ୍ଡଳର ଏକମାତ୍ର ବୃହତ ଉପଗ୍ରହ ଯାହା ନିଜ ଗ୍ରହର ବିପରୀତ ଦିଗରେ (Retrograde) ଘୁରେ! ନାଇଟ୍ରୋଜେନ୍ ଗିଜର୍ ମହାକାଶକୁ ୮ କିମି ଉଚ୍ଚକୁ ବରଫ ଫିଙ୍ଗିଥାଏ।',
        featureEn: 'Captured Kuiper Belt dwarf planet orbiting retrograde, with active nitrogen cryovolcanic geysers.'
      }
    ],

    spaceMissions: [
      {
        name: 'Voyager 2 Flyby',
        agency: 'NASA',
        year: '1989',
        type: 'Planetary Flyby',
        discoveryOr: 'ନେପଚ୍ୟୁନ୍ର ବିଶାଳ "ଗ୍ରେଟ୍ ଡାର୍କ ସ୍ପଟ୍" (Great Dark Spot) ଏବଂ ସୌରମଣ୍ଡଳର ସର୍ବାଧିକ ବେଗବାନ ବାତ୍ୟା (୨,୧୦୦ କିମି/ଘଣ୍ଟା) ଆବିଷ୍କାର କଲା।',
        discoveryEn: 'Captured first close-up images of Neptune azure blue clouds, Great Dark Spot, and Triton geysers.'
      }
    ],

    astrophysicalNarrativeOr: 'ନେପଚ୍ୟୁନ୍ ହେଉଛି ସୂର୍ଯ୍ୟଙ୍କ ଠାରୁ ସବୁଠାରୁ ଦୂରରେ ଥିବା ସୌରମଣ୍ଡଳର ଅଷ୍ଟମ ଗ୍ରହ (୩୦ AU ଅର୍ଥାତ୍ ୪.୫ ବିଲିୟନ କିମି ଦୂର)। ଏହା ଏକମାତ୍ର ଗ୍ରହ ଯାହା ଟେଲିସ୍କୋପ୍‌ରେ ଦେଖିବା ପୂର୍ବରୁ କେବଳ ଗଣିତ (Mathematical Prediction) ମାଧ୍ୟମରେ ୧୮୪୬ରେ ଆବିଷ୍କୃତ ହୋଇଥିଲା! ନେପଚ୍ୟୁନ୍ରେ ସୌରମଣ୍ଡଳର ସର୍ବାଧିକ ତୀବ୍ର ପବନ (Wind Speeds) ବହେ—ପ୍ରତି ଘଣ୍ଟାରେ ୨,୧୦୦ କିଲୋମିଟର (ଶବ୍ଦ ବେଗ ଠାରୁ ମଧ୍ୟ ଦ୍ରୁତତର ସୁପରସୋନିକ୍ ବେଗ)! ଏହାର ଅଭ୍ୟନ୍ତରରେ ଉଚ୍ଚ ଚାପ ଯୋଗୁଁ କାର୍ବନ୍ ପରମାଣୁ ହୀରାରେ ପରିଣତ ହୋଇ "ହୀରା ବର୍ଷା" (Diamond Rain) ହେଉଥିବା ବୈଜ୍ଞାନିକମାନେ ପ୍ରମାଣ କରିଛନ୍ତି!',
    astrophysicalNarrativeEn: 'Neptune is the eighth and outermost recognized planet, orbiting 30 AU from the Sun. It was the first planet located via mathematical prediction rather than empirical observation in 1846. Neptune possesses the most ferocious winds in the Solar System, clocked at supersonic speeds up to 2,100 km/h (1,300 mph). In its mantle, extreme pressures compress methane into pure diamond crystals that precipitate toward the core in what physicists term "diamond rain."',

    vedic: {
      rulingDeity: 'ଜଳାଧିପତି ଭଗବାନ ବରୁଣ ଦେବ (Lord Varuna - Sovereign of Waters)',
      consortOrEnergy: 'ବରୁଣାନୀ ଦେବୀ (Varunani)',
      gemstone: 'ଇନ୍ଦ୍ରନୀଳମଣି / ଲାପିସ୍ ଲାଜୁଲି (Lapis Lazuli)',
      metal: 'ରୂପା ଓ ତରଳ ପାରଦ (Mercury / Silver)',
      element: 'ମହାସାଗରୀୟ ଜଳ ତତ୍ତ୍ୱ (Primordial Ocean / Waters)',
      guna: 'ସାତ୍ତ୍ୱିକ (Vast Oceanic Tranquility)',
      varna: 'ଦେବତା (Guardian of Cosmic Order / Rta)',
      direction: 'ପଶ୍ଚିମ ସମୁଦ୍ର (West Ocean)',
      beejaMantra: 'ॐ ବରୁଣାୟ ନମଃ ॥',
      gayatriMantra: 'ॐ ଜଳବିମ୍ବାୟ ବିଦ୍ମହେ ନୀଳପୁରୁଷାୟ ଧୀମହି ତନ୍ନୋ ବରୁଣଃ ପ୍ରଚୋଦୟାତ୍ ॥',
      karakatwaOr: 'ମହାସାଗର, ଗଭୀର ଧ୍ୟାନ, ଅବଚେତନ ମନ (Subconscious Mind), ଦୂରଦୃଷ୍ଟି ଓ ବ୍ରହ୍ମାଣ୍ଡୀୟ କଲ୍ୟାଣ।',
      karakatwaEn: 'Significator of cosmic oceans, the subconscious mind, maritime navigation, telepathy, and profound mystical trances.',
      ownSigns: 'ମୀନ (Western Affinity)',
      exaltationSign: 'କର୍କଟ ରାଶି',
      debilitationSign: 'ମକର ରାଶି',
      specialAspects: '୭ମ ଘର ପୂର୍ଣ୍ଣ ଦୃଷ୍ଟି',
      vimshottariYears: 165,
      friendPlanets: 'ଚନ୍ଦ୍ର, ବୃହସ୍ପତି',
      enemyPlanets: 'ମଙ୍ଗଳ',
      neutralPlanets: 'ଶନି, ବୁଧ',
      suryaSiddhantaMotion: 'ବରୁଣ ଦେବତାଙ୍କ ଜଳାଧିପତ୍ୟ ବେଦରେ ବର୍ଣ୍ଣିତ',
      suryaSiddhantaDiameterYojanas: '୩,୯୮୦ ଯୋଜନ',
      charitableUpayasOr: 'ପବିତ୍ର ନଦୀ କିମ୍ବା ସମୁଦ୍ରରେ ସ୍ନାନ, ଜଳ ସଂରକ୍ଷଣ, ଓ ଶ୍ରୀ ବରୁଣ ସ୍ତୋତ୍ର ପାଠ।'
    }
  }
};

