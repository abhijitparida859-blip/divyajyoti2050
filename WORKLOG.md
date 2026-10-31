# ଦିବ୍ୟଜ୍ୟୋତି ୨୦୫୦ — Work Log / କାର୍ଯ୍ୟ ବିବରଣୀ

**Repository:** [abhijitparida859-blip/divyajyoti2050](https://github.com/abhijitparida859-blip/divyajyoti2050)
**Branch for this document:** `cline/thcrj3gp`
**Last updated:** 2026-10-31 (after the Issue #2 fix)
**Scope:** every module currently in the codebase, commit-by-commit history, the verification results, and the Issue #2 timezone/vyapini fix.

---

## ସାରାଂଶ (Quick summary)

| ଭାଷା | ସାରାଂଶ |
| --- | --- |
| **ଓଡ଼ିଆ** | ଦିବ୍ୟଜ୍ୟୋତି ୨୦୫୦ ଏକ ୧୦୦% ଅଫଲାଇନ୍ ଓଡ଼ିଆ ପାଞ୍ଜି ଓ ବୈଦିକ ଜନ୍ମ କୁଣ୍ଡଳୀ ପ୍ଲାଟଫର୍ମ — ୯ଟି ମୁଖ୍ୟ ବିଭାଗ, ୨୭ଟି କୁଣ୍ଡଳୀ ଟ୍ୟାବ୍, ୪୬ଟି ଗଣନା ଇଞ୍ଜିନ୍ ଏବଂ ତ୍ରିଭାଷୀ (ଓଡ଼ିଆ/ହିନ୍ଦୀ/ଇଂରାଜୀ) ସମର୍ଥନ। |
| **हिन्दी** | दिव्यज्योति 2050 एक 100% ऑफ़लाइन ओड़िया पंचांग एवं वैदिक जन्म कुंडली प्लेटफ़ॉर्म है — 9 मुख्य मॉड्यूल, 27 कुंडली टैब, 46 गणना इंजन और त्रिभाषी (ओड़िया/हिन्दी/अंग्रेज़ी) समर्थन। |
| **English** | DivyaJyoti 2050 is a 100% offline-first Odia Panjika & Vedic Janma Kundali platform — 9 top-level modules, 27 Kundali tabs, 46 calculation engines, full trilingual support. |

---

## 1. Repository snapshot

| Metric | Value |
| --- | --- |
| Stack | React 18.3 · TypeScript 5.6 · Vite 6 · TailwindCSS 3.4 · Three.js 0.170 · Vitest 2.1 |
| Extra libs | Leaflet 1.9 (geo maps), html2pdf.js + jsPDF + html2canvas (print/PDF), canvas-confetti, lucide-react |
| TypeScript/TSX source files | 212 |
| Total source lines (`src/**/*.ts(x)`) | 65,217 |
| Calculation engine layer (`src/core`) | 46 files · 14,690 lines (23 of them Jataka engines) |
| React components (`src/components`) | 83 `.tsx` files |
| Top-level app modules | 9 |
| Kundali (Jataka) tabs | 27 |
| Languages | Odia (`or`, primary) · Hindi (`hi`) · English (`en`) — 264 keys in each JSON |
| Panjika supported range | 1950 → 2050 (101 years, `PANJIKA_MIN_YEAR`/`PANJIKA_MAX_YEAR`) |
| Festival rule IDs in calendar engine | 76 |
| Test files | 58 (24 behavioural suites + 34 `_diag*` diagnostic harnesses) |
| Test cases | 205 — green in UTC, Asia/Kolkata and Australia/Sydney |
| Offline / packaging | PWA (`public/manifest.json` + `sw.js` service worker) and Android WebView wrapper (`android/`) |

---

## 2. The nine app modules

Navigation is defined in `src/components/layout/NavigationBar.tsx`; tab state lives in `src/App.tsx` (hash deep-links supported, e.g. `#jataka`, `#cosmos`).

| # | Tab | Odia | Key source |
| --- | --- | --- | --- |
| 1 | `panjika` | ପାଞ୍ଜିକା | `components/panjika/PanjikaView.tsx` |
| 2 | `calendar` | କ୍ୟାଲେଣ୍ଡର | `components/calendar/OdiaCalendarView.tsx` |
| 3 | `jataka` | ଜାତକ | `components/jataka/KundaliRenderer.tsx` |
| 4 | `cosmos` | ବ୍ରହ୍ମାଣ୍ଡ | `components/3d/CosmosView.tsx` |
| 5 | `milan` | ମିଳନ | `components/milan/MilanMatchView.tsx` |
| 6 | `mala` | ଡିଜିଟାଲ ମାଳା | `components/mala/DigitalMala108.tsx` |
| 7 | `meditation` | ଧ୍ୟାନ | `components/meditation/CalmStudio.tsx` |
| 8 | `todo` | କର୍ମ ଚକ୍ର | `components/todo/SmartVedicTodo.tsx` |
| 9 | `palm` | ହସ୍ତରେଖା | `components/palm/AdvancePalmReader.tsx` |

### 2.1 ପାଞ୍ଜିକା — Panjika

- Daily Panjika from `calculatePanjika(date, lat, lon)` (`core/panjika/panjika_engine.ts`): Tithi + paksha, Nakshatra with ruler & deity, Yoga, Karana, Vaara, sunrise/sunset, muhurtas, moon phase.
- Panjika **source selector** (`ODIA_PANJIKA_SOURCES` in `core/panjika/odisha_data.ts`): Kohinoor, Khadiratna, Radharaman, Bhagyajyoti, Biraja, Srimandir editions.
- Location aware: `ODISHA_COMPREHENSIVE_LOCATIONS` (`core/jataka/odisha_geography_db.ts`), `LocationSearchBox`, geo service (`core/geo/mobileLocationService.ts`); default Srikshetra Puri (19.8135 N, 85.8312 E).
- Home widgets reused here: `DivineHeroSection`, `DivineCommandCenter`, `MuhurtaMarquee`, `GrahaTransitStrip`, `ChoghadiyaHUD`, `MoonOrb3D`, `DailyShlokaCard`, `UpcomingFestivals`, `SevaMandala` (deep-links to other tabs), `CosmicBackground3D`.

### 2.2 କ୍ୟାଲେଣ୍ଡର — Odia Calendar (1950–2050)

- `core/panjika/odia_calendar_engine.ts` (4,227 lines) is the heart of the app: Odia solar months (`ODIA_SOLAR_MONTHS`), solar day, lunar month, tithi-at-sunrise, 76 festival rules, Odia numerals (`formatOdiaNum`), Tithi/Nakshatra/Rashi Odia maps, Digashula, Rashi Ghata, Choghadiya (day & night), Planetary Hora, daily Lagna table, Vedic Sankalpa data, Navagraha Sputa.
- Views: `OdiaCalendarView.tsx` (4,504 lines — month grid, day detail, `ODISHA_CITIES` selector), `OdiaCalendar3DViewer.tsx` (1,029 lines), `OdiaPrintableWallCalendar.tsx`, `OdiaAdvancedDailyGuidance.tsx` (743 lines of per-day guidance).
- Festival coverage includes the Jagannath cultural cycle (Snana Purnima → Anasara → Ratha/Bahuda Yatra), Raja Parba 4-day cycle, Sabitri Amavasya, Nuakhai, Prathamastami, Durga Puja cycle, Kartika Purnima, with government-holiday flags.
- Muhurta helpers: `core/panjika/muhurta.ts`.

### 2.3 ଜାତକ — Vedic Janma Kundali (27 tabs)

Entry form (`JatakaInputForm.tsx`) → `KundaliRenderer.tsx` (tab coordinator, print editions, cinema/3D mode).

Engines (`src/core/jataka/`, 23 files): `kundali_engine` (chart + houses), `shodashavarga_engine` (D1–D60), `shadbala_engine`, `ashtakavarga_engine` (Parashari Bhinna-Ashtakavarga tables, 337-bindu Sarvashtakavarga), `special_lagnas_engine` (Indu/Sri/Hora/Ghati/Upagraha), `vimshottari_dasha`, `avakhada_engine`, `janma_panchanga_engine`, `advanced_yogas_engine`, `bhava_analysis_engine`, `bhava_chalit_engine` (Sripati), `bhrigu_nandi_nadi_engine`, `jaimini_engine`, `kp_sublord_engine` (249 sub-lords), `life_domains_engine`, `nakshatra_sacred_engine`, `planetary_avasthas_engine`, `remedies_engine`, `vimsopaka_bala_engine`, `yearly_forecast_engine`, `daily_personal_panjika_engine`, plus `cities_db` / `odisha_geography_db` data.

Chart renderers: `KundaliCharts.tsx` (East/North/South/West + Varga switch), `Kundali3DView.tsx` (Three.js Bhachakra), `KundaliPrintView.tsx` + `PrintControls.tsx` (short / full-life / single-year print editions).

**The 27 tabs** (as grouped in `KundaliRenderer.tsx`):

| Group | Tabs |
| --- | --- |
| Core chart | Horoscope Summary, Kundali (D1–D60), Planetary Sphutas (DMS), Special & Indu Lagna |
| Panchanga | Janma Panchanga 5 Pillars, Avakhada & Ghataka Chakra |
| Strength | Vimsopaka Bala (20-pt), Shadbala 6-fold, Vargottama & Power Matrix, Ashtakavarga (337 bindus), Planetary Avasthas (3-fold) |
| Dasha & timing | Vimshottari Dasha 5-tier, Pratyantardasha timeline, Live Gochara & Sade Sati |
| Classical systems | Bhrigu Nandi Nadi, KP Sub-Lords (249), Jaimini Chara Karakas, Bhava Chalit (Sripati) |
| Life guidance | 12 Bhavas detailed analysis, Life Domains (career & wealth), Yogas & Doshas (50+), 27 Sacred Trees & Nakshatra, Daily Personal Astro-Guide, 365-Day Yearly Forecast |
| Output | Advance Charts & Graphs, Print Full Kundali (1-click), Vedic Remedies & Seva, Classical Life Predictions |

### 2.4 ବ୍ରହ୍ମାଣ୍ଡ — Cosmos 3D

- 4 sub-tabs in `components/3d/CosmosView.tsx`: `solar` (CosmicOrbChart3D — NASA JPL data, elliptical orbits, axial tilt), `globe` (GoogleEarthGlobeExplorer, 2,726 lines), `bigbang` (LiveBigBangSimulator, 1,616 lines), `encyclopedia` (CosmicEncyclopedia, 1,719 lines).
- Companion 3D explorers: Earth interior (`EarthInterior3DViewer` + data), Earth atmosphere (`EarthAtmosphere3DViewer` + data), space missions (`Mission3DViewer` + `spaceMissionsData`), pilgrimage routes (`PilgrimageRouteNavigator` + `routeEngineService`), live navigation cockpit (`LiveNavigationCockpit`), cosmic evolution (`CosmicEvolution3DViewer` + `cosmologyBookData`), planet viewer (`Planet3DViewer`, `nasaPhysicsData`, `planetTextures`).
- Live telemetry recomputed every minute from `calculateBirthChart()` for Puri and wrapped in `SafeErrorBoundary`.

### 2.5 ମିଳନ — Marriage matching

- `core/milan/milan_engine.ts`, `ashtakoot.ts` (all 8 Kootas with points/verdicts), `mangal_dosha.ts`; UI shows the koota table, dosha checks, domain scores, verdict and remedies.
- `MilanPickers.tsx` (752 lines) for bride/groom input, `MilanChartsView.tsx` for chart comparison, `MilanPrintSheet.tsx` for printable/PDF match sheet (html2pdf).

### 2.6 ଡିଜିଟାଲ ମାଳା — Japa / Mala

- `DigitalMala108.tsx` (108-bead counter, confetti on completion), `core/japa/mantra_library.ts` + `mantra_types.ts` (categorised mantra library), `japa_audio_engine.ts`, `custom_audio_storage.ts` (user-supplied mantra audio via `MantraAudioCutterModal.tsx`), `mantra_recommender.ts` (recommends mantras from today's astro signals via `calculateNavagrahaSputa`).
- Bundled audio in `public/audio/mantras/` (gayatri.mp3/wav, om.wav); tone synthesis in `core/audio/meditation_synthesizer.ts`.

### 2.7 ଧ୍ୟାନ — Meditation / Sadhana

- `CalmStudio.tsx` (1,062 lines): breath programs (`BREATH_PROGRAMS`, `MORE_BREATH`), sound programs (`SOUND_PROGRAMS`), phase hints, timers, streak/stats persisted in `localStorage` (`dj_sadhana_v1`), `BreathOrb3D.tsx` Three.js breathing orb, sunrise/sunset awareness from the Panjika engine.

### 2.8 କର୍ମ ଚକ୍ର — Smart Vedic Todo

- `SmartVedicTodo.tsx` (1,204 lines) with `KarmaChakra3D.tsx`, `VedicWatch3D.tsx` (464 lines) + `vedicWatchLogos.ts` (700 lines), Vedic date/time pickers (`VedicDatePickerModal`, `VedicTimePickerModal`), `core/todo/todoPlanner.ts` (muhurta-aware scheduling, priorities, frequencies) and `vedicAlarmAudio.ts` (alarm tones). Types in `types/todo.ts`.

### 2.9 ହସ୍ତରେଖା — Palm reading

- `AdvancePalmReader.tsx` (1,383 lines): trilingual Samudrika shastra for 7 Rekhas (ayu, buddhi, hridaya, bhagya, surya, vivaha, swasthya), 9 Parvats, 5 Hasta types, 5 finger tips, overall `overallNirnaya` verdict with upay (remedies) and source citations (`palmShastra1.ts`, `palmShastra2.ts`).
- `palmAutoScan.ts` + `palmPixel.ts` for image-based line detection, `PalmHero3D.tsx` hero visual, `usePalmStorage.ts` for local persistence.

---

## 3. Core engine layer (`src/core`, 46 files / 14,690 lines)

| Domain | Files |
| --- | --- |
| Astronomy | `julian.ts`, `ephemeris.ts`, `ayanamsha.ts` (Lahiri), `solar_lunar.ts` (sunrise/sunset), **`istTime.ts` (Odisha civil-time anchoring)** |
| Panjika | `panjika_engine.ts`, `odia_calendar_engine.ts`, `muhurta.ts`, `odisha_data.ts` |
| Jataka | 23 engines listed in §2.3 |
| Milan | `milan_engine.ts`, `ashtakoot.ts`, `mangal_dosha.ts` |
| Japa | `mantra_library.ts`, `mantra_types.ts`, `mantra_recommender.ts`, `japa_audio_engine.ts`, `custom_audio_storage.ts` |
| Meditation | `sadhanaCatalog.ts`, `sadhanaCatalog2.ts` |
| Todo | `todoPlanner.ts`, `vedicAlarmAudio.ts`, `vedicWatchLogos.ts` |
| Audio / Geo | `meditation_synthesizer.ts`, `mobileLocationService.ts` |

Shared types live in `src/types/` (`jataka.ts`, `panjika.ts`, `milan.ts`, `todo.ts`).

## 4. Languages & localization integrity

- `src/localization/i18n.tsx` — `I18nProvider` / `useI18n`, `ensureOdiaScript` guard, plus canonical maps: `RASHI_MAP`, `GRAHA_MAP`, `NAKSHATRA_MAP`, `YOGA_MAP`, `KARANA_MAP`, `VAARA_MAP`, `TITHI_NAME_MAP`, `DIGNITY_MAP`, `KOOTA_MAP`, `VERDICT_MAP`.
- `or.json` / `hi.json` / `en.json` — 264 keys each, kept in lock-step.
- `nameTransliteration.ts` (629 lines) — automatic English → Odia & Hindi name transliteration with live script preview (`transliterateName`, `getLocalizedNativeName`), wired into the Kundali form, overview dashboard, print view and print controls.
- `odiaTranslit.ts` — Odia transliteration helpers. Covered by `nameTransliteration.test.ts`, `odiaTranslit.test.ts`, `odiaScriptGuard.test.ts`.

---

## 5. Commit history — what has been built so far

| Commit | Date | Summary |
| --- | --- | --- |
| `c18b2e9` | 2026-10-21 | **Initial commit** — the full DivyaJyoti Kalia Panjika 2050 suite: 9 modules, all core engines, trilingual resources, PWA manifest/service worker, Android wrapper (`android/app/src/main/assets`), Windows launch scripts (`Start_DivyaJyoti.bat`, `launch_app.ps1`, `launch_silent.vbs`), static preview server (`serve_dist.cjs`), maintenance scripts (`audit_deep.cjs`, `setup_android.cjs`, `scripts/build_vedic_wallpapers.cjs`, `tools/cut_mantra.cjs`). |
| `f3995c2` | 2026-10-22 | **Sync — Copilot Cosmos 3D & Milan UI improvements**: reworked `CosmicOrbChart3D.tsx` (244 lines changed), `CosmosView.tsx`, `MoonOrb3D.tsx`, `JatakaInputForm.tsx`, `MilanMatchView.tsx`, `MilanPickers.tsx`, `MilanPrintSheet.tsx`, and global styles in `index.css`. |
| `5b19904` | 2026-10-22 | **Fix — Jataka profile header layout**: restored the horizontal single-row layout and stopped Odia/Hindi labels from wrapping vertically (`JatakaInputForm.tsx`, +21/−29). |
| `8265a8e` | 2026-10-23 | **Feature — automatic trilingual name transliteration**: new `src/localization/nameTransliteration.ts` (629 lines) with live script preview, wired into the Kundali form, overview dashboard, renderer, print view and print controls; new `src/tests/nameTransliteration.test.ts` (87 lines). |
| `c4f6234` | 2026-10-24 | **Enhance — photorealistic 3D Moon Observatory**: `MoonOrb3D.tsx` grew to 677 lines (+599/−136) with procedural 1024×512 lunar albedo + bump topography (Maria, Tycho rays, Copernicus), Fresnel limb corona, earthshine, tidal locking with libration and drag-to-inspect. `panjika_engine.ts` switched to the true astronomical disk-illumination formula `k = (1 − cos(elongation)) / 2`. |

Everything above is already on `main` and pushed to `origin`.

The Issue #2 fix (timezone anchoring + single-day festival observance, §7.1–§7.2) lands on top of this history on branch `cline/thcrj3gp` and is merged into `main` through a pull request.

---

## 6. Verification run on this branch

Executed after a clean `npm install` on `cline/thcrj3gp`:

| Step | Command | Result |
| --- | --- | --- |
| Type check | `npx tsc --noEmit` | ✅ **PASS** — 0 errors |
| Unit tests (UTC host) | `TZ=UTC npx vitest run` | ✅ **205 / 205 pass** (58 / 58 files) |
| Unit tests (IST host) | `TZ=Asia/Kolkata npx vitest run` | ✅ **205 / 205 pass** (58 / 58 files) |
| Unit tests (+11 host) | `TZ=Australia/Sydney npx vitest run` | ✅ **205 / 205 pass** (58 / 58 files) |
| Production build | `npm run build` (`tsc && vite build`) | ✅ **PASS** — 2,234 modules transformed in 8.28 s; CSS 223.61 kB (35.61 kB gzip), main JS 3,563.69 kB (834.24 kB gzip). Only warning: chunk > 500 kB (code-splitting suggestion). |

Behavioural suites include `astronomy`, `panjika`, `odiaCalendar`, `festivalAudit`, `multiYearEngineAudit`, `panjikaTimezone`, `advancedKundali`, `chartsView`, `yearlyForecast`, `milan`, `milanAdvanced`, `nameTransliteration`, `odiaTranslit`, `odiaScriptGuard`, `navigation`, `liveNavigation`, `routeEngine`, `globalGeo`, `mobileLocation`, `japaAudio`, `palmAutoScan`, `palmShastra`, `cosmos`, `appFullRender`.

> The 34 `_diag*.test.ts` files are **diagnostic harnesses** (they log tithi/sankranti scans for specific years such as 1975 and 2026). They are intentional and pass, but they are not assertions.

### Cross-timezone equivalence proof

A snapshot of the whole calendar — date, solar month/day, lunar month, tithi, nakshatra, festival ids and sankranti name for **10,592 days (29 years: 1950, 1975, 2000, 2015, 2026-2050)** — was generated on three hosts and compared:

| Comparison | Differing days |
| --- | --- |
| Legacy code on IST host → new code on IST host | 27 (all intentional festival dedupes, see §7.2) |
| New code on IST host → new code on **UTC** host | **0 / 10,592** |
| New code on IST host → new code on **Australia/Sydney** host | **0 / 10,592** |

No non-festival field changed at all, and **no festival disappeared from any year** (verified per festival id per year: 0 losses, 27 multi-day → single-day dedupes).

## 7. Issues found during verification

### 7.1 Calendrical dates depended on the machine timezone — ✅ FIXED

`src/tests/festivalAudit.test.ts` failed in a UTC environment:

```
FAIL src/tests/festivalAudit.test.ts > All-Year 2026 Canonical Odia Festival Audit
AssertionError: expected undefined to deeply equal [ '2026-06-15' ]
 ❯ src/tests/festivalAudit.test.ts:24:42   expect(festivalDates['pahili_raja']).toEqual(['2026-06-15']);
```

Probing `calculateOdiaCalendarDay()` for 2026-06-12 → 06-19 showed the whole solar-day grid shifting with the host timezone:

| UTC host | | Asia/Kolkata host | |
| --- | --- | --- | --- |
| 2026-06-15 | `odiaSolarDay = 1`, festivals: `sankranti_asadha, raja_sankranti` | 2026-06-15 | `odiaSolarDay = 30`, festivals: `sabitri_amavasya, pahili_raja` |
| 2026-06-16 | `odiaSolarDay = 2`, `shesa_raja` | 2026-06-16 | `odiaSolarDay = 1`, `sankranti_asadha, raja_sankranti` |
| 2026-06-17 | `odiaSolarDay = 3`, `basumati_snana` | 2026-06-17 | `odiaSolarDay = 2`, `shesa_raja` |
| — | `pahili_raja` never emitted | — | `pahili_raja` correctly on 2026-06-15 ✅ |

With `TZ=Asia/Kolkata` the Raja Parba block was correct, but the same test then failed one assertion later — the vyapini duplicate described in §7.2.

**Cause:** `calculateOdiaCalendarDay()` mixed host-local `Date` construction with IST-anchored solar-longitude evaluation, so sunrise/solar-day/Mithuna-Sankranti boundaries landed on different civil days for hosts that are not `Asia/Kolkata`. An Odia Panjika must always resolve dates in IST (Odisha civil time), whatever the user's or server's timezone is.

**Fix implemented (commit on `cline/thcrj3gp`):**

| File | Change |
| --- | --- |
| `src/core/astronomy/istTime.ts` **(new)** | Single source of truth for Odisha civil time: `IST_OFFSET_MINUTES`, `getCivilDateParts`, `getCivilDatePartsIn`, `getIstCivilDateParts`, `istInstantFromMinutes`, `getCivilWeekday`, `addCivilDays`, `getIstClockMinutes`, `formatIstClock`, `isDateCarrier`, `getClockMinutesIn`. |
| `src/core/astronomy/solar_lunar.ts` | `calculateSunTimes()` takes an explicit `timezoneOffsetMinutes` (Panjika engines pass IST). Day-of-year and the fractional-year term are now derived from the civil date in that timezone, so the same sunrise instant is produced on every host. NOAA formulas themselves untouched. |
| `src/core/panjika/odia_calendar_engine.ts` | Sunrise instant, previous-sunrise instant, purvahna/madhyahna/aparahna/pradosha/nishitha samples, "tomorrow" sankranti probe, Amavasya reference and weekday are all built from `civilParts` + IST minutes. Live choghadiya/hora highlights use IST wall-clock minutes. |
| `src/core/panjika/panjika_engine.ts` | Sunrise/sunset, tithi end time, vaara, `dateStr` and muhurta weekday are all expressed in IST; `calculatePanjika(instant)` is now a pure function of the instant. |
| `src/components/home/UpcomingFestivals.tsx` | Probes the next 30 days at **IST noon** of each civil day instead of the host-local time, so festival labels never shift with the host timezone. |

**Verification:** see the cross-timezone equivalence table in §6 — 0 differing days out of 10,592 for UTC and Sydney hosts, and only the 27 intentional dedupes versus the previous IST behaviour.

### 7.2 Tithi-bound festivals could be emitted on two consecutive days — ✅ FIXED

Under IST the scan collected `snana_purnima` for both 2026-06-29 and 2026-06-30:

```
AssertionError: expected [ '2026-06-29', '2026-06-30' ] to deeply equal [ '2026-06-30' ]
 ❯ src/tests/festivalAudit.test.ts:31:42   expect(festivalDates['snana_purnima']).toEqual(['2026-06-30']);
```

A tithi lasts ~24.5 h, so when it starts shortly before one sunrise and ends after the next one it is present at **two** sunrises. Purnima 2026 began 4 minutes before sunrise on 29 June. The same happens for Saptami on 17/18 October 2026 (the next assertion to fail), and a scan of 2026/2027 showed `snana_purnima` was the only Purnima-rule duplicate while other tithi-bound festivals duplicated in later years.

**Fix implemented:** a generic udaya-vyapini resolver inside `calculateOdiaCalendarDay()`:

```ts
const isTithiObservanceToday = (targetTithi: number) =>
  tithiNumber === targetTithi && getNextSunriseTithiNumber() !== targetTithi;
```

Every tithi-bound festival rule now uses `isTithiObservanceToday(n)` (and `isPurnimaObservance` for the Purnima rules), so a festival is emitted only on the **last** sunrise day holding its tithi. The next sunrise tithi is computed lazily and memoised, so the extra ephemeris work happens only on days whose tithi matches a rule. Ratha Yatra keeps its existing kshaya-Dwitiya fallback: `isTithiObservanceToday(2) || isKshayaDwitiya`.

**Effect across 29 years:** 27 festivals moved from two days to one (e.g. `snana_purnima` 2026-06-30, `maha_saptami` 2026-10-18, `durga_ashtami` 2027-10-08, `ratha_yatra` 2030, `dola_purnima` 2032/2033). **Zero festivals lost in any year**, and no other field changed.

**Regression tests added** — `src/tests/panjikaTimezone.test.ts` (9 tests) locks IST sunrise/sunset/tithi-end values, the IST solar-day/sankranti boundary, the weekday, single-day observance for Snana Purnima and Maha Saptami, the whole 2026 Durga Puja cycle, "no annual festival on more than one day", and Ratha Yatra on Asadha Shukla Dwitiya.

### 7.3 Housekeeping — stale lockfile entries (open)

`package-lock.json` still lists `@react-three/drei`, `@react-three/fiber` and their transitive packages (`@mediapipe/tasks-vision`, `@monogrid/gainmap-js`, …) even though neither is declared in `package.json` and nothing in `src/` imports them. A plain `npm install` prunes ~620 lines from the lockfile. Left untouched so the fix diff stays reviewable — worth a separate chore commit.

---

## 8. How to run

```bash
npm install          # install dependencies
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # tsc + vite production build → dist/
npm run preview      # serve the production build
npm run test         # vitest run (all suites)
npx tsc --noEmit     # type check only
```

Windows helpers: `Start_DivyaJyoti.bat`, `launch_app.ps1`, `launch_silent.vbs`. Android wrapper: `setup_android.cjs` then build `android/`. Static host: `node serve_dist.cjs` after `npm run build`.

## 9. Conventions for the next change

1. `npx tsc --noEmit` must report **0 errors**.
2. `npx vitest run` must stay at **205 passing** (58 files) — and must pass unchanged under `TZ=UTC`, `TZ=Asia/Kolkata` and `TZ=Australia/Sydney`:
   ```bash
   TZ=UTC npx vitest run && TZ=Asia/Kolkata npx vitest run && TZ=Australia/Sydney npx vitest run
   ```
3. `npm run build` must succeed (chunk-size warning is acceptable).
4. Never hardcode English text where Odia or Hindi is expected — add the key to `or.json`, `hi.json` **and** `en.json` together (264 keys each today).
5. Preserve astronomical formulas and their explanatory comments; calendar bugs are fixed by civil-time anchoring, not by changing ephemeris maths.
6. **Never** build a Panjika date from host-local `new Date(y, m, d, h, m)`. Use `istInstantFromMinutes(civilParts, minutes)` from `core/astronomy/istTime.ts`, and express every clock string in IST.
7. Tithi-bound festival rules must use `isTithiObservanceToday(n)` / `isPurnimaObservance`, never a bare `tithiNumber === n`, so udaya-vyapini days are resolved to a single observance day.
8. Work happens on a `cline/*` branch; `main` is only updated through review.

---

### ଶେଷ କଥା (Closing note)

This document is the single place to see **what exists** in DivyaJyoti 2050 and **what state it is in**: 9 modules, 27 Kundali tabs, 46 engines, trilingual UI, type-check and production build green, 205/205 tests green in three timezones, and both calendar defects from Issue #2 fixed with a 10,592-day cross-timezone equivalence proof.

