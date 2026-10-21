import { BREATH_PROGRAMS } from './sadhanaCatalog';
import type { BreathProgram, BreathPhaseKind, SoundProgram } from './sadhanaCatalog';

export const MORE_BREATH: BreathProgram[] = [
  {
    id: 'kapalabhati',
    rounds: 3,
    restSec: 20,
    phases: [
      { kind: 'inhale', seconds: 1 },
      { kind: 'exhale', seconds: 1 },
    ],
    name: { or: 'କପାଳଭାତି (ଅଗ୍ନି ଶୁଦ୍ଧି)', hi: 'कपालभाति (अग्नि शुद्धि)', en: 'Kapalabhati (Skull Shining Breath)' },
    goal: { or: 'ମସ୍ତିଷ୍କ କପାଳ ଶୁଦ୍ଧି ଓ ପାଚନ ଶକ୍ତି ଜାଗୃତି।', hi: 'मस्तिष्क कपाल शुद्धि एवं जठराग्नि प्रदीप्त।', en: 'Cranial detox and metabolic fire activation.' },
    source: 'Hatha-Yoga-Pradipika 2.35-2.37',
    caution: {
      or: 'ଗର୍ଭାବସ୍ଥା, ଉଚ୍ଚ ରକ୍ତଚାପ କିମ୍ବା ହୃଦରୋଗ ଥିଲେ ଏହି ତୀବ୍ର ଅଭ୍ୟାସ ବର୍ଜନ କରନ୍ତୁ।',
      hi: 'गर्भावस्था, उच्च रक्तचाप या हृदय रोग में इसका अभ्यास न करें।',
      en: 'Avoid in pregnancy, high blood pressure, hernia, or heart disease.',
    },
    posture: {
      or: 'ପଦ୍ମାସନ କିମ୍ବା ବଜ୍ରାସନରେ ସିଧା ବସନ୍ତୁ। ହାତ ଜ୍ଞାନ ମୁଦ୍ରାରେ ଆଣ୍ଠୁ ଉପରେ।',
      hi: 'पद्मासन या वज्रासन में रीढ़ सीधी रखें। हाथ ज्ञान मुद्रा में घुटनों पर।',
      en: 'Sit upright in Padmasana or Vajrasana with hands in Jnana Mudra.',
    },
    bestTime: {
      or: 'କେବଳ ସକାଳୁ ଖାଲି ପେଟରେ ଶୌଚ ପରେ।',
      hi: 'केवल प्रातःकाल शौच के पश्चात खाली पेट।',
      en: 'Strictly early morning on an empty stomach.',
    },
    steps: {
      or: [
        '୧. ପେଟକୁ ଭିତରକୁ ସଙ୍କୁଚିତ କରି ନାକପୁଡ଼ା ଦେଇ ଝଟ୍‌କା ସହ ଶ୍ୱାସ ବାହାରକୁ ଫିଙ୍ଗନ୍ତୁ (ସକ୍ରିୟ ରେଚକ)।',
        '୨. ଶ୍ୱାସ ଗ୍ରହଣ ସ୍ୱତଃସ୍ଫୂର୍ତ୍ତ (ନିଷ୍କ୍ରିୟ ପୂରକ) ହେବାକୁ ଦିଅନ୍ତୁ — କେବଳ ଛାଡ଼ିବା ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ।',
        '୩. ପ୍ରତି ସେକେଣ୍ଡରେ ଗୋଟିଏ ଷ୍ଟ୍ରୋକ୍ ହିସାବରେ ୩୦ ଷ୍ଟ୍ରୋକ୍ କରନ୍ତୁ ଏବଂ ୨୦ ସେକେଣ୍ଡ ବିଶ୍ରାମ ନିଅନ୍ତୁ।',
      ],
      hi: [
        '१. पेट की मांसपेशियों को रीढ़ की ओर झटका देकर नाक से तीव्र गति से श्वास बाहर फेंकें (सक्रिय रेचक)।',
        '२. श्वास अंदर स्वतः आने दें — भरने के लिए प्रयास न करें, केवल बाहर फेंकने पर ध्यान रखें।',
        '३. प्रति सेकंड १ स्ट्रोक की गति से अभ्यास करें और प्रत्येक चक्र के बाद २० सेकंड शांत विश्राम लें।',
      ],
      en: [
        '1. Forcefully exhale through both nostrils by briskly contracting your lower abdominal wall inward.',
        '2. Allow the inhalation to occur passively as your belly naturally rebounds.',
        '3. Maintain a rhythm of ~1 stroke per second, followed by a calm 20s rest period.',
      ],
    },
    benefits: {
      or: [
        'କପାଳ (ଅଗ୍ର ମସ୍ତିଷ୍କ) କୋଷଗୁଡ଼ିକୁ ଶୁଦ୍ଧ କରି ମୁଖମଣ୍ଡଳରେ ପ୍ରାକୃତିକ ତେଜ ଆଣେ।',
        'ଜଠରାଗ୍ନି ପ୍ରଦୀପ୍ତ କରି ପେଟ ଚର୍ବି ଓ ଗ୍ୟାସ୍ ସମସ୍ୟା ଦୂର କରେ।',
        'କଫ ଦୋଷ ଦୂର କରି ଶ୍ୱାସନଳୀକୁ ପରିଷ୍କାର ରଖେ।',
      ],
      hi: [
        'कपाल (मस्तिष्क) के अग्र भाग को निर्मल कर चेहरे पर ओज व आभा बढ़ाता है।',
        'जठराग्नि प्रदीप्त कर पेट की अतिरिक्त चर्बी व गैस-कब्ज दूर करता है।',
        'कफ दोष का शमन कर श्वसन तंत्र को पूरी तरह स्वच्छ करता है।',
      ],
      en: [
        'Purifies the frontal lobe of the brain, creating luminous mental clarity.',
        'Ignites digestive fire (jatharagni) and tones core abdominal organs.',
        'Eliminates excess Kapha mucus and clears the sinus cavities.',
      ],
    },
  },
  {
    id: 'sheetali',
    rounds: 9,
    restSec: 8,
    phases: [
      { kind: 'inhale', seconds: 5 },
      { kind: 'hold', seconds: 5 },
      { kind: 'exhale', seconds: 6 },
    ],
    name: { or: 'ଶୀତଳୀ (ଶୀତଳକାରୀ ପ୍ରାଣାୟାମ)', hi: 'शीतली (शीतलता प्रदायक प्राणायाम)', en: 'Sheetali (Cooling Breath)' },
    goal: { or: 'ଶରୀର ଓ ମନର ଅତ୍ୟଧିକ ଉତ୍ତାପ ଓ ପିତ୍ତ ଶାନ୍ତ କରିବା।', hi: 'शरीर व मन की अतिरिक्त गर्मी व पित्त शांत करना।', en: 'Soothe excess body heat and tranquilize Pitta dosha.' },
    source: 'Hatha-Yoga-Pradipika 2.54-2.56',
    posture: {
      or: 'ସୁଖାସନରେ ସଳଖ ବସନ୍ତୁ। ହାତ କୋଳରେ ରଖନ୍ତୁ।',
      hi: 'सुखासन में आरामदायक मुद्रा में बैठें। हाथ गोद में रखें।',
      en: 'Sit comfortably in Sukhasana with hands resting in your lap.',
    },
    bestTime: {
      or: 'ଗ୍ରୀଷ୍ମ ଋତୁରେ, ମଧ୍ୟାହ୍ନରେ କିମ୍ବା ଶରୀରରେ ଉତ୍ତାପ/ଏସିଡିଟି ବଢ଼ିଲେ।',
      hi: 'गर्मी के मौसम में, दोपहर या शरीर में जलन/एसिडिटी होने पर।',
      en: 'During hot weather, mid-day, or when experiencing heartburn/acidity.',
    },
    steps: {
      or: [
        '୧. ଜିଭକୁ ପାଟିରୁ ସାମାନ୍ୟ ବାହାର କରି ଏକ ନଳୀ (ଟ୍ୟୁବ୍) ଆକାରରେ ଗୋଲ କରନ୍ତୁ।',
        '୨. ସେହି ଜିଭ ନଳୀ ମାଧ୍ୟମରେ ୫ ସେକେଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ ଥଣ୍ଡା ପବନ ଚୁଚୁମି ଭିତରକୁ ନିଅନ୍ତୁ।',
        '୩. ମୁହଁ ବନ୍ଦ କରି ୫ ସେକେଣ୍ଡ ଶ୍ୱାସ ରୋକନ୍ତୁ (କୁମ୍ଭକ)।',
        '୪. ଉଭୟ ନାକପୁଡ଼ା ଦ୍ୱାରା ୬ ସେକେଣ୍ଡରେ ଧୀରେ ଶ୍ୱାସ ସମ୍ପୂର୍ଣ୍ଣ ଛାଡ଼ନ୍ତୁ (ରେଚକ)।',
      ],
      hi: [
        '१. जीभ को थोड़ा बाहर निकालकर एक नली (स्ट्रॉ/ट्यूब) की तरह गोल मोड़ें।',
        '२. जीभ की नली से ५ सेकंड तक ठंडी अमृतमयी वायु अंदर खींचें।',
        '३. मुंह बंद करें और ५ सेकंड तक शांत भाव से सांस रोकें (कुंभक)।',
        '४. दोनों नथुनों से ६ सेकंड में धीरे-धीरे पूरी सांस छोड़ें (रेचक)।',
      ],
      en: [
        '1. Extend your tongue slightly past your lips and curl its sides into an O-shaped straw.',
        '2. Inhale cool air through the curled tongue for 5s, savoring the chilling sensation.',
        '3. Close your mouth and hold your breath peacefully for 5s (Kumbhaka).',
        '4. Exhale smoothly through both nostrils over 6s (Rechaka).',
      ],
    },
    benefits: {
      or: [
        'ଶରୀରର ଆଭ୍ୟନ୍ତରୀଣ ଉତ୍ତାପ, ଏସିଡିଟି ଓ ପିତ୍ତ ଦୋଷକୁ ତତକ୍ଷଣାତ୍ ଶାନ୍ତ କରେ।',
        'ଅତ୍ୟଧିକ ତୃଷ୍ଣା ଓ କ୍ଷୁଧା ନିୟନ୍ତ୍ରଣ କରି ମାନସିକ ସନ୍ତୁଷ୍ଟି ଦିଏ।',
        'ଉଚ୍ଚ ରକ୍ତଚାପ କମାଇ ଶାନ୍ତ ଚିତ୍ତ ପ୍ରଦାନ କରେ।',
      ],
      hi: [
        'शरीर की गर्मी, एसिडिटी और पित्त विकार को तुरंत शांत करता है।',
        'अत्यधिक प्यास व भूख को नियंत्रित कर चित्त को तृप्त रखता है।',
        'रक्तचाप कम कर तंत्रिका तंत्र को शांति प्रदान करता है।',
      ],
      en: [
        'Rapidly cools core body temperature and pacifies Pitta inflammation and acidity.',
        'Quenches psychological thirst and balances hunger pangs.',
        'Soothes the sympathetic nervous system, lowering arterial blood pressure.',
      ],
    },
  },
  {
    id: 'sama-vritti',
    rounds: 10,
    restSec: 6,
    phases: [
      { kind: 'inhale', seconds: 4 },
      { kind: 'hold', seconds: 4 },
      { kind: 'exhale', seconds: 4 },
      { kind: 'holdEmpty', seconds: 4 },
    ],
    name: { or: 'ସମବୃତ୍ତି (ଚତୁର୍ଭୁଜ ବକ୍ସ ଶ୍ୱାସ ୪-୪-୪-୪)', hi: 'समवृत्ति (बॉक्स श्वास ४-४-४-४)', en: 'Sama-Vritti (Box Breathing 4-4-4-4)' },
    goal: { or: 'ଚତୁରଙ୍ଗ ସମାନ ଛନ୍ଦ ଦ୍ୱାରା ମନକୁ ପରମ ସ୍ଥିର କରିବା।', hi: 'समान चौकोर लय द्वारा चित्त वृत्तियों का पूर्ण निरोध।', en: 'Equal 4-part rhythm for supreme mental composure.' },
    source: 'Patanjali Yoga-Sutras 2.50 / Box Breathing',
    posture: {
      or: 'ମେରୁଦଣ୍ଡ ସଳଖ ରଖି ଯେକୌଣସି ଆସନରେ ସ୍ଥିର ଭାବେ ବସନ୍ତୁ।',
      hi: 'रीढ़ सीधी रखकर किसी भी आरामदायक आसन में बैठें।',
      en: 'Sit upright with a tall, grounded posture in any comfortable seat.',
    },
    bestTime: {
      or: 'ପରୀକ୍ଷା, ମହତ୍ତ୍ୱପୂର୍ଣ୍ଣ ନିଷ୍ପତ୍ତି ପୂର୍ବରୁ କିମ୍ବା ଅତ୍ୟଧିକ ଚାପ ସମୟରେ।',
      hi: 'परीक्षा, महत्वपूर्ण निर्णय से पूर्व या अत्यधिक तनाव के क्षणों में।',
      en: 'Before high-stakes decisions, presentations, or during intense pressure.',
    },
    steps: {
      or: [
        '୧. ନାକ ଦ୍ୱାରା ୪ ସେକେଣ୍ଡରେ ସୁଗମ ଭାବେ ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ (ପୂରକ)।',
        '୨. ଫୁସଫୁସ ପୂର୍ଣ୍ଣ ରଖି ୪ ସେକେଣ୍ଡ ଶ୍ୱାସ ଧରି ରଖନ୍ତୁ (ଆନ୍ତଃ କୁମ୍ଭକ)।',
        '୩. ୪ ସେକେଣ୍ଡରେ ନିୟନ୍ତ୍ରିତ ଭାବେ ସମ୍ପୂର୍ଣ୍ଣ ଶ୍ୱାସ ବାହାରକୁ ଛାଡ଼ନ୍ତୁ (ରେଚକ)।',
        '୪. ଫୁସଫୁସ ଖାଲି ଅବସ୍ଥାରେ ୪ ସେକେଣ୍ଡ ବାହାରେ ଶ୍ୱାସ ରୋକନ୍ତୁ (ବାହ୍ୟ କୁମ୍ଭକ)।',
      ],
      hi: [
        '१. दोनों नथुनों से ४ सेकंड में शांत भाव से श्वास अंदर भरें (पूरक)।',
        '२. फेफड़े भरकर ४ सेकंड बिना तनाव श्वास अंदर रोकें (आंतरिक कुंभक)।',
        '३. ४ सेकंड में धीरे-धीरे पूरी श्वास बाहर छोड़ें (रेचक)।',
        '४. फेफड़े खाली रखकर ४ सेकंड श्वास बाहर ही रोकें (बाह्य कुंभक)।',
      ],
      en: [
        '1. Inhale smoothly through your nose for 4s (Puraka).',
        '2. Hold your breath calmly with full lungs for 4s (Internal Kumbhaka).',
        '3. Exhale steadily through your nose for 4s (Rechaka).',
        '4. Hold empty with relaxed lungs for 4s (External Kumbhaka).',
      ],
    },
    benefits: {
      or: [
        'ହୃଦୟର ସ୍ପନ୍ଦନ ଓ କର୍ଟିସୋଲ୍ (Stress Hormone) କୁ ଦ୍ରୁତ ନିୟନ୍ତ୍ରଣ କରେ।',
        'ଆକସ୍ମିକ ଘବରାହଟ ଓ ପ୍ୟାନିକ୍ (Panic) ରୁ ମୁକ୍ତି ଦେଇ ସ୍ପଷ୍ଟ ଚିନ୍ତନ ଆଣେ।',
        'ମନର ଅସ୍ଥିରତା ନଷ୍ଟ କରି ଗଭୀର ଧ୍ୟାନର ଭିତ୍ତି ସ୍ଥାପନ କରେ।',
      ],
      hi: [
        'तनाव हार्मोन (कोर्टिसोल) घटाकर हृदय गति को तुरंत नियंत्रित करता है।',
        'घबराहट व पैनिक अटैक के क्षणों में मानसिक स्पष्टता व साहस प्रदान करता है।',
        'चित्त की चंचलता समाप्त कर ध्यान का सुगम मार्ग प्रशस्त करता है।',
      ],
      en: [
        'Rapidly de-escalates acute flight-or-fight response and drops cortisol levels.',
        'Used by elite performers and yogis to restore razor-sharp focus under pressure.',
        'Balances carbon dioxide / oxygen blood chemistry smoothly.',
      ],
    },
  },
  {
    id: 'bhastrika',
    rounds: 3,
    restSec: 20,
    phases: [
      { kind: 'inhale', seconds: 1 },
      { kind: 'exhale', seconds: 1 },
      { kind: 'hold', seconds: 8 },
    ],
    name: { or: 'ଭସ୍ତ୍ରିକା (ଧମନୀ / କମାର ଭାତି)', hi: 'भस्त्रिका (धौंकनी प्राणायाम)', en: 'Bhastrika (Bellows Breath)' },
    goal: { or: 'ପ୍ରାଣ ଅଗ୍ନି ପ୍ରଜ୍ୱଳନ ଓ ସମସ୍ତ ତ୍ରିଦୋଷ ସନ୍ତୁଳନ।', hi: 'प्राण अग्नि प्रज्वलन एवं समस्त त्रिदोष संतुलन।', en: 'Kindle cosmic pranic fire and equilibrate all three doshas.' },
    source: 'Hatha-Yoga-Pradipika 2.59-2.67',
    caution: {
      or: 'ହୃଦରୋଗ, ଉଚ୍ଚ ରକ୍ତଚାପ, ହାର୍ନିଆ କିମ୍ବା ମୁଣ୍ଡ ବୁଲାଇବା ସମସ୍ୟା ଥିଲେ ବର୍ଜନ।',
      hi: 'हृदयरोग, उच्च रक्तचाप, हर्निया या चक्कर आने पर यह तीव्र अभ्यास न करें।',
      en: 'Avoid in heart disease, severe hypertension, hernia, or vertigo.',
    },
    posture: {
      or: 'ବଜ୍ରାସନ ବା ପଦ୍ମାସନରେ ସମ୍ପୂର୍ଣ୍ଣ ସଳଖ ଓ ଦୃଢ଼ ଭାବେ ବସନ୍ତୁ।',
      hi: 'वज्रासन या पद्मासन में रीढ़ व छाती सीधी रखकर बैठें।',
      en: 'Sit upright with a proud chest in Vajrasana or Padmasana.',
    },
    bestTime: {
      or: 'ଶୀତ ଋତୁରେ କିମ୍ବା ପ୍ରାତଃକାଳରେ ଶରୀର ସୁସ୍ତ/ଆଳସ୍ୟ ଥିଲେ।',
      hi: 'शीत ऋतु में या प्रातःकाल जब शरीर में सुस्ती व आलस्य हो।',
      en: 'Early morning or during cold weather to dispel sluggish lethargy.',
    },
    steps: {
      or: [
        '୧. କମାରର ଭାତି ପରି ଛାତି ଫୁଲାଇ ବେଗରେ ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ (୧ ସେ) ଓ ଛାଡ଼ନ୍ତୁ (୧ ସେ)।',
        '୨. ଏହିପରି ୨୦-୩୦ ଟି ଦ୍ରୁତ ଶ୍ୱାସ ନେବା ପରେ ଶେଷରେ ଏକ ଗଭୀର ଶ୍ୱାସ ନିଅନ୍ତୁ।',
        '୩. ଶ୍ୱାସକୁ ୮ ସେକେଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ ଭିତରେ ଧରି ରଖନ୍ତୁ (କୁମ୍ଭକ)।',
        '୪. ଧୀରେ ଧୀରେ ଶ୍ୱାସ ଛାଡ଼ି ୨୦ ସେକେଣ୍ଡ ପୂର୍ଣ୍ଣ ବିଶ୍ରାମ ନିଅନ୍ତୁ।',
      ],
      hi: [
        '१. लुहार की धौंकनी की तरह छाती फुलाकर तीव्र गति से श्वास अंदर भरें (१ से) और बाहर छोड़ें (१ से)।',
        '२. २०-२५ तीव्र श्वासों के बाद अंत में एक गहरी श्वास अंदर खींचें।',
        '३. श्वास को ८ सेकंड तक शांत भाव से रोककर रखें (कुंभक)।',
        '४. धीरे-धीरे पूरी श्वास छोड़ें और २० सेकंड तक परम शांति का अनुभव करें।',
      ],
      en: [
        '1. Rhythmically pump breath in and out like a blacksmith’s bellows with equal vigor.',
        '2. After 20-30 vigorous cycles, take one slow, deep, complete inhalation.',
        '3. Retain the breath smoothly for 8s (Kumbhaka), channeling warmth inward.',
        '4. Exhale softly and rest completely for 20s to absorb the oxygen surge.',
      ],
    },
    benefits: {
      or: [
        'ଶରୀରର ପ୍ରତ୍ୟେକ କୋଷରେ ପ୍ରଚୁର ଅମ୍ଳଜାନ ପହଞ୍ଚାଇ ରକ୍ତକୁ ଶୁଦ୍ଧ କରେ।',
        'ବାତ, ପିତ୍ତ ଓ କଫ — ଏହି ତିନୋଟି ଦୋଷକୁ ପରସ୍ପର ସନ୍ତୁଳିତ କରେ।',
        'କୁଣ୍ଡଳିନୀ ଶକ୍ତି ଜାଗୃତି ଓ ପ୍ରାଣାୟାମ ସାଧନାରେ ଉଚ୍ଚ ସୋପାନ ପ୍ରଦାନ କରେ।',
      ],
      hi: [
        'शरीर की प्रत्येक कोशिका में शुद्ध ऑक्सीजन पहुंचाकर रक्त शोधन करता है।',
        'वात, पित्त और कफ तीनों शारीरिक दोषों को सम रखता है।',
        'मस्तिष्क को ऊर्जावान बनाकर आलस्य और अवसाद को जड़ से मिटाता है।',
      ],
      en: [
        'Floods every body cell with fresh oxygen and boosts red blood cell vitality.',
        'Harmonizes all three Ayurvedic constitutional doshas (Vata, Pitta, Kapha).',
        'Ignites vitality, eradicates seasonal sluggishness, and awakens spiritual energy.',
      ],
    },
  },
  {
    id: 'sheetkari',
    rounds: 9,
    restSec: 8,
    phases: [
      { kind: 'inhale', seconds: 4 },
      { kind: 'hold', seconds: 6 },
      { kind: 'exhale', seconds: 6 },
    ],
    name: { or: 'ଶୀତ୍କାରୀ (ଶୀତଳ ସୀତ୍କାର)', hi: 'शीत्कारी (शीतकारी प्राणायाम)', en: 'Sheetkari (Hissing Cooling Breath)' },
    goal: { or: 'ଦାନ୍ତ ମାଧ୍ୟମରେ ଶରୀର ଓ ମନକୁ ଅତ୍ୟନ୍ତ ଥଣ୍ଡା ଓ ଶାନ୍ତ ରଖିବା।', hi: 'दांतों के माध्यम से शीतलता का संचार व पित्त शांति।', en: 'Cooling the nervous system via dental airflow.' },
    source: 'Gheranda-Samhita 5.80-5.82',
    posture: {
      or: 'ସୁଖାସନରେ ସଳଖ ବସି ମୁଖମଣ୍ଡଳକୁ ସହଜ ରଖନ୍ତୁ।',
      hi: 'सुखासन में सीधे बैठें और चेहरे की मांसपेशियों को ढीला रखें।',
      en: 'Sit upright with an easy spine and relaxed facial muscles.',
    },
    bestTime: {
      or: 'ଗ୍ରୀଷ୍ମ ଋତୁ କିମ୍ବା ଶରୀରରେ ଜଳାପୋଡ଼ା / କ୍ରୋଧ ଅନୁଭବ ହେଲେ।',
      hi: 'गर्मी के दिनों में या शरीर में जलन, प्यास अथवा क्रोध के समय।',
      en: 'Hot summer afternoons or when feeling flushed, heated, or irritated.',
    },
    steps: {
      or: [
        '୧. ଉପର ଓ ତଳ ଦାନ୍ତକୁ ପରସ୍ପର ସହ ହାଲୁକା ଭାବେ ଛୁଆଇଁ ରଖନ୍ତୁ ଏବଂ ଓଠ ଖୋଲନ୍ତୁ।',
        '୨. ଦାନ୍ତ ସନ୍ଧି ଦେଇ "ସୀ-ସୀ..." ଶବ୍ଦ କରି ୪ ସେକେଣ୍ଡ ଥଣ୍ଡା ପବନ ଭିତରକୁ ଟାଣନ୍ତୁ।',
        '୩. ମୁହଁ ବନ୍ଦ କରି ୬ ସେକେଣ୍ଡ ଶ୍ୱାସ ରୋକନ୍ତୁ (କୁମ୍ଭକ)।',
        '୪. ଉଭୟ ନାକପୁଡ଼ା ଦ୍ୱାରା ୬ ସେକେଣ୍ଡରେ ଧୀରେ ଶ୍ୱାସ ଛାଡ଼ନ୍ତୁ (ରେଚକ)।',
      ],
      hi: [
        '१. ऊपर और नीचे के दांतों को हल्का सा जोड़ें और होंठों को खुला रखें।',
        '२. दांतों के बीच से "सी-सी..." की ध्वनि के साथ ४ सेकंड ठंडी हवा अंदर खींचें।',
        '३. मुंह बंद करके ६ सेकंड तक श्वास रोककर रखें (कुंभक)।',
        '४. दोनों नथुनों से ६ सेकंड में शांत भाव से श्वास बाहर छोड़ें (रेचक)।',
      ],
      en: [
        '1. Lightly touch your upper and lower teeth together while parting your lips in a gentle smile.',
        '2. Inhale cool air through the crevices of your teeth with a soft hissing sound for 4s.',
        '3. Close your mouth and hold your breath peacefully for 6s (Kumbhaka).',
        '4. Exhale smoothly and slowly through both nostrils for 6s (Rechaka).',
      ],
    },
    benefits: {
      or: [
        'ଶୀତଳୀ ପ୍ରାଣାୟାମ ଯେଉଁମାନେ ଜିଭ ମୋଡ଼ି ପାରନ୍ତି ନାହିଁ, ସେମାନଙ୍କ ପାଇଁ ଏହା ସର୍ବୋତ୍ତମ ବିକଳ୍ପ।',
        'ମୁଖ ଗହ୍ୱର, ଦାନ୍ତ ମାଢ଼ି ଓ ତଣ୍ଟିର ଜ୍ୱାଳା ଶାନ୍ତ କରେ।',
        'ଭାବପ୍ରବଣତା, କ୍ରୋଧ ଓ ଉଚ୍ଚ ରକ୍ତଚାପକୁ ପ୍ରଶମିତ କରେ।',
      ],
      hi: [
        'जो लोग जीभ गोल नहीं मोड़ पाते, उनके लिए यह शीतली का सर्वोत्तम विकल्प है।',
        'मुख, मसूड़ों और गले की गर्मी व जलन को शांत करता है।',
        'क्रोध, तनाव और अत्यधिक बेचैनी को तुरंत दूर करता है।',
      ],
      en: [
        'Accessible cooling alternative for practitioners who cannot roll their tongue for Sheetali.',
        'Soothes mouth inflammation, gum tenderness, and throat irritation.',
        'Pacifies emotional heat, stress-induced flushing, and irritability.',
      ],
    },
  },
  {
    id: 'dirgha',
    rounds: 7,
    restSec: 6,
    phases: [
      { kind: 'inhale', seconds: 6 },
      { kind: 'exhale', seconds: 6 },
    ],
    name: { or: 'ଦୀର୍ଘ ଶ୍ୱାସ (ତ୍ରିଭାଗୀୟ ଯୌଗିକ ଶ୍ୱାସ)', hi: 'दीर्घ श्वास (त्रि-स्तरीय यौगिक श्वास)', en: 'Dirgha (Three-Part Yogic Breath)' },
    goal: { or: 'ଫୁସଫୁସର ସମ୍ପୂର୍ଣ୍ଣ ୧୦୦% କ୍ଷମତା ଜାଗୃତି ଓ ଗଭୀର ସ୍ଥିରତା।', hi: 'फेफड़ों की १००% पूर्ण क्षमता का उपयोग व विश्राम।', en: 'Complete 3-chamber lung expansion and restorative calm.' },
    source: 'Patanjali Yoga-Sutras 2.49-2.51',
    posture: {
      or: 'ଶବାସନରେ ଶୋଇ କିମ୍ବା ଆରାମଦାୟକ ଆସନରେ ବସନ୍ତୁ। ଗୋଟିଏ ହାତ ପେଟରେ ଓ ଅନ୍ୟଟି ଛାତିରେ ରଖନ୍ତୁ।',
      hi: 'शवासन में लेटकर या आरामदायक आसन में बैठें। एक हाथ पेट पर व दूसरा छाती पर रखें।',
      en: 'Lie down in Shavasana or sit comfortably. Place one hand on belly, one on chest.',
    },
    bestTime: {
      or: 'ଦିନର ଯେକୌଣସି ସମୟରେ, ବିଶେଷକରି କ୍ଳାନ୍ତି ବା ଚିନ୍ତା ସମୟରେ।',
      hi: 'दिन में कभी भी, विशेषकर थकान या मानसिक तनाव के समय।',
      en: 'Any time of day to decompress, reset energy, or unwind before sleep.',
    },
    steps: {
      or: [
        '୧. ୬ ସେକେଣ୍ଡର ପୂରକକୁ ୩ ଭାଗରେ ନିଅନ୍ତୁ: ପ୍ରଥମେ ନାଭି/ପେଟ ଫୁଲାନ୍ତୁ, ପରେ ପଞ୍ଜରା କାନ୍ଥ ପ୍ରସାରିତ କରନ୍ତୁ, ଶେଷରେ ଉପର ଛାତି ଭରନ୍ତୁ।',
        '୨. ୬ ସେକେଣ୍ଡର ରେଚକ ଓଲଟା କ୍ରମରେ କରନ୍ତୁ: ପ୍ରଥମେ ଉପର ଛାତି ଖାଲି କରନ୍ତୁ, ପରେ ପଞ୍ଜରା, ଓ ଶେଷରେ ପେଟ ଭିତରକୁ ନିଅନ୍ତୁ।',
        '୩. ଶ୍ୱାସ ପ୍ରକ୍ରିୟାକୁ ଏକ ସୁମଧୁର ତରଙ୍ଗ ପରି ସୁଗମ ରଖନ୍ତୁ।',
      ],
      hi: [
        '१. ६ सेकंड के पूरक को ३ चरणों में भरें: पहले नाभि/पेट फुलाएं, फिर पसलियां, अंत में ऊपरी छाती।',
        '२. ६ सेकंड के रेचक को उल्टे क्रम में छोड़ें: पहले छाती खाली करें, फिर पसलियां, अंत में पेट अंदर खींचें।',
        '३. पूरी प्रक्रिया को एक शांत समुद्री लहर की भांति सहज व निर्बाध रखें।',
      ],
      en: [
        '1. Inhale continuously over 6s in 3 fluid zones: expand lower belly, widen middle ribcage, and lift upper chest.',
        '2. Exhale smoothly over 6s in reverse: relax upper collarbones, narrow ribcage, and draw navel toward spine.',
        '3. Let the breath move like a gentle ocean wave without any jerking.',
      ],
    },
    benefits: {
      or: [
        'ଫୁସଫୁସର ସବୁଠୁ ତଳ ଭାଗ (Lower Lobes) କୁ ଅମ୍ଳଜାନ ପହଞ୍ଚାଇ ପୂର୍ଣ୍ଣ ପ୍ରାଣ ଶକ୍ତି ଦିଏ।',
        'ରକ୍ତଚାପ ଓ ମାଂସପେଶୀର ଟେନସନ୍‌କୁ ଶିଥିଳ କରେ।',
        'ଶରୀର ଓ ମନକୁ ବର୍ତ୍ତମାନ ମୁହୂର୍ତ୍ତରେ ସ୍ଥିର କରିବା ପାଇଁ ସର୍ବୋତ୍ତମ ମୂଳଦୁଆ।',
      ],
      hi: [
        'फेफड़ों के निचले हिस्सों तक ऑक्सीजन पहुंचाकर प्राण शक्ति को १००% सक्रिय करता है।',
        'मांसपेशियों का तनाव और चिंताजन्य खिंचाव तुरंत समाप्त करता है।',
        'मन को वर्तमान क्षण में स्थिर करने के लिए प्राणायाम का सर्वश्रेष्ठ आधार।',
      ],
      en: [
        'Ventilates lower lung lobes that remain dormant during shallow chest breathing.',
        'Dissolves muscular tension in diaphragm, shoulders, and chest.',
        'Foundational yogic practice that anchors attention effortlessly into the present.',
      ],
    },
  },
];

export const PHASE_ACTION_HINT: Record<BreathPhaseKind, Record<'or' | 'hi' | 'en', string>> = {
  inhale: {
    or: 'ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ ↗',
    hi: 'श्वास अंदर भरें ↗',
    en: 'Breathe In ↗',
  },
  hold: {
    or: 'ଶ୍ୱାସ ଧରି ରଖନ୍ତୁ ⏸',
    hi: 'श्वास रोक कर रखें ⏸',
    en: 'Hold Breath ⏸',
  },
  exhale: {
    or: 'ଶ୍ୱାସ ବାହାରକୁ ଛାଡ଼ନ୍ତୁ ↘',
    hi: 'श्वास बाहर छोड़ें ↘',
    en: 'Breathe Out ↘',
  },
  holdEmpty: {
    or: 'ବାହାରେ ରୋକି ରଖନ୍ତୁ ⏸',
    hi: 'श्वास बाहर रोकें ⏸',
    en: 'Hold Empty ⏸',
  },
  rest: {
    or: 'ସାଧାରଣ ଶ୍ୱାସ ଓ ବିଶ୍ରାମ 🌿',
    hi: 'सामान्य श्वास व विश्राम 🌿',
    en: 'Relax & Breathe Normally 🌿',
  },
};

export const SOUND_PROGRAMS: SoundProgram[] = [
  {
    id: 'om-136',
    carrierHz: 136.1,
    volume: 0.35,
    name: { or: '୧୩୬.୧ Hz ଓଁକାର', hi: '१३६.१ Hz ओंकार', en: '136.1 Hz Om' },
    desc: { or: 'ପୃଥିବୀ କକ୍ଷ ଅକ୍ଟେଭ୍।', hi: 'पृथ्वी कक्षा अष्टक।', en: 'Earth-orbit octave.' },
    source: 'Hans Cousto Cosmic Octave',
    category: 'cosmic',
    chakra: { or: 'ଓଁକାର • ପୃଥିବୀ ଅଷ୍ଟକ', hi: 'ओंकार • पृथ्वी अष्टक', en: 'Cosmic Om • Earth Orbit' },
    benefit: { or: 'ଗଭୀର ଆତ୍ମିକ ଶାନ୍ତି, ଭୟମୁକ୍ତି ଓ ପ୍ରଶାନ୍ତ ମନ।', hi: 'गहरी आत्मिक शांति, भयमुक्ति व मानसिक ठहराव।', en: 'Deep soul tranquility, grounding and peaceful stillness.' },
    color: '#EAB308',
  },
  {
    id: 'schumann',
    carrierHz: 432,
    beatHz: 7.83,
    volume: 0.3,
    name: { or: '୪୩୨+୭.୮୩ ଶୁମାନ', hi: '४३२+७.८३ शुमान', en: '432+7.83 Schumann' },
    desc: { or: 'ପୃଥିବୀ ଅନୁନାଦ।', hi: 'पृथ्वी अनुनाद।', en: 'Earth resonance.' },
    source: 'W.O. Schumann 1952',
    category: 'cosmic',
    chakra: { or: 'ଆଲଫା ମସ୍ତିଷ୍କ ତରଙ୍ଗ (୭.୮୩ Hz)', hi: 'अल्फा मस्तिष्क तरंग (७.८३ Hz)', en: 'Alpha Brainwave (7.83 Hz)' },
    benefit: { or: 'ପୃଥିବୀର ପ୍ରାକୃତିକ ହୃଦ୍‌ସ୍ପନ୍ଦନ ସହ ଏକତ୍ୱ ଓ ପ୍ରାକୃତିକ ଆରୋଗ୍ୟ।', hi: 'पृथ्वी के प्राकृतिक स्पंदन से समन्वय व सहज हीलिंग।', en: 'Harmonizes mind with Earth electromagnetic pulse, induces Alpha state.' },
    color: '#38BDF8',
  },
  {
    id: 's396',
    carrierHz: 396,
    volume: 0.32,
    name: { or: '୩୯୬ Hz ମୂଳ', hi: '३९६ Hz मूल', en: '396 Hz root' },
    desc: { or: 'ଭୟ ମୁକ୍ତି।', hi: 'भय मुक्ति।', en: 'Fear release.' },
    source: 'Solfeggio UT',
    category: 'chakra',
    chakra: { or: '୧ମ ଚକ୍ର: ମୂଳାଧାର (Root)', hi: '१म चक्र: मूलाधार (Root)', en: '1st Chakra: Muladhara (Root)' },
    benefit: { or: 'ଭୟ, ଅସୁରକ୍ଷା ଓ ଅପରାଧ ବୋଧରୁ ମୁକ୍ତି; ପୃଥିବୀ ସହ ଦୃଢ଼ ସଂଯୋଗ।', hi: 'भय, असुरक्षा व अपराध बोध से मुक्ति; स्थिरता।', en: 'Liberates from subconscious fear & guilt, establishes deep grounding.' },
    color: '#EF4444',
  },
  {
    id: 's417',
    carrierHz: 417,
    volume: 0.32,
    name: { or: '୪୧୭ Hz ପରିବର୍ତ୍ତନ', hi: '४१७ Hz परिवर्तन', en: '417 Hz change' },
    desc: { or: 'ପୁରୁଣା ଛାଡ଼ିବା।', hi: 'पुराना छूटना।', en: 'Release old habits.' },
    source: 'Solfeggio RE',
    category: 'chakra',
    chakra: { or: '୨ୟ ଚକ୍ର: ସ୍ୱାଧିଷ୍ଠାନ (Sacral)', hi: '२य चक्र: स्वाधिष्ठान (Sacral)', en: '2nd Chakra: Swadhisthana (Sacral)' },
    benefit: { or: 'ନକାରାତ୍ମକ ସ୍ମୃତି ଓ ଅବରୋଧ ଦୂର କରି ନୂତନ ସକାରାତ୍ମକ ପରିବର୍ତ୍ତନ।', hi: 'नकारात्मक ऊर्जा दूर कर सकारात्मक बदलाव को प्रेरित करता है।', en: 'Facilitates positive change, clears lingering emotional trauma.' },
    color: '#F97316',
  },
  {
    id: 's528',
    carrierHz: 528,
    volume: 0.3,
    name: { or: '୫୨୮ Hz ହୃଦୟ', hi: '५२८ Hz हृदय', en: '528 Hz heart' },
    desc: { or: 'ପ୍ରେମ-କରୁଣା।', hi: 'प्रेम-करुणा।', en: 'Love-compassion.' },
    source: 'Solfeggio MI',
    category: 'chakra',
    chakra: { or: 'ମିରାକଲ୍ ତରଙ୍ଗ (Miracle Tone)', hi: 'मिरेकल टोन (Miracle Tone)', en: 'Transformation & Miracle Tone' },
    benefit: { or: 'କୋଷୀୟ ସ୍ତରରେ ଆରୋଗ୍ୟ, ପ୍ରେମ-କରୁଣା ଜାଗୃତି ଓ ଚମତ୍କାର ଶକ୍ତି।', hi: 'कोशिकीय स्तर पर उपचार, प्रेम-करुणा व रूपांतरण की ऊर्जा।', en: 'Cellular transformation, emotional healing, and pure love resonance.' },
    color: '#FACC15',
  },
  {
    id: 's639',
    carrierHz: 639,
    volume: 0.3,
    name: { or: '୬୩୯ Hz ସମ୍ପର୍କ', hi: '६३९ Hz संबंध', en: '639 Hz harmony' },
    desc: { or: 'ସମ୍ପର୍କ ସନ୍ତୁଳନ।', hi: 'संबंध संतुलन।', en: 'Relationship balance.' },
    source: 'Solfeggio FA',
    category: 'chakra',
    chakra: { or: '୪ର୍ଥ ଚକ୍ର: ଅନାହତ (Heart)', hi: '४र्थ चक्र: अनाहत (Heart)', en: '4th Chakra: Anahata (Heart)' },
    benefit: { or: 'ପାରସ୍ପରିକ ସମ୍ପର୍କରେ ମଧୁରତା, ପ୍ରେମ, ସହାନୁଭୂତି ଓ କ୍ଷମାଶୀଳତା।', hi: 'संबंधों में सौहार्द, आपसी समझ, प्रेम व क्षमाशीलता।', en: 'Harmonious relationships, interpersonal empathy, and heart coherence.' },
    color: '#10B981',
  },
  {
    id: 's741',
    carrierHz: 741,
    volume: 0.3,
    name: { or: '୭୪୧ Hz ବାଣୀ', hi: '७४१ Hz वाणी', en: '741 Hz speech' },
    desc: { or: 'ସତ୍ୟ ଅଭିବ୍ୟକ୍ତି।', hi: 'सत्य अभिव्यक्ति।', en: 'Truthful expression.' },
    source: 'Solfeggio SOL',
    category: 'chakra',
    chakra: { or: '୫ମ ଚକ୍ର: ବିଶୁଦ୍ଧ (Throat)', hi: '५म चक्र: विशुद्ध (Throat)', en: '5th Chakra: Vishuddha (Throat)' },
    benefit: { or: 'ସତ୍ୟବାଦୀ ଅଭିବ୍ୟକ୍ତି, ବାକ୍-ସିଦ୍ଧି ଓ ସମସ୍ୟାର ସହଜ ସମାଧାନ।', hi: 'सत्य अभिव्यक्ति, वाक शुद्धि व रचनात्मक विचार।', en: 'Pure truthful expression, intuition, problem solving and detoxification.' },
    color: '#0EA5E9',
  },
  {
    id: 's852',
    carrierHz: 852,
    volume: 0.3,
    name: { or: '୮୫୨ Hz ଅନ୍ତର୍ଦୃଷ୍ଟି', hi: '८५२ Hz अंतर्दृष्टि', en: '852 Hz intuition' },
    desc: { or: 'ଆଜ୍ଞା ଧ୍ୟାନ।', hi: 'आज्ञा ध्यान।', en: 'Ajna focus.' },
    source: 'Solfeggio LA',
    category: 'chakra',
    chakra: { or: '୬ଷ୍ଠ ଚକ୍ର: ଆଜ୍ଞା (Third Eye)', hi: '६ष्ठ चक्र: आज्ञा (Third Eye)', en: '6th Chakra: Ajna (Third Eye)' },
    benefit: { or: 'ତୃତୀୟ ନେତ୍ର ଜାଗୃତି, ଅନ୍ତର୍ଜ୍ଞାନ ଓ ଉଚ୍ଚ ଆଧ୍ୟାତ୍ମିକ ଧ୍ୟାନ ସ୍ଥିରତା।', hi: 'तीसरा नेत्र जागरण, अंतर्ज्ञान व गहरा ध्यान।', en: 'Awakens third eye intuition, elevates inner vision and spiritual focus.' },
    color: '#6366F1',
  },
  {
    id: 's963',
    carrierHz: 963,
    volume: 0.28,
    name: { or: '୯୬୩ Hz ମୌନ', hi: '९६३ Hz मौन', en: '963 Hz stillness' },
    desc: { or: 'ଉଚ୍ଚ ମୌନ।', hi: 'उच्च मौन।', en: 'High stillness.' },
    source: 'Extended solfeggio crown',
    category: 'chakra',
    chakra: { or: '୭ମ ଚକ୍ର: ସହସ୍ରାର (Crown)', hi: '७म चक्र: सहस्रार (Crown)', en: '7th Chakra: Sahasrara (Crown)' },
    benefit: { or: 'ପରମ ଦିବ୍ୟ ଚୈତନ୍ୟ, ବ୍ରହ୍ମ ସଂଯୋଗ ଓ ନିଃଶବ୍ଦ ପୂର୍ଣ୍ଣ ମୌନ।', hi: 'परम चेतना, ब्रह्मांडीय एकात्मता व आत्म-साक्षात्कार।', en: 'Crown chakra activation, pure cosmic oneness and spiritual bliss.' },
    color: '#A855F7',
  },
  {
    id: 's174',
    carrierHz: 174,
    volume: 0.3,
    name: { or: '୧୭୪ Hz ସ୍ଥିରତା', hi: '१७४ Hz स्थिरता', en: '174 Hz grounding' },
    desc: { or: 'ନିମ୍ନ ସୁରକ୍ଷା ନାଦ।', hi: 'निम्न सुरक्षा नाद।', en: 'Lowest safety tone.' },
    source: 'Extended solfeggio',
    category: 'healing',
    chakra: { or: 'ପ୍ରାକୃତିକ ନିରାମୟ (Natural Anesthetic)', hi: 'प्राकृतिक पीड़ा मुक्ति (Anesthetic)', en: 'Natural Anesthetic & Healing' },
    benefit: { or: 'ଶାରୀରିକ ଯନ୍ତ୍ରଣା ଓ ଟେନସନ୍‌କୁ ହ୍ରାସ କରି ଶରୀରକୁ ଗଭୀର ସୁରକ୍ଷା ଦିଏ।', hi: 'शारीरिक तनाव व पीड़ा को शांत कर आंतरिक सुरक्षा प्रदान करता है।', en: 'Natural anesthetic frequency, eases bodily stress and promotes grounding.' },
    color: '#14B8A6',
  },
  {
    id: 's285',
    carrierHz: 285,
    volume: 0.3,
    name: { or: '୨୮୫ Hz ବିଶ୍ରାମ', hi: '२୮୫ Hz विश्राम', en: '285 Hz rest' },
    desc: { or: 'ଶାରୀରିକ ବିଶ୍ରାମ।', hi: 'शारीरिक विश्राम।', en: 'Physical rest.' },
    source: 'Extended solfeggio',
    category: 'healing',
    chakra: { or: 'କୋଷୀୟ ପୁନର୍ଜୀବନ (Restoration)', hi: 'कोशिकीय पुनर्जीवन (Restoration)', en: 'Cellular Restoration & Rest' },
    benefit: { or: 'କ୍ଳାନ୍ତ କୋଷମାନଙ୍କୁ ସତେଜ କରି ଶରୀରରେ ଦ୍ରୁତ ଊର୍ଜା ପୁନଃପ୍ରତିଷ୍ଠା କରେ।', hi: 'थकान दूर कर शरीर व ऊर्जा क्षेत्र को नया जीवन व ताजगी देता है।', en: 'Stimulates cellular rejuvenation and promotes deep regenerative rest.' },
    color: '#06B6D4',
  },
  {
    id: 'gayatri-108',
    carrierHz: 108,
    volume: 0.32,
    name: { or: '୧୦୮ Hz ଗାୟତ୍ରୀ', hi: '१०८ Hz गायत्री', en: '108 Hz Gayatri' },
    desc: { or: '୧୦୮ ମାଳା ନାଦ।', hi: '१०८ माला नाद।', en: '108-bead chant.' },
    source: 'Vedic 108-bead japa',
    category: 'cosmic',
    chakra: { or: 'ବୈଦିକ ଜପ ତରଙ୍ଗ (Sacred Japa)', hi: 'वैदिक जप तरंग (Sacred Japa)', en: 'Sacred 108 Vedic Resonance' },
    benefit: { or: '୧୦୮ ମଣି ଜପର ସୂକ୍ଷ୍ମ କମ୍ପନ, ସାତ୍ତ୍ୱିକ ପ୍ରକାଶ ଓ ମନୋବଳ ବୃଦ୍ଧି।', hi: '१०८ मनकों के जाप की सूक्ष्म ऊर्जा, एकाग्रता व सात्विक प्रकाश।', en: 'Sacred 108 japa frequency, attunes mental focus and awakens inner light.' },
    color: '#F59E0B',
  },
];

export function totalProgramSeconds(p: BreathProgram): number {
  return p.phases.reduce((s, x) => s + x.seconds, 0) * p.rounds + p.restSec;
}

export const PHASE_LABEL: Record<BreathPhaseKind, Record<'or' | 'hi' | 'en', string>> = {
  inhale: { or: 'ପୂରକ', hi: 'पूरक', en: 'Inhale' },
  hold: { or: 'କୁମ୍ଭକ', hi: 'कुंभक', en: 'Hold' },
  exhale: { or: 'ରେଚକ', hi: 'रेचक', en: 'Exhale' },
  holdEmpty: { or: 'ବାହ୍ୟ କୁମ୍ଭକ', hi: 'बाह्य कुंभक', en: 'Hold empty' },
  rest: { or: 'ବିଶ୍ରାମ', hi: 'विश्राम', en: 'Rest' },
};

export const ALL_BREATH = { BREATH_PROGRAMS, MORE_BREATH };
