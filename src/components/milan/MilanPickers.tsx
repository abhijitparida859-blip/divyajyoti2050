import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../localization/i18n';
import { PlaceLocation, searchWorldGeocoding, searchLocalLocations, ODISHA_COMPREHENSIVE_LOCATIONS } from '../../core/jataka/odisha_geography_db';
import { requestMobileGPSLocation, findNearestOdishaCity, ALL_30_ODISHA_DISTRICTS } from '../../core/geo/mobileLocationService';
import { ChevronLeft, ChevronRight, MapPin, Search, Loader2, Navigation, X, Clock, PlusCircle, Check, Edit3, Globe, Sparkles, Building2, Compass, AlertCircle } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_OD = ['ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଅପ୍ରେଲ', 'ମଇ', 'ଜୁନ', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'];
const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_OD = ['ରବି', 'ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି'];
const DOW_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const parseDate = (s: string): { y: number; m: number; d: number } => {
  const p = (s || '').split('-');
  return { y: Number(p[0]) || 1990, m: (Number(p[1]) || 1) - 1, d: Number(p[2]) || 1 };
};

/** ============ ADVANCE DATE PICKER (calendar popup, Odia/Hi/En) ============ */
export const MilanDatePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const { language } = useI18n();
  const init = parseDate(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: init.y, m: init.m });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const months = language === 'or' ? MONTHS_OD : language === 'hi' ? MONTHS_HI : MONTHS;
  const dow = language === 'or' ? DOW_OD : language === 'hi' ? DOW_HI : DOW;

  const firstDow = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const sel = parseDate(value);
  const display = `${String(sel.d).padStart(2, '0')}/${String(sel.m + 1).padStart(2, '0')}/${sel.y}`;
  const [typed, setTyped] = useState(display);

  useEffect(() => {
    const s = parseDate(value);
    setTyped(`${String(s.d).padStart(2, '0')}/${String(s.m + 1).padStart(2, '0')}/${s.y}`);
    // Sync calendar view so a typed date also updates the open calendar month/year
    setView(v => (v.y === s.y && v.m === s.m) ? v : { y: s.y, m: s.m });
  }, [value]);

  // Direct typing: accept DD/MM/YYYY, DD-MM-YYYY, or YYYY-MM-DD
  const commitTyped = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    let y = 0, m = 0, d = 0;
    if (cleaned.length === 8) {
      if (raw.indexOf('-') === 4 || /^\d{4}[-\/]/.test(raw)) { y = +cleaned.slice(0, 4); m = +cleaned.slice(4, 6); d = +cleaned.slice(6, 8); }
      else { d = +cleaned.slice(0, 2); m = +cleaned.slice(2, 4); y = +cleaned.slice(4, 8); }
    }
    if (y > 1900 && y < 2101 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    } else {
      const s = parseDate(value);
      setTyped(`${String(s.d).padStart(2, '0')}/${String(s.m + 1).padStart(2, '0')}/${s.y}`);
    }
  };

  const pick = (d: number) => {
    onChange(`${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    setOpen(false);
  };

  const goToday = () => {
    const n = new Date();
    setView({ y: n.getFullYear(), m: n.getMonth() });
    onChange(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`);
    setOpen(false);
  };

  const years = useMemo(() => Array.from({ length: 151 }, (_, i) => 1900 + i), []);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1">
        <input
          type="text" value={typed} inputMode="numeric" placeholder="DD/MM/YYYY" maxLength={10}
          onChange={e => setTyped(e.target.value)}
          onBlur={e => commitTyped(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
          className="flex-1 min-w-0 bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold/60 rounded-xl px-2.5 py-2.5 text-xs text-slate-100 font-bold text-center focus:outline-none"
        />
        <button type="button" onClick={() => setOpen(o => !o)} title="Open calendar" className="shrink-0 bg-cosmic-950 border border-slate-700 hover:border-cosmic-gold/60 rounded-xl px-2.5 py-2.5 text-cosmic-gold focus:outline-none">
          📅
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-cosmic-900 border border-cosmic-gold/40 rounded-2xl p-3 shadow-2xl">
          {/* Year + Month quick nav */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <button type="button" onClick={() => setView(v => ({ ...v, y: v.y - 1 }))} title="Previous year" className="p-1 rounded-lg hover:bg-white/10 text-cosmic-gold text-xs font-black">«</button>
            <button type="button" onClick={() => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 })} title="Previous month" className="p-1 rounded-lg hover:bg-white/10 text-cosmic-gold"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex items-center gap-1">
              <select value={view.m} onChange={e => setView(v => ({ ...v, m: Number(e.target.value) }))} aria-label="Month"
                className="bg-cosmic-950 border border-slate-700 rounded-lg px-1 py-1 text-[11px] text-slate-100 font-bold focus:outline-none focus:border-cosmic-gold/60">
                {months.map((mn, i) => <option key={i} value={i}>{mn}</option>)}
              </select>
              <select value={view.y} onChange={e => setView(v => ({ ...v, y: Number(e.target.value) }))} aria-label="Year"
                className="bg-cosmic-950 border border-slate-700 rounded-lg px-1 py-1 text-[11px] text-slate-100 font-bold focus:outline-none focus:border-cosmic-gold/60">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 })} title="Next month" className="p-1 rounded-lg hover:bg-white/10 text-cosmic-gold"><ChevronRight className="w-4 h-4" /></button>
            <button type="button" onClick={() => setView(v => ({ ...v, y: v.y + 1 }))} title="Next year" className="p-1 rounded-lg hover:bg-white/10 text-cosmic-gold text-xs font-black">»</button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {dow.map(w => <div key={w} className="text-[9px] text-slate-500 text-center font-bold">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((c, i) => (
              <button key={i} type="button" disabled={!c} onClick={() => c && pick(c)}
                className={`h-7 rounded-lg text-[11px] font-bold transition-colors ${
                  !c ? 'invisible' :
                  sel.y === view.y && sel.m === view.m && sel.d === c ? 'bg-cosmic-gold text-cosmic-950' :
                  'text-slate-200 hover:bg-cosmic-gold/30'
                }`}>{c}</button>
            ))}
          </div>
          <button type="button" onClick={goToday} className="mt-2 w-full py-1.5 rounded-lg bg-cosmic-gold/15 border border-cosmic-gold/40 text-cosmic-gold text-[11px] font-black hover:bg-cosmic-gold/25">
            {language === 'or' ? 'ଆଜି' : language === 'hi' ? 'आज' : 'Today'}
          </button>
        </div>
      )}
    </div>
  );
};


/** ============ ADVANCE TIME PICKER (hour/min/AM-PM) ============ */
export const MilanTimePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const { language } = useI18n();
  const [hh, mm] = (value || '12:00').split(':');
  const h24 = Number(hh) || 0;
  const isPM = h24 >= 12;
  const dispH = h24 % 12 === 0 ? 12 : h24 % 12;
  const dispM = Number(mm) || 0;

  const setTime = (h12: number, minute: number, pm: boolean) => {
    let h = h12 % 12;
    if (pm) h += 12;
    onChange(`${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const label = { h: language === 'or' ? 'ଘଣ୍ଟା' : language === 'hi' ? 'घंटा' : 'Hr', m: language === 'or' ? 'ମିନିଟ' : language === 'hi' ? 'मिनट' : 'Min' };

  return (
    <div className="w-full bg-cosmic-950 border border-slate-700 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-cosmic-gold shrink-0" />
        <div className="flex items-center gap-1 flex-1">
          <select value={dispH} onChange={e => setTime(Number(e.target.value), dispM, isPM)} aria-label={label.h}
            className="bg-cosmic-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-slate-100 font-bold focus:outline-none focus:border-cosmic-gold/60">
            {hours.map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}</option>)}
          </select>
          <span className="text-cosmic-gold font-black">:</span>
          <select value={dispM} onChange={e => setTime(dispH, Number(e.target.value), isPM)} aria-label={label.m}
            className="bg-cosmic-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs text-slate-100 font-bold focus:outline-none focus:border-cosmic-gold/60">
            {mins.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
          </select>
          <div className="flex rounded-lg overflow-hidden border border-slate-700 ml-0.5">
            <button type="button" onClick={() => setTime(dispH, dispM, false)} className={`px-2 py-1 text-[10px] font-black ${!isPM ? 'bg-cosmic-gold text-cosmic-950' : 'bg-cosmic-900 text-slate-300'}`}>AM</button>
            <button type="button" onClick={() => setTime(dispH, dispM, true)} className={`px-2 py-1 text-[10px] font-black ${isPM ? 'bg-cosmic-gold text-cosmic-950' : 'bg-cosmic-900 text-slate-300'}`}>PM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** ============ WORLD & ODISHA ADVANCED LOCATION SEARCH & CUSTOM VILLAGE BUILDER ============ */
export const MilanLocationSearch: React.FC<{ value: PlaceLocation; onChange: (l: PlaceLocation) => void }> = ({ value, onChange }) => {
  const { language, formatNumber } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Village Form State
  const [customName, setCustomName] = useState('');
  const [customDistrict, setCustomDistrict] = useState('ପୁରୀ');
  const [customState, setCustomState] = useState('ଓଡ଼ିଶା');
  const [customLat, setCustomLat] = useState('19.8135');
  const [customLon, setCustomLon] = useState('85.8312');
  const [customPincode, setCustomPincode] = useState('');

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (!query.trim()) {
          setIsSearching(false);
        }
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [query]);

  // Focus search input when activated
  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  // Top popular quick picks in Odisha & National Hubs
  const POPULAR_QUICK_PICKS: PlaceLocation[] = useMemo(() => {
    const popularIds = ['puri', 'bhubaneswar', 'cuttack', 'berhampur', 'sambalpur', 'rourkela', 'balasore', 'bhadrak', 'kendrapara', 'jagatsinghpur', 'baripada', 'kolkata', 'delhi'];
    return popularIds
      .map(id => ODISHA_COMPREHENSIVE_LOCATIONS.find(l => l.id === id))
      .filter(Boolean) as PlaceLocation[];
  }, []);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const local = searchLocalLocations(q);
    setResults(local);

    if (q.trim().length >= 3) {
      setLoading(true);
      const world = await searchWorldGeocoding(q);
      setLoading(false);
      setResults(prev => {
        const seen = new Set(prev.map(p => p.id));
        const merged = [...prev];
        for (const w of world) {
          if (!seen.has(w.id)) {
            merged.push(w);
            seen.add(w.id);
          }
        }
        return merged;
      });
    }
  };

  const onQuery = (q: string) => {
    setQuery(q);
    setOpen(true);
    if (debRef.current) clearTimeout(debRef.current);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    debRef.current = setTimeout(() => doSearch(q), 300);
  };

  // High-precision live GPS
  const useGPS = async () => {
    setGpsLoading(true);
    try {
      const res = await requestMobileGPSLocation();
      const nearest = findNearestOdishaCity(res.location.lat, res.location.lon);
      const place: PlaceLocation = {
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
      onChange(place);
      setIsSearching(false);
      setOpen(false);
      setQuery('');
    } catch (err) {
      console.warn('Geolocation error fallback:', err);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            onChange({
              id: `gps_${Date.now()}`,
              name: { en: 'My GPS Location', hi: 'मेरा GPS स्थान', or: 'ମୋର GPS ଅବସ୍ଥାନ' },
              district: { en: 'GPS Detected', hi: 'GPS पहचाना', or: 'GPS ଚିହ୍ନଟ' },
              state: { en: 'Odisha/India', hi: 'ओडिशा/भारत', or: 'ଓଡ଼ିଶା/ଭାରତ' },
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              timezone: 5.5,
            });
            setIsSearching(false);
            setOpen(false);
            setQuery('');
          },
          () => {
            alert(language === 'or' ? 'GPS ଅବସ୍ଥାନ ମିଳିଲା ନାହିଁ। ଦୟାକରି ଲୋକେସନ ଅନ୍ କରନ୍ତୁ।' : 'GPS location unavailable. Please enable device location.');
          }
        );
      }
    } finally {
      setGpsLoading(false);
    }
  };

  // Pre-fill District in Custom Location Modal
  const handleDistrictPreset = (districtOr: string) => {
    const found = ALL_30_ODISHA_DISTRICTS.find(d => d.districtOr === districtOr) || ALL_30_ODISHA_DISTRICTS[0];
    setCustomDistrict(found.districtOr);
    setCustomLat(found.lat.toString());
    setCustomLon(found.lon.toString());
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const place: PlaceLocation = {
      id: `custom_${Date.now()}`,
      name: { en: customName.trim(), hi: customName.trim(), or: customName.trim() },
      district: { en: customDistrict.trim() || 'Odisha', hi: customDistrict.trim() || 'ओडिशा', or: customDistrict.trim() || 'ଓଡ଼ିଶା' },
      state: { en: customState.trim() || 'Odisha', hi: customState.trim() || 'ओडिशा', or: customState.trim() || 'ଓଡ଼ିଶା' },
      latitude: parseFloat(customLat) || 20.2961,
      longitude: parseFloat(customLon) || 85.8245,
      timezone: 5.5,
      pincode: customPincode.trim() || undefined,
    };
    onChange(place);
    setShowCustomModal(false);
    setIsSearching(false);
    setOpen(false);
    setQuery('');
  };

  const t = {
    ph: language === 'or' ? 'ଗାଁ, ସହର, ଜିଲ୍ଲା ବା ପିନ୍‌କୋଡ୍ ଖୋଜନ୍ତୁ...' : language === 'hi' ? 'गाँव, शहर, ज़िला या पिनकोड खोजें...' : 'Search village, city, district or pincode...',
    gps: language === 'or' ? 'ମୋର GPS ଅବସ୍ଥାନ ନିଅନ୍ତୁ' : language === 'hi' ? 'मेरा GPS स्थान लें' : 'Use live GPS',
    addCustom: language === 'or' ? '➕ ନିଜ ଗାଁ / କଷ୍ଟମ୍ ସ୍ଥାନ ଯୋଡ଼ନ୍ତୁ' : language === 'hi' ? '➕ अपना गाँव / कस्टम स्थान जोड़ें' : '➕ Add Custom Village / Coordinates',
    popular: language === 'or' ? 'ଲୋକପ୍ରିୟ ସ୍ଥାନସମୂହ (୧-କ୍ଲିକ୍ ଚୟନ):' : language === 'hi' ? 'लोकप्रिय स्थान (1-क्लिक चयन):' : 'Popular Places (1-Click Select):',
    change: language === 'or' ? 'ବଦଳାନ୍ତୁ' : language === 'hi' ? 'बदलें' : 'Change',
    selected: language === 'or' ? 'ଚୟନିତ' : language === 'hi' ? 'चयनित' : 'Selected',
    none: language === 'or' ? 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ। ନିମ୍ନରୁ କଷ୍ଟମ୍ ଗାଁ ଯୋଡ଼ନ୍ତୁ।' : language === 'hi' ? 'कोई परिणाम नहीं मिला। नीचे से कस्टम गाँव जोड़ें।' : 'No results found. Add custom village below.',
  };

  return (
    <div className="relative" ref={ref}>
      {/* ============ 1. VISIBLE SELECTED CARD (Default View) ============ */}
      {!isSearching ? (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-cosmic-950 border border-slate-700/80 hover:border-cosmic-gold/50 transition-all shadow-inner group">
          <button
            type="button"
            onClick={() => { setIsSearching(true); setOpen(true); }}
            className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
            title={language === 'or' ? 'ସ୍ଥାନ ବଦଳାଇବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ' : 'Click to change location'}
          >
            <div className="w-8 h-8 rounded-lg bg-cosmic-gold/15 border border-cosmic-gold/30 flex items-center justify-center shrink-0 text-cosmic-gold group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-100 truncate">
                  {value.name[language as 'or'] || value.name.en}
                </span>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold shrink-0">
                  {t.selected}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <span>{[value.district?.[language as 'or'] || value.district?.en, value.state?.[language as 'or'] || value.state?.en].filter(Boolean).join(', ')}</span>
                <span>•</span>
                <span className="font-mono text-cosmic-gold/90">{formatNumber(value.latitude.toFixed(2))}°N, {formatNumber(value.longitude.toFixed(2))}°E</span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => { setIsSearching(true); setOpen(true); }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={t.change}
            >
              <Edit3 className="w-3 h-3 text-cosmic-gold" />
              <span>{t.change}</span>
            </button>

            <button
              type="button"
              onClick={useGPS}
              title={t.gps}
              className="p-1.5 rounded-lg bg-cosmic-gold/15 hover:bg-cosmic-gold/25 border border-cosmic-gold/40 text-cosmic-gold transition-colors cursor-pointer"
            >
              {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCustomName(value.name[language as 'or'] || value.name.en || '');
                setCustomDistrict(value.district?.[language as 'or'] || value.district?.en || 'ପୁରୀ');
                setCustomLat(value.latitude.toString());
                setCustomLon(value.longitude.toString());
                setShowCustomModal(true);
              }}
              title={t.addCustom}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-cosmic-gold/20 border border-slate-700 hover:border-cosmic-gold/40 text-amber-300 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ============ 2. ACTIVE SEARCH INPUT BAR ============ */
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cosmic-gold" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                autoComplete="off"
                onChange={e => onQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder={t.ph}
                className="w-full bg-cosmic-950 border border-cosmic-gold/60 focus:border-cosmic-gold rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-100 font-bold focus:outline-none shadow-lg shadow-amber-500/5"
              />
              {loading && <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cosmic-gold animate-spin" />}
              {!loading && (
                <button
                  type="button"
                  onClick={() => {
                    if (query) {
                      setQuery('');
                      setResults([]);
                    } else {
                      setIsSearching(false);
                      setOpen(false);
                    }
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={useGPS}
              title={t.gps}
              className="px-3 rounded-xl bg-cosmic-gold/15 border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold/25 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            >
              {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span className="hidden sm:inline">GPS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCustomName(query);
                setShowCustomModal(true);
              }}
              title={t.addCustom}
              className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-400/20 hover:from-amber-500/30 hover:to-yellow-400/30 border border-cosmic-gold/40 text-amber-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cosmic-gold" />
              <span className="hidden sm:inline">{language === 'or' ? 'କଷ୍ଟମ୍' : 'Custom'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============ 3. RICH DROPDOWN (Quick Picks + Instant Local + Worldwide + Custom) ============ */}
      {open && isSearching && (
        <div className="absolute z-50 mt-1.5 w-full bg-cosmic-950 border border-cosmic-gold/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Quick Popular Picks Chips (when query is empty) */}
          {!query.trim() && (
            <div className="p-3 border-b border-slate-800 bg-cosmic-900/40">
              <div className="text-[10px] font-bold text-cosmic-gold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{t.popular}</span>
                <span className="text-slate-400 text-[9px] lowercase font-normal">30 districts offline</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_QUICK_PICKS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p);
                      setIsSearching(false);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      value.id === p.id
                        ? 'bg-cosmic-gold text-cosmic-950 border-cosmic-gold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-slate-700/80 hover:border-cosmic-gold/40'
                    }`}
                  >
                    {p.name[language as 'or'] || p.name.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar p-1.5">
            {/* Live GPS Option */}
            <button
              type="button"
              onClick={useGPS}
              className="w-full text-left px-3 py-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/25 transition-colors flex items-center justify-between mb-1 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block text-xs font-black text-emerald-200">{t.gps}</span>
                  <span className="block text-[9.5px] text-emerald-400/80">
                    {language === 'or' ? 'ମୋବାଇଲ୍ ସେନ୍ସର୍ରୁ ସଠିକ୍ ଅକ୍ଷାଂଶ ଓ ଦ୍ରାଘିମା ନିଅନ୍ତୁ' : 'Detect accurate coordinates directly from device GPS'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">Live</span>
            </button>

            {/* Results items */}
            {results.length > 0 && results.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onChange(r);
                  setIsSearching(false);
                  setOpen(false);
                  setQuery('');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 my-0.5 cursor-pointer ${
                  value.id === r.id
                    ? 'bg-cosmic-gold/20 border border-cosmic-gold/50 text-white'
                    : 'hover:bg-cosmic-gold/15 text-slate-200 border border-transparent'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cosmic-gold shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {r.name[language as 'or'] || r.name.en}
                    </span>
                    <span className="text-[9px] text-cosmic-gold font-mono shrink-0">
                      {formatNumber(r.latitude.toFixed(2))}°, {formatNumber(r.longitude.toFixed(2))}°
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {[r.district?.[language as 'or'] || r.district?.en, r.state?.[language as 'or'] || r.state?.en].filter(Boolean).join(', ')}
                    {r.pincode ? ` • PIN: ${formatNumber(r.pincode)}` : ''}
                  </div>
                </div>
              </button>
            ))}

            {/* No search results feedback */}
            {query.trim().length >= 2 && results.length === 0 && !loading && (
              <div className="p-3 text-center text-xs text-slate-400 space-y-1">
                <p>{t.none}</p>
              </div>
            )}
          </div>

          {/* Bottom Sticky Action: Add Custom Village */}
          <div className="p-2 border-t border-slate-800 bg-cosmic-950 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setCustomName(query.trim());
                setShowCustomModal(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-cosmic-gold/20 to-yellow-400/20 hover:from-amber-500/30 hover:to-yellow-400/30 border border-cosmic-gold/40 text-amber-200 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4 text-cosmic-gold" />
              <span>{query.trim() ? `➕ "${query.trim()}" ${language === 'or' ? 'ସ୍ଥାନକୁ ଯୋଡ଼ନ୍ତୁ' : 'को कस्टम स्थान जोड़ें'}` : t.addCustom}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============ 4. CUSTOM LOCATION / VILLAGE BUILDER MODAL ============ */}
      {showCustomModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCustomModal(false); }}
        >
          <div className="w-full max-w-md bg-gradient-to-b from-cosmic-900 to-cosmic-950 border-2 border-cosmic-gold/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-100 space-y-4">
            <button
              type="button"
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'or' ? 'ଉନ୍ନତ ସ୍ଥାନ ଯୋଗ' : 'Advanced Location Builder'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-serif text-slate-100">
                {language === 'or' ? 'ନିଜ ଗାଁ ବା କଷ୍ଟମ୍ ସ୍ଥାନ ଯୋଡ଼ନ୍ତୁ' : language === 'hi' ? 'अपना गाँव या कस्टम स्थान जोड़ें' : 'Add Custom Village / Location'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'or' ? 'ସଠିକ୍ ଗ୍ରାମ ନାମ ଓ ଅକ୍ଷାଂଶ-ଦ୍ରାଘିମା ସହ ଜନ୍ମ କୁଣ୍ଡଳୀ ଓ ମେଳକ ତିଆରି କରନ୍ତୁ।' : 'Enter accurate village name and coordinates for precise Lagna & Milan calculation.'}
              </p>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'or' ? 'ଗାଁ / ସ୍ଥାନର ନାମ *' : 'Village / Place Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder={language === 'or' ? 'ଯଥା: କୋରେଇ, ଅସୁରେଶ୍ୱର, ଖଲ୍ଲିକୋଟ...' : 'e.g. Korei, Asureswar, Khalikote...'}
                  className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-bold focus:outline-none"
                />
              </div>

              {/* District Preset Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {language === 'or' ? 'ନିକଟତମ ଜିଲ୍ଲା କୋଅର୍ଡିନେଟ୍ସ ପ୍ରିସେଟ୍' : 'Nearest District Coordinates Preset'}
                </label>
                <select
                  value={customDistrict}
                  onChange={e => handleDistrictPreset(e.target.value)}
                  className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none cursor-pointer"
                >
                  {ALL_30_ODISHA_DISTRICTS.map(d => (
                    <option key={d.id} value={d.districtOr} className="bg-cosmic-950 text-slate-100">
                      {d.districtOr} ({d.nameEn}) • {d.lat.toFixed(2)}°N, {d.lon.toFixed(2)}°E
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {language === 'or' ? 'ଅକ୍ଷାଂଶ (Latitude °N)' : 'Latitude (°N)'}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={customLat}
                    onChange={e => setCustomLat(e.target.value)}
                    className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {language === 'or' ? 'ଦ୍ରାଘିମା (Longitude °E)' : 'Longitude (°E)'}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={customLon}
                    onChange={e => setCustomLon(e.target.value)}
                    className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {language === 'or' ? 'ରାଜ୍ୟ / ଦେଶ' : 'State / Country'}
                  </label>
                  <input
                    type="text"
                    value={customState}
                    onChange={e => setCustomState(e.target.value)}
                    className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {language === 'or' ? 'ପିନ୍‌କୋଡ୍ (Pincode - ଇଚ୍ଛାଧୀନ)' : 'Pincode (Optional)'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customPincode}
                    onChange={e => setCustomPincode(e.target.value)}
                    placeholder="751001"
                    className="w-full bg-cosmic-950 border border-slate-700 focus:border-cosmic-gold rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  {language === 'or' ? 'ବାତିଲ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-cosmic-gold to-yellow-400 text-cosmic-950 text-xs font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'or' ? '✓ ସେଭ୍ ଓ ଚୟନ କରନ୍ତୁ' : language === 'hi' ? '✓ सेव और चयन करें' : '✓ Save & Select'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};


