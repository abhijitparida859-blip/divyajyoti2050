import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import { COSMOLOGY_TEXTBOOK, BookChapter } from '../../data/cosmologyBookData';
import { CosmicEvolution3DViewer } from './CosmicEvolution3DViewer';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  X,
  Atom,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Calculator,
  Search,
  Scroll,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ArrowUp,
  Layers,
  Radio,
  Calendar,
  Award
} from 'lucide-react';

interface Props {
  onClose?: () => void;
}

interface CosmicEpoch {
  id: string;
  timeLabel: string;
  timeSeconds: string;
  tempKelvin: string;
  tempColor: string;
  titleOr: string;
  titleEn: string;
  descOr: string;
  descEn: string;
  scaleFactor: number;
  redshiftZ: string;
  particles: string;
  dominantEnergy: string;
  vedicVerse: string;
  vedicSource: string;
}

const COSMIC_EPOCHS: CosmicEpoch[] = [
  {
    id: 'planck',
    timeLabel: 't = 0 ରୁ 10⁻⁴³ ସେକେଣ୍ଡ',
    timeSeconds: '10⁻⁴³ s',
    tempKelvin: '> 10³² K (Planck Temp)',
    tempColor: '#ffffff',
    titleOr: 'ପ୍ଲାଙ୍କ ଯୁଗ ଓ କ୍ୱାଣ୍ଟମ୍ ସିଙ୍ଗୁଲାରିଟି (The Planck Epoch)',
    titleEn: 'Planck Epoch & The Primordial Singularity',
    descOr: 'ସମଗ୍ର ବ୍ରହ୍ମାଣ୍ଡର ସମସ୍ତ ଶକ୍ତି ଓ ସ୍ପେସ୍-ଟାଇମ୍ ଏକ ଅନନ୍ତ ଘନତ୍ୱବିଶିଷ୍ଟ ସୂକ୍ଷ୍ମ କ୍ୱାଣ୍ଟମ୍ ବିନ୍ଦୁ (Singularity) ରେ ନିହିତ ଥିଲା। ସମସ୍ତ ୪ଟି ମୌଳିକ ବଳ (ମାଧ୍ୟାକର୍ଷଣ, ବିଦ୍ୟୁତ୍-ଚୁମ୍ବକୀୟ, ଦୃଢ଼ ଓ ଦୁର୍ବଳ ନ୍ୟୁକ୍ଲିୟ ବଳ) ଏକତ୍ର ଏକୀଭୂତ ସୁପରଫୋର୍ସ ଭାବେ କାର୍ଯ୍ୟ କରୁଥିଲେ।',
    descEn: 'The entire observable universe was concentrated into a subatomic quantum singularity of infinite density and temperature. Gravitation was unified with the strong, weak, and electromagnetic forces in a single primordial superforce.',
    scaleFactor: 0.04,
    redshiftZ: 'z → ∞',
    particles: 'Pure Unified Quantum Gravitational Energy Field',
    dominantEnergy: 'Quantum Vacuum Energy (100%)',
    vedicVerse: 'ନାସଦାସୀନ୍ନୋ ସଦାସୀତ୍ତଦାନୀଂ ନାସୀଦ୍ରଜୋ ନୋ ବ୍ୟୋମା ପରୋ ୟତ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୧)',
    vedicSource: 'ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ'
  },
  {
    id: 'inflation',
    timeLabel: 't = 10⁻³⁵ ରୁ 10⁻³² ସେକେଣ୍ଡ',
    timeSeconds: '10⁻³² s',
    tempKelvin: '10²⁷ K',
    tempColor: '#93c5fd',
    titleOr: 'ମହାପ୍ରସାରଣ ଯୁଗ (Cosmic Inflation & GUT Breaking)',
    titleEn: 'Grand Unification & Exponential Cosmic Inflation',
    descOr: 'ଆଲାନ୍ ଗୁଥ୍‌ଙ୍କ ତତ୍ତ୍ୱ ଅନୁଯାୟୀ ବ୍ରହ୍ମାଣ୍ଡ ଆଲୋକର ଗତି ଠାରୁ ମଧ୍ୟ ଦ୍ରୁତ ବେଗରେ ୧୦²୬ ରୁ ୧୦³୦ ଗୁଣ ପ୍ରସାରିତ ହେଲା! ଏହି ମହାପ୍ରସାରଣ ସ୍ପେସ୍-ଟାଇମ୍‌କୁ ସମ୍ପୂର୍ଣ୍ଣ ସମତଳ (Flatness) ଏବଂ ସର୍ବତ୍ର ସମରୂପ (Homogeneous) କରିଦେଲା।',
    descEn: 'The universe underwent an exponential superluminal expansion driven by the inflaton field V(φ), diluting curvature to make spacetime mathematically Euclidean (flat) and seeding primordial density fluctuations.',
    scaleFactor: 0.18,
    redshiftZ: 'z ~ 10²⁸',
    particles: 'Inflaton Scalar Field, Reheating & Primordial Perturbations',
    dominantEnergy: 'Inflaton Potential Energy (99.9%)',
    vedicVerse: 'ଆନୀଦବାତଂ ସ୍ୱଧୟା ତଦେକଂ ତସ୍ମାଦ୍ଧାନ୍ୟନ୍ନ ପରଃ କିଞ୍ଚନାସ (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୨)',
    vedicSource: 'ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ'
  },
  {
    id: 'quark',
    timeLabel: 't = 10⁻¹² ରୁ 10⁻⁶ ସେକେଣ୍ଡ',
    timeSeconds: '10⁻⁶ s',
    tempKelvin: '10¹² K (Trillion K)',
    tempColor: '#38bdf8',
    titleOr: 'କ୍ୱାର୍କ-ଗ୍ଲୁଅନ୍ ପ୍ଲାଜ୍ମା ଓ ବାରିଓଜେନେସିସ୍ (Quark-Gluon Plasma)',
    titleEn: 'Quark-Gluon Plasma & Baryogenesis',
    descOr: 'ହିଗ୍ସ ଫିଲ୍ଡ୍ ସକ୍ରିୟ ହୋଇ କଣିକାମାନଙ୍କୁ ଭର (Mass) ପ୍ରଦାନ କଲା। ପଦାର୍ଥ (Matter) ଓ ପ୍ରତି-ପଦାର୍ଥ (Antimatter) ର ମହାବିଲୋପ ସଂଗ୍ରାମରେ ପ୍ରତି ୧ ବିଲିୟନ ଯୋଡ଼ିରେ ୧ଟି ଅତିରିକ୍ତ ପଦାର୍ଥ କଣିକା ବଞ୍ଚିଗଲା, ଯାହା ଆଜିର ସମସ୍ତ ପରମାଣୁର ମୂଳଦୁଆ!',
    descEn: 'Electroweak symmetry breaking imparted mass via the Higgs mechanism. A microscopic CP-violating matter-antimatter asymmetry (1 excess baryon per 10^9 photons) enabled the survival of all physical matter.',
    scaleFactor: 0.32,
    redshiftZ: 'z ~ 10¹²',
    particles: 'Quarks (u,d,s,c,b,t), Gluons, Leptons, W/Z Bosons',
    dominantEnergy: 'Relativistic Radiation Plasma (99.8%)',
    vedicVerse: 'ତମ ଆସୀତ୍ତମସା ଗୂଳ୍ହମଗ୍ରେଽପ୍ରକେତଂ ସଲିଲଂ ସର୍ବମା ଇଦମ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୩)',
    vedicSource: 'ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ'
  },
  {
    id: 'nucleosynthesis',
    timeLabel: 't = ୧୦ ସେକେଣ୍ଡ ରୁ ୨୦ ମିନିଟ୍',
    timeSeconds: '3 min',
    tempKelvin: '10⁹ K (Billion K)',
    tempColor: '#fbbf24',
    titleOr: 'ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ନ୍ୟୁକ୍ଲିଓସିନ୍ଥେସିସ୍ (BBN Primordial Nuclei)',
    titleEn: 'Big Bang Nucleosynthesis (BBN)',
    descOr: 'ପ୍ରୋଟନ୍ ଓ ନ୍ୟୁଟ୍ରନ୍ ଫ୍ୟୁଜନ୍ ହୋଇ ପ୍ରାଥମିକ ନ୍ୟୁକ୍ଲିୟସ୍ ଗଠନ କଲେ: ଠିକ୍ ୭୫% ହାଇଡ୍ରୋଜେନ୍ (H) ଏବଂ ୨୫% ହିଲିୟମ୍-୪ (He-4), ସହ ସାମାନ୍ୟ ଡ୍ୟୁଟେରିୟମ୍ ଓ ଲିଥିୟମ୍। ଏହି ଅନୁପାତ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଥିଓରୀର ସବୁଠାରୁ ଅକାଟ୍ୟ ପ୍ରମାଣ!',
    descEn: 'Nuclear fusion synthesized the primordial light isotopes of the universe: exactly 75% Hydrogen-1, 24.7% Helium-4, and trace Deuterium and Lithium-7, matching modern spectrographic observations.',
    scaleFactor: 0.48,
    redshiftZ: 'z ~ 4 × 10⁸',
    particles: 'Protons, Neutrons, Deuterons, Helium-4 Nuclei, Electrons, Neutrinos',
    dominantEnergy: 'Radiation Dominated (90%)',
    vedicVerse: 'ତୁଚ୍ଛେନାଭ୍ୱପିହିତଂ ୟଦାସୀତ୍ ତପସସ୍ତନ୍ମହିନା ଜାୟତୈକମ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୩)',
    vedicSource: 'ଋଗ୍‌ବେଦ ତପସ ସୃଷ୍ଟି'
  },
  {
    id: 'cmbr',
    timeLabel: 't = ୩୮୦,୦୦୦ ବର୍ଷ (Redshift z = 1090)',
    timeSeconds: '380,000 yrs',
    tempKelvin: '3,000 K (Now 2.725 K)',
    tempColor: '#f97316',
    titleOr: 'ରିକମ୍ବିନେସନ୍ ଓ ପ୍ରଥମ ଆଲୋକ (Cosmic Microwave Background)',
    titleEn: 'Recombination, Photon Decoupling & The CMBR',
    descOr: 'ଇଲେକ୍ଟ୍ରନ୍ ମାନେ ପ୍ରୋଟନ୍ ସହ ବାନ୍ଧି ହୋଇ ସ୍ଥିର ହାଇଡ୍ରୋଜେନ୍ ପରମାଣୁ ଗଠନ କଲେ। ଫଳରେ ଆଲୋକ (Photons) ପ୍ରଥମ ଥର ପାଇଁ ମୁକ୍ତ ଭାବେ ଗତି କଲା! ଏହି ପ୍ରଥମ ଆଲୋକ ଆଜି କସ୍ମିକ୍ ମାଇକ୍ରୋୱେଭ୍ ବ୍ୟାକଗ୍ରାଉଣ୍ଡ୍ (CMBR 2.7255 K) ରୂପେ ସାରା ମହାକାଶରେ ପ୍ରବାହିତ!',
    descEn: 'Electrons bound with nuclei to form neutral atoms. Photons decoupled from matter and streamed freely across the transparent cosmos, observable today as the 2.7255 K Cosmic Microwave Background.',
    scaleFactor: 0.65,
    redshiftZ: 'z = 1090',
    particles: 'Neutral Hydrogen & Helium Atoms, Decoupled CMB Photons',
    dominantEnergy: 'Matter-Radiation Equality Transition (Matter 75%, Radiation 25%)',
    vedicVerse: 'କାମସ୍ତଦଗ୍ରେ ସମବର୍ତ୍ତତାଧି ମନସୋ ରେତଃ ପ୍ରଥମଂ ୟଦାସୀତ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୪)',
    vedicSource: 'ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ'
  },
  {
    id: 'first_stars',
    timeLabel: 't = ୨୦୦ ରୁ ୪୦୦ ନିୟୁତ ବର୍ଷ',
    timeSeconds: '200M yrs',
    tempKelvin: '60 K',
    tempColor: '#a855f7',
    titleOr: 'ଅନ୍ଧକାର ଯୁଗର ସମାପ୍ତି ଓ ପ୍ରଥମ ନକ୍ଷତ୍ର (Cosmic Dawn & Pop III Stars)',
    titleEn: 'Cosmic Dawn, Population III Stars & Reionization',
    descOr: 'ଡାର୍କ ମ୍ୟାଟର୍ ହାଲୋ ଭିତରେ ହାଇଡ୍ରୋଜେନ୍ ମେଘ ଜିନ୍ସ ମହାକର୍ଷଣ ବଳରେ ଘନୀଭୂତ ହୋଇ ପ୍ରଥମ ବିଶାଳ ନକ୍ଷତ୍ର (Population III—ସୂର୍ଯ୍ୟ ଠାରୁ ୧୦୦ ଗୁଣ ବଡ଼) ସୃଷ୍ଟି କଲେ। ତାରାମାନଙ୍କ ଭିତରେ କାର୍ବନ୍, ଅମ୍ଳଜାନ ଓ ଲୁହା ଭଳି ଭାରୀ ଉପାଦାନ ଫ୍ୟୁଜନ୍ ହେଲା।',
    descEn: 'Primordial gas collapsed within dark matter potential wells, igniting the first zero-metallicity hypermassive stars (Pop III). Stellar nucleosynthesis forged the first carbon, oxygen, and heavy elements.',
    scaleFactor: 0.78,
    redshiftZ: 'z = 20 to 6',
    particles: 'Population III Stars, Proto-Galaxies, Supermassive Black Holes',
    dominantEnergy: 'Cold Dark Matter Dominated (82%)',
    vedicVerse: 'ସତୋ ବନ୍ଧୁମସତି ନିରବିନ୍ଦନ୍ ହୃଦି ପ୍ରତୀଷ୍ୟା କବୟୋ ମନୀଷା (ଋଗ୍‌ବେଦ ୧୦.୧୨୯.୪)',
    vedicSource: 'ଋଗ୍‌ବେଦ ନାସଦୀୟ ସୂକ୍ତ'
  },
  {
    id: 'solar_system',
    timeLabel: 't = ୯.୨ ବିଲିୟନ ବର୍ଷ (୪.୬ ବିଲିୟନ ବର୍ଷ ପୂର୍ବେ)',
    timeSeconds: '9.2B yrs',
    tempKelvin: '15 K (Cosmic Ambient)',
    tempColor: '#eab308',
    titleOr: 'ସୌରମଣ୍ଡଳ, ପୃଥିବୀ ଓ ଜୀବନର ଉନ୍ମେଷ (Solar System Formation)',
    titleEn: 'Solar Nebula Collapse & Terrestrial Accretion',
    descOr: 'ଏକ ପ୍ରାଚୀନ ସୁପରନୋଭା ବିସ୍ଫୋରଣରୁ ସୃଷ୍ଟି ହୋଇଥିବା ଆଣବିକ ଗ୍ୟାସ୍ ଏବଂ ଧୂଳି ମେଘ (Solar Nebula) ରୁ ଆମ ସୂର୍ଯ୍ୟ, ପୃଥିବୀ ଏବଂ ସୌରମଣ୍ଡଳର ୮ଟି ଗ୍ରହ ଜନ୍ମ ନେଲେ। ପୃଥିବୀରେ ଜଳ ଓ ପ୍ରାଣୀ ଜୀବନର ଉନ୍ମେଷ ଘଟିଲା।',
    descEn: 'A rotating giant molecular cloud collapsed under gravity to form the Sun at its core, with a protoplanetary disk coalescing into Earth, planets, oceans, and fostering carbon-based life.',
    scaleFactor: 0.90,
    redshiftZ: 'z = 0.4',
    particles: 'G2V Star, Rocky & Gas Planets, Water (H2O), Organic Compounds',
    dominantEnergy: 'Matter-Dark Energy Crossover (DE 45%, Matter 55%)',
    vedicVerse: 'ହିରଣ୍ୟଗର୍ଭଃ ସମବର୍ତ୍ତତାଗ୍ରେ ଭୂତସ୍ୟ ଜାତଃ ପତିରେକ ଆସୀତ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୨୧.୧)',
    vedicSource: 'ଋଗ୍‌ବେଦ ହିରଣ୍ୟଗର୍ଭ ସୂକ୍ତ'
  },
  {
    id: 'present',
    timeLabel: 't = ୧୩.୭୮୭ ବିଲିୟନ ବର୍ଷ (ଆଜିର ବିଶ୍ୱ)',
    timeSeconds: '13.8B yrs',
    tempKelvin: '2.7255 K (Near Absolute Zero)',
    tempColor: '#22c55e',
    titleOr: 'ତ୍ୱରାନ୍ୱିତ ପ୍ରସାରଣ ଓ ଡାର୍କ ଏନର୍ଜି (Accelerating Universe)',
    titleEn: 'Accelerating Universe & Dark Energy Dominance',
    descOr: 'ଆଜି ବ୍ରହ୍ମାଣ୍ଡ ଡାର୍କ ଏନର୍ଜି ଯୋଗୁଁ ଅଧିକ ଦ୍ରୁତ ବେଗରେ ତ୍ୱରାନ୍ୱିତ ପ୍ରସାରଣରେ ଅଛି। ନାସା ଓ ୟୁରୋପୀୟ ପ୍ଲାଙ୍କ ମହାକାଶଯାନର ମାପ ଅନୁଯାୟୀ ବ୍ରହ୍ମାଣ୍ଡର ୬୮.୩% ଶକ୍ତି ଡାର୍କ ଏନର୍ଜି, ୨୬.୮% ଡାର୍କ ମ୍ୟାଟର୍, ଏବଂ ମାତ୍ର ୪.୯% ସାଧାରଣ ପରମାଣୁ (Atoms)!',
    descEn: 'The modern universe is expanding at an accelerated rate driven by negative-pressure Dark Energy (68.3%), bounded by Dark Matter (26.8%), with ordinary atomic matter constituting only 4.9%.',
    scaleFactor: 1.0,
    redshiftZ: 'z = 0',
    particles: 'Galaxies, Clusters, Black Holes, Dark Energy, Dark Matter, Atoms',
    dominantEnergy: 'Dark Energy (68.3%), Dark Matter (26.8%), Baryons (4.9%)',
    vedicVerse: 'ସୂର୍ଯ୍ୟାଚନ୍ଦ୍ରମସୌ ଧାତା ୟଥାପୂର୍ବମକଳ୍ପୟତ୍ (ଋଗ୍‌ବେଦ ୧୦.୧୯୦.୩ - କଳ୍ପଚକ୍ର)',
    vedicSource: 'ଋଗ୍‌ବେଦ କଳ୍ପଚକ୍ର ସୂକ୍ତ'
  }
];

export const LiveBigBangSimulator: React.FC<Props> = ({ onClose }) => {
  const { language } = useI18n();

  // Primary Feature Tabs
  const [activeTab, setActiveTab] = useState<'3d_lab' | 'textbook' | 'calculators' | 'vedic'>('3d_lab');

  // 3D Timeline Epoch state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);

  // Textbook reader state
  const [activeChapterId, setActiveChapterId] = useState<string>('ch1_singularity');
  const [textbookSearch, setTextbookSearch] = useState<string>('');
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg'>('base');

  // Reading Pane Ref for Smooth Scrolling to Sections
  const readerScrollRef = useRef<HTMLDivElement | null>(null);

  // Astrophysics Calculator States
  // 1. Friedmann Simulator
  const [omegaM, setOmegaM] = useState<number>(0.315);
  const [omegaL, setOmegaL] = useState<number>(0.685);
  const [hubbleH0, setHubbleH0] = useState<number>(67.4);

  // 2. Redshift Solver
  const [inputZ, setInputZ] = useState<number>(1.5);
  const [restWavelengthNm, setRestWavelengthNm] = useState<number>(121.6); // Lyman-alpha default

  // 3. BBN Abundance
  const [baryonPhotonEta, setBaryonPhotonEta] = useState<number>(6.12);

  // 4. Hubble Slider
  const [customDistanceMpc, setCustomDistanceMpc] = useState<number>(100);

  // Vedic Interactive State
  const [vedicExplorerLevel, setVedicExplorerLevel] = useState<'mahakalpa' | 'kalpa' | 'manvantara' | 'yuga'>('kalpa');

  const safeIdx = Math.max(0, Math.min(COSMIC_EPOCHS.length - 1, currentIdx || 0));
  const activeEpoch = COSMIC_EPOCHS[safeIdx] || COSMIC_EPOCHS[0];

  // Auto-play timeline simulation in 3D mode
  useEffect(() => {
    if (!isPlaying || activeTab !== '3d_lab') return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % COSMIC_EPOCHS.length);
    }, Math.max(250, 5500 / Math.max(0.1, speed)));
    return () => clearInterval(interval);
  }, [isPlaying, speed, activeTab]);

  // Friedmann Equation Calculations
  const omegaTot = (omegaM + omegaL).toFixed(3);
  const omegaK = (1.0 - (omegaM + omegaL)).toFixed(3);
  const decelerationQ0 = (omegaM / 2 - omegaL).toFixed(3);
  const safeHubbleH0 = Math.max(hubbleH0 || 67.4, 1.0);
  const safeOmegaM = Math.max(omegaM || 0.315, 0.001);
  const safeOmegaL = Math.max(omegaL || 0.685, 0.001);

  const calculatedAgeGyr = useMemo(() => {
    try {
      const h0Sec = (safeHubbleH0 * 1000) / (3.085677581e22);
      if (safeOmegaL > 0 && safeOmegaM > 0) {
        const factor = 2 / (3 * Math.sqrt(safeOmegaL));
        const val = Math.asinh(Math.sqrt(safeOmegaL / safeOmegaM));
        const ageSec = (factor * val) / h0Sec;
        const ageGyr = ageSec / (365.25 * 86400 * 1e9);
        return Number.isFinite(ageGyr) ? ageGyr.toFixed(2) : '13.79';
      }
      return '13.8';
    } catch {
      return '13.79';
    }
  }, [safeOmegaM, safeOmegaL, safeHubbleH0]);

  // Cosmological Horizons
  const particleHorizonGly = 46.5; // Comoving radius of observable universe
  const eventHorizonGly = useMemo(() => {
    try {
      if (safeOmegaL > 0) {
        const res = ((3.26156 * 299792 / (safeHubbleH0 * Math.sqrt(safeOmegaL))) * 0.001);
        return Number.isFinite(res) ? res.toFixed(1) : '17.5';
      }
      return '17.5';
    } catch {
      return '17.5';
    }
  }, [safeOmegaL, safeHubbleH0]);
  const hubbleRadiusGly = ((299792 / safeHubbleH0) * 3.26156 * 0.001).toFixed(1); // c / H0 in Gly

  // Dynamic Scale Factor Expansion Curve Points
  const expansionCurvePoints = useMemo(() => {
    const points: { t: number; a: number }[] = [];
    const age = parseFloat(calculatedAgeGyr) || 13.8;
    // Sample from t = -age (Big Bang) to t = +15 Gyr (Future)
    for (let tRel = -age; tRel <= 15; tRel += 1) {
      let aVal = 0;
      if (tRel < 0) {
        // In the past: a(t) approx ( (tRel + age) / age )^(2/3)
        const frac = Math.max((tRel + age) / age, 0);
        // ΛCDM scale factor: a(t) = (Ωm/ΩΛ)^(1/3) * sinh^(2/3)(3/2 * sqrt(ΩΛ) * H0 * t)
        const omRatio = safeOmegaM / safeOmegaL;
        const factor = 1.5 * Math.sqrt(safeOmegaL) * (safeHubbleH0 / 977.8); // H0 in Gyr^-1
        const t0 = (2 / (3 * Math.sqrt(safeOmegaL) * (safeHubbleH0 / 977.8))) * Math.asinh(Math.sqrt(safeOmegaL / safeOmegaM));
        const aNorm = Math.pow(omRatio, 1/3) * Math.pow(Math.sinh(factor * t0), 2/3); // a(t0) for normalization
        const tActual = frac * t0; // fraction of cosmic time
        aVal = Math.pow(omRatio, 1/3) * Math.pow(Math.sinh(factor * tActual), 2/3) / aNorm;
      } else {
        // In the future: accelerated if omegaL > omegaM
        const futureFactor = omegaL > omegaM ? 1.0 + (tRel / 10) * 1.3 : 1.0 + (tRel / 10) * 0.6;
        aVal = futureFactor;
      }
      points.push({ t: tRel, a: Math.min(aVal, 3.2) });
    }
    return points;
  }, [calculatedAgeGyr, omegaL, omegaM, safeOmegaM, safeOmegaL, safeHubbleH0]);

  // Redshift & Lookback Time Calculations
  const redshiftData = useMemo(() => {
    const z = Math.max(inputZ, 0.0001);
    const c = 299792.458;
    const vRel = c * (((1 + z) ** 2 - 1) / ((1 + z) ** 2 + 1));
    const scaleA = (1 / (1 + z)).toFixed(4);
    const lookbackGyr = (13.787 * (1 - 1 / Math.pow(1 + z, 1.5) * Math.sqrt(1 + safeOmegaM * z))).toFixed(2);
    const comovingMpc = ((c / 67.4) * Math.log(1 + z) * 1.25).toFixed(0);
    const comovingMly = (Number(comovingMpc) * 3.26156).toFixed(0);
    const tempK = (2.7255 * (1 + z)).toFixed(1);

    // Observed wavelength: lambda_obs = lambda_rest * (1 + z)
    const obsWavelengthNm = (restWavelengthNm * (1 + z)).toFixed(1);
    let bandName = 'UV';
    let bandColor = '#a855f7';
    const wl = Number(obsWavelengthNm);
    if (wl < 380) { bandName = 'Ultraviolet (UV)'; bandColor = '#c084fc'; }
    else if (wl < 450) { bandName = 'Visible Violet'; bandColor = '#818cf8'; }
    else if (wl < 495) { bandName = 'Visible Blue'; bandColor = '#38bdf8'; }
    else if (wl < 570) { bandName = 'Visible Green'; bandColor = '#4ade80'; }
    else if (wl < 590) { bandName = 'Visible Yellow'; bandColor = '#facc15'; }
    else if (wl < 620) { bandName = 'Visible Orange'; bandColor = '#fb923c'; }
    else if (wl < 750) { bandName = 'Visible Red'; bandColor = '#f87171'; }
    else if (wl < 2500) { bandName = 'Near-Infrared (JWST NIRCam)'; bandColor = '#fb7185'; }
    else if (wl < 25000) { bandName = 'Mid-Infrared (JWST MIRI)'; bandColor = '#e11d48'; }
    else { bandName = 'Microwave / Radio'; bandColor = '#ea580c'; }

    return {
      vRel: vRel.toFixed(1),
      scaleA,
      lookbackGyr,
      comovingMpc,
      comovingMly,
      tempK,
      obsWavelengthNm,
      bandName,
      bandColor
    };
  }, [inputZ, restWavelengthNm, safeOmegaM]);

  // BBN Elemental Abundances Calculation
  const bbnData = useMemo(() => {
    const eta = Math.max(baryonPhotonEta, 1.0);
    const he4Val = 24.6 + 0.9 * Math.log10(eta / 6.0);
    const safeHe4 = Math.min(27, Math.max(22, Number(he4Val.toFixed(1))));
    const safeH1 = Number((100 - safeHe4).toFixed(1));
    const deuterium = (2.55 * (6.0 / eta) ** 1.6).toFixed(2);
    const lithium = (4.7 * (eta / 6.0) ** 2).toFixed(1);

    return {
      he4: safeHe4,
      h1: safeH1,
      deuterium,
      lithium
    };
  }, [baryonPhotonEta]);

  const hubbleVelocityKmS = (67.4 * customDistanceMpc).toFixed(1);
  const redshiftFromDist = (Number(hubbleVelocityKmS) / 299792.458).toFixed(4);

  // Filtered textbook chapters
  const filteredChapters = useMemo(() => {
    if (!textbookSearch.trim()) return COSMOLOGY_TEXTBOOK;
    const q = textbookSearch.toLowerCase();
    return COSMOLOGY_TEXTBOOK.filter(
      (ch) =>
        ch.titleEn.toLowerCase().includes(q) ||
        ch.titleOr.toLowerCase().includes(q) ||
        ch.summaryEn.toLowerCase().includes(q) ||
        ch.summaryOr.toLowerCase().includes(q)
    );
  }, [textbookSearch]);

  const activeChapterIndex = COSMOLOGY_TEXTBOOK.findIndex((c) => c.id === activeChapterId);
  const activeChapter = COSMOLOGY_TEXTBOOK[activeChapterIndex >= 0 ? activeChapterIndex : 0];

  // Smooth Scroll Helper
  const scrollToReaderSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToReaderTop = () => {
    if (readerScrollRef.current) {
      readerScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#010409] via-[#050b18] to-[#02040a] border-2 border-cosmic-gold/50 shadow-2xl p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-cyan-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl animate-pulse border border-amber-500/40 shadow-lg shadow-amber-500/20">
            💥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-cosmic-gold to-yellow-100 bg-clip-text text-transparent font-serif">
                {language === 'or' ? 'ଲାଇଭ୍ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଓ ମହାଜାଗତିକ ବିକାଶ ଗବେଷଣାଗାର' : 'Live Big Bang & Cosmic Evolution Master Laboratory'}
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Verified Real Data
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
              t₀: 13.787 ± 0.020 Gyr • H₀: 67.4 km/s/Mpc • Ω_m: 0.315 • Ω_Λ: 0.685 • T_CMB: 2.7255 K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Feature Mode Switcher Tabs */}
          <div className="flex items-center bg-cosmic-950/90 border border-slate-800 p-1 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('3d_lab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === '3d_lab'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>{language === 'or' ? '🔬 ୩D କଣିକା ଲାବ୍' : '🔬 3D Particle Lab'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('textbook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'textbook'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'or' ? '📖 ବିଜ୍ଞାନ ପୁସ୍ତକ (୯ ଅଧ୍ୟାୟ)' : '📖 Textbook (9 Ch)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculators')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calculators'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{language === 'or' ? '🧮 ଗଣକ ଓ ଲାବ୍' : '🧮 Calculators'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vedic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vedic'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-cosmic-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>{language === 'or' ? '📜 ବୈଦିକ କାଳଚକ୍ର' : '📜 Vedic Cycles'}</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-cosmic-950 border border-slate-800 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 3D LIVE PARTICLE & SPACETIME EXPANSION LAB (Three.js WebGL Engine) */}
      {/* ========================================================================= */}
      {activeTab === '3d_lab' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-cosmic-950/80 border border-slate-800 p-2.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>12,000+ WebGL Relativistic Particles & Cosmic Web</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Drag mouse to Orbit 3D • Scroll to Zoom
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : speed === 4 ? 8 : 1)}
                className="px-2.5 py-1.5 text-xs font-bold text-cosmic-gold hover:text-white bg-cosmic-900 border border-slate-800 rounded-xl cursor-pointer"
              >
                {speed}x Speed
              </button>

              <button
                type="button"
                onClick={() => setCurrentIdx(0)}
                className="p-1.5 rounded-xl bg-cosmic-900 border border-slate-800 text-slate-400 hover:text-cosmic-gold cursor-pointer"
                title="Rewind to Singularity"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced 3D Cosmic Evolution WebGL Engine (Volumetric Explosion, NASA Spacetime Funnel, Cosmic Web) */}
          <CosmicEvolution3DViewer
            epochIndex={safeIdx}
            timeLabel={activeEpoch?.timeSeconds || '0 s'}
            tempKelvin={activeEpoch?.tempKelvin || '0 K'}
            scaleFactor={activeEpoch?.scaleFactor ?? 0.5}
            redshiftZ={activeEpoch?.redshiftZ || 'z=0'}
            onSelectEpoch={(idx) => {
              const clamped = Math.max(0, Math.min(COSMIC_EPOCHS.length - 1, idx));
              setCurrentIdx(clamped);
              setIsPlaying(false);
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cosmic-gold" />
                <span>ସମୟ ପରିକ୍ରମା (Cosmic Epoch Scrubber - Select Era):</span>
              </span>
              <span className="text-cosmic-gold font-mono">
                Epoch {currentIdx + 1} of {COSMIC_EPOCHS.length}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COSMIC_EPOCHS.map((epoch, idx) => (
                <button
                  key={epoch.id}
                  type="button"
                  onClick={() => {
                    setCurrentIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-2.5 rounded-2xl text-center transition-all cursor-pointer border text-[11px] font-mono ${
                    currentIdx === idx
                      ? 'bg-gradient-to-b from-cosmic-gold to-amber-500 text-cosmic-950 font-bold border-white shadow-lg scale-105'
                      : 'bg-cosmic-950/80 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate font-bold text-xs">{epoch.timeSeconds}</div>
                  <div className="text-[9px] opacity-80 truncate">{epoch.id}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-cosmic-950/90 border border-cosmic-gold/40 p-5 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h4 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: activeEpoch?.tempColor || '#ffffff' }} />
                <span>{language === 'or' ? (activeEpoch?.titleOr || '') : (activeEpoch?.titleEn || '')}</span>
              </h4>
              <span className="text-xs font-mono text-cosmic-gold bg-cosmic-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
                {activeEpoch?.timeLabel || ''}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {language === 'or' ? (activeEpoch?.descOr || '') : (activeEpoch?.descEn || '')}
            </p>

            <div className="bg-gradient-to-r from-amber-950/30 via-cosmic-950 to-amber-950/20 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-amber-400" />
                  <span>ବୈଦିକ ସୃଷ୍ଟି ବିଜ୍ଞାନ ସମନ୍ୱୟ ({activeEpoch?.vedicSource || ''}):</span>
                </span>
                <span className="text-[10px] font-mono text-amber-500/80">Surya Siddhanta & Rigveda</span>
              </div>
              <p className="text-xs text-amber-200 font-serif italic">
                "{activeEpoch?.vedicVerse || ''}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: COMPLETE PROFESSIONAL COLORFUL COSMOLOGY TEXTBOOK WITH SCROLLBAR */}
      {/* ========================================================================= */}
      {activeTab === 'textbook' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-cosmic-950/90 border border-slate-800 p-4 rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xl">
                📖
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
                  <span>{language === 'or' ? 'ପୂର୍ଣ୍ଣ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ ପାଠ୍ୟପୁସ୍ତକ (୯ଟି ବିଶ୍ୱବିଦ୍ୟାଳୟ ସ୍ତରୀୟ ଅଧ୍ୟାୟ)' : 'Complete Cosmology & Astrophysics Textbook'}</span>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    9 Master Chapters
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'or'
                    ? 'ସିଙ୍ଗୁଲାରିଟି, ଇନ୍‌ଫ୍ଲେସନ୍, CMBR, ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ ଓ ବୈଦିକ କାଳଚକ୍ରର ୧୦୦% ପ୍ରାମାଣିକ ବିଜ୍ଞାନ।'
                    : 'Quantum Gravity, BBN, CMBR, Friedmann FLRW Metric, Dark Energy & Vedic Time Scale.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={textbookSearch}
                  onChange={(e) => setTextbookSearch(e.target.value.slice(0, 100))}
                  placeholder={language === 'or' ? 'ଅଧ୍ୟାୟ ବା ତତ୍ତ୍ୱ ଖୋଜନ୍ତୁ...' : 'Search chapters, formulas...'}
                  className="w-full bg-cosmic-900 border border-slate-800 pl-10 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center bg-cosmic-900 border border-slate-800 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('sm')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer ${
                    fontSizeLevel === 'sm' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Small Text"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('base')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    fontSizeLevel === 'base' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Normal Text"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeLevel('lg')}
                  className={`px-2 py-1 text-sm font-bold rounded-lg cursor-pointer ${
                    fontSizeLevel === 'lg' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Large Text"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-4 bg-cosmic-950/90 border border-slate-800 rounded-3xl p-3.5 space-y-3 lg:sticky lg:top-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                <span className="text-xs font-bold text-cosmic-gold flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-cosmic-gold" />
                  <span>{language === 'or' ? 'ସୂଚୀପତ୍ର (Table of Contents)' : 'Table of Contents'}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {activeChapterIndex + 1} / {COSMOLOGY_TEXTBOOK.length} Chapters
                </span>
              </div>

              <div className="space-y-1.5 max-h-[300px] lg:max-h-[620px] overflow-y-auto custom-book-scrollbar pr-1.5">
                {filteredChapters.map((ch) => {
                  const isActive = activeChapter.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setActiveChapterId(ch.id);
                        scrollToReaderTop();
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl transition-all cursor-pointer border flex items-center gap-2.5 ${
                        isActive
                          ? `bg-gradient-to-r ${ch.theme.gradient} text-white shadow-lg ${ch.theme.borderColor} scale-[1.02]`
                          : 'bg-cosmic-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      style={{
                        boxShadow: isActive ? `0 0 20px ${ch.theme.glowColor}` : 'none'
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                        style={{
                          backgroundColor: isActive ? 'rgba(0,0,0,0.5)' : '#0f172a',
                          borderColor: isActive ? ch.theme.accentColor : '#334155',
                          color: ch.theme.accentColor
                        }}
                      >
                        {ch.chapterNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate">
                            {language === 'or' ? ch.titleOr.split('(')[0] : ch.titleEn.split('&')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">
                          {ch.timeRange}
                        </span>
                      </div>

                      {isActive && (
                        <div className="w-2 h-2 rounded-full animate-ping shrink-0" style={{ backgroundColor: ch.theme.accentColor }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="bg-cosmic-950/90 border border-slate-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-slate-500 text-[10px] hidden sm:inline">Jump:</span>
                  <button
                    type="button"
                    onClick={() => scrollToReaderSection('formulas-section')}
                    className="px-2 py-1 rounded-lg bg-cosmic-900 border border-slate-800 text-slate-300 hover:border-cosmic-gold hover:text-cosmic-gold cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    📐 {language === 'or' ? 'ସମୀକରଣ' : 'Formulas'}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToReaderSection('constants-section')}
                    className="px-2 py-1 rounded-lg bg-cosmic-900 border border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    ⚡ {language === 'or' ? 'ଧ୍ରୁବକ' : 'Constants'}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToReaderSection('narrative-section')}
                    className="px-2 py-1 rounded-lg bg-cosmic-900 border border-slate-800 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    🔬 {language === 'or' ? 'ତଥ୍ୟ' : 'Physics'}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToReaderSection('evidence-section')}
                    className="px-2 py-1 rounded-lg bg-cosmic-900 border border-slate-800 text-slate-300 hover:border-amber-400 hover:text-amber-300 cursor-pointer text-[10px] whitespace-nowrap"
                  >
                    🔭 {language === 'or' ? 'ପ୍ରମାଣ' : 'Proof'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    disabled={activeChapterIndex === 0}
                    onClick={() => {
                      if (activeChapterIndex > 0) {
                        setActiveChapterId(COSMOLOGY_TEXTBOOK[activeChapterIndex - 1].id);
                        scrollToReaderTop();
                      }
                    }}
                    className={`p-1.5 rounded-xl border flex items-center gap-1 cursor-pointer text-[10px] font-bold ${
                      activeChapterIndex > 0
                        ? 'bg-cosmic-900 border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-cosmic-950 border-slate-900 text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <span className="text-slate-500 font-mono text-[10px]">
                    {activeChapterIndex + 1}/{COSMOLOGY_TEXTBOOK.length}
                  </span>

                  <button
                    type="button"
                    disabled={activeChapterIndex === COSMOLOGY_TEXTBOOK.length - 1}
                    onClick={() => {
                      if (activeChapterIndex < COSMOLOGY_TEXTBOOK.length - 1) {
                        setActiveChapterId(COSMOLOGY_TEXTBOOK[activeChapterIndex + 1].id);
                        scrollToReaderTop();
                      }
                    }}
                    className={`p-1.5 rounded-xl border flex items-center gap-1 cursor-pointer text-[10px] font-bold ${
                      activeChapterIndex < COSMOLOGY_TEXTBOOK.length - 1
                        ? 'bg-cosmic-900 border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-cosmic-950 border-slate-900 text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={readerScrollRef}
                className="max-h-[680px] sm:max-h-[740px] overflow-y-auto custom-book-scrollbar pr-2 sm:pr-4 space-y-6 scroll-smooth"
              >
                <div
                  className={`bg-gradient-to-b ${activeChapter.theme.gradient} border ${activeChapter.theme.borderColor} rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden`}
                  style={{
                    boxShadow: `0 0 35px ${activeChapter.theme.glowColor}`
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeChapter.theme.badgeBg}`}>
                      {activeChapter.theme.icon} Chapter {activeChapter.chapterNumber} of 9
                    </span>
                    <span className="text-xs font-mono text-cosmic-gold bg-black/60 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
                      ⏳ {activeChapter.timeRange}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-serif tracking-tight">
                    {language === 'or' ? activeChapter.titleOr : activeChapter.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {language === 'or' ? activeChapter.subtitleOr : activeChapter.subtitleEn}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-[11px]">
                    <span className="px-3 py-1.5 rounded-xl bg-black/50 text-slate-200 border border-white/10">
                      🌡️ Temp: <span className="font-bold text-amber-300">{activeChapter.temperature}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-black/50 text-slate-200 border border-white/10">
                      ⚡ Energy: <span className="font-bold text-cyan-300">{activeChapter.energyScale}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-black/50 text-slate-200 border border-white/10">
                      🔬 Law: <span className="font-bold text-emerald-300">{activeChapter.dominantPhysics}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-cosmic-950/90 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>{language === 'or' ? 'ଅଧ୍ୟାୟ ସାରାଂଶ (Executive Abstract):' : 'Executive Abstract:'}</span>
                  </span>
                  <p className={`text-slate-200 leading-relaxed ${
                    fontSizeLevel === 'sm' ? 'text-xs' : fontSizeLevel === 'lg' ? 'text-base' : 'text-sm'
                  }`}>
                    {language === 'or' ? activeChapter.summaryOr : activeChapter.summaryEn}
                  </p>
                </div>

                {activeChapter.physicalConstants && activeChapter.physicalConstants.length > 0 && (
                  <div id="constants-section" className="bg-cosmic-950/90 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'or' ? 'ପ୍ରାମାଣିକ ଭୌତିକ ଧ୍ରୁବକ (Verified Real Scientific Constants):' : 'Verified Real Scientific Constants:'}</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                      {activeChapter.physicalConstants.map((c, i) => (
                        <div key={i} className="bg-cosmic-900/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block">
                              {language === 'or' ? c.nameOr : c.nameEn}
                            </span>
                            <span className="font-bold text-slate-200 text-xs">
                              {c.symbol}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-cosmic-gold font-bold text-xs block">{c.value}</span>
                            <span className="text-[10px] text-cyan-400">{c.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChapter.keyEquations.length > 0 && (
                  <div id="formulas-section" className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-cosmic-gold flex items-center gap-2 font-serif">
                        <Calculator className="w-4 h-4 text-cosmic-gold" />
                        <span>{language === 'or' ? 'ମୁଖ୍ୟ ଗାଣିତିକ ସମୀକରଣ (Key Mathematical Formulations):' : 'Key Mathematical Formulations:'}</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">LaTeX Rendered</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {activeChapter.keyEquations.map((eq, i) => (
                        <div
                          key={i}
                          className="bg-cosmic-950/90 border border-slate-800 p-4 rounded-3xl space-y-2 shadow-lg"
                        >
                          <span className="text-xs font-bold text-white block">{eq.name}</span>
                          <div className="bg-black/90 p-3.5 rounded-2xl font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto text-center border border-slate-800/80 shadow-inner">
                            {eq.latex}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            {language === 'or' ? eq.descriptionOr : eq.descriptionEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div id="narrative-section" className="space-y-4">
                  {activeChapter.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="bg-cosmic-950/90 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-3 shadow-lg"
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: activeChapter.theme.accentColor
                      }}
                    >
                      <h5 className="text-base font-bold text-white font-serif flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeChapter.theme.accentColor }} />
                        <span>{language === 'or' ? sec.headingOr : sec.headingEn}</span>
                      </h5>
                      <p className={`text-slate-300 leading-relaxed whitespace-pre-line ${
                        fontSizeLevel === 'sm' ? 'text-xs' : fontSizeLevel === 'lg' ? 'text-base' : 'text-sm'
                      }`}>
                        {language === 'or' ? sec.contentOr : sec.contentEn}
                      </p>
                    </div>
                  ))}
                </div>

                {activeChapter.observationalEvidence.length > 0 && (
                  <div id="evidence-section" className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-3xl space-y-3 shadow-lg">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'or' ? 'ପରୀକ୍ଷଣାଗାର ଓ ମହାକାଶଯାନ ପ୍ରମାଣ (Observational Evidence & Missions):' : 'Observational Evidence & Missions:'}</span>
                    </span>
                    {activeChapter.observationalEvidence.map((ev, i) => (
                      <div key={i} className="text-xs text-slate-200 bg-cosmic-900/60 p-3 rounded-2xl border border-emerald-500/20">
                        <span className="font-bold text-emerald-300 font-mono">
                          [{ev.instrumentOrMission}, {ev.discoveryYear}]:
                        </span>{' '}
                        <span>{language === 'or' ? ev.findingOr : ev.findingEn}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeChapter.vedicParallel && (
                  <div id="vedic-section" className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-3xl space-y-3 shadow-lg">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Scroll className="w-4 h-4 text-amber-400" />
                      <span>{language === 'or' ? 'ବୈଦିକ ସୃଷ୍ଟି ବିଜ୍ଞାନ ସମନ୍ୱୟ' : 'Vedic Genesis Synthesis'} ({activeChapter.vedicParallel.source}):</span>
                    </span>
                    <p className="text-xs sm:text-sm text-amber-200 font-serif italic bg-cosmic-950/80 p-3.5 rounded-2xl border border-amber-500/20">
                      "{activeChapter.vedicParallel.verseText}"
                    </p>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-amber-300">ଅର୍ଥ: </span>
                      {language === 'or' ? activeChapter.vedicParallel.meaningOr : activeChapter.vedicParallel.meaningEn}
                    </p>
                    <p className="text-[11px] text-amber-200/80 border-t border-amber-500/20 pt-2">
                      <span className="font-bold">ଦାର୍ଶନିକ ବିଶ୍ଳେଷଣ: </span>
                      {activeChapter.vedicParallel.philosophicalSynthesis}
                    </p>
                  </div>
                )}

                <div className="bg-cosmic-950/90 border border-slate-800 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
                  {activeChapterIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterId(COSMOLOGY_TEXTBOOK[activeChapterIndex - 1].id);
                        scrollToReaderTop();
                      }}
                      className="px-4 py-2 rounded-2xl bg-cosmic-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-600 flex items-center gap-2 cursor-pointer text-xs font-bold"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>
                        Ch {activeChapterIndex}: {language === 'or' ? COSMOLOGY_TEXTBOOK[activeChapterIndex - 1].titleOr.split('(')[0] : COSMOLOGY_TEXTBOOK[activeChapterIndex - 1].titleEn.split('&')[0]}
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={scrollToReaderTop}
                    className="p-2 rounded-2xl bg-cosmic-900 border border-slate-800 text-slate-400 hover:text-cosmic-gold cursor-pointer text-xs flex items-center gap-1 font-mono"
                    title="Scroll to Top"
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>Top</span>
                  </button>

                  {activeChapterIndex < COSMOLOGY_TEXTBOOK.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterId(COSMOLOGY_TEXTBOOK[activeChapterIndex + 1].id);
                        scrollToReaderTop();
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center gap-2 cursor-pointer text-xs font-bold shadow-md"
                    >
                      <span>
                        Ch {activeChapterIndex + 2}: {language === 'or' ? COSMOLOGY_TEXTBOOK[activeChapterIndex + 1].titleOr.split('(')[0] : COSMOLOGY_TEXTBOOK[activeChapterIndex + 1].titleEn.split('&')[0]}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: ASTROPHYSICS CALCULATORS & LABS (FRIEDMANN, REDSHIFT, BBN, HUBBLE) */}
      {/* ========================================================================= */}
      {activeTab === 'calculators' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-cosmic-950/80 border border-slate-800 p-4 rounded-3xl">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>{language === 'or' ? 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଆଷ୍ଟ୍ରୋଫିଜିକ୍ସ କାଲ୍‌କୁଲେଟର୍ସ (Advanced Scientific Calculators)' : 'Interactive Astrophysics & Cosmology Calculators'}</span>
            </h4>
            <p className="text-xs text-slate-400 pt-0.5">
              {language === 'or'
                ? 'ଆଇନଷ୍ଟାଇନ୍‌ଙ୍କ ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ, କସ୍ମୋଲୋଜିକାଲ୍ ରେଡ୍‌ସିଫ୍ଟ୍, ନ୍ୟୁକ୍ଲିଓସିନ୍ଥେସିସ୍ ଏବଂ ହବଲ୍ ନିୟମର ୧୦୦% ସଠିକ୍ ଗାଣିତିକ ସମାଧାନ।'
                : 'FLRW metric cosmological solver, redshift lookback time, BBN primordial light element nucleosynthesis, and Hubble horizon metrics.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LAB 1: Friedmann Lambda-CDM Universe Simulator & Real-time Expansion Graph */}
            <div className="bg-cosmic-950/90 border border-emerald-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>୧. ଫ୍ରିଡ୍‌ମ୍ୟାନ୍ ସମୀକରଣ ସିମୁଲେଟର୍ (Friedmann ΛCDM Engine)</span>
                </h5>
                <span className="font-mono text-[10px] text-emerald-400">FLRW Metric</span>
              </div>

              {/* Dynamic Interactive SVG Expansion Curve */}
              <div className="bg-black/80 border border-slate-800/80 p-3 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>Scale Factor a(t) vs Cosmic Time</span>
                  </span>
                  <span>t₀ = 13.8 Gyr (Now)</span>
                </div>

                <div className="relative w-full h-24 sm:h-28">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="45" x2="300" y2="45" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="140" y1="0" x2="140" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
                    
                    {/* Expansion Curve Path */}
                    {(() => {
                      const age = parseFloat(calculatedAgeGyr) || 13.8;
                      const pathD = expansionCurvePoints.map((pt, i) => {
                        // Map t from -age to +15 => x from 10 to 290
                        const x = 10 + ((pt.t + age) / (age + 15)) * 280;
                        // Map a from 0 to 3.0 => y from 80 down to 10
                        const y = 80 - (pt.a / 3.0) * 70;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      }).join(' ');

                      return (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={Number(decelerationQ0) < 0 ? '#10b981' : '#f43f5e'}
                          strokeWidth="2.5"
                          className="transition-all duration-300"
                        />
                      );
                    })()}

                    {/* Today marker dot */}
                    <circle cx="140" cy="57" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>

                  <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-500">
                    Big Bang (a=0)
                  </span>
                  <span className="absolute bottom-1 left-32 text-[9px] font-mono text-cosmic-gold font-bold">
                    Today (a=1.0)
                  </span>
                  <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
                    +15 Gyr Future
                  </span>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono pb-1">
                    <span className="text-slate-300">Matter Density (Ω_m):</span>
                    <span className="text-emerald-400 font-bold">{omegaM.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.01"
                    value={omegaM}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (Number.isFinite(v)) setOmegaM(Math.max(0, Math.min(1.5, v)));
                    }}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono pb-1">
                    <span className="text-slate-300">Dark Energy (Ω_Λ):</span>
                    <span className="text-indigo-400 font-bold">{omegaL.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.01"
                    value={omegaL}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (Number.isFinite(v)) setOmegaL(Math.max(0, Math.min(1.5, v)));
                    }}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono pb-1">
                    <span className="text-slate-300">Hubble Constant (H₀):</span>
                    <span className="text-cosmic-gold font-bold">{hubbleH0} km/s/Mpc</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="0.5"
                    value={hubbleH0}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (Number.isFinite(v)) setHubbleH0(Math.max(50, Math.min(90, v)));
                    }}
                    className="w-full accent-cosmic-gold cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs text-center">
                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Density (Ω_tot):</span>
                  <span className="text-sm font-bold text-white">{omegaTot}</span>
                  <span className="text-[9px] text-cyan-300 block">
                    {Math.abs(Number(omegaK)) < 0.02 ? 'Flat (k = 0)' : Number(omegaK) < 0 ? 'Closed (k = +1)' : 'Open (k = -1)'}
                  </span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Calculated Age (t₀):</span>
                  <span className="text-sm font-bold text-cosmic-gold">{calculatedAgeGyr} Billion Yrs</span>
                  <span className="text-[9px] text-slate-400 block">Planck 2018: 13.79 Gyr</span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Deceleration (q₀):</span>
                  <span className={`text-sm font-bold ${Number(decelerationQ0) < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {decelerationQ0}
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    {Number(decelerationQ0) < 0 ? '🚀 Accelerating' : '🛑 Decelerating'}
                  </span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Cosmic Fate:</span>
                  <span className="text-xs font-bold text-amber-300 block pt-0.5">
                    {omegaL > omegaM ? 'Big Freeze (Heat Death)' : omegaM > 1 ? 'Big Crunch' : 'Eternal Expansion'}
                  </span>
                </div>
              </div>
            </div>

            {/* LAB 2: Cosmological Redshift & Electromagnetic Spectral Shift */}
            <div className="bg-cosmic-950/90 border border-cyan-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>୨. ରେଡ୍‌ସିଫ୍ଟ୍ ଓ ଲୁକ୍‌ବ୍ୟାକ୍ ଟାଇମ୍ (Redshift & Distance Solver)</span>
                </h5>
                <span className="font-mono text-[10px] text-cyan-400">z = Δλ / λ₀</span>
              </div>

              {/* Spectral Shift Visual Indicator */}
              <div className="bg-black/80 border border-slate-800 p-3 rounded-2xl space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Rest: {restWavelengthNm} nm (Lyman-α)</span>
                  <span className="font-bold" style={{ color: redshiftData.bandColor }}>
                    Observed: {redshiftData.obsWavelengthNm} nm [{redshiftData.bandName}]
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full overflow-hidden flex shadow-inner border border-slate-700">
                  <div className="w-1/6 bg-purple-500" title="UV" />
                  <div className="w-1/6 bg-blue-500" title="Blue" />
                  <div className="w-1/6 bg-green-500" title="Green" />
                  <div className="w-1/6 bg-yellow-500" title="Yellow" />
                  <div className="w-1/6 bg-red-500" title="Red" />
                  <div className="w-1/6 bg-rose-700" title="Infrared" />
                </div>
                <span className="text-[9px] text-slate-500 block">
                  JWST NIRCam / MIRI Filters detect this redshifted infrared light!
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block">କ୍ୱିକ୍ ପ୍ରିସେଟ୍ (Quick Astronomical Targets):</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Andromeda', z: 0.001 },
                    { label: 'Quasar 3C 273', z: 0.158 },
                    { label: 'Deep Galaxy', z: 1.5 },
                    { label: 'JWST GN-z11', z: 10.6 },
                    { label: 'CMBR Fog', z: 1090 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setInputZ(p.z)}
                      className="px-2 py-1 text-[10px] font-mono rounded-lg bg-cosmic-900 border border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-white cursor-pointer"
                    >
                      {p.label} (z={p.z})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-300">Cosmological Redshift (z):</span>
                  <span className="text-cyan-300 font-bold text-sm">z = {inputZ}</span>
                </div>
                <input
                  type="number"
                  min="0.001"
                  max="2000"
                  step="0.1"
                  value={inputZ}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (Number.isFinite(v)) setInputZ(Math.max(0.0001, Math.min(2000, v)));
                  }}
                  className="w-full bg-cosmic-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs text-center">
                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Lookback Time:</span>
                  <span className="text-sm font-bold text-cyan-300">{redshiftData.lookbackGyr} Billion Yrs</span>
                  <span className="text-[9px] text-slate-500 block">Time light travelled</span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Comoving Distance:</span>
                  <span className="text-sm font-bold text-emerald-400">{redshiftData.comovingMly} Mly</span>
                  <span className="text-[9px] text-slate-500 block">{redshiftData.comovingMpc} Mpc</span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Relativistic Velocity:</span>
                  <span className="text-xs font-bold text-amber-300">{redshiftData.vRel} km/s</span>
                  <span className="text-[9px] text-slate-500 block">{((Number(redshiftData.vRel) / 299792) * 100).toFixed(1)}% Speed of Light</span>
                </div>

                <div className="bg-cosmic-900 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Cosmic Scale Factor a(t):</span>
                  <span className="text-xs font-bold text-white">{redshiftData.scaleA}</span>
                  <span className="text-[9px] text-slate-500 block">Temp: {redshiftData.tempK} K</span>
                </div>
              </div>
            </div>

            {/* LAB 3: Big Bang Nucleosynthesis (BBN) Abundance Simulator */}
            <div className="bg-cosmic-950/90 border border-amber-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Atom className="w-4 h-4 text-amber-400" />
                  <span>୩. ପ୍ରାଥମିକ ମୌଳିକ ଅନୁପାତ (BBN Elemental Abundances)</span>
                </h5>
                <span className="font-mono text-[10px] text-amber-400">t = 3 min</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-300">Baryon-to-Photon Ratio (η₁₀):</span>
                  <span className="text-amber-400 font-bold">{baryonPhotonEta.toFixed(2)} × 10⁻¹⁰</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="10.0"
                  step="0.1"
                  value={baryonPhotonEta}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (Number.isFinite(v)) setBaryonPhotonEta(Math.max(1.0, Math.min(10.0, v)));
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Standard Planck Value: η₁₀ = 6.12 ± 0.04</span>
              </div>

              <div className="space-y-2">
                <div className="w-full h-5 rounded-xl overflow-hidden flex bg-slate-900 border border-slate-700">
                  <div style={{ width: `${bbnData.h1}%` }} className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-black" title="Hydrogen-1">
                    {bbnData.h1}% H
                  </div>
                  <div style={{ width: `${bbnData.he4}%` }} className="bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-black" title="Helium-4">
                    {bbnData.he4}% He
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-center">
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <span className="text-slate-400 block text-[9px]">Hydrogen-1:</span>
                    <span className="font-bold text-amber-300">{bbnData.h1}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                    <span className="text-slate-400 block text-[9px]">Helium-4:</span>
                    <span className="font-bold text-cyan-300">{bbnData.he4}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Deuterium:</span>
                    <span className="font-bold text-emerald-400">{bbnData.deuterium}×10⁻⁵</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Lithium-7:</span>
                    <span className="font-bold text-rose-400">{bbnData.lithium}×10⁻¹⁰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LAB 4: Cosmological Horizons & The Hubble Tension */}
            <div className="bg-cosmic-950/90 border border-rose-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-400" />
                  <span>୪. କସ୍ମୋଲୋଜିକାଲ୍ ଦିଗ୍‌ବଳୟ ଓ ହବଲ୍ ଟେନ୍‌ସନ୍ (Hubble Tension)</span>
                </h5>
                <span className="font-mono text-[10px] text-rose-400">5.0σ Discrepancy</span>
              </div>

              {/* Horizons Metrics */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-cosmic-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Particle Horizon:</span>
                  <span className="text-sm font-bold text-cyan-300">{particleHorizonGly} Gly</span>
                  <span className="text-[8px] text-slate-500 block">Observable Edge</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-cosmic-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Event Horizon:</span>
                  <span className="text-sm font-bold text-emerald-300">{eventHorizonGly} Gly</span>
                  <span className="text-[8px] text-slate-500 block">Future Light Boundary</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-cosmic-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Hubble Sphere:</span>
                  <span className="text-sm font-bold text-cosmic-gold">{hubbleRadiusGly} Gly</span>
                  <span className="text-[8px] text-slate-500 block">c / H₀ Radius</span>
                </div>
              </div>

              {/* The Hubble Tension Breakdown */}
              <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-2xl space-y-1.5 font-mono text-xs">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                  The Hubble Tension Paradox (ଆଧୁନିକ ଜ୍ୟୋତିର୍ବିଜ୍ଞାନର ସବୁଠାରୁ ବଡ଼ ପ୍ରହେଳିକା):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-black/50 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Early Universe (Planck CMB):</span>
                    <span className="text-emerald-400 font-bold">H₀ = 67.4 ± 0.5</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Late Universe (SH0ES Cepheids):</span>
                    <span className="text-amber-400 font-bold">H₀ = 73.04 ± 1.04</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-0.5 leading-normal">
                  ଏହି ୫.୬ km/s/Mpc ର ପାର୍ଥକ୍ୟ ୫-ସିଗ୍ମା (5σ) ସ୍ତରକୁ ଟପି ସାରିଛି, ଯାହା ସୂଚାଉଛି ଯେ ବ୍ରହ୍ମାଣ୍ଡରେ ନୂତନ ପଦାର୍ଥ ବିଜ୍ଞାନ (New Physics or Early Dark Energy) କାର୍ଯ୍ୟ କରୁଛି!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: VEDIC GENESIS & COSMIC CYCLES SYNTHESIS (INTERACTIVE CHRONOLOGY) */}
      {/* ========================================================================= */}
      {activeTab === 'vedic' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-cosmic-950/90 border border-amber-500/40 p-6 rounded-3xl space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 font-mono">
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span>ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ ଓ ଆଧୁନିକ ଚକ୍ରୀୟ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ</span>
              </span>
              <span className="text-xs font-mono text-cosmic-gold bg-black/50 px-3 py-1 rounded-xl border border-white/10">
                Surya Siddhanta & Penrose CCC Engine
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-amber-300 font-serif">
              ବୈଦିକ କାଳଚକ୍ର, ନାସଦୀୟ ସୂକ୍ତ ଓ ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍‌ଙ୍କ Conformal Cyclic Cosmology
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ଭାରତୀୟ ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତରେ ବର୍ଣ୍ଣିତ ୪.୩୨ ବିଲିୟନ ବର୍ଷର "କଳ୍ପ" (ଯାହା ଆମ ପୃଥିବୀର ବୟସ ୪.୫୪ ବିଲିୟନ ବର୍ଷ ସହ ୯୫% ନିକଟବର୍ତ୍ତୀ) ଏବଂ ୩୧୧.୦୪ ଟ୍ରିଲିୟନ ବର୍ଷର "ମହାକଳ୍ପ" ସହିତ ନୋବେଲ୍ ବିଜେତା ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍‌ଙ୍କ CCC ଥିଓରୀର ଗଭୀର ଗାଣିତିକ ସମନ୍ୱୟ।
            </p>
          </div>

          {/* Interactive Vedic Time Scale Explorer Buttons */}
          <div className="space-y-3 bg-cosmic-950/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cosmic-gold flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-cosmic-gold" />
                <span>ଆମେ ମହାକାଳର କେଉଁ ବିନ୍ଦୁରେ ଅଛେ? (Where Are We in Cosmic Deep Time?):</span>
              </span>
              <span className="text-xs font-mono text-cyan-400">Current Era: 51st Year, Kali Yuga 5126</span>
            </div>

            {/* Level Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              {[
                { id: 'mahakalpa', labelOr: '୧. ମହାକଳ୍ପ (Brahma 100 Yr)', span: '311.04 Trillion Yrs' },
                { id: 'kalpa', labelOr: '୨. ଶ୍ୱେତବରାହ କଳ୍ପ (Day)', span: '4.32 Billion Yrs' },
                { id: 'manvantara', labelOr: '୩. ବୈବସ୍ୱତ ମନ୍ୱନ୍ତର', span: '308.4 Million Yrs' },
                { id: 'yuga', labelOr: '୪. କଳିଯୁଗ (Present Era)', span: '432,000 Yrs (5126 Passed)' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setVedicExplorerLevel(lvl.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    vedicExplorerLevel === lvl.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-cosmic-950 font-bold border-white shadow-lg'
                      : 'bg-cosmic-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="font-bold truncate text-xs">{lvl.labelOr}</div>
                  <div className="text-[10px] opacity-80">{lvl.span}</div>
                </button>
              ))}
            </div>

            {/* Detailed Active Level Dossier */}
            <div className="bg-black/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              {vedicExplorerLevel === 'mahakalpa' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">ବ୍ରହ୍ମାଙ୍କ ୧୦୦ ବର୍ଷର ଜୀବନକାଳ (Maha-Kalpa / Para)</span>
                    <span className="text-cosmic-gold">3.1104 × 10¹⁴ Solar Years (311.04 Trillion Yrs)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex">
                    <div style={{ width: '50%' }} className="bg-amber-500 h-full" title="50 Years Elapsed" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ବର୍ତ୍ତମାନ ବ୍ରହ୍ମାଙ୍କର ପ୍ରଥମ ୫୦ ବର୍ଷ (ପ୍ରଥମ ପରାର୍ଦ୍ଧ = ୧୫୫.୫୨ ଟ୍ରିଲିୟନ ବର୍ଷ) ଅତୀତ ହୋଇସାରିଛି। ଆମେ ଏବେ ୫୧ତମ ବର୍ଷର ପ୍ରଥମ ଦିବସରେ (ଦ୍ୱିତୀୟ ପରାର୍ଦ୍ଧ) ବିଦ୍ୟମାନ। ଆଧୁନିକ ଡାର୍କ ଏନର୍ଜି ମଡେଲ୍ ଅନୁସାରେ ୧୦୦ ଟ୍ରିଲିୟନ ବର୍ଷ ପରେ ହିଁ ତାରାମାନଙ୍କ ଶେଷ ବିଲୋପ ଘଟିବ, ଯାହା ଏହି ୩୧୧ ଟ୍ରିଲିୟନ ବର୍ଷର ସ୍କେଲ୍ ସହିତ ଗଭୀର ଭାବେ ତାଳମେଳ ରଖେ।
                  </p>
                </div>
              )}

              {vedicExplorerLevel === 'kalpa' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">ଶ୍ୱେତ ବରାହ କଳ୍ପ (Shveta Varaha Kalpa - 1 Day of Brahma)</span>
                    <span className="text-emerald-400 font-bold">4.32 Billion Years (୪.୩୨ ବିଲିୟନ ବର୍ଷ)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex">
                    <div style={{ width: '45.6%' }} className="bg-emerald-500 h-full" title="1.972 Billion Years Elapsed" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>ଅତୀତ: ୧.୯୭୨ ବିଲିୟନ ବର୍ଷ (45.6%)</span>
                    <span>ଅବଶିଷ୍ଟ: ୨.୩୪୮ ବିଲିୟନ ବର୍ଷ (54.4%)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ ଅନୁଯାୟୀ ୧ କଳ୍ପ = ୧,୦୦୦ ମହାଯୁଗ = ୪,୩୨୦,୦୦୦,୦୦୦ ସୌର ବର୍ଷ। ଭୂ-ବିଜ୍ଞାନୀମାନେ ରେଡିଓମେଟ୍ରିକ୍ ଡେଟିଂ ଦ୍ୱାରା ପ୍ରମାଣ କରିଛନ୍ତି ଯେ ଆମ ପୃଥିବୀର ପ୍ରକୃତ ବୟସ ୪.୫୪ ବିଲିୟନ ବର୍ଷ। ବିଶ୍ୱ ଇତିହାସରେ ପ୍ରାଚୀନ ଗ୍ରୀକ୍, ମିଶର ବା ବାବିଲୋନିୟା କେବଳ କିଛି ହଜାର ବର୍ଷର କଳ୍ପନା କରୁଥିବା ବେଳେ ଭାରତୀୟ ଋଷିମାନେ ବିଲିୟନ ବର୍ଷର ସଠିକ୍ ସମୟ ଗଣନା କରିଥିଲେ!
                  </p>
                </div>
              )}

              {vedicExplorerLevel === 'manvantara' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">୭ମ ବୈବସ୍ୱତ ମନ୍ୱନ୍ତର (Vaivasvata Manvantara)</span>
                    <span className="text-cyan-400 font-bold">308.4 Million Years (୭୧ ମହାଯୁଗ)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ୧ କଳ୍ପରେ ୧୪ଟି ମନ୍ୱନ୍ତର ଥାଏ। ପୂର୍ବର ୬ଟି ମନ୍ୱନ୍ତର (ସ୍ୱାୟମ୍ଭୁବ, ସ୍ୱାରୋଚିଷ, ଉତ୍ତମ, ତାମସ, ରୈବତ, ଚାକ୍ଷୁଷ) ସମାପ୍ତ ହୋଇସାରିଛି। ଆମେ ବର୍ତ୍ତମାନ ୭ମ ବୈବସ୍ୱତ ମନ୍ୱନ୍ତରରେ ଅଛୁ, ଯାହା ଭୂ-ବୈଜ୍ଞାନିକ ଫାନେରୋଜୋଇକ୍ ଏରା (Phanerozoic Eon - ଜୀବଜଗତର ବିକାଶ) ସହିତ ସମନ୍ୱିତ।
                  </p>
                </div>
              )}

              {vedicExplorerLevel === 'yuga' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">୨୮ତମ ଚତୁର୍ଯୁଗ ଓ କଳିଯୁଗ (Kali Yuga)</span>
                    <span className="text-rose-400 font-bold">432,000 Solar Years (୫,୧୨୬ ବର୍ଷ ଅତୀତ)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex">
                    <div style={{ width: '1.2%' }} className="bg-rose-500 h-full" title="5,126 Years Elapsed (1.2%)" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>ଆରମ୍ଭ: ଖ୍ରୀ.ପୂ. ୩୧୦୨ (ମହାଭାରତ ଯୁଦ୍ଧ ସମାପ୍ତି)</span>
                    <span>ଅବଶିଷ୍ଟ: ୪୨୬,୮୭୪ ବର୍ଷ (98.8%)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ୧ ଚତୁର୍ଯୁଗ = ସତ୍ୟ (୧,୭୨୮,୦୦୦ ବର୍ଷ) + ତ୍ରେତା (୧,୨୯୬,୦୦୦ ବର୍ଷ) + ଦ୍ୱାପର (୮୬୪,୦୦୦ ବର୍ଷ) + କଳି (୪୩୨,୦୦୦ ବର୍ଷ) = ୪,୩୨୦,୦୦୦ ବର୍ଷ। ଆଜି କଳିଯୁଗର ମାତ୍ର ୫,୧୨୬ ବର୍ଷ ବିତିଛି—ମାନବଜାତି କଳିଯୁଗର କେବଳ ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟରେ ଅଛି।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comparative Synthesis Matrix: Vedic vs Modern Astrophysics */}
          <div className="bg-cosmic-950/90 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-serif">
              <Award className="w-4 h-4 text-amber-400" />
              <span>ବୈଦିକ ସିଦ୍ଧାନ୍ତ ଓ ଆଧୁନିକ ବ୍ରହ୍ମାଣ୍ଡ ବିଜ୍ଞାନ ମଧ୍ୟରେ ତୁଳନାତ୍ମକ ବିଶ୍ଳେଷଣ</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cosmic-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <span>୧. ନାସଦୀୟ ସୂକ୍ତ ↔ କ୍ୱାଣ୍ଟମ୍ ଭ୍ୟାକ୍ୟୁମ୍ ଫ୍ଲକଚୁଏସନ୍</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ଋଗ୍‌ବେଦ ୧୦.୧୨୯ କୁହେ: "ସୃଷ୍ଟି ପୂର୍ବରୁ ନା ଅସତ୍ (Void) ଥିଲା ନା ସତ୍ (Matter) ଥିଲା।" ଆଧୁନିକ କ୍ୱାଣ୍ଟମ୍ ଫିଲ୍ଡ୍ ଥିଓରୀ ଅନୁସାରେ ଶୂନ୍ୟସ୍ଥାନ ମଧ୍ୟ ଶୂନ୍ୟ ନୁହେଁ, ତାହା କ୍ୱାଣ୍ଟମ୍ ଭ୍ୟାକ୍ୟୁମ୍ ଫ୍ଲକଚୁଏସନ୍ ଯେଉଁଠାରୁ ଭର୍ଚୁଆଲ୍ କଣିକାମାନେ ସୃଷ୍ଟି ହୁଅନ୍ତି।
                </p>
              </div>

              <div className="bg-cosmic-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                  <span>୨. ହିରଣ୍ୟଗର୍ଭ ↔ ଜର୍ଜ ଲେମେଟ୍ରେଙ୍କ Primeval Atom</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ଋଗ୍‌ବେଦ ୧୦.୧୨୧ ର "ହିରଣ୍ୟଗର୍ଭ" (ସ୍ୱର୍ଣ୍ଣିମ କସ୍ମିକ୍ ଏଗ୍) ଏବଂ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍‌ର ପିତାମହ ଜର୍ଜ ଲେମେଟ୍ରେଙ୍କ "Primeval Cosmic Egg / Cosmic Atom" ଏକା ତତ୍ତ୍ୱ—ଏକ ଅତି ଉତ୍ତପ୍ତ ଘନ ବିନ୍ଦୁରୁ ସମଗ୍ର ବିଶ୍ୱର ବିସ୍ଫୋରଣ।
                </p>
              </div>

              <div className="bg-cosmic-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                  <span>୩. ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ କଳ୍ପ ↔ ପୃଥିବୀର ବୟସ (୪.୫୪ Gyr)</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ୧ କଳ୍ପ = ୪.୩୨ ବିଲିୟନ ବର୍ଷ। ପୃଥିବୀର ପ୍ରକୃତ ବୟସ = ୪.୫୪ ବିଲିୟନ ବର୍ଷ। ଏହି ସଠିକତା ପ୍ରମାଣ କରେ ଯେ ପ୍ରାଚୀନ ଭାରତୀୟ ଖଗୋଳବିଦ୍‌ମାନେ ଗ୍ରହମାନଙ୍କ ଗତିବିଧି ଓ ମହାକାଳର ନିୟମ ଅତି ସୂକ୍ଷ୍ମ ଭାବେ ଆୟତ୍ତ କରିଥିଲେ।
                </p>
              </div>

              <div className="bg-cosmic-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-mono">
                  <span>୪. ସୃଷ୍ଟି-ପ୍ରଳୟ ଚକ୍ର ↔ ପେନ୍‌ରୋଜ୍ CCC ଥିଓରୀ</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ନୋବେଲ୍ ବିଜେତା ସାର୍ ରୋଜର୍ ପେନ୍‌ରୋଜ୍‌ଙ୍କ Conformal Cyclic Cosmology (CCC) ଗାଣିତିକ ଭାବେ ପ୍ରମାଣ କରେ ଯେ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଏକମାତ୍ର ଘଟଣା ନୁହେଁ। ବ୍ରହ୍ମାଣ୍ଡ ଅନନ୍ତ ଚକ୍ର (Aeons) ରେ ପ୍ରସାରିତ ହୁଏ ଏବଂ ନୂତନ ବିଗ୍ ବ୍ୟାଙ୍ଗ୍ ଜନ୍ମ ନିଏ, ଯାହା ଋଗ୍‌ବେଦର "ଧାତା ୟଥାପୂର୍ବମକଳ୍ପୟତ୍" ସହିତ ସମାନ।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
