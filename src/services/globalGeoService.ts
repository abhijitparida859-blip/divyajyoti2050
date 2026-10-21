/**
 * Global Geocoding, Reverse Geocoding, Road Navigation Maneuver Formatting,
 * and Atmospheric Weather & Elevation Service.
 * 100% Real Live Data Engine powered by OpenStreetMap Nominatim, Photon Komoot & Open-Meteo.
 */

export interface GeoSearchResult {
  id: string;
  name: string;
  fullName: string;
  lat: number;
  lon: number;
  type: string;
  category: 'temple' | 'city' | 'village' | 'landmark' | 'address';
  address?: {
    village?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface LocationWeatherTelemetry {
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  elevationM: number;
  weatherCode: number;
  conditionOr: string;
  conditionHi?: string;
  conditionEn: string;
  icon: string;
}

// Translate WMO Weather Interpretation Codes (0-99) to Odia, Hindi & English
export function decodeWmoWeatherCode(code: number): { or: string; hi: string; en: string; icon: string } {
  if (code === 0) return { or: 'ନିର୍ମଳ ଆକାଶ (Clear)', hi: 'साफ आसमान (Clear)', en: 'Clear Sky', icon: '☀️' };
  if (code === 1 || code === 2) return { or: 'ଆଂଶିକ ମେଘୁଆ (Partly Cloudy)', hi: 'आंशिक बादल (Partly Cloudy)', en: 'Partly Cloudy', icon: '🌤️' };
  if (code === 3) return { or: 'ମେଘାଚ୍ଛନ୍ନ (Overcast)', hi: 'घने बादल (Overcast)', en: 'Overcast', icon: '☁️' };
  if (code >= 45 && code <= 48) return { or: 'କୁହୁଡ଼ି (Foggy)', hi: 'कोहरा (Foggy)', en: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { or: 'ଝିପିଝିପି ବର୍ଷା (Drizzle)', hi: 'हल्की बूंदाबांदी (Drizzle)', en: 'Light Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { or: 'ବର୍ଷା (Rain)', hi: 'वर्षा (Rain)', en: 'Rainy', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { or: 'ତୁଷାରପାତ (Snow)', hi: 'बर्फबारी (Snow)', en: 'Snowy', icon: '❄️' };
  if (code >= 80 && code <= 82) return { or: 'ପ୍ରବଳ ବର୍ଷା (Heavy Showers)', hi: 'भारी बारिश (Heavy Showers)', en: 'Heavy Showers', icon: '⛈️' };
  if (code >= 95 && code <= 99) return { or: 'ଘଡ଼ଘଡ଼ି ସହ ବର୍ଷା (Thunderstorm)', hi: 'तूफानी बारिश (Thunderstorm)', en: 'Thunderstorm', icon: '⚡' };
  return { or: 'ସ୍ୱାଭାବିକ ପାଣିପାଗ', hi: 'सामान्य मौसम', en: 'Fair Weather', icon: '🌤️' };
}

// 1. Universal Global Location Search with Dual-Engine (Nominatim + Photon Komoot Fallback)
export async function searchGlobalLocations(
  query: string,
  language: string = 'or'
): Promise<GeoSearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  // Engine A: OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
      cleanQuery
    )}`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': language === 'or' ? 'or,hi,en' : 'en',
        'User-Agent': 'DivyaJyotiPanjika2050/1.0'
      },
      signal: AbortSignal.timeout(3500)
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any, idx: number) => {
          const addr = item.address || {};
          const primaryName =
            addr.temple ||
            addr.place_of_worship ||
            addr.village ||
            addr.town ||
            addr.city ||
            addr.suburb ||
            item.name ||
            item.display_name.split(',')[0];

          let category: GeoSearchResult['category'] = 'address';
          if (item.type === 'place_of_worship' || item.class === 'amenity') {
            category = 'temple';
          } else if (addr.city || item.type === 'city') {
            category = 'city';
          } else if (addr.village || item.type === 'village') {
            category = 'village';
          }

          return {
            id: `osm_${item.place_id || idx}_${Date.now()}`,
            name: primaryName,
            fullName: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: item.type || 'place',
            category,
            address: {
              village: addr.village,
              suburb: addr.suburb,
              city: addr.city || addr.town,
              state: addr.state,
              country: addr.country
            }
          };
        });
      }
    }
  } catch (err) {
    console.warn('Nominatim search timed out, engaging Photon Komoot fallback:', err);
  }

  // Engine B: Photon Komoot OpenStreetMap Engine (Lightning Fast & Worldwide)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=6`;
    const pRes = await fetch(photonUrl, { signal: AbortSignal.timeout(3500) });
    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData && pData.features && Array.isArray(pData.features) && pData.features.length > 0) {
        return pData.features.map((f: any, idx: number) => {
          const props = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const name = props.name || cleanQuery;
          const fullParts = [
            props.name,
            props.street,
            props.district || props.county,
            props.city,
            props.state,
            props.country
          ].filter(Boolean);

          return {
            id: `photon_${props.osm_id || idx}_${Date.now()}`,
            name,
            fullName: fullParts.join(', ') || name,
            lat: coords[1],
            lon: coords[0],
            type: props.osm_value || 'place',
            category: props.osm_value === 'place_of_worship' ? 'temple' : props.city ? 'city' : 'address',
            address: {
              suburb: props.district,
              city: props.city,
              state: props.state,
              country: props.country
            }
          };
        });
      }
    }
  } catch (pErr) {
    console.warn('Photon geocoding also failed:', pErr);
  }

  return [];
}

// 2. Reverse Geocoding: Coordinate to Authentic Address Name (Dual Engine)
export async function reverseGeocodeCoord(
  lat: number,
  lon: number,
  language: string = 'or'
): Promise<string> {
  // Engine A: Nominatim Reverse
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': language === 'or' ? 'or,hi,en' : 'en',
        'User-Agent': 'DivyaJyotiPanjika2050/1.0'
      },
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        return parts.slice(0, 3).join(', ').trim();
      }
    }
  } catch {
    // Fall through to Engine B
  }

  // Engine B: Photon Reverse Geocoding
  try {
    const photonRevUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`;
    const pRes = await fetch(photonRevUrl, { signal: AbortSignal.timeout(3000) });
    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData?.features?.[0]?.properties) {
        const p = pData.features[0].properties;
        const parts = [p.name, p.street, p.city || p.district, p.state].filter(Boolean);
        if (parts.length > 0) return parts.join(', ');
      }
    }
  } catch {
    // Fall through
  }

  // Engine C: BigDataCloud Client Reverse Geocode
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const bdcRes = await fetch(bdcUrl, { signal: AbortSignal.timeout(3000) });
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const parts = [bdcData.locality, bdcData.city, bdcData.principalSubdivision, bdcData.countryName].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
  } catch {
    // Fall through
  }

  return `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
}

// 3. 100% Real Weather & Elevation Telemetry from Open-Meteo
export async function fetchLocationTelemetry(
  lat: number,
  lon: number
): Promise<LocationWeatherTelemetry | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;

    const data = await res.json();
    const current = data.current;
    if (!current) return null;

    const weatherDecoded = decodeWmoWeatherCode(current.weather_code || 0);
    const elevation = Math.round(data.elevation || 0);

    return {
      temperatureC: Math.round(current.temperature_2m),
      humidityPercent: Math.round(current.relative_humidity_2m),
      windSpeedKmh: Math.round(current.wind_speed_10m),
      elevationM: elevation,
      weatherCode: current.weather_code || 0,
      conditionOr: weatherDecoded.or,
      conditionHi: weatherDecoded.hi,
      conditionEn: weatherDecoded.en,
      icon: weatherDecoded.icon
    };
  } catch (err) {
    console.warn('Weather telemetry lookup failed:', err);
    return null;
  }
}

// 4. Authentic Road Turn Maneuver Formatter
export function formatOsrmManeuver(
  maneuver: any,
  streetName: string,
  language: string = 'or'
): string {
  const type = maneuver?.type || '';
  const modifier = maneuver?.modifier || '';
  const road = streetName && streetName.trim() !== '' ? streetName.trim() : '';

  if (type === 'depart') {
    return language === 'or' ? 'ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ' : language === 'hi' ? 'यात्रा शुरू करें' : 'Head out to start journey';
  }
  if (type === 'arrive') {
    return language === 'or' ? 'ଆପଣ ନିଜ ଗନ୍ତବ୍ୟ ସ୍ଥଳରେ ପହଞ୍ଚିଗଲେ' : language === 'hi' ? 'आप अपने गंतव्य पर पहुंच गए हैं' : 'You have arrived at your destination';
  }
  if (type === 'roundabout') {
    return language === 'or'
      ? `ଗୋଲଚକ୍କର (Roundabout) ଦେଇ ପ୍ରସ୍ଥାନ କରନ୍ତୁ${road ? ` -> ${road}` : ''}`
      : language === 'hi'
      ? `गोलचक्कर से बाहर निकलें${road ? ` -> ${road}` : ''}`
      : `Exit roundabout${road ? ` onto ${road}` : ''}`;
  }

  // Direction modifiers
  if (modifier === 'right') {
    return language === 'or'
      ? `${road ? `${road} ଦେଇ ` : ''}ଡାହାଣକୁ ବୁଲନ୍ତୁ (Turn right)`
      : language === 'hi'
      ? `${road ? `${road} पर ` : ''}दाएं मुड़ें (Turn right)`
      : `Turn right${road ? ` onto ${road}` : ''}`;
  }
  if (modifier === 'left') {
    return language === 'or'
      ? `${road ? `${road} ଦେଇ ` : ''}ବାମକୁ ବୁଲନ୍ତୁ (Turn left)`
      : language === 'hi'
      ? `${road ? `${road} पर ` : ''}बाएं मुड़ें (Turn left)`
      : `Turn left${road ? ` onto ${road}` : ''}`;
  }
  if (modifier === 'slight right') {
    return language === 'or'
      ? `${road ? `${road} ଦେଇ ` : ''}ସାମାନ୍ୟ ଡାହାଣକୁ ବୁଲନ୍ତୁ`
      : language === 'hi'
      ? `${road ? `${road} पर ` : ''}हल्का दाएं मुड़ें`
      : `Keep slight right${road ? ` onto ${road}` : ''}`;
  }
  if (modifier === 'slight left') {
    return language === 'or'
      ? `${road ? `${road} ଦେଇ ` : ''}ସାମାନ୍ୟ ବାମକୁ ବୁଲନ୍ତୁ`
      : language === 'hi'
      ? `${road ? `${road} पर ` : ''}हल्का बाएं मुड़ें`
      : `Keep slight left${road ? ` onto ${road}` : ''}`;
  }
  if (modifier === 'uturn') {
    return language === 'or' ? 'ୟୁ-ଟର୍ଣ୍ଣ (U-Turn) କରନ୍ତୁ' : language === 'hi' ? 'यू-टर्न (U-Turn) लें' : 'Make a U-turn';
  }

  if (road) {
    return language === 'or' ? `${road} ରାସ୍ତା ଦେଇ ସିଧା ଆଗକୁ ବଢ଼ନ୍ତୁ` : language === 'hi' ? `${road} मार्ग पर सीधे आगे बढ़ें` : `Continue on ${road}`;
  }

  return language === 'or' ? 'ରାଜପଥ ଦେଇ ସିଧା ଆଗକୁ ବଢ଼ନ୍ତୁ' : language === 'hi' ? 'राजमार्ग पर सीधे आगे बढ़ें' : 'Continue straight on highway';
}
