export interface SpaceMission {
  id: string;
  nameOr: string;
  nameEn: string;
  agency: 'ISRO' | 'NASA' | 'ISRO-NASA' | 'NASA-ESA';
  target: 'Moon' | 'Sun' | 'Mars' | 'Deep Space' | 'Earth' | 'Jupiter' | 'Saturn';
  launchDate: string;
  launchVehicle: string;
  launchSite: string;
  status: 'Operational / Active' | 'Completed' | 'En Route' | 'Upcoming';
  costUSD: string;
  costINR?: string;
  orbitType: string;
  distanceFromEarth: string;
  signalDelay: string;
  themeColor: string;
  gradientBg: string;
  badgeBg: string;
  icon: string;
  
  // Real scientific objectives & discoveries
  headlineOr: string;
  headlineEn: string;
  summaryOr: string;
  summaryEn: string;

  // Scientific Payloads and Instruments
  payloads: {
    name: string;
    fullName: string;
    objectiveOr: string;
    objectiveEn: string;
  }[];

  // Key Milestones & Trajectory Timeline
  timeline: {
    date: string;
    eventOr: string;
    eventEn: string;
  }[];

  // Technical Specifications
  specs: {
    spacecraftMassKg: string;
    powerOutputWatts: string;
    missionDuration: string;
    primaryDiscoveryOr: string;
    primaryDiscoveryEn: string;
  };
}

export const SPACE_MISSIONS_DATA: Record<string, SpaceMission> = {
  Chandrayaan3: {
    id: 'Chandrayaan3',
    nameOr: 'ଚନ୍ଦ୍ରଯାନ-୩ (Chandrayaan-3)',
    nameEn: 'Chandrayaan-3 (Historic Lunar South Pole Landing)',
    agency: 'ISRO',
    target: 'Moon',
    launchDate: '14 July 2023, 14:35 IST',
    launchVehicle: 'LVM3-M4 (Fat Boy / Bahubali)',
    launchSite: 'SDSC SHAR, Sriharikota, India',
    status: 'Completed',
    costUSD: '$75 Million',
    costINR: '₹615 Crores',
    orbitType: 'Lunar Polar Orbit & Surface Landing (69.37° S, 32.35° E)',
    distanceFromEarth: '384,400 km',
    signalDelay: '1.28 Seconds',
    themeColor: '#06b6d4',
    gradientBg: 'from-cyan-950/70 via-slate-950/40 to-[#02040a]',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '🌙',

    headlineOr: 'ବିଶ୍ୱର ପ୍ରଥମ ଦେଶ ଭାବେ ଚନ୍ଦ୍ରର ଦକ୍ଷିଣ ମେରୁରେ ଐତିହାସିକ ସଫ୍ଟ ଲ୍ୟାଣ୍ଡିଂ!',
    headlineEn: 'World First Successful Soft Landing near the Lunar South Pole at Shiv Shakti Point.',
    summaryOr: '୨୩ ଅଗଷ୍ଟ ୨୦୨୩ ସନ୍ଧ୍ୟା ୬:୦୪ ରେ ଭାରତ ଚନ୍ଦ୍ରର ରହସ୍ୟମୟ ଦକ୍ଷିଣ ମେରୁ ନିକଟ "ଶିବ ଶକ୍ତି ପଏଣ୍ଟ" (Shiv Shakti Point) ରେ ବିକ୍ରମ ଲ୍ୟାଣ୍ଡର୍ କୁ ସଫଳତାର ସହ ଅବତରଣ କରାଇ ଇତିହାସ ସୃଷ୍ଟି କଲା। ପ୍ରଜ୍ଞାନ ରୋଭର୍ ଚନ୍ଦ୍ରପୃଷ୍ଠରେ ଚାଲି ଚନ୍ଦ୍ର ମାଟିରେ ସଲଫର୍ (ଗନ୍ଧକ), ଲୁହା, କ୍ୟାଲସିୟମ୍ ଓ ଅଲୁମିନିୟମର ଉପସ୍ଥିତି ପ୍ରମାଣ କଲା।',
    summaryEn: 'On August 23, 2023, India became the fourth nation to achieve a soft landing on the Moon, and the very first to touch down near the challenging lunar south polar terrain. The Vikram lander and Pragyan rover conducted in-situ experiments confirming elemental sulfur, measuring lunar plasma density, and recording lunar seismicity.',

    payloads: [
      {
        name: 'ChaSTE',
        fullName: 'Chandra Surface Thermophysical Experiment',
        objectiveOr: 'ଚନ୍ଦ୍ର ମାଟିର ୧୦ ସେମି ଗଭୀର ପର୍ଯ୍ୟନ୍ତ ତାପମାତ୍ରା ପ୍ରୋଫାଇଲ୍ ମାପିଲା। ପୃଷ୍ଠରେ ୫୦°C ଥିବା ବେଳେ ମାତ୍ର ୮ ସେମି ତଳେ -୧୦°C ରେକର୍ଡ କରି ଚମତ୍କାର ସୃଷ୍ଟି କଲା!',
        objectiveEn: 'Measured the thermal conductivity and vertical temperature gradient of lunar polar regolith down to 10 cm depth.'
      },
      {
        name: 'ILSA',
        fullName: 'Instrument for Lunar Seismic Activity',
        objectiveOr: 'ଚନ୍ଦ୍ରପୃଷ୍ଠର ଭୂକମ୍ପ (Moonquakes) ଏବଂ ପ୍ରଜ୍ଞାନ ରୋଭର୍ ଚଳପ୍ରଚଳର କମ୍ପନ ରେକର୍ଡ କଲା।',
        objectiveEn: 'Monitored micrometeorite impacts, Pragyan rover wheel vibrations, and intrinsic lunar seismic events.'
      },
      {
        name: 'LIBS & APXS',
        fullName: 'Laser-Induced Breakdown Spectroscopy & Alpha Particle X-ray Spectrometer',
        objectiveOr: 'ପ୍ରଜ୍ଞାନ ରୋଭରରେ ଲାଗିଥିବା ଏହି ଉପକରଣ ଚନ୍ଦ୍ର ମାଟିରେ ସଲଫର୍ (S), ଅଲୁମିନିୟମ୍ (Al), କ୍ୟାଲସିୟମ୍ (Ca), ଲୁହା (Fe), ଟାଇଟାନିୟମ୍ (Ti) ନିଶ୍ଚିତ କଲା।',
        objectiveEn: 'Rapidly mapped elemental composition of lunar polar soil, unambiguous in-situ detection of elemental sulfur (S).'
      },
      {
        name: 'SHAPE',
        fullName: 'Spectro-polarimetry of Habitable Planet Earth',
        objectiveOr: 'ଚନ୍ଦ୍ର କକ୍ଷପଥରୁ ପୃଥିବୀର ଆଲୋକ ପୋଲାରାଇଜେସନ୍ ଅଧ୍ୟୟନ କରି ଅନ୍ୟ ବ୍ରହ୍ମାଣ୍ଡରେ ଜୀବନ ଥିବା ଏକ୍ସୋପ୍ଲାନେଟ୍ ଖୋଜିବା ପାଇଁ ଡାଟା ସଂଗ୍ରହ କଲା।',
        objectiveEn: 'Analyzed spectro-polarimetric signatures of Earth from lunar orbit to aid future searches for habitable exoplanets.'
      }
    ],

    timeline: [
      { date: '14 Jul 2023', eventOr: 'ଶ୍ରୀହରିକୋଟାରୁ LVM3 ରକେଟ୍ ଦ୍ୱାରା ନିର୍ଭୁଲ ଉତକ୍ଷେପଣ।', eventEn: 'Flawless liftoff from Satish Dhawan Space Centre.' },
      { date: '01 Aug 2023', eventOr: 'ଟ୍ରାନ୍ସ-ଲୁନାର୍ ଇଞ୍ଜେକ୍ସନ୍ (TLI) ଦ୍ୱାରା ଚନ୍ଦ୍ର ଅଭିମୁଖେ ଯାତ୍ରା।', eventEn: 'Trans-Lunar Injection slingshots spacecraft toward Moon.' },
      { date: '05 Aug 2023', eventOr: 'ଚନ୍ଦ୍ର କକ୍ଷପଥରେ ସଫଳ ପ୍ରବେଶ (Lunar Orbit Insertion)।', eventEn: 'Lunar Orbit Insertion captures spacecraft into lunar orbit.' },
      { date: '23 Aug 2023', eventOr: 'ଦକ୍ଷିଣ ମେରୁରେ ଐତିହାସିକ ସଫ୍ଟ ଲ୍ୟାଣ୍ଡିଂ (Shiv Shakti Point)।', eventEn: 'Historic touchdown at Shiv Shakti Point at 18:04 IST.' },
      { date: '04 Sep 2023', eventOr: 'ବିକ୍ରମ ଲ୍ୟାଣ୍ଡରର ଚମତ୍କାର "ହପ୍ ଏକ୍ସପେରିମେଣ୍ଟ" (୪୦ ସେମି ଉପରକୁ ଉଠି ପୁନଃ ଅବତରଣ)।', eventEn: 'Vikram conducts successful hop test, firing thrusters to elevate 40 cm.' }
    ],

    specs: {
      spacecraftMassKg: '3,900 kg (Lander: 1,752 kg, Rover: 26 kg, Propulsion: 2,148 kg)',
      powerOutputWatts: 'Lander: 738 W, Rover: 50 W (Solar)',
      missionDuration: '1 Lunar Day (14 Earth Days) Primary Mission',
      primaryDiscoveryOr: 'ଚନ୍ଦ୍ର ମାଟିର ଚରମ ତାପ ଅନ୍ତରକ୍ଷଣ (Thermal Insulation) ଏବଂ ପ୍ରଥମ ଥର ଇନ୍-ସିଟୁ ସଲଫର୍ ଆବିଷ୍କାର।',
      primaryDiscoveryEn: 'Discovered extreme steep thermal gradient in lunar regolith and confirmed in-situ presence of sulfur.'
    }
  },

  AdityaL1: {
    id: 'AdityaL1',
    nameOr: 'ଆଦିତ୍ୟ-L1 (Aditya-L1)',
    nameEn: 'Aditya-L1 (India\'s Solar Observatory at Sun-Earth L1)',
    agency: 'ISRO',
    target: 'Sun',
    launchDate: '02 September 2023, 11:50 IST',
    launchVehicle: 'PSLV-C57 (XL Configuration)',
    launchSite: 'SDSC SHAR, Sriharikota, India',
    status: 'Operational / Active',
    costUSD: '$48 Million',
    costINR: '₹400 Crores',
    orbitType: 'Halo Orbit around Sun-Earth Lagrange Point 1 (L1)',
    distanceFromEarth: '1.5 Million km',
    signalDelay: '5.0 Seconds',
    themeColor: '#f59e0b',
    gradientBg: 'from-amber-950/70 via-orange-950/40 to-[#02040a]',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '☀️',

    headlineOr: 'ଭାରତର ପ୍ରଥମ ସୂର୍ଯ୍ୟ ଅଭିଯାନ—ପୃଥିବୀ ଠାରୁ ୧.୫ ନିୟୁତ କିମି ଦୂର L1 ପଏଣ୍ଟରୁ ୨୪ ଘଣ୍ଟିଆ ସୌର ନିରୀକ୍ଷଣ!',
    headlineEn: 'India First Solar Mission Stationed in a Halo Orbit around Sun-Earth Lagrange Point 1.',
    summaryOr: 'ପୃଥିବୀ ଓ ସୂର୍ଯ୍ୟ ମଧ୍ୟରେ ଥିବା ମାଧ୍ୟାକର୍ଷଣ ସନ୍ତୁଳନ ବିନ୍ଦୁ (Lagrange Point 1) ରେ ଅବସ୍ଥାପିତ ହୋଇ ଆଦିତ୍ୟ-L1 ସୂର୍ଯ୍ୟଙ୍କ କରୋନାଲ୍ ମାସ୍ ଇଜେକ୍ସନ୍ (CME), ସୌର ଝଡ଼ ଓ କରୋନାଲ୍ ହିଟିଂ ରହସ୍ୟ ଉନ୍ମୋଚନ କରୁଛି। ଏଠାରେ କୌଣସି ଗ୍ରହଣ ଲାଗେ ନାହିଁ, ତେଣୁ ବର୍ଷ ତମାମ ୩୬୫ ଦିନ ଅବିରତ ସୂର୍ଯ୍ୟଙ୍କ ଉପରେ ନଜର ରଖିଥାଏ।',
    summaryEn: 'Positioned at the Sun-Earth L1 Lagrange point 1.5 million kilometers from Earth, Aditya-L1 enjoys an uninterrupted view of the Sun without any eclipses or occultations. Its seven payloads study the solar photosphere, chromosphere, and uppermost corona.',

    payloads: [
      {
        name: 'VELC',
        fullName: 'Visible Emission Line Coronagraph',
        objectiveOr: 'କରୋନାର ଆଭ୍ୟନ୍ତରୀଣ ସ୍ତରର ଚିତ୍ର ଉତ୍ତୋଳନ ଏବଂ କରୋନାଲ୍ ମାସ୍ ଇଜେକ୍ସନ୍ (CME) ର ଉତ୍ପତ୍ତି ମାପ।',
        objectiveEn: 'Optical coronagraph imaging solar corona close to the solar limb with spectroscopy and polarimetry.'
      },
      {
        name: 'SUIT',
        fullName: 'Solar Ultraviolet Imaging Telescope',
        objectiveOr: 'ଅଲ୍ଟ୍ରା-ଭାୟୋଲେଟ୍ ତରଙ୍ଗରେ ସୂର୍ଯ୍ୟଙ୍କ ଫୋଟୋସ୍ଫିୟର୍ ଓ କ୍ରୋମୋସ୍ଫିୟର୍ ର ଅତି-ଉଚ୍ଚ ରେଜୋଲ୍ୟୁସନ୍ ଫଟୋ ଉତ୍ତୋଳନ।',
        objectiveEn: 'Captures full-disk images of the Sun in 200-400 nm UV wavelengths to study dynamic chromospheric heating.'
      },
      {
        name: 'ASPEX & PAPA',
        fullName: 'Aditya Solar wind Particle Experiment & Plasma Analyser',
        objectiveOr: 'ସୌର ବାୟୁର ପ୍ରୋଟନ୍ ଓ ଆଲଫା କଣିକାର ଶକ୍ତି ବଣ୍ଟନ ଏବଂ ପ୍ଲାଜ୍ମା ତାପମାତ୍ରା ମାପ।',
        objectiveEn: 'Directly samples solar wind ions and electrons to understand interplanetary coronal shocks.'
      },
      {
        name: 'SoLEXS & HEL1OS',
        fullName: 'Solar Low / High Energy X-ray Spectrometer',
        objectiveOr: 'ସୌର ଫ୍ଲେୟାର୍ସ (Solar Flares) ର ଏକ୍ସ-ରେ ବିକିରଣ ମାପି କଣିକା ତ୍ୱରଣ ରହସ୍ୟ ଖୋଜେ।',
        objectiveEn: 'Monitors soft and hard X-ray emissions from solar flares to track impulsive magnetic reconnection.'
      }
    ],

    timeline: [
      { date: '02 Sep 2023', eventOr: 'PSLV-C57 ରକେଟ୍ ଦ୍ୱାରା ନିର୍ଭୁଲ ଉତକ୍ଷେପଣ।', eventEn: 'Launch from Sriharikota into elliptical parking orbit.' },
      { date: '19 Sep 2023', eventOr: 'ଟ୍ରାନ୍ସ-ଲାଗ୍ରାଞ୍ଜିଆନ୍ ୧ ଇଞ୍ଜେକ୍ସନ୍ (TL1I)।', eventEn: 'Trans-Lagrangian Point 1 insertion burn completed.' },
      { date: '06 Jan 2024', eventOr: 'L1 ପଏଣ୍ଟର ହାଲୋ କକ୍ଷପଥରେ ଐତିହାସିକ ପ୍ରବେଶ (Halo Orbit Insertion)।', eventEn: 'Successfully enters final halo orbit at Sun-Earth L1.' },
      { date: 'May 2024', eventOr: 'ସବୁଠାରୁ ଶକ୍ତିଶାଳୀ X-କ୍ଲାସ୍ ସୌର ଝଡ଼ର ଲାଇଭ୍ ଡାଟା ରେକର୍ଡ।', eventEn: 'Records extreme X-class solar storm and historic space weather events.' }
    ],

    specs: {
      spacecraftMassKg: '1,475 kg',
      powerOutputWatts: '500 W (Gallium Arsenide Solar Panels)',
      missionDuration: '5 Years Design Life',
      primaryDiscoveryOr: 'ସୌର ଝଡ଼ର ପ୍ରାକ୍-ଚେତାବନୀ (Early Warning) ଏବଂ ସୂର୍ଯ୍ୟଙ୍କ ଫୋଟୋସ୍ଫିୟର୍ର ଅଭୂତପୂର୍ବ UV ଚିତ୍ର।',
      primaryDiscoveryEn: 'Continuous real-time coronal mass ejection telemetry providing early warning for terrestrial satellite grids.'
    }
  },

  Mangalyaan: {
    id: 'Mangalyaan',
    nameOr: 'ମଙ୍ଗଳଯାନ (Mangalyaan - MOM)',
    nameEn: 'Mars Orbiter Mission (MOM - Mangalyaan)',
    agency: 'ISRO',
    target: 'Mars',
    launchDate: '05 November 2013, 14:38 IST',
    launchVehicle: 'PSLV-XL C25',
    launchSite: 'SDSC SHAR, Sriharikota, India',
    status: 'Completed',
    costUSD: '$74 Million (Cheaper than Hollywood Movie Gravity!)',
    costINR: '₹450 Crores',
    orbitType: 'Mars Highly Elliptical Orbit (421 km × 76,993 km)',
    distanceFromEarth: '225 Million km (Average)',
    signalDelay: '12.5 to 22.0 Minutes',
    themeColor: '#ef4444',
    gradientBg: 'from-red-950/70 via-rose-950/40 to-[#02040a]',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: '♂',

    headlineOr: 'ବିଶ୍ୱର ପ୍ରଥମ ପ୍ରୟାସରେ ମଙ୍ଗଳ କକ୍ଷପଥ ବିଜୟ—ଏସିଆର ପ୍ରଥମ ମଙ୍ଗଳ ଅଭିଯାନ!',
    headlineEn: 'World Record: First Nation to Succeed on Its Maiden Attempt at Mars.',
    summaryOr: 'ଭାରତୀୟ ମହାକାଶ ଗବେଷଣା ସଂସ୍ଥା (ISRO) ମାତ୍ର ୪୫୦ କୋଟି ଟଙ୍କା ବ୍ୟୟରେ (ହଲିଉଡ୍ ସିନେମା "ଗ୍ରାଭିଟି" ଠାରୁ କମ୍ ଖର୍ଚ୍ଚରେ!) ପ୍ରଥମ ପ୍ରୟାସରେ ହିଁ ମଙ୍ଗଳ ଗ୍ରହର କକ୍ଷପଥରେ ପହଞ୍ଚି ବିଶ୍ୱ ରେକର୍ଡ ସୃଷ୍ଟି କରିଥିଲା। ୬ ମାସ ପାଇଁ ଡିଜାଇନ୍ ହୋଇଥିବା ଏହି ଯାନ ଦୀର୍ଘ ୮ ବର୍ଷ ଧରି ମଙ୍ଗଳ ଗ୍ରହର ହଜାର ହଜାର ଚମତ୍କାର ପୂର୍ଣ୍ଣ-ଡିସ୍କ ଫଟୋ ଓ ବାୟୁମଣ୍ଡଳୀୟ ତଥ୍ୟ ପ୍ରଦାନ କରିଥିଲା।',
    summaryEn: 'India launched Mangalyaan on November 5, 2013, reaching Mars orbit on September 24, 2014. Built on an austere budget of $74 million, MOM completed 8 years of operational science—surpassing its planned 6-month lifespan by 16 times—and captured whole-disk color images of the Red Planet and its moon Phobos.',

    payloads: [
      {
        name: 'MCC',
        fullName: 'Mars Colour Camera',
        objectiveOr: 'ମଙ୍ଗଳ ଗ୍ରହର ଧୂଳି ଝଡ଼, ଧ୍ରୁବୀୟ ବରଫ ଟୋପି ଓ ଫୋବୋସ୍ ଉପଗ୍ରହର ଚମତ୍କାର ରଙ୍ଗୀନ ଚିତ୍ର ଉତ୍ତୋଳନ କଲା।',
        objectiveEn: 'Tricolor camera capturing full-globe views of Mars and dynamic dust storms in visible wavelengths.'
      },
      {
        name: 'MSM',
        fullName: 'Methane Sensor for Mars',
        objectiveOr: 'ମଙ୍ଗଳ ବାୟୁମଣ୍ଡଳରେ ଜୀବନର ସଙ୍କେତ ସଦୃଶ ମିଥେନ୍ ଗ୍ୟାସ୍ର ସନ୍ଧାନ।',
        objectiveEn: 'Designed to detect trace methane down to parts-per-billion levels to search for potential biogenic sources.'
      },
      {
        name: 'MENCA',
        fullName: 'Mars Exospheric Neutral Composition Analyser',
        objectiveOr: 'ମଙ୍ଗଳ ଗ୍ରହର ଉପର ବାୟୁମଣ୍ଡଳୀୟ ଗ୍ୟାସ୍ ଗଠନ ଓ ଘନତ୍ୱ ମାପ।',
        objectiveEn: 'Quadrupole mass spectrometer analyzing neutral composition of the Martian upper exosphere.'
      }
    ],

    timeline: [
      { date: '05 Nov 2013', eventOr: 'ଶ୍ରୀହରିକୋଟାରୁ PSLV-XL ଦ୍ୱାରା ଉତକ୍ଷେପଣ।', eventEn: 'Launched into Earth elliptical orbit.' },
      { date: '01 Dec 2013', eventOr: 'ଟ୍ରାନ୍ସ-ମାର୍ସ ଇଞ୍ଜେକ୍ସନ୍ (TMI) ଦ୍ୱାରା ମଙ୍ଗଳ ଅଭିମୁଖେ ଯାତ୍ରା।', eventEn: 'Trans-Mars Injection propels spacecraft toward interplanetary trajectory.' },
      { date: '24 Sep 2014', eventOr: 'ମଙ୍ଗଳ କକ୍ଷପଥରେ ଐତିହାସିକ ପ୍ରବେଶ (Mars Orbit Insertion)।', eventEn: 'Historic orbit insertion captures India into Martian orbit on first attempt.' },
      { date: 'Oct 2022', eventOr: '୮ ବର୍ଷର ନିରନ୍ତର ସେବା ପରେ ବ୍ୟାଟେରୀ ଶେଷ ହୋଇ ମିଶନ୍ ସମାପ୍ତ।', eventEn: 'Mission officially concluded after 8 years of continuous science returns.' }
    ],

    specs: {
      spacecraftMassKg: '1,337 kg (Dry mass: 500 kg, Propellant: 852 kg)',
      powerOutputWatts: '840 W (Three Solar Panels)',
      missionDuration: 'Planned 6 Months; Operated 8 Years (2,932 Days)',
      primaryDiscoveryOr: 'ମଙ୍ଗଳ ଗ୍ରହର ସମ୍ପୂର୍ଣ୍ଣ ଗ୍ଲୋବାଲ୍ ଆଟଲାସ୍ ଏବଂ ମଙ୍ଗଳ ବାୟୁମଣ୍ଡଳ କ୍ଷୟୀକରଣ (Atmospheric Escape) ର ପ୍ରମାଣ।',
      primaryDiscoveryEn: 'Produced comprehensive Mars color atlas and observed seasonal polar ice recession and global dust storms.'
    }
  },

  JWST: {
    id: 'JWST',
    nameOr: 'ଜେମ୍ସ ୱେବ୍ ସ୍ପେସ୍ ଟେଲିସ୍କୋପ୍ (JWST)',
    nameEn: 'James Webb Space Telescope (NASA / ESA / CSA)',
    agency: 'NASA-ESA',
    target: 'Deep Space',
    launchDate: '25 December 2021, 12:20 UTC',
    launchVehicle: 'Ariane 5 ECA',
    launchSite: 'Kourou, French Guiana',
    status: 'Operational / Active',
    costUSD: '$10 Billion',
    orbitType: 'Halo Orbit around Sun-Earth Lagrange Point 2 (L2)',
    distanceFromEarth: '1.5 Million km',
    signalDelay: '5.0 Seconds',
    themeColor: '#eab308',
    gradientBg: 'from-yellow-950/70 via-amber-950/40 to-[#02040a]',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: '🔭',

    headlineOr: 'ମାନବ ଇତିହାସର ସର୍ବବୃହତ ଓ ସର୍ବାଧିକ ଶକ୍ତିଶାଳୀ ମହାକାଶ ଟେଲିସ୍କୋପ୍—୧୩.୪ ବିଲିୟନ ବର୍ଷ ପଛକୁ ଦେଖିବାର ଅଦ୍ଭୁତ କ୍ଷମତା!',
    headlineEn: 'The Premier Space Observatory Unraveling the Earliest Stars and Exoplanet Atmospheres.',
    summaryOr: '୬.୫ ମିଟର ସୁନା-ଆସ୍ତରଣ ବିଶିଷ୍ଟ ବେରିଲିୟମ୍ ଦର୍ପଣ ଏବଂ ଟେନିସ୍ କୋର୍ଟ ଆକାରର ୫-ସ୍ତରୀୟ ସନ୍-ସିଲ୍ଡ୍ ସହିତ JWST ପୃଥିବୀ ଠାରୁ ୧୫ ଲକ୍ଷ କିମି ଦୂର L2 ପଏଣ୍ଟରେ ଅବସ୍ଥିତ। ଏହା ଇନ୍‌ଫ୍ରାରେଡ୍ ଆଲୋକରେ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ପରବର୍ତ୍ତୀ ପ୍ରଥମ ଗାଲାକ୍ସି (z > 13) ଏବଂ ବାହ୍ୟ ଗ୍ରହଗୁଡ଼ିକର ବାୟୁମଣ୍ଡଳରେ ଜଳୀୟ ବାଷ୍ପ ଓ ମିଥେନ୍ର ସନ୍ଧାନ ପାଇଛି।',
    summaryEn: 'Equipped with a 6.5-meter gold-coated primary mirror and an origami-deployed five-layer tennis-court-sized sunshield, JWST operates at Sun-Earth L2. Operating at cryogenic temperatures below 50 K, it pierces cosmic dust to image galaxies formed just 300 million years after the Big Bang and characterize exoplanet atmospheres.',

    payloads: [
      {
        name: 'NIRCam',
        fullName: 'Near-Infrared Camera',
        objectiveOr: 'ପ୍ରଥମ ତାରକା ଓ ଗାଲାକ୍ସିର ଅତି-ଗଭୀର ଚିତ୍ର ଉତ୍ତୋଳନ (Deep Field Imaging)।',
        objectiveEn: 'Detects light from earliest stars and galaxies in 0.6 to 5 micron infrared wavelengths.'
      },
      {
        name: 'MIRI',
        fullName: 'Mid-Infrared Instrument',
        objectiveOr: 'ଅତି-ଶୀତଳ (୭ କେଲଭିନ୍) ମିଡ୍-ଇନ୍‌ଫ୍ରାରେଡ୍ ରେ ଧୂଳି ଆଚ୍ଛାଦିତ ନକ୍ଷତ୍ର ଜନ୍ମ କ୍ଷେତ୍ରର ଚିତ୍ରଣ।',
        objectiveEn: 'Cooled to 6.7 K by a closed-cycle helium cryocooler to image distant cold Kuiper belt objects.'
      },
      {
        name: 'NIRSpec',
        fullName: 'Near-Infrared Spectrograph',
        objectiveOr: 'ଏକକାଳୀନ ୧୦୦ଟି ଦୂରବର୍ତ୍ତୀ ଗାଲାକ୍ସିର ଆଲୋକ ବିଶ୍ଳେଷଣ ପାଇଁ ମାଇକ୍ରୋ-ସଟର୍ ଆରେ।',
        objectiveEn: 'Microshutter array enabling simultaneous multi-object spectroscopy of 100 deep-space galaxies.'
      }
    ],

    timeline: [
      { date: '25 Dec 2021', eventOr: 'କୋଉରୋରୁ ଆରିଆନ୍ ୫ ରକେଟ୍ ଦ୍ୱାରା ଉତକ୍ଷେପଣ।', eventEn: 'Launched on Christmas Day aboard Ariane 5.' },
      { date: 'Jan 2022', eventOr: 'ମହାକାଶରେ ସୁନାର ଦର୍ପଣ ଓ ସନ୍-ସିଲ୍ଡ୍ ସଫଳତାର ସହ ଖୋଲିଲା।', eventEn: 'Flawless autonomous deployment of 18 hexagonal primary mirror segments.' },
      { date: 'Jul 2022', eventOr: 'ପ୍ରଥମ ଗଭୀର ମହାକାଶ ରଙ୍ଗୀନ ଚିତ୍ର (Webb Deep Field SMACS 0723) ପ୍ରକାଶ।', eventEn: 'President Biden unveils first full-color deep field image.' },
      { date: '2023 - 2024', eventOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ର ମାତ୍ର ୨୯୦ ନିୟୁତ ବର୍ଷ ପରର ଗାଲାକ୍ସି (JADES-GS-z14-0) ଆବିଷ୍କାର।', eventEn: 'Discovered earliest confirmed galaxy JADES-GS-z14-0 at redshift z=14.32.' }
    ],

    specs: {
      spacecraftMassKg: '6,161 kg',
      powerOutputWatts: '2,000 W (Solar Array)',
      missionDuration: '20+ Years Fuel Lifetime (Extended by precise launch)',
      primaryDiscoveryOr: 'ଜେଡ୍ = ୧୪.୩୨ ରେଡ୍‌ସିଫ୍ଟ୍ରେ ସର୍ବପ୍ରାଚୀନ ଗାଲାକ୍ସି ଏବଂ K2-18b ଏକ୍ସୋପ୍ଲାନେଟ୍ରେ କାର୍ବନ୍ ଯୌଗିକ ଚିହ୍ନଟ।',
      primaryDiscoveryEn: 'Confirmed galaxies at z=14.32 and detected atmospheric carbon molecules (CH4, CO2) on habitable-zone sub-Neptunes.'
    }
  },

  Voyager: {
    id: 'Voyager',
    nameOr: 'ଭୋଏଜର୍ ୧ ଓ ୨ (Voyager 1 & 2)',
    nameEn: 'Voyager 1 & 2 (Interstellar Space Explorers)',
    agency: 'NASA',
    target: 'Deep Space',
    launchDate: '1977 (Voyager 2: Aug 20, Voyager 1: Sep 5)',
    launchVehicle: 'Titan IIIE-Centaur',
    launchSite: 'Cape Canaveral, Florida, USA',
    status: 'Operational / Active',
    costUSD: '$865 Million (Adjusted)',
    orbitType: 'Hyperbolic Solar Escape Trajectory (Interstellar Space)',
    distanceFromEarth: 'Voyager 1: 24.4 Billion km (163 AU) • Farthest Human Object',
    signalDelay: '22 Hours 35 Minutes (Each Way)',
    themeColor: '#8b5cf6',
    gradientBg: 'from-purple-950/70 via-indigo-950/40 to-[#02040a]',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🛸',

    headlineOr: 'ମାନବଜାତିର ସବୁଠାରୁ ଦୂରତମ ବସ୍ତୁ—ସୌରମଣ୍ଡଳ ସୀମା ପାର୍ କରି ଅଜ୍ଞାତ ଇଣ୍ଟରଷ୍ଟେଲାର୍ ସ୍ପେସ୍‌ରେ ଯାତ୍ରାରତ!',
    headlineEn: 'The Farthest Human-Made Objects in History, Traveling Across Interstellar Space.',
    summaryOr: '୧୯୭୭ରେ ଉତକ୍ଷେପିତ ଭୋଏଜର୍-୧ ଏବଂ ଭୋଏଜର୍-୨ ବୃହସ୍ପତି, ଶନି, ୟୁରେନସ୍ ଓ ନେପଚ୍ୟୁନ୍ର ପ୍ରଥମ ନିକଟତର ଚିତ୍ର ପ୍ରଦାନ କରିଥିଲେ। ୨୦୧୨ରେ ଭୋଏଜର୍-୧ ହେଲିଓପଜ୍ (ସୂର୍ଯ୍ୟଙ୍କ ଚୁମ୍ବକୀୟ ପ୍ରଭାବ ସୀମା) ପାର୍ କରି ପ୍ରଥମ ଥର ଇଣ୍ଟରଷ୍ଟେଲାର୍ ସ୍ପେସ୍ ଭିତରକୁ ପ୍ରବେଶ କଲା। ଏଥିରେ ଏକ "ଗୋଲ୍ଡେନ୍ ରେକର୍ଡ" (Golden Record) ରହିଛି ଯେଉଁଥିରେ ପୃଥିବୀର ୫୫ଟି ଭାଷାରେ ଶୁଭେଚ୍ଛା, ସଙ୍ଗୀତ ଓ ମାନବଜାତିର ପରିଚୟ ଲିପିବଦ୍ଧ ଅଛି!',
    summaryEn: 'Launched in 1977, the twin Voyager probes completed the "Grand Tour" of the outer planets. In August 2012, Voyager 1 crossed the heliopause into interstellar space at 121 AU, followed by Voyager 2 in 2018. Powered by Plutonium-238 Radioisotope Thermoelectric Generators (RTGs), they continue transmitting data across 24 billion kilometers.',

    payloads: [
      {
        name: 'Golden Record',
        fullName: 'The Voyager Interstellar Record',
        objectiveOr: 'ଅନ୍ୟ ଗାଲାକ୍ସିର ପ୍ରାଣୀଙ୍କ ପାଇଁ ପୃଥିବୀର ୫୫ ଭାଷାରେ ସ୍ୱର, ବର୍ଷା, ସମୁଦ୍ରର ଶବ୍ଦ, ଶ୍ରୀ କୃଷ୍ଣ ବଂଶୀ ଓ ମାନବଜାତିର ବାର୍ତ୍ତା।',
        objectiveEn: 'Gold-plated copper phonograph record containing sounds of Earth, 115 images, and greetings in 55 human languages.'
      },
      {
        name: 'CRS & MAG',
        fullName: 'Cosmic Ray Subsystem & Triaxial Fluxgate Magnetometer',
        objectiveOr: 'ସୌର ବାୟୁର ଶେଷ ସୀମା ଏବଂ ନକ୍ଷତ୍ରାନ୍ତରୀୟ ବ୍ରହ୍ମାଣ୍ଡୀୟ କିରଣର ଶକ୍ତି ମାପୁଛି।',
        objectiveEn: 'Directly measures galactic cosmic ray flux and interstellar magnetic field vector.'
      }
    ],

    timeline: [
      { date: 'Aug-Sep 1977', eventOr: '୧୭୬ ବର୍ଷରେ ଥରେ ହେଉଥିବା ଗ୍ରହ ସମନ୍ୱୟର ସୁଯୋଗ ନେଇ ଉତକ୍ଷେପଣ।', eventEn: 'Launched to exploit rare planetary alignment occurring once every 176 years.' },
      { date: '1979 - 1989', eventOr: 'ବୃହସ୍ପତି, ଶନି, ୟୁରେନସ୍ ଓ ନେପଚ୍ୟୁନ୍ର ଐତିହାସିକ ଫ୍ଲାଇବାଏ।', eventEn: 'Completed historic flybys of all four gas and ice giant outer planets.' },
      { date: '14 Feb 1990', eventOr: 'ପୃଥିବୀର ପ୍ରସିଦ୍ଧ "ପେଲ୍ ବ୍ଲୁ ଡଟ୍" (Pale Blue Dot) ଫଟୋ ଉତ୍ତୋଳନ।', eventEn: 'Turned camera backwards to capture iconic Pale Blue Dot portrait of Earth from 6 billion km.' },
      { date: '25 Aug 2012', eventOr: 'ଇତିହାସରେ ପ୍ରଥମ ଥର ଇଣ୍ଟରଷ୍ଟେଲାର୍ ସ୍ପେସ୍‌ରେ ଭୋଏଜର୍-୧ ର ପ୍ରବେଶ।', eventEn: 'Voyager 1 officially crosses the heliopause into pristine interstellar space.' }
    ],

    specs: {
      spacecraftMassKg: '773 kg',
      powerOutputWatts: 'RTG Nuclear Power (Originally 470 W, currently ~220 W)',
      missionDuration: '47+ Years and Still Operating (Since 1977!)',
      primaryDiscoveryOr: 'ଆୟୋର ଆଗ୍ନେୟଗିରି, ୟୁରୋପାର ତରଳ ସାଗର, ଏବଂ ସୌରମଣ୍ଡଳ ବାହାରେ ଇଣ୍ଟରଷ୍ଟେଲାର୍ ପ୍ଲାଜ୍ମା।',
      primaryDiscoveryEn: 'Discovered active volcanism on Io, deep oceans on Europa, and the boundary of the solar bubble.'
    }
  },

  Gaganyaan: {
    id: 'Gaganyaan',
    nameOr: 'ଗଗନଯାନ (Gaganyaan - Human Spaceflight)',
    nameEn: 'Gaganyaan (India\'s Manned Spaceflight Mission)',
    agency: 'ISRO',
    target: 'Earth',
    launchDate: '2025 - 2026 (Orbital Demonstration)',
    launchVehicle: 'Human Rated LVM3 (HLVM3)',
    launchSite: 'SDSC SHAR, Sriharikota, India',
    status: 'Upcoming',
    costUSD: '$1.1 Billion',
    costINR: '₹9,023 Crores',
    orbitType: 'Low Earth Orbit (LEO) at 400 km Altitude (51.6° Inclination)',
    distanceFromEarth: '400 km',
    signalDelay: '0.0013 Seconds (Instantaneous)',
    themeColor: '#10b981',
    gradientBg: 'from-emerald-950/70 via-teal-950/40 to-[#02040a]',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '👨‍🚀',

    headlineOr: 'ଭାରତର ପ୍ରଥମ ମାନବ ମହାକାଶ ଯାତ୍ରା—୩ ଜଣ ଭାରତୀୟ ମହାକାଶଚାରୀ ୪୦୦ କିମି କକ୍ଷପଥରେ ୩ ଦିନ ରହିବେ!',
    headlineEn: 'India First Indigenous Human Spaceflight Program Carrying Vyomanauts into Low Earth Orbit.',
    summaryOr: 'ଗଗନଯାନ କାର୍ଯ୍ୟକ୍ରମ ଅଧୀନରେ ୩ ଜଣ ଭାରତୀୟ ମହାକାଶଚାରୀ (Vyomanauts) ଙ୍କୁ ୪୦୦ କିମି ଉଚ୍ଚତା ବିଶିଷ୍ଟ ପୃଥିବୀ କକ୍ଷପଥକୁ ପଠାଯିବ ଏବଂ ୩ ଦିନ ପରେ ସୁରକ୍ଷିତ ଭାବେ ଭାରତ ମହାସାଗରରେ ଅବତରଣ କରାଯିବ। ଏହି ମିଶନ୍ ପାଇଁ ISRO "ବ୍ୟୋମମିତ୍ର" (Vyommitra) ନାମକ ମହିଳା ରୋବୋଟ୍ ବିକଶିତ କରିଛି ଯାହା ମାନବବିହୀନ ଟେଷ୍ଟ୍ ଉଡ଼ାଣରେ ଯାତ୍ରା କରିବ। ଏହା ସହିତ ଭାରତ ବିଶ୍ୱର ୪ର୍ଥ ମାନବ-ମହାକାଶଯାନ ଉତକ୍ଷେପଣକାରୀ ରାଷ୍ଟ୍ର ହେବ।',
    summaryEn: 'The Gaganyaan program envisions sending a 3-member crew of Indian Air Force test pilots (designated "Vyomanauts") to a 400 km circular orbit for 3 days and returning them safely to Indian waters. Precursor uncrewed flights carry the AI-powered female humanoid robot "Vyommitra" to test environmental control and life support systems (ECLSS).',

    payloads: [
      {
        name: 'Crew Module (CM)',
        fullName: 'Habitable Crew Capsule with Environmental Control & Life Support',
        objectiveOr: 'ଅମ୍ଳଜାନ, ଚାପ ଓ ତାପମାତ୍ରା ନିୟନ୍ତ୍ରଣ କରି ମହାକାଶଚାରୀଙ୍କୁ ପୃଥିବୀ ଭଳି ଜୀବନଧାରଣ ପରିବେଶ ପ୍ରଦାନ କରେ।',
        objectiveEn: 'Pressurized double-walled capsule featuring nitrogen-oxygen atmospheric control and bio-waste management.'
      },
      {
        name: 'CES & TV-D1',
        fullName: 'Crew Escape System & Test Vehicle Demonstration',
        objectiveOr: 'ରକେଟ୍ ବିପର୍ଯ୍ୟୟ ଘଟିଲେ ମିଲିସେକେଣ୍ଡ୍ ଭିତରେ କ୍ରୁ-ମଡ୍ୟୁଲ୍ କୁ ନିରାପଦ ଦୂରତାକୁ ନେଇଯିବ।',
        objectiveEn: 'High-thrust solid abort motors capable of pulling the crew module away during catastrophic ascent failures.'
      },
      {
        name: 'Vyommitra',
        fullName: 'AI-Powered Humanoid Robot Spacefarer',
        objectiveOr: 'କକ୍ଷପଥରେ ମଣିଷର ଶ୍ୱାସକ୍ରିୟା, ରକ୍ତଚାପ ଓ ସ୍ୱିଚ୍ ପ୍ୟାନେଲ୍ ପରିଚାଳନା ପରୀକ୍ଷଣ କରେ।',
        objectiveEn: 'Half-humanoid robot equipped to monitor capsule parameters, operate switches, and simulate human physiology.'
      }
    ],

    timeline: [
      { date: '21 Oct 2023', eventOr: 'ଟିଭି-ଡି୧ (TV-D1) କ୍ରୁ ଏସ୍କେପ୍ ସିଷ୍ଟମର ସଫଳ ଟେଷ୍ଟ୍ ଫ୍ଲାଇଟ୍।', eventEn: 'TV-D1 test flight validates in-flight abort and drogue parachute splashdown.' },
      { date: 'Feb 2024', eventOr: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ମୋଦୀଙ୍କ ଦ୍ୱାରା ୪ ଜଣ ବ୍ୟୋମନଟ୍ ମହାକାଶଚାରୀଙ୍କ ନାମ ଘୋଷଣା।', eventEn: 'Prime Minister Modi pins astronaut wings on 4 designated IAF Vyomanauts.' },
      { date: '2025 (Target)', eventOr: 'ବ୍ୟୋମମିତ୍ର ରୋବୋଟ୍ ସହିତ ମାନବବିହୀନ କକ୍ଷପଥ ଉଡ଼ାଣ।', eventEn: 'Uncrewed orbital test flight carrying humanoid Vyommitra.' },
      { date: '2025-2026', eventOr: '୩ ଜଣ ମହାକାଶଚାରୀଙ୍କ ସହିତ ଐତିହାସିକ ପ୍ରଥମ ମାନବ ଉଡ଼ାଣ (Manned Mission)।', eventEn: 'First crewed orbital mission establishing India human spaceflight independence.' }
    ],

    specs: {
      spacecraftMassKg: '8,200 kg (Crew Module: 5,300 kg, Service Module: 2,900 kg)',
      powerOutputWatts: '3,000 W (Solar PV Panels)',
      missionDuration: '3 Days in Low Earth Orbit',
      primaryDiscoveryOr: 'ସ୍ୱଦେଶୀ ମାନବ ଜୀବନ ସହାୟକ ପ୍ରଣାଳୀ (ECLSS) ଏବଂ ସମୁଦ୍ରରୁ ନିରାପଦ ଉଦ୍ଧାର କୌଶଳ।',
      primaryDiscoveryEn: 'Independent national human spaceflight capability, docking mechanisms, and orbital habitat control.'
    }
  },

  EuropaClipper: {
    id: 'EuropaClipper',
    nameOr: 'ୟୁରୋପା କ୍ଲିପର୍ (Europa Clipper)',
    nameEn: 'NASA Europa Clipper (Ocean World Habitability)',
    agency: 'NASA',
    target: 'Jupiter',
    launchDate: '14 October 2024, 12:06 EDT',
    launchVehicle: 'SpaceX Falcon Heavy',
    launchSite: 'KSC LC-39A, Florida, USA',
    status: 'En Route',
    costUSD: '$5.2 Billion',
    orbitType: 'Jupiter Orbit with 49 Close Flybys of Europa (as low as 25 km)',
    distanceFromEarth: '778 Million km (At Jupiter Arrival 2030)',
    signalDelay: '45 to 52 Minutes (Each Way)',
    themeColor: '#38bdf8',
    gradientBg: 'from-sky-950/70 via-blue-950/40 to-[#02040a]',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: '🌊',

    headlineOr: 'ପୃଥିବୀ ବାହାରେ ଜୀବନର ସନ୍ଧାନ—ବୃହସ୍ପତିର ବରଫ ଉପଗ୍ରହ ୟୁରୋପାର ବିଶାଳ ସମୁଦ୍ର ଅଭିମୁଖେ ଯାତ୍ରାରତ!',
    headlineEn: 'NASA Flagship Mission Investigating Whether Europa Ocean Can Harbor Life.',
    summaryOr: '୧୪ ଅକ୍ଟୋବର ୨୦୨୪ ରେ ସ୍ପେସ୍-ଏକ୍ସ ଫାଲକନ୍ ହେଭି ରକେଟ୍ ଦ୍ୱାରା ଉତକ୍ଷେପିତ ହୋଇଥିବା ଏହି ବିରାଟ ମହାକାଶଯାନଟି (ନାସା ଦ୍ୱାରା ନିର୍ମିତ ସର୍ବବୃହତ ଯାନ—୩୦ ମିଟର ସୋଲାର୍ ୱିଙ୍ଗ୍ ସହିତ!) ୨.୯ ବିଲିୟନ କିମି ଯାତ୍ରା କରି ୨୦୩୦ ରେ ବୃହସ୍ପତି ପାଖରେ ପହଞ୍ଚିବ। ଏହା ୟୁରୋପାର ବରଫ ଆସ୍ତରଣ ତଳେ ଥିବା ୧୦୦ କିମି ଗଭୀର ଲବଣାକ୍ତ ମହାସାଗରରେ ଜୀବନର ରାସାୟନିକ ଉପାଦାନ ଖୋଜିବ।',
    summaryEn: 'Launched on October 14, 2024, Europa Clipper is the largest spacecraft NASA has ever built for an interplanetary planetary mission. Spanning over 30 meters with solar arrays deployed, it will enter Jupiter orbit in 2030 and conduct 49 low-altitude flybys down to 25 km to assess the astrobiological habitability of Europa subsurface global ocean.',

    payloads: [
      {
        name: 'REASON',
        fullName: 'Radar for Europa Assessment and Sounding: Ocean to Near-surface',
        objectiveOr: 'ବରଫ ଭେଦକାରୀ ଆଇସ୍-ପେନେଟ୍ରେଟିଂ ରାଡାର୍ ଯାହା ୩୦ କିମି ବରଫ ତଳକୁ ଦେଖି ସମୁଦ୍ର ମାପିବ।',
        objectiveEn: 'Dual-frequency ice-penetrating radar sounding ice shell thickness and subsurface brine pockets.'
      },
      {
        name: 'MASPEX',
        fullName: 'Mass Spectrometer for Planetary Exploration',
        objectiveOr: 'ବରଫରୁ ବାହାରୁଥିବା ଗିଜର୍ ବାଷ୍ପରେ ଆମିନୋ ଏସିଡ୍ ଓ ଜୈବିକ ଅଣୁ (Organics) ମାପିବ।',
        objectiveEn: 'High-resolution mass spectrometer analyzing volatile gases and organics vented through surface plumes.'
      },
      {
        name: 'Europa-UVS & EIS',
        fullName: 'Ultraviolet Spectrograph & Imaging System',
        objectiveOr: 'ୟୁରୋପା ପୃଷ୍ଠର ୦.୫ ମିଟର ରେଜୋଲ୍ୟୁସନ୍ ବିଶିଷ୍ଟ 3D ମାନଚିତ୍ର ପ୍ରସ୍ତୁତ କରିବ।',
        objectiveEn: 'Sub-meter surface topography and searches for active water-vapor geyser eruptions.'
      }
    ],

    timeline: [
      { date: '14 Oct 2024', eventOr: 'ଫାଲକନ୍ ହେଭି ରକେଟ୍ ଦ୍ୱାରା ନିର୍ଭୁଲ ଉତକ୍ଷେପଣ।', eventEn: 'Launched from Kennedy Space Center Pad 39A.' },
      { date: 'Feb 2025', eventOr: 'ମଙ୍ଗଳ ଗ୍ରହର ମାଧ୍ୟାକର୍ଷଣ ସହାୟତା (Mars Gravity Assist)।', eventEn: 'Gravity assist flyby around Mars.' },
      { date: 'Dec 2026', eventOr: 'ପୃଥିବୀର ମାଧ୍ୟାକର୍ଷଣ ସହାୟତା (Earth Gravity Assist)।', eventEn: 'Secondary gravity assist slingshot around Earth.' },
      { date: 'Apr 2030 (Target)', eventOr: 'ବୃହସ୍ପତି କକ୍ଷପଥରେ ପ୍ରବେଶ ଓ ୟୁରୋପା ଅନୁସନ୍ଧାନ।', eventEn: 'Jupiter Orbit Insertion followed by 49 close Europa science flybys.' }
    ],

    specs: {
      spacecraftMassKg: '6,000 kg (Fueled mass at launch)',
      powerOutputWatts: '700 W at Jupiter distance (Massive 30.5-meter solar arrays)',
      missionDuration: 'Cruising to 2030; Science operations through 2034',
      primaryDiscoveryOr: 'ୟୁରୋପାର ଭୂଗର୍ଭସ୍ଥ ମହାସାଗରରେ ଜୀବନଧାରଣ ପାଇଁ ଆବଶ୍ୟକ ଜଳ, ଶକ୍ତି ଓ ରାସାୟନିକ ଉପାଦାନ ଅଛି କି ନାହିଁ ନିର୍ଣ୍ଣୟ କରିବା।',
      primaryDiscoveryEn: 'Determining the thickness of Europa ice shell and searching for habitable hydrothermal environments.'
    }
  }
};
