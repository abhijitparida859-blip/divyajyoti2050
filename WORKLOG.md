# ଦିବ୍ୟଜ୍ୟୋତି ୨୦୫୦ — Work Log / କାର୍ଯ୍ୟ ବିବରଣୀ

**Repository:** [abhijitparida859-blip/divyajyoti2050](https://github.com/abhijitparida859-blip/divyajyoti2050)
**Branch for this document:** `cline/thcrj3gp`
**Last updated:** 2026-10-31
**Scope:** every module currently in the codebase, commit-by-commit history, and the verification results produced on this branch.

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
| Test files | 57 (23 behavioural suites + 34 `_diag*` diagnostic harnesses) |
| Test cases | 196 |
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
| Astronomy | `julian.ts`, `ephemeris.ts`, `ayanamsha.ts` (Lahiri), `solar_lunar.ts` (sunrise/sunset) |
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

---

## 6. Verification run on this branch

Executed after a clean `npm install` on `cline/thcrj3gp` (Node/npm sandbox, container timezone **UTC**):

| Step | Command | Result |
| --- | --- | --- |
| Type check | `npx tsc --noEmit` | ✅ **PASS** — 0 errors |
| Unit tests | `npx vitest run` | ⚠️ **195 / 196 tests pass** — 56 / 57 files pass, 1 pre-existing failure (see §7) |
| Production build | `npm run build` (`tsc && vite build`) | ✅ **PASS** — 2,233 modules transformed in 8.72 s; `dist/index.html` 2.51 kB, CSS 223.61 kB (35.61 kB gzip), main JS 3,562.88 kB (833.93 kB gzip). Only warning: chunk > 500 kB (code-splitting suggestion). |

Raw `vitest` tail:

```
Test Files  1 failed | 56 passed (57)
     Tests  1 failed | 195 passed (196)
```

Behavioural suites that pass include `astronomy`, `panjika`, `odiaCalendar`, `multiYearEngineAudit`, `festivalAudit` (fails only on the TZ issue below), `advancedKundali`, `chartsView`, `yearlyForecast`, `milan`, `milanAdvanced`, `nameTransliteration`, `odiaTranslit`, `odiaScriptGuard`, `navigation`, `liveNavigation`, `routeEngine`, `globalGeo`, `mobileLocation`, `japaAudio`, `palmAutoScan`, `palmShastra`, `cosmos`, `appFullRender`.

> The 34 `_diag*.test.ts` files are **diagnostic harnesses** (they log tithi/sankranti scans for specific years such as 1975 and 2026). They are intentional and pass, but they are not assertions.

## 7. Known issues found during verification (not yet fixed)

### 7.1 Calendrical dates depend on the machine timezone (high impact)

`src/tests/festivalAudit.test.ts` fails in a UTC environment:

```
FAIL src/tests/festivalAudit.test.ts > All-Year 2026 Canonical Odia Festival Audit
AssertionError: expected undefined to deeply equal [ '2026-06-15' ]
 ❯ src/tests/festivalAudit.test.ts:24:42   expect(festivalDates['pahili_raja']).toEqual(['2026-06-15']);
```

Probing `calculateOdiaCalendarDay()` for 2026-06-12 → 06-19 shows the whole solar-day grid shifts with the host timezone:

| UTC host | | Asia/Kolkata host | |
| --- | --- | --- | --- |
| 2026-06-15 | `odiaSolarDay = 1`, festivals: `sankranti_asadha, raja_sankranti` | 2026-06-15 | `odiaSolarDay = 30`, festivals: `sabitri_amavasya, pahili_raja` |
| 2026-06-16 | `odiaSolarDay = 2`, `shesa_raja` | 2026-06-16 | `odiaSolarDay = 1`, `sankranti_asadha, raja_sankranti` |
| 2026-06-17 | `odiaSolarDay = 3`, `basumati_snana` | 2026-06-17 | `odiaSolarDay = 2`, `shesa_raja` |
| — | `pahili_raja` never emitted | — | `pahili_raja` correctly on 2026-06-15 ✅ |

With `TZ=Asia/Kolkata` the Raja Parba block is correct, but the same test then fails one assertion later:

```
AssertionError: expected [ '2026-06-29', '2026-06-30' ] to deeply equal [ '2026-06-30' ]
 ❯ src/tests/festivalAudit.test.ts:31:42   expect(festivalDates['snana_purnima']).toEqual(['2026-06-30']);
```

**Cause:** `calculateOdiaCalendarDay()` mixes host-local `Date` construction with IST-anchored solar longitude evaluation, so sunrise/solar-day/Mithuna-Sankranti boundaries land on different civil days for hosts that are not `Asia/Kolkata`. **Impact:** an Odia Panjika must always resolve dates in IST (Odisha civil time); a user or server outside IST can see festivals and solar days shifted by one day.

**Suggested fix (needs a dedicated change):** normalise every entry point in `core/panjika/odia_calendar_engine.ts` (and `panjika_engine.ts`) to `Asia/Kolkata` civil time before computing `solarRashiIdx`, `odiaSolarDay` and tithi-at-sunrise, then re-baseline `festivalAudit.test.ts`. Astronomical formulas should not be altered — only the civil-time anchoring.

### 7.2 `snana_purnima` can be emitted on two consecutive days

Under IST the festival scan collects `snana_purnima` for both 2026-06-29 and 2026-06-30, because the rule `isPurnima && (solarRashiIdx === 2 || (solarRashiIdx === 1 && degInRashi >= 25))` fires on both sunrise days that Purnima tithi spans. Panjika convention expects a single observance day (Purvahna/vyapini rule). Needs a "tithi at sunrise vs. vyapini" disambiguation, similar to the existing `isKshayaDwitya` handling for Ratha Yatra.

Neither issue was introduced by this branch — both are present on `main` at `c4f6234`. They are recorded here instead of being silently patched, because the fix touches core astronomical/calendar logic and should be reviewed separately.

### 7.3 Housekeeping — stale lockfile entries

`package-lock.json` still lists `@react-three/drei`, `@react-three/fiber` and their transitive packages (`@mediapipe/tasks-vision`, `@monogrid/gainmap-js`, …) even though neither is declared in `package.json` and nothing in `src/` imports them. A plain `npm install` prunes ~620 lines from the lockfile. Left untouched in this commit so the documentation diff stays reviewable.

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
2. `npx vitest run` must stay at **196 passing** (fix §7 rather than deleting assertions).
3. `npm run build` must succeed (chunk-size warning is acceptable).
4. Never hardcode English text where Odia or Hindi is expected — add the key to `or.json`, `hi.json` **and** `en.json` together (264 keys each today).
5. Preserve astronomical formulas and their explanatory comments; calendar bugs are fixed by civil-time anchoring, not by changing ephemeris maths.
6. Work happens on a `cline/*` branch; `main` is only updated through review.

---

### ଶେଷ କଥା (Closing note)

This document is the single place to see **what exists** in DivyaJyoti 2050 and **what state it is in**: 9 modules, 27 Kundali tabs, 46 engines, trilingual UI, type-check and production build green, 195/196 tests green, with the two calendar issues above documented for the next focused fix.

