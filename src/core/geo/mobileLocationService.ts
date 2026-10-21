import { OdishaCityLocation } from '../panjika/odia_calendar_engine';

export const ALL_30_ODISHA_DISTRICTS: OdishaCityLocation[] = [
  // --- 1. Puri & Central Coastal Odisha ---
  { id: 'puri', nameOr: 'ପୁରୀ (ଶ୍ରୀକ୍ଷେତ୍ର)', nameHi: 'पुरी (श्रीक्षेत्र)', nameEn: 'Puri (Srikshetra)', lat: 19.8135, lon: 85.8312, districtOr: 'ପୁରୀ' },
  { id: 'bhubaneswar', nameOr: 'ଭୁବନେଶ୍ୱର (ଏକାମ୍ର)', nameHi: 'भुवनेश्वर (एकाम्र)', nameEn: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, districtOr: 'ଖୋର୍ଦ୍ଧା' },
  { id: 'cuttack', nameOr: 'କଟକ (ଅଭିନବ ବାରବାଟୀ)', nameHi: 'कटक (बारबाटी)', nameEn: 'Cuttack', lat: 20.4625, lon: 85.8830, districtOr: 'କଟକ' },
  { id: 'konark', nameOr: 'କୋଣାର୍କ (ଅର୍କକ୍ଷେତ୍ର)', nameHi: 'कोणार्क (अर्कक्षेत्र)', nameEn: 'Konark', lat: 19.8876, lon: 86.0945, districtOr: 'ପୁରୀ' },
  { id: 'khordha', nameOr: 'ଖୋର୍ଦ୍ଧା (ବରୁଣେଇ ପୀଠ)', nameHi: 'खोर्धा', nameEn: 'Khordha', lat: 20.1800, lon: 85.6200, districtOr: 'ଖୋର୍ଦ୍ଧା' },
  { id: 'kendrapara', nameOr: 'କେନ୍ଦ୍ରାପଡ଼ା (ତୁଳସୀକ୍ଷେତ୍ର)', nameHi: 'केन्द्रापड़ा', nameEn: 'Kendrapara', lat: 20.5015, lon: 86.4229, districtOr: 'କେନ୍ଦ୍ରାପଡ଼ା' },
  { id: 'jagatsinghpur', nameOr: 'ଜଗତସିଂହପୁର (ପାରାଦୀପ)', nameHi: 'जगतसिंहपुर', nameEn: 'Jagatsinghpur', lat: 20.2644, lon: 86.1717, districtOr: 'ଜଗତସିଂହପୁର' },
  { id: 'jajpur', nameOr: 'ଯାଜପୁର (ବିରଜାକ୍ଷେତ୍ର)', nameHi: 'जाजपुर (बिरजा)', nameEn: 'Jajpur (Biraja)', lat: 20.8523, lon: 86.3385, districtOr: 'ଯାଜପୁର' },
  { id: 'nayagarh', nameOr: 'ନୟାଗଡ଼ (କଣ୍ଟିଲୋ ନୀଳମାଧବ)', nameHi: 'नयागढ़', nameEn: 'Nayagarh', lat: 20.1300, lon: 85.1000, districtOr: 'ନୟାଗଡ଼' },

  // --- 2. Northern Odisha ---
  { id: 'balasore', nameOr: 'ବାଲେଶ୍ୱର (ଚାନ୍ଦିପୁର)', nameHi: 'बालेश्वर', nameEn: 'Balasore', lat: 21.4934, lon: 86.9135, districtOr: 'ବାଲେଶ୍ୱର' },
  { id: 'bhadrak', nameOr: 'ଭଦ୍ରକ (ମା’ ଭଦ୍ରକାଳୀ)', nameHi: 'भद्रक', nameEn: 'Bhadrak', lat: 21.0574, lon: 86.4959, districtOr: 'ଭଦ୍ରକ' },
  { id: 'baripada', nameOr: 'ବାରିପଦା (ମୟୂରଭଞ୍ଜ)', nameHi: 'बारीपदा', nameEn: 'Baripada', lat: 21.9346, lon: 86.7329, districtOr: 'ମୟୂରଭଞ୍ଜ' },
  { id: 'keonjhar', nameOr: 'କେନ୍ଦୁଝର (ଘଟଗାଁ ତାରିଣୀ)', nameHi: 'केंदुझर (घटगांव)', nameEn: 'Keonjhar', lat: 21.6289, lon: 85.5817, districtOr: 'କେନ୍ଦୁଝର' },

  // --- 3. Western Odisha ---
  { id: 'sambalpur', nameOr: 'ସମ୍ବଲପୁର (ମା’ ସମଲେଶ୍ୱରୀ)', nameHi: 'संबलपुर', nameEn: 'Sambalpur', lat: 21.4669, lon: 83.9812, districtOr: 'ସମ୍ବଲପୁର' },
  { id: 'rourkela', nameOr: 'ରାଉରକେଲା (ବେଦବ୍ୟାସ ପୀଠ)', nameHi: 'राउरकेला', nameEn: 'Rourkela', lat: 22.2604, lon: 84.8536, districtOr: 'ସୁନ୍ଦରଗଡ଼' },
  { id: 'sundargarh', nameOr: 'ସୁନ୍ଦରଗଡ଼', nameHi: 'सुंदरगढ़', nameEn: 'Sundargarh', lat: 22.1200, lon: 84.0300, districtOr: 'ସୁନ୍ଦରଗଡ଼' },
  { id: 'bargarh', nameOr: 'ବରଗଡ଼ (ଧନୁଯାତ୍ରା ପୀଠ)', nameHi: 'बरगढ़ (धनुयात्रा)', nameEn: 'Bargarh', lat: 21.3333, lon: 83.6167, districtOr: 'ବରଗଡ଼' },
  { id: 'jharsuguda', nameOr: 'ଝାରସୁଗୁଡ଼ା', nameHi: 'झारसुगुड़ा', nameEn: 'Jharsuguda', lat: 21.8554, lon: 84.0062, districtOr: 'ଝାରସୁଗୁଡ଼ା' },
  { id: 'balangir', nameOr: 'ବଲାଙ୍ଗୀର (ପାଟଣେଶ୍ୱରୀ)', nameHi: 'बलांगिर', nameEn: 'Balangir', lat: 20.7107, lon: 83.4862, districtOr: 'ବଲାଙ୍ଗୀର' },
  { id: 'sonepur', nameOr: 'ସୁବର୍ଣ୍ଣପୁର (ସୋନପୁର)', nameHi: 'सोनपुर', nameEn: 'Subarnapur', lat: 20.8333, lon: 83.9167, districtOr: 'ସୁବର୍ଣ୍ଣପୁର' },
  { id: 'nuapada', nameOr: 'ନୂଆପଡ଼ା (ପାତୋରା ଡ୍ୟାମ୍)', nameHi: 'नुआपड़ा', nameEn: 'Nuapada', lat: 20.8333, lon: 82.5500, districtOr: 'ନୂଆପଡ଼ା' },
  { id: 'kalahandi', nameOr: 'ଭବାନୀପାଟଣା (ମାଣିକେଶ୍ୱରୀ)', nameHi: 'भवानीपटना', nameEn: 'Bhawanipatna (Kalahandi)', lat: 19.9000, lon: 83.1667, districtOr: 'କଳାହାଣ୍ଡି' },
  { id: 'boudh', nameOr: 'ବୌଦ୍ଧ (ରାମନାଥ ପୀଠ)', nameHi: 'बौध', nameEn: 'Boudh', lat: 20.8400, lon: 84.3200, districtOr: 'ବୌଦ୍ଧ' },
  { id: 'deogarh', nameOr: 'ଦେବଗଡ଼ (ପ୍ରଧାନପାଟ)', nameHi: 'देवगढ़', nameEn: 'Deogarh', lat: 21.5300, lon: 84.7300, districtOr: 'ଦେବଗଡ଼' },
  { id: 'angul', nameOr: 'ଅନୁଗୋଳ (ତାଳଚେର)', nameHi: 'अंगुल', nameEn: 'Angul', lat: 20.8406, lon: 85.1017, districtOr: 'ଅନୁଗୋଳ' },
  { id: 'dhenkanal', nameOr: 'ଢେଙ୍କାନାଳ (କପିଳାସ ଚନ୍ଦ୍ରଶେଖର)', nameHi: 'ढेंकानाल (कपिलास)', nameEn: 'Dhenkanal', lat: 20.6667, lon: 85.6000, districtOr: 'ଢେଙ୍କାନାଳ' },

  // --- 4. Southern Odisha ---
  { id: 'berhampur', nameOr: 'ବ୍ରହ୍ମପୁର (ରେଶମ ନଗରୀ)', nameHi: 'ब्रह्मपुर', nameEn: 'Berhampur', lat: 19.3150, lon: 84.7941, districtOr: 'ଗଞ୍ଜାମ' },
  { id: 'paralakhemundi', nameOr: 'ପାରଳାଖେମୁଣ୍ଡି (ମହେନ୍ଦ୍ରଗିରି)', nameHi: 'पारलाखेमुंडी', nameEn: 'Paralakhemundi', lat: 18.7800, lon: 84.0800, districtOr: 'ଗଜପତି' },
  { id: 'koraput', nameOr: 'କୋରାପୁଟ (ଦେଓମାଳୀ ପର୍ବତ)', nameHi: 'कोरापुट', nameEn: 'Koraput', lat: 18.8135, lon: 82.7126, districtOr: 'କୋରାପୁଟ' },
  { id: 'jeypore', nameOr: 'ଜୟପୁର (ଘାଟି ନଗରୀ)', nameHi: 'जयपुर (ओडिशा)', nameEn: 'Jeypore', lat: 18.8500, lon: 82.5667, districtOr: 'କୋରାପୁଟ' },
  { id: 'rayagada', nameOr: 'ରାୟଗଡ଼ା (ମାଝୀଘରିଆଣୀ)', nameHi: 'रायगड़ा', nameEn: 'Rayagada', lat: 19.1667, lon: 83.4167, districtOr: 'ରାୟଗଡ଼ା' },
  { id: 'nabarangpur', nameOr: 'ନବରଙ୍ଗପୁର (ମା’ ଭଣ୍ଡାରଘରଣୀ)', nameHi: 'नवरंगपुर', nameEn: 'Nabarangpur', lat: 19.2333, lon: 82.5500, districtOr: 'ନବରଙ୍ଗପୁର' },
  { id: 'malkangiri', nameOr: 'ମାଲକାନଗିରି (ବାଲିମେଳା)', nameHi: 'मलकानगिरी', nameEn: 'Malkangiri', lat: 18.3500, lon: 81.9000, districtOr: 'ମାଲକାନଗିରି' },
  { id: 'phulbani', nameOr: 'ଫୁଲବାଣୀ (କନ୍ଧମାଳ ହଳଦୀ)', nameHi: 'फुलबनी', nameEn: 'Phulbani (Kandhamal)', lat: 20.4700, lon: 84.2300, districtOr: 'କନ୍ଧମାଳ' },

  // --- 5. Major Indian Metro Diaspora Hubs ---
  { id: 'delhi', nameOr: 'ନୂଆଦିଲ୍ଲୀ (ଜଗନ୍ନାଥ ମନ୍ଦିର)', nameHi: 'नई दिल्ली', nameEn: 'New Delhi', lat: 28.6139, lon: 77.2090, districtOr: 'ଦିଲ୍ଲୀ' },
  { id: 'kolkata', nameOr: 'କୋଲକାତା (ହୁଗୁଳି ତଟ)', nameHi: 'कोलकाता', nameEn: 'Kolkata', lat: 22.5726, lon: 88.3639, districtOr: 'ପଶ୍ଚିମବଙ୍ଗ' },
  { id: 'mumbai', nameOr: 'ମୁମ୍ବାଇ (ଜଗନ୍ନାଥ ମନ୍ଦିର)', nameHi: 'मुंबई', nameEn: 'Mumbai', lat: 19.0760, lon: 72.8777, districtOr: 'ମହାରାଷ୍ଟ୍ର' },
  { id: 'bengaluru', nameOr: 'ବେଙ୍ଗାଲୁରୁ (ଆଇଟି ହବ୍)', nameHi: 'बेंगलुरु', nameEn: 'Bengaluru', lat: 12.9716, lon: 77.5946, districtOr: 'କର୍ଣ୍ଣାଟକ' },
  { id: 'hyderabad', nameOr: 'ହାଇଦ୍ରାବାଦ (ଜଗନ୍ନାଥ ମନ୍ଦିର)', nameHi: 'हैदराबाद', nameEn: 'Hyderabad', lat: 17.3850, lon: 78.4867, districtOr: 'ତେଲେଙ୍ଗାନା' },
  { id: 'chennai', nameOr: 'ଚେନ୍ନାଇ (ଜଗନ୍ନାଥ କ୍ଷେତ୍ର)', nameHi: 'चेन्नई', nameEn: 'Chennai', lat: 13.0827, lon: 80.2707, districtOr: 'ତାମିଲନାଡ଼ୁ' },
  { id: 'surat', nameOr: 'ସୁରଟ (ଓଡ଼ିଆ ପ୍ରବାସୀ ହବ୍)', nameHi: 'सूरत', nameEn: 'Surat', lat: 21.1702, lon: 72.8311, districtOr: 'ଗୁଜରାଟ' },
];

/**
 * Calculates great-circle distance between two coordinates in Kilometers (Haversine formula)
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest canonical Odisha/Indian city to given coordinates
 */
export function findNearestOdishaCity(lat: number, lon: number): OdishaCityLocation {
  let nearestCity = ALL_30_ODISHA_DISTRICTS[0];
  let minDistance = Infinity;

  for (const city of ALL_30_ODISHA_DISTRICTS) {
    const dist = calculateHaversineDistanceKm(lat, lon, city.lat, city.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }

  return nearestCity;
}

const STORAGE_KEY = 'divyajyoti_active_city_v1';

/**
 * Saves user selected city to localStorage
 */
export function saveUserLocation(loc: OdishaCityLocation): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    }
  } catch (err) {
    console.warn('Could not save location to localStorage:', err);
  }
}

/**
 * Retrieves saved user location from localStorage
 */
export function getSavedUserLocation(): OdishaCityLocation | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (err) {
    console.warn('Could not load location from localStorage:', err);
  }
  return null;
}

/**
 * Requests device GPS with smart mobile multi-tier fallback:
 * 1. Tries quick low-accuracy cellular/wifi fix (fastest on phones, avoids timeouts)
 * 2. If supported, falls back to IP-based location if GPS is blocked or disabled
 * 3. Matches nearest canonical Odisha city so all Panjika calculations are astronomically pinpointed!
 */
export async function requestMobileGPSLocation(): Promise<{
  success: boolean;
  location: OdishaCityLocation;
  isExactGps: boolean;
  message: { or: string; hi: string; en: string };
}> {
  // Step 1: Check if browser supports Geolocation
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    // Fallback to Puri
    const fallback = ALL_30_ODISHA_DISTRICTS[0];
    return {
      success: false,
      location: fallback,
      isExactGps: false,
      message: {
        or: 'ଆପଣଙ୍କ ବ୍ରାଉଜର୍‌ରେ GPS ସୁବିଧା ନାହିଁ। ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀ ମାନକ ସ୍ଥିର କରାଗଲା।',
        hi: 'आपके ब्राउज़र में जीपीएस सुविधा नहीं है। श्रीक्षेत्र पुरी डिफ़ॉल्ट सेट किया गया।',
        en: 'Geolocation not supported by this browser. Defaulting to Puri.'
      }
    };
  }

  // Step 2: Try Geolocation with mobile-optimized options (quick cellular/wifi first)
  return new Promise((resolve) => {
    let resolved = false;

    // Timeout safety fallback after 8 seconds
    const safetyTimer = setTimeout(async () => {
      if (!resolved) {
        resolved = true;
        const ipLoc = await tryIpGeolocationFallback();
        resolve(ipLoc);
      }
    }, 8500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimer);

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const nearest = findNearestOdishaCity(lat, lon);
        const distKm = Math.round(calculateHaversineDistanceKm(lat, lon, nearest.lat, nearest.lon));

        const gpsCity: OdishaCityLocation = {
          id: `gps_live_${Math.round(lat * 100)}_${Math.round(lon * 100)}`,
          nameOr: `${nearest.districtOr} (${nearest.nameOr.split(' ')[0]} ନିକଟ GPS)`,
          nameHi: `${nearest.nameHi.split(' ')[0]} (लाइव GPS)`,
          nameEn: `${nearest.nameEn.split(' ')[0]} (Live GPS)`,
          lat: parseFloat(lat.toFixed(4)),
          lon: parseFloat(lon.toFixed(4)),
          districtOr: nearest.districtOr
        };

        saveUserLocation(gpsCity);

        resolve({
          success: true,
          location: gpsCity,
          isExactGps: true,
          message: {
            or: `✅ GPS ସଫଳ! ଆପଣଙ୍କ ସ୍ଥାନ ${gpsCity.nameOr} (${gpsCity.lat}°N, ${gpsCity.lon}°E) ନିର୍ଦ୍ଧାରିତ ହେଲା।`,
            hi: `✅ जीपीएस सफल! आपका स्थान ${gpsCity.nameHi} निर्धारित हुआ।`,
            en: `✅ GPS locked! Coordinates: ${gpsCity.lat}°N, ${gpsCity.lon}°E (${distKm} km from ${nearest.nameEn})`
          }
        });
      },
      async (_err) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimer);

        // Try IP Geolocation fallback if GPS denied/unavailable on mobile HTTP
        const ipLoc = await tryIpGeolocationFallback();
        resolve(ipLoc);
      },
      {
        enableHighAccuracy: false, // false = much faster on mobile, doesn't wait for cold satellite lock
        timeout: 7000,
        maximumAge: 300000 // Cache for 5 mins
      }
    );
  });
}

/**
 * Fallback to IP Geolocation if mobile device blocks GPS (e.g. over LAN HTTP)
 */
async function tryIpGeolocationFallback(): Promise<{
  success: boolean;
  location: OdishaCityLocation;
  isExactGps: boolean;
  message: { or: string; hi: string; en: string };
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = Number(data.latitude);
        const lon = Number(data.longitude);
        const nearest = findNearestOdishaCity(lat, lon);

        const ipCity: OdishaCityLocation = {
          id: `ip_${nearest.id}`,
          nameOr: `${nearest.districtOr} (${data.city || nearest.nameOr.split(' ')[0]})`,
          nameHi: `${data.city || nearest.nameHi.split(' ')[0]}`,
          nameEn: `${data.city || nearest.nameEn.split(' ')[0]}`,
          lat: parseFloat(lat.toFixed(4)),
          lon: parseFloat(lon.toFixed(4)),
          districtOr: nearest.districtOr
        };

        saveUserLocation(ipCity);

        return {
          success: true,
          location: ipCity,
          isExactGps: false,
          message: {
            or: `🌐 ନେଟୱାର୍କ ସ୍ଥାନ ମିଳିଲା: ${ipCity.nameOr}`,
            hi: `🌐 नेटवर्क द्वारा स्थान निर्धारित: ${ipCity.nameHi}`,
            en: `🌐 Location detected via Network: ${ipCity.nameEn}`
          }
        };
      }
    }
  } catch (_e) {
    // Silently proceed to default
  }

  // If saved location exists, use it
  const saved = getSavedUserLocation();
  if (saved) {
    return {
      success: true,
      location: saved,
      isExactGps: false,
      message: {
        or: `ପୂର୍ବରୁ ସଂରକ୍ଷିତ ସ୍ଥାନ: ${saved.nameOr}`,
        hi: `पूर्व संचित स्थान: ${saved.nameHi}`,
        en: `Loaded saved location: ${saved.nameEn}`
      }
    };
  }

  // Final fallback to Bhubaneswar/Puri
  const fallback = ALL_30_ODISHA_DISTRICTS[0]; // Puri
  return {
    success: false,
    location: fallback,
    isExactGps: false,
    message: {
      or: 'GPS ଅନୁମତି ମିଳିଲାନାହିଁ। ଶ୍ରୀକ୍ଷେତ୍ର ପୁରୀ ମାନକ ସ୍ଥିର କରାଗଲା।',
      hi: 'GPS अनुमति नहीं मिली। श्रीक्षेत्र पुरी डिफ़ॉल्ट रखा गया।',
      en: 'GPS unavailable. Defaulting to Srikshetra Puri.'
    }
  };
}
