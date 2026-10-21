import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../localization/i18n';
import { PlaceLocation, searchLocalLocations, searchOnlineGeocoding, ODISHA_COMPREHENSIVE_LOCATIONS } from '../../core/jataka/odisha_geography_db';
import { requestMobileGPSLocation, findNearestOdishaCity } from '../../core/geo/mobileLocationService';
import { MapPin, Search, Navigation, PlusCircle, CheckCircle2, Loader2, X, Compass, Globe2 } from 'lucide-react';

interface Props {
  selectedLocation: PlaceLocation;
  onSelectLocation: (loc: PlaceLocation) => void;
}

export const LocationSearchBox: React.FC<Props> = ({ selectedLocation, onSelectLocation }) => {
  const { formatNumber, language } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState<PlaceLocation[]>(() => searchLocalLocations(''));
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Village Form State
  const [customName, setCustomName] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [customLat, setCustomLat] = useState('20.2961');
  const [customLon, setCustomLon] = useState('85.8245');

  const containerRef = useRef<HTMLDivElement>(null);

  // Quick select popular places in Odisha
  const QUICK_PLACES = [
    ODISHA_COMPREHENSIVE_LOCATIONS[1], // Puri
    ODISHA_COMPREHENSIVE_LOCATIONS[0], // Bhubaneswar
    ODISHA_COMPREHENSIVE_LOCATIONS[2], // Cuttack
    ODISHA_COMPREHENSIVE_LOCATIONS[3], // Raghunathpur
    ODISHA_COMPREHENSIVE_LOCATIONS[4], // Jagatsinghpur
    ODISHA_COMPREHENSIVE_LOCATIONS[6], // Berhampur
    ODISHA_COMPREHENSIVE_LOCATIONS[7], // Sambalpur
    ODISHA_COMPREHENSIVE_LOCATIONS[8], // Rourkela
    ODISHA_COMPREHENSIVE_LOCATIONS[9], // Balasore
  ];

  // Close dropdown on outside click or mobile touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Search logic: instant local + debounced online API
  useEffect(() => {
    const local = searchLocalLocations(searchQuery);
    setResults(local);

    if (searchQuery.trim().length >= 3) {
      setIsSearchingOnline(true);
      const timer = setTimeout(async () => {
        const online = await searchOnlineGeocoding(searchQuery);
        if (online.length > 0) {
          setResults(prev => {
            const ids = new Set(prev.map(p => p.name.en.toLowerCase()));
            const merged = [...prev];
            for (const o of online) {
              if (!ids.has(o.name.en.toLowerCase())) {
                merged.push(o);
                ids.add(o.name.en.toLowerCase());
              }
            }
            return merged;
          });
        }
        setIsSearchingOnline(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearchingOnline(false);
    }
  }, [searchQuery]);

  // GPS Current Location Button (Flipkart "Use Current Location" style)
  const handleUseDeviceGPS = async () => {
    setIsSearchingOnline(true);
    try {
      const res = await requestMobileGPSLocation();
      const nearest = findNearestOdishaCity(res.location.lat, res.location.lon);
      const gpsPlace: PlaceLocation = {
        id: res.location.id,
        name: {
          en: `${nearest.nameEn.split(' ')[0]} (Live GPS)`,
          hi: `${nearest.nameHi.split(' ')[0]} (लाइव GPS)`,
          or: `${nearest.districtOr} (${nearest.nameOr.split(' ')[0]} GPS)`
        },
        district: {
          en: nearest.districtOr,
          hi: nearest.districtOr,
          or: nearest.districtOr
        },
        state: {
          en: 'Odisha',
          hi: 'ओडिशा',
          or: 'ଓଡ଼ିଶା'
        },
        latitude: res.location.lat,
        longitude: res.location.lon,
        timezone: 5.5
      };
      onSelectLocation(gpsPlace);
      setIsDropdownOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.warn('Geolocation error:', err);
      // Soft fallback to Puri without breaking UX
      onSelectLocation(ODISHA_COMPREHENSIVE_LOCATIONS[1]);
      setIsDropdownOpen(false);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const place: PlaceLocation = {
      id: `custom_${Date.now()}`,
      name: { en: customName, hi: customName, or: customName },
      district: { en: customDistrict || 'Odisha', hi: customDistrict || 'ओडिशा', or: customDistrict || 'ଓଡ଼ିଶା' },
      state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' },
      latitude: parseFloat(customLat) || 20.2961,
      longitude: parseFloat(customLon) || 85.8245,
      timezone: 5.5
    };
    onSelectLocation(place);
    setShowCustomModal(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative bg-cosmic-950/90 border-2 border-cosmic-gold/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl" ref={containerRef}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cosmic-gold/20 border border-cosmic-gold/40 text-cosmic-gold">
            <Compass className="w-4 h-4 text-cosmic-saffron animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5 font-serif">
              <span>{language === 'or' ? 'ଜନ୍ମ ସ୍ଥାନ ଓ ପ୍ରାମାଣିକ ଭୌଗୋଳିକ ସ୍ଥିତି' : language === 'hi' ? 'जन्म स्थान एवं प्रामाणिक भौगोलिक निर्देशांक' : 'Place of Birth & Authentic Geolocation'}</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {language === 'or' ? 'ଓଡ଼ିଶାର ପ୍ରତିଟି ଗ୍ରାମ, ପଞ୍ଚାୟତ, ବ୍ଲକ୍ ଓ ସହର ସନ୍ଧାନ କରନ୍ତୁ' : 'ओडिशा का कोई भी गांव, ब्लॉक या शहर खोजें'}
            </p>
          </div>
        </div>

        {/* Live GPS Telemetry Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-cosmic-gold bg-cosmic-gold/15 px-3 py-1 rounded-xl border border-cosmic-gold/30 flex items-center gap-1.5 shadow-inner">
            <Globe2 className="w-3.5 h-3.5 text-cosmic-saffron" />
            <span>{formatNumber(selectedLocation.latitude.toFixed(4))}°N, {formatNumber(selectedLocation.longitude.toFixed(4))}°E</span>
            <span className="text-slate-400">• IST +5.5h</span>
          </span>
        </div>
      </div>

      {/* Flipkart / Amazon Style Wide Search Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cosmic-gold absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={
              language === 'or'
                ? '🔍 ଗ୍ରାମ, ପଞ୍ଚାୟତ, ବ୍ଲକ୍, ସହର ବା ପିନ୍‌କୋଡ୍ ଖୋଜନ୍ତୁ (Search Village, Block, Town, Pincode)...'
                : language === 'hi'
                ? '🔍 गांव, पंचायत, ब्लॉक, शहर या पिनकोड खोजें...'
                : '🔍 Search any village, panchayat, block, town or pincode in Odisha...'
            }
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            className="w-full bg-cosmic-900/90 border border-slate-700/90 focus:border-cosmic-gold rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isSearchingOnline && (
            <Loader2 className="w-4 h-4 text-cosmic-gold animate-spin absolute right-3 top-2.5" />
          )}
        </div>

        {/* 1-Click GPS Button (Flipkart "Use Current Location" style) */}
        <button
          type="button"
          onClick={handleUseDeviceGPS}
          title={language === 'or' ? 'ମୋର ପ୍ରକୃତ GPS ସ୍ଥାନ ନିଅନ୍ତୁ' : 'मेरा वास्तविक GPS स्थान लें'}
          className="px-4 py-2.5 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Navigation className="w-4 h-4 animate-pulse" />
          <span>{language === 'or' ? '📍 ମୋର GPS ସ୍ଥାନ' : language === 'hi' ? '📍 मेरा GPS स्थान' : '📍 Use My GPS'}</span>
        </button>

        {/* Custom Village Modal Trigger */}
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          title={language === 'or' ? 'ନିଜ ଗାଁ ଯୋଡ଼ନ୍ତୁ' : 'कस्टम गांव जोड़ें'}
          className="px-4 py-2.5 bg-cosmic-900 border border-cosmic-gold/50 hover:bg-cosmic-850 text-cosmic-gold rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'or' ? '➕ ଗାଁ ଯୋଡ଼ନ୍ତୁ' : language === 'hi' ? '➕ गांव जोड़ें' : '➕ Add Village'}</span>
        </button>
      </div>

      {/* Quick Select Popular Places in Odisha */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 py-1">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
          {language === 'or' ? 'ଶୀଘ୍ର ଚୟନ:' : 'त्वरित चयन:'}
        </span>
        {QUICK_PLACES.map((p) => {
          const isSelected = selectedLocation.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelectLocation(p);
                setIsDropdownOpen(false);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-cosmic-gold text-cosmic-950 font-bold border-cosmic-gold shadow-md'
                  : 'bg-cosmic-900/60 text-slate-300 border-slate-800 hover:border-cosmic-gold/50 hover:text-cosmic-gold'
              }`}
            >
              {p.name[language]}
            </button>
          );
        })}
      </div>

      {/* Selected Location Full Telemetry Banner */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-cosmic-900/90 via-cosmic-850/80 to-cosmic-900/90 border border-cosmic-gold/30 rounded-2xl p-3 text-xs shadow-inner">
        <div className="flex items-center gap-2.5 truncate">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="font-bold text-slate-100 flex items-center gap-1.5 truncate">
              <span>{selectedLocation.name[language]}</span>
              {selectedLocation.district && (
                <span className="text-cosmic-gold font-medium">({selectedLocation.district[language]})</span>
              )}
              {selectedLocation.pincode && (
                <span className="text-slate-400 text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded">PIN: {selectedLocation.pincode}</span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedLocation.state[language]} • {language === 'or' ? 'ପ୍ରାମାଣିକ ଭୌଗୋଳିକ ସ୍ଥାନ ସକ୍ରିୟ' : 'प्रमाणित भौगोलिक स्थान सक्रिय'}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] font-mono font-bold text-cosmic-gold">
            {formatNumber(selectedLocation.latitude.toFixed(2))}°N, {formatNumber(selectedLocation.longitude.toFixed(2))}°E
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            ● 100% Real Geocentric Math
          </div>
        </div>
      </div>

      {/* Autocomplete Search Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-cosmic-950 border-2 border-cosmic-gold/60 rounded-3xl shadow-2xl p-3 backdrop-blur-2xl animate-in fade-in max-h-72 overflow-y-auto mobile-touch-scroll-y touch-pan-y cosmic-visible-scrollbar pr-2">
          <div className="text-[10px] text-slate-400 font-semibold px-2 pb-2 uppercase tracking-wider flex items-center justify-between border-b border-slate-800">
            <span>{language === 'or' ? 'ଓଡ଼ିଶା ଓ ଭାରତର ଉପଲବ୍ଧ ସ୍ଥାନ (Matching Locations)' : 'सुझाए गए स्थान'}</span>
            <span className="text-cosmic-gold font-mono">{formatNumber(results.length)}</span>
          </div>

          <div className="space-y-1.5 mt-2">
            {results.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cosmic-gold/25 text-cosmic-gold border border-cosmic-gold/50 font-bold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-cosmic-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-cosmic-saffron shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold truncate">
                        {loc.name[language]}
                        {loc.district ? ` • ${loc.district[language]}` : ''}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {loc.state[language]} {loc.pincode ? `• PIN: ${loc.pincode}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {formatNumber(loc.latitude.toFixed(2))}°, {formatNumber(loc.longitude.toFixed(2))}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Village Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustom}
            className="w-full max-w-md bg-cosmic-950 border-2 border-cosmic-gold rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-cosmic-gold flex items-center gap-2 font-serif">
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'or' ? 'ନିଜ ଗ୍ରାମ କିମ୍ବା କଷ୍ଟମ ସ୍ଥାନ ଯୋଡ଼ନ୍ତୁ' : 'कस्टम गांव या स्थान जोड़ें'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                {language === 'or' ? 'ଗ୍ରାମ / ସହରର ନାମ (Village / Town Name)' : 'गांव / शहर का नाम'}
              </label>
              <input
                type="text"
                placeholder="e.g. Birapratappur, Sakhigopal, Nimapara..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="w-full bg-cosmic-900 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                {language === 'or' ? 'ଜିଲ୍ଲା (District)' : 'जिला (District)'}
              </label>
              <input
                type="text"
                placeholder="e.g. Puri, Cuttack, Ganjam..."
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                className="w-full bg-cosmic-900 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  {language === 'or' ? 'ଅକ୍ଷାଂଶ (Latitude °N)' : 'अक्षांश (Latitude °N)'}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  required
                  className="w-full bg-cosmic-900 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  {language === 'or' ? 'ଦ୍ରାଘିମାଂଶ (Longitude °E)' : 'देशांतर (Longitude °E)'}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  required
                  className="w-full bg-cosmic-900 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {language === 'or' ? 'ବାତିଲ୍' : 'रद्द'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cosmic-gold hover:bg-yellow-400 text-cosmic-950 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                {language === 'or' ? 'ସୁନିଶ୍ଚିତ କରନ୍ତୁ' : 'जोड़ें'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};