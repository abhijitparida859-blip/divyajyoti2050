import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type * as LeafletNS from 'leaflet';
import { useI18n } from '../../localization/i18n';
import {
  Globe2,
  Compass,
  MapPin,
  Layers,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  ExternalLink,
  Flame,
  Satellite,
  Mountain,
  Navigation,
  CheckCircle2,
  Tag,
  Loader2,
  X,
  Crosshair,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  loadRealPlanetTexture,
  loadEarthCloudsTexture,
  loadEarthSpecularTexture,
  createSaturnRingTexture
} from './planetTextures';
import { EarthAtmosphereExplorer } from './EarthAtmosphereExplorer';
import { EarthInteriorExplorer } from './EarthInteriorExplorer';
import { SafeErrorBoundary } from '../common/SafeErrorBoundary';
import { PilgrimageRouteNavigator, RouteResult, RoutePoint } from './PilgrimageRouteNavigator';
import { LiveNavigationCockpit } from './LiveNavigationCockpit';
import {
  searchGlobalLocations,
  reverseGeocodeCoord,
  fetchLocationTelemetry,
  GeoSearchResult
} from '../../services/globalGeoService';

export interface LandmarkPoint {
  id: string;
  body?: 'Earth' | 'Moon' | 'Mars' | 'Jupiter' | 'Saturn' | 'Sun';
  nameOr: string;
  nameEn: string;
  lat: number;
  lon: number;
  zoom: number;
  elevationM: number;
  category: 'vedic' | 'geographic' | 'scientific';
  descriptionOr: string;
  descriptionEn: string;
  facts: string[];
}

export interface GeoLODLabel {
  id: string;
  body: 'Earth' | 'Moon' | 'Mars' | 'Jupiter' | 'Saturn' | 'Sun';
  nameOr: string;
  nameEn: string;
  lat: number;
  lon: number;
  tier: 1 | 2 | 3; // 1: Global / Macro, 2: Regional / Meso, 3: Micro / Local
  type: 'continent' | 'ocean' | 'region' | 'city' | 'temple' | 'mountain' | 'crater' | 'canyon' | 'mission';
  badge?: string;
}

export const REAL_LANDMARKS: LandmarkPoint[] = [
  {
    id: 'puri',
    nameOr: 'ପୁରୀ ଶ୍ରୀଜଗନ୍ନାଥ ମନ୍ଦିର (Puri Jagannath Temple)',
    nameEn: 'Shree Jagannath Temple, Puri, Odisha',
    lat: 19.8049,
    lon: 85.8179,
    zoom: 18,
    elevationM: 9,
    category: 'vedic',
    descriptionOr: 'ମହାପ୍ରଭୁ ଶ୍ରୀଜଗନ୍ନାଥଙ୍କ ପବିତ୍ର ଶ୍ରୀକ୍ଷେତ୍ର ଧାମ। ନୀଳଚକ୍ର, ସିଂହଦ୍ୱାର, ବଡ଼ଦାଣ୍ଡ ଏବଂ ବଙ୍ଗୋପସାଗର ଉପକୂଳର ପ୍ରତ୍ୟକ୍ଷ ସାଟେଲାଇଟ୍ ଫଟୋଚିତ୍ର।',
    descriptionEn: 'Sacred abode of Lord Jagannath on the Bay of Bengal coastline, featuring the ancient Neelachakra and Bada Danda.',
    facts: ['Latitude: 19.8049° N', 'Longitude: 85.8179° E', 'Elevation: 9 m', 'Direct Google Satellite HD Aerial Photography']
  },
  {
    id: 'konark',
    nameOr: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର (Konark Sun Temple)',
    nameEn: 'Konark Sun Temple (Black Pagoda), Odisha',
    lat: 19.8876,
    lon: 86.0945,
    zoom: 18,
    elevationM: 12,
    category: 'vedic',
    descriptionOr: '୧୩ଶ ଶତାବ୍ଦୀର ୟୁନେସ୍କୋ (UNESCO) ବିଶ୍ୱ ଐତିହ୍ୟ ସୂର୍ଯ୍ୟ ରଥ ମନ୍ଦିର। ଏହାର ୨୪ଟି ପଥର ଚକ ପ୍ରକୃତ ସୂର୍ଯ୍ୟ ଘଣ୍ଟା (Sundial) ଭାବେ ସଠିକ୍ ସମୟ ଗଣନା କରେ।',
    descriptionEn: '13th-century UNESCO World Heritage Sun Chariot temple designed as an astronomical sundial with 24 carved stone wheels.',
    facts: ['Latitude: 19.8876° N', 'Longitude: 86.0945° E', 'UNESCO World Heritage Site', 'Ancient Solar Astronomical Sundial']
  },
  {
    id: 'ujjain',
    nameOr: 'ଉଜ୍ଜୟିନୀ ମହାକାଳେଶ୍ୱର ଓ ଶୂନ୍ୟ ଦ୍ରାଘିମା (Ujjain Ancient Prime Meridian)',
    nameEn: 'Ujjain Mahakaleshwar (Ancient Vedic Prime Meridian)',
    lat: 23.1828,
    lon: 75.7682,
    zoom: 17,
    elevationM: 494,
    category: 'vedic',
    descriptionOr: 'ପ୍ରାଚୀନ ଭାରତୀୟ ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ (ସୂର୍ଯ୍ୟ ସିଦ୍ଧାନ୍ତ) ର ମୁଖ୍ୟ ପ୍ରାଇମ୍ ମେରିଡିଆନ୍ (0° Longitude) ଏବଂ କର୍କଟ କ୍ରାନ୍ତି (Tropic of Cancer) ର ସଂଯୋଗସ୍ଥଳ।',
    descriptionEn: 'The Greenwich of Ancient India: intersection of ancient Zero Meridian and Tropic of Cancer, documented in Surya Siddhanta.',
    facts: ['Prime Meridian of Ancient India', 'Tropic of Cancer Intersection', 'Shipra River Ghats', 'Vedh Shala Observatory']
  },
  {
    id: 'everest',
    nameOr: 'ମାଉଣ୍ଟ ଏଭରେଷ୍ଟ ଶୃଙ୍ଗ (Mount Everest / ସାଗରମଥା)',
    nameEn: 'Mount Everest Peak (8,848.86 m), Himalayas',
    lat: 27.9881,
    lon: 86.9250,
    zoom: 14,
    elevationM: 8848.86,
    category: 'geographic',
    descriptionOr: 'ପୃଥିବୀର ସର୍ବୋଚ୍ଚ ପ୍ରାକୃତିକ ଶିଖର (୮,୮୪୮.୮୬ ମି.)। ହିମାଳୟ ହିମବାହ ଓ ଖୁମ୍ବୁ ଗ୍ଲେସିୟରର ପ୍ରତ୍ୟକ୍ଷ ସାଟେଲାଇଟ୍ ଭିଜୁଆଲ୍।',
    descriptionEn: 'The highest summit on Earth at 8,848.86 m on the crest of the Great Himalayas, showing the Khumbu glacier system.',
    facts: ['Summit Elevation: 8,848.86 m', 'Atmospheric Pressure: ~33 kPa', 'Border: Nepal & Tibet', 'Cryospheric Glacial Topology']
  },
  {
    id: 'delhi',
    nameOr: 'ନୂଆଦିଲ୍ଲୀ ଜନ୍ତର ମନ୍ତର (New Delhi Jantar Mantar)',
    nameEn: 'Jantar Mantar Astronomical Observatory, New Delhi',
    lat: 28.6271,
    lon: 77.2166,
    zoom: 18,
    elevationM: 216,
    category: 'scientific',
    descriptionOr: 'ମହାରାଜା ସୱାଇ ଜୟ ସିଂହ ଦ୍ୱିତୀୟଙ୍କ ଦ୍ୱାରା ୧୭୨୪ ଖ୍ରୀଷ୍ଟାବ୍ଦରେ ନିର୍ମିତ ବିଶାଳ ପଥର ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ ଗବେଷଣାଗାର (ବୃହତ୍ ସମ୍ରାଟ ଯନ୍ତ୍ର ସୂର୍ଯ୍ୟ ଘଣ୍ଟା)।',
    descriptionEn: 'Historic stone astronomical observatory built in 1724, featuring the world-renowned Samrat Yantra sundial.',
    facts: ['Samrat Yantra Precision: 2 seconds', 'Latitude: 28.6271° N', 'Longitude: 77.2166° E', 'National Scientific Monument']
  },
  {
    id: 'greenwich',
    nameOr: 'ଗ୍ରୀନୱିଚ୍ ରୟାଲ୍ ଅବଜରଭେଟୋରୀ (Royal Observatory Greenwich)',
    nameEn: 'Royal Observatory Greenwich (0° 00\' 00" Meridian), London',
    lat: 51.4769,
    lon: 0.0000,
    zoom: 18,
    elevationM: 46,
    category: 'scientific',
    descriptionOr: '୧୮୮୪ ୱାଶିଂଟନ୍ ସମ୍ମିଳନୀରେ ସ୍ଥିରୀକୃତ ଆଧୁନିକ ଆନ୍ତର୍ଜାତୀୟ ପ୍ରାଇମ୍ ମେରିଡିଆନ୍ (0° 00\' 00") ଏବଂ Greenwich Mean Time (UTC/GMT) ର କେନ୍ଦ୍ର।',
    descriptionEn: 'The internationally designated Zero Meridian of the world, defining Universal Coordinated Time (UTC).',
    facts: ['Prime Meridian: 0° 00\' 00"', 'UTC Reference Standard', 'Airy Transit Circle', 'London, United Kingdom']
  },
  {
    id: 'sriharikota',
    nameOr: 'ଇସ୍ରୋ ସତୀଶ ଧୱନ ମହାକାଶ କେନ୍ଦ୍ର (ISRO Sriharikota)',
    nameEn: 'ISRO Satish Dhawan Space Centre (SDSC SHAR), Sriharikota',
    lat: 13.7199,
    lon: 80.2305,
    zoom: 15,
    elevationM: 4,
    category: 'scientific',
    descriptionOr: 'ଭାରତୀୟ ମହାକାଶ ଗବେଷଣା ସଂସ୍ଥା (ISRO) ର ମୁଖ୍ୟ ରକେଟ୍ ଉତକ୍ଷେପଣ କେନ୍ଦ୍ର, ଯେଉଁଠାରୁ ଚନ୍ଦ୍ରଯାନ-୩ ଏବଂ ଆଦିତ୍ୟ-L1 ମହାକାଶକୁ ଉତକ୍ଷେପିତ ହୋଇଥିଲା।',
    descriptionEn: 'Primary spaceport of the Indian Space Research Organisation (ISRO), launch site of Chandrayaan-3 and Aditya-L1.',
    facts: ['PSLV, GSLV, LVM3 Launchpads', 'Pulicat Lake Island', 'Latitude: 13.7199° N', 'East-Coast Orbital Trajectory']
  },
  {
    id: 'nasa_ksc',
    nameOr: 'ନାସା କେନେଡି ସ୍ପେସ୍ ସେଣ୍ଟର (NASA Kennedy Space Center LC-39A)',
    nameEn: 'NASA Kennedy Space Center (Launch Complex 39A), Florida',
    lat: 28.6083,
    lon: -80.6041,
    zoom: 16,
    elevationM: 3,
    category: 'scientific',
    descriptionOr: 'ଐତିହାସିକ ଆପୋଲୋ ୧୧ (ଚନ୍ଦ୍ର ଅଭିଯାନ) ଏବଂ ସ୍ପେସ୍ ସଟଲ୍‌ର ପ୍ରସିଦ୍ଧ ଲଞ୍ଚପ୍ୟାଡ୍ ୩୯A। ଆମେରିକାର ପ୍ରମୁଖ ମାନବ ମହାକାଶ କେନ୍ଦ୍ର।',
    descriptionEn: 'Historic Launch Complex 39A at NASA Kennedy Space Center, launch site of Apollo 11 moon landing and Space Shuttle missions.',
    facts: ['Launch Complex 39A', 'Cape Canaveral, Florida', 'Apollo 11 & Artemis Launchpad', 'Latitude: 28.6083° N']
  },
  {
    id: 'mariana',
    nameOr: 'ମାରିଆନା ଟ୍ରେଞ୍ଚ (Mariana Trench - Challenger Deep)',
    nameEn: 'Mariana Trench (Challenger Deep, -10,994 m)',
    lat: 11.3493,
    lon: 142.1996,
    zoom: 7,
    elevationM: -10994,
    category: 'geographic',
    descriptionOr: 'ପୃଥିବୀ ମହାସାଗରର ସର୍ବନିମ୍ନ ଗଭୀର ସ୍ଥାନ (୧୦,୯୯୪ ମିଟର ଗଭୀର)। ଏଠାରେ ସମୁଦ୍ର ଚାପ ସମୁଦ୍ର ପତ୍ତନ ଠାରୁ ୧,୦୦୦ ଗୁଣରୁ ଅଧିକ!',
    descriptionEn: 'The deepest known oceanic trench on Earth at approximately -10,994 m in the western Pacific Ocean.',
    facts: ['Depth: -10,994 m (36,070 ft)', 'Hydrostatic Pressure: >1,086 bar', 'Pacific Subduction Zone', 'Absolute Abyss Bathymetry']
  },
  // Moon Features
  {
    id: 'shiv_shakti',
    body: 'Moon',
    nameOr: 'ଶିବ ଶକ୍ତି ପଏଣ୍ଟ (Chandrayaan-3 Shiv Shakti Point)',
    nameEn: 'Chandrayaan-3 Shiv Shakti Point (Moon South Pole)',
    lat: -69.373,
    lon: 32.319,
    zoom: 16,
    elevationM: -1800,
    category: 'scientific',
    descriptionOr: '୨୩ ଅଗଷ୍ଟ ୨୦୨୩ରେ ଭାରତର ଇସ୍ରୋ (ISRO) ଦ୍ୱାରା ଐତିହାସିକ ସଫ୍ଟ ଲ୍ୟାଣ୍ଡିଂ ସ୍ଥଳ। ଭାରତ ବିଶ୍ୱର ପ୍ରଥମ ରାଷ୍ଟ୍ର ଭାବେ ଚନ୍ଦ୍ରର ଦକ୍ଷିଣ ମେରୁ ନିକଟରେ ସଫଳ ଅବତରଣ କରିଥିଲା।',
    descriptionEn: 'Historic touchdown site of ISRO Chandrayaan-3 Vikram Lander on 23 August 2023, making India the first nation to soft-land near the lunar south pole.',
    facts: ['Latitude: 69.373° S', 'Longitude: 32.319° E', 'ISRO Vikram & Pragyan', 'National Space Day (Aug 23)']
  },
  {
    id: 'apollo11',
    body: 'Moon',
    nameOr: 'ଆପୋଲୋ ୧୧ ଟ୍ରାଙ୍କୁଇଲିଟି ବେସ୍ (Apollo 11 Tranquility Base)',
    nameEn: 'Apollo 11 Tranquility Base (Mare Tranquillitatis)',
    lat: 0.674,
    lon: 23.473,
    zoom: 16,
    elevationM: -1200,
    category: 'scientific',
    descriptionOr: '୨୦ ଜୁଲାଇ ୧୯୬୯ରେ ନୀଲ ଆର୍ମଷ୍ଟ୍ରଙ୍ଗ୍ ଏବଂ ବଜ୍ ଆଲଡ୍ରିନ୍ ପ୍ରଥମ ମଣିଷ ଭାବେ ଚନ୍ଦ୍ର ପୃଷ୍ଠରେ ପାଦ ଦେଇଥିବା ଐତିହାସିକ ସ୍ଥାନ ("That\'s one small step for man...").',
    descriptionEn: 'The site where humans first set foot on another celestial body on July 20, 1969 during NASA Apollo 11 mission.',
    facts: ['Mare Tranquillitatis', 'Coordinates: 0.674° N, 23.473° E', 'Neil Armstrong & Buzz Aldrin', 'First Human Moon Landing']
  },
  {
    id: 'tycho',
    body: 'Moon',
    nameOr: 'ଟାଇକୋ କ୍ରେଟର୍ (Tycho Impact Crater)',
    nameEn: 'Tycho Impact Crater (85 km Rim & Central Peak)',
    lat: -43.31,
    lon: -11.36,
    zoom: 14,
    elevationM: -4800,
    category: 'scientific',
    descriptionOr: 'ଚନ୍ଦ୍ରର ସବୁଠାରୁ ଉଜ୍ଜ୍ୱଳ ଏବଂ ସ୍ପଷ୍ଟ ପ୍ରଭାବ କ୍ରେଟର୍ (Impact Crater)। ଏହାର ବିଶାଳ ଧଳା ରଶ୍ମି (Ejecta Rays) ହଜାର ହଜାର କି.ମି. ପର୍ଯ୍ୟନ୍ତ ବିସ୍ତାରିତ।',
    descriptionEn: 'Prominent 108-million-year-old lunar impact crater (85 km wide, 4.8 km deep) famous for its immense system of bright ray streaks across the moon.',
    facts: ['Diameter: 85 km (53 miles)', 'Depth: 4.8 km', 'Age: ~108 Million Years', 'Central Peak: 1.6 km High']
  },
  // Mars Features
  {
    id: 'olympus_mons',
    body: 'Mars',
    nameOr: 'ଅଲିମ୍ପସ ମନ୍ସ ଆଗ୍ନେୟଗିରି (Olympus Mons Shield Volcano)',
    nameEn: 'Olympus Mons (Tallest Volcano in the Solar System)',
    lat: 18.65,
    lon: 226.2,
    zoom: 14,
    elevationM: 21900,
    category: 'scientific',
    descriptionOr: 'ସମଗ୍ର ସୌରମଣ୍ଡଳର ସର୍ବୋଚ୍ଚ ପର୍ବତ ଓ ବିଶାଳ ସିଲ୍ଡ ଆଗ୍ନେୟଗିରି (୨୧.୯ କି.ମି. ଉଚ୍ଚତା, ଯାହା ମାଉଣ୍ଟ ଏଭରେଷ୍ଟ ଠାରୁ ପ୍ରାୟ ୨.୫ ଗୁଣ ଉଚ୍ଚ!) ଏବଂ ଏହାର ଆକାର ୬୦୦ କି.ମି. ଚଉଡ଼ା।',
    descriptionEn: 'The tallest planetary mountain and shield volcano in the entire solar system at 21.9 km elevation, roughly 2.5 times Mount Everest height.',
    facts: ['Peak Height: 21.9 km (72,000 ft)', 'Basal Diameter: ~600 km', 'Caldera Depth: 3 km', 'Atmospheric Top: Exceeds Scale Height']
  },
  {
    id: 'valles_marineris',
    body: 'Mars',
    nameOr: 'ଭାଲେସ୍ ମାରିନେରିସ୍ ମହାଖାତ (Valles Marineris Grand Canyon)',
    nameEn: 'Valles Marineris (Grand Canyon of Mars - 4,000 km)',
    lat: -14.0,
    lon: 301.0,
    zoom: 12,
    elevationM: -7000,
    category: 'scientific',
    descriptionOr: 'ସୌରମଣ୍ଡଳର ବୃହତ୍ତମ କ୍ୟାନିଅନ୍ ବା ଭୂତଳ ମହାଫାଟ। ଏହାର ଲମ୍ବ ୪,୦୦୦ କି.ମି. (ଭାରତର କାଶ୍ମୀରରୁ କନ୍ୟାକୁମାରୀ ଠାରୁ ଅଧିକ!) ଏବଂ ଗଭୀରତା ୭ କି.ମି.।',
    descriptionEn: 'Vast canyon system stretching 4,000 km along the Martian equator, up to 200 km wide and 7 km deep (over 4 times deeper than Earth Grand Canyon).',
    facts: ['Length: >4,000 km', 'Depth: Up to 7 km (23,000 ft)', 'Width: Up to 200 km', 'Tectonic Rift Faulting']
  },
  {
    id: 'jezero',
    body: 'Mars',
    nameOr: 'ଜେଜେରୋ କ୍ରେଟର୍ (Jezero Crater - Perseverance Rover)',
    nameEn: 'Jezero Crater (NASA Perseverance Ancient Lake Delta)',
    lat: 18.38,
    lon: 77.58,
    zoom: 16,
    elevationM: -2500,
    category: 'scientific',
    descriptionOr: 'ପ୍ରାଚୀନ ମଙ୍ଗଳ ଗ୍ରହରେ ପ୍ରବାହିତ ନଦୀ ଡେଲ୍ଟା ଏବଂ ହ୍ରଦ। ନାସା (NASA) ର ପର୍ସିଭେରାନ୍ସ ରୋଭର୍ ଓ ଇଞ୍ଜେନ୍ୟୁଟି ହେଲିକପ୍ଟର ଏଠାରେ ପ୍ରାଚୀନ ଜୀବନର ସନ୍ଧାନ କରୁଛନ୍ତି।',
    descriptionEn: 'Ancient Martian paleolake and river delta explored by NASA Perseverance rover and Ingenuity helicopter for biosignatures of past microbial life.',
    facts: ['NASA Perseverance Rover Site', 'Ancient River Delta Fan', 'Diameter: 49 km', 'Clay & Carbonate Sediments']
  },
  // Jupiter Features
  {
    id: 'great_red_spot',
    body: 'Jupiter',
    nameOr: 'ମହା ରକ୍ତ ଚିହ୍ନ / ଗ୍ରେଟ୍ ରେଡ୍ ସ୍ପଟ୍ (Great Red Spot Anticyclone)',
    nameEn: 'Great Red Spot (16,000 km High-Pressure Storm)',
    lat: -22.0,
    lon: 165.0,
    zoom: 12,
    elevationM: 8000,
    category: 'scientific',
    descriptionOr: 'ବୃହସ୍ପତି ଗ୍ରହରେ ଅତି କମରେ ୩୫୦ ବର୍ଷ ଧରି ନିରନ୍ତର ଘୂର୍ଣ୍ଣିତ ହେଉଥିବା ବିଶାଳ ଆଣ୍ଟି-ସାଇକ୍ଲୋନିକ୍ ଝଡ଼। ଏହା ଏତେ ବଡ଼ ଯେ ଏହାର ଭିତରେ ସମଗ୍ର ପୃଥିବୀ ସହଜରେ ସମାହିତ ହୋଇପାରିବ!',
    descriptionEn: 'Persistent high-pressure anticyclonic tempest wider than Earth (16,320 km) with peripheral wind speeds exceeding 432 km/h (268 mph).',
    facts: ['Storm Width: ~16,320 km (>1 Earth)', 'Wind Speed: >432 km/h', 'Observed Continuously Since: 1831', 'Anticyclonic Counter-Clockwise']
  },
  // Additional Odisha Micro-Landmarks
  {
    id: 'bhubaneswar_lingaraj',
    body: 'Earth',
    nameOr: 'ଭୁବନେଶ୍ୱର ଶ୍ରୀଲିଙ୍ଗରାଜ ମନ୍ଦିର (Ekamra Kshetra Lingaraj)',
    nameEn: 'Shree Lingaraj Temple, Bhubaneswar (Ekamra Kshetra)',
    lat: 20.2382,
    lon: 85.8336,
    zoom: 18,
    elevationM: 45,
    category: 'vedic',
    descriptionOr: '୧୧ଶ ଶତାବ୍ଦୀର ଭବ୍ୟ କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ କୀର୍ତ୍ତି। ଏକାମ୍ର କ୍ଷେତ୍ର ଭୁବନେଶ୍ୱରର ପ୍ରମୁଖ ହରି-ହର ଶିବ ଧାମ ଏବଂ ବିନ୍ଦୁସାଗର ତୀର୍ଥ।',
    descriptionEn: '11th-century masterpiece of Kalinga architecture in the Temple City Bhubaneswar, dedicated to Lord Harihara (Shiva-Vishnu).',
    facts: ['Temple Height: 55 m (180 ft)', 'Bindusagar Holy Lake', 'Latitude: 20.2382° N', 'Ekamra Kshetra Heritage Zone']
  },
  {
    id: 'cuttack_barabati',
    body: 'Earth',
    nameOr: 'କଟକ ବାରବାଟୀ ଦୁର୍ଗ ଓ ମହାନଦୀ (Barabati Fort & Mahanadi)',
    nameEn: 'Barabati Fort & Mahanadi River Barrage, Cuttack',
    lat: 20.4855,
    lon: 85.8677,
    zoom: 17,
    elevationM: 36,
    category: 'geographic',
    descriptionOr: '୧୦୦୦ ବର୍ଷ ପୁରାତନ ଐତିହାସିକ ରୂପା ନଗରୀ କଟକ। ମହାନଦୀ ଓ କାଠଯୋଡ଼ି ନଦୀର ସଙ୍ଗମସ୍ଥଳ ଏବଂ ଐତିହାସିକ ବାରବାଟୀ ଦୁର୍ଗ।',
    descriptionEn: 'Millennium city Cuttack located at the confluence of Mahanadi and Kathajodi rivers, featuring the historic 13th-century Barabati Fort.',
    facts: ['Mahanadi River Basin', 'Latitude: 20.4855° N', 'Ganga Dynasty Heritage', 'Silver City Cuttack']
  },
  {
    id: 'chilika_lake',
    body: 'Earth',
    nameOr: 'ଚିଲିକା ହ୍ରଦ (Chilika Lake - Asia Largest Brackish Lagoon)',
    nameEn: 'Chilika Lake (Asia Largest Brackish Water Lagoon)',
    lat: 19.6700,
    lon: 85.3400,
    zoom: 12,
    elevationM: 0,
    category: 'geographic',
    descriptionOr: 'ଏସିଆର ବୃହତ୍ତମ ଏବଂ ବିଶ୍ୱର ଦ୍ୱିତୀୟ ବୃହତ୍ତମ ଉପକୂଳ ଲବଣାକ୍ତ ହ୍ରଦ (୧,୧୦୦ ବର୍ଗ କି.ମି.)। ଇରାୱାଡି ଡଲ୍‌ଫିନ୍, କାଳୀଜାଈ ମନ୍ଦିର ଏବଂ ନଳବଣ ପକ୍ଷୀ ଅଭୟାରଣ୍ୟ।',
    descriptionEn: 'Asia largest brackish water lagoon spreading across 1,100 km2, home to rare Irrawaddy dolphins and migratory birds.',
    facts: ['Area: 1,100 km²', 'Ramsar Wetland Site No. 229', 'Irrawaddy Dolphin Habitat', 'Kalijai Island Temple']
  },
  {
    id: 'deomali_koraput',
    body: 'Earth',
    nameOr: 'ଦେଓମାଳୀ ପର୍ବତ ଶୃଙ୍ଗ (Deomali Peak - 1,672 m)',
    nameEn: 'Deomali Peak, Koraput (Highest Peak in Odisha, 1,672 m)',
    lat: 18.6750,
    lon: 82.9810,
    zoom: 14,
    elevationM: 1672,
    category: 'geographic',
    descriptionOr: 'ଓଡ଼ିଶାର ସର୍ବୋଚ୍ଚ ପର୍ବତ ଶିଖର (୧,୬୭୨ ମିଟର / ୫,୪୮୬ ଫୁଟ)। ପୂର୍ବଘାଟ ପର୍ବତମାଳାର ସବୁଜ ପାହାଡ଼ିଆ ଅଞ୍ଚଳ ଓ କୋରାପୁଟର ପ୍ରାକୃତିକ ସୌନ୍ଦର୍ଯ୍ୟ।',
    descriptionEn: 'The highest mountain peak in Odisha situated in the Pottangi block of Koraput district in the Eastern Ghats at 1,672 m.',
    facts: ['Elevation: 1,672 m (5,486 ft)', 'Eastern Ghats Range', 'Koraput District', 'Sub-Tropical Hill Ecosystem']
  },
  {
    id: 'hirakud_dam',
    body: 'Earth',
    nameOr: 'ହୀରାକୁଦ ବନ୍ଧ (Hirakud Dam - World Longest Earthen Dam)',
    nameEn: 'Hirakud Dam & Reservoir, Sambalpur (Mahanadi River)',
    lat: 21.5700,
    lon: 83.8700,
    zoom: 14,
    elevationM: 192,
    category: 'scientific',
    descriptionOr: 'ମହାନଦୀ ଉପରେ ନିର୍ମିତ ବିଶ୍ୱର ସର୍ବବୃହତ୍ ମାଟି ବନ୍ଧ (ଲମ୍ବ ୨୫.୮ କି.ମି.)। ଏହାର ବିଶାଳ ଜଳଭଣ୍ଡାର (୭୪୩ ବର୍ଗ କି.ମି.) ଓ ଗାନ୍ଧୀ ମିନାର୍ ପ୍ରତ୍ୟକ୍ଷ ସାଟେଲାଇଟ୍‌ରେ ସ୍ପଷ୍ଟ।',
    descriptionEn: 'The longest earthen dam in the world stretching 25.8 km across the Mahanadi River, forming a massive 743 km2 inland reservoir.',
    facts: ['Length: 25.8 km (16 miles)', 'Reservoir Area: 743 km²', 'Built: 1957', 'Mahanadi Hydroelectric Grid']
  },
  {
    id: 'varanasi_kashi',
    body: 'Earth',
    nameOr: 'କାଶୀ ବିଶ୍ୱନାଥ ଓ ବାରାଣସୀ (Kashi Vishwanath, Varanasi)',
    nameEn: 'Kashi Vishwanath & Ganga Ghats, Varanasi',
    lat: 25.3109,
    lon: 83.0107,
    zoom: 17,
    elevationM: 80,
    category: 'vedic',
    descriptionOr: 'ବିଶ୍ୱର ପ୍ରାଚୀନତମ ନିରନ୍ତର ବସବାସ କରୁଥିବା ଆଧ୍ୟାତ୍ମିକ ନଗରୀ କାଶୀ। ପବିତ୍ର ଗଙ୍ଗା ନଦୀର ଅର୍ଦ୍ଧଚନ୍ଦ୍ରାକାର ଘାଟ ଏବଂ ଜ୍ୟୋତିର୍ଲିଙ୍ଗ।',
    descriptionEn: 'One of the world oldest continuously inhabited cities on the banks of the sacred river Ganges, featuring historic ghats and the Kashi Vishwanath temple.',
    facts: ['Crescent Ganges River Arc', 'Latitude: 25.3109° N', 'Ancient Spiritual Capital', 'Vedic Tirthakshetra']
  },
  {
    id: 'dhauli_shanti_stupa',
    body: 'Earth',
    nameOr: 'ଧଉଳି ଶାନ୍ତି ସ୍ତୂପ (Dhauli Shanti Stupa, Daya River)',
    nameEn: 'Dhauli Peace Pagoda & Rock Edicts of Ashoka, Bhubaneswar',
    lat: 20.1923,
    lon: 85.8394,
    zoom: 17,
    elevationM: 40,
    category: 'geographic',
    descriptionOr: 'ଐତିହାସିକ କଳିଙ୍ଗ ଯୁଦ୍ଧ (୨୬୧ ଖ୍ରୀଷ୍ଟପୂର୍ବ) ସ୍ଥଳୀ ଦୟା ନଦୀ କୂଳରେ ଅବସ୍ଥିତ। ଚଣ୍ଡାଶୋକରୁ ଧର୍ମାଶୋକରେ ରୂପାନ୍ତରିତ ହୋଇଥିବା ସ୍ଥଳ ଏବଂ ସମ୍ରାଟ ଅଶୋକଙ୍କ ଶିଳାଲିପି।',
    descriptionEn: 'Historic site of the Kalinga War (261 BCE) on the banks of Daya River, where Emperor Ashoka renounced violence and embraced Buddhism.',
    facts: ['Kalinga War (261 BCE)', 'Ashokan Rock Edict VI', 'Daya River Basin', 'White Peace Pagoda']
  },
  {
    id: 'samaleswari_temple',
    body: 'Earth',
    nameOr: 'ସମ୍ବଲପୁର ମା’ ସମଲେଶ୍ୱରୀ ମନ୍ଦିର (Maa Samaleswari Temple)',
    nameEn: 'Shree Maa Samaleswari Temple, Sambalpur',
    lat: 21.4673,
    lon: 83.9634,
    zoom: 18,
    elevationM: 147,
    category: 'vedic',
    descriptionOr: 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ଅଧିଷ୍ଠାତ୍ରୀ ଦେବୀ ମା’ ସମଲେଶ୍ୱରୀଙ୍କ ପ୍ରସିଦ୍ଧ ଶକ୍ତିପୀଠ। ମହାନଦୀ କୂଳରେ ୧୬ଶ ଶତାବ୍ଦୀର ଚୌହାନ ବଂଶର ଐତିହ୍ୟ।',
    descriptionEn: 'The presiding deity of Western Odisha located on the banks of Mahanadi River, established by Chauhan king Balaram Dev in the 16th century.',
    facts: ['Mahanadi River Bank', 'Latitude: 21.4673° N', 'Chauhan Architecture', 'Nuakhai Jugar Sanctuary']
  },
  {
    id: 'taratarini_temple',
    body: 'Earth',
    nameOr: 'ମା’ ତାରାତାରିଣୀ ଶକ୍ତିପୀଠ (Maa Taratarini Temple, Rushikulya)',
    nameEn: 'Maa Taratarini Ancient Adi Shakti Peeth, Ganjam',
    lat: 19.4905,
    lon: 84.8967,
    zoom: 17,
    elevationM: 215,
    category: 'vedic',
    descriptionOr: 'ଋଷିକୁଲ୍ୟା ନଦୀ କୂଳରେ ତାରିଣୀ ପର୍ବତ ଶିଖରରେ ଅବସ୍ଥିତ ଚାରି ପ୍ରମୁଖ ଆଦି ଶକ୍ତିପୀଠ ମଧ୍ୟରୁ ଅନ୍ୟତମ (ସ୍ତନ ପୀଠ)। ପୁରାତନ ନୌବାଣିଜ୍ୟର କେନ୍ଦ୍ର।',
    descriptionEn: 'One of the four major ancient Tantric Adi Shakti Peethas perched on Tarini hill on the sacred Rushikulya river, historic beacon for ancient Kalinga mariners.',
    facts: ['Elevation: 215 m', 'Rushikulya Sacred River', 'Adi Shakti Peetha', 'Ancient Kalinga Maritime Beacon']
  },
  {
    id: 'kedarnath_temple',
    body: 'Earth',
    nameOr: 'ଶ୍ରୀ କେଦାରନାଥ ଜ୍ୟୋତିର୍ଲିଙ୍ଗ (Kedarnath Temple, Himalayas)',
    nameEn: 'Kedarnath Dham (12 Jyotirlingas, 3,583 m), Garhwal Himalayas',
    lat: 30.7352,
    lon: 79.0669,
    zoom: 17,
    elevationM: 3583,
    category: 'vedic',
    descriptionOr: 'ହିମାଳୟର ମନ୍ଦାକିନୀ ନଦୀ ଉପତ୍ୟକାରେ ୩,୫୮୩ ମିଟର ଉଚ୍ଚତାରେ ଅବସ୍ଥିତ ଦ୍ୱାଦଶ ଜ୍ୟୋତିର୍ଲିଙ୍ଗ ମଧ୍ୟରେ ସର୍ବୋଚ୍ଚ କେଦାରନାଥ ଧାମ। ବରଫାବୃତ ଶୃଙ୍ଗ ଓ ଗ୍ଲେସିୟର।',
    descriptionEn: 'Highest among the 12 sacred Jyotirlingas situated at 3,583 m near Mandakini river glacial source flanked by Mt Kedarnath peak.',
    facts: ['Elevation: 3,583 m (11,755 ft)', 'Mandakini River Valley', 'Highest Jyotirlinga', 'Kedar Dome Glacier Ridge']
  },
  {
    id: 'somnath_temple',
    body: 'Earth',
    nameOr: 'ପ୍ରଭାସ ପାଟଣ ସୋମନାଥ ଜ୍ୟୋତିର୍ଲିଙ୍ଗ (Somnath Temple, Gujarat)',
    nameEn: 'Somnath Jyotirlinga (First of 12 Jyotirlingas), Arabian Sea',
    lat: 20.8880,
    lon: 70.4013,
    zoom: 17,
    elevationM: 10,
    category: 'vedic',
    descriptionOr: 'ପ୍ରଥମ ଜ୍ୟୋତିର୍ଲିଙ୍ଗ ସୋମନାଥ। ଆରବ ସାଗର ଉପକୂଳରେ ଅବସ୍ଥିତ। ଏହାର ବାଣସ୍ତମ୍ଭ ପ୍ରମାଣ କରେ ଯେ ଏଠାରୁ ଦକ୍ଷିଣ ମେରୁ (ଆଣ୍ଟାର୍କଟିକା) ପର୍ଯ୍ୟନ୍ତ କୌଣସି ଭୂଭାଗ ନାହିଁ!',
    descriptionEn: 'The first of the 12 Jyotirlingas on the Arabian Sea coast, featuring the historic Baan Stambh indicating unobstructed ocean straight to Antarctica.',
    facts: ['First Jyotirlinga Shrine', 'Baan Stambh Zero Land to Antarctica', 'Arabian Sea Coastline', 'Reconstructed Chalukya Style']
  },
  {
    id: 'rameshwaram_temple',
    body: 'Earth',
    nameOr: 'ରାମେଶ୍ୱରମ ରାମନାଥସ୍ୱାମୀ ଓ ରାମସେତୁ (Rameshwaram & Ram Setu)',
    nameEn: 'Ramanathaswamy Temple & Adam’s Bridge (Ram Setu)',
    lat: 9.2881,
    lon: 79.3174,
    zoom: 16,
    elevationM: 10,
    category: 'vedic',
    descriptionOr: 'ପମ୍ବନ ଦ୍ୱୀପରେ ଅବସ୍ଥିତ ଦକ୍ଷିଣର ପବିତ୍ର ଧାମ ଏବଂ ରାମସେତୁ (Adam’s Bridge) ର ପ୍ରାରମ୍ଭିକ ସ୍ଥଳ। ବିଶ୍ୱର ଦୀର୍ଘତମ ମନ୍ଦିର କରିଡୋର (୧,୨୨୦ ମିଟର)।',
    descriptionEn: 'Sacred island temple town on Pamban Island and origin point of the historic Ram Setu (Adam Bridge shoals) into the Palk Strait.',
    facts: ['World Longest Temple Corridor (1,220m)', 'Ram Setu Shoals Origin', 'Pamban Sea Bridge', 'Palk Strait Coral Marine Zone']
  },
  {
    id: 'tirupati_balaji',
    body: 'Earth',
    nameOr: 'ତିରୁପତି ଶ୍ରୀ ଭେଙ୍କଟେଶ୍ୱର ସ୍ୱାମୀ (Tirupati Balaji, Tirumala Hills)',
    nameEn: 'Tirumala Venkateswara Temple (Seven Hills, 853 m)',
    lat: 13.6833,
    lon: 79.3472,
    zoom: 17,
    elevationM: 853,
    category: 'vedic',
    descriptionOr: 'ଶେଷାଚଳମ ପର୍ବତମାଳାର ସପ୍ତଗିରି (୭ଟି ପାହାଡ଼) ଉପରେ ୮୫୩ ମିଟର ଉଚ୍ଚତାରେ ଅବସ୍ଥିତ କଳିଯୁଗର ପ୍ରତ୍ୟକ୍ଷ ଭଗବାନ ଶ୍ରୀ ବାଲାଜୀଙ୍କ ପବିତ୍ର ଧାମ।',
    descriptionEn: 'Sacred hilltop temple of Lord Venkateswara perched at 853 m in the Seshachalam Biosphere Reserve across the Seven Hills of Tirumala.',
    facts: ['Elevation: 853 m (2,799 ft)', 'Seshachalam Biosphere Reserve', 'Ananda Nilayam Golden Spire', 'Latitude: 13.6833° N']
  }
];

export const LANDMARKS = REAL_LANDMARKS;

export const GEO_LOD_LABELS: GeoLODLabel[] = [
  // --- EARTH TIER 1: CONTINENTS & OCEANS (Macro View: distance > 8.0) ---
  { id: 'asia', body: 'Earth', nameOr: 'ଏସିଆ ମହାଦେଶ', nameEn: 'Asia', lat: 34.0, lon: 100.0, tier: 1, type: 'continent' },
  { id: 'europe', body: 'Earth', nameOr: 'ଇଉରୋପ', nameEn: 'Europe', lat: 50.0, lon: 15.0, tier: 1, type: 'continent' },
  { id: 'africa', body: 'Earth', nameOr: 'ଆଫ୍ରିକା', nameEn: 'Africa', lat: 5.0, lon: 20.0, tier: 1, type: 'continent' },
  { id: 'namerica', body: 'Earth', nameOr: 'ଉତ୍ତର ଆମେରିକା', nameEn: 'North America', lat: 40.0, lon: -100.0, tier: 1, type: 'continent' },
  { id: 'samerica', body: 'Earth', nameOr: 'ଦକ୍ଷିଣ ଆମେରିକା', nameEn: 'South America', lat: -15.0, lon: -60.0, tier: 1, type: 'continent' },
  { id: 'australia', body: 'Earth', nameOr: 'ଅଷ୍ଟ୍ରେଲିଆ', nameEn: 'Australia', lat: -25.0, lon: 135.0, tier: 1, type: 'continent' },
  { id: 'antarctica', body: 'Earth', nameOr: 'ଆଣ୍ଟାର୍କଟିକା', nameEn: 'Antarctica', lat: -82.0, lon: 0.0, tier: 1, type: 'continent' },
  { id: 'indianocean', body: 'Earth', nameOr: 'ଭାରତ ମହାସାଗର', nameEn: 'Indian Ocean', lat: -15.0, lon: 75.0, tier: 1, type: 'ocean' },
  { id: 'pacificocean', body: 'Earth', nameOr: 'ପ୍ରଶାନ୍ତ ମହାସାଗର', nameEn: 'Pacific Ocean', lat: 0.0, lon: -160.0, tier: 1, type: 'ocean' },
  { id: 'atlanticocean', body: 'Earth', nameOr: 'ଆଟଲାଣ୍ଟିକ ମହାସାଗର', nameEn: 'Atlantic Ocean', lat: 15.0, lon: -35.0, tier: 1, type: 'ocean' },
  { id: 'arcticocean', body: 'Earth', nameOr: 'ଉତ୍ତର ମେରୁ ମହାସାଗର', nameEn: 'Arctic Ocean', lat: 82.0, lon: 0.0, tier: 1, type: 'ocean' },

  // --- EARTH TIER 2: REGIONAL GEOGRAPHY & SEAS (Meso View: 5.5 < distance <= 8.0) ---
  { id: 'india_region', body: 'Earth', nameOr: 'ଭାରତ (India)', nameEn: 'India', lat: 21.5, lon: 78.5, tier: 2, type: 'region' },
  { id: 'himalayas_range', body: 'Earth', nameOr: 'ହିମାଳୟ ପର୍ବତମାଳା', nameEn: 'Himalayas Range', lat: 29.5, lon: 84.0, tier: 2, type: 'mountain' },
  { id: 'bayofbengal', body: 'Earth', nameOr: 'ବଙ୍ଗୋପସାଗର', nameEn: 'Bay of Bengal', lat: 15.5, lon: 88.5, tier: 2, type: 'ocean' },
  { id: 'arabiansea', body: 'Earth', nameOr: 'ଆରବ ସାଗର', nameEn: 'Arabian Sea', lat: 16.0, lon: 66.0, tier: 2, type: 'ocean' },
  { id: 'odisha_coast', body: 'Earth', nameOr: 'ଓଡ଼ିଶା ଉପକୂଳ', nameEn: 'Odisha Coast', lat: 20.2, lon: 86.0, tier: 2, type: 'region' },
  { id: 'tibetan_plateau', body: 'Earth', nameOr: 'ତିବ୍ଦତ ମାଳଭୂମି', nameEn: 'Tibetan Plateau', lat: 32.0, lon: 87.0, tier: 2, type: 'region' },
  { id: 'thar_desert', body: 'Earth', nameOr: 'ଥର ମରୁଭୂମି', nameEn: 'Thar Desert', lat: 26.5, lon: 71.0, tier: 2, type: 'region' },
  { id: 'deccan_plateau', body: 'Earth', nameOr: 'ଦାକ୍ଷିଣାତ୍ୟ ମାଳଭୂମି', nameEn: 'Deccan Plateau', lat: 15.0, lon: 77.0, tier: 2, type: 'region' },
  { id: 'western_ghats', body: 'Earth', nameOr: 'ପଶ୍ଚିମ ଘାଟ', nameEn: 'Western Ghats', lat: 14.0, lon: 74.5, tier: 2, type: 'mountain' },

  // --- EARTH TIER 3: MICRO-LOCATIONS, CITIES & TEMPLES (Micro View: distance <= 5.5) ---
  { id: 'lbl_puri', body: 'Earth', nameOr: 'ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀ', nameEn: 'Puri Jagannath (+9m)', lat: 19.8135, lon: 85.8312, tier: 3, type: 'temple', badge: 'Vedic' },
  { id: 'lbl_konark', body: 'Earth', nameOr: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର', nameEn: 'Konark Sun Temple', lat: 19.8876, lon: 86.0945, tier: 3, type: 'temple', badge: 'UNESCO' },
  { id: 'lbl_bbsr', body: 'Earth', nameOr: 'ଭୁବନେଶ୍ୱର ଲିଙ୍ଗରାଜ', nameEn: 'Bhubaneswar Lingaraj', lat: 20.2382, lon: 85.8336, tier: 3, type: 'temple', badge: 'Ekamra' },
  { id: 'lbl_cuttack', body: 'Earth', nameOr: 'କଟକ ବାରବାଟୀ ଦୁର୍ଗ', nameEn: 'Cuttack Barabati', lat: 20.4855, lon: 85.8677, tier: 3, type: 'city', badge: 'Historic' },
  { id: 'lbl_chilika', body: 'Earth', nameOr: 'ଚିଲିକା ହ୍ରଦ', nameEn: 'Chilika Lagoon', lat: 19.6700, lon: 85.3400, tier: 3, type: 'ocean', badge: 'Ramsar' },
  { id: 'lbl_deomali', body: 'Earth', nameOr: 'ଦେଓମାଳୀ (୧,୬୭୨ ମି.)', nameEn: 'Deomali Peak (1,672m)', lat: 18.6750, lon: 82.9810, tier: 3, type: 'mountain', badge: 'Highest' },
  { id: 'lbl_hirakud', body: 'Earth', nameOr: 'ହୀରାକୁଦ ବନ୍ଧ', nameEn: 'Hirakud Dam', lat: 21.5700, lon: 83.8700, tier: 3, type: 'region', badge: 'Dam' },
  { id: 'lbl_ujjain', body: 'Earth', nameOr: 'ଉଜ୍ଜୟିନୀ 0° ମେରିଡିଆନ୍', nameEn: 'Ujjain Prime Meridian', lat: 23.1828, lon: 75.7682, tier: 3, type: 'temple', badge: 'Vedic 0°' },
  { id: 'lbl_everest', body: 'Earth', nameOr: 'ଏଭରେଷ୍ଟ (୮,୮୪୮ ମି.)', nameEn: 'Mt Everest (8,848m)', lat: 27.9881, lon: 86.9250, tier: 3, type: 'mountain', badge: 'Peak' },
  { id: 'lbl_varanasi', body: 'Earth', nameOr: 'ବାରାଣସୀ କାଶୀ', nameEn: 'Varanasi Kashi', lat: 25.3109, lon: 83.0107, tier: 3, type: 'temple', badge: 'Spiritual' },
  { id: 'lbl_delhi', body: 'Earth', nameOr: 'ନୂଆଦିଲ୍ଲୀ ଜନ୍ତର ମନ୍ତର', nameEn: 'New Delhi Jantar Mantar', lat: 28.6271, lon: 77.2166, tier: 3, type: 'city', badge: 'Astro' },
  { id: 'lbl_sriharikota', body: 'Earth', nameOr: 'ଇସ୍ରୋ ଶ୍ରୀହରିକୋଟା', nameEn: 'ISRO Sriharikota', lat: 13.7199, lon: 80.2305, tier: 3, type: 'mission', badge: 'Spaceport' },
  { id: 'lbl_nasa_ksc', body: 'Earth', nameOr: 'ନାସା କେନେଡି ସ୍ପେସ୍ ସେଣ୍ଟର', nameEn: 'NASA KSC LC-39A', lat: 28.6083, lon: -80.6041, tier: 3, type: 'mission', badge: 'NASA' },
  { id: 'lbl_mariana', body: 'Earth', nameOr: 'ମାରିଆନା (-୧୦,୯୯୪ ମି.)', nameEn: 'Mariana Trench (-10,994m)', lat: 11.3493, lon: 142.1996, tier: 3, type: 'ocean', badge: 'Abyss' },
  { id: 'lbl_greenwich', body: 'Earth', nameOr: 'ଗ୍ରୀନୱିଚ୍ 0°', nameEn: 'Greenwich Observatory', lat: 51.4769, lon: 0.0000, tier: 3, type: 'city', badge: 'UTC 0°' },

  // --- MOON LABELS ---
  { id: 'm_procellarum', body: 'Moon', nameOr: 'ତୋଫାନ୍ ମହାସାଗର', nameEn: 'Oceanus Procellarum', lat: 18.0, lon: -57.0, tier: 1, type: 'ocean' },
  { id: 'm_tranquillitatis', body: 'Moon', nameOr: 'ପ୍ରଶାନ୍ତ ସାଗର', nameEn: 'Mare Tranquillitatis', lat: 8.5, lon: 31.4, tier: 1, type: 'ocean' },
  { id: 'm_imbrium', body: 'Moon', nameOr: 'ବୃଷ୍ଟି ସାଗର', nameEn: 'Mare Imbrium', lat: 32.8, lon: -15.6, tier: 1, type: 'ocean' },
  { id: 'm_tycho', body: 'Moon', nameOr: 'ଟାଇକୋ କ୍ରେଟର୍ (୮୫ କି.ମି.)', nameEn: 'Tycho Crater (85 km)', lat: -43.31, lon: -11.36, tier: 2, type: 'crater', badge: 'Crater' },
  { id: 'm_copernicus', body: 'Moon', nameOr: 'କୋପର୍ନିକସ୍ କ୍ରେଟର୍', nameEn: 'Copernicus Crater', lat: 9.62, lon: -20.08, tier: 2, type: 'crater', badge: 'Crater' },
  { id: 'm_shivshakti', body: 'Moon', nameOr: 'ଶିବ ଶକ୍ତି ପଏଣ୍ଟ (ଇସ୍ରୋ)', nameEn: 'Chandrayaan-3 Shiv Shakti', lat: -69.373, lon: 32.319, tier: 3, type: 'mission', badge: 'ISRO 2023' },
  { id: 'm_apollo11', body: 'Moon', nameOr: 'ଆପୋଲୋ ୧୧ ବେସ୍', nameEn: 'Apollo 11 Base', lat: 0.674, lon: 23.473, tier: 3, type: 'mission', badge: 'NASA 1969' },
  { id: 'm_shackleton', body: 'Moon', nameOr: 'ଶ୍ୟାକଲଟନ୍ ଦକ୍ଷିଣ ମେରୁ', nameEn: 'Shackleton Crater', lat: -89.9, lon: 0.0, tier: 3, type: 'crater', badge: 'South Pole' },

  // --- MARS LABELS ---
  { id: 'mars_tharsis', body: 'Mars', nameOr: 'ଥାର୍ସିସ୍ ଆଗ୍ନେୟଗିରି ପଠାର', nameEn: 'Tharsis Volcanic Plateau', lat: 0.0, lon: 250.0, tier: 1, type: 'region' },
  { id: 'mars_hellas', body: 'Mars', nameOr: 'ହେଲାସ୍ ବେସିନ୍', nameEn: 'Hellas Planitia Basin', lat: -42.7, lon: 70.0, tier: 1, type: 'crater' },
  { id: 'mars_olympus', body: 'Mars', nameOr: 'ଅଲିମ୍ପସ ମନ୍ସ (୨୧.୯ କି.ମି.)', nameEn: 'Olympus Mons (21.9 km)', lat: 18.65, lon: 226.2, tier: 2, type: 'mountain', badge: '21.9 km' },
  { id: 'mars_valles', body: 'Mars', nameOr: 'ଭାଲେସ୍ ମାରିନେରିସ୍ (୪,୦୦୦ କି.ମି.)', nameEn: 'Valles Marineris (4,000 km)', lat: -14.0, lon: 301.0, tier: 2, type: 'canyon', badge: 'Canyon' },
  { id: 'mars_jezero', body: 'Mars', nameOr: 'ଜେଜେରୋ କ୍ରେଟର୍ (ନାସା ରୋଭର୍)', nameEn: 'Jezero Crater (Perseverance)', lat: 18.38, lon: 77.58, tier: 3, type: 'mission', badge: 'NASA Rover' },
  { id: 'mars_gale', body: 'Mars', nameOr: 'ଗେଲ୍ କ୍ରେଟର୍ (କ୍ୟୁରିଓସିଟି)', nameEn: 'Gale Crater (Curiosity)', lat: -5.4, lon: 137.8, tier: 3, type: 'mission', badge: 'Curiosity' },

  // --- JUPITER LABELS ---
  { id: 'jup_neb', body: 'Jupiter', nameOr: 'ଉତ୍ତର ବିଷୁବୀୟ ବଳୟ', nameEn: 'North Equatorial Belt', lat: 15.0, lon: 0.0, tier: 1, type: 'region' },
  { id: 'jup_seb', body: 'Jupiter', nameOr: 'ଦକ୍ଷିଣ ବିଷୁବୀୟ ବଳୟ', nameEn: 'South Equatorial Belt', lat: -15.0, lon: 0.0, tier: 1, type: 'region' },
  { id: 'jup_grs', body: 'Jupiter', nameOr: 'ମହା ରକ୍ତ ଚିହ୍ନ (୧୬,୦୦୦ କି.ମି.)', nameEn: 'Great Red Spot (16,000 km)', lat: -22.0, lon: 165.0, tier: 2, type: 'canyon', badge: 'Storm' }
];

export const EARTH_INTERIOR_LAYERS = [
  {
    nameOr: 'ଭୂତ୍ୱକ୍ (Earth Crust)',
    nameEn: 'Earth Crust (Continental & Oceanic)',
    depthKm: '0 - 35 km (ମହାସାଗରରେ 5-10 km, ମହାଦେଶରେ 30-70 km)',
    tempRange: '0°C ରୁ 500°C',
    compositionOr: 'ସିଲିକନ୍, ଆଲୁମିନିୟମ୍, ଅମ୍ଳଜାନ, ଗ୍ରାନାଇଟ୍ ଓ ବାସାଲ୍ଟ ଶିଳା। ଏଠାରେ ସମସ୍ତ ମାନବ ସଭ୍ୟତା, ମହାସାଗର ଓ ମହାଦେଶ ଅବସ୍ଥିତ।',
    compositionEn: 'Silicates, Aluminum, Basalt and Granite rocks supporting all organic life and oceans.',
    color: '#10b981'
  },
  {
    nameOr: 'ପ୍ରାବାର / ମ୍ୟାଣ୍ଟଲ୍ (Upper & Lower Mantle)',
    nameEn: 'Mantle (Upper & Lower)',
    depthKm: '35 - 2,890 km (ପୃଥିବୀର 84% ଆୟତନ)',
    tempRange: '1,000°C ରୁ 3,700°C',
    compositionOr: 'ଘନ ପେରିଡୋଟାଇଟ୍ ଶିଳା, ମ୍ୟାଗ୍ନେସିୟମ୍ ଓ ଲୌହ ଯୌଗିକ। ମ୍ୟାଣ୍ଟଲ୍ କନଭେକ୍ସନ୍ କରେଣ୍ଟ ଦ୍ୱାରା ଟେକ୍ଟୋନିକ୍ ପ୍ଲେଟ୍ ଗତିଶୀଳ ହୁଏ ଏବଂ ଭୂକମ୍ପ/ଆଗ୍ନେୟଗିରି ସୃଷ୍ଟି ହୁଏ।',
    compositionEn: 'Dense peridotite rock; convection currents here drive continental drift and volcanic activity.',
    color: '#f59e0b'
  },
  {
    nameOr: 'ବାହ୍ୟ କେନ୍ଦ୍ରମଣ୍ଡଳ (Outer Core - Liquid Geodynamo)',
    nameEn: 'Outer Core (Liquid Dynamo)',
    depthKm: '2,890 - 5,150 km',
    tempRange: '4,000°C ରୁ 5,000°C',
    compositionOr: 'ତରଳ ଲୁହା (85%) ଏବଂ ନିକେଲ୍ (10%)। ପୃଥିବୀର ଆବର୍ତ୍ତନ ସହ ଏହି ତରଳ ଧାତୁର ପ୍ରବାହ ପୃଥିବୀର ବିଶାଳ ଚୁମ୍ବକୀୟ କ୍ଷେତ୍ର (Magnetosphere) ସୃଷ୍ଟି କରେ ଯାହା ସୌର ବିକିରଣରୁ ଜୀବଜଗତକୁ ରକ୍ଷା କରେ!',
    compositionEn: 'Liquid iron and nickel churning to generate Earth protective geomagnetic field (Geodynamo).',
    color: '#f97316'
  },
  {
    nameOr: 'ଅନ୍ତଃ କୋର୍ (Inner Core - Solid Crystal Sphere)',
    nameEn: 'Inner Core (Solid Metallic Crystal)',
    depthKm: '5,150 - 6,371 km (କେନ୍ଦ୍ର ପର୍ଯ୍ୟନ୍ତ)',
    tempRange: '5,400°C (ସୂର୍ଯ୍ୟଙ୍କ ପୃଷ୍ଠଭାଗ ପରି ଉତ୍ତପ୍ତ!)',
    compositionOr: '୩.୬ ନିୟୁତ ବାୟୁମଣ୍ଡଳୀୟ ଚାପ ଯୋଗୁଁ ଅତ୍ୟନ୍ତ ଉଚ୍ଚ ତାପମାତ୍ରା ସତ୍ତ୍ୱେ ଏହା କଠିନ ସ୍ଫଟିକ ଲୁହା-ନିକେଲ୍ ଗୋଲକ ରୂପେ ରହିଛି।',
    compositionEn: 'Solid crystal iron-nickel alloy under 3.6 million atmospheres of pressure at 5,400°C.',
    color: '#ef4444'
  }
];

export const ATMOSPHERE_LAYERS = [
  {
    nameOr: 'ଟ୍ରୋପୋସ୍ଫିୟର୍ (Troposphere)',
    nameEn: 'Troposphere',
    altitudeKm: '0 - 12 km',
    descOr: 'ବାୟୁମଣ୍ଡଳର ୮୦% ଭାର ଏଠାରେ ଥାଏ। ସମସ୍ତ ମେଘ, ବର୍ଷା, ଝଡ଼ ଓ ବାୟୁ ପ୍ରବାହ ଏହି ସ୍ତରରେ ସୀମିତ। ଉଚ୍ଚତା ବଢ଼ିଲେ ତାପମାତ୍ରା ହ୍ରାସ ପାଏ।',
    descEn: 'Contains 80% of atmospheric mass and all weather phenomena. Temperature decreases with height.'
  },
  {
    nameOr: 'ଷ୍ଟ୍ରାଟୋସ୍ଫିୟର୍ ଓ ଓଜୋନ୍ ସ୍ତର (Stratosphere & Ozone)',
    nameEn: 'Stratosphere & Ozone Layer',
    altitudeKm: '12 - 50 km',
    descOr: 'ଓଜୋନ୍ ଗ୍ୟାସ୍ (O₃) ର ଘନ ସ୍ତର ସୂର୍ଯ୍ୟଙ୍କ ମାରାତ୍ମକ ଅତିବାଇଗଣୀ (UV-C/UV-B) ରଶ୍ମିକୁ ଶୋଷଣ କରି ଜୀବଜଗତକୁ ରକ୍ଷା କରେ। ବାଣିଜ୍ୟିକ ବିମାନ ଚଳାଚଳ ପାଇଁ ଆଦର୍ଶ।',
    descEn: 'Contains the critical Ozone Layer (O3) shielding Earth from harmful ultraviolet radiation.'
  },
  {
    nameOr: 'ମେସୋସ୍ଫିୟର୍ (Mesosphere)',
    nameEn: 'Mesosphere',
    altitudeKm: '50 - 85 km',
    descOr: 'ବାୟୁମଣ୍ଡଳର ସବୁଠାରୁ ଶୀତଳ ସ୍ତର (-୯୦°C)। ମହାକାଶରୁ ଆସୁଥିବା ଉଲ୍‌କାପିଣ୍ଡ (Meteors) ବାୟୁ ଘର୍ଷଣରେ ଏହି ସ୍ତରରେ ଜଳି ଭସ୍ମ ହୋଇଯାଏ।',
    descEn: 'Coldest layer (-90°C). Most incoming meteors burn up here due to atmospheric friction.'
  },
  {
    nameOr: 'ଥର୍ମୋସ୍ଫିୟର୍ ଓ ଆୟନୋସ୍ଫିୟର୍ (Thermosphere & Aurora)',
    nameEn: 'Thermosphere & Ionosphere',
    altitudeKm: '85 - 600 km',
    descOr: 'ସୌର ରଶ୍ମି ଯୋଗୁଁ ତାପମାତ୍ରା ୨,୦୦୦°C ପର୍ଯ୍ୟନ୍ତ ବୃଦ୍ଧି ପାଏ। ଆନ୍ତର୍ଜାତୀୟ ମହାକାଶ ଷ୍ଟେସନ୍ (ISS 408 km) ଏବଂ ମେରୁପ୍ରଭା (Aurora Borealis) ଏହି ସ୍ତରରେ ଘଟେ।',
    descEn: 'Home to the International Space Station (ISS, 408 km) and breathtaking Auroral displays.'
  },
  {
    nameOr: 'ଏକ୍ସୋସ୍ଫିୟର୍ (Exosphere)',
    nameEn: 'Exosphere',
    altitudeKm: '600 - 10,000 km',
    descOr: 'ବାୟୁମଣ୍ଡଳର ବାହ୍ୟ ସୀମା ଯାହା କ୍ରମଶଃ ମହାକାଶର ଶୂନ୍ୟତା (Deep Space Vacuum) ରେ ମିଶିଯାଏ। ଭୂସ୍ଥିର କୃତ୍ରିମ ଉପଗ୍ରହ ମାନ ଏଠାରେ ପରିକ୍ରମଣ କରନ୍ତି।',
    descEn: 'The outermost atmospheric frontier fading into the deep vacuum of interplanetary space.'
  }
];

export const PLANET_PHYSICAL_DATA: Record<string, {
  nameOr: string;
  nameEn: string;
  diameter: string;
  mass: string;
  gravity: string;
  escapeVel: string;
  orbitalSpeed: string;
  axialTilt: string;
  dayLength: string;
  temperature: string;
  atmosphere: string;
}> = {
  Earth: {
    nameOr: 'ପୃଥିବୀ (Earth)',
    nameEn: 'Earth (Terra)',
    diameter: '12,756.2 km (Equatorial) / 12,713.6 km (Polar)',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.807 m/s² (1.0 g)',
    escapeVel: '11.186 km/s (40,270 km/h)',
    orbitalSpeed: '29.78 km/s (107,200 km/h)',
    axialTilt: '23.4393° (Seasons Driver)',
    dayLength: '23h 56m 04s (Sidereal Day)',
    temperature: '-89.2°C to +56.7°C (Mean: 15°C)',
    atmosphere: '78.08% N₂, 20.95% O₂, 0.93% Ar, 0.04% CO₂'
  },
  Moon: {
    nameOr: 'ଚନ୍ଦ୍ର (Moon)',
    nameEn: 'Moon (Luna)',
    diameter: '3,474.8 km (0.272 Earths)',
    mass: '7.342 × 10²² kg (0.0123 Earths)',
    gravity: '1.622 m/s² (0.166 g / 1/6th Earth)',
    escapeVel: '2.38 km/s',
    orbitalSpeed: '1.022 km/s (27.32 days orbit)',
    axialTilt: '1.5424°',
    dayLength: '27.32 Earth Days (Tidally Locked)',
    temperature: '-246°C (Polar Craters) to +121°C (Sunlit)',
    atmosphere: 'Hard Vacuum (<3 × 10⁻¹⁵ bar), Trace He, Ne, Ar'
  },
  Mars: {
    nameOr: 'ମଙ୍ଗଳ (Mars)',
    nameEn: 'Mars (The Red Planet)',
    diameter: '6,779.0 km (0.532 Earths)',
    mass: '6.417 × 10²³ kg (0.107 Earths)',
    gravity: '3.721 m/s² (0.379 g / 38% Earth)',
    escapeVel: '5.03 km/s',
    orbitalSpeed: '24.07 km/s',
    axialTilt: '25.19° (Earth-like seasons)',
    dayLength: '24h 37m 22s (1 Sol)',
    temperature: '-143°C to +35°C (Mean: -63°C)',
    atmosphere: '95.32% CO₂, 2.6% N₂, 1.9% Ar, 0.16% O₂ (6.36 mbar)'
  },
  Jupiter: {
    nameOr: 'ବୃହସ୍ପତି (Jupiter)',
    nameEn: 'Jupiter (King of Planets)',
    diameter: '139,820 km (10.97 Earths / Jovian Giant)',
    mass: '1.898 × 10²⁷ kg (317.8 Earths / 2.5× All Planets Combined)',
    gravity: '24.79 m/s² (2.528 g)',
    escapeVel: '59.5 km/s',
    orbitalSpeed: '13.07 km/s (11.86 Earth years)',
    axialTilt: '3.13°',
    dayLength: '9h 55m 33s (Fastest Planetary Rotation)',
    temperature: '-145°C (Cloud Tops) to >24,000°C (Core)',
    atmosphere: '89.8% H₂, 10.2% He, 0.3% CH₄, 0.026% NH₃'
  },
  Saturn: {
    nameOr: 'ଶନି (Saturn)',
    nameEn: 'Saturn (Ringed Wonder)',
    diameter: '116,460 km (9.14 Earths, rings span 282,000 km)',
    mass: '5.683 × 10²⁶ kg (95.16 Earths)',
    gravity: '10.44 m/s² (1.065 g)',
    escapeVel: '35.5 km/s',
    orbitalSpeed: '9.68 km/s (29.46 Earth years)',
    axialTilt: '26.73°',
    dayLength: '10h 33m 38s',
    temperature: '-178°C (Upper clouds) to 11,700°C (Core)',
    atmosphere: '96.3% H₂, 3.25% He, 0.45% CH₄ (Density: 0.687 g/cm³)'
  },
  Sun: {
    nameOr: 'ସୂର୍ଯ୍ୟ (Sun)',
    nameEn: 'The Sun (Sol)',
    diameter: '1,392,700 km (109.3 Earths)',
    mass: '1.989 × 10³⁰ kg (333,000 Earths / 99.86% Solar System)',
    gravity: '274.0 m/s² (27.9 g)',
    escapeVel: '617.5 km/s',
    orbitalSpeed: '220 km/s (Galactic Center Orbit)',
    axialTilt: '7.25° to Ecliptic',
    dayLength: '25.38 Days (Equatorial Differential Rotation)',
    temperature: '5,500°C (Photosphere) / 15,700,000 K (Core Fusion)',
    atmosphere: '73.46% Hydrogen, 24.85% Helium, 0.77% Oxygen'
  }
};

export const GoogleEarthGlobeExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { language } = useI18n();

  // Primary Explorer Mode: 'google_earth' is the 100% authentic interactive satellite GIS map
  const [displayMode, setDisplayMode] = useState<'google_earth' | '3d_globe' | 'interior' | 'atmosphere'>('google_earth');
  const [activeBody, setActiveBody] = useState<'Earth' | 'Moon' | 'Mars' | 'Sun' | 'Jupiter' | 'Saturn'>('Earth');
  const [currentLandmark, setCurrentLandmark] = useState<LandmarkPoint>(REAL_LANDMARKS[0]);
  const [selectedHotspot, setSelectedHotspot] = useState<LandmarkPoint | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [currentLODTier, setCurrentLODTier] = useState<1 | 2 | 3>(2);

  // Label Canvas Overlay Reference for 2D Progressive Labels on 3D Globe
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);

  // Native Leaflet Real Satellite Map States
  const [L, setL] = useState<typeof LeafletNS | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletNS.Map | null>(null);
  const tileLayerRef = useRef<LeafletNS.TileLayer | null>(null);
  const markersLayerRef = useRef<LeafletNS.LayerGroup | null>(null);
  const routeLayerRef = useRef<LeafletNS.LayerGroup | null>(null);

  // 100% Real Pilgrimage GPS Route & In-App Navigation States
  const [showRouteNavigator, setShowRouteNavigator] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isSimulatedNavigation, setIsSimulatedNavigation] = useState<boolean>(false);
  const vehicleMarkerRef = useRef<LeafletNS.Marker | null>(null);

  // Interactive "Drop Pin on Map" Mode States
  const [pickingMode, setPickingMode] = useState<'origin' | 'destination' | null>(null);
  const pickingModeRef = useRef<'origin' | 'destination' | null>(null);
  pickingModeRef.current = pickingMode;
  const [pickedMapPoint, setPickedMapPoint] = useState<{ target: 'origin' | 'destination'; point: RoutePoint } | null>(null);

  // Global Map Search Autocomplete States
  const [searchSuggestions, setSearchSuggestions] = useState<GeoSearchResult[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((mod) => {
        setL((mod.default ? (mod.default as any) : mod) as typeof LeafletNS);
      });
    }
  }, []);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number }>({ lat: 19.8049, lon: 85.8179 });
  const [currentMapZoom, setCurrentMapZoom] = useState<number>(18);
  const [satelliteLayer, setSatelliteLayer] = useState<'h' | 's' | 'esri' | 'p' | 'm'>('h');
  const [showPins, setShowPins] = useState<boolean>(true);
  const [googleEarthCategory, setGoogleEarthCategory] = useState<'all' | 'odisha' | 'india' | 'world'>('odisha');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [activeSearchLocation, setActiveSearchLocation] = useState<string>('Shree Jagannath Temple, Puri, Odisha');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Horizontal landmark presets scrolling ref & states
  const landmarksScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLandmarksLeft, setCanScrollLandmarksLeft] = useState<boolean>(false);
  const [canScrollLandmarksRight, setCanScrollLandmarksRight] = useState<boolean>(true);
  const isLandmarksDragging = useRef<boolean>(false);
  const landmarksStartX = useRef<number>(0);
  const landmarksScrollStart = useRef<number>(0);
  const landmarksScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateLandmarksScrollStatus = () => {
    const el = landmarksScrollRef.current;
    if (!el) return;
    setCanScrollLandmarksLeft(el.scrollLeft > 6);
    setCanScrollLandmarksRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    updateLandmarksScrollStatus();
    const handleResize = () => updateLandmarksScrollStatus();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (landmarksScrollTimerRef.current) clearTimeout(landmarksScrollTimerRef.current);
    };
  }, []);

  // Recalculate scroll limits when category changes
  useEffect(() => {
    updateLandmarksScrollStatus();
    const timer = setTimeout(updateLandmarksScrollStatus, 150);
    return () => clearTimeout(timer);
  }, [googleEarthCategory]);

  // Smooth scroll left/right by direction
  const handleScrollLandmarks = (direction: 'left' | 'right') => {
    const el = landmarksScrollRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    if (landmarksScrollTimerRef.current) clearTimeout(landmarksScrollTimerRef.current);
    landmarksScrollTimerRef.current = setTimeout(updateLandmarksScrollStatus, 250);
  };

  // Mouse drag-to-scroll handlers
  const handleLandmarksMouseDown = (e: React.MouseEvent) => {
    isLandmarksDragging.current = true;
    landmarksStartX.current = e.pageX;
    if (landmarksScrollRef.current) {
      landmarksScrollStart.current = landmarksScrollRef.current.scrollLeft;
    }
  };

  const handleLandmarksMouseMove = (e: React.MouseEvent) => {
    if (!isLandmarksDragging.current || !landmarksScrollRef.current) return;
    const dx = e.pageX - landmarksStartX.current;
    landmarksScrollRef.current.scrollLeft = landmarksScrollStart.current - dx;
    updateLandmarksScrollStatus();
  };

  const handleLandmarksMouseUp = () => {
    isLandmarksDragging.current = false;
  };

  // Horizontal mouse wheel scrolling support
  const handleLandmarksWheel = (e: React.WheelEvent) => {
    const el = landmarksScrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      updateLandmarksScrollStatus();
    }
  };

  // Auto-scroll selected landmark into center view
  useEffect(() => {
    if (!currentLandmark || !landmarksScrollRef.current) return;
    const activeBtn = landmarksScrollRef.current.querySelector(`[data-landmark="${currentLandmark.id}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      const timer = setTimeout(updateLandmarksScrollStatus, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLandmark]);

  const controlsRef = useRef<{
    flyTo: (lat: number, lon: number) => void;
    zoom: (factor: number) => void;
    reset: () => void;
  } | null>(null);

  // Three.js 3D NASA Planetary Sphere
  useEffect(() => {
    if (displayMode !== '3d_globe') return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 580;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Prepare Label Canvas Overlay
    const labelCanvas = labelCanvasRef.current;
    const labelCtx = labelCanvas ? labelCanvas.getContext('2d') : null;
    const updateCanvasSizes = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (labelCanvas) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        labelCanvas.width = w * dpr;
        labelCanvas.height = h * dpr;
        labelCanvas.style.width = `${w}px`;
        labelCanvas.style.height = `${h}px`;
      }
    };
    updateCanvasSizes();

    // Deep Space Starfield
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 140;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Directional Sunlight & Cosmic Ambient
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(14, 5, 12);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x1a2638, 0.65);
    scene.add(ambientLight);

    // Globe Group (with true axial tilt)
    const globeGroup = new THREE.Group();
    const tilts: Record<string, number> = {
      Earth: 23.44,
      Moon: 1.54,
      Mars: 25.19,
      Jupiter: 3.13,
      Saturn: 26.73,
      Sun: 7.25
    };
    globeGroup.rotation.z = THREE.MathUtils.degToRad(tilts[activeBody] || 23.44);
    scene.add(globeGroup);

    // Sphere Geometry & Authentic NASA Texture with 16x Anisotropic Filtering
    const globeGeo = new THREE.SphereGeometry(2.6, 96, 96);
    let globeMat = new THREE.MeshStandardMaterial({
      roughness: activeBody === 'Earth' ? 0.45 : 0.75,
      metalness: activeBody === 'Earth' ? 0.05 : 0.1
    });

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const tex = loadRealPlanetTexture(activeBody);
    tex.anisotropy = maxAniso;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    globeMat.map = tex;

    if (activeBody === 'Earth') {
      const specTex = loadEarthSpecularTexture();
      specTex.anisotropy = maxAniso;
      globeMat.roughnessMap = specTex;
    } else if (activeBody === 'Sun') {
      globeMat.emissive = new THREE.Color(0xffaa22);
      globeMat.emissiveIntensity = 0.8;
      globeMat.roughness = 0.9;
    }
    globeMat.needsUpdate = true;

    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Real Rotating Earth Cloud Layer
    let cloudMesh: THREE.Mesh | null = null;
    if (activeBody === 'Earth') {
      const cloudGeo = new THREE.SphereGeometry(2.625, 64, 64);
      const cloudTex = loadEarthCloudsTexture();
      cloudTex.anisotropy = maxAniso;
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      globeGroup.add(cloudMesh);
    }

    // Saturn 3D Ring System
    let saturnRingMesh: THREE.Mesh | null = null;
    if (activeBody === 'Saturn') {
      const ringGeo = new THREE.RingGeometry(3.1, 5.4, 96);
      const ringTex = createSaturnRingTexture();
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92
      });
      saturnRingMesh = new THREE.Mesh(ringGeo, ringMat);
      saturnRingMesh.rotation.x = Math.PI * 0.48;
      globeGroup.add(saturnRingMesh);
    }

    // Atmospheric Rayleigh Scattering Blue Horizon Glow
    const haloGeo = new THREE.SphereGeometry(2.74, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: activeBody === 'Mars' ? 0xc2410c : activeBody === 'Sun' ? 0xf59e0b : 0x38bdf8,
      transparent: true,
      opacity: activeBody === 'Moon' ? 0.02 : 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Scientific Coordinate Grid
    const gridGroup = new THREE.Group();
    globeGroup.add(gridGroup);

    // Golden Equator (0° Latitude)
    const eqCurve = new THREE.EllipseCurve(0, 0, 2.62, 2.62, 0, Math.PI * 2, false, 0);
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqCurve.getPoints(96));
    const eqMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    const eqLine = new THREE.Line(eqGeo, eqMat);
    eqLine.rotation.x = Math.PI / 2;
    gridGroup.add(eqLine);

    // Saffron Prime Meridian (0° Longitude)
    const pmMat = new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.7 });
    const pmLine = new THREE.Line(eqGeo, pmMat);
    gridGroup.add(pmLine);

    // Tropic of Cancer (23.44° N) & Capricorn (23.44° S)
    if (activeBody === 'Earth' || activeBody === 'Mars') {
      const tcR = 2.615 * Math.cos(THREE.MathUtils.degToRad(23.44));
      const tcY = 2.615 * Math.sin(THREE.MathUtils.degToRad(23.44));
      const tcCurve = new THREE.EllipseCurve(0, 0, tcR, tcR, 0, Math.PI * 2, false, 0);
      const tcGeo = new THREE.BufferGeometry().setFromPoints(tcCurve.getPoints(64));
      const tcMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.18, gapSize: 0.08, transparent: true, opacity: 0.55 });

      const cancerLine = new THREE.Line(tcGeo, tcMat);
      cancerLine.rotation.x = Math.PI / 2;
      cancerLine.position.y = tcY;
      cancerLine.computeLineDistances();
      gridGroup.add(cancerLine);

      const capLine = new THREE.Line(tcGeo, tcMat);
      capLine.rotation.x = Math.PI / 2;
      capLine.position.y = -tcY;
      capLine.computeLineDistances();
      gridGroup.add(capLine);
    }

    // Realistic Subtle 3D Landmark Pinpoints (NO giant bullseye discs!)
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const relevantLandmarks = REAL_LANDMARKS.filter(l => (l.body || 'Earth') === activeBody);
    relevantLandmarks.forEach((l) => {
      const phi = THREE.MathUtils.degToRad(90 - l.lat);
      const theta = THREE.MathUtils.degToRad(l.lon + 180);
      const r = 2.628;
      const px = -r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.cos(phi);
      const pz = r * Math.sin(phi) * Math.sin(theta);

      // Subtle, realistic glowing pinpoint
      const pinGeo = new THREE.SphereGeometry(0.014, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({
        color: l.category === 'vedic' ? 0xf59e0b : l.category === 'scientific' ? 0x38bdf8 : 0x10b981
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(px, py, pz);
      pinGroup.add(pinMesh);
    });

    // Mouse / Touch Drag Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let camDist = 8.5;
    let lastReportedTier: 1 | 2 | 3 = 2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      targetRotationY += dx * 0.006;
      targetRotationX = THREE.MathUtils.clamp(targetRotationX + dy * 0.006, -Math.PI * 0.42, Math.PI * 0.42);

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      camDist = THREE.MathUtils.clamp(camDist * zoomFactor, 2.9, 22.0);
    };

    const onCanvasClick = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 580;
      const currentDist = camera.position.z;
      const activeTier: 1 | 2 | 3 = currentDist > 8.5 ? 1 : currentDist > 5.8 ? 2 : 3;

      const relevantLabels = GEO_LOD_LABELS.filter(
        lbl => lbl.body === activeBody && lbl.tier <= activeTier
      );

      for (const lbl of relevantLabels) {
        const phi = THREE.MathUtils.degToRad(90 - lbl.lat);
        const theta = THREE.MathUtils.degToRad(lbl.lon + 180);
        const r = 2.625;
        const pos = new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
        pos.applyMatrix4(globeGroup.matrixWorld);

        const normal = pos.clone().normalize();
        const toCam = camera.position.clone().sub(pos).normalize();
        if (normal.dot(toCam) < 0.12) continue;

        const p = pos.clone().project(camera);
        const sx = (p.x * 0.5 + 0.5) * w;
        const sy = (-p.y * 0.5 + 0.5) * h;

        const dist = Math.hypot(clickX - sx, clickY - sy);
        if (dist < 26) {
          const matchedLandmark = REAL_LANDMARKS.find(l => l.id === lbl.id) || {
            id: lbl.id,
            body: lbl.body,
            nameOr: lbl.nameOr,
            nameEn: lbl.nameEn,
            lat: lbl.lat,
            lon: lbl.lon,
            zoom: 16,
            elevationM: 0,
            category: 'geographic' as const,
            descriptionOr: `${lbl.nameOr} - ଭୌଗୋଳିକ ଅକ୍ଷାଂଶ: ${lbl.lat}°, ଦ୍ରାଘିମା: ${lbl.lon}°`,
            descriptionEn: `${lbl.nameEn} - Geographic coordinates: ${lbl.lat}° N, ${lbl.lon}° E`,
            facts: [`Latitude: ${lbl.lat}°`, `Longitude: ${lbl.lon}°`, `LOD Tier: ${lbl.tier}`]
          };
          handleSelectLandmark(matchedLandmark);
          break;
        }
      }
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('click', onCanvasClick);

    controlsRef.current = {
      flyTo: (lat: number, lon: number) => {
        setIsRotating(false);
        const phi = THREE.MathUtils.degToRad(lat);
        const theta = THREE.MathUtils.degToRad(lon);
        targetRotationX = phi;
        targetRotationY = -theta - Math.PI / 2;
        camDist = 4.2;
      },
      zoom: (factor: number) => {
        camDist = THREE.MathUtils.clamp(camDist * factor, 2.9, 22.0);
      },
      reset: () => {
        targetRotationX = 0;
        targetRotationY = 0;
        camDist = 8.5;
        setIsRotating(true);
        setSelectedHotspot(null);
      }
    };

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        targetRotationY += 0.0018;
      }

      globeGroup.rotation.y = THREE.MathUtils.lerp(globeGroup.rotation.y, targetRotationY, 0.08);
      globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetRotationX, 0.08);

      if (cloudMesh) {
        cloudMesh.rotation.y += 0.0003;
      }

      camera.position.z = THREE.MathUtils.lerp(camera.position.z, camDist, 0.08);
      gridGroup.visible = showGrid;

      renderer.render(scene, camera);

      // Determine current Zoom LOD Tier based on camera distance
      const currentDist = camera.position.z;
      const tier: 1 | 2 | 3 = currentDist > 8.5 ? 1 : currentDist > 5.8 ? 2 : 3;
      if (tier !== lastReportedTier) {
        lastReportedTier = tier;
        setCurrentLODTier(tier);
      }

      // Draw Dynamic 2D Level-of-Detail Place Labels on Overlay Canvas
      if (labelCanvas && labelCtx) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        labelCtx.save();
        labelCtx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
        labelCtx.scale(dpr, dpr);

        if (showLabels) {
          const w = mount.clientWidth || 500;
          const h = mount.clientHeight || 580;

          // Track occupied screen areas to avoid ANY label overlapping
          const occupiedAreas: { x1: number; y1: number; x2: number; y2: number }[] = [];

          // Sort labels so selected landmark and higher tiers render first
          const sortedLabels = [...GEO_LOD_LABELS]
            .filter(lbl => lbl.body === activeBody && lbl.tier <= tier)
            .sort((a, b) => {
              const aSel = a.id === currentLandmark.id || a.id === selectedHotspot?.id;
              const bSel = b.id === currentLandmark.id || b.id === selectedHotspot?.id;
              if (aSel) return -1;
              if (bSel) return 1;
              return a.tier - b.tier;
            });

          sortedLabels.forEach(lbl => {
            const phi = THREE.MathUtils.degToRad(90 - lbl.lat);
            const theta = THREE.MathUtils.degToRad(lbl.lon + 180);
            const r = 2.628;
            const pos = new THREE.Vector3(
              -r * Math.sin(phi) * Math.cos(theta),
              r * Math.cos(phi),
              r * Math.sin(phi) * Math.sin(theta)
            );
            pos.applyMatrix4(globeGroup.matrixWorld);

            // Backface culling: hide labels on the rear hemisphere
            const normal = pos.clone().normalize();
            const toCam = camera.position.clone().sub(pos).normalize();
            if (normal.dot(toCam) < 0.14) return;

            // Project to screen space
            const p = pos.clone().project(camera);
            const sx = (p.x * 0.5 + 0.5) * w;
            const sy = (-p.y * 0.5 + 0.5) * h;

            const isSelected = currentLandmark.id === lbl.id || selectedHotspot?.id === lbl.id;
            const displayName = language === 'or' ? lbl.nameOr : lbl.nameEn;

            let dotColor = '#38bdf8'; // cyan
            if (lbl.type === 'temple') dotColor = '#f59e0b'; // gold
            else if (lbl.type === 'mountain' || lbl.type === 'crater') dotColor = '#10b981'; // emerald
            else if (lbl.type === 'mission') dotColor = '#ec4899'; // pink
            else if (lbl.type === 'continent' || lbl.type === 'ocean') dotColor = '#60a5fa'; // soft blue

            labelCtx.font = isSelected
              ? 'bold 11px system-ui'
              : lbl.tier === 1
              ? 'bold 11px system-ui'
              : lbl.tier === 2
              ? '600 10px system-ui'
              : '500 9px system-ui';
            const textWidth = labelCtx.measureText(displayName).width;

            // Bounding box for collision detection
            const boxW = textWidth + 14;
            const boxH = 18;
            const bx = sx + 8;
            const by = sy - 9;

            const collides = occupiedAreas.some(
              b => !(bx + boxW < b.x1 || bx > b.x2 || by + boxH < b.y1 || by > b.y2)
            );

            // If it collides and is NOT the selected landmark:
            // Just draw a clean 2.5px glowing dot without overlapping text badge!
            if (collides && !isSelected) {
              labelCtx.beginPath();
              labelCtx.arc(sx, sy, 2.5, 0, Math.PI * 2);
              labelCtx.fillStyle = dotColor;
              labelCtx.globalAlpha = 0.5;
              labelCtx.fill();
              labelCtx.globalAlpha = 1.0;
              return;
            }

            occupiedAreas.push({ x1: bx - 4, y1: by - 4, x2: bx + boxW + 4, y2: by + boxH + 4 });

            // Draw clean subtle pin point
            labelCtx.beginPath();
            labelCtx.arc(sx, sy, isSelected ? 4 : 2.5, 0, Math.PI * 2);
            labelCtx.fillStyle = isSelected ? '#fbbf24' : dotColor;
            labelCtx.fill();

            if (isSelected) {
              // Slender vertical pin needle
              labelCtx.beginPath();
              labelCtx.moveTo(sx, sy);
              labelCtx.lineTo(sx, sy - 12);
              labelCtx.strokeStyle = '#f59e0b';
              labelCtx.lineWidth = 1.5;
              labelCtx.stroke();

              // Top glowing head
              labelCtx.beginPath();
              labelCtx.arc(sx, sy - 12, 3.5, 0, Math.PI * 2);
              labelCtx.fillStyle = '#f59e0b';
              labelCtx.fill();
              labelCtx.strokeStyle = '#ffffff';
              labelCtx.lineWidth = 1.5;
              labelCtx.stroke();
            }

            // Draw sleek modern badge (NO harsh black box!)
            labelCtx.beginPath();
            labelCtx.roundRect(bx, by, boxW, boxH, 6);
            labelCtx.fillStyle = isSelected
              ? 'rgba(245, 158, 11, 0.95)'
              : 'rgba(15, 23, 42, 0.82)';
            labelCtx.fill();

            labelCtx.strokeStyle = isSelected
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.25)';
            labelCtx.lineWidth = 1;
            labelCtx.stroke();

            // Text
            labelCtx.fillStyle = isSelected ? '#020617' : '#f8fafc';
            labelCtx.fillText(displayName, bx + 7, by + 13);
          });
        }
        labelCtx.restore();
      }
    };
    animate();

    const handleResize = () => {
      updateCanvasSizes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('click', onCanvasClick);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [displayMode, activeBody, showGrid, isRotating, showLabels, language]);

  // Tile config helper for Google Earth & Esri
  const getTileLayerConfig = (layer: 'h' | 's' | 'esri' | 'p' | 'm') => {
    switch (layer) {
      case 'h':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          options: {
            subdomains: ['1', '2', '3'],
            maxZoom: 21,
            maxNativeZoom: 19,
            keepBuffer: 12,
            updateWhenIdle: false,
            updateWhenZooming: true,
            crossOrigin: true,
            attribution: '© Google Earth Satellite Hybrid'
          }
        };
      case 's':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          options: {
            subdomains: ['1', '2', '3'],
            maxZoom: 21,
            maxNativeZoom: 19,
            keepBuffer: 12,
            updateWhenIdle: false,
            updateWhenZooming: true,
            crossOrigin: true,
            attribution: '© Google Pure Satellite'
          }
        };
      case 'esri':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {
            maxZoom: 21,
            maxNativeZoom: 19,
            keepBuffer: 12,
            updateWhenIdle: false,
            updateWhenZooming: true,
            crossOrigin: true,
            attribution: '© Esri, Maxar Earthstar Geographics'
          }
        };
      case 'p':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          options: {
            subdomains: ['1', '2', '3'],
            maxZoom: 20,
            maxNativeZoom: 17,
            keepBuffer: 12,
            updateWhenIdle: false,
            updateWhenZooming: true,
            crossOrigin: true,
            attribution: '© Google Terrain Relief'
          }
        };
      case 'm':
      default:
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          options: {
            subdomains: ['1', '2', '3'],
            maxZoom: 21,
            maxNativeZoom: 19,
            keepBuffer: 12,
            updateWhenIdle: false,
            updateWhenZooming: true,
            crossOrigin: true,
            attribution: '© Google Maps'
          }
        };
    }
  };

  const attachTileRetryListener = (layer: LeafletNS.TileLayer) => {
    layer.on('tileerror', (event: any) => {
      const tile = event.tile as HTMLImageElement;
      if (!tile) return;
      const currentRetry = Number(tile.getAttribute('data-retry') || '0');
      if (currentRetry < 3) {
        tile.setAttribute('data-retry', String(currentRetry + 1));
        const nextSub = ((currentRetry + 1) % 3) + 1;
        setTimeout(() => {
          tile.src = event.url.replace(/mt[0-3]\.google\.com/, `mt${nextSub}.google.com`);
        }, 300 * (currentRetry + 1));
      } else {
        tile.style.display = 'none';
      }
    });
  };

  // Leaflet Interactive Real Satellite Map Setup
  useEffect(() => {
    if (displayMode !== 'google_earth' || !L) return;
    const container = mapContainerRef.current;
    if (!container) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.invalidateSize();
      return;
    }

    const map = L.map(container, {
      center: [currentLandmark.lat, currentLandmark.lon],
      zoom: currentLandmark.zoom || 18,
      maxZoom: 21,
      minZoom: 2,
      zoomControl: false,
      attributionControl: false
    });

    const cfg = getTileLayerConfig(satelliteLayer);
    const tileLayer = L.tileLayer(cfg.url, cfg.options).addTo(map);
    attachTileRetryListener(tileLayer);
    tileLayerRef.current = tileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    const routeGroup = L.layerGroup().addTo(map);
    routeLayerRef.current = routeGroup;

    map.on('move', () => {
      const center = map.getCenter();
      setMapCenter({ lat: Number(center.lat.toFixed(4)), lon: Number(center.lng.toFixed(4)) });
      setCurrentMapZoom(map.getZoom());
    });

    map.on('click', async (e: any) => {
      const mode = pickingModeRef.current;
      if (!mode) return;

      const clickLat = Number(e.latlng.lat.toFixed(5));
      const clickLon = Number(e.latlng.lng.toFixed(5));

      // Instant Visual Pin Badge on Map
      if (routeLayerRef.current) {
        const pinIcon = L.divIcon({
          className: 'dropped-pin-badge',
          html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${mode === 'origin' ? '#10b981' : '#f59e0b'};color:#000;font-size:16px;box-shadow:0 0 16px ${mode === 'origin' ? '#10b981' : '#f59e0b'};border:2px solid #ffffff;">${mode === 'origin' ? '🟢' : '🚩'}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });
        L.marker([clickLat, clickLon], { icon: pinIcon }).addTo(routeLayerRef.current);
      }

      const placeName = await reverseGeocodeCoord(clickLat, clickLon, language);

      const point: RoutePoint = {
        nameOr: placeName,
        nameEn: placeName,
        lat: clickLat,
        lon: clickLon,
        category: 'custom'
      };

      setPickedMapPoint({ target: mode, point });
      setPickingMode(null);
      setShowRouteNavigator(true);
    });

    leafletMapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, [displayMode, L]);

  // Handle Satellite Layer Change
  useEffect(() => {
    if (!leafletMapRef.current || !L) return;
    if (tileLayerRef.current) {
      leafletMapRef.current.removeLayer(tileLayerRef.current);
    }
    const cfg = getTileLayerConfig(satelliteLayer);
    const newLayer = L.tileLayer(cfg.url, cfg.options).addTo(leafletMapRef.current);
    attachTileRetryListener(newLayer);
    tileLayerRef.current = newLayer;
  }, [satelliteLayer, L]);

  // Handle Markers on Map
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current || !L) return;
    markersLayerRef.current.clearLayers();
    if (!showPins) return;

    const earthLandmarks = REAL_LANDMARKS.filter(l => !l.body || l.body === 'Earth');
    earthLandmarks.forEach((l) => {
      const isSelected = currentLandmark.id === l.id;
      const dotColor = l.category === 'vedic' ? '#f59e0b' : l.category === 'scientific' ? '#06b6d4' : '#10b981';
      const labelText = language === 'or' ? l.nameOr.split('(')[0].trim() : l.nameEn.split('(')[0].trim();

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
            <div style="
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 3px 8px;
              border-radius: 9px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              background: ${isSelected ? 'rgba(245, 158, 11, 0.96)' : 'rgba(2, 6, 23, 0.90)'};
              color: ${isSelected ? '#020617' : '#ffffff'};
              border: 1.5px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'};
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
            ">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${dotColor}; display: inline-block;"></span>
              <span>${labelText}</span>
            </div>
            <div style="
              width: 6px;
              height: 6px;
              transform: rotate(45deg);
              margin-top: -3px;
              background: ${isSelected ? '#f59e0b' : '#020617'};
              border-right: 1.5px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'};
              border-bottom: 1.5px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'};
            "></div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 36]
      });

      const marker = L.marker([l.lat, l.lon], { icon: customIcon }).addTo(markersLayerRef.current!);
      marker.on('click', () => {
        handleSelectLandmark(l);
      });
    });
  }, [language, currentLandmark, displayMode, showPins, L]);

  const handleSelectLandmark = (l: LandmarkPoint) => {
    setCurrentLandmark(l);
    setSelectedHotspot(l);
    setActiveSearchLocation(`${l.lat},${l.lon}`);
    setMapCenter({ lat: l.lat, lon: l.lon });
    setCurrentMapZoom(l.zoom);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([l.lat, l.lon], l.zoom, {
        duration: 1.8,
        easeLinearity: 0.25
      });
    }
    if (controlsRef.current) {
      controlsRef.current.flyTo(l.lat, l.lon);
    }
  };

  const handleRouteCalculated = (route: RouteResult) => {
    setActiveRoute(route);
    if (!leafletMapRef.current || !routeLayerRef.current || !L) return;

    routeLayerRef.current.clearLayers();

    if (route.coordinates && route.coordinates.length > 1) {
      // 1. Draw Alternate Route if available (Grey dashed line)
      if (route.alternateCoordinates && route.alternateCoordinates.length > 1) {
        const altPolyline = L.polyline(route.alternateCoordinates, {
          color: '#64748b',
          weight: 4,
          opacity: 0.65,
          dashArray: '6, 8',
          lineCap: 'round'
        });
        routeLayerRef.current.addLayer(altPolyline);
      }

      // 2. Glowing outer border polyline
      const glowPolyline = L.polyline(route.coordinates, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routeLayerRef.current.addLayer(glowPolyline);

      // 3. High-contrast inner neon polyline
      const neonPolyline = L.polyline(route.coordinates, {
        color: '#38bdf8',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routeLayerRef.current.addLayer(neonPolyline);

      // 4. Start Pin with Google Maps-Style pulsating "START ▶️" badge
      const startCoord = route.coordinates[0];
      const startIcon = L.divIcon({
        className: 'route-start-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 5px; background: #052e16; color: #4ade80; border: 2px solid #22c55e; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 900; box-shadow: 0 4px 16px rgba(34, 197, 94, 0.6); white-space: nowrap;">
              <span style="background: #22c55e; color: #052e16; padding: 1.5px 6px; border-radius: 10px; font-size: 10px; font-weight: 900;">▶ START</span>
              <span>${language === 'or' ? 'ଆରମ୍ଭ' : language === 'hi' ? 'प्रारंभ' : 'Start'}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #22c55e; margin-top: -1px;"></div>
          </div>
        `,
        iconSize: [120, 42],
        iconAnchor: [60, 42]
      });
      const startMarker = L.marker(startCoord, { icon: startIcon });
      startMarker.on('click', () => {
        handleStartLiveNavigation(route, false);
      });
      routeLayerRef.current.addLayer(startMarker);

      // 5. Destination Pin (Destination: Saffron Flag Badge)
      const endCoord = route.coordinates[route.coordinates.length - 1];
      const endIcon = L.divIcon({
        className: 'route-end-pin',
        html: `
          <div style="display: flex; align-items: center; gap: 4px; transform: translate(-50%, -100%); background: #451a03; color: #fbbf24; border: 1.5px solid #f59e0b; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.6); white-space: nowrap;">
            <span>🚩</span>
            <span>${language === 'or' ? 'ଗନ୍ତବ୍ୟ' : language === 'hi' ? 'गंतव्य' : 'Destination'}</span>
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 28]
      });
      const endMarker = L.marker(endCoord, { icon: endIcon });
      routeLayerRef.current.addLayer(endMarker);

      // 6. Fit bounds with smooth padding
      leafletMapRef.current.fitBounds(neonPolyline.getBounds(), {
        padding: [70, 70],
        maxZoom: 16
      });
    }
  };

  // Launch In-App Live Turn-by-Turn GPS or Simulated Navigation
  const handleStartLiveNavigation = (route: RouteResult, isSimulated: boolean) => {
    setActiveRoute(route);
    setIsSimulatedNavigation(isSimulated);
    setIsNavigating(true);
    setShowRouteNavigator(false);

    if (!leafletMapRef.current || !L) return;

    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 250);

    // Zoom and center on vehicle start position at street level (Zoom 17x)
    const startCoord = route.coordinates[0];
    if (startCoord) {
      leafletMapRef.current.flyTo([startCoord[0], startCoord[1]], 17, {
        duration: 1.6,
        easeLinearity: 0.25
      });
    }
  };

  // Update Dynamic Driver Marker and Camera Follow-Me
  const handleVehiclePositionUpdate = (pos: { lat: number; lon: number; heading: number }) => {
    if (!leafletMapRef.current || !routeLayerRef.current || !L) return;

    if (!vehicleMarkerRef.current) {
      const vehicleIcon = L.divIcon({
        className: 'live-vehicle-marker',
        html: `
          <div id="vehicle-cursor-wrapper" style="transform: rotate(${pos.heading}deg); transform-origin: center; transition: transform 0.2s linear;">
            <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
              <!-- Navigation Directional Radar Cone Beam -->
              <div style="position: absolute; top: -14px; width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-bottom: 24px solid rgba(56, 189, 248, 0.45); filter: blur(1px);"></div>
              <!-- Pulsing GPS Radar Ring -->
              <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(56, 189, 248, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <!-- Driver Core Blue Orb -->
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #0284c7; border: 3.5px solid #ffffff; box-shadow: 0 0 16px #38bdf8; display: flex; align-items: center; justify-content: center; z-index: 2;">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      const marker = L.marker([pos.lat, pos.lon], { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(routeLayerRef.current);
      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLatLng([pos.lat, pos.lon]);
      const el = document.getElementById('vehicle-cursor-wrapper');
      if (el) {
        el.style.transform = `rotate(${pos.heading}deg)`;
      }
    }

    // Follow vehicle smoothly
    leafletMapRef.current.panTo([pos.lat, pos.lon], { animate: true, duration: 0.35 });
  };

  // Close Live Navigation Cockpit and Restore Map Overview
  const handleCloseLiveNavigation = () => {
    setIsNavigating(false);
    if (vehicleMarkerRef.current && routeLayerRef.current) {
      routeLayerRef.current.removeLayer(vehicleMarkerRef.current);
      vehicleMarkerRef.current = null;
    }

    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 250);

    if (activeRoute && leafletMapRef.current && L && activeRoute.coordinates.length > 1) {
      const poly = L.polyline(activeRoute.coordinates);
      leafletMapRef.current.fitBounds(poly.getBounds(), { padding: [70, 70] });
    }
  };

  // Debounced search autocomplete for global search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (customSearchQuery && customSearchQuery.length >= 2) {
        setIsSearchingSuggestions(true);
        const results = await searchGlobalLocations(customSearchQuery, language);
        setSearchSuggestions(results);
        setIsSearchingSuggestions(false);
        setShowSearchDropdown(true);
      } else {
        setSearchSuggestions([]);
        setShowSearchDropdown(false);
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [customSearchQuery, language]);

  const handleSelectSearchResult = async (item: GeoSearchResult) => {
    const telemetry = await fetchLocationTelemetry(item.lat, item.lon);
    const elev = telemetry?.elevationM || 0;
    const newPoint: LandmarkPoint = {
      id: item.id,
      nameOr: item.name,
      nameEn: item.name,
      lat: item.lat,
      lon: item.lon,
      zoom: 17,
      elevationM: elev,
      category: 'geographic',
      descriptionOr: `ସନ୍ଧାନ ଠିକଣା: ${item.fullName}${telemetry ? ` | ତାପମାତ୍ରା: ${telemetry.temperatureC}°C, ${telemetry.conditionOr}` : ''}`,
      descriptionEn: `Live Geocoded Search Result: ${item.fullName}${telemetry ? ` | Temp: ${telemetry.temperatureC}°C, ${telemetry.conditionEn}` : ''}`,
      facts: [
        `Lat: ${item.lat.toFixed(4)}° N`,
        `Lon: ${item.lon.toFixed(4)}° E`,
        `Elevation: ${elev > 0 ? `+${elev}m` : `${elev}m`}`,
        telemetry ? `Weather: ${telemetry.temperatureC}°C ${telemetry.icon}` : '100% Real Satellite Imagery'
      ]
    };
    handleSelectLandmark(newPoint);
    setShowSearchDropdown(false);
    setCustomSearchQuery(item.name);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSearchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchFeedback(null);

    // 1. Check local verified landmarks first
    const lower = query.toLowerCase();
    const localMatch = REAL_LANDMARKS.find(
      l => l.nameEn.toLowerCase().includes(lower) || l.nameOr.toLowerCase().includes(lower) || l.id.toLowerCase().includes(lower)
    );

    if (localMatch) {
      handleSelectLandmark(localMatch);
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }

    // 2. Dual-Engine Real Live Geocoding for ANY place on Earth
    try {
      const results = await searchGlobalLocations(query, language);
      if (results && results.length > 0) {
        const item = results[0];
        await handleSelectSearchResult(item);
      } else {
        setSearchFeedback(language === 'or' ? 'ସ୍ଥାନ ମିଳିଲା ନାହିଁ। ଦୟାକରି ସଠିକ୍ ନାମ ଲେଖନ୍ତୁ।' : 'Place not found. Please verify spelling.');
      }
    } catch {
      setSearchFeedback(language === 'or' ? 'ସନ୍ଧାନ ସମୟରେ ତ୍ରୁଟି ହେଲା।' : 'Network error during search.');
    } finally {
      setIsSearching(false);
    }
  };

  const officialGoogleEarthWebUrl = `https://earth.google.com/web/@${currentLandmark.lat},${currentLandmark.lon},${currentLandmark.elevationM + 250}a,1200d,35y,0h,45t,0r`;

  // Active body physical specs
  const activeSpecs = PLANET_PHYSICAL_DATA[activeBody] || PLANET_PHYSICAL_DATA.Earth;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-cosmic-950/90 border-2 border-cosmic-gold/40 p-4 sm:p-6 rounded-3xl backdrop-blur-2xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
              <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 via-cosmic-gold to-yellow-200 bg-clip-text text-transparent font-serif">
              {language === 'or' ? '୧୦୦% ପ୍ରକୃତ ଗୁଗୁଲ୍ ଆର୍ଥ୍ ଓ ସାଟେଲାଇଟ୍ ଏକ୍ସପ୍ଲୋରର୍' : '100% Real Google Earth Satellite & Geographic Explorer'}
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'or'
              ? 'ପ୍ରତ୍ୟକ୍ଷ ଗୁଗୁଲ୍ ଆର୍ଥ୍ ସାଟେଲାଇଟ୍ ଫଟୋଚିତ୍ର (ପୁରୀ ଶ୍ରୀମନ୍ଦିର, କୋଣାର୍କ, ଉଜ୍ଜୟିନୀ, ଏଭରେଷ୍ଟ), ପ୍ରକୃତ ଭୌଗୋଳିକ ଡାଟା ଓ ୩D ବିଜ୍ଞାନ'
              : 'Direct Google Earth Orbital Satellite Imagery (Puri Jagannath, Konark, Ujjain, Everest), Real Geographic Telemetry & 3D Science'}
          </p>
        </div>

        {/* 4 Primary Navigation View Modes */}
        <div className="flex flex-wrap items-center gap-2 bg-cosmic-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setDisplayMode('google_earth')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              displayMode === 'google_earth'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white shadow-lg shadow-cyan-500/30'
                : 'bg-cosmic-950/70 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🛰️ ଅସଲି ଗୁଗୁଲ୍ ଆର୍ଥ୍' : '🛰️ Real Google Earth'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('3d_globe')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              displayMode === '3d_globe'
                ? 'bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 border-white shadow-lg'
                : 'bg-cosmic-950/70 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🌐 ୩D ମହାଜାଗତିକ ଗୋଲକ' : '🌐 3D NASA Globe'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('interior')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              displayMode === 'interior'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-white shadow-lg'
                : 'bg-cosmic-950/70 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '🏛️ ଭୂଗର୍ଭ ସ୍ତର' : '🏛️ Earth Interior'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('atmosphere')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              displayMode === 'atmosphere'
                ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-white shadow-lg'
                : 'bg-cosmic-950/70 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'or' ? '☁️ ବାୟୁମଣ୍ଡଳ' : '☁️ Atmosphere'}</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: 100% REAL GOOGLE EARTH SATELLITE LIVE STREAM */}
      {displayMode === 'google_earth' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Real Google Earth Controls Toolbar */}
          <div className="bg-cosmic-950/90 border border-cosmic-gold/30 p-4 rounded-3xl backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Custom Search Form: Search ANY place on Earth */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-lg">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) setShowSearchDropdown(true);
                    }}
                    placeholder={
                      language === 'or'
                        ? 'ପୃଥିବୀର ଯେକୌଣସି ସହର, ମନ୍ଦିର ବା ସ୍ଥାନ ଖୋଜନ୍ତୁ (ଯଥା: Puri, Konark, Bhubaneswar, Kedarnath, New York)...'
                        : 'Search any city, temple, or landmark on Earth (e.g. Puri, Konark, Mount Everest, Paris)...'
                    }
                    className="w-full pl-9 pr-8 py-2 bg-cosmic-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {isSearchingSuggestions && (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
                  )}

                  {/* Live Search Autocomplete Dropdown */}
                  {showSearchDropdown && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-cosmic-950 border border-cyan-500/50 rounded-2xl shadow-2xl z-[1050] max-h-56 overflow-y-auto no-scrollbar backdrop-blur-2xl divide-y divide-slate-800">
                      {searchSuggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item)}
                          className="w-full text-left p-2.5 hover:bg-cyan-950/50 text-xs transition-colors cursor-pointer flex items-start gap-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-100 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">{item.fullName}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:shadow-lg shadow-cyan-500/25 whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{language === 'or' ? 'ଖୋଜନ୍ତୁ' : 'Search'}</span>
                </button>
              </form>

              {/* Layer Style Switchers */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <div className="flex items-center bg-cosmic-900 border border-slate-800 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setSatelliteLayer('h')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      satelliteLayer === 'h' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google Satellite Hybrid (Satellite with high-res place and street names)"
                  >
                    {language === 'or' ? '🗺️ ହାଇବ୍ରିଡ୍' : '🗺️ Hybrid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatelliteLayer('s')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      satelliteLayer === 's' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google Pure Satellite (No labels)"
                  >
                    {language === 'or' ? '🛰️ ସାଟେଲାଇଟ୍' : '🛰️ Satellite'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatelliteLayer('esri')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      satelliteLayer === 'esri' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Esri Maxar 30cm Resolution (Professional GIS Satellite)"
                  >
                    {language === 'or' ? '📷 Esri 30cm' : '📷 Esri 30cm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatelliteLayer('p')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      satelliteLayer === 'p' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google Terrain Relief"
                  >
                    {language === 'or' ? '⛰️ ଭୂଭାଗ' : '⛰️ Terrain'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSatelliteLayer('m')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      satelliteLayer === 'm' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Google Roadmap Streets"
                  >
                    {language === 'or' ? '🛣️ ରାସ୍ତା' : '🛣️ Streets'}
                  </button>
                </div>

                {/* Pins Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showPins ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-cosmic-900 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle Landmark Pins"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{showPins ? (language === 'or' ? 'ପିନ୍: ON' : 'Pins: ON') : (language === 'or' ? 'ପିନ୍: OFF' : 'Pins: OFF')}</span>
                </button>

                {/* 100% Real Pilgrimage Route & Navigation Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowRouteNavigator(!showRouteNavigator)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                    showRouteNavigator
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-white shadow-sky-500/30 ring-2 ring-sky-300 scale-105'
                      : 'bg-cosmic-900 text-sky-300 border-sky-500/50 hover:bg-sky-950/60 hover:text-white'
                  }`}
                  title="Pilgrimage Route Finder & 100% Real Live Google Navigation"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'or' ? '🚗 ତୀର୍ଥଯାତ୍ରା ନେଭିଗେସନ୍' : '🚗 Route & GPS'}</span>
                </button>

                {/* Official Google Earth 3D Web External Link */}
                <a
                  href={officialGoogleEarthWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-cosmic-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow hover:shadow-emerald-500/25 transition-all"
                >
                  <span>Google Earth 3D</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Category Tabs & Quick Landmark Presets Pills */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-wider whitespace-nowrap mr-1">
                    {language === 'or' ? 'ଶ୍ରେଣୀ:' : 'Category:'}
                  </span>
                  {[
                    { id: 'odisha', label: '🏛️ ଓଡ଼ିଶାର ଧାମ ଓ ସ୍ଥଳ', en: '🏛️ Odisha Heritage' },
                    { id: 'india', label: '🇮🇳 ଭାରତ ଓ ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ', en: '🇮🇳 India & Astronomy' },
                    { id: 'world', label: '🌐 ବିଶ୍ୱ ଆଶ୍ଚର୍ଯ୍ୟ', en: '🌐 World Landmarks' },
                    { id: 'all', label: 'ସମସ୍ତ', en: 'All' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGoogleEarthCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${
                        googleEarthCategory === cat.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                          : 'bg-cosmic-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {language === 'or' ? cat.label : cat.en}
                    </button>
                  ))}
                </div>

                {searchFeedback && (
                  <span className="text-[11px] text-rose-400 font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                    {searchFeedback}
                  </span>
                )}
              </div>

              {/* Quick Landmark Presets Pills with Complete Scrolling System */}
              <div className="relative flex items-center bg-cosmic-950/70 border border-slate-800/80 rounded-2xl p-1 gap-1 group/landmarks">
                {/* Scroll Left Button */}
                <button
                  type="button"
                  onClick={() => handleScrollLandmarks('left')}
                  disabled={!canScrollLandmarksLeft}
                  className={`flex-shrink-0 p-1.5 rounded-xl transition-all border flex items-center justify-center ${
                    canScrollLandmarksLeft
                      ? 'bg-cosmic-900/90 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95'
                      : 'opacity-20 text-slate-600 border-transparent cursor-not-allowed pointer-events-none'
                  }`}
                  title={language === 'or' ? 'ବାମକୁ ସ୍କ୍ରୋଲ କରନ୍ତୁ' : language === 'hi' ? 'बाएं स्क्रॉल करें' : 'Scroll Left'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Scrollable Track with Drag, Wheel, Touch and Auto-scroll */}
                <div
                  ref={landmarksScrollRef}
                  onScroll={updateLandmarksScrollStatus}
                  onMouseDown={handleLandmarksMouseDown}
                  onMouseMove={handleLandmarksMouseMove}
                  onMouseUp={handleLandmarksMouseUp}
                  onMouseLeave={handleLandmarksMouseUp}
                  onWheel={handleLandmarksWheel}
                  className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none py-0.5 cursor-grab active:cursor-grabbing scroll-smooth"
                >
                  {REAL_LANDMARKS.filter(l => {
                    if (l.body && l.body !== 'Earth') return false;
                    if (googleEarthCategory === 'all') return true;
                    if (googleEarthCategory === 'odisha') {
                      return [
                        'puri',
                        'konark',
                        'bhubaneswar_lingaraj',
                        'dhauli_shanti_stupa',
                        'cuttack_barabati',
                        'chilika_lake',
                        'deomali_koraput',
                        'hirakud_dam',
                        'samaleswari_temple',
                        'taratarini_temple'
                      ].includes(l.id);
                    }
                    if (googleEarthCategory === 'india') {
                      return [
                        'ujjain',
                        'varanasi_kashi',
                        'delhi',
                        'sriharikota',
                        'kedarnath_temple',
                        'somnath_temple',
                        'rameshwaram_temple',
                        'tirupati_balaji',
                        'everest'
                      ].includes(l.id);
                    }
                    if (googleEarthCategory === 'world') {
                      return ['greenwich', 'nasa_ksc', 'mariana'].includes(l.id);
                    }
                    return true;
                  }).map((l) => (
                    <button
                      key={l.id}
                      data-landmark={l.id}
                      type="button"
                      onClick={() => handleSelectLandmark(l)}
                      className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                        currentLandmark.id === l.id
                          ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow shadow-cyan-500/20 ring-1 ring-cyan-400/50 scale-[1.02]'
                          : 'bg-cosmic-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span>{language === 'or' ? l.nameOr : l.nameEn}</span>
                    </button>
                  ))}
                </div>

                {/* Scroll Right Button */}
                <button
                  type="button"
                  onClick={() => handleScrollLandmarks('right')}
                  disabled={!canScrollLandmarksRight}
                  className={`flex-shrink-0 p-1.5 rounded-xl transition-all border flex items-center justify-center ${
                    canScrollLandmarksRight
                      ? 'bg-cosmic-900/90 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95'
                      : 'opacity-20 text-slate-600 border-transparent cursor-not-allowed pointer-events-none'
                  }`}
                  title={language === 'or' ? 'ଡାହାଣକୁ ସ୍କ୍ରୋଲ କରନ୍ତୁ' : language === 'hi' ? 'दाएं स्क्रॉल करें' : 'Scroll Right'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Real Google Earth Interactive Native Satellite Viewport */}
          <div
            className={`transition-all duration-300 ${
              isNavigating
                ? 'fixed inset-0 z-[2000] w-screen h-screen rounded-none border-none bg-slate-950'
                : 'relative w-full h-[62vh] min-h-[520px] sm:h-[680px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-900 group'
            }`}
          >
            {/* Native Leaflet Map Container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" style={{ background: '#1e293b' }} />

            {/* Full-Screen In-App Turn-by-Turn Live Navigation Cockpit */}
            {isNavigating && activeRoute && (
              <LiveNavigationCockpit
                route={activeRoute}
                isSimulated={isSimulatedNavigation}
                onVehiclePositionUpdate={handleVehiclePositionUpdate}
                onClose={handleCloseLiveNavigation}
              />
            )}

            {/* Interactive Drop Pin on Map Active Top Banner */}
            {pickingMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1002] bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
                <Crosshair className="w-4 h-4 text-slate-950 animate-spin" />
                <span>
                  {language === 'or'
                    ? `ମ୍ୟାପ୍ ଉପରେ ଯେକୌଣସି ସ୍ଥାନରେ କ୍ଲିକ୍ କରି ${pickingMode === 'origin' ? 'ଆରମ୍ଭ' : 'ଗନ୍ତବ୍ୟ'} ପିନ୍ ବସାନ୍ତୁ`
                    : language === 'hi'
                    ? `मैप पर कहीं भी क्लिक करके ${pickingMode === 'origin' ? 'प्रारंभ' : 'गंतव्य'} पिन लगाएं`
                    : `Click anywhere on map to drop ${pickingMode === 'origin' ? 'Origin' : 'Destination'} pin`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPickingMode(null);
                    setShowRouteNavigator(true);
                  }}
                  className="ml-2 px-2 py-0.5 rounded-lg bg-slate-950 text-white text-[10px] cursor-pointer"
                >
                  ✕ {language === 'or' ? 'ବାତିଲ୍' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            )}

            {/* Floating Pilgrimage Route Navigator HUD Panel */}
            {showRouteNavigator && !isNavigating && !pickingMode && (
              <div className="absolute inset-x-2 top-2 sm:inset-x-auto sm:top-4 sm:right-16 z-[1001] max-w-sm sm:max-w-md w-auto sm:w-full max-h-[92%] overflow-y-auto no-scrollbar shadow-2xl">
                <PilgrimageRouteNavigator
                  onRouteCalculated={handleRouteCalculated}
                  onStartLiveNavigation={handleStartLiveNavigation}
                  onStartPickOnMap={(target) => {
                    setPickingMode(target);
                  }}
                  pickedMapPoint={pickedMapPoint}
                  onClose={() => setShowRouteNavigator(false)}
                />
              </div>
            )}

            {/* Active Route Floating Telemetry Pill */}
            {activeRoute && !showRouteNavigator && !isNavigating && (
              <div className="absolute top-16 left-4 bg-cosmic-950/95 border-2 border-sky-500/60 px-4 py-2 rounded-2xl text-xs backdrop-blur-2xl shadow-2xl flex items-center gap-3 z-[1000] animate-in fade-in">
                <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
                <div>
                  <span className="font-bold text-white block font-mono">
                    {activeRoute.distanceKm} km • {language === 'or' ? (activeRoute.formattedDurationOr || `${activeRoute.durationMinutes}m`) : language === 'hi' ? (activeRoute.formattedDurationHi || `${activeRoute.durationMinutes}m`) : (activeRoute.formattedDurationEn || `${activeRoute.durationMinutes}m`)}
                  </span>
                  <span className="text-[10px] text-sky-300">
                    {activeRoute.routeTitleOr ? `${language === 'or' ? activeRoute.routeTitleOr : language === 'hi' ? (activeRoute.routeTitleHi || activeRoute.routeTitleEn) : activeRoute.routeTitleEn} • ` : ''}
                    {language === 'or' ? activeRoute.compassDirectionOr : language === 'hi' ? (activeRoute.compassDirectionHi || activeRoute.compassDirectionEn) : activeRoute.compassDirectionEn}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartLiveNavigation(activeRoute, false)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-lg transition-all animate-pulse flex items-center gap-1 border border-white"
                  title="Launch In-App Live Turn-by-Turn Navigation"
                >
                  <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{language === 'or' ? '🚀 START ନେଭିଗେସନ୍' : language === 'hi' ? '🚀 नेविगेशन शुरू करें' : 'START NAV'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRouteNavigator(true)}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-[10px] cursor-pointer shadow transition-all"
                >
                  {language === 'or' ? 'ଦେଖନ୍ତୁ' : language === 'hi' ? 'विवरण' : 'Details'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    routeLayerRef.current?.clearLayers();
                    setActiveRoute(null);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Clear Route"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Live GPS Coordinates & Real Resolution Telemetry HUD (Top Left) */}
            {!isNavigating && (
              <div className="absolute top-4 left-4 bg-cosmic-950/95 border border-cyan-500/40 px-3.5 py-2 rounded-2xl text-xs backdrop-blur-md shadow-2xl space-y-1 pointer-events-none z-[1000]">
                <div className="flex items-center gap-2 font-mono text-cyan-300 font-bold text-xs">
                  <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>
                  {language === 'or' ? 'ଅକ୍ଷାଂଶ:' : language === 'hi' ? 'अक्षांश:' : 'Lat:'} {mapCenter.lat}° N • {language === 'or' ? 'ଦ୍ରାଘିମା:' : language === 'hi' ? 'देशांतर:' : 'Lon:'} {mapCenter.lon}° E
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {currentMapZoom >= 19
                    ? (language === 'or' ? 'ଜୁମ୍: ୧୯x • ଉପ-ମିଟର ରେଜୋଲ୍ୟୁସନ୍: ~୦.୩ ମି./ପିକ୍ସେଲ (ଭବନ ଓ ମନ୍ଦିର ଚୂଳ)' : language === 'hi' ? 'ज़ूम: 19x • उप-मीटर: ~0.3 मी./पिक्सेल (भवन व शिखर स्तर)' : 'Zoom: 19x • Sub-meter: ~0.3 m/px (Building Level)')
                    : currentMapZoom >= 17
                    ? (language === 'or' ? 'ଜୁମ୍: ୧୭x • ଅଲ୍ଟ୍ରା HD ରେଜୋଲ୍ୟୁସନ୍: ~୧.୨ ମି./ପିକ୍ସେଲ (ରାସ୍ତା ଓ ଗାଁ)' : language === 'hi' ? 'ज़ूम: 17x • अल्ट्रा HD: ~1.2 मी./पिक्सेल (सड़क व ग्राम स्तर)' : 'Zoom: 17x • Ultra-HD: ~1.2 m/px (Street Level)')
                    : currentMapZoom >= 14
                    ? (language === 'or' ? 'ଜୁମ୍: ୧୪x • ହାଇ-ରେଜୋଲ୍ୟୁସନ୍: ~୯.୫ ମି./ପିକ୍ସେଲ (ସହର)' : language === 'hi' ? 'ज़ूम: 14x • हाई रेज़ोल्यूशन: ~9.5 मी./पिक्सेल (शहर स्तर)' : 'Zoom: 14x • High Res: ~9.5 m/px (Town Level)')
                    : currentMapZoom >= 10
                    ? (language === 'or' ? 'ଜୁମ୍: ୧୦x • ଆଞ୍ଚଳିକ ରେଜୋଲ୍ୟୁସନ୍: ~୧୫୦ ମି./ପିକ୍ସେଲ (ଜିଲ୍ଲା ଓ ହ୍ରଦ)' : language === 'hi' ? 'ज़ूम: 10x • क्षेत्रीय रेज़ोल्यूशन: ~150 मी./पिक्सेल' : 'Zoom: 10x • Regional: ~150 m/px')
                    : (language === 'or' ? `ଜୁମ୍: ${currentMapZoom}x • ମହାକାଶ କକ୍ଷପଥ ଦୃଶ୍ୟ` : language === 'hi' ? `ज़ूम: ${currentMapZoom}x • महाद्वीपीय दृश्य` : `Zoom: ${currentMapZoom}x • Continental View`)}
                </span>
              </div>
            </div>
          )}

            {/* Static Overlays - Only displayed when not in active turn-by-turn navigation */}
            {!isNavigating && (
              <>
                {/* Floating Navigation Controls (Top Right) */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-[1000]">
                  <button
                    type="button"
                    onClick={() => leafletMapRef.current?.zoomIn()}
                    className="p-2 rounded-xl bg-cosmic-950/90 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400 backdrop-blur-md shadow-xl cursor-pointer"
                    title="Zoom In (Sub-meter)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => leafletMapRef.current?.zoomOut()}
                    className="p-2 rounded-xl bg-cosmic-950/90 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400 backdrop-blur-md shadow-xl cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (leafletMapRef.current) {
                        leafletMapRef.current.flyTo([currentLandmark.lat, currentLandmark.lon], currentLandmark.zoom || 18, { duration: 1.5 });
                      }
                    }}
                    className="p-2 rounded-xl bg-cosmic-950/90 border border-slate-700 text-slate-200 hover:text-white hover:border-amber-400 backdrop-blur-md shadow-xl cursor-pointer"
                    title="Reset to Landmark"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Docked Geographic Telemetry Badge (Bottom Left) */}
                {!showRouteNavigator && (
                  <div className="absolute bottom-4 left-4 max-w-sm sm:max-w-md bg-cosmic-950/95 border-2 border-cosmic-gold/60 p-4 rounded-3xl text-xs backdrop-blur-2xl shadow-2xl space-y-2 pointer-events-auto z-[1000]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
                      <span>{language === 'or' ? currentLandmark.nameOr : language === 'hi' ? ((currentLandmark as any).nameHi || currentLandmark.nameEn) : currentLandmark.nameEn}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cosmic-gold">
                      {currentLandmark.elevationM > 0 ? `+${currentLandmark.elevationM}m` : `${currentLandmark.elevationM}m`}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {language === 'or' ? currentLandmark.descriptionOr : language === 'hi' ? ((currentLandmark as any).descriptionHi || currentLandmark.descriptionEn) : currentLandmark.descriptionEn}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                    {currentLandmark.facts.map((f, i) => (
                      <div key={i} className="bg-cosmic-900 px-2 py-1 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Bottom Right Fullscreen / Official 3D Link */}
                <div className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2">
                  <a
                    href={officialGoogleEarthWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xl hover:shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <span>Google Earth 3D</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: 3D NASA PLANETARY SPHERE (Clean, accurate continents, NO polka dots!) */}
      {displayMode === '3d_globe' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Planet Switcher & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-cosmic-950/90 border border-cosmic-gold/30 p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'Earth', label: '🌍 Earth', or: 'ପୃଥିବୀ' },
                { id: 'Moon', label: '🌙 Moon', or: 'ଚନ୍ଦ୍ର' },
                { id: 'Mars', label: '♂ Mars', or: 'ମଙ୍ଗଳ' },
                { id: 'Jupiter', label: '♃ Jupiter', or: 'ବୃହସ୍ପତି' },
                { id: 'Saturn', label: '♄ Saturn', or: 'ଶନି' },
                { id: 'Sun', label: '☀️ Sun', or: 'ସୂର୍ଯ୍ୟ' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveBody(item.id as any);
                    controlsRef.current?.reset();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeBody === item.id
                      ? 'bg-gradient-to-r from-cosmic-gold to-amber-500 text-cosmic-950 border-white shadow-lg shadow-amber-500/25'
                      : 'bg-cosmic-950/70 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{language === 'or' ? item.or : item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRotating(!isRotating)}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isRotating ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
                title={isRotating ? 'Pause Rotation' : 'Start Auto-Rotation'}
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                  showGrid ? 'bg-sky-600 text-white border-sky-400' : 'bg-cosmic-950/80 text-slate-400 border-slate-800'
                }`}
              >
                Grid: {showGrid ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`px-2.5 py-1 text-xs rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showLabels ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-cosmic-950/80 text-slate-400 border-slate-800'
                }`}
                title="Toggle Place Names (ସ୍ଥାନ ନାମ)"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{language === 'or' ? 'ସ୍ଥାନ ନାମ: ' : 'Labels: '}{showLabels ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => controlsRef.current?.zoom(0.85)}
                className="p-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => controlsRef.current?.zoom(1.18)}
                className="p-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => controlsRef.current?.reset()}
                className="p-1.5 rounded-xl bg-cosmic-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Planetary Landmark Hotspots Quick-Fly Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-mono text-cosmic-gold uppercase tracking-wider shrink-0 pl-1">
              {language === 'or' ? 'ପ୍ରମୁଖ ସ୍ଥାନ (Fly To):' : 'Key Hotspots:'}
            </span>
            {REAL_LANDMARKS.filter(l => (l.body || 'Earth') === activeBody).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => handleSelectLandmark(l)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  currentLandmark.id === l.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-cosmic-900/70 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <MapPin className={`w-3 h-3 ${currentLandmark.id === l.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{language === 'or' ? l.nameOr.split('(')[0].trim() : l.nameEn.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* 3D Canvas Viewport */}
          <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#010409] via-[#050b18] to-[#02040a] border-2 border-cosmic-gold/40 shadow-2xl backdrop-blur-2xl select-none group">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            <canvas
              ref={labelCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* NASA High-Res Badge */}
            <div className="absolute top-4 left-4 bg-cosmic-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-300 backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% NASA Satellite 4K Photography • True Axial Tilt</span>
            </div>

            {/* Dynamic Zoom Level of Detail (LOD) Indicator */}
            <div className="absolute top-4 right-4 bg-cosmic-950/90 border border-cyan-500/40 px-3.5 py-1.5 rounded-2xl text-[11px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-2 pointer-events-none shadow-xl">
              <span className={`w-2 h-2 rounded-full ${currentLODTier === 3 ? 'bg-amber-400 animate-ping' : currentLODTier === 2 ? 'bg-cyan-400 animate-pulse' : 'bg-blue-400'}`} />
              <span>
                {currentLODTier === 1
                  ? (language === 'or' ? '🔭 ମହାକାଶ କକ୍ଷପଥ (LOD 1: ମହାଦେଶ ଓ ସାଗର)' : '🔭 Deep Orbit (LOD 1: Continents & Oceans)')
                  : currentLODTier === 2
                  ? (language === 'or' ? '🛰️ ଆଞ୍ଚଳିକ ସ୍ତର (LOD 2: ହିମାଳୟ, ଉପକୂଳ ଓ ଦେଶ)' : '🛰️ Regional View (LOD 2: Seas & Mountains)')
                  : (language === 'or' ? '🔬 ଅଲ୍ଟ୍ରା HD ମାଇକ୍ରୋ (LOD 3: ସହର, ମନ୍ଦିର ଓ ସ୍ଥଳ)' : '🔬 Ultra HD Micro (LOD 3: Towns & Temples)')}
              </span>
            </div>

            {/* Micro Zoom Info Hint */}
            <div className="absolute bottom-4 right-4 bg-cosmic-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none hidden sm:flex items-center gap-2">
              <ZoomIn className="w-3 h-3 text-cyan-400" />
              <span>{language === 'or' ? 'ଅଧିକ ଜୁମ୍ କଲେ ଛୋଟ ଛୋଟ ସହର, ମନ୍ଦିର ଓ ସ୍ଥଳର ନାମ ଦୃଶ୍ୟମାନ ହେବ' : 'Zoom in closer to reveal micro-towns & sacred temples'}</span>
            </div>

            {/* Selected Landmark Science Card (Docked Bottom Left) */}
            {selectedHotspot && (
              <div className="absolute bottom-4 left-4 max-w-sm sm:max-w-md bg-cosmic-950/95 border-2 border-cosmic-gold/60 p-4 rounded-3xl text-xs backdrop-blur-2xl shadow-2xl space-y-2 pointer-events-auto animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
                    <span>{language === 'or' ? selectedHotspot.nameOr : selectedHotspot.nameEn}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedHotspot(null)}
                    className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-lg bg-slate-800/60 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-[11px] font-mono text-cosmic-gold flex items-center gap-2">
                  <span>Lat: {selectedHotspot.lat}°</span>
                  <span>•</span>
                  <span>Lon: {selectedHotspot.lon}°</span>
                  <span>•</span>
                  <span>Elev: {selectedHotspot.elevationM > 0 ? `+${selectedHotspot.elevationM}m` : `${selectedHotspot.elevationM}m`}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {language === 'or' ? selectedHotspot.descriptionOr : selectedHotspot.descriptionEn}
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                  {selectedHotspot.facts.map((f, i) => (
                    <div key={i} className="bg-cosmic-900 px-2 py-1 rounded-lg text-slate-300 border border-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: EARTH INTERIOR 3D CUTAWAY & GEOPHYSICS DRILL SIMULATOR */}
      {displayMode === 'interior' && (
        <SafeErrorBoundary fallbackTitle="ଭୂଗର୍ଭ ସ୍ତର ୩D ଗବେଷଣାଗାର (Earth Interior 3D View)">
          <EarthInteriorExplorer />
        </SafeErrorBoundary>
      )}

      {/* VIEW MODE 4: ATMOSPHERE LAYERS & REAL NASA PHYSICS SIMULATOR */}
      {displayMode === 'atmosphere' && (
        <SafeErrorBoundary fallbackTitle="ବାୟୁମଣ୍ଡଳ ୩D ଉଡ଼ାଣ ଲାବ୍ (Atmosphere 3D Flight View)">
          <EarthAtmosphereExplorer />
        </SafeErrorBoundary>
      )}

      {/* NASA JPL Verified Planetary Constants Master Table (Dynamically shows activeSpecs) */}
      <div className="bg-cosmic-950/85 border border-cosmic-gold/30 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <h4 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <span>
              {language === 'or'
                ? `${activeSpecs.nameOr} ବାସ୍ତବ ଭୌଗୋଳିକ ଓ ଭୌତିକ ଡାଟା (NASA JPL Standard)`
                : `${activeSpecs.nameEn} Geophysical & Astrophysics Master Matrix (NASA Standards)`}
            </span>
          </h4>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30">
            NASA Horizons Verified Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Diameter / Size:</span>
            <span className="text-sm font-bold text-cyan-300">{activeSpecs.diameter}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Mass:</span>
            <span className="text-sm font-bold text-cosmic-gold">{activeSpecs.mass}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Surface Gravity (g):</span>
            <span className="text-sm font-bold text-emerald-400">{activeSpecs.gravity}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Escape Velocity (v_esc):</span>
            <span className="text-sm font-bold text-sky-400">{activeSpecs.escapeVel}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Orbital Velocity:</span>
            <span className="text-sm font-bold text-amber-300">{activeSpecs.orbitalSpeed}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Axial Obliquity (Tilt):</span>
            <span className="text-sm font-bold text-rose-300">{activeSpecs.axialTilt}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Day Length (Rotation):</span>
            <span className="text-sm font-bold text-violet-300">{activeSpecs.dayLength}</span>
          </div>
          <div className="p-3 rounded-2xl bg-cosmic-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Surface Temperature:</span>
            <span className="text-sm font-bold text-orange-300">{activeSpecs.temperature}</span>
          </div>
        </div>

        {/* Atmospheric Composition Banner */}
        <div className="p-3 rounded-2xl bg-cosmic-900/90 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-slate-400">
            <strong className="text-slate-200">Atmosphere / Chemical Chemistry:</strong> {activeSpecs.atmosphere}
          </div>
        </div>
      </div>
    </div>
  );
};

