# Mantra Audio Lane — YouTube link se app tak (Gayatri se shuru)

> Main YouTube se direct download **nahi** karta (ToS/copyright issue).
> Tum audio laake do, main uska 1-jap cut karke app me laga dunga.

## Step 1 — Tum karo (phone/PC se)

1. Gayatri wali video ka audio nikalo — koi bhi free
   "YouTube to MP3" site/app se, ya screen-record karke audio le lo.
2. Wo `.mp3` file mujhe yahan bhej do / is folder me rakh do:
   `tools/incoming/gayatri_full.mp3`
3. Saath me ye bata do:
   - **Male ya female voice?** (tumne kaha tha jo acha lage — sunke main bata dunga, par tumhari pasand final)
   - Video ka naam/channel (credit ke liye) — ye wali: Best Songs Music Studio

## Step 2 — Main karunga

1. Poori file sunke **sabse saaf 1 jap** (lagbhag 8 sec) dhoondunga.
2. `node tools/cut_mantra.cjs` se kaat ke `public/audio/gayatri.mp3` banaunga
   (~150KB, loop me kat-pit nahi hogi — fade laga hoga).
3. `mantra_library.ts` me Gayatri entry me jod dunga:
   `audio: { url: '/audio/gayatri.mp3', start: 0, end: 8.x, credit: '...' }`
4. Desktop app rebuild + tumko suna dunga. Pasand aaya to **next mantra**.

## Step 3 — Agla mantra ka order (suggestion)

Gayatri ke baad: Maha Mrityunjaya → Om → Hanuman Chalisa-beej →
Navagraha (Surya se Shani tak ek-ek karke). Ek-ek karke bhejte jao.

## Note — copyright

Personal use (tumhara khud ka app): OK + credit denge.
Play Store/public release: sirf copyright-free ya khud-recorded audio.
