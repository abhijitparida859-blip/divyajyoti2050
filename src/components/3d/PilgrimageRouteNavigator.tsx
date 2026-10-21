import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Car,
  Footprints,
  ExternalLink,
  Clock,
  Milestone,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  LocateFixed,
  X,
  Layers,
  Play,
  Search,
  Crosshair,
  Thermometer,
  Wind,
  Mountain,
  ArrowUpDown,
  Loader2,
  Globe,
  Flame,
  Activity,
  Zap
} from 'lucide-react';
import { useI18n, Language } from '../../localization/i18n';
import {
  searchGlobalLocations,
  fetchLocationTelemetry,
  GeoSearchResult,
  LocationWeatherTelemetry
} from '../../services/globalGeoService';
import {
  calculateMultiRoutes,
  computeDistanceKm,
  formatDurationHuman,
  RouteOption
} from '../../services/routeEngineService';
import { requestMobileGPSLocation } from '../../core/geo/mobileLocationService';

export interface RoutePoint {
  nameOr: string;
  nameHi?: string;
  nameEn: string;
  shortNameOr?: string;
  shortNameHi?: string;
  shortNameEn?: string;
  lat: number;
  lon: number;
  category?: 'temple' | 'city' | 'gps' | 'custom';
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  formattedDurationOr?: string;
  formattedDurationHi?: string;
  formattedDurationEn?: string;
  coordinates: [number, number][]; // [lat, lon] array for Leaflet
  alternateCoordinates?: [number, number][]; // Secondary route coordinates
  steps: { instruction: string; distanceM: number }[];
  bearingDegrees: number;
  compassDirectionOr: string;
  compassDirectionHi?: string;
  compassDirectionEn: string;
  dishaShulaStatus: {
    isShula: boolean;
    dayNameOr: string;
    shulaDirectionOr: string;
    adviceOr: string;
    adviceHi?: string;
    adviceEn?: string;
  };
  googleMapsUrl: string;
  routeTitleOr?: string;
  routeTitleHi?: string;
  routeTitleEn?: string;
  walkingStats?: {
    caloriesKcal: number;
    stepsCount: number;
    dailyStagesCount: number;
    adviceOr: string;
    adviceHi?: string;
    adviceEn?: string;
  };
}

export const PRESET_DESTINATIONS: RoutePoint[] = [
  { nameOr: 'ପୁରୀ ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର', nameHi: 'पुरी श्री जगन्नाथ मंदिर', nameEn: 'Puri Shree Jagannath Temple', shortNameOr: 'ପୁରୀ (ଜଗନ୍ନାଥ)', shortNameHi: 'पुरी (जगन्नाथ)', shortNameEn: 'Puri', lat: 19.8049, lon: 85.8179, category: 'temple' },
  { nameOr: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର', nameHi: 'कोणार्क सूर्य मंदिर', nameEn: 'Konark Sun Temple', shortNameOr: 'କୋଣାର୍କ', shortNameHi: 'कोणार्क', shortNameEn: 'Konark', lat: 19.8876, lon: 86.0945, category: 'temple' },
  { nameOr: 'ଭୁବନେଶ୍ୱର ଏକାମ୍ର କ୍ଷେତ୍ର ଲିଙ୍ଗରାଜ', nameHi: 'लिंगराज मंदिर भुवनेश्वर', nameEn: 'Lingaraj Temple, Bhubaneswar', shortNameOr: 'ଲିଙ୍ଗରାଜ', shortNameHi: 'लिंगराज', shortNameEn: 'Lingaraj', lat: 20.2382, lon: 85.8336, category: 'temple' },
  { nameOr: 'ମା’ ତାରାତାରିଣୀ ଶକ୍ତିପୀଠ (ଗଞ୍ଜାମ)', nameHi: 'माँ तारातारिणी शक्तिपीठ (गंजम)', nameEn: 'Maa Taratarini Shaktipeetha, Ganjam', shortNameOr: 'ତାରାତାରିଣୀ', shortNameHi: 'तारातारिणी', shortNameEn: 'Taratarini', lat: 19.4939, lon: 84.8988, category: 'temple' },
  { nameOr: 'ମା’ ସମଲେଶ୍ୱରୀ ପୀଠ (ସମ୍ବଲପୁର)', nameHi: 'माँ समलेश्वरी (संबलपुर)', nameEn: 'Maa Samaleswari, Sambalpur', shortNameOr: 'ସମଲେଶ୍ୱରୀ', shortNameHi: 'समलेश्वरी', shortNameEn: 'Samaleswari', lat: 21.4646, lon: 83.9664, category: 'temple' },
  { nameOr: 'ମା’ ବିରଜା କ୍ଷେତ୍ର (ଯାଜପୁର)', nameHi: 'माँ बिरजा क्षेत्र (जाजपुर)', nameEn: 'Maa Biraja Kshetra, Jajpur', shortNameOr: 'ବିରଜା (ଯାଜପୁର)', shortNameHi: 'बिरजा (जाजपुर)', shortNameEn: 'Biraja', lat: 20.8497, lon: 86.3402, category: 'temple' },
  { nameOr: 'ମା’ ଶାରଳା ପୀଠ (ଝଙ୍କଡ଼, ଜଗତସିଂହପୁର)', nameHi: 'माँ शारला पीठ (झंकड़)', nameEn: 'Maa Sarala, Jhankada', shortNameOr: 'ଶାରଳା (ଝଙ୍କଡ଼)', shortNameHi: 'शारला', shortNameEn: 'Sarala', lat: 20.2936, lon: 86.3045, category: 'temple' },
  { nameOr: 'ଘଟଗାଁ ମା’ ତାରିଣୀ (କେନ୍ଦୁଝର)', nameHi: 'घटगाँव माँ तारिणी', nameEn: 'Ghatagaon Maa Tarini, Keonjhar', shortNameOr: 'ମା’ ତାରିଣୀ', shortNameHi: 'माँ तारिणी', shortNameEn: 'Tarini', lat: 21.5642, lon: 85.8972, category: 'temple' },
  { nameOr: 'ଗୁପ୍ତେଶ୍ୱର ଶିବ ପୀଠ (କୋରାପୁଟ)', nameHi: 'गुप्तेश्वर शिव पीठ (कोरापुट)', nameEn: 'Gupteswar Cave, Koraput', shortNameOr: 'ଗୁପ୍ତେଶ୍ୱର', shortNameHi: 'गुप्तेश्वर', shortNameEn: 'Gupteswar', lat: 18.8242, lon: 82.1678, category: 'temple' },
  { nameOr: 'କଟକ ବାବା ଧବଳେଶ୍ୱର ପୀଠ', nameHi: 'कटक बाबा धवलेश्वर मंदिर', nameEn: 'Dhabaleswar Temple, Cuttack', shortNameOr: 'ଧବଳେଶ୍ୱର', shortNameHi: 'धवलेश्वर', shortNameEn: 'Dhabaleswar', lat: 20.5283, lon: 85.7871, category: 'temple' },
  { nameOr: 'କାଶୀ ବିଶ୍ୱନାଥ (ବାରାଣସୀ, UP)', nameHi: 'काशी विश्वनाथ (वाराणसी)', nameEn: 'Kashi Vishwanath, Varanasi', shortNameOr: 'କାଶୀ ବିଶ୍ୱନାଥ', shortNameHi: 'काशी विश्वनाथ', shortNameEn: 'Kashi', lat: 25.3109, lon: 83.0107, category: 'temple' },
  { nameOr: 'ଅଯୋଧ୍ୟା ଶ୍ରୀରାମ ଜନ୍ମଭୂମି ମନ୍ଦିର', nameHi: 'अयोध्या श्रीराम जन्मभूमि मंदिर', nameEn: 'Ayodhya Ram Mandir', shortNameOr: 'ଅଯୋଧ୍ୟା ରାମ', shortNameHi: 'अयोध्या राम', shortNameEn: 'Ayodhya', lat: 26.7996, lon: 82.2033, category: 'temple' },
  { nameOr: 'ତିରୁପତି ବାଲାଜୀ (ଆନ୍ଧ୍ରପ୍ରଦେଶ)', nameHi: 'तिरुपति बालाजी (आंध्र प्रदेश)', nameEn: 'Tirupati Balaji, Andhra Pradesh', shortNameOr: 'ତିରୁପତି', shortNameHi: 'तिरुपति', shortNameEn: 'Tirupati', lat: 13.6833, lon: 79.3472, category: 'temple' },
  { nameOr: 'ରାମେଶ୍ୱରମ୍ ରାମନାଥସ୍ୱାମୀ (ତାମିଲନାଡୁ)', nameHi: 'रामेश्वरम ज्योतिर्लिंग (तमिलनाडु)', nameEn: 'Rameswaram Jyotirlinga, Tamil Nadu', shortNameOr: 'ରାମେଶ୍ୱରମ୍', shortNameHi: 'रामेश्वरम', shortNameEn: 'Rameswaram', lat: 9.2881, lon: 79.3174, category: 'temple' },
  { nameOr: 'କେଦାରନାଥ ଧାମ (ଉତ୍ତରାଖଣ୍ଡ)', nameHi: 'केदारनाथ धाम (उत्तराखंड)', nameEn: 'Kedarnath Dham, Uttarakhand', shortNameOr: 'କେଦାରନାଥ', shortNameHi: 'केदारनाथ', shortNameEn: 'Kedarnath', lat: 30.7352, lon: 79.0669, category: 'temple' }
];

export const PRESET_ORIGINS: RoutePoint[] = [
  { nameOr: 'ଭୁବନେଶ୍ୱର ମାଷ୍ଟର କ୍ୟାଣ୍ଟିନ୍', nameHi: 'भुवनेश्वर मास्टर कैंटीन', nameEn: 'Bhubaneswar Master Canteen', lat: 20.2668, lon: 85.8436, category: 'city' },
  { nameOr: 'କଟକ ବାଦାମବାଡ଼ି ବସ୍ ଷ୍ଟାଣ୍ଡ୍', nameHi: 'कटक बादामबाड़ी बस स्टैंड', nameEn: 'Cuttack Badambadi', lat: 20.4578, lon: 85.8828, category: 'city' },
  { nameOr: 'ବ୍ରହ୍ମପୁର ନୂଆ ବସ୍ ଷ୍ଟାଣ୍ଡ୍', nameHi: 'ब्रह्मपुर नया बस स्टैंड', nameEn: 'Berhampur Bus Stand', lat: 19.3149, lon: 84.7941, category: 'city' },
  { nameOr: 'ରାଉରକେଲା ମୁଖ୍ୟ ଛକ', nameHi: 'राउरकेला मुख्य चौक', nameEn: 'Rourkela City Center', lat: 22.2604, lon: 84.8536, category: 'city' },
  { nameOr: 'ସମ୍ବଲପୁର ଅଇଁଠାପାଲି', nameHi: 'संबलपुर ऐंठापाली', nameEn: 'Sambalpur Ainthapali', lat: 21.4669, lon: 83.9756, category: 'city' },
  { nameOr: 'ବାଲେଶ୍ୱର ରେଳ ଷ୍ଟେସନ୍', nameHi: 'बालेश्वर रेलवे स्टेशन', nameEn: 'Balasore Railway Station', lat: 21.4934, lon: 86.9135, category: 'city' },
  { nameOr: 'କଲିକତା ହାଓଡ଼ା ଷ୍ଟେସନ୍', nameHi: 'कोलकाता हावड़ा स्टेशन', nameEn: 'Howrah, Kolkata', lat: 22.5850, lon: 88.3426, category: 'city' },
  { nameOr: 'ନୂଆଦିଲ୍ଲୀ କନ୍ନଟ୍ ପ୍ଲେସ୍', nameHi: 'नई दिल्ली कनॉट प्लेस', nameEn: 'Connaught Place, New Delhi', lat: 28.6304, lon: 77.2177, category: 'city' }
];

// Calculate Great Circle Distance in KM
export const calculateHaversineKm = computeDistanceKm;

// Calculate Initial Bearing in Degrees (0 - 360)
export function calculateBearingDegrees(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const f1 = (lat1 * Math.PI) / 180;
  const f2 = (lat2 * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dl) * Math.cos(f2);
  const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Convert Bearing to 8 Cardinal Directions
export function getCompassDirection(bearing: number): { or: string; hi: string; en: string } {
  const val = Math.floor(bearing / 45 + 0.5) % 8;
  const directions = [
    { or: 'ଉତ୍ତର (North)', hi: 'उत्तर (North)', en: 'North' },
    { or: 'ଐଶାନ୍ୟ (North-East)', hi: 'ईशान (North-East)', en: 'North-East' },
    { or: 'ପୂର୍ବ (East)', hi: 'पूर्व (East)', en: 'East' },
    { or: 'ଆଗ୍ନେୟ (South-East)', hi: 'आग्नेय (South-East)', en: 'South-East' },
    { or: 'ଦକ୍ଷିଣ (South)', hi: 'दक्षिण (South)', en: 'South' },
    { or: 'ନୈରୃତ (South-West)', hi: 'नैऋत्य (South-West)', en: 'South-West' },
    { or: 'ପଶ୍ଚିମ (West)', hi: 'पश्चिम (West)', en: 'West' },
    { or: 'ବାୟବ୍ୟ (North-West)', hi: 'वायव्य (North-West)', en: 'North-West' }
  ];
  return directions[val];
}

// Vedic Disha Shula Advice Based on Day of Week
export function getVedicDishaShula(date: Date, bearing: number) {
  const dayIndex = date.getDay();
  const days = [
    {
      nameOr: 'ରବିବାର', nameHi: 'रविवार', nameEn: 'Sunday',
      shulaDirs: ['West', 'North-West', 'South-West'],
      dirOr: 'ପଶ୍ଚିମ ଦିଗ', dirHi: 'पश्चिम दिशा', dirEn: 'West',
      adviceOr: 'ଆଜି ପଶ୍ଚିମ ଦିଗ ଶୂଳ। ଯଦି ଜରୁରୀ ଯାତ୍ରା ଥାଏ, ତେବେ ଘିଅ କିମ୍ବା ପାନ ଖାଇ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ।',
      adviceHi: 'आज पश्चिम दिशाशूल है। आवश्यक यात्रा हो तो घी अथवा पान खाकर प्रस्थान करें।',
      adviceEn: 'Sunday Disha Shula is towards the West. Consume a spoonful of ghee or betel leaf before travel.'
    },
    {
      nameOr: 'ସୋମବାର', nameHi: 'सोमवार', nameEn: 'Monday',
      shulaDirs: ['East', 'North-East', 'South-East'],
      dirOr: 'ପୂର୍ବ ଦିଗ', dirHi: 'पूर्व दिशा', dirEn: 'East',
      adviceOr: 'ଆଜି ପୂର୍ବ ଦିଗ ଶୂଳ। ଯଦି ଜରୁରୀ ଯାତ୍ରା ଥାଏ, ତେବେ ଦର୍ପଣ ଦେଖି କିମ୍ବା କ୍ଷୀର ପିଇ ଯାତ୍ରା କରନ୍ତୁ।',
      adviceHi: 'आज पूर्व दिशाशूल है। दर्पण देखकर अथवा दूध पीकर यात्रा शुरू करें।',
      adviceEn: 'Monday Disha Shula is towards the East. Look into a mirror or drink milk before journey.'
    },
    {
      nameOr: 'ମଙ୍ଗଳବାର', nameHi: 'मंगलवार', nameEn: 'Tuesday',
      shulaDirs: ['North', 'North-East', 'North-West'],
      dirOr: 'ଉତ୍ତର ଦିଗ', dirHi: 'उत्तर दिशा', dirEn: 'North',
      adviceOr: 'ଆଜି ଉତ୍ତର ଦିଗ ଶୂଳ। ଗୁଡ଼ କିମ୍ବା ଧନିଆ ଖାଇ ଯାତ୍ରା କଲେ ଶୁଭଫଳ ମିଳିଥାଏ।',
      adviceHi: 'आज उत्तर दिशाशूल है। गुड़ अथवा धनिया खाकर प्रस्थान करें।',
      adviceEn: 'Tuesday Disha Shula is towards the North. Consume jaggery or coriander seeds before departure.'
    },
    {
      nameOr: 'ବୁଧବାର', nameHi: 'बुधवार', nameEn: 'Wednesday',
      shulaDirs: ['North', 'North-East', 'North-West'],
      dirOr: 'ଉତ୍ତର ଦିଗ', dirHi: 'उत्तर दिशा', dirEn: 'North',
      adviceOr: 'ଆଜି ଉତ୍ତର ଦିଗ ଶୂଳ। ରାଶି କିମ୍ବା ଗୁଡ଼ ଖାଇ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ।',
      adviceHi: 'आज उत्तर दिशाशूल है। तिल या गुड़ खाकर यात्रा आरंभ करें।',
      adviceEn: 'Wednesday Disha Shula is towards the North. Consume sesame seeds or jaggery before travel.'
    },
    {
      nameOr: 'ଗୁରୁବାର', nameHi: 'गुरुवार', nameEn: 'Thursday',
      shulaDirs: ['South', 'South-East', 'South-West'],
      dirOr: 'ଦକ୍ଷିଣ ଦିଗ', dirHi: 'दक्षिण दिशा', dirEn: 'South',
      adviceOr: 'ଆଜି ଦକ୍ଷିଣ ଦିଗ ଶୂଳ। ଯଦି ଯିବାକୁ ପଡ଼େ, ଦହି କିମ୍ବା ଜିରା ଖାଇ ଯାତ୍ରା କରନ୍ତୁ।',
      adviceHi: 'आज दक्षिण दिशाशूल है। दही या जीरा खाकर यात्रा करें।',
      adviceEn: 'Thursday Disha Shula is towards the South. Consume curd or cumin seeds before journey.'
    },
    {
      nameOr: 'ଶୁକ୍ରବାର', nameHi: 'शुक्रवार', nameEn: 'Friday',
      shulaDirs: ['West', 'North-West', 'South-West'],
      dirOr: 'ପଶ୍ଚିମ ଦିଗ', dirHi: 'पश्चिम दिशा', dirEn: 'West',
      adviceOr: 'ଆଜି ପଶ୍ଚିମ ଦିଗ ଶୂଳ। ଦହି ଖାଇ ଯାତ୍ରା କଲେ ଯାତ୍ରା ମଙ୍ଗଳମୟ ହୋଇଥାଏ।',
      adviceHi: 'आज पश्चिम दिशाशूल है। दही खाकर प्रस्थान करना शुभकारी होता है।',
      adviceEn: 'Friday Disha Shula is towards the West. Consume curd before travel for auspicious results.'
    },
    {
      nameOr: 'ଶନିବାର', nameHi: 'शनिवार', nameEn: 'Saturday',
      shulaDirs: ['East', 'North-East', 'South-East'],
      dirOr: 'ପୂର୍ବ ଦିଗ', dirHi: 'पूर्व दिशा', dirEn: 'East',
      adviceOr: 'ଆଜି ପୂର୍ବ ଦିଗ ଶୂଳ। ଅଦା କିମ୍ବା ସୋରିଷ ଖାଇ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ।',
      adviceHi: 'आज पूर्व दिशाशूल है। अदरक या सरसों खाकर यात्रा शुरू करें।',
      adviceEn: 'Saturday Disha Shula is towards the East. Consume ginger or mustard seeds before journey.'
    }
  ];

  const today = days[dayIndex];
  const { en: currentDirEn } = getCompassDirection(bearing);
  const isShula = today.shulaDirs.includes(currentDirEn);

  return {
    isShula,
    dayNameOr: today.nameOr,
    shulaDirectionOr: today.dirOr,
    adviceOr: isShula
      ? `⚠️ ${today.nameOr} ହେତୁ ${today.dirOr}ରେ ଦିଗଶୂଳ ରହିଛି। ପ୍ରତିକାର: ${today.adviceOr}`
      : `✅ ଆଜି ଏହି ଦିଗକୁ ଯାତ୍ରା ଅତ୍ୟନ୍ତ ଶୁଭ ଓ ମଙ୍ଗଳକର। କୌଣସି ଦିଗଶୂଳ ଦୋଷ ନାହିଁ।`,
    adviceHi: isShula
      ? `⚠️ ${today.nameHi} के कारण ${today.dirHi} में दिशाशूल है। निवारण: ${today.adviceHi}`
      : `✅ आज इस दिशा में यात्रा अत्यंत शुभ और मंगलकारी है। कोई दिशाशूल दोष नहीं है।`,
    adviceEn: isShula
      ? `⚠️ Direction Shula applies towards ${today.dirEn} on ${today.nameEn}. Remedy: ${today.adviceEn}`
      : `✅ Travel in this direction is highly auspicious today. No Disha Shula impediment.`
  };
}

interface Props {
  onRouteCalculated: (route: RouteResult) => void;
  onStartLiveNavigation?: (route: RouteResult, isSimulated: boolean) => void;
  onStartPickOnMap?: (target: 'origin' | 'destination') => void;
  pickedMapPoint?: { target: 'origin' | 'destination'; point: RoutePoint } | null;
  onClose: () => void;
}

export const PilgrimageRouteNavigator: React.FC<Props> = ({
  onRouteCalculated,
  onStartLiveNavigation,
  onStartPickOnMap,
  pickedMapPoint,
  onClose
}) => {
  const { language } = useI18n();

  const getLocalizedName = (pt: RoutePoint, lang: Language) => {
    if (lang === 'or') return pt.nameOr;
    if (lang === 'hi') return pt.nameHi || pt.nameEn;
    return pt.nameEn;
  };

  const getLocalizedShortName = (pt: RoutePoint, lang: Language) => {
    if (lang === 'or') return pt.shortNameOr || pt.nameOr.split(' ')[0];
    if (lang === 'hi') return pt.shortNameHi || pt.nameHi?.split(' ')[0] || pt.shortNameEn || pt.nameEn.split(' ')[0];
    return pt.shortNameEn || pt.nameEn.split(' ')[0];
  };

  // Selected points
  const [origin, setOrigin] = useState<RoutePoint>(PRESET_ORIGINS[0]);
  const [destination, setDestination] = useState<RoutePoint>(PRESET_DESTINATIONS[0]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');

  // Multi-route engine states
  const [availableRoutes, setAvailableRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<'fastest' | 'shortest' | 'walking'>('fastest');

  // Search input queries
  const [originQuery, setOriginQuery] = useState<string>(getLocalizedName(PRESET_ORIGINS[0], language));
  const [destinationQuery, setDestinationQuery] = useState<string>(getLocalizedName(PRESET_DESTINATIONS[0], language));
  const [originSuggestions, setOriginSuggestions] = useState<GeoSearchResult[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<GeoSearchResult[]>([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState<boolean>(false);
  const [isSearchingDestination, setIsSearchingDestination] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<'origin' | 'destination' | null>(null);

  // Real Destination Weather & Elevation Telemetry
  const [weatherTelemetry, setWeatherTelemetry] = useState<LocationWeatherTelemetry | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // GPS state
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Computing state
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteResult | null>(null);

  // Listen to point picked directly on Leaflet map
  useEffect(() => {
    if (!pickedMapPoint) return;
    const localizedPicked = getLocalizedName(pickedMapPoint.point, language);
    if (pickedMapPoint.target === 'origin') {
      setOrigin(pickedMapPoint.point);
      setOriginQuery(localizedPicked);
      executeRouteComputation(pickedMapPoint.point, destination, travelMode);
    } else {
      setDestination(pickedMapPoint.point);
      setDestinationQuery(localizedPicked);
      executeRouteComputation(origin, pickedMapPoint.point, travelMode);
      loadDestinationTelemetry(pickedMapPoint.point.lat, pickedMapPoint.point.lon);
    }
  }, [pickedMapPoint]);

  // Sync localized queries if language changes
  useEffect(() => {
    setOriginQuery(getLocalizedName(origin, language));
    setDestinationQuery(getLocalizedName(destination, language));
    executeRouteComputation(origin, destination, travelMode);
    loadDestinationTelemetry(destination.lat, destination.lon);
  }, [language]);

  // Fetch real atmospheric weather & elevation
  const loadDestinationTelemetry = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    const telemetry = await fetchLocationTelemetry(lat, lon);
    setWeatherTelemetry(telemetry);
    setIsLoadingWeather(false);
  };

  // Debounced search for Origin
  useEffect(() => {
    const timer = setTimeout(async () => {
      const currentOriginName = getLocalizedName(origin, language);
      if (originQuery && originQuery !== currentOriginName && originQuery.length >= 2) {
        setIsSearchingOrigin(true);
        const results = await searchGlobalLocations(originQuery, language);
        setOriginSuggestions(results);
        setIsSearchingOrigin(false);
        setActiveDropdown('origin');
      } else {
        setOriginSuggestions([]);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [originQuery, origin, language]);

  // Debounced search for Destination
  useEffect(() => {
    const timer = setTimeout(async () => {
      const currentDestName = getLocalizedName(destination, language);
      if (destinationQuery && destinationQuery !== currentDestName && destinationQuery.length >= 2) {
        setIsSearchingDestination(true);
        const results = await searchGlobalLocations(destinationQuery, language);
        setDestinationSuggestions(results);
        setIsSearchingDestination(false);
        setActiveDropdown('destination');
      } else {
        setDestinationSuggestions([]);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [destinationQuery, destination, language]);

  // Handle GPS Live Current Location Detection with mobile multi-tier fallback
  const handleDetectGPS = async () => {
    setIsLocatingGPS(true);
    setGpsError(null);

    try {
      const res = await requestMobileGPSLocation();
      if (res.success) {
        const userLoc: RoutePoint = {
          nameOr: res.isExactGps ? 'ମୋର ବର୍ତ୍ତମାନ GPS ଅବସ୍ଥାନ (Live Location)' : `${res.location.nameOr} (ନେଟୱର୍କ ସ୍ଥିତି)`,
          nameHi: res.isExactGps ? 'मेरी वर्तमान जीपीएस स्थिति (Live Location)' : `${res.location.nameHi} (नेटवर्क स्थान)`,
          nameEn: res.isExactGps ? 'My Live GPS Location' : `${res.location.nameEn} (Network Location)`,
          lat: res.location.lat,
          lon: res.location.lon,
          category: 'gps'
        };
        setOrigin(userLoc);
        setOriginQuery(getLocalizedName(userLoc, language));
        setIsLocatingGPS(false);
        executeRouteComputation(userLoc, destination, travelMode);
      } else {
        setIsLocatingGPS(false);
        setGpsError(res.message[language] || res.message.en);
      }
    } catch {
      setIsLocatingGPS(false);
      setGpsError(
        language === 'or'
          ? 'GPS ସନ୍ଧାନ ବିଫଳ ହେଲା। ଲୋକେସନ୍ ଅନୁମତି ଯାଞ୍ଚ କରନ୍ତୁ।'
          : language === 'hi'
          ? 'GPS सिग्नल नहीं मिला। कृपया लोकेशन अनुमति जांचें।'
          : 'Could not fetch GPS. Please check location permissions.'
      );
    }
  };

  // Compute Multi-Routes with Real Google Maps-Grade Kinematics
  const executeRouteComputation = async (
    orig: RoutePoint,
    dest: RoutePoint,
    mode: 'driving' | 'walking'
  ) => {
    setIsCalculating(true);

    const bearing = calculateBearingDegrees(orig.lat, orig.lon, dest.lat, dest.lon);
    const compDir = getCompassDirection(bearing);
    const shula = getVedicDishaShula(new Date(), bearing);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${orig.lat},${orig.lon}&destination=${dest.lat},${dest.lon}&travelmode=${mode}`;

    const routes = await calculateMultiRoutes(orig.lat, orig.lon, dest.lat, dest.lon, language);
    setAvailableRoutes(routes);

    // Pick appropriate route based on travel mode
    const activeRouteId = mode === 'walking' ? 'walking' : selectedRouteId === 'walking' ? 'fastest' : selectedRouteId;
    setSelectedRouteId(activeRouteId);

    const activeOption = routes.find(r => r.id === activeRouteId) || routes[0];
    const alternateOption = routes.find(r => r.id !== activeOption.id);

    const result: RouteResult = {
      distanceKm: activeOption.distanceKm,
      durationMinutes: activeOption.durationMinutes,
      formattedDurationOr: activeOption.formattedDurationOr,
      formattedDurationHi: activeOption.formattedDurationHi,
      formattedDurationEn: activeOption.formattedDurationEn,
      coordinates: activeOption.coordinates,
      alternateCoordinates: alternateOption?.coordinates,
      steps: activeOption.steps,
      bearingDegrees: Math.round(bearing),
      compassDirectionOr: compDir.or,
      compassDirectionHi: compDir.hi,
      compassDirectionEn: compDir.en,
      dishaShulaStatus: shula,
      googleMapsUrl,
      routeTitleOr: activeOption.titleOr,
      routeTitleHi: activeOption.titleHi,
      routeTitleEn: activeOption.titleEn,
      walkingStats: activeOption.walkingStats
    };

    setCalculatedRoute(result);
    onRouteCalculated(result);
    setIsCalculating(false);
  };

  // Switch between route options (Fastest vs Shortest vs Walking)
  const handleSelectRouteOption = (routeId: 'fastest' | 'shortest' | 'walking') => {
    setSelectedRouteId(routeId);
    const chosen = availableRoutes.find(r => r.id === routeId);
    if (!chosen || !calculatedRoute) return;

    const alternateOption = availableRoutes.find(r => r.id !== routeId);

    const updated: RouteResult = {
      ...calculatedRoute,
      distanceKm: chosen.distanceKm,
      durationMinutes: chosen.durationMinutes,
      formattedDurationOr: chosen.formattedDurationOr,
      formattedDurationHi: chosen.formattedDurationHi,
      formattedDurationEn: chosen.formattedDurationEn,
      coordinates: chosen.coordinates,
      alternateCoordinates: alternateOption?.coordinates,
      steps: chosen.steps,
      routeTitleOr: chosen.titleOr,
      routeTitleHi: chosen.titleHi,
      routeTitleEn: chosen.titleEn,
      walkingStats: chosen.walkingStats
    };

    setCalculatedRoute(updated);
    onRouteCalculated(updated);
  };

  const handleSwap = () => {
    const tempO = origin;
    const tempD = destination;
    setOrigin(tempD);
    setDestination(tempO);
    setOriginQuery(getLocalizedName(tempD, language));
    setDestinationQuery(getLocalizedName(tempO, language));
    setActiveDropdown(null);
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
    executeRouteComputation(tempD, tempO, travelMode);
    loadDestinationTelemetry(tempO.lat, tempO.lon);
  };

  return (
    <div className="bg-cosmic-950/98 border-2 border-cosmic-gold/50 rounded-3xl p-4 sm:p-5 text-xs backdrop-blur-2xl shadow-2xl space-y-3 max-w-md w-full animate-in zoom-in-95 select-none no-scrollbar flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cosmic-gold/20 to-amber-500/20 border border-cosmic-gold/40 text-cosmic-gold shadow-lg shadow-cosmic-gold/10">
            <Globe className="w-4 h-4 text-cosmic-gold animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cosmic-gold font-serif">
              {language === 'or'
                ? 'ଗୁଗୁଲ୍ ମ୍ୟାପ୍‌ସ ମଲ୍ଟି-ରୁଟ୍ ନେଭିଗେସନ୍'
                : language === 'hi'
                ? 'गूगल मैप्स मल्टी-रूट नेविगेशन'
                : 'Google Maps Multi-Route Navigator'}
            </h3>
            <span className="text-[10px] text-slate-400 block font-mono">
              {language === 'or'
                ? 'ଦ୍ରୁତତମ ବନାମ କ୍ଷୁଦ୍ରତମ • ପ୍ରକୃତ ବେଗ ଓ ସଠିକ୍ ETA'
                : language === 'hi'
                ? 'सबसे तेज बनाम सबसे छोटा • सटीक गति व वास्तविक ETA'
                : 'Fastest vs Shortest • Real Highway & Pedestrian Speeds'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
          title="Close Navigator"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto space-y-2.5 pr-1 -mr-1 no-scrollbar flex-1">
        {/* Travel Mode Toggle */}
        <div className="flex items-center gap-2 bg-cosmic-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTravelMode('driving');
              setSelectedRouteId('fastest');
              executeRouteComputation(origin, destination, 'driving');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              travelMode === 'driving'
                ? 'bg-gradient-to-r from-cosmic-gold to-yellow-400 text-cosmic-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>
              {language === 'or' ? 'କାର୍ / ବାଇକ୍' : language === 'hi' ? 'कार / बाइक' : 'Driving'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTravelMode('walking');
              setSelectedRouteId('walking');
              executeRouteComputation(origin, destination, 'walking');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              travelMode === 'walking'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>
              {language === 'or' ? 'ପଦଯାତ୍ରା' : language === 'hi' ? 'पदयात्रा' : 'Walking'}
            </span>
          </button>
        </div>

        {/* Origin & Destination Search Inputs */}
        <div className="space-y-2">
          {/* ORIGIN INPUT */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>
                  {language === 'or' ? 'ଯାତ୍ରା ଆରମ୍ଭ:' : language === 'hi' ? 'यात्रा प्रारंभ:' : 'Starting Point:'}
                </span>
              </span>

              <div className="flex items-center gap-1">
                {onStartPickOnMap && (
                  <button
                    type="button"
                    onClick={() => onStartPickOnMap('origin')}
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-sky-950/80 border border-sky-500/50 text-sky-300 hover:bg-sky-800/80 cursor-pointer transition-all shadow-sm"
                    title="Click anywhere on the map to set origin"
                  >
                    <Crosshair className="w-3 h-3 text-sky-400" />
                    <span>{language === 'or' ? 'ମ୍ୟାପ୍ ପିନ୍' : language === 'hi' ? 'मैप पिन' : 'Map Pin'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocatingGPS}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-800/80 cursor-pointer transition-all shadow-sm"
                  title="Detect my current location via GPS"
                >
                  <LocateFixed className={`w-3 h-3 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                  <span>
                    {isLocatingGPS
                      ? (language === 'or' ? 'ସନ୍ଧାନ...' : language === 'hi' ? 'खोज...' : 'Locating...')
                      : (language === 'or' ? 'GPS ସ୍ଥାନ' : language === 'hi' ? 'GPS स्थान' : 'GPS Location')}
                  </span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                onFocus={() => setActiveDropdown('origin')}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (originSuggestions.length > 0) {
                      const top = originSuggestions[0];
                      const newPt: RoutePoint = {
                        nameOr: top.name,
                        nameHi: top.name,
                        nameEn: top.name,
                        lat: top.lat,
                        lon: top.lon,
                        category: 'custom'
                      };
                      setOrigin(newPt);
                      setOriginQuery(top.name);
                      setActiveDropdown(null);
                      executeRouteComputation(newPt, destination, travelMode);
                    } else if (originQuery.trim().length >= 2) {
                      setIsSearchingOrigin(true);
                      const results = await searchGlobalLocations(originQuery, language);
                      setIsSearchingOrigin(false);
                      if (results.length > 0) {
                        const top = results[0];
                        const newPt: RoutePoint = {
                          nameOr: top.name,
                          nameHi: top.name,
                          nameEn: top.name,
                          lat: top.lat,
                          lon: top.lon,
                          category: 'custom'
                        };
                        setOrigin(newPt);
                        setOriginQuery(top.name);
                        setActiveDropdown(null);
                        executeRouteComputation(newPt, destination, travelMode);
                      }
                    }
                  }
                }}
                placeholder={
                  language === 'or'
                    ? 'କୌଣସି ଗାଁ, ସହର ବା ଠିକଣା ଲେଖନ୍ତୁ...'
                    : language === 'hi'
                    ? 'कोई गाँव, शहर अथवा पता लिखें...'
                    : 'Search any place or address on Earth...'
                }
                className="w-full bg-cosmic-900 border border-slate-700 rounded-xl pl-8 pr-8 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {isSearchingOrigin && (
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 absolute right-2.5 top-2.5 animate-spin" />
              )}
            </div>

            {/* Origin Autocomplete Dropdown */}
            {activeDropdown === 'origin' && originSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-cosmic-950 border border-emerald-500/50 rounded-2xl shadow-2xl z-50 max-h-44 overflow-y-auto no-scrollbar backdrop-blur-2xl divide-y divide-slate-800">
                {originSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newPt: RoutePoint = {
                        nameOr: item.name,
                        nameHi: item.name,
                        nameEn: item.name,
                        lat: item.lat,
                        lon: item.lon,
                        category: 'custom'
                      };
                      setOrigin(newPt);
                      setOriginQuery(item.name);
                      setActiveDropdown(null);
                      executeRouteComputation(newPt, destination, travelMode);
                    }}
                    className="w-full text-left p-2 hover:bg-emerald-950/40 text-xs transition-colors cursor-pointer flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{item.fullName}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-1 rounded-full bg-cosmic-900 border border-slate-700 text-slate-300 hover:text-cosmic-gold hover:border-cosmic-gold transition-all cursor-pointer shadow-md"
              title="Swap Origin & Destination"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          {/* DESTINATION INPUT */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cosmic-gold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cosmic-gold" />
                <span>
                  {language === 'or' ? 'ଗନ୍ତବ୍ୟ ସ୍ଥଳ:' : language === 'hi' ? 'गंतव्य स्थल:' : 'Destination Point:'}
                </span>
              </span>

              {onStartPickOnMap && (
                <button
                  type="button"
                  onClick={() => onStartPickOnMap('destination')}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-800/80 cursor-pointer transition-all shadow-sm"
                  title="Click anywhere on the map to set destination"
                >
                  <Crosshair className="w-3 h-3 text-amber-400" />
                  <span>{language === 'or' ? 'ମ୍ୟାପ୍ ପିନ୍' : language === 'hi' ? 'मैप पिन' : 'Map Pin'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onFocus={() => setActiveDropdown('destination')}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (destinationSuggestions.length > 0) {
                      const top = destinationSuggestions[0];
                      const newPt: RoutePoint = {
                        nameOr: top.name,
                        nameHi: top.name,
                        nameEn: top.name,
                        lat: top.lat,
                        lon: top.lon,
                        category: 'custom'
                      };
                      setDestination(newPt);
                      setDestinationQuery(top.name);
                      setActiveDropdown(null);
                      executeRouteComputation(origin, newPt, travelMode);
                      loadDestinationTelemetry(newPt.lat, newPt.lon);
                    } else if (destinationQuery.trim().length >= 2) {
                      setIsSearchingDestination(true);
                      const results = await searchGlobalLocations(destinationQuery, language);
                      setIsSearchingDestination(false);
                      if (results.length > 0) {
                        const top = results[0];
                        const newPt: RoutePoint = {
                          nameOr: top.name,
                          nameHi: top.name,
                          nameEn: top.name,
                          lat: top.lat,
                          lon: top.lon,
                          category: 'custom'
                        };
                        setDestination(newPt);
                        setDestinationQuery(top.name);
                        setActiveDropdown(null);
                        executeRouteComputation(origin, newPt, travelMode);
                        loadDestinationTelemetry(newPt.lat, newPt.lon);
                      }
                    }
                  }
                }}
                placeholder={
                  language === 'or'
                    ? 'ଗନ୍ତବ୍ୟ ମନ୍ଦିର, ସହର ବା ଠିକଣା ସନ୍ଧାନ କରନ୍ତୁ...'
                    : language === 'hi'
                    ? 'गंतव्य मंदिर, शहर या पता खोजें...'
                    : 'Search destination anywhere on Earth...'
                }
                className="w-full bg-cosmic-900 border border-slate-700 rounded-xl pl-8 pr-8 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cosmic-gold focus:outline-none text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {isSearchingDestination && (
                <Loader2 className="w-3.5 h-3.5 text-cosmic-gold absolute right-2.5 top-2.5 animate-spin" />
              )}
            </div>

            {/* Destination Autocomplete Dropdown */}
            {activeDropdown === 'destination' && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-cosmic-950 border border-cosmic-gold/50 rounded-2xl shadow-2xl z-50 max-h-44 overflow-y-auto no-scrollbar backdrop-blur-2xl divide-y divide-slate-800">
                {destinationSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newPt: RoutePoint = {
                        nameOr: item.name,
                        nameHi: item.name,
                        nameEn: item.name,
                        lat: item.lat,
                        lon: item.lon,
                        category: 'custom'
                      };
                      setDestination(newPt);
                      setDestinationQuery(item.name);
                      setActiveDropdown(null);
                      executeRouteComputation(origin, newPt, travelMode);
                      loadDestinationTelemetry(newPt.lat, newPt.lon);
                    }}
                    className="w-full text-left p-2 hover:bg-amber-950/40 text-xs transition-colors cursor-pointer flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cosmic-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{item.fullName}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sacred Shrines Preset Pills (Fixed Distinct Temple Labels with Tri-Lingual Support) */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'or'
                ? 'ତ୍ୱରିତ ପବିତ୍ର ଧାମ:'
                : language === 'hi'
                ? 'त्वरित पवित्र धाम:'
                : 'Quick Sacred Shrines:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {PRESET_DESTINATIONS.slice(0, 8).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDestination(p);
                    setDestinationQuery(getLocalizedName(p, language));
                    executeRouteComputation(origin, p, travelMode);
                    loadDestinationTelemetry(p.lat, p.lon);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    destination.lat === p.lat && destination.lon === p.lon
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow'
                      : 'bg-cosmic-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{getLocalizedShortName(p, language)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GPS Error Feedback */}
        {gpsError && (
          <div className="p-2 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Calculation Loading Spinner */}
        {isCalculating && (
          <div className="p-3 rounded-2xl bg-cosmic-900/60 border border-slate-800 text-center space-y-1.5">
            <div className="inline-block animate-spin text-cosmic-gold">
              <Compass className="w-5 h-5" />
            </div>
            <p className="text-slate-300 font-medium text-[11px]">
              {language === 'or'
                ? 'ଗୁଗୁଲ୍ ମ୍ୟାପ୍‌ସ ମଲ୍ଟି-ରୁଟ୍ ଓ ଗତିବିଧି ଗଣନା ଚାଲିଛି...'
                : language === 'hi'
                ? 'गूगल मैप्स मल्टी-रूट व वास्तविक गति गणना जारी है...'
                : 'Calculating Google Maps routes & realistic ETAs...'}
            </p>
          </div>
        )}

        {/* Google Maps-Grade Multi-Route Comparison Selector */}
        {!isCalculating && availableRoutes.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-cosmic-gold" />
              <span>
                {language === 'or'
                  ? 'ରୁଟ୍ ଚୟନ (Route Options):'
                  : language === 'hi'
                  ? 'रूट चयन (Route Options):'
                  : 'Route Selection:'}
              </span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              {travelMode === 'driving' ? (
                <>
                  {/* Option 1: Fastest Highway */}
                  {availableRoutes.filter(r => r.id === 'fastest').map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRouteOption('fastest')}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedRouteId === 'fastest'
                          ? 'bg-gradient-to-br from-emerald-950/70 to-cosmic-900 border-emerald-400/80 shadow-lg shadow-emerald-950/50'
                          : 'bg-cosmic-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          {language === 'or' ? r.badgeOr : language === 'hi' ? r.badgeHi : r.badgeEn}
                        </span>
                        <span className="text-xs font-black text-white font-mono">{r.distanceKm} km</span>
                      </div>
                      <span className="text-sm font-black text-emerald-300 block">
                        {language === 'or' ? r.formattedDurationOr : language === 'hi' ? r.formattedDurationHi : r.formattedDurationEn}
                      </span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">
                        {language === 'or' ? r.viaRoadOr : language === 'hi' ? r.viaRoadHi : r.viaRoadEn}
                      </span>
                    </button>
                  ))}

                  {/* Option 2: Shortest Distance */}
                  {availableRoutes.filter(r => r.id === 'shortest').map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRouteOption('shortest')}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedRouteId === 'shortest'
                          ? 'bg-gradient-to-br from-amber-950/70 to-cosmic-900 border-amber-400/80 shadow-lg shadow-amber-950/50'
                          : 'bg-cosmic-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          {language === 'or' ? r.badgeOr : language === 'hi' ? r.badgeHi : r.badgeEn}
                        </span>
                        <span className="text-xs font-black text-white font-mono">{r.distanceKm} km</span>
                      </div>
                      <span className="text-sm font-black text-amber-300 block">
                        {language === 'or' ? r.formattedDurationOr : language === 'hi' ? r.formattedDurationHi : r.formattedDurationEn}
                      </span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">
                        {language === 'or' ? r.viaRoadOr : language === 'hi' ? r.viaRoadHi : r.viaRoadEn}
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                /* Walking Route Pill */
                availableRoutes.filter(r => r.id === 'walking').map((r) => (
                  <div
                    key={r.id}
                    className="col-span-2 p-3 rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-950/60 to-cosmic-900 text-left space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Footprints className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-xs">
                          {language === 'or' ? r.titleOr : language === 'hi' ? r.titleHi : r.titleEn}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white font-mono">{r.distanceKm} KM</span>
                    </div>

                    <div className="flex items-center justify-between border-y border-emerald-500/20 py-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {language === 'or' ? 'ପଦଯାତ୍ରା ପ୍ରକୃତ ସମୟ' : language === 'hi' ? 'पदयात्रा वास्तविक समय' : 'Walking Duration'}
                        </span>
                        <span className="text-lg font-black text-emerald-300">
                          {language === 'or' ? r.formattedDurationOr : language === 'hi' ? r.formattedDurationHi : r.formattedDurationEn}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {language === 'or' ? 'କ୍ୟାଲୋରୀ ଶକ୍ତି ବ୍ୟୟ' : language === 'hi' ? 'कैलोरी ऊर्जा व्यय' : 'Calories Burned'}
                        </span>
                        <span className="text-sm font-bold text-orange-400 font-mono">
                          🔥 ~{r.walkingStats?.caloriesKcal} kcal
                        </span>
                      </div>
                    </div>

                    {r.walkingStats && (
                      <p className="text-[10px] text-emerald-200/90 leading-snug">
                        {language === 'or'
                          ? r.walkingStats.adviceOr
                          : language === 'hi'
                          ? (r.walkingStats.adviceHi || r.walkingStats.adviceEn)
                          : r.walkingStats.adviceEn}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Real Live Weather & Elevation Telemetry Badge */}
        {weatherTelemetry && !isCalculating && (
          <div className="bg-gradient-to-r from-sky-950/50 to-indigo-950/50 border border-sky-500/40 p-2 rounded-2xl flex items-center justify-between text-[11px] text-white">
            <div className="flex items-center gap-2">
              <span className="text-base">{weatherTelemetry.icon}</span>
              <div>
                <span className="font-bold block text-sky-200 text-xs">
                  {weatherTelemetry.temperatureC}°C • {language === 'or' ? weatherTelemetry.conditionOr : language === 'hi' ? (weatherTelemetry.conditionHi || weatherTelemetry.conditionEn) : weatherTelemetry.conditionEn}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {language === 'or'
                    ? `ପବନ: ${weatherTelemetry.windSpeedKmh} km/h • ଆର୍ଦ୍ରତା: ${weatherTelemetry.humidityPercent}%`
                    : language === 'hi'
                    ? `हवा: ${weatherTelemetry.windSpeedKmh} km/h • नमी: ${weatherTelemetry.humidityPercent}%`
                    : `Wind: ${weatherTelemetry.windSpeedKmh} km/h • Humidity: ${weatherTelemetry.humidityPercent}%`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block font-mono">
                {language === 'or' ? 'ଉଚ୍ଚତା (Elevation)' : language === 'hi' ? 'ऊंचाई (Elevation)' : 'Elevation'}
              </span>
              <span className="font-bold text-cosmic-gold font-mono text-xs">
                {weatherTelemetry.elevationM > 0 ? `+${weatherTelemetry.elevationM}m` : `${weatherTelemetry.elevationM}m`}
              </span>
            </div>
          </div>
        )}

        {/* Vedic Astrology: Compass Direction & Disha Shula Card */}
        {calculatedRoute && !isCalculating && (
          <div className="bg-cosmic-900/80 border border-slate-800 p-2.5 rounded-2xl space-y-1 text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
              <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                <Compass className="w-3 h-3 text-sky-400" />
                <span>
                  {language === 'or' ? 'ଯାତ୍ରା ଦିଗ:' : language === 'hi' ? 'यात्रा दिशा:' : 'Direction:'}
                </span>
              </span>
              <span className="font-bold text-sky-300">
                {language === 'or'
                  ? calculatedRoute.compassDirectionOr
                  : language === 'hi'
                  ? (calculatedRoute.compassDirectionHi || calculatedRoute.compassDirectionEn)
                  : calculatedRoute.compassDirectionEn}{' '}
                ({calculatedRoute.bearingDegrees}°)
              </span>
            </div>
            <p className="text-slate-300 font-medium text-[10px] leading-snug">
              {language === 'or'
                ? calculatedRoute.dishaShulaStatus.adviceOr
                : language === 'hi'
                ? (calculatedRoute.dishaShulaStatus.adviceHi || calculatedRoute.dishaShulaStatus.adviceEn)
                : calculatedRoute.dishaShulaStatus.adviceEn}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* GOOGLE MAPS-STYLE ALWAYS-VISIBLE PROMINENT STICKY BOTTOM ACTION CONTROLS */}
      {/* ========================================================================= */}
      {calculatedRoute && !isCalculating && (
        <div className="pt-2 border-t border-slate-800 flex-shrink-0 space-y-2">
          {onStartLiveNavigation && (
            <div className="grid grid-cols-2 gap-2">
              {/* PRIMARY PROMINENT START BUTTON */}
              <button
                type="button"
                onClick={() => onStartLiveNavigation(calculatedRoute, false)}
                className="col-span-2 py-3 px-4 rounded-2xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-950/60 border-2 border-white hover:scale-[1.02] active:scale-95 transition-all cursor-pointer tracking-wider animate-pulse"
              >
                <Navigation className="w-5 h-5 text-slate-950 fill-slate-950" />
                <span>
                  {language === 'or'
                    ? '🚀 ଷ୍ଟାର୍ଟ ନେଭିଗେସନ୍ (START)'
                    : language === 'hi'
                    ? '🚀 नेविगेशन शुरू करें (START)'
                    : 'START LIVE NAVIGATION'}
                </span>
              </button>

              {/* SIMULATE TEST DRIVE */}
              <button
                type="button"
                onClick={() => onStartLiveNavigation(calculatedRoute, true)}
                className="py-2 px-2.5 rounded-xl font-bold bg-cosmic-900 hover:bg-cosmic-800 text-amber-300 border border-amber-500/50 flex items-center justify-center gap-1 text-[11px] shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                title="Simulate trip along the chosen route"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>
                  {language === 'or' ? '🎮 ଡ୍ରାଇଭ୍ ଡେମୋ' : language === 'hi' ? '🎮 ड्राइव डेमो' : 'Simulate'}
                </span>
              </button>

              {/* EXTERNAL GOOGLE MAPS LINK */}
              <a
                href={calculatedRoute.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1 text-[11px] border border-slate-700 transition-all cursor-pointer text-center"
              >
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Google Maps App</span>
              </a>
            </div>
          )}

          <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 font-mono">
            <span>
              {language === 'or'
                ? '✓ ୧୦୦% Google Maps ନେଭିଗେସନ୍'
                : language === 'hi'
                ? '✓ १००% Google Maps नेविगेशन'
                : '✓ 100% Google Maps Navigation'}
            </span>
            <span>
              {travelMode === 'driving'
                ? `${calculatedRoute.distanceKm} km • ${language === 'or' ? calculatedRoute.formattedDurationOr : language === 'hi' ? calculatedRoute.formattedDurationHi : calculatedRoute.formattedDurationEn}`
                : `${calculatedRoute.distanceKm} km ${language === 'or' ? 'ପଦଯାତ୍ରା' : language === 'hi' ? 'पदयात्रा' : 'Walking'}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
