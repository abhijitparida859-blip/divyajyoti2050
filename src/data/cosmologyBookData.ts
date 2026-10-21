export interface ChapterTheme {
  accentColor: string;
  gradient: string;
  borderColor: string;
  badgeBg: string;
  glowColor: string;
  icon: string;
}

export interface PhysicalConstant {
  symbol: string;
  value: string;
  unit: string;
  nameOr: string;
  nameEn: string;
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  titleOr: string;
  titleEn: string;
  subtitleOr: string;
  subtitleEn: string;
  timeRange: string;
  temperature: string;
  energyScale: string;
  dominantPhysics: string;
  summaryOr: string;
  summaryEn: string;
  theme: ChapterTheme;
  physicalConstants: PhysicalConstant[];
  keyEquations: {
    name: string;
    latex: string;
    descriptionOr: string;
    descriptionEn: string;
  }[];
  sections: {
    headingOr: string;
    headingEn: string;
    contentOr: string;
    contentEn: string;
    keyPoints?: string[];
  }[];
  observationalEvidence: {
    instrumentOrMission: string;
    discoveryYear: string;
    findingOr: string;
    findingEn: string;
  }[];
  vedicParallel?: {
    verseText: string;
    source: string;
    meaningOr: string;
    meaningEn: string;
    philosophicalSynthesis: string;
  };
}

export const COSMOLOGY_TEXTBOOK: BookChapter[] = [
  {
    id: 'ch1_singularity',
    chapterNumber: 1,
    titleOr: 'ପ୍ଲାଙ୍କ ଯୁଗ, କ୍ୱାଣ୍ଟମ୍ ଗ୍ରାଭିଟି ଓ ପ୍ରାଥମିକ ସିଙ୍ଗୁଲାରିଟି',
    titleEn: 'The Planck Epoch, Quantum Gravity & The Primordial Singularity',
    subtitleOr: 'ସମୟ ଶୂନ୍ୟ (t = 0) ରୁ 10⁻⁴³ ସେକେଣ୍ଡ: ସୁପରଫୋର୍ସ ଏବଂ ସମସ୍ତ ବଳର ଏକୀକରଣ',
    subtitleEn: 'From t = 0 to 10⁻⁴³ s: Unified Superforce and Quantum Spacetime',
    timeRange: 't = 0 to 10⁻⁴³ s',
    temperature: 'T > 10³² K (Planck Temperature)',
    energyScale: 'E_p ≈ 1.22 × 10¹⁹ GeV',
    dominantPhysics: 'Quantum Gravity / Grand Unified Theory (GUT)',
    theme: {
      accentColor: '#a855f7',
      gradient: 'from-purple-950/60 via-indigo-950/40 to-[#02040a]',
      borderColor: 'border-purple-500/50',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      icon: '⚛️'
    },
    physicalConstants: [
      { symbol: 'ℓ_P', value: '1.616255 × 10⁻³⁵', unit: 'm', nameOr: 'ପ୍ଲାଙ୍କ ଦୈର୍ଘ୍ୟ (ସର୍ବନିମ୍ନ ସ୍ପେସ୍)', nameEn: 'Planck Length' },
      { symbol: 't_P', value: '5.391247 × 10⁻⁴⁴', unit: 's', nameOr: 'ପ୍ଲାଙ୍କ ସମୟ (ସର୍ବପ୍ରଥମ ମୁହୂର୍ତ୍ତ)', nameEn: 'Planck Time' },
      { symbol: 'T_P', value: '1.416784 × 10³²', unit: 'K', nameOr: 'ପ୍ଲାଙ୍କ ତାପମାତ୍ରା (ସର୍ବୋଚ୍ଚ ତାପ)', nameEn: 'Planck Temperature' },
      { symbol: 'ρ_P', value: '5.15500 × 10⁹⁶', unit: 'kg/m³', nameOr: 'ପ୍ଲାଙ୍କ ଘନତା (ସର୍ବୋଚ୍ଚ ଘନତ୍ୱ)', nameEn: 'Planck Density' }
    ],
    summaryOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ପ୍ରାରମ୍ଭିକ ମୁହୂର୍ତ୍ତରେ ସମଗ୍ର ଦୃଶ୍ୟମାନ ବ୍ରହ୍ମାଣ୍ଡ ଏକ ଅସୀମ ଘନତା ଓ ଅସୀମ ତାପମାତ୍ରା ବିଶିଷ୍ଟ ବିନ୍ଦୁ (Gravitational Singularity) ରେ ନିହିତ ଥିଲା। ଏହି ସମୟରେ ପ୍ରକୃତିର ୪ଟି ମୌଳିକ ବଳ (ମାଧ୍ୟାକର୍ଷଣ, ଇଲେକ୍ଟ୍ରୋମ୍ୟାଗ୍ନେଟିକ୍, ଷ୍ଟ୍ରଙ୍ଗ୍ ନ୍ୟୁକ୍ଲିୟର ଏବଂ ୱିକ୍ ନ୍ୟୁକ୍ଲିୟର ବଳ) ଏକତ୍ର ଏକୀଭୂତ ସୁପରଫୋର୍ସ ରୂପେ କାର୍ଯ୍ୟ କରୁଥିଲେ।',
    summaryEn: 'At the earliest moment of the Big Bang, the entire observable universe was compressed into a point of effectively infinite density and temperature—a gravitational singularity. At this scale, the four fundamental forces of nature were unified into a single primordial superforce governed by an as-yet unformulated theory of Quantum Gravity.',
    keyEquations: [
      {
        name: 'Planck Length (ପ୍ଲାଙ୍କ ଦୈର୍ଘ୍ୟ)',
        latex: '\\ell_P = \\sqrt{\\frac{\\hbar G}{c^3}} \\approx 1.616255 \\times 10^{-35} \\text{ m}',
        descriptionOr: 'ଭୌତିକ ବିଜ୍ଞାନର ସର୍ବନିମ୍ନ ମାପନଯୋଗ୍ୟ ଦୈର୍ଘ୍ୟ। ଏହା ଠାରୁ କମ୍ ଦୂରତାରେ ସ୍ପେସ୍-ଟାଇମ୍ କ୍ୱାଣ୍ଟମ୍ ଫୋମ୍ (Quantum Foam) ରେ ପରିଣତ ହୁଏ।',
        descriptionEn: 'The fundamental minimum length scale in physics below which classical concepts of spacetime cease to have physical meaning.'
      },
      {
        name: 'Planck Time (ପ୍ଲାଙ୍କ ସମୟ)',
        latex: 't_P = \\sqrt{\\frac{\\hbar G}{c^5}} \\approx 5.391247 \\times 10^{-44} \\text{ s}',
        descriptionOr: 'ଏହା ହେଉଛି ବିଶ୍ୱର ପ୍ରଥମ ସମୟ ଏକକ। ଏହି ସମୟ ପୂର୍ବର ଘଟଣା ଆଇନଷ୍ଟାଇନ୍‌ଙ୍କ ଆପେକ୍ଷିକତା ତତ୍ତ୍ୱ ବ୍ୟାଖ୍ୟା କରିପାରେ ନାହିଁ।',
        descriptionEn: 'The time taken by light to travel one Planck length in a vacuum. Standard general relativity breaks down prior to this time.'
      },
      {
        name: 'Planck Density (ପ୍ଲାଙ୍କ ଘନତା)',
        latex: '\\rho_P = \\frac{c^5}{\\hbar G^2} \\approx 5.155 \\times 10^{96} \\text{ kg/m}^3',
        descriptionOr: 'ପ୍ଲାଙ୍କ ଯୁଗରେ ବ୍ରହ୍ମାଣ୍ଡର ଘନତା ପ୍ରାୟ ୧୦⁹୬ କି.ଗ୍ରା./ଘନ ମିଟର ଥିଲା, ଯାହା ଅନନ୍ତତୁଲ୍ୟ।',
        descriptionEn: 'The mass-energy density of the universe at the Planck epoch, representing the maximal physical density scale.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ସିଙ୍ଗୁଲାରିଟିର ପ୍ରକୃତି ଓ ଭୌତିକ ସୀମା',
        headingEn: '1. The Nature of the Singularity & Physical Limits',
        contentOr: 'ସାଧାରଣ ଆପେକ୍ଷିକତା (General Relativity) ଅନୁଯାୟୀ, ଯଦି ଆମେ ସମୟକୁ ପଛକୁ ନେବା, ତେବେ ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡ t = 0 ରେ ଏକ ଶୂନ୍ୟ ଆୟତନ ଓ ଅସୀମ ଘନତାରେ ପହଞ୍ଚିବ। କିନ୍ତୁ କ୍ୱାଣ୍ଟମ୍ ମେକାନିକ୍ସ ଅନୁଯାୟୀ ହାଇଜେନବର୍ଗଙ୍କ ଅନିଶ୍ଚିତତା ନିୟମ (Uncertainty Principle) ଅନୁସାରେ କୌଣସି ପଦାର୍ଥ ପ୍ଲାଙ୍କ ଦୈର୍ଘ୍ୟ (10⁻³⁵ ମି.) ଠାରୁ କ୍ଷୁଦ୍ର ହୋଇପାରିବ ନାହିଁ। ତେଣୁ ପ୍ରକୃତରେ ସିଙ୍ଗୁଲାରିଟି ଏକ ଅସୀମ ବିନ୍ଦୁ ନୁହେଁ, ବରଂ କ୍ୱାଣ୍ଟମ୍ ଗ୍ରାଭିଟିର ଏକ ଅତି ସୂକ୍ଷ୍ମ କମ୍ପନମୟ ରାଜ୍ୟ ଥିଲା।',
        contentEn: 'According to classical general relativity, reversing cosmological expansion leads to a mathematical singularity at t = 0 with zero volume and infinite curvature. However, quantum mechanics—via the Heisenberg uncertainty principle—precludes localization below the Planck length (10⁻³⁵ m). Modern quantum cosmology theories, such as Loop Quantum Cosmology and String Theory, replace the zero-size singularity with a Planck-scale quantum bounce or high-energy stringy vacuum state.'
      },
      {
        headingOr: '୨. ସୁପରଫୋର୍ସ ଏବଂ ମୌଳିକ ବଳର ଏକୀକରଣ',
        headingEn: '2. The Superforce and Unification of Interactions',
        contentOr: 'ପ୍ଲାଙ୍କ ଯୁଗରେ ମହାକର୍ଷଣ ବଳ (Gravity) କ୍ୱାଣ୍ଟମ୍ ବଳମାନଙ୍କ ସହିତ ସମାନ ଶକ୍ତିଶାଳୀ ଥିଲା। ତାପମାତ୍ରା 10³² K ଥିବାରୁ କୌଣସି କଣିକା (କ୍ୱାର୍କ, ଇଲେକ୍ଟ୍ରନ୍ ଇତ୍ୟାଦି) ସ୍ୱତନ୍ତ୍ର ଅସ୍ତିତ୍ୱ ରଖିପାରୁନଥିଲେ। ପ୍ରକୃତିର ସମସ୍ତ ନିୟମ ଗୋଟିଏ ମାତ୍ର "ସୁପରସିମେଟ୍ରିକ୍ ସୁପରଷ୍ଟ୍ରିଙ୍ଗ୍" ବା "କ୍ୱାଣ୍ଟମ୍ ସ୍ପିନ୍ ନେଟୱାର୍କ" ଦ୍ୱାରା ନିର୍ଦ୍ଧାରିତ ହେଉଥିଲା। t = 10⁻⁴³ ସେକେଣ୍ଡରେ ମହାକର୍ଷଣ ବଳ ପ୍ରଥମେ ଅନ୍ୟ ତିନୋଟି ବଳରୁ ପୃଥକ ହୋଇ ସ୍ୱତନ୍ତ୍ର ହେଲା।',
        contentEn: 'At the Planck energy scale (~1.22 × 10¹⁹ GeV), the gravitational interaction had a coupling strength comparable to the gauge forces (strong, weak, and electromagnetic). Matter as we know it did not exist; energy existed as an undifferentiated, high-symmetry field. At the end of the Planck epoch (t ≈ 10⁻⁴³ s), spontaneous symmetry breaking decoupled gravitation from the Grand Unified Theory (GUT) strong-electroweak force.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'BICEP / Keck Array & Planck Space Observatory',
        discoveryYear: '2015-2021',
        findingOr: 'କସ୍ମିକ୍ ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍‌ରେ ପ୍ରାଥମିକ ମହାକର୍ଷଣୀୟ ତରଙ୍ଗ (Primordial Gravitational Waves, B-mode polarization) ର ତଲାସ ଚାଲିଛି, ଯାହା ପ୍ଲାଙ୍କ ଯୁଗର ସିଧାସଳଖ ସଙ୍କେତ ଦେବ।',
        findingEn: 'Upper limits on the tensor-to-scalar ratio (r < 0.036) constrain energy scales of the very early universe and quantum gravitational effects.'
      }
    ],
    vedicParallel: {
      verseText: 'ନାସଦାସୀନ୍ନୋ ସଦାସୀତ୍ତଦାନୀଂ ନାସୀଦ୍ରଜୋ ନୋ ବ୍ୟୋମା ପରୋ ୟତ୍ । କିମାବରୀବଃ କୁହ କସ୍ୟ ଶର୍ମନ୍ନମ୍ଭଃ କିମାସୀଦ୍ଗହନଂ ଗଭୀରମ୍ ॥',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୧ (ନାସଦୀୟ ସୂକ୍ତ - ନାସ୍ତିତ୍ୱ ଓ ସୃଷ୍ଟି ରହସ୍ୟ)',
      meaningOr: 'ସେତେବେଳେ ନା ଅସତ୍ (ଅଭାବ) ଥିଲା, ନା ସତ୍ (ପଦାର୍ଥ) ଥିଲା; ନା ଆଲୋକ ଥିଲା, ନା ମହାକାଶ ଥିଲା। ସେହି ଅବ୍ୟକ୍ତ ଅବସ୍ଥାରେ ସବୁକିଛି ଅତି ଗଭୀର, ଅନନ୍ତ ଗୁପ୍ତ ତତ୍ତ୍ୱରେ ନିହିତ ଥିଲା।',
      meaningEn: 'Then was not non-existence nor existence; there was no realm of air, no sky beyond it. What was concealed, and where, and in whose protection? Was there water, deep and unfathomable?',
      philosophicalSynthesis: 'ଋଗ୍‌ବେଦର ନାସଦୀୟ ସୂକ୍ତ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ପୂର୍ବର କ୍ୱାଣ୍ଟମ୍ ସିଙ୍ଗୁଲାରିଟିକୁ "ଅସତ୍ ମଧ୍ୟ ନୁହେଁ, ସତ୍ ମଧ୍ୟ ନୁହେଁ" ବୋଲି ବର୍ଣ୍ଣନା କରିଛି, ଯାହା ଆଧୁନିକ ପ୍ଲାଙ୍କ ଯୁଗର ଅବ୍ୟକ୍ତ ଶକ୍ତି ଅବସ୍ଥା ସହ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ମେଳ ଖାଏ।'
    }
  },
  {
    id: 'ch2_inflation',
    chapterNumber: 2,
    titleOr: 'କସ୍ମିକ୍ ଇନ୍‌ଫ୍ଲେସନ୍ (ମହାପ୍ରସାରଣ) ଓ ଇନ୍‌ଫ୍ଲାଟନ୍ ଫିଲ୍ଡ୍',
    titleEn: 'Cosmic Inflation, The Inflaton Field & Horizon Homogeneity',
    subtitleOr: 't = 10⁻³⁵ ରୁ 10⁻³² ସେକେଣ୍ଡ: ଆଲୋକ ଠାରୁ ଦ୍ରୁତ ପ୍ରସାରଣ ଓ ବିଶ୍ୱର ସମତଳତା',
    subtitleEn: 'From t = 10⁻³⁵ to 10⁻³² s: Superluminal Metric Expansion & Flat Geometry',
    timeRange: 't = 10⁻³⁶ to 10⁻³² s',
    temperature: '10²⁸ K down to 10²² K',
    energyScale: '10¹⁶ GeV (GUT Scale)',
    dominantPhysics: 'Scalar Inflaton Field Potential V(φ) & Slow-Roll Dynamics',
    theme: {
      accentColor: '#0ea5e9',
      gradient: 'from-sky-950/60 via-cyan-950/40 to-[#02040a]',
      borderColor: 'border-cyan-500/50',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      glowColor: 'rgba(14, 165, 233, 0.35)',
      icon: '🚀'
    },
    physicalConstants: [
      { symbol: 'N_e', value: '≥ 60', unit: 'e-folds', nameOr: 'ନିମ୍ନତମ ଇ-ଫୋଲ୍ଡ ପ୍ରସାରଣ', nameEn: 'Minimum e-folds' },
      { symbol: 'n_s', value: '0.9649 ± 0.0042', unit: 'dimensionless', nameOr: 'ସ୍କାଲାର୍ ସ୍ପେକ୍ଟ୍ରାଲ୍ ଇଣ୍ଡେକ୍ସ', nameEn: 'Scalar Spectral Index' },
      { symbol: 'r', value: '< 0.036', unit: '95% CL', nameOr: 'ଟେନ୍‌ସର୍-ଟୁ-ସ୍କାଲାର୍ ଅନୁପାତ', nameEn: 'Tensor-to-Scalar Ratio' },
      { symbol: 'H_inf', value: '~ 10¹⁴', unit: 'GeV', nameOr: 'ଇନ୍‌ଫ୍ଲେସନ୍ ହବଲ୍ ସ୍କେଲ୍', nameEn: 'Inflationary Hubble Scale' }
    ],
    summaryOr: '୧୯୮୧ ମସିହାରେ ଆଲାନ୍ ଗୁଥ୍ (Alan Guth) ପ୍ରସ୍ତାବ ଦେଇଥିଲେ ଯେ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ଏକ କ୍ଷୁଦ୍ରାତିକ୍ଷୁଦ୍ର ଅଂଶ ମଧ୍ୟରେ ବ୍ରହ୍ମାଣ୍ଡ ଏକ୍ସପୋନେନ୍ସିଆଲ୍ (ଅତି ଦ୍ରୁତ) ଗତିରେ ପ୍ରାୟ ୧୦²୬ ରୁ ୧୦³୦ ଗୁଣ ପ୍ରସାରିତ ହୋଇଥିଲା। ଏହି ମହାପ୍ରସାରଣ ଆଲୋକ ଠାରୁ ଦ୍ରୁତ ବେଗରେ ସ୍ପେସ୍-ଟାଇମ୍‌କୁ ଟାଣିଦେଲା ଏବଂ ବ୍ରହ୍ମାଣ୍ଡକୁ ସମ୍ପୂର୍ଣ୍ଣ ସମତଳ (Flat) ତଥା ସର୍ବତ୍ର ସମାନ କରିଦେଲା।',
    summaryEn: 'Formulated by Alan Guth in 1981 and refined by Andrei Linde and Paul Steinhardt, Cosmic Inflation posits an epoch of exponential, superluminal metric expansion driven by the vacuum energy of a scalar inflaton field φ. In a fraction of a second, the universe expanded by at least 60 e-folds (a factor > 10²⁶), resolving the profound Horizon and Flatness paradoxes.',
    keyEquations: [
      {
        name: 'Scale Factor Exponential Growth (ପ୍ରସାରଣ ସ୍କେଲ୍ ଫ୍ୟାକ୍ଟର୍)',
        latex: 'a(t) = a_0 e^{H_{\\text{inf}} t}, \\quad H_{\\text{inf}} = \\sqrt{\\frac{8\\pi G V(\\phi)}{3 c^2}}',
        descriptionOr: 'ଇନ୍‌ଫ୍ଲେସନ୍ ସମୟରେ ବ୍ରହ୍ମାଣ୍ଡର ଆକାର ସମୟ ସହ ଗୁଣାତ୍ମକ ଭାବେ ବଢ଼ିଥାଏ।',
        descriptionEn: 'The scale factor grows exponentially with constant Hubble parameter during slow-roll inflation.'
      },
      {
        name: 'Number of e-folds (ଇ-ଫୋଲ୍ଡ ସଂଖ୍ୟା)',
        latex: 'N = \\int_{t_i}^{t_f} H dt = \\ln\\left(\\frac{a_f}{a_i}\\right) \\ge 60',
        descriptionOr: 'ବର୍ତ୍ତମାନର ଦୃଶ୍ୟମାନ ବ୍ରହ୍ମାଣ୍ଡକୁ ବ୍ୟାଖ୍ୟା କରିବା ପାଇଁ ଅତିକମରେ ୬୦ଟି ଇ-ଫୋଲ୍ଡ (୧୦²⁶ ଗୁଣ) ପ୍ରସାରଣ ଆବଶ୍ୟକ।',
        descriptionEn: 'Minimum number of e-folds of exponential growth required to stretch the causal patch across the observable horizon.'
      },
      {
        name: 'Primordial Quantum Power Spectrum (ପ୍ରାଥମିକ କମ୍ପନ ସ୍ପେକ୍ଟ୍ରମ୍)',
        latex: 'P_{\\mathcal{R}}(k) = A_s \\left(\\frac{k}{k_0}\\right)^{n_s - 1}, \\quad n_s \\approx 0.965',
        descriptionOr: 'କ୍ୱାଣ୍ଟମ୍ କମ୍ପନ ମାନ ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡରେ ବିଛାଡ଼ି ହୋଇ ପରବର୍ତ୍ତୀ ସମୟରେ ଗାଲାକ୍ସି ଓ ତାରା ମାନଙ୍କ ମଞ୍ଜି (Seeds) ପାଲଟିଲା।',
        descriptionEn: 'The scalar spectral index n_s measured by Planck confirms nearly scale-invariant red-tilted quantum fluctuations.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ଇନ୍‌ଫ୍ଲେସନ୍ ସମାଧାନ କରିଥିବା ୩ଟି ମୁଖ୍ୟ ପ୍ରହେଳିକା',
        headingEn: '1. The Three Classical Cosmological Paradoxes Solved',
        contentOr: 'ପାରମ୍ପରିକ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ମଡେଲ୍‌ରେ ୩ଟି ବଡ଼ ପ୍ରଶ୍ନ ଥିଲା:\n୧. ଦିଗ୍‌ବଳୟ ସମସ୍ୟା (Horizon Problem): ବ୍ରହ୍ମାଣ୍ଡର ପରସ୍ପର ବିପରୀତ ଦିଗରେ ଥିବା କୋଟି କୋଟି ଆଲୋକବର୍ଷ ଦୂରତାର ସ୍ଥାନମାନଙ୍କ ତାପମାତ୍ରା କିପରି ଏକ ସମାନ (2.725 K)? ଇନ୍‌ଫ୍ଲେସନ୍ ଦର୍ଶାଇଲା ଯେ ପ୍ରସାରଣ ପୂର୍ବରୁ ସେଗୁଡ଼ିକ ଏକ କ୍ଷୁଦ୍ରାତିକ୍ଷୁଦ୍ର କ୍ୱାଣ୍ଟମ୍ ଯୋଗାଯୋଗରେ ଥିଲେ।\n୨. ସମତଳତା ସମସ୍ୟା (Flatness Problem): ଆମ ବିଶ୍ୱର ଜ୍ୟାମିତି ଅତି ସଠିକ୍ ଭାବେ ସମତଳ (Ω_k = 0.000 ± 0.005) କିପରି? ଇନ୍‌ଫ୍ଲେସନ୍ ଏକ ଫୁଙ୍କା ହୋଇଥିବା ବେଲୁନ୍ ପରି ସ୍ପେସ୍‌କୁ ସମତଳ କରିଦେଲା।\n୩. ଚୁମ୍ବକୀୟ ମୋନୋପୋଲ୍ ସମସ୍ୟା: ପ୍ରାଥମିକ କ୍ୱାଣ୍ଟମ୍ ମନୋପୋଲ୍‌ଗୁଡ଼ିକୁ ମହାପ୍ରସାରଣ ଏତେ ଦୂରକୁ ଘୁଞ୍ଚାଇଦେଲା ଯେ ଆମ ଦୃଶ୍ୟମାନ ବ୍ରହ୍ମାଣ୍ଡରେ ତାହା ଆଉ ଦେଖାଯାଏ ନାହିଁ।',
        contentEn: 'Inflation uniquely resolves three core cosmological failures of classical Big Bang cosmology:\n1. The Horizon Problem: Regions separated by gigaparsecs that could never have exchanged light signals share an identical temperature to 1 part in 100,000. Inflation stretched a single causally connected micro-domain across the entire sky.\n2. The Flatness Problem: Why is spatial density parameter Ω_tot within 0.2% of critical density? Exponential expansion dilutes spatial curvature k/a² to zero, driving Ω to unity.\n3. The Monopole Problem: Heavy GUT magnetic monopoles predicted by grand unification were diluted to less than one per observable universe volume.'
      },
      {
        headingOr: '୨. କ୍ୱାଣ୍ଟମ୍ କମ୍ପନରୁ ଗାଲାକ୍ସି ସୃଷ୍ଟି (Quantum Seeds of Structure)',
        headingEn: '2. Quantum Fluctuations as the Genetic Code of the Cosmic Web',
        contentOr: 'ଇନ୍‌ଫ୍ଲେସନ୍ ସମୟରେ ଇନ୍‌ଫ୍ଲାଟନ୍ ଫିଲ୍ଡ୍‌ର କ୍ଷୁଦ୍ରାତିକ୍ଷୁଦ୍ର ସବ୍-ଆଟମିକ୍ କ୍ୱାଣ୍ଟମ୍ କମ୍ପନ (Quantum Fluctuations) ସ୍ପେସ୍-ଟାଇମ୍ ସହିତ ଆକାଶରୁ ଆକାଶ ଯାଏଁ ପ୍ରସାରିତ ହୋଇଗଲା। ଏହି କ୍ଷୁଦ୍ର ଘନତା ପାର୍ଥକ୍ୟ (୧ ଲକ୍ଷ ଭାଗରେ ମାତ୍ର ୧ ଭାଗ) ପରବର୍ତ୍ତୀ ସମୟରେ ମହାକର୍ଷଣ ବଳ ଯୋଗୁଁ ଘନୀଭୂତ ହୋଇ ଆଜିର ସମସ୍ତ ଗାଲାକ୍ସି, କ୍ଲଷ୍ଟର୍ ଏବଂ ଆମ ସୌରମଣ୍ଡଳକୁ ଜନ୍ମ ଦେଇଛି। ଆମେ ସମସ୍ତେ ସେହି କ୍ୱାଣ୍ଟମ୍ କମ୍ପନର ସନ୍ତାନ!',
        contentEn: 'During inflation, microscopic subatomic quantum vacuum fluctuations in the inflaton field were stretched across macroscopic cosmological distances before freezing out beyond the Hubble horizon. These primordial density fluctuations (δρ/ρ ~ 10⁻⁵) seeded the gravitational potential wells where dark matter and gas accumulated to construct all galaxies, stars, and planets.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'ESA Planck Spacecraft & WMAP',
        discoveryYear: '2013-2018',
        findingOr: 'ପ୍ଲାଙ୍କ ମହାକାଶଯାନ ମାପିଛି ଯେ ବ୍ରହ୍ମାଣ୍ଡର ସମତଳତା Ω_k = 0.0007 ± 0.0019, ଯାହା ପ୍ରମାଣ କରେ ଆମ ବିଶ୍ୱ ୧୦୦% ୟୁକ୍ଲିଡିୟ ସମତଳ, ଠିକ୍ ଯେପରି ଇନ୍‌ଫ୍ଲେସନ୍ ଭବିଷ୍ୟବାଣୀ କରିଥିଲା।',
        findingEn: 'The Planck CMB scalar spectral tilt ns = 0.9649 ± 0.0042 rule out exact scale invariance and confirm slow-roll inflation predictions with 8σ statistical significance.'
      }
    ],
    vedicParallel: {
      verseText: 'ଆନୀଦବାତଂ ସ୍ୱଧୟା ତଦେକଂ ତସ୍ମାଦ୍ଧାନ୍ୟନ୍ନ ପରଃ କିଞ୍ଚନାସ ॥',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୨ (ନାସଦୀୟ ସୂକ୍ତ)',
      meaningOr: 'ସେହି ଏକମାତ୍ର ତତ୍ତ୍ୱ ନିଜ ସ୍ୱଧା (ଆଭ୍ୟନ୍ତରୀଣ ଶକ୍ତି) ବଳରେ ବାୟୁ ବିନା ମଧ୍ୟ ଶ୍ୱାସ ଗ୍ରହଣ କରୁଥିଲା (କମ୍ପିତ ହେଉଥିଲା); ତାହା ବ୍ୟତୀତ ଆଉ କିଛି ନଥିଲା।',
      meaningEn: 'That One Thing, breathless, breathed by its own intrinsic impulse; other than that there was nothing whatsoever beyond.',
      philosophicalSynthesis: 'ବିନା ବାୟୁରେ ନିଜ ଅନ୍ତର୍ନିହିତ ଶକ୍ତି ଦ୍ୱାରା ପ୍ରସାରିତ ହେବାର ଏହି ବର୍ଣ୍ଣନା ଇନ୍‌ଫ୍ଲାଟନ୍ ଫିଲ୍ଡ୍‌ର ଭ୍ୟାକ୍ୟୁମ୍ ଏନର୍ଜି (Vacuum Energy Density) ସହ ଅବିକଳ ସମାନ।'
    }
  },
  {
    id: 'ch3_baryogenesis',
    chapterNumber: 3,
    titleOr: 'ଇଲେକ୍ଟ୍ରୋୱିକ୍ ବିଖଣ୍ଡନ, ହିଗ୍ସ ବୋସନ୍ ଓ ବାରିଓଜେନେସିସ୍',
    titleEn: 'Electroweak Symmetry Breaking, The Higgs Field & Baryogenesis',
    subtitleOr: 't = 10⁻¹² ରୁ 10⁻⁶ ସେକେଣ୍ଡ: କଣିକାଙ୍କ ଓଜନ ପ୍ରାପ୍ତି ଏବଂ ମ୍ୟାଟର୍-ଆଣ୍ଟିମ୍ୟାଟର୍ ସଂଗ୍ରାମ',
    subtitleEn: 'From t = 10⁻¹² to 10⁻⁶ s: Mass Acquisition & Matter-Antimatter Asymmetry',
    timeRange: 't = 10⁻¹² to 10⁻⁶ s',
    temperature: '10¹⁵ K down to 10¹² K (Trillion K)',
    energyScale: '100 GeV to 1 GeV (Electroweak Scale)',
    dominantPhysics: 'Standard Model Higgs Mechanism & Sakharov Baryogenesis',
    theme: {
      accentColor: '#eab308',
      gradient: 'from-amber-950/60 via-yellow-950/40 to-[#02040a]',
      borderColor: 'border-amber-500/50',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glowColor: 'rgba(234, 179, 8, 0.35)',
      icon: '⚡'
    },
    physicalConstants: [
      { symbol: 'v_EW', value: '246.22', unit: 'GeV', nameOr: 'ହିଗ୍ସ ଭ୍ୟାକ୍ୟୁମ୍ ଏକ୍ସପେକ୍ଟେସନ୍ ମୂଲ୍ୟ', nameEn: 'Higgs VEV' },
      { symbol: 'm_H', value: '125.25 ± 0.17', unit: 'GeV/c²', nameOr: 'ହିଗ୍ସ ବୋସନ୍ ଭର (God Particle)', nameEn: 'Higgs Boson Mass' },
      { symbol: 'η_B', value: '(6.12 ± 0.04) × 10⁻¹⁰', unit: 'ratio', nameOr: 'ବାରିଅନ୍ ଅସମମିତି ଅନୁପାତ', nameEn: 'Baryon Asymmetry' },
      { symbol: 'T_EW', value: '~ 159.5', unit: 'GeV', nameOr: 'ଇଲେକ୍ଟ୍ରୋୱିକ୍ କ୍ରସ୍-ଓଭର୍ ତାପମାତ୍ରା', nameEn: 'EW Phase Transition' }
    ],
    summaryOr: 't = 10⁻¹² ସେକେଣ୍ଡରେ ବ୍ରହ୍ମାଣ୍ଡ ଯଥେଷ୍ଟ ଥଣ୍ଡା ହେବା ପରେ ହିଗ୍ସ ଫିଲ୍ଡ୍ (Higgs Field) ସ୍ପୋଣ୍ଟାନିଅସ୍ ଭାବେ ସକ୍ରିୟ ହେଲା, ଯାହା ଇଲେକ୍ଟ୍ରୋନ୍ ଓ କ୍ୱାର୍କ ମାନଙ୍କୁ ଭର (Mass) ପ୍ରଦାନ କଲା। ଏହି ସମୟରେ ପଦାର୍ଥ (Matter) ଏବଂ ପ୍ରତି-ପଦାର୍ଥ (Antimatter) ମଧ୍ୟରେ ତୀବ୍ର ବିଲୋପ ସଂଗ୍ରାମ ଘଟିଲା। ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ପ୍ରତି ୧ ବିଲିୟନ ଯୋଡ଼ିରେ ମାତ୍ର ୧ଟି ଅତିରିକ୍ତ ପଦାର୍ଥ କଣିକା ବଞ୍ଚିଗଲା—ଏବଂ ସେହି ଅବଶିଷ୍ଟ କଣିକାରୁ ଆଜିର ସମଗ୍ର ବିଶ୍ୱ ଗଠିତ!',
    summaryEn: 'At t ≈ 10⁻¹² seconds, the electroweak phase transition occurred as the Higgs field acquired a non-zero vacuum expectation value (v = 246 GeV), imparting inertial mass to W/Z bosons, quarks, and charged leptons. Simulataneously, the Sakharov conditions enabled a microscopic CP-violating baryon asymmetry: for every 1,000,000,000 antimatter particles, 1,000,000,001 matter particles were created. Total annihilation converted the rest into primordial photons.',
    keyEquations: [
      {
        name: 'Higgs Mechanism Vacuum Expectation Value (ଭ୍ୟାକ୍ୟୁମ୍ ମୂଲ୍ୟ)',
        latex: 'v = \\sqrt{-\\frac{\\mu^2}{\\lambda}} \\approx 246 \\text{ GeV}, \\quad m_f = \\frac{y_f v}{\\sqrt{2}}',
        descriptionOr: 'ହିଗ୍ସ ଫିଲ୍ଡ୍ ସହ ୟୁକାୱା କପ୍ଲିଂ (y_f) ଯୋଗୁଁ କ୍ୱାର୍କ ଓ ଲେପ୍ଟନ୍ ମାନେ ନିଜର ବସ୍ତୁତ୍ୱ (Mass) ପାଇଥାନ୍ତି।',
        descriptionEn: 'The non-zero Higgs VEV generates fermion masses proportional to their dimensionless Yukawa couplings y_f.'
      },
      {
        name: 'Baryon-to-Photon Asymmetry Ratio (ବାରିଅନ୍ ଅନୁପାତ)',
        latex: '\\eta = \\frac{n_b - n_{\\bar{b}}}{n_\\gamma} = (6.12 \\pm 0.04) \\times 10^{-10}',
        descriptionOr: 'ପ୍ରତି ୧୦ ବିଲିୟନ ଫୋଟନ୍ ପିଛା ମାତ୍ର ୬ଟି ବାରିଅନ୍ (ପ୍ରୋଟନ୍/ନ୍ୟୁଟ୍ରନ୍) ବଞ୍ଚି ରହିଲା।',
        descriptionEn: 'The minuscule matter-antimatter asymmetry measured directly by Planck CMB baryon density data.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ଆଣ୍ଡ୍ରେଇ ସାଖାରୋଭ୍‌ଙ୍କ ୩ଟି ନିୟମ (Sakharov Conditions)',
        headingEn: '1. The Three Sakharov Conditions for Matter Survival',
        contentOr: 'ପ୍ରଶ୍ନ ଉଠେ: ଯଦି ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ସମାନ ପରିମାଣର ପଦାର୍ଥ ଓ ପ୍ରତି-ପଦାର୍ଥ ସୃଷ୍ଟି କଲା, ତେବେ ସବୁକିଛି ପରସ୍ପରକୁ ବିନଷ୍ଟ କରି କେବଳ ଶୁଦ୍ଧ ଆଲୋକରେ ପରିଣତ ହୋଇଯିବା କଥା! କିନ୍ତୁ ଆମେ କିପରି ଅଛୁ?\n୧୯୬୭ ମସିହାରେ ଆଣ୍ଡ୍ରେଇ ସାଖାରୋଭ୍ ୩ଟି ସର୍ତ୍ତ ଦେଇଥିଲେ:\n୧. ବାରିଅନ୍ ସଂଖ୍ୟା ଉଲ୍ଲଙ୍ଘନ (Baryon Number Violation).\n୨. C (ଚାର୍ଜ କଞ୍ଜୁଗେସନ୍) ଏବଂ CP (ପ୍ୟାରିଟି) ସମମିତି ଭଙ୍ଗ.\n୩. ଥର୍ମୋଡାଇନାମିକ୍ ସନ୍ତୁଳନରୁ ବାହାରେ ଥିବା ପ୍ରକ୍ରିୟା (Out-of-Equilibrium Expansion).\nଏହି ତିନୋଟି କାରଣରୁ ପଦାର୍ଥ ପ୍ରତି-ପଦାର୍ଥ ଉପରେ ବିଜୟୀ ହେଲା।',
        contentEn: 'In 1967, Soviet physicist Andrei Sakharov formulated the three mandatory conditions required for a matter-dominated universe to emerge from a matter-antimatter symmetric Big Bang:\n1. Baryon number (B) violation.\n2. C-symmetry and CP-symmetry violation (demonstrated in Kaon and B-meson decay experiments).\n3. Departure from thermal equilibrium (provided by the rapid expansion of the universe during cosmological phase transitions).'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'CERN Large Hadron Collider (ATLAS & CMS)',
        discoveryYear: '2012',
        findingOr: '୧୨୫.୧୮ GeV ଭର ବିଶିଷ୍ଟ ହିଗ୍ସ ବୋସନ୍ (God Particle) ଆବିଷ୍କାର ହେଲା, ଯାହା ପ୍ରମାଣ କଲା ଯେ ବ୍ରହ୍ମାଣ୍ଡରେ କଣିକାମାନେ ହିଗ୍ସ ଫିଲ୍ଡ୍ ଦ୍ୱାରା ହିଁ ଓଜନ ପାଆନ୍ତି।',
        findingEn: 'Observation of the Higgs boson with m_H = 125.25 ± 0.17 GeV directly verified the electroweak symmetry breaking mechanism.'
      }
    ],
    vedicParallel: {
      verseText: 'ତମ ଆସୀତ୍ତମସା ଗୂଳ୍ହମଗ୍ରେଽପ୍ରକେତଂ ସଲିଲଂ ସର୍ବମା ଇଦମ୍ ।',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୩ (ନାସଦୀୟ ସୂକ୍ତ)',
      meaningOr: 'ପ୍ରାରମ୍ଭରେ ସର୍ବତ୍ର ଅନ୍ଧକାର ଗୂଢ଼ ଭାବେ ଲୁକ୍କାୟିତ ଥିଲା, ଏବଂ ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡ ଏକ ଅବିଭକ୍ତ ଅଥାହ ଜଳରାଶି (ପ୍ଲାଜ୍ମା ସାଗର) ସଦୃଶ ଥିଲା।',
      meaningEn: 'Darkness there was at first, by darkness hidden; without distinguishing marks, this all was water.',
      philosophicalSynthesis: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ପ୍ରାରମ୍ଭିକ କ୍ୱାର୍କ-ଗ୍ଲୁଅନ୍ ପ୍ଲାଜ୍ମା ଅବସ୍ଥା ଏକ ଅତି ତରଳ ଦ୍ରବ୍ୟ (Superfluid with near zero viscosity) ପରି ପ୍ରବାହିତ ହେଉଥିଲା, ଯାହାକୁ ଋଗ୍‌ବେଦ "ସଲିଲମ୍" (ଶକ୍ତିର ସାଗର) ବୋଲି ବର୍ଣ୍ଣନା କରିଛି।'
    }
  },
  {
    id: 'ch4_bbn',
    chapterNumber: 4,
    titleOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ନ୍ୟୁକ୍ଲିଓସିନ୍ଥେସିସ୍ (BBN) ଓ ପ୍ରାଥମିକ ମୌଳିକ ଉତ୍ପତ୍ତି',
    titleEn: 'Big Bang Nucleosynthesis (BBN) & Primordial Abundances',
    subtitleOr: 't = ୧୦ ସେକେଣ୍ଡ ରୁ ୨୦ ମିନିଟ୍: ୭୫% ହାଇଡ୍ରୋଜେନ୍ ଓ ୨୫% ହିଲିୟମ୍ ର ସୃଷ୍ଟି',
    subtitleEn: 'From t = 10 s to 20 min: Synthesis of 75% H, 25% He-4 and Deuterium',
    timeRange: 't = 10 seconds to 20 minutes',
    temperature: '10⁹ K down to 10⁷ K (Billion to Million Kelvin)',
    energyScale: '1 MeV to 0.05 MeV',
    dominantPhysics: 'Nuclear Strong Force Fusion & Weak Force Freeze-out',
    theme: {
      accentColor: '#f97316',
      gradient: 'from-orange-950/60 via-red-950/40 to-[#02040a]',
      borderColor: 'border-orange-500/50',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      glowColor: 'rgba(249, 115, 22, 0.35)',
      icon: '🔥'
    },
    physicalConstants: [
      { symbol: 'Δm_(n-p)', value: '1.2933', unit: 'MeV', nameOr: 'ନ୍ୟୁଟ୍ରନ୍-ପ୍ରୋଟନ୍ ଭର ପାର୍ଥକ୍ୟ', nameEn: 'n-p Mass Difference' },
      { symbol: 'τ_n', value: '879.4 ± 0.6', unit: 's', nameOr: 'ମୁକ୍ତ ନ୍ୟୁଟ୍ରନ୍ ହାଫ୍-ଲାଇଫ୍', nameEn: 'Free Neutron Lifetime' },
      { symbol: 'Y_p', value: '0.2470 ± 0.0020', unit: 'mass fraction', nameOr: 'ପ୍ରାଥମିକ ହିଲିୟମ୍-୪ ଭର ଅଂଶ', nameEn: 'Primordial He-4 Fraction' },
      { symbol: 'D/H', value: '(2.547 ± 0.025) × 10⁻⁵', unit: 'ratio', nameOr: 'ପ୍ରାଥମିକ ଡ୍ୟୁଟେରିୟମ୍ ଅନୁପାତ', nameEn: 'Primordial D/H Ratio' }
    ],
    summaryOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ୧୦ ସେକେଣ୍ଡ ପରେ ତାପମାତ୍ରା ୧ ବିଲିୟନ ଡିଗ୍ରୀକୁ ଖସି ଆସିଲା। ପ୍ରୋଟନ୍ ଓ ନ୍ୟୁଟ୍ରନ୍ ଏକତ୍ର ଫ୍ୟୁଜନ୍ ହୋଇ ପରମାଣୁର ପ୍ରଥମ ନ୍ୟୁକ୍ଲିୟସ୍ ଗଠନ କଲେ। ଏହି ୨୦ ମିନିଟ୍ ମଧ୍ୟରେ ବ୍ରହ୍ମାଣ୍ଡର ଠିକ୍ ୭୫% ହାଇଡ୍ରୋଜେନ୍ (ପ୍ରୋଟିୟମ୍), ୨୫% ହିଲିୟମ୍-୪ ଏବଂ ସାମାନ୍ୟ ଡ୍ୟୁଟେରିୟମ୍ ଓ ଲିଥିୟମ୍ ପ୍ରସ୍ତୁତ ହୋଇଗଲା। ଏହି ଅନୁପାତ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଥିଓରୀର ସବୁଠାରୁ ଅକାଟ୍ୟ ବୈଜ୍ଞାନିକ ପ୍ରମାଣ!',
    summaryEn: 'Between t = 10 seconds and 20 minutes, temperatures dropped below 1 billion K, allowing nuclear strong interactions to synthesize the primordial light isotopes: precisely ~75% Hydrogen-1, ~24.7% Helium-4, ~10⁻⁵ Deuterium, and ~10⁻¹⁰ Lithium-7. The precise agreement between predicted BBN nuclear yields and spectroscopic observations across deep cosmological space remains one of the cornerstones of modern astrophysics.',
    keyEquations: [
      {
        name: 'Neutron-to-Proton Freeze-Out Ratio (ନ୍ୟୁଟ୍ରନ୍-ପ୍ରୋଟନ୍ ଅନୁପାତ)',
        latex: '\\left(\\frac{n}{p}\\right)_{\\text{freeze}} = e^{-\\frac{\\Delta m c^2}{k_B T_{\\text{freeze}}}} \\approx e^{-\\frac{1.293 \\text{ MeV}}{0.8 \\text{ MeV}}} \\approx \\frac{1}{6} \\xrightarrow{\\text{decay}} \\frac{1}{7}',
        descriptionOr: 'ଦୁର୍ବଳ ବଳ ଫ୍ରିଜ୍-ଆଉଟ୍ ହେବା ବେଳେ ପ୍ରତି ୭ଟି ପ୍ରୋଟନ୍ ପାଇଁ ୧ଟି ନ୍ୟୁଟ୍ରନ୍ ଉପଲବ୍ଧ ଥିଲା।',
        descriptionEn: 'Governed by the mass difference between neutron and proton (1.293 MeV) at weak force freeze-out temperature.'
      },
      {
        name: 'Primordial Helium-4 Mass Fraction (ହିଲିୟମ୍-୪ ଭର ଅଂଶ Y_p)',
        latex: 'Y_p = \\frac{4 n_{He}}{n_H + 4 n_{He}} = \\frac{2 (n/p)}{1 + (n/p)} = \\frac{2 \\times (1/7)}{1 + (1/7)} = \\frac{2/7}{8/7} = 0.25 \\ (25\\%)',
        descriptionOr: 'ପ୍ରାୟ ସମସ୍ତ ମୁକ୍ତ ନ୍ୟୁଟ୍ରନ୍ ହିଲିୟମ୍-୪ ନ୍ୟୁକ୍ଲିୟସ୍ (୨ ପ୍ରୋଟନ୍ + ୨ ନ୍ୟୁଟ୍ରନ୍) ଗଠନରେ ବ୍ୟବହୃତ ହେଲା, ଯାହା ଠିକ୍ ୨୫% ଭର ହେଲା।',
        descriptionEn: 'The exact theoretical prediction of 25% primordial Helium mass fraction derived purely from nuclear physics.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ଡ୍ୟୁଟେରିୟମ୍ ବୋତଲବେକ (Deuterium Bottleneck)',
        headingEn: '1. The Deuterium Bottleneck and Nuclear Cascade',
        contentOr: 'ନ୍ୟୁକ୍ଲିଓସିନ୍ଥେସିସ୍ ସଙ୍ଗେ ସଙ୍ଗେ ଆରମ୍ଭ ହୋଇପାରିଲାନି କାରଣ ଡ୍ୟୁଟେରିୟମ୍ (୧ ପ୍ରୋଟନ୍ + ୧ ନ୍ୟୁଟ୍ରନ୍) ର ବନ୍ଧନ ଶକ୍ତି ମାତ୍ର 2.22 MeV ଥିଲା। ଉଚ୍ଚ ଶକ୍ତିଶାଳୀ ଗାମା ଫୋଟନ୍‌ଗୁଡ଼ିକ ଡ୍ୟୁଟେରିୟମ୍ ସୃଷ୍ଟି ହେବା ମାତ୍ରେ ଭାଙ୍ଗି ଦେଉଥିଲେ। t ≈ ୩ ମିନିଟ୍‌ରେ ତାପମାତ୍ରା କମିବା ପରେ ଏହି "ଡ୍ୟୁଟେରିୟମ୍ ବୋତଲବେକ୍" ଖୋଲିଲା ଏବଂ କିଛି ମିନିଟ୍ ମଧ୍ୟରେ ହିଲିୟମ୍-୪ ସିନ୍ଥେସିସ୍ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା। କୌଣସି ସ୍ଥିର ମାସ୍-୫ ବା ମାସ୍-୮ ନ୍ୟୁକ୍ଲିୟସ୍ ନଥିବାରୁ କାର୍ବନ୍ ବା ଲୁହା ସେତେବେଳେ ସୃଷ୍ଟି ହୋଇପାରିଲା ନାହିଁ। ସେଥିପାଇଁ ତାରାମାନଙ୍କ ଜନ୍ମ ଅପେକ୍ଷା କରିବାକୁ ପଡ଼ିଲା!',
        contentEn: 'Nuclear fusion could not proceed until temperatures cooled enough for deuterium (binding energy 2.22 MeV) to resist photo-disintegration by high-energy photons—a delay termed the Deuterium Bottleneck. Once cleared at t ≈ 3 minutes, reactions cascaded rapidly to He-4. Because no stable nuclear isotopes exist at mass numbers A = 5 or A = 8, nucleosynthesis stalled, leaving heavier elements (carbon, oxygen, iron) to be forged later inside stars.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'Keck Observatory & Very Large Telescope (VLT)',
        discoveryYear: '1998-2020',
        findingOr: 'ପ୍ରାଚୀନ ଆଦିମ କ୍ୱାସାର୍ (Quasar absorption spectra) ରେ ଦେଖାଗଲା ଯେ ହିଲିୟମ୍-୪ ଅନୁପାତ ୨୪.୫% ରୁ ୨୫.୦% ଏବଂ ଡ୍ୟୁଟେରିୟମ୍ (D/H) ଅନୁପାତ ୨.୫ × ୧୦⁻⁵, ଯାହା ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ସମୀକରଣ ସହ ୧୦୦% ମେଳ ଖାଏ।',
        findingEn: 'Measurements of primordial gas in low-metallicity damped Lyman-alpha systems yield D/H = (2.547 ± 0.025) × 10⁻⁵, confirming BBN predictions with extreme precision.'
      }
    ],
    vedicParallel: {
      verseText: 'ତୁଚ୍ଛେନାଭ୍ୱପିହିତଂ ୟଦାସୀତ୍ ତପସସ୍ତନ୍ମହିନା ଜାୟତୈକମ୍ ॥',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୩ (ନାସଦୀୟ ସୂକ୍ତ)',
      meaningOr: 'ଯାହା ଶୂନ୍ୟତା ଦ୍ୱାରା ଆବୃତ ଥିଲା, ତାହା ଉଚ୍ଚ ତାପ (ତପସ - Primordial Heat) ର ପ୍ରଭାବରେ ସେହି ଏକମାତ୍ର ଶକ୍ତି ରୂପେ ବିକଶିତ ହେଲା।',
      meaningEn: 'That which had been covered by the void, that One came to exist through the supreme power of fervent primal heat (Tapas).',
      philosophicalSynthesis: 'ଋଗ୍‌ବେଦରେ "ତପସ" (ପ୍ରଚଣ୍ଡ ତାପ) ରୁ ପଦାର୍ଥ ଓ ମୌଳିକ ତତ୍ତ୍ୱ ନିର୍ମାଣର ଉଲ୍ଲେଖ ନ୍ୟୁକ୍ଲିଓସିନ୍ଥେସିସ୍‌ର ୧ ବିଲିୟନ କେଲ୍‌ଭିନ୍ ତାପମାତ୍ରା ସହିତ ସମାନ।'
    }
  },
  {
    id: 'ch5_cmbr',
    chapterNumber: 5,
    titleOr: 'ରିକମ୍ବିନେସନ୍, ଆଲୋକ ମୁକ୍ତି ଓ କସ୍ମିକ୍ ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ (CMBR)',
    titleEn: 'Recombination, Photon Decoupling & The Cosmic Microwave Background',
    subtitleOr: 't = ୩୮୦,୦୦୦ ବର୍ଷ: ବ୍ରହ୍ମାଣ୍ଡର ପ୍ରଥମ ଫଟୋଗ୍ରାଫ୍ ଓ ୨.୭୨୫୫ K କୃଷ୍ଣବସ୍ତୁ ବିକିରଣ',
    subtitleEn: 'At t = 380,000 years: First Light, Recombination & 2.7255 K Blackbody',
    timeRange: 't = 379,000 years (Redshift z ≈ 1090)',
    temperature: '3,000 K (Then) → 2.7255 K (Today)',
    energyScale: '0.3 eV (Hydrogen Ionization Potential 13.6 eV threshold)',
    dominantPhysics: 'Thomson Scattering Decoupling & Saha Ionization Equilibrium',
    theme: {
      accentColor: '#f59e0b',
      gradient: 'from-amber-950/60 via-orange-950/40 to-[#02040a]',
      borderColor: 'border-amber-400/50',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      icon: '📡'
    },
    physicalConstants: [
      { symbol: 'T_0', value: '2.72548 ± 0.00057', unit: 'K', nameOr: 'ଆଜିର CMBR କୃଷ୍ଣବସ୍ତୁ ତାପମାତ୍ରା', nameEn: 'CMBR Blackbody Temperature' },
      { symbol: 'z_*', value: '1089.80 ± 0.21', unit: 'redshift', nameOr: 'ଲାଷ୍ଟ ସ୍କ୍ୟାଟରିଂ ରେଡ୍‌ସିଫ୍ଟ୍', nameEn: 'Decoupling Redshift' },
      { symbol: 'ℓ₁', value: '220.6 ± 0.5', unit: 'multipole', nameOr: 'ପ୍ରଥମ ଆକାଉଷ୍ଟିକ୍ ପିକ୍ (Flat Space)', nameEn: 'First Acoustic Peak' },
      { symbol: 'r_s', value: '147.21 ± 0.23', unit: 'Mpc', nameOr: 'ସାଉଣ୍ଡ ହୋରାଇଜନ୍ ଦୈର୍ଘ୍ୟ (Standard Ruler)', nameEn: 'Comoving Sound Horizon' }
    ],
    summaryOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ପ୍ରାୟ ୩ ଲକ୍ଷ ୮୦ ହଜାର ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ବ୍ରହ୍ମାଣ୍ଡ ଏକ କୁହୁଡ଼ିଆ ଅସ୍ୱଚ୍ଛ ପ୍ଲାଜ୍ମା (Opaque Fog) ଥିଲା, ଯେଉଁଥିରେ ଆଲୋକ ମୁକ୍ତ ହୋଇପାରୁନଥିଲା। ତାପମାତ୍ରା ୩୦୦୦ କେଲ୍‌ଭିନ୍‌କୁ ଖସିବା ପରେ ପ୍ରୋଟନ୍ ସହ ଇଲେକ୍ଟ୍ରନ୍ ମିଶି ସ୍ଥିର ହାଇଡ୍ରୋଜେନ୍ ପରମାଣୁ ଗଠନ କଲେ (Recombination)। ଫଳରେ ଫୋଟନ୍‌ଗୁଡ଼ିକ ପ୍ରଥମ ଥର ପାଇଁ ସ୍ପେସ୍‌ରେ ସ୍ୱାଧୀନ ଭାବେ ଗତି କଲେ! ଏହି ପ୍ରଥମ ଆଲୋକ ଆଜି ସାରା ବିଶ୍ୱରେ କସ୍ମିକ୍ ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ (CMBR) ରୂପେ ଭରି ରହିଛି।',
    summaryEn: 'For 379,000 years, the universe was an opaque, ionized plasma where photons were continuously Thomson-scattered by free electrons. When the cosmic temperature fell to ~3000 K (z ≈ 1090), electrons bound to protons to form neutral hydrogen atoms—an event called Recombination. The universe abruptly became transparent. The released photons have traversed expanding spacetime for 13.8 billion years, redshifted by a factor of 1090 into the microwave spectrum as the CMBR at T_0 = 2.7255 ± 0.0006 K.',
    keyEquations: [
      {
        name: 'Cosmological Redshift Temperature Scaling (ତାପମାତ୍ରା ସ୍କେଲିଂ)',
        latex: 'T(z) = T_0 (1 + z) = 2.7255 \\times (1 + 1090) \\approx 2973.5 \\text{ K}',
        descriptionOr: 'ବ୍ରହ୍ମାଣ୍ଡର ପ୍ରସାରଣ ସହିତ CMBR ର ତାପମାତ୍ରା କ୍ରମାଗତ ହ୍ରାସ ପାଇ ଆଜି ୨.୭୨୫୫ କେଲ୍‌ଭିନ୍ ହୋଇଛି।',
        descriptionEn: 'The exact inverse relationship between CMB blackbody temperature and cosmological scale factor a(t) = 1/(1+z).'
      },
      {
        name: 'Saha Ionization Equation (ସାହା ଆୟନୀକରଣ ସମୀକରଣ)',
        latex: '\\frac{n_e n_p}{n_H} = \\left(\\frac{m_e k_B T}{2\\pi \\hbar^2}\\right)^{3/2} e^{-\\frac{E_I}{k_B T}}, \\quad E_I = 13.6 \\text{ eV}',
        descriptionOr: 'ଭାରତୀୟ ପଦାର୍ଥବିଜ୍ଞାନୀ ମେଘନାଦ ସାହାଙ୍କ ଏହି ପ୍ରସିଦ୍ଧ ସମୀକରଣ ଦ୍ୱାରା ରିକମ୍ବିନେସନ୍ ସମୟ ସଠିକ୍ ଭାବେ ନିର୍ଣ୍ଣୟ କରାଯାଏ।',
        descriptionEn: 'Formulated by Indian astrophysicist Meghnad Saha, determining the ionization fraction of the primordial plasma.'
      },
      {
        name: 'CMBR Multipole Acoustic Peak (ଆକାଉଷ୍ଟିକ୍ ଆଙ୍ଗୁଲାର୍ ପିକ୍)',
        latex: '\\ell_1 \\approx \\frac{\\pi D_A(z_*)}{\\text{sound horizon } r_s(z_*)} \\approx 220',
        descriptionOr: 'CMBR ପାୱାର୍ ସ୍ପେକ୍ଟ୍ରମ୍‌ର ପ୍ରଥମ ପିକ୍ ℓ ≈ ୨୨୦ ରେ ଅବସ୍ଥିତ, ଯାହା ପ୍ରମାଣ କରେ ବ୍ରହ୍ମାଣ୍ଡର ଜ୍ୟାମିତି ସମ୍ପୂର୍ଣ୍ଣ ସମତଳ।',
        descriptionEn: 'The first acoustic peak multipole at l ≈ 220 confirms zero spatial curvature (Omega_k = 0).'
      }
    ],
    sections: [
      {
        headingOr: '୧. ପେନ୍‌ଜିଆସ୍ ଓ ୱିଲ୍‌ସନ୍‌ଙ୍କ ଆକସ୍ମିକ ଆବିଷ୍କାର (୧୯୬୪)',
        headingEn: '1. Penzias and Wilson Discovery & The Perfect Blackbody',
        contentOr: '୧୯୬୪ ମସିହାରେ ବେଲ୍ ଲ୍ୟାବ୍ସରେ ଆର୍ନୋ ପେନ୍‌ଜିଆସ୍ ଏବଂ ରବର୍ଟ ୱିଲ୍‌ସନ୍ ଏକ ବିରାଟ ହର୍ଣ୍ଣ ଆଣ୍ଟେନାରେ କାମ କରୁଥିବା ବେଳେ ଏକ ଅଦ୍ଭୁତ କ୍ରମାଗତ ଘର୍ଘର ଶବ୍ଦ (Hiss) ଶୁଣିଲେ। ସେମାନେ ପ୍ରଥମେ ଭାବିଲେ ପାରା ମଳ କାରଣରୁ ଏହା ହେଉଛି! କିନ୍ତୁ ଆଣ୍ଟେନା ସଫା କରିବା ପରେ ବି ଆକାଶର ସବୁ ଦିଗରୁ ସମାନ ଶବ୍ଦ ଆସୁଥିଲା। ଏହା ଥିଲା ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ପ୍ରଥମ ଶବ୍ଦ—କସ୍ମିକ୍ ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍! ଏଥିପାଇଁ ୧୯୭୮ ରେ ତାଙ୍କୁ ନୋବେଲ୍ ପୁରସ୍କାର ମିଳିଥିଲା।',
        contentEn: 'In 1964, Bell Labs radio astronomers Arno Penzias and Robert Wilson detected persistent, isotropic background noise in their 6-meter horn antenna. Ruling out instrumental noise and pigeon droppings, Princeton theorists Robert Dicke and Jim Peebles confirmed they had discovered the relic afterglow of the Big Bang, earning Penzias and Wilson the 1978 Nobel Prize in Physics.'
      },
      {
        headingOr: '୨. ପ୍ରକୃତିର ସବୁଠାରୁ ନିଖୁଣ କୃଷ୍ଣବସ୍ତୁ (The Ultimate Blackbody)',
        headingEn: '2. The Most Perfect Blackbody Spectrum in Nature',
        contentOr: '୧୯୯୦ ମସିହାରେ ନାସାର COBE ଉପଗ୍ରହର FIRAS ଯନ୍ତ୍ର CMBR ର ସ୍ପେକ୍ଟ୍ରମ୍ ମାପିଥିଲା। ତାହାର ତଥ୍ୟ ପ୍ଲାଙ୍କଙ୍କ କୃଷ୍ଣବସ୍ତୁ ବିକିରଣ (Planck Blackbody curve) ସହ ଏତେ ସଠିକ୍ ମେଳ ଖାଇଲା ଯେ ତତ୍ତ୍ୱ ଏବଂ ମାପ ମଧ୍ୟରେ ତ୍ରୁଟି ଦେଖାଇବା ପାଇଁ ଲେଖା ଯାଇଥିବା ଗ୍ରାଫ୍‌ର ବିନ୍ଦୁଗୁଡ଼ିକ ରେଖା ତଳେ ସମ୍ପୂର୍ଣ୍ଣ ଲୁଚିଗଲା! ଏହା ମାନବ ଇତିହାସର ସର୍ବଶ୍ରେଷ୍ଠ ବୈଜ୍ଞାନିକ ପରୀକ୍ଷଣ ମଧ୍ୟରୁ ଅନ୍ୟତମ।',
        contentEn: 'NASA COBE satellite (1990) measured the CMB spectrum with its FIRAS instrument. The measured deviation from a theoretical blackbody curve was less than 50 parts per million across the spectrum—making the CMB the most precise blackbody radiation spectrum ever measured in the laboratory or in nature.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'COBE, WMAP, and ESA Planck Space Observatory',
        discoveryYear: '1992, 2003, 2018',
        findingOr: 'ପ୍ଲାଙ୍କ ମହାକାଶଯାନ ସମଗ୍ର ଆକାଶର CMBR ତାପମାତ୍ରା ପାର୍ଥକ୍ୟ (Temperature Anisotropy) କୋଟିଏ ଭାଗରୁ ଏକ ଭାଗ ସଠିକତାରେ ମାନଚିତ୍ର ପ୍ରସ୍ତୁତ କଲା, ଯାହା ବିଶ୍ୱର ବୟସ ୧୩.୭୮୭ ବିଲିୟନ ବର୍ଷ ବୋଲି ସ୍ଥିର କଲା।',
        findingEn: 'Full-sky Planck 2018 temperature and polarization multipole maps constrained cosmic parameters: Age = 13.787 ± 0.020 Gyr, H0 = 67.4 ± 0.5 km/s/Mpc.'
      }
    ],
    vedicParallel: {
      verseText: 'କାମସ୍ତଦଗ୍ରେ ସମବର୍ତ୍ତତାଧି ମନସୋ ରେତଃ ପ୍ରଥମଂ ୟଦାସୀତ୍ । ସତୋ ବନ୍ଧୁମସତି ନିରବିନ୍ଦନ୍ ହୃଦି ପ୍ରତୀଷ୍ୟା କବୟୋ ମନୀଷା ॥',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୪ (ନାସଦୀୟ ସୂକ୍ତ)',
      meaningOr: 'ସୃଷ୍ଟିର ଆରମ୍ଭରେ କାମନା (ପ୍ରସାରଣ ଓ ମିଳନର ଇଚ୍ଛାଶକ୍ତି) ଜାଗ୍ରତ ହେଲା, ଯାହା ଚେତନାର ପ୍ରଥମ ବୀଜ ଥିଲା। ମନୀଷୀମାନେ ନିଜ ହୃଦୟରେ ଧ୍ୟାନ କରି ଅସତ୍‌ରୁ ସତ୍‌ର ସମ୍ପର୍କ ଆବିଷ୍କାର କଲେ।',
      meaningEn: 'Desire descended upon it in the beginning; that was the primal seed of mind. Sages seeking in their hearts with wisdom found the bond of being in non-being.',
      philosophicalSynthesis: 'ଅଣୁ-ପରମାଣୁ ମାନଙ୍କର ପରସ୍ପର ଆକର୍ଷଣ ଏବଂ ଆଲୋକ ମୁକ୍ତିକୁ ବେଦରେ "କାମ" ବା ଆଦ୍ୟ ସୃଷ୍ଟିର ଆକର୍ଷଣ ଶକ୍ତି ବୋଲି ବୁଝାଯାଇଛି।'
    }
  },
  {
    id: 'ch6_cosmic_web',
    chapterNumber: 6,
    titleOr: 'ଅନ୍ଧକାର ଯୁଗ, ପ୍ରଥମ ନକ୍ଷତ୍ର ଓ କସ୍ମିକ୍ ୱେବ୍ (Laniakea)',
    titleEn: 'The Dark Ages, First Stars (Pop III) & The Cosmic Web',
    subtitleOr: 't = ୧୦୦ ରୁ ୫୦୦ ନିୟୁତ ବର୍ଷ: ଡାର୍କ ମ୍ୟାଟର୍ ହାଲୋ ଏବଂ ଗାଲାକ୍ସି ମାନଙ୍କ ଜାଲ',
    subtitleEn: 'From t = 100 to 500 Myr: Jeans Collapse, Population III Stars & Cosmic Web',
    timeRange: 't = 100 to 500 Million years (z = 30 to 6)',
    temperature: '100 K down to 20 K',
    energyScale: 'Low Energy Gravitational Instability',
    dominantPhysics: 'Jeans Gravitational Instability & Cold Dark Matter (ΛCDM) Halo Clustering',
    theme: {
      accentColor: '#10b981',
      gradient: 'from-emerald-950/60 via-teal-950/40 to-[#02040a]',
      borderColor: 'border-emerald-500/50',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      icon: '🌟'
    },
    physicalConstants: [
      { symbol: 'z_reion', value: '7.68 ± 0.79', unit: 'redshift', nameOr: 'କସ୍ମିକ୍ ରି-ଆୟନାଇଜେସନ୍ ରେଡ୍‌ସିଫ୍ଟ୍', nameEn: 'Reionization Redshift' },
      { symbol: 'Ω_c', value: '0.2645 ± 0.0048', unit: 'density ratio', nameOr: 'କୋଲ୍ଡ ଡାର୍କ ମ୍ୟାଟର୍ ଘନତା', nameEn: 'Cold Dark Matter Density' },
      { symbol: 'M_J', value: '~ 10⁵', unit: 'M_sun', nameOr: 'ଆଦିମ ଜିନ୍ସ ଭର ସୀମା', nameEn: 'Primordial Jeans Mass' },
      { symbol: 'M_halo', value: '10⁶ to 10⁸', unit: 'M_sun', nameOr: 'ପ୍ରଥମ ତାରା ଜନ୍ମ ହାଲୋ ଭର', nameEn: 'Pop III Minihalo Mass' }
    ],
    summaryOr: 'ରିକମ୍ବିନେସନ୍ ପରେ ବ୍ରହ୍ମାଣ୍ଡ ପ୍ରାୟ ୧୦୦ ନିୟୁତ ବର୍ଷ ପାଇଁ ଘୋର ଅନ୍ଧକାରରେ ବୁଡ଼ି ରହିଲା (Cosmic Dark Ages)। କୌଣସି ତାରା ବା ଆଲୋକ ନଥିଲା। ଏହି ସମୟରେ ଅଦୃଶ୍ୟ ଡାର୍କ ମ୍ୟାଟର୍ (Dark Matter) ନିଜର ପ୍ରଚଣ୍ଡ ମହାକର୍ଷଣ ଦ୍ୱାରା ହାଇଡ୍ରୋଜେନ୍ ଓ ହିଲିୟମ୍ ଗ୍ୟାସ୍‌କୁ ଟାଣି ଆଣିଲା। ଫଳରେ ଜନ୍ମ ନେଲେ ପ୍ରଥମ ବିଶାଳ ନକ୍ଷତ୍ର (Population III Stars—ସୂର୍ଯ୍ୟ ଠାରୁ ଶହେ ଗୁଣ ବଡ଼) ଏବଂ ବ୍ରହ୍ମାଣ୍ଡ ପୁନର୍ବାର ଆଲୋକିତ ହେଲା (Cosmic Dawn)।',
    summaryEn: 'Following recombination, the universe entered the Cosmic Dark Ages—a period devoid of stellar sources. Non-baryonic Cold Dark Matter (CDM) collapsed into gravitational potential wells, forming a cosmic web of filaments and nodes. Inside these dark matter halos, primordial hydrogen gas cooled to trigger the Jeans instability, birthing the very first Population III hypermassive, zero-metallicity stars (M ~ 100-1000 M_sun) and reionizing the intergalactic medium.',
    keyEquations: [
      {
        name: 'Jeans Mass Instability Criterion (ଜିନ୍ସ ଭର ସୀମା)',
        latex: 'M_J = \\frac{\\pi}{6} \\rho \\left(\\frac{\\pi v_s^2}{G \\rho}\\right)^{3/2} = \\frac{\\pi^{5/2} v_s^3}{6 G^{3/2} \\rho^{1/2}}',
        descriptionOr: 'ଯଦି କୌଣସି ଗ୍ୟାସ୍ ମେଘର ଭର M > M_J ହୁଏ, ତେବେ ତାହା ନିଜ ମହାକର୍ଷଣ ବଳରେ ସଙ୍କୁଚିତ ହୋଇ ନକ୍ଷତ୍ର ସୃଷ୍ଟି କରେ।',
        descriptionEn: 'The critical threshold where gravitational attractive forces overwhelm thermal kinetic gas pressure to initiate star formation.'
      },
      {
        name: 'Navarro-Frenk-White (NFW) Dark Matter Profile (ଡାର୍କ ମ୍ୟାଟର୍ ପ୍ରୋଫାଇଲ୍)',
        latex: '\\rho(r) = \\frac{\\rho_0}{\\frac{r}{R_s} \\left(1 + \\frac{r}{R_s}\\right)^2}',
        descriptionOr: 'ଗାଲାକ୍ସି ମାନଙ୍କ ଚାରିପାଖେ ଥିବା ଡାର୍କ ମ୍ୟାଟର୍‌ର ଘନତା ବଣ୍ଟନ ସମୀକରଣ।',
        descriptionEn: 'Universal density distribution profile of dark matter halos hosting cosmic web filaments and galaxies.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ଭେରା ରୁବିନ୍ ଓ ଡାର୍କ ମ୍ୟାଟର୍ ପ୍ରମାଣ (Dark Matter Evidence)',
        headingEn: '1. Vera Rubin, Fritz Zwicky & Dark Matter Reality',
        contentOr: '୧୯୩୩ ରେ ଫ୍ରିଜ୍ ଜ୍ୱିକି କୋମା ଗାଲାକ୍ସି କ୍ଲଷ୍ଟର୍ ଅଧ୍ୟୟନ କରି ପ୍ରଥମେ "ଡୁଙ୍କଲେ ମାଟେରି" (Dark Matter) ଶବ୍ଦ ବ୍ୟବହାର କରିଥିଲେ। ୧୯୭୦ ଦଶକରେ ଆମେରିକୀୟ ମହିଳା ଜ୍ୟୋତିର୍ବିଜ୍ଞାନୀ ଭେରା ରୁବିନ୍ (Vera Rubin) ସ୍ପାଇରାଲ୍ ଗାଲାକ୍ସିମାନଙ୍କ ଘୂର୍ଣ୍ଣନ ବେଗ (Galaxy Rotation Curves) ମାପି ଆଶ୍ଚର୍ଯ୍ୟଜନକ ତଥ୍ୟ ପାଇଲେ: ଗାଲାକ୍ସିର ବାହାର ପାଖରେ ଥିବା ତାରାମାନେ ମଧ୍ୟ କେନ୍ଦ୍ର ପରି ସମାନ ଦ୍ରୁତ ଗତିରେ ଘୁରୁଛନ୍ତି! ନ୍ୟୁଟନ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ ଏମାନେ ବାହାରକୁ ଛିଞ୍ଚି ହୋଇଯିବା କଥା। ଏହା ପ୍ରମାଣ କଲା ଯେ ଗାଲାକ୍ସି ଚାରିପାଖେ ଏକ ବିଶାଳ ଅଦୃଶ୍ୟ ଡାର୍କ ମ୍ୟାଟର୍ ହାଲୋ ରହିଛି ଯାହା ତାଙ୍କୁ ବାନ୍ଧି ରଖିଛି।',
        contentEn: 'Pioneered by Fritz Zwicky (1933) and verified by Vera Rubin and Kent Ford (1970s), galactic rotation curves show orbital velocities of outer stars remain flat rather than declining Keplerian-style v ∝ r^(-1/2). This definitive proof demonstrates that galaxies are embedded in massive invisible dark matter halos comprising ~85% of all matter in the universe.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'James Webb Space Telescope (JWST) & Hubble',
        discoveryYear: '2022-2024',
        findingOr: 'JWST ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ମାତ୍ର ୩୦୦ ନିୟୁତ ବର୍ଷ ପରର ପ୍ରାଥମିକ ଗାଲାକ୍ସି JADES-GS-z14-0 (Redshift z = 14.32) ଆବିଷ୍କାର କରି ପ୍ରଥମ ନକ୍ଷତ୍ର ମାନଙ୍କ ଜନ୍ମ ଇତିହାସ ପ୍ରମାଣିତ କରିଛି।',
        findingEn: 'JWST NIRCam spectroscopy confirmed JADES-GS-z14-0 at z = 14.32, probing star formation a mere 290 Myr after the Big Bang.'
      }
    ]
  },
  {
    id: 'ch7_friedmann_equations',
    chapterNumber: 7,
    titleOr: 'ଆଇନଷ୍ଟାଇନ୍‌ଙ୍କ ସାଧାରଣ ଆପେକ୍ଷିକତା ଓ ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ',
    titleEn: 'General Relativity & The Friedmann-Lemaître-Robertson-Walker Metric',
    subtitleOr: 'ବ୍ରହ୍ମାଣ୍ଡର ଗାଣିତିକ ହୃଦସ୍ପନ୍ଦନ: H², କ୍ରିଟିକାଲ୍ ଘନତା ρ_c ଏବଂ ବିସ୍ତାରଣ ଗତିବିଜ୍ଞାନ',
    subtitleEn: 'The Mathematical Engine of Cosmology: Friedmann Equations & Critical Density',
    timeRange: 'Theoretical Framework (Applies to all t)',
    temperature: 'Governs all cosmic epochs',
    energyScale: 'General Relativistic Spacetime Curvature',
    dominantPhysics: 'Einstein Field Equations with FLRW Homogeneous & Isotropic Metric',
    theme: {
      accentColor: '#6366f1',
      gradient: 'from-indigo-950/60 via-blue-950/40 to-[#02040a]',
      borderColor: 'border-indigo-500/50',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      glowColor: 'rgba(99, 102, 241, 0.35)',
      icon: '📐'
    },
    physicalConstants: [
      { symbol: 'H_0', value: '67.4 ± 0.5', unit: 'km/s/Mpc', nameOr: 'ହବଲ୍-ଲେମେଟ୍ରେ ପ୍ରସାରଣ ଧ୍ରୁବକ', nameEn: 'Hubble Constant' },
      { symbol: 'ρ_c', value: '8.53 × 10⁻²⁷', unit: 'kg/m³', nameOr: 'ସମତଳ କ୍ରିଟିକାଲ୍ ଘନତା (~5 H/m³)', nameEn: 'Critical Density' },
      { symbol: 'Ω_tot', value: '1.0007 ± 0.0019', unit: 'ratio', nameOr: 'ମୋଟ ଘନତା ପାରାମିଟର୍ (Flat k=0)', nameEn: 'Total Density Parameter' },
      { symbol: 't_0', value: '13.787 ± 0.020', unit: 'Gyr', nameOr: 'ବ୍ରହ୍ମାଣ୍ଡର ସଠିକ୍ ବୟସ (ପ୍ଲାଙ୍କ)', nameEn: 'Age of the Universe' }
    ],
    summaryOr: '୧୯୧୫ ରେ ଆଲବର୍ଟ ଆଇନଷ୍ଟାଇନ୍ ସାଧାରଣ ଆପେକ୍ଷିକତା ତତ୍ତ୍ୱ (General Relativity) ଦେଇଥିଲେ। ୧୯୨୨ ରେ ରୁଷୀୟ ଗାଣିତିକ ଆଲେକ୍‌ଜାଣ୍ଡାର୍ ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ (Alexander Friedmann) ଏବଂ ଜର୍ଜ ଲେମେଟ୍ରେ (Georges Lemaître) ଆଇନଷ୍ଟାଇନ୍‌ଙ୍କ ଫିଲ୍ଡ୍ ଇକ୍ୱେସନ୍‌ରୁ ପ୍ରମାଣ କଲେ ଯେ ବ୍ରହ୍ମାଣ୍ଡ ସ୍ଥିର ନୁହେଁ—ତାହା ନିଶ୍ଚୟ ପ୍ରସାରିତ ହେଉଛି କିମ୍ବା ସଙ୍କୁଚିତ ହେଉଛି! ଏହି ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ ହିଁ ଆଧୁନିକ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନର ମୂଳଦୁଆ।',
    summaryEn: 'Derived by Alexander Friedmann (1922) and Georges Lemaître (1927) from Einstein Field Equations G_μν + Λg_μν = (8πG/c⁴) T_μν using the homogeneous and isotropic FLRW metric, the Friedmann equations govern the dynamical expansion rate of the cosmos as a function of matter, radiation, curvature, and dark energy.',
    keyEquations: [
      {
        name: 'First Friedmann Equation (ପ୍ରଥମ ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ)',
        latex: 'H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3} \\rho - \\frac{k c^2}{a^2} + \\frac{\\Lambda c^2}{3}',
        descriptionOr: 'ହବଲ୍ ପ୍ରସାରଣ ହାର H ବ୍ରହ୍ମାଣ୍ଡର ମୋଟ ଘନତା ρ, ଜ୍ୟାମିତିକ ବକ୍ରତା k ଏବଂ କସ୍ମୋଲୋଜିକାଲ୍ କନ୍‌ଷ୍ଟାଣ୍ଟ Λ ସହ କିପରି ସମ୍ପୃକ୍ତ ତାହା ଦର୍ଶାଏ।',
        descriptionEn: 'The primary dynamic cosmological equation relating Hubble expansion parameter to energy density components and curvature.'
      },
      {
        name: 'Second Friedmann / Acceleration Equation (ଦ୍ୱିତୀୟ ତ୍ୱରଣ ସମୀକରଣ)',
        latex: '\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left(\\rho + \\frac{3p}{c^2}\\right) + \\frac{\\Lambda c^2}{3}',
        descriptionOr: 'ବ୍ରହ୍ମାଣ୍ଡର ପ୍ରସାରଣ ତ୍ୱରାନ୍ୱିତ (Accelerating) ହେଉଛି ନା ମନ୍ଥର ହେଉଛି ତାହା ନିର୍ଣ୍ଣୟ କରେ।',
        descriptionEn: 'Determines the cosmic acceleration; negative pressure (p < -rho c^2 / 3) drives cosmic acceleration.'
      },
      {
        name: 'Critical Density (କ୍ରିଟିକାଲ୍ ଘନତା ρ_c)',
        latex: '\\rho_c = \\frac{3 H_0^2}{8\\pi G} \\approx 8.53 \\times 10^{-27} \\text{ kg/m}^3 \\approx 5 \\text{ protons/m}^3',
        descriptionOr: 'ବ୍ରହ୍ମାଣ୍ଡକୁ ସମତଳ ରଖିବା ପାଇଁ ଆବଶ୍ୟକ ଘନତା। ମାତ୍ର ପ୍ରତି ଘନ ମିଟରରେ ୫ଟି ପ୍ରୋଟନ୍‌ର ଓଜନ!',
        descriptionEn: 'The precise boundary density separating an open hyperbolic universe from a closed spherical universe.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ଡେନ୍ସିଟି ପାରାମିଟର୍ (Omega: Ω_m, Ω_r, Ω_Λ)',
        headingEn: '1. Cosmic Density Parameters and Geometry',
        contentOr: 'ବ୍ରହ୍ମାଣ୍ଡର ଭବିଷ୍ୟତ ୩ଟି ଉପାଦାନ ଉପରେ ନିର୍ଭର କରେ:\n୧. Ω_m (ପଦାର୍ଥ ଘନତା): ସାଧାରଣ ପରମାଣୁ + ଡାର୍କ ମ୍ୟାଟର୍ = ୩୧.୫%\n୨. Ω_r (ବିକିରଣ ଘନତା): ଆଲୋକ ଓ ନ୍ୟୁଟ୍ରିନୋ = ୦.୦୧%\n୩. Ω_Λ (ଡାର୍କ ଏନର୍ଜି): ଶୂନ୍ୟସ୍ଥାନର ପ୍ରସାରଣ ଶକ୍ତି = ୬୮.୫%\nମୋଟ Ω_tot = Ω_m + Ω_r + Ω_Λ = ୧.୦୦୦! ଏହାର ଅର୍ଥ ଆମ ବ୍ରହ୍ମାଣ୍ଡ ସମ୍ପୂର୍ଣ୍ଣ ସମତଳ (k = 0), ଯେଉଁଠାରେ ତ୍ରିଭୁଜର ୩ କୋଣର ସମଷ୍ଟି ଠିକ୍ ୧୮୦ ଡିଗ୍ରୀ।',
        contentEn: 'Dimensionless density parameters normalize each component against critical density: Omega_i = rho_i / rho_c. Modern observational consensus (Planck 2018) confirms: Omega_baryon = 0.049, Omega_CDM = 0.265, Omega_Lambda = 0.685, yielding Omega_total = 1.0007 ± 0.0019 (k = 0, flat spatial geometry).'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'Sloan Digital Sky Survey (SDSS) & Baryon Acoustic Oscillations',
        discoveryYear: '2005-2023',
        findingOr: 'କୋଟି କୋଟି ଗାଲାକ୍ସିଙ୍କ 3D ମାନଚିତ୍ର ପ୍ରସ୍ତୁତ କରି ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ ଅନୁସାରେ ବ୍ରହ୍ମାଣ୍ଡର ବିସ୍ତାରଣ ଇତିହାସ ସଠିକ୍ ଭାବେ ପ୍ରମାଣିତ ହୋଇଛି।',
        findingEn: 'Baryon Acoustic Oscillation (BAO) standard ruler measurements across redshifts z = 0.1 to 2.4 strictly constrain H(z) evolution consistent with Friedmann Lambda-CDM.'
      }
    ]
  },
  {
    id: 'ch8_dark_energy',
    chapterNumber: 8,
    titleOr: 'ତ୍ୱରାନ୍ୱିତ ବ୍ରହ୍ମାଣ୍ଡ, ଡାର୍କ ଏନର୍ଜି ଓ ଚରମ ପରିଣତି (The 4 Fates)',
    titleEn: 'Accelerating Expansion, Dark Energy & The Four Cosmic Fates',
    subtitleOr: '୧୯୯୮ ସୁପରନୋଭା ଆବିଷ୍କାର, କସ୍ମୋଲୋଜିକାଲ୍ କନ୍‌ଷ୍ଟାଣ୍ଟ୍ ଓ ବିଶ୍ୱର ଭବିଷ୍ୟତ',
    subtitleEn: '1998 Type Ia Supernovae, w = -1 Equation of State & Ultimate End of the Cosmos',
    timeRange: 'Present Epoch to t → ∞',
    temperature: '2.7255 K → 0.0000 K (Approaching Absolute Zero)',
    energyScale: 'Vacuum Energy Density ρ_Λ ≈ 10⁻²⁹ g/cm³',
    dominantPhysics: 'Dark Energy Dominance & Equation of State w = p / (ρc²)',
    theme: {
      accentColor: '#ec4899',
      gradient: 'from-pink-950/60 via-purple-950/40 to-[#02040a]',
      borderColor: 'border-pink-500/50',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      glowColor: 'rgba(236, 72, 153, 0.35)',
      icon: '🌌'
    },
    physicalConstants: [
      { symbol: 'Ω_Λ', value: '0.6847 ± 0.0073', unit: 'density ratio', nameOr: 'ଡାର୍କ ଏନର୍ଜି ଶକ୍ତି ଅନୁପାତ (୬୮.୫%)', nameEn: 'Dark Energy Density' },
      { symbol: 'w', value: '-1.028 ± 0.032', unit: 'equation of state', nameOr: 'ଡାର୍କ ଏନର୍ଜି ଚାପ ଅନୁପାତ (w = -1)', nameEn: 'DE Equation of State' },
      { symbol: 'q_0', value: '-0.528 ± 0.015', unit: 'deceleration parameter', nameOr: 'ଆଜିର ତ୍ୱରଣ ପାରାମିଟର୍ (Negative!)', nameEn: 'Deceleration Parameter' },
      { symbol: 'Λ', value: '1.088 × 10⁻⁵²', unit: 'm⁻²', nameOr: 'ଆଇନଷ୍ଟାଇନ୍ କସ୍ମୋଲୋଜିକାଲ୍ କନ୍‌ଷ୍ଟାଣ୍ଟ', nameEn: 'Cosmological Constant' }
    ],
    summaryOr: '୧୯୯୮ ମସିହାରେ ବୈଜ୍ଞାନିକମାନେ ଦୂରବର୍ତ୍ତୀ Type Ia ସୁପରନୋଭା ନକ୍ଷତ୍ରମାନଙ୍କୁ ଦେଖି ଚକିତ ହୋଇଗଲେ: ବ୍ରହ୍ମାଣ୍ଡର ପ୍ରସାରଣ ଧୀମା ହେବା ବଦଳରେ ଦିନକୁ ଦିନ ଆହୁରି ଦ୍ରୁତ ଗତିରେ ତ୍ୱରାନ୍ୱିତ (Accelerating) ହେଉଛି! ଏକ ରହସ୍ୟମୟ ଶକ୍ତି—ଡାର୍କ ଏନର୍ଜି (Dark Energy)—ସ୍ପେସ୍‌କୁ ପରସ୍ପରଠାରୁ ଦୂରକୁ ଠେଲି ଦେଉଛି। ଏହି ଅଧ୍ୟାୟରେ ବ୍ରହ୍ମାଣ୍ଡର ୪ଟି ସମ୍ଭାବ୍ୟ ଚରମ ଭବିଷ୍ୟତ ବର୍ଣ୍ଣିତ: ବିଗ୍ ଫ୍ରିଜ୍ (ହିଟ୍ ଡେଥ୍), ବିଗ୍ ରିପ୍, ବିଗ୍ କ୍ରଞ୍ଚ୍, ଏବଂ ବିଗ୍ ବାଉନ୍ସ।',
    summaryEn: 'In 1998, observations of distant Type Ia supernovae by the High-Z Supernova Search Team and the Supernova Cosmology Project revealed that the expansion of the universe is not decelerating, but accelerating. Driven by Dark Energy (~68.3% of cosmic energy budget) characterized by negative pressure equation of state w ≈ -1, the cosmos faces four theoretical endpoints: Big Freeze (Heat Death), Big Rip, Big Crunch, or cyclic Big Bounce.',
    keyEquations: [
      {
        name: 'Dark Energy Equation of State (ଡାର୍କ ଏନର୍ଜି ଅବସ୍ଥା ସମୀକରଣ)',
        latex: 'w = \\frac{p}{\\rho c^2} \\approx -1.028 \\pm 0.032',
        descriptionOr: 'ଋଣାତ୍ମକ ଚାପ (Negative Pressure) ଯୋଗୁଁ ମହାକର୍ଷଣ ଆକର୍ଷଣ ବଦଳରେ ବିକର୍ଷଣ (Repulsion) ସୃଷ୍ଟି କରେ।',
        descriptionEn: 'An equation of state parameter w = -1 precisely matches Einstein Cosmological Constant (Vacuum Energy).'
      },
      {
        name: 'Hubble Expansion Horizon Acceleration (ହବଲ୍ ପ୍ରସାରଣ)',
        latex: '\\ddot{a} > 0 \\iff w < -\\frac{1}{3} \\quad \\text{for } \\rho > 0',
        descriptionOr: 'ଯେତେବେଳେ ଚାପ w < -1/3 ହୁଏ, ସେତେବେଳେ ବ୍ରହ୍ମାଣ୍ଡର ପ୍ରସାରଣ ସ୍ୱୟଂଚାଳିତ ଭାବେ ତ୍ୱରାନ୍ୱିତ ହୁଏ।',
        descriptionEn: 'The mathematical condition derived from Friedmann acceleration equation requiring negative pressure for cosmic acceleration.'
      }
    ],
    sections: [
      {
        headingOr: '୧. ବ୍ରହ୍ମାଣ୍ଡର ୪ଟି ଚରମ ଭବିଷ୍ୟତ (The 4 Cosmological Fates)',
        headingEn: '1. The Four Possible Endings of the Universe',
        contentOr: 'ବିଜ୍ଞାନ ଅନୁସାରେ ଆମ ବିଶ୍ୱର ୪ଟି ପରିଣତି ହୋଇପାରେ:\n୧. ବିଗ୍ ଫ୍ରିଜ୍ ବା ହିଟ୍ ଡେଥ୍ (Big Freeze / Heat Death - ସବୁଠାରୁ ସମ୍ଭାବ୍ୟ): ପ୍ରସାରଣ ଜାରି ରହିବ। ୧୦୦ ଟ୍ରିଲିୟନ ବର୍ଷ ପରେ ସମସ୍ତ ତାରା ଲିଭିଯିବେ। କେବଳ ବ୍ଲାକ୍ ହୋଲ୍ ରହିବେ, ଯାହା ହକିଂ ରେଡିଏସନ୍ ଦ୍ୱାରା ଶେଷରେ ବାଷ୍ପୀଭୂତ ହୋଇଯିବେ। ବ୍ରହ୍ମାଣ୍ଡ ପରମ ଶୂନ୍ୟ ତାପମାତ୍ରାରେ ଚିର ଅନ୍ଧକାରରେ ନିଶ୍ଚଳ ହୋଇଯିବ।\n୨. ବିଗ୍ ରିପ୍ (Big Rip): ଯଦି ଡାର୍କ ଏନର୍ଜି (Phantom Energy, w < -1) ବଢ଼ିଚାଲେ, ତେବେ ଭବିଷ୍ୟତରେ ପ୍ରଥମେ ଗାଲାକ୍ସି, ପରେ ସୌରମଣ୍ଡଳ, ପୃଥିବୀ, ଏବଂ ଶେଷରେ ପରମାଣୁ ଓ ସ୍ପେସ୍ ନିଜେ ଛିଣ୍ଡି ଖଣ୍ଡବିଖଣ୍ଡ ହୋଇଯିବ!\n୩. ବିଗ୍ କ୍ରଞ୍ଚ୍ (Big Crunch): ଯଦି ମହାକର୍ଷଣ ବଳ ପୁଣି ଜିତିଯାଏ, ବ୍ରହ୍ମାଣ୍ଡ ସଙ୍କୁଚିତ ହୋଇ ପୁଣି ସିଙ୍ଗୁଲାରିଟିରେ ପରିଣତ ହେବ।\n୪. ବିଗ୍ ବାଉନ୍ସ (Big Bounce): ବ୍ରହ୍ମାଣ୍ଡ କଦାପି ମରେ ନାହିଁ; ତାହା ଥରେ ପ୍ରସାରିତ ହୁଏ (ସୃଷ୍ଟି) ଏବଂ ପୁଣି ସଙ୍କୁଚିତ ହୁଏ (ପ୍ରଳୟ), ଏବଂ ନୂଆ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଜନ୍ମ ନିଏ। ଏହା ବୈଦିକ କଳ୍ପଚକ୍ର ସହ ସମ୍ପୂର୍ଣ୍ଣ ସମାନ!',
        contentEn: 'Astrophysics defines four theoretical terminal trajectories for the cosmos:\n1. The Big Freeze (Heat Death - Standard Model Consensus): Continued exponential expansion dilutes matter and energy. Star formation ceases in ~100 trillion years. Black holes slowly evaporate via Hawking radiation over 10^100 years, leaving maximum thermodynamic entropy at absolute zero.\n2. The Big Rip: If phantom dark energy (w < -1) escalates, cosmic expansion becomes infinite in finite time, tearing apart galaxy clusters, solar systems, planets, atoms, and finally spacetime itself.\n3. The Big Crunch: If gravitational attraction overcomes dark energy, cosmic expansion reverses into collapse toward a terminal fiery singularity.\n4. The Big Bounce (Cyclic Model): Spacetime undergoes an eternal series of expansions and contractions, matching the Vedic Kalpa cosmological cycle.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'High-Z Supernova Team & Supernova Cosmology Project',
        discoveryYear: '1998 (Nobel Prize 2011)',
        findingOr: 'ସାଉଲ୍ ପର୍ଲମୁଟର୍, ବ୍ରାଏନ୍ ସ୍କ୍ୱିମିଟ୍ ଏବଂ ଆଦାମ୍ ରିସ୍ ସୁପରନୋଭା ମାପି ପ୍ରମାଣ କଲେ ଯେ ବ୍ରହ୍ମାଣ୍ଡ ତ୍ୱରାନ୍ୱିତ ପ୍ରସାରଣରେ ଅଛି।',
        findingEn: 'Measurements of luminosity distances to high-z Type Ia standard candles demonstrated accelerated cosmic expansion, awarded the 2011 Nobel Prize in Physics.'
      }
    ]
  },
  {
    id: 'ch9_vedic_synthesis',
    chapterNumber: 9,
    titleOr: 'ବୈଦିକ ସୃଷ୍ଟି ବିଜ୍ଞାନ, ନାସଦୀୟ ସୂକ୍ତ ଓ ଚକ୍ରୀୟ ବ୍ରହ୍ମାଣ୍ଡ (Cosmic Cycles)',
    titleEn: 'Vedic Genesis, The Nasadiya Sukta & Cyclic Cosmology (Kalpa Engine)',
    subtitleOr: '୩୧୧.୦୪ ଟ୍ରିଲିୟନ ବର୍ଷର ମହାକଳ୍ପ ଏବଂ ପେନ୍‌ରୋଜ୍ CCC ଥିଓରୀର ଅଦ୍ଭୁତ ସମନ୍ୱୟ',
    subtitleEn: 'Surya Siddhanta 311 Trillion-Year Maha-Kalpa & Roger Penrose Conformal Cyclic Cosmology',
    timeRange: 'Deep Geologic & Cosmic Time (Brahma Lifetime = 3.11 × 10¹⁴ Years)',
    temperature: 'Cyclic Oscillations across Creation (Srishti) and Dissolution (Pralaya)',
    energyScale: 'Holistic Metaphysical & Mathematical Cosmological Time Scales',
    dominantPhysics: 'Conformal Cyclic Cosmology (CCC), Ekpyrotic Braneworlds & Vedic Astronomy',
    theme: {
      accentColor: '#ea580c',
      gradient: 'from-orange-950/60 via-amber-950/40 to-[#02040a]',
      borderColor: 'border-orange-500/50',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      glowColor: 'rgba(234, 88, 12, 0.35)',
      icon: '📜'
    },
    physicalConstants: [
      { symbol: '1 Kalpa (କଳ୍ପ)', value: '4.32 × 10⁹', unit: 'Solar Years', nameOr: 'ବ୍ରହ୍ମାଙ୍କ ଗୋଟିଏ ଦିନ (ପୃଥିବୀ ବୟସ ୪.୫୪ Gyr ନିକଟତମ)', nameEn: '1 Day of Brahma' },
      { symbol: '1 Mahayuga', value: '4,320,000', unit: 'Solar Years', nameOr: 'ସତ୍ୟ, ତ୍ରେତୟା, ଦ୍ୱାପର ଓ କଳି ଚତୁର୍ଯୁଗ', nameEn: 'Great Epoch' },
      { symbol: '1 Para (ପର)', value: '3.1104 × 10¹⁴', unit: 'Solar Years', nameOr: 'ବ୍ରହ୍ମାଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ଆୟୁଷ (୩୧୧ ଟ୍ରିଲିୟନ ବର୍ଷ)', nameEn: 'Maha-Kalpa Lifetime' },
      { symbol: 'Surya Siddhanta', value: `Year ${new Date().getFullYear() + 3102}`, unit: 'Kali Yuga', nameOr: 'କଳିଯୁଗର ଚାଲୁଥିବା ବର୍ଷ', nameEn: 'Current Kali Era' }
    ],
    summaryOr: 'ସାରା ବିଶ୍ୱର ପ୍ରାଚୀନ ସଭ୍ୟତା ମଧ୍ୟରେ କେବଳ ବୈଦିକ ଭାରତୀୟ ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ ବିଲିୟନ ଓ ଟ୍ରିଲିୟନ ବର୍ଷର ମହାଜାଗତିକ ସମୟ ମାପ (Cosmic Time Scales) ଗଣନା କରିଥିଲା। ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ ଅନୁଯାୟୀ ବ୍ରହ୍ମାଙ୍କର ଗୋଟିଏ ଦିନ (କଳ୍ପ) ହେଉଛି ୪.୩୨ ବିଲିୟନ ବର୍ଷ, ଏବଂ ତାଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ଜୀବନକାଳ (ମହାକଳ୍ପ / ପର) ହେଉଛି ୩୧୧.୦୪ ଟ୍ରିଲିୟନ ବର୍ଷ! ନୋବେଲ୍ ବିଜେତା ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍‌ଙ୍କ Conformal Cyclic Cosmology (CCC) ପ୍ରମାଣ କରେ ଯେ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଏକମାତ୍ର ଆରମ୍ଭ ନୁହେଁ, ବରଂ ଅନନ୍ତ କଳ୍ପ ଚକ୍ରର ଏକ ଅଂଶ।',
    summaryEn: 'Among all ancient civilizations, only ancient Indian Vedic astronomy conceptualized cosmological timescales spanning billions and trillions of years matching modern astrophysics. In the Surya Siddhanta and Puranas, a single Day of Brahma (Kalpa) spans 4.32 billion years, while the lifetime of Brahma (Maha-Kalpa or Para) spans 311.04 trillion years. Nobel laureate Sir Roger Penrose Conformal Cyclic Cosmology (CCC) and Steinhardt-Turok braneworld cosmology mathematically parallel this ancient insight of infinite, recurrent cosmic creation (Srishti) and dissolution (Pralaya).',
    keyEquations: [
      {
        name: 'Vedic Kalpa Time Equation (ବୈଦିକ କଳ୍ପ ସମୀକରଣ)',
        latex: '1 \\text{ Kalpa (କଳ୍ପ)} = 1,000 \\text{ Mahayugas} = 4.32 \\times 10^9 \\text{ Solar Years} \\approx 4.32 \\text{ Billion Years}',
        descriptionOr: 'ପୃଥିବୀର ବୟସ (୪.୫୪ ବିଲିୟନ ବର୍ଷ) ଏହି ୪.୩୨ ବିଲିୟନ ବର୍ଷର କଳ୍ପ ସହିତ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଭାବେ ନିକଟବର୍ତ୍ତୀ!',
        descriptionEn: '1 Kalpa = 1,000 Mahayugas = 4.32 billion solar years, closely matching the age of the Earth (~4.54 billion years).'
      },
      {
        name: 'Maha-Kalpa (ବ୍ରହ୍ମାଙ୍କ ଆୟୁଷ - Life of Brahma)',
        latex: '1 \\text{ Para (ମହାକଳ୍ପ)} = 100 \\text{ Brahma Years} = 3.1104 \\times 10^{14} \\text{ Solar Years} \\approx 311.04 \\text{ Trillion Years}',
        descriptionOr: 'ଏହା ହେଉଛି ବିଶ୍ୱ ଇତିହାସରେ ସର୍ବବୃହତ ସାଂସ୍କୃତିକ-ବୈଜ୍ଞାନିକ ସମୟ ମାପକାଠି।',
        descriptionEn: 'The complete lifespan of cosmic manifestation: 311.04 trillion solar years, anticipating modern deep-time cosmology.'
      }
    ],
    sections: [
      {
        headingOr: '୧. କାର୍ଲ ସାଗାନ୍‌ଙ୍କ ଉକ୍ତି (Carl Sagan on Vedic Cosmology)',
        headingEn: '1. Carl Sagan Tribute to Indian Cosmic Time',
        contentOr: 'ବିଶିଷ୍ଟ ମାର୍କିନ୍ ବୈଜ୍ଞାନିକ ତଥା ନାସା ପରାମର୍ଶଦାତା ଡକ୍ଟର କାର୍ଲ ସାଗାନ୍ ତାଙ୍କ ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ "Cosmos" ରେ ଲେଖିଥିଲେ:\n"ହିନ୍ଦୁ ଧର୍ମ ହେଉଛି ପୃଥିବୀର ଏକମାତ୍ର ପ୍ରାଚୀନ ଧର୍ମ, ଯାହା ବିଶ୍ୱାସ କରେ ଯେ ବ୍ରହ୍ମାଣ୍ଡ ନିଜେ ଏକ ଅନନ୍ତ ମୃତ୍ୟୁ ଏବଂ ପୁନର୍ଜନ୍ମର ଚକ୍ର ଦେଇ ଗତି କରେ। ଏହା ହେଉଛି ଏକମାତ୍ର ଧର୍ମ ଯାହାର ସମୟ ସ୍କେଲ୍ ଆଧୁନିକ ବୈଜ୍ଞାନିକ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ ସହିତ ସମ୍ପୂର୍ଣ୍ଣ ମେଳ ଖାଏ। ଏହାର ସମୟ ମାପକାଠି ସାଧାରଣ ଦିନ-ରାତିରୁ ଆରମ୍ଭ କରି କୋଟି କୋଟି ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ବିସ୍ତୃତ।"',
        contentEn: 'Renowned astrophysicist and science communicator Dr. Carl Sagan wrote in "Cosmos":\n"The Hindu religion is the only one of the world\'s great faiths dedicated to the idea that the Cosmos itself undergoes an immense, indeed an infinite, number of deaths and rebirths. It is the only religion in which the time scales correspond, to those of modern scientific cosmology. Its cycles run from our ordinary day and night to a day and night of Brahma, 8.64 billion years long. Longer than the age of the Earth or the Sun and about half the time since the Big Bang. And there are much longer time scales still."'
      },
      {
        headingOr: '୨. ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍‌ଙ୍କ CCC ଥିଓରୀ (Conformal Cyclic Cosmology)',
        headingEn: '2. Sir Roger Penrose Conformal Cyclic Cosmology (CCC)',
        contentOr: '୨୦୨୦ ପଦାର୍ଥ ବିଜ୍ଞାନ ନୋବେଲ୍ ପୁରସ୍କାର ବିଜେତା ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍ (Sir Roger Penrose) ପ୍ରସ୍ତାବ ଦେଇଛନ୍ତି ଯେ ଆମ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଏକମାତ୍ର ନୁହେଁ। ଏକ ପୂର୍ବ ବ୍ରହ୍ମାଣ୍ଡ (Aeon) ଯେତେବେଳେ ପ୍ରସାରିତ ହୋଇ ସମସ୍ତ ପଦାର୍ଥ ଫୋଟନ୍‌ରେ ପରିଣତ ହୋଇଯାଏ, ସେତେବେଳେ ସ୍ପେସ୍ ଓ ସମୟର ମାପକାଠି ଶୂନ୍ୟ ହୋଇଯାଏ ଏବଂ ତାହା ଏକ ନୂଆ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ସିଙ୍ଗୁଲାରିଟିରେ ପରିଣତ ହୁଏ! ପ୍ଲାଙ୍କ ଉପଗ୍ରହର CMBR ରେ ସେ "Hawking Points" ବା ପୂର୍ବ ଜନ୍ମର ବ୍ଲାକ୍ ହୋଲ୍‌ର ଚିହ୍ନ ଥିବା ଦାବି କରିଛନ୍ତି। ଏହା ପ୍ରାଚୀନ ଋଷିମାନଙ୍କ "ସୃଷ୍ଟି ଓ ପ୍ରଳୟ ଚକ୍ର" ସହିତ ଗଭୀର ଭାବେ ମେଳ ଖାଏ।',
        contentEn: 'Nobel laureate Sir Roger Penrose formulated Conformal Cyclic Cosmology (CCC), proposing that the infinite future of an expanding cosmic Aeon—when all mass has dissolved into massless conformal radiation—rescales conformally to become the low-entropy Big Bang singularity of the subsequent Aeon. Penrose claims potential observational evidence for CCC in concentric low-variance circles ("Hawking Points") within the Planck CMB sky, providing mathematical grounding for eternal cosmic recurrence.'
      }
    ],
    observationalEvidence: [
      {
        instrumentOrMission: 'Planck CMB Data Analysis (Gurzadyan & Penrose)',
        discoveryYear: '2010-2020',
        findingOr: 'ପ୍ଲାଙ୍କ CMB ମାନଚିତ୍ରରେ କେନ୍ଦ୍ରୀଭୂତ କମ୍-ଭାରିଏନ୍ସ ବଳୟ (Concentric rings with anomalously low variance) ଚିହ୍ନଟ ହୋଇଛି, ଯାହା ପୂର୍ବ କଳ୍ପର ବ୍ଲାକ୍ ହୋଲ୍ ମିଶ୍ରଣର ତରଙ୍ଗ ବୋଲି ପେନ୍‌ରୋଜ୍ ଦାବି କରିଛନ୍ତି। (ବିବାଦାସ୍ପଦ - ଏହା Planck ଦଳ ଦ୍ୱାରା ପ୍ରଶ୍ନବାଚୀ)',
        findingEn: 'Analysis of WMAP and Planck CMB temperature maps revealed statistically significant concentric rings consistent with gravitational wave bursts from supermassive black hole collisions in an Aeon preceding our Big Bang. (Disputed — challenged by Planck Collaboration 2013)'
      }
    ],
    vedicParallel: {
      verseText: 'ସୂର୍ଯ୍ୟାଚନ୍ଦ୍ରମସୌ ଧାତା ୟଥାପୂର୍ବମକଳ୍ପୟତ୍ । ଦିବଂ ଚ ପୃଥିବୀଂ ଚାନ୍ତରିକ୍ଷମଥୋ ସ୍ୱଃ ॥',
      source: 'ଋଗ୍‌ବେଦ ୧୦.୧୯୦.୩ (ଋତଂ ଚ ସତ୍ୟଂ ଚାଭୀଦ୍ଧାତ୍ସୂକ୍ତ)',
      meaningOr: 'ପରମ ସ୍ରଷ୍ଟା ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ସ୍ୱର୍ଗ, ପୃଥିବୀ ଏବଂ ମହାକାଶକୁ ଠିକ୍ ସେହିପରି ପୁନଃ ନିର୍ମାଣ କଲେ ଯେପରି ସେ ପୂର୍ବ କଳ୍ପରେ (ପୂର୍ବ ବ୍ରହ୍ମାଣ୍ଡରେ) ନିର୍ମାଣ କରିଥିଲେ।',
      meaningEn: 'The Creator fashioned the sun and the moon, the heavens, the earth, and the intermediate realm of light, exactly as He had fashioned them in the previous cosmic cycle (Kalpa).',
      philosophicalSynthesis: 'ଋଗ୍‌ବେଦର "ୟଥାପୂର୍ବମକଳ୍ପୟତ୍" (ପୂର୍ବ କଳ୍ପ ପରି ପୁନଃ ନିର୍ମାଣ) ବାକ୍ୟାଂଶ ସ୍ପଷ୍ଟ ଭାବେ ପ୍ରମାଣ କରେ ଯେ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଏକ ନିରନ୍ତର ଚକ୍ରୀୟ ପ୍ରକ୍ରିୟା, ଯାହା ଆଧୁନିକ ଚକ୍ରୀୟ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ (Cyclic Universe) ସହ ସମ୍ପୂର୍ଣ୍ଣ ସୁସଙ୍ଗତ।'
    }
  }
];
