export interface InteriorLayerDetail {
  id: string;
  nameOr: string;
  nameEn: string;
  depthRangeKm: string;
  topDepthKm: number;
  bottomDepthKm: number;
  thicknessKm: number;
  volumePercent: number;
  massPercent: number;
  tempRangeC: string;
  pressureRangeGpa: string;
  densityRangeGcm3: string;
  color: string;
  stateOfMatterOr: string;
  stateOfMatterEn: string;
  dominantMineralsOr: string;
  dominantMineralsEn: string;
  seismicPropertiesOr: string;
  seismicPropertiesEn: string;
  scientificNarrativeOr: string;
  scientificNarrativeEn: string;
  geodynamicRoleOr: string;
  geodynamicRoleEn: string;
}

export interface DeepMilestone {
  depthKm: number;
  nameOr: string;
  nameEn: string;
  category: 'borehole' | 'discontinuity' | 'mineral_phase' | 'core_boundary' | 'center';
  pressureGpa: number;
  tempC: number;
  descOr: string;
  descEn: string;
  icon: string;
}

export interface BulkEarthElement {
  name: string;
  symbol: string;
  wholeEarthPercent: number;
  crustPercent: number;
  corePercent: number;
  color: string;
  significanceOr: string;
  significanceEn: string;
}

// 1. 100% Real PREM (Preliminary Reference Earth Model - Dziewonski & Anderson, 1981) Layer Dossiers
export const DETAILED_INTERIOR_LAYERS: InteriorLayerDetail[] = [
  {
    id: 'crust',
    nameOr: 'ଭୂତ୍ୱକ୍ (Earth Crust - ମହାଦେଶୀୟ ଓ ସାମୁଦ୍ରିକ)',
    nameEn: 'Earth Crust (Continental & Oceanic)',
    depthRangeKm: '0 - 35 km (ମହାସାଗରରେ 5-10 km, ମହାଦେଶରେ 30-70 km)',
    topDepthKm: 0,
    bottomDepthKm: 35,
    thicknessKm: 35,
    volumePercent: 1.0,
    massPercent: 0.5,
    tempRangeC: '0°C ରୁ 500°C (ଭୂତାପୀୟ ଗ୍ରାଡିଏଣ୍ଟ: 25-30°C/km)',
    pressureRangeGpa: '0.0001 GPa ରୁ 1.0 GPa (1 ରୁ 10,000 atm)',
    densityRangeGcm3: '2.2 - 3.0 g/cm³ (ସାମୁଦ୍ରିକ ବାସାଲ୍ଟ: 3.0, ମହାଦେଶୀୟ ଗ୍ରାନାଇଟ୍: 2.7)',
    color: '#10b981',
    stateOfMatterOr: 'କଠିନ ବ୍ରିଟିଲ୍ ଶିଳା (Brittle Solid Rock)',
    stateOfMatterEn: 'Brittle, fractured solid silicate rock',
    dominantMineralsOr: 'ଫେଲ୍ଡସ୍ପାର୍, କ୍ୱାର୍ଟଜ୍, ଅଭ୍ର (Mica), ଆମ୍ଫିବୋଲ୍, ବାସାଲ୍ଟ ଓ ଗ୍ରାନାଇଟ୍। ମୁଖ୍ୟ ଉପାଦାନ ସିଆଲ୍ (Si-Al) ଓ ସୀମା (Si-Mg)।',
    dominantMineralsEn: 'Feldspars, quartz, pyroxenes, amphiboles, granite and oceanic basalt.',
    seismicPropertiesOr: 'P-ତରଙ୍ଗ ବେଗ (Vp): ୬.୦-୭.୦ km/s, S-ତରଙ୍ଗ ବେଗ (Vs): ୩.୫-୪.୦ km/s। ମୋହୋ ଡିସ୍କଣ୍ଟିନ୍ୟୁଟିରେ ହଠାତ୍ ୮.୦ km/s କୁ ବୃଦ୍ଧି ପାଏ।',
    seismicPropertiesEn: 'Vp: 6.0-7.0 km/s, Vs: 3.5-4.0 km/s, jumping abruptly to 8.1 km/s at the Moho.',
    scientificNarrativeOr: 'ଭୂତ୍ୱକ୍ ହେଉଛି ପୃଥିବୀର ସବୁଠାରୁ ପତଳା ବାହ୍ୟ ଆବରଣ (ସେଓର ଚୋପା ପରି)। ମହାଦେଶୀୟ ଭୂତ୍ୱକ୍ ହାଲୁକା ଗ୍ରାନାଇଟ୍ ଶିଳାରେ ଗଠିତ ଏବଂ ୪ ବିଲିୟନ ବର୍ଷ ପ୍ରାଚୀନ। ସାମୁଦ୍ରିକ ଭୂତ୍ୱକ୍ ଘନ ବାସାଲ୍ଟରେ ଗଠିତ ଏବଂ ମିଡ୍-ଓସେନିକ୍ ରିଜ୍‌ରୁ ନିରନ୍ତର ନୂଆ ହୋଇ ୨୦୦ ନିୟୁତ ବର୍ଷରେ ରିସାଇକଲ୍ ହୁଏ। ସମସ୍ତ ମାନବ ସଭ୍ୟତା, ନଦୀ, ପାହାଡ଼ ଓ ଜୈବମଣ୍ଡଳ ଏହି ପତଳା ସ୍ତର ଉପରେ ସ୍ଥିତ।',
    scientificNarrativeEn: 'The crust constitutes less than 1% of Earth volume. Thick, buoyant continental crust (average 35 km, up to 70 km under the Himalayas) is made of felsic granite up to 4 billion years old. Thin, dense oceanic crust (5-10 km) is mafic basalt constantly renewed at mid-ocean ridges and subducted into the mantle within 200 million years.',
    geodynamicRoleOr: 'ଟେକ୍ଟୋନିକ୍ ପ୍ଲେଟ୍ ଗୁଡ଼ିକ ମ୍ୟାଣ୍ଟଲ୍ ଉପରେ ଭାସମାନ ରହି ପରସ୍ପର ସହ ଧକ୍କା ହୋଇ ଭୂକମ୍ପ, ସୁନାମି ଓ ପର୍ବତ ନିର୍ମାଣ କରନ୍ତି।',
    geodynamicRoleEn: 'Rigid lithospheric plates float on the asthenosphere, driving continental drift, earthquakes, and mountain orogeny.'
  },

  {
    id: 'upper_mantle',
    nameOr: 'ଉର୍ଦ୍ଧ୍ୱ ପ୍ରାବାର ଓ ଆସ୍ଥେନୋସ୍ଫିୟର୍ (Upper Mantle & Asthenosphere)',
    nameEn: 'Upper Mantle & Asthenosphere (Convection Engine)',
    depthRangeKm: '35 - 410 km',
    topDepthKm: 35,
    bottomDepthKm: 410,
    thicknessKm: 375,
    volumePercent: 18.0,
    massPercent: 15.3,
    tempRangeC: '500°C ରୁ 1,400°C',
    pressureRangeGpa: '1.0 GPa ରୁ 14 GPa (10,000 ରୁ 140,000 atm)',
    densityRangeGcm3: '3.3 - 3.9 g/cm³',
    color: '#eab308',
    stateOfMatterOr: 'ପ୍ଲାଷ୍ଟିକ୍ / ସେମି-ଫ୍ଲୁଇଡ୍ ଡକ୍ଟାଇଲ୍ କଠିନ (Ductile Viscous Solid)',
    stateOfMatterEn: 'Ductile, highly viscous plastic solid undergoing slow thermal convection',
    dominantMineralsOr: 'ପେରିଡୋଟାଇଟ୍ (Peridotite), ଅଲିଭିନ୍ (Olivine - ସବୁଜ ରତ୍ନ), ଏନଷ୍ଟାଟାଇଟ୍, କ୍ରୋମାଇଟ୍ ଏବଂ ଗାର୍ନେଟ୍।',
    dominantMineralsEn: 'Peridotite dominated by olivine (Mg,Fe)2SiO4, pyroxenes, and garnet.',
    seismicPropertiesOr: 'ଲୋ-ଭେଲୋସିଟି ଜୋନ୍ (LVZ: 100-220 km) ରେ ଆଂଶିକ ତରଳିବା (1-2% partial melt) ଯୋଗୁଁ ସେସ୍ମିକ୍ ବେଗ ସାମାନ୍ୟ କମିଥାଏ।',
    seismicPropertiesEn: 'Low-Velocity Zone (LVZ) at 100-220 km where 1-2% partial melting reduces shear wave speed.',
    scientificNarrativeOr: 'ଆସ୍ଥେନୋସ୍ଫିୟର୍ (୧୦୦-୨୫୦ କିମି) ଅତ୍ୟନ୍ତ ଉଚ୍ଚ ତାପମାତ୍ରା ଓ ଚାପ ଯୋଗୁଁ କଠିନ ହୋଇ ମଧ୍ୟ ତାର୍ ପରି ମନ୍ଥର ଗତିରେ ପ୍ରବାହିତ (Plastic Creep) ହୁଏ। ଏଠାରେ ସୃଷ୍ଟି ହେଉଥିବା ତାପଜ ସମ୍ବହନ ସ୍ରୋତ (Mantle Convection Currents) ପୃଥିବୀର ମହାଦେଶଗୁଡ଼ିକୁ ପ୍ରତିବର୍ଷ ୨ ରୁ ୧୦ ସେଣ୍ଟିମିଟର ଘୁଞ୍ଚାଇଥାଏ (ଭାରତୀୟ ପ୍ଲେଟ୍ ଏସିଆ ସହ ଧକ୍କା ହୋଇ ହିମାଳୟକୁ ପ୍ରତିବର୍ଷ ୫ ମିମି ଉପରକୁ ଉଠାଉଛି!)।',
    scientificNarrativeEn: 'The asthenosphere behaves as a plastic rheid solid that flows via solid-state dislocation creep over geological epochs (centimeters per year). Thermal buoyancy convection cells transfer core heat to the surface, driving plate motions, continental rifting, and subduction zone volcanism.',
    geodynamicRoleOr: 'ଆଗ୍ନେୟଗିରି ମ୍ୟାଗ୍ମାର ଉତ୍ସ ଏବଂ ମହାଦେଶୀୟ ବିସ୍ଥାପନ (Continental Drift) ର ମୁଖ୍ୟ ଇଞ୍ଜିନ୍।',
    geodynamicRoleEn: 'Generates basaltic and kimberlitic magmas; primary mechanical engine driving continental drift.'
  },

  {
    id: 'transition_zone',
    nameOr: 'ମ୍ୟାଣ୍ଟଲ୍ ସଂକ୍ରମଣ କ୍ଷେତ୍ର—ଭୂଗର୍ଭସ୍ଥ ସାଗର (Mantle Transition Zone)',
    nameEn: 'Mantle Transition Zone (Ringwoodite Ocean)',
    depthRangeKm: '410 - 660 km',
    topDepthKm: 410,
    bottomDepthKm: 660,
    thicknessKm: 250,
    volumePercent: 12.0,
    massPercent: 11.2,
    tempRangeC: '1,400°C ରୁ 1,600°C',
    pressureRangeGpa: '14 GPa ରୁ 24 GPa',
    densityRangeGcm3: '3.9 - 4.4 g/cm³',
    color: '#f97316',
    stateOfMatterOr: 'ଉଚ୍ଚ ଚାପଜ କଠିନ ସ୍ଫଟିକ (High-pressure Crystalline Solid)',
    stateOfMatterEn: 'High-pressure metamorphic crystalline mineral phases',
    dominantMineralsOr: 'ୱାଡ୍ସଲିଇଟ୍ (Wadsleyite) ଏବଂ ରିଙ୍ଗଉଡାଇଟ୍ (Ringwoodite)। ଏହି ଖଣିଜ ସ୍ଫଟିକରେ ୧.୫% ପାଣି (OH ଆୟନ) ବନ୍ଧିତ ହୋଇ ରହିଛି!',
    dominantMineralsEn: 'Wadsleyite (beta-spinel) and ringwoodite (gamma-spinel) containing up to 1.5 wt% water bound in crystal defects.',
    seismicPropertiesOr: '୪୧୦ କିମି ଓ ୬୬୦ କିମି ରେ ଦୁଇଟି ଶକ୍ତିଶାଳୀ ଡିସ୍କଣ୍ଟିନ୍ୟୁଟି ଯେଉଁଠାରେ ସେସ୍ମିକ୍ ବେଗ ହଠାତ୍ ବୃଦ୍ଧି ପାଏ (Vp: 9.0 ରୁ 10.2 km/s)।',
    seismicPropertiesEn: 'Major global seismic discontinuities at 410 km and 660 km marking olivine-wadsleyite-ringwoodite-bridgmanite transitions.',
    scientificNarrativeOr: '୨୦୧୪ରେ ବ୍ରାଜିଲ୍ ହୀରାରେ ମିଳିଥିବା ରିଙ୍ଗଉଡାଇଟ୍ (Ringwoodite) ନମୁନାରୁ ବିଜ୍ଞାନୀମାନେ ଆବିଷ୍କାର କଲେ ଯେ ୪୧୦ ରୁ ୬୬୦ କିମି ମଧ୍ୟରେ ପୃଥିବୀର ସମସ୍ତ ମହାସାଗରର ମୋଟ ଜଳରାଶିର ୧ ରୁ ୩ ଗୁଣ ଅଧିକ ପାଣି ଏହି ପଥର ସ୍ଫଟିକ ମଧ୍ୟରେ ହାଇଡ୍ରକ୍ସିଲ୍ (OH⁻) ଆୟନ୍ ରୂପେ ବନ୍ଧା ହୋଇ ରହିଛି! ପ୍ରାଚୀନ ପୁରାଣର "ଭୂଗର୍ଭସ୍ଥ ରସାତଳ ସାଗର" ର ଏହା ଏକ ବାସ୍ତବିକ ବୈଜ୍ଞାନିକ ପ୍ରମାଣ।',
    scientificNarrativeEn: 'Analysis of mantle-derived diamonds confirmed that ringwoodite in the 410-660 km transition zone stores 1 to 3 times the total water content of all terrestrial surface oceans combined, trapped not as liquid water but within mineral crystal lattice OH defects.',
    geodynamicRoleOr: 'ନିମଜ୍ଜିତ ହେଉଥିବା ସାମୁଦ୍ରିକ ପ୍ଲେଟ୍ (Subducting Slabs) ପାଇଁ ଏକ ସ୍ଥଗିତାବସ୍ଥା ଓ ଡିପ୍-ଫୋକସ୍ ଭୂକମ୍ପ (୭୦୦ କିମି ପର୍ଯ୍ୟନ୍ତ) କେନ୍ଦ୍ର।',
    geodynamicRoleEn: 'Acts as a phase boundary barrier to sinking subducted lithospheric slabs and generates deep-focus earthquakes down to 670 km.'
  },

  {
    id: 'lower_mantle',
    nameOr: 'ନିମ୍ନ ପ୍ରାବାର ଓ D" ସ୍ତର (Lower Mantle & D" Layer)',
    nameEn: 'Lower Mantle & D" Layer (Bridgmanite Realm)',
    depthRangeKm: '660 - 2,891 km',
    topDepthKm: 660,
    bottomDepthKm: 2891,
    thicknessKm: 2231,
    volumePercent: 56.0,
    massPercent: 49.2,
    tempRangeC: '1,600°C ରୁ 3,700°C',
    pressureRangeGpa: '24 GPa ରୁ 136 GPa (1.36 ନିୟୁତ ବାୟୁମଣ୍ଡଳୀୟ ଚାପ!)',
    densityRangeGcm3: '4.4 - 5.6 g/cm³',
    color: '#ea580c',
    stateOfMatterOr: 'ଅତି-ଘନ କଠିନ ସିଲିକେଟ୍ ଶିଳା (Ultra-dense Viscous Solid)',
    stateOfMatterEn: 'Ultra-dense solid perovskite silicates under gigapascal megabar pressures',
    dominantMineralsOr: 'ବ୍ରିଜ୍‌ମାନାଇଟ୍ (Bridgmanite - ପୃଥିବୀର ସର୍ବାଧିକ ୩୮% ପ୍ରଚୁର ଖଣିଜ!), ଫେରୋପେରିକ୍ଲେଜ୍ (Ferropericlase), ଓ ଡେଭିଡ୍‌ମାଓଇଟ୍।',
    dominantMineralsEn: 'Bridgmanite (Mg,Fe)SiO3 perovskite (Earth most abundant single mineral, 38% of planetary volume), ferropericlase, and post-perovskite.',
    seismicPropertiesOr: 'P-ତରଙ୍ଗ ବେଗ ୧୩.୭ km/s ଏବଂ S-ତରଙ୍ଗ ୭.୩ km/s କୁ ବୃଦ୍ଧି ପାଏ। D" ସ୍ତରରେ ଅଲ୍ଟ୍ରା-ଲୋ ଭେଲୋସିଟି ଜୋନ୍ (ULVZs) ଦେଖାଯାଏ।',
    seismicPropertiesEn: 'Vp peaks at 13.7 km/s and Vs at 7.3 km/s. The D" layer at the core-mantle boundary displays Ultra-Low Velocity Zones (ULVZs).',
    scientificNarrativeOr: 'ନିମ୍ନ ମ୍ୟାଣ୍ଟଲ୍ ହେଉଛି ପୃଥିବୀର ସର୍ବବୃହତ ସ୍ତର (ସମୁଦାୟ ଆୟତନର ୫୬%)। ୨,୭୦୦ ରୁ ୨,୮୯୧ କିମି ଗଭୀରରେ ଥିବା D" ("ଡି-ଡବଲ୍-ପ୍ରାଇମ୍") ସ୍ତର ହେଉଛି ପୃଥିବୀର ସବୁଠାରୁ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ସୀମା। ଏଠାରେ ତରଳ ଧାତୁ କୋର୍ ଏବଂ କଠିନ ପଥର ମ୍ୟାଣ୍ଟଲ୍ ପରସ୍ପରକୁ ସ୍ପର୍ଶ କରନ୍ତି। ଏଠାରୁ ବିଶାଳକାୟ "ମ୍ୟାଣ୍ଟଲ୍ ପ୍ଲୁମ୍" (Superplumes) ଉପରକୁ ଉଠି ହାୱାଇ ଓ ଆଇସଲ୍ୟାଣ୍ଡ ପରି ବିଶାଳ ଆଗ୍ନେୟଗିରି ସୃଷ୍ଟି କରେ।',
    scientificNarrativeEn: 'Comprising 56% of Earth volume, the lower mantle terminates in the enigmatic D" layer at 2,700-2,891 km depth. Here, massive thermochemical piles (LLSVPs - Large Low Shear Velocity Provinces) under Africa and the Pacific anchor mantle thermal plumes that rise to create volcanic hotspots like Hawaii and Yellowstone.',
    geodynamicRoleOr: 'ବାହ୍ୟ କୋର୍‌ରୁ ତାପ ଗ୍ରହଣ କରି ପୃଥିବୀ ପୃଷ୍ଠକୁ ସୁପରପ୍ଲୁମ୍ (Mantle Plumes) ପଠାଇବା।',
    geodynamicRoleEn: 'Conducts heat out of the liquid core, driving superplumes and stabilizing the core-mantle boundary (CMB).'
  },

  {
    id: 'outer_core',
    nameOr: 'ବାହ୍ୟ କେନ୍ଦ୍ରମଣ୍ଡଳ (Outer Core - Liquid Geodynamo)',
    nameEn: 'Outer Core (Liquid Metallic Geodynamo)',
    depthRangeKm: '2,891 - 5,150 km',
    topDepthKm: 2891,
    bottomDepthKm: 5150,
    thicknessKm: 2259,
    volumePercent: 15.0,
    massPercent: 30.8,
    tempRangeC: '4,000°C ରୁ 5,000°C',
    pressureRangeGpa: '136 GPa ରୁ 329 GPa (1.36 ରୁ 3.29 ନିୟୁତ atm!)',
    densityRangeGcm3: '9.9 - 12.2 g/cm³ (ଜଳ ଠାରୁ ୧୦-୧୨ ଗୁଣ ଭାରୀ!)',
    color: '#dc2626',
    stateOfMatterOr: 'ତରଳ ଉତ୍ତପ୍ତ ଧାତୁ (Turbulent Liquid Metal)',
    stateOfMatterEn: 'Turbulent, low-viscosity molten iron-nickel alloy (flows like water!)',
    dominantMineralsOr: '୮୫% ତରଳ ଲୁହା (Fe), ୧୦% ନିକେଲ୍ (Ni), ଏବଂ ୫% ହାଲୁକା ତତ୍ତ୍ୱ (ଗନ୍ଧକ S, ଅମ୍ଳଜାନ O, ସିଲିକନ୍ Si, ହାଇଡ୍ରୋଜେନ୍)।',
    dominantMineralsEn: 'Molten iron (~85%), nickel (~10%), and light alloying elements (sulfur, oxygen, silicon, carbon, hydrogen).',
    seismicPropertiesOr: 'ଗୁଟେନବର୍ଗ୍ ଡିସ୍କଣ୍ଟିନ୍ୟୁଟି: ତରଳ ହୋଇଥିବାରୁ S-ତରଙ୍ଗ (Shear Waves) ସମ୍ପୂର୍ଣ୍ଣ ଶୂନ୍ୟ ହୋଇଯାଏ (Vs = 0 km/s)! P-ତରଙ୍ଗ ୧୩.୭ ରୁ ୮.୧ km/s କୁ ଖସିଯାଏ।',
    seismicPropertiesEn: 'Gutenberg discontinuity: S-waves vanish completely (Vs = 0 km/s), establishing the liquid state. Vp drops from 13.7 to 8.1 km/s.',
    scientificNarrativeOr: 'ଏହି ସ୍ତରଟି ପୃଥିବୀରେ ଜୀବନର ଅସ୍ତିତ୍ୱ ପାଇଁ ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ! ତରଳ ଲୁହା ଓ ନିକେଲ୍ ପାଣି ଭଳି ପତଳା ହୋଇ ପୃଥିବୀର ଆବର୍ତ୍ତନ (Coriolis effect) ଯୋଗୁଁ ଘୂର୍ଣ୍ଣାୟମାନ ସ୍ତମ୍ଭ ରୂପେ ପ୍ରବାହିତ ହୁଏ। ଏହା ଏକ ବିଶାଳ ପ୍ରାକୃତିକ ଡାଇନାମୋ (Geodynamo) ପରି କାମ କରି ପୃଥିବୀର ବିଶାଳ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Geomagnetic Field) ସୃଷ୍ଟି କରେ। ଯଦି ଏହି ବାହ୍ୟ କୋର୍ ଜମାଟ ବାନ୍ଧି ଯାଇଥାନ୍ତା, ତେବେ ମଙ୍ଗଳ ଗ୍ରହ ପରି ସୌର ବାୟୁ ଆମ ବାୟୁମଣ୍ଡଳକୁ ଉଡ଼ାଇ ନେଇଥାନ୍ତା ଏବଂ ପୃଥିବୀ ମରୁଭୂମି ପାଲଟି ଯାଇଥାନ୍ତା!',
    scientificNarrativeEn: 'The liquid outer core functions as a self-sustaining magnetohydrodynamic dynamo. Helical convection of molten iron organized by Coriolis forces generates Earth dipole geomagnetic field, extending into space to shield the biosphere and atmosphere from solar wind stripping and lethal cosmic rays.',
    geodynamicRoleOr: 'ପୃଥିବୀର ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Geomagnetic Field & Magnetosphere) ର ଏକମାତ୍ର ଉତ୍ସ!',
    geodynamicRoleEn: 'Generates Earth protective geomagnetic field; prevents atmospheric erosion by the solar wind.'
  },

  {
    id: 'inner_core',
    nameOr: 'ଅନ୍ତଃ କୋର୍ (Inner Core - Solid Crystal Sphere)',
    nameEn: 'Inner Core (Solid Iron-Nickel Crystal)',
    depthRangeKm: '5,150 - 6,371 km (ପୃଥିବୀର କେନ୍ଦ୍ର ବିନ୍ଦୁ)',
    topDepthKm: 5150,
    bottomDepthKm: 6371,
    thicknessKm: 1221,
    volumePercent: 0.7,
    massPercent: 1.7,
    tempRangeC: '5,400°C ରୁ 5,700°C (ସୂର୍ଯ୍ୟଙ୍କ ପୃଷ୍ଠଭାଗ ପରି ଉତ୍ତପ୍ତ!)',
    pressureRangeGpa: '329 GPa ରୁ 364 GPa (୩.୬ ନିୟୁତ ବାୟୁମଣ୍ଡଳୀୟ ଚାପ!)',
    densityRangeGcm3: '12.8 - 13.1 g/cm³ (ଜଳ ଠାରୁ ୧୩ ଗୁଣ ଭାରୀ!)',
    color: '#b91c1c',
    stateOfMatterOr: 'କଠିନ ଧାତବ ସ୍ଫଟିକ (Hexagonal Close-Packed HCP Solid Crystal)',
    stateOfMatterEn: 'Solid crystalline iron-nickel alloy in a hexagonal close-packed (hcp) lattice',
    dominantMineralsOr: 'ପ୍ରାୟ ୯୬% କଠିନ ସ୍ଫଟିକ ଲୁହା (Fe) ଏବଂ ୪-୫% ନିକେଲ୍ (Ni)।',
    dominantMineralsEn: 'Solid metallic iron-nickel alloy (~96% Fe, 4% Ni) with traces of silicon, sulfur, and carbon.',
    seismicPropertiesOr: 'ଲେହମ୍ୟାନ୍ ଡିସ୍କଣ୍ଟିନ୍ୟୁଟି (Lehmann Discontinuity 5,150 km): P-ତରଙ୍ଗ ବେଗ ହଠାତ୍ ୧୦.୩ ରୁ ୧୧.୨ km/s କୁ ବୃଦ୍ଧି ପାଏ ଏବଂ କଠିନ ହୋଇଥିବାରୁ S-ତରଙ୍ଗ ପୁନର୍ବାର ସୃଷ୍ଟି ହୁଏ (Vs = 3.6 km/s)!',
    seismicPropertiesEn: 'Lehmann discontinuity (5,150 km): Vp jumps to 11.2 km/s and shear waves reappear (Vs = 3.6 km/s), proving a solid core.',
    scientificNarrativeOr: 'ପୃଥିବୀର ଅନ୍ତଃ କୋର୍ ହେଉଛି ଚନ୍ଦ୍ରର ଆକାର (ବ୍ୟାସ ୨,୪୪୨ କିମି) ର ଏକ ଧଳା-ଉତ୍ତପ୍ତ କଠିନ ଲୁହା-ନିକେଲ୍ ଗୋଲକ। ଏଠାରେ ତାପମାତ୍ରା ୫,୪୦୦°C ରହିଛି ଯାହା ସୂର୍ଯ୍ୟଙ୍କ ପୃଷ୍ଠଭାଗ ସହିତ ସମାନ! ଲୁହାର ତରଳିବା ବିନ୍ଦୁ ୧,୫୩୮°C ହୋଇଥିଲେ ମଧ୍ୟ ଏହା ତରଳି ପାରେ ନାହିଁ, କାରଣ ୩.୬ ନିୟୁତ ବାୟୁମଣ୍ଡଳୀୟ ଚାପ ଏହାର ପରମାଣୁଗୁଡ଼ିକୁ ଚାପି କଠିନ ସ୍ଫଟିକ ରୂପେ ବାନ୍ଧି ରଖିଥାଏ। ଏହା ପୃଥିବୀର ଆବର୍ତ୍ତନ ଠାରୁ ବାର୍ଷିକ ସାମାନ୍ୟ ଦ୍ରୁତ ବେଗରେ (Super-rotation) ଘୂର୍ଣ୍ଣନ କରେ!',
    scientificNarrativeEn: 'Discovered in 1936 by Danish seismologist Inge Lehmann, the inner core is a solid metallic sphere roughly 70% the size of the Moon. Despite temperatures exceeding 5,400°C (matching the solar photosphere), immense pressure exceeding 3.6 million atmospheres forces iron atoms into a solid hcp crystal lattice.',
    geodynamicRoleOr: 'ବାହ୍ୟ କୋର୍ କୁ ଉତ୍ତାପ ପ୍ରଦାନ ଏବଂ ପୃଥିବୀର ଭାରକେନ୍ଦ୍ର ସ୍ଥିରତା।',
    geodynamicRoleEn: 'Freezes slowly (~1 mm/year), releasing latent heat and light elements that buoyantly drive the outer core geodynamo.'
  }
];

// 2. 100% Real Deep Boreholes, Seismological Discontinuities & Core Landmarks
export const DEEP_EARTH_MILESTONES: DeepMilestone[] = [
  {
    depthKm: 12.262,
    nameOr: 'କୋଲା ସୁପରଡିପ୍ ବୋରହୋଲ୍ (Kola Superdeep Borehole SG-3)',
    nameEn: 'Kola Superdeep Borehole (Russia, 12,262 m)',
    category: 'borehole',
    pressureGpa: 0.35,
    tempC: 180,
    descOr: 'ମାନବ ଇତିହାସର ସର୍ବପ୍ରଥମ ଓ ସର୍ବାଧିକ ଗଭୀର କୃତ୍ରିମ ଗର୍ତ୍ତ (୧୨.୨୬ କିମି)। ୧୮୦°C ତାପମାତ୍ରାରେ ପଥର ପ୍ଲାଷ୍ଟିକ୍ ପରି ଆଚରଣ କରିବାରୁ ଖନନ ବନ୍ଦ କରିବାକୁ ପଡ଼ିଥିଲା। ଏହା ପୃଥିବୀ କେନ୍ଦ୍ର ଦୂରତାର ମାତ୍ର ୦.୨%!',
    descEn: 'Deepest artificial borehole ever drilled into Earth crust. Drilling halted at 12,262 m due to unexpected 180°C temperatures and plastic rock deformation.',
    icon: '🏗️'
  },
  {
    depthKm: 35.0,
    nameOr: 'ମୋହୋ ସୀମା (Mohorovičić Discontinuity)',
    nameEn: 'Mohorovičić (Moho) Discontinuity',
    category: 'discontinuity',
    pressureGpa: 1.0,
    tempC: 500,
    descOr: '୧୯୦୯ ରେ ଆନ୍ଦ୍ରିଜା ମୋହୋରୋଭିଚିକ୍ ଆବିଷ୍କାର କରିଥିବା ଭୂତ୍ୱକ୍ ଓ ପ୍ରାବାରର ସୀମାରେଖା। ଏଠାରେ P-ତରଙ୍ଗ ବେଗ ୬.୮ ରୁ ହଠାତ୍ ୮.୧ km/s କୁ ବୃଦ୍ଧି ପାଏ।',
    descEn: 'Boundary separating the brittle crust from the ductile peridotite mantle, marked by an abrupt seismic velocity jump to 8.1 km/s.',
    icon: '⚡'
  },
  {
    depthKm: 410.0,
    nameOr: 'ଅଲିଭିନ୍ ରୁ ୱାଡ୍ସଲିଇଟ୍ ସଂକ୍ରମଣ (410 km Discontinuity)',
    nameEn: 'Olivine-to-Wadsleyite Phase Boundary',
    category: 'mineral_phase',
    pressureGpa: 14.0,
    tempC: 1400,
    descOr: 'ଅତ୍ୟଧିକ ଚାପ ଯୋଗୁଁ ଅଲିଭିନ୍ ଖଣିଜ ୱାଡ୍ସଲିଇଟ୍ (Wadsleyite) ସ୍ଫଟିକରେ ପରିଣତ ହୋଇ ବସ୍ତୁତ୍ୱ ସଙ୍କୋଚିତ ହୁଏ।',
    descEn: 'Exothermic phase transformation of alpha-olivine to beta-spinel wadsleyite, densifying the mantle lattice structure.',
    icon: '💎'
  },
  {
    depthKm: 660.0,
    nameOr: '୬୬୦ କିମି ସୀମା—ରିଙ୍ଗଉଡାଇଟ୍ ରୁ ବ୍ରିଜ୍‌ମାନାଇଟ୍ (660 km Boundary)',
    nameEn: 'Post-Spinel Bridgmanite Transition (660 km)',
    category: 'discontinuity',
    pressureGpa: 24.0,
    tempC: 1600,
    descOr: 'ଉର୍ଦ୍ଧ୍ୱ ମ୍ୟାଣ୍ଟଲ୍ ଏବଂ ନିମ୍ନ ମ୍ୟାଣ୍ଟଲ୍ ର ସୀମା। ଏଠାରେ ପୃଥିବୀର ସବୁଠାରୁ ପ୍ରଚୁର ଖଣିଜ "ବ୍ରିଜ୍‌ମାନାଇଟ୍" (Bridgmanite) ଜନ୍ମ ନିଏ। ଏଠାରେ ଗଭୀରତମ ଭୂକମ୍ପ (Deep Earthquakes) ଶେଷ ହୁଏ।',
    descEn: 'Global endothermic phase boundary decomposing ringwoodite into bridgmanite and ferropericlase; marks the absolute lower limit of deep-focus earthquakes.',
    icon: '🛑'
  },
  {
    depthKm: 2891.0,
    nameOr: 'ଗୁଟେନବର୍ଗ୍ ସୀମା—କୋର୍-ମ୍ୟାଣ୍ଟଲ୍ ବାଉଣ୍ଡାରୀ (Gutenberg Discontinuity)',
    nameEn: 'Core-Mantle Boundary (CMB / Gutenberg 2,891 km)',
    category: 'core_boundary',
    pressureGpa: 136.0,
    tempC: 3800,
    descOr: 'ପୃଥିବୀର ସର୍ବାଧିକ ନାଟକୀୟ ସୀମା! କଠିନ ପଥର ନିମ୍ନ ମ୍ୟାଣ୍ଟଲ୍ ଏବଂ ତରଳ ଲୁହା ବାହ୍ୟ କୋର୍‌ର ମିଳନସ୍ଥଳ। S-ତରଙ୍ଗ ସମ୍ପୂର୍ଣ୍ଣ ଗାଏବ୍ (Vs = 0 km/s)!',
    descEn: 'The most dramatic physical boundary inside Earth: solid silicate rock meets molten iron-nickel. Shear waves vanish completely (Vs = 0 km/s).',
    icon: '🌋'
  },
  {
    depthKm: 5150.0,
    nameOr: 'ଲେହମ୍ୟାନ୍ ସୀମା (Lehmann Discontinuity - Inner Core Boundary)',
    nameEn: 'Lehmann Inner Core Boundary (5,150 km)',
    category: 'core_boundary',
    pressureGpa: 329.0,
    tempC: 5400,
    descOr: '୧୯୩୬ରେ ଇଞ୍ଜେ ଲେହମ୍ୟାନ୍ ଆବିଷ୍କାର କରିଥିବା ତରଳ ବାହ୍ୟ କୋର୍ ଏବଂ କଠିନ ଅନ୍ତଃ କୋର୍‌ର ସୀମା। ୩.୩ ନିୟୁତ atm ଚାପ ଯୋଗୁଁ ଲୁହା ଜମାଟ ବାନ୍ଧି କଠିନ ହୁଏ।',
    descEn: 'Discovered in 1936 by Inge Lehmann; marks the boundary where molten iron-nickel freezes into a solid hexagonal metallic crystal sphere.',
    icon: '🔮'
  },
  {
    depthKm: 6371.0,
    nameOr: 'ପୃଥିବୀର କେନ୍ଦ୍ର ବିନ୍ଦୁ (Earth Center Point)',
    nameEn: 'Earth Geocenter (6,371 km)',
    category: 'center',
    pressureGpa: 364.0,
    tempC: 5700,
    descOr: '୩୬୪ GPa (୩.୬ ନିୟୁତ ବାୟୁମଣ୍ଡଳୀୟ ଚାପ), ୫,୭୦୦ K ତାପମାତ୍ରା (ସୂର୍ଯ୍ୟଙ୍କ ଫୋଟୋସ୍ଫିୟର୍ ସହିତ ସମାନ)। ଚାରିପାଖରୁ ସମାନ ମାଧ୍ୟାକର୍ଷଣ ଯୋଗୁଁ ଏଠାରେ ଗ୍ରାଭିଟି = 0 m/s² (Zero Gravity Center)!',
    descEn: 'The center of the Earth: 364 GPa pressure, 5,700 K temperature, and exactly 0 m/s2 gravitational acceleration due to spherical shell symmetry.',
    icon: '🎯'
  }
];

// 3. Whole Earth vs Crustal Chemical Abundance (100% Real Geochemical Ratios)
export const BULK_EARTH_ELEMENTS: BulkEarthElement[] = [
  {
    name: 'Iron (ଲୁହା / ଲୌହ)',
    symbol: 'Fe',
    wholeEarthPercent: 32.1,
    crustPercent: 5.0,
    corePercent: 85.5,
    color: '#dc2626',
    significanceOr: 'ସମଗ୍ର ପୃଥିବୀର ଏକ-ତୃତୀୟାଂଶ ବସ୍ତୁତ୍ୱ! ମୁଖ୍ୟତଃ କୋର୍ (Core) ରେ କେନ୍ଦ୍ରୀଭୂତ ହୋଇ ପୃଥିବୀର ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର ସୃଷ୍ଟି କରେ।',
    significanceEn: 'Heaviest bulk element dominating Earth mass; concentrated in the core to power the geodynamo.'
  },
  {
    name: 'Oxygen (ଅମ୍ଳଜାନ)',
    symbol: 'O',
    wholeEarthPercent: 30.1,
    crustPercent: 46.6,
    corePercent: 3.0,
    color: '#38bdf8',
    significanceOr: 'ଭୂତ୍ୱକ୍ ଓ ପ୍ରାବାରର ସର୍ବାଧିକ ପ୍ରଚୁର ତତ୍ତ୍ୱ! ସିଲିକନ୍, ମ୍ୟାଗ୍ନେସିୟମ୍ ଓ ଲୁହା ସହ ମିଶି ସମସ୍ତ ପଥର ଶିଳା ଗଠନ କରେ।',
    significanceEn: 'Most abundant element in the crust and mantle, forming the silicate backbone of rocks.'
  },
  {
    name: 'Silicon (ସିଲିକନ୍)',
    symbol: 'Si',
    wholeEarthPercent: 15.1,
    crustPercent: 27.7,
    corePercent: 6.0,
    color: '#a855f7',
    significanceOr: 'ସିଲିକେଟ୍ ଖଣିଜ (କ୍ୱାର୍ଟଜ୍, ଫେଲ୍ଡସ୍ପାର୍, ଅଲିଭିନ୍) ର ମୂଳ କଙ୍କାଳ।',
    significanceEn: 'Primary component of rocky mantle and crust silicate minerals (SiO4 tetrahedra).'
  },
  {
    name: 'Magnesium (ମ୍ୟାଗ୍ନେସିୟମ୍)',
    symbol: 'Mg',
    wholeEarthPercent: 13.9,
    crustPercent: 2.1,
    corePercent: 0.0,
    color: '#eab308',
    significanceOr: 'ମ୍ୟାଣ୍ଟଲ୍ (Upper & Lower Mantle) ର ମୁଖ୍ୟ ଧାତୁ ଯାହା ଅଲିଭିନ୍ ଓ ବ୍ରିଜ୍‌ମାନାଇଟ୍ ଗଠନ କରେ।',
    significanceEn: 'Dominant divalent cation in the mantle rock-forming minerals olivine and bridgmanite.'
  },
  {
    name: 'Sulfur (ଗନ୍ଧକ / ସଲଫର୍)',
    symbol: 'S',
    wholeEarthPercent: 2.9,
    crustPercent: 0.05,
    corePercent: 2.0,
    color: '#facc15',
    significanceOr: 'ବାହ୍ୟ କୋର୍‌ର ଏକ ପ୍ରମୁଖ ହାଲୁକା ତତ୍ତ୍ୱ ଯାହା ଲୁହାର ତରଳିବା ବିନ୍ଦୁକୁ ହ୍ରାସ କରେ।',
    significanceEn: 'Key light element in the liquid outer core lowering iron melting temperature.'
  },
  {
    name: 'Nickel (ନିକେଲ୍)',
    symbol: 'Ni',
    wholeEarthPercent: 1.8,
    crustPercent: 0.009,
    corePercent: 5.2,
    color: '#10b981',
    significanceOr: 'ଲୁହା ସହିତ ମିଶି କୋର୍ (Ni-Fe) ର ମିଶ୍ରଧାତୁ ସୃଷ୍ଟି କରେ।',
    significanceEn: 'Alloys with iron in the core to form the dense metallic central sphere.'
  },
  {
    name: 'Calcium (କ୍ୟାଲସିୟମ୍)',
    symbol: 'Ca',
    wholeEarthPercent: 1.5,
    crustPercent: 3.6,
    corePercent: 0.0,
    color: '#fb923c',
    significanceOr: 'ଭୂତ୍ୱକ୍ ପ୍ଲାଗିଓକ୍ଲେଜ୍ ଫେଲ୍ଡସ୍ପାର୍ ଓ ଚୂନପଥର (Limestone) ର ମୁଖ୍ୟ ଉପାଦାନ।',
    significanceEn: 'Important crustal network modifier in plagioclase feldspars and carbonates.'
  },
  {
    name: 'Aluminum (ଅଲୁମିନିୟମ୍)',
    symbol: 'Al',
    wholeEarthPercent: 1.4,
    crustPercent: 8.1,
    corePercent: 0.0,
    color: '#94a3b8',
    significanceOr: 'ମହାଦେଶୀୟ ଭୂତ୍ୱକ୍ (SIAL - Silicon Aluminum) ର ପ୍ରମୁଖ ଧାତୁ।',
    significanceEn: 'Abundant in low-density continental crustal rocks (granite, clays, bauxites).'
  }
];

// 4. Real Mathematical PREM Geophysical Property Computation
export function calculateEarthInteriorProperties(depthKm: number): {
  layerId: string;
  layerNameOr: string;
  layerNameEn: string;
  pressureGpa: number;
  pressureAtm: number;
  tempC: number;
  tempK: number;
  densityGcm3: number;
  vpKms: number;
  vsKms: number;
  gravityMs2: number;
  phaseStateOr: string;
  phaseStateEn: string;
  insightOr: string;
  insightEn: string;
} {
  const d = Math.max(0, Math.min(6371, depthKm));
  const r = 6371 - d; // radius from center in km
  const rNorm = r / 6371; // normalized radius

  let layerId = 'crust';
  let layerNameOr = 'ଭୂତ୍ୱକ୍ (Earth Crust)';
  let layerNameEn = 'Earth Crust';
  let pressureGpa = 0.0001;
  let tempC = 15;
  let densityGcm3 = 2.7;
  let vpKms = 6.2;
  let vsKms = 3.6;
  let gravityMs2 = 9.82;
  let phaseStateOr = 'କଠିନ ବ୍ରିଟିଲ୍ ଶିଳା';
  let phaseStateEn = 'Brittle Solid Rock';
  let insightOr = '';
  let insightEn = '';

  if (d <= 35) {
    // Crust
    layerId = 'crust';
    layerNameOr = 'ଭୂତ୍ୱକ୍ (Earth Crust - ମହାଦେଶୀୟ ଓ ସାମୁଦ୍ରିକ)';
    layerNameEn = 'Earth Crust';
    tempC = 15 + 25 * d;
    pressureGpa = 0.0001 + (1.0 / 35) * d;
    densityGcm3 = 2.6 + (0.3 / 35) * d;
    vpKms = 5.8 + (1.2 / 35) * d;
    vsKms = 3.2 + (0.6 / 35) * d;
    gravityMs2 = 9.82;
    phaseStateOr = 'କଠିନ ବାସାଲ୍ଟ ଓ ଗ୍ରାନାଇଟ୍ ଶିଳା';
    phaseStateEn = 'Solid Basalt & Granite';
    insightOr = 'ମାନବ ସଭ୍ୟତା, ସମୁଦ୍ର ଓ ପାହାଡ଼ ଧାରଣ କରୁଥିବା ବାହ୍ୟ ପତଳା ଆବରଣ।';
    insightEn = 'Surface shell hosting all oceans, continents, and biological life.';
  } else if (d <= 410) {
    // Upper Mantle
    layerId = 'upper_mantle';
    layerNameOr = 'ଉର୍ଦ୍ଧ୍ୱ ପ୍ରାବାର ଓ ଆସ୍ଥେନୋସ୍ଫିୟର୍ (Upper Mantle)';
    layerNameEn = 'Upper Mantle & Asthenosphere';
    const frac = (d - 35) / (410 - 35);
    tempC = 500 + frac * 900;
    pressureGpa = 1.0 + frac * 13.0;
    densityGcm3 = 3.3 + frac * 0.6;
    vpKms = 8.1 + frac * 0.9;
    vsKms = 4.5 + frac * 0.3;
    gravityMs2 = 9.85 + frac * 0.15;
    phaseStateOr = 'ପ୍ଲାଷ୍ଟିକ୍ / ସେମି-ଡକ୍ଟାଇଲ୍ ପେରିଡୋଟାଇଟ୍ (ଧୀର ସମ୍ବହନ ପ୍ରବାହ)';
    phaseStateEn = 'Viscous Plastic Peridotite';
    insightOr = 'ଆସ୍ଥେନୋସ୍ଫିୟର୍ର ତାପଜ ସମ୍ବହନ ଟେକ୍ଟୋନିକ୍ ପ୍ଲେଟ୍ ଓ ମହାଦେଶକୁ ଗତିଶୀଳ କରୁଛି।';
    insightEn = 'Convective creep powers continental drift and earthquake faults.';
  } else if (d <= 660) {
    // Transition Zone
    layerId = 'transition_zone';
    layerNameOr = 'ମ୍ୟାଣ୍ଟଲ୍ ସଂକ୍ରମଣ କ୍ଷେତ୍ର (Mantle Transition Zone)';
    layerNameEn = 'Mantle Transition Zone';
    const frac = (d - 410) / (660 - 410);
    tempC = 1400 + frac * 200;
    pressureGpa = 14.0 + frac * 10.0;
    densityGcm3 = 3.9 + frac * 0.5;
    vpKms = 9.0 + frac * 1.2;
    vsKms = 4.8 + frac * 0.7;
    gravityMs2 = 10.0 + frac * 0.1;
    phaseStateOr = 'ରିଙ୍ଗଉଡାଇଟ୍ ଓ ୱାଡ୍ସଲିଇଟ୍ ସ୍ଫଟିକ (ପୃଥିବୀର ସମସ୍ତ ସମୁଦ୍ରର ୨-୩ ଗୁଣ ଜଳ ଧାରଣ କ୍ଷମତା)';
    phaseStateEn = 'Ringwoodite & Wadsleyite Crystal Lattice';
    insightOr = 'ରିଙ୍ଗଉଡାଇଟ୍ ସ୍ଫଟିକରେ ମହାସାଗର ସଦୃଶ ବିପୁଳ ଜଳରାଶି OH ଆୟନ ରୂପେ ବନ୍ଧା ହୋଇଛି।';
    insightEn = 'Stores 1-3 ocean masses of water trapped in crystal lattice defects.';
  } else if (d <= 2891) {
    // Lower Mantle
    layerId = 'lower_mantle';
    layerNameOr = 'ନିମ୍ନ ପ୍ରାବାର ଓ D" ସ୍ତର (Lower Mantle & D" Layer)';
    layerNameEn = 'Lower Mantle (Bridgmanite Realm)';
    const frac = (d - 660) / (2891 - 660);
    tempC = 1600 + frac * 2100;
    pressureGpa = 24.0 + frac * 112.0;
    densityGcm3 = 4.4 + frac * 1.2;
    vpKms = 10.2 + frac * 3.5;
    vsKms = 5.5 + frac * 1.8;
    gravityMs2 = 10.1 + frac * 0.6; // peaks at CMB around 10.7 m/s2
    phaseStateOr = 'ଅତି-ଘନ ବ୍ରିଜ୍‌ମାନାଇଟ୍ ସିଲିକେଟ୍ ଶିଳା';
    phaseStateEn = 'Dense Bridgmanite Silicate';
    insightOr = 'ପୃଥିବୀର ୫୬% ଆୟତନ ବିଶିଷ୍ଟ ବିଶାଳ ସ୍ତର; D" ସୀମାରୁ ସୁପରପ୍ଲୁମ୍ ଉପରକୁ ଉଠି ଆଗ୍ନେୟଗିରି ସୃଷ୍ଟି କରେ।';
    insightEn = 'Anchors mantle superplumes that feed hot-spot volcanoes like Hawaii.';
  } else if (d <= 5150) {
    // Outer Core
    layerId = 'outer_core';
    layerNameOr = 'ବାହ୍ୟ କେନ୍ଦ୍ରମଣ୍ଡଳ (Outer Core - Liquid Geodynamo)';
    layerNameEn = 'Outer Core (Liquid Dynamo)';
    const frac = (d - 2891) / (5150 - 2891);
    tempC = 3700 + frac * 1300;
    pressureGpa = 136.0 + frac * 193.0;
    densityGcm3 = 9.9 + frac * 2.3;
    vpKms = 8.1 + frac * 2.2;
    vsKms = 0; // S-waves cannot travel through liquid!
    gravityMs2 = 10.7 - frac * 6.3; // drops linearly inside core
    phaseStateOr = 'ତରଳ ଉତ୍ତପ୍ତ ଲୁହା-ନିକେଲ୍ (ପାଣି ପରି ପତଳା ପ୍ରବାହ)';
    phaseStateEn = 'Molten Iron-Nickel Liquid';
    insightOr = 'ତରଳ ଲୁହାର ପ୍ରବାହ ପୃଥିବୀର ବିଶାଳ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Geodynamo) ସୃଷ୍ଟି କରି ସୌର ବିକିରଣରୁ ରକ୍ଷା କରେ।';
    insightEn = 'Convecting molten iron generates Earth geomagnetic protective shield.';
  } else {
    // Inner Core
    layerId = 'inner_core';
    layerNameOr = 'ଅନ୍ତଃ କୋର୍ (Inner Core - Solid Crystal Sphere)';
    layerNameEn = 'Inner Core (Solid Iron Crystal)';
    const frac = (d - 5150) / (6371 - 5150);
    tempC = 5000 + frac * 700;
    pressureGpa = 329.0 + frac * 35.0;
    densityGcm3 = 12.8 + frac * 0.3;
    vpKms = 11.2 + frac * 0.1;
    vsKms = 3.6 + frac * 0.1; // Solid allows shear waves again!
    gravityMs2 = 4.4 * (1 - frac); // reaches exactly 0 at center
    phaseStateOr = 'କଠିନ ସ୍ଫଟିକ ଲୁହା-ନିକେଲ୍ ଗୋଲକ (HCP Crystal Solid)';
    phaseStateEn = 'Hexagonal Solid Iron Crystal';
    insightOr = '୫,୪୦୦°C ସୂର୍ଯ୍ୟ ପରି ଉତ୍ତପ୍ତ, କିନ୍ତୁ ୩.୬ ନିୟୁତ atm ଚାପ ଯୋଗୁଁ ଲୁହା କଠିନ ସ୍ଫଟିକ ରୂପେ ବନ୍ଧା ହୋଇଛି!';
    insightEn = 'Hotter than the surface of the Sun, but frozen solid by 3.6 million atmospheres.';
  }

  const tempK = tempC + 273.15;
  const pressureAtm = pressureGpa * 9869.23;

  return {
    layerId,
    layerNameOr,
    layerNameEn,
    pressureGpa,
    pressureAtm,
    tempC,
    tempK,
    densityGcm3,
    vpKms,
    vsKms,
    gravityMs2,
    phaseStateOr,
    phaseStateEn,
    insightOr,
    insightEn
  };
}
