export type BreathPhaseKind = 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | 'rest';

export interface BreathProgram {
  id: string;
  rounds: number;
  restSec: number;
  phases: { kind: BreathPhaseKind; seconds: number }[];
  name: Record<'or' | 'hi' | 'en', string>;
  goal: Record<'or' | 'hi' | 'en', string>;
  source: string;
  caution?: Record<'or' | 'hi' | 'en', string>;
  posture?: Record<'or' | 'hi' | 'en', string>;
  bestTime?: Record<'or' | 'hi' | 'en', string>;
  steps?: Record<'or' | 'hi' | 'en', string[]>;
  benefits?: Record<'or' | 'hi' | 'en', string[]>;
}

export interface SoundProgram {
  id: string;
  carrierHz: number;
  beatHz?: number;
  volume: number;
  name: Record<'or' | 'hi' | 'en', string>;
  desc: Record<'or' | 'hi' | 'en', string>;
  source: string;
  category?: 'cosmic' | 'chakra' | 'healing';
  chakra?: Record<'or' | 'hi' | 'en', string>;
  benefit?: Record<'or' | 'hi' | 'en', string>;
  color?: string;
}

export const BREATH_PROGRAMS: BreathProgram[] = [
  {
    id: 'nadi-shodhana',
    rounds: 8,
    restSec: 10,
    phases: [
      { kind: 'inhale', seconds: 4 },
      { kind: 'hold', seconds: 8 },
      { kind: 'exhale', seconds: 8 },
    ],
    name: { or: 'ନାଡ଼ୀ ଶୋଧନ (ଅନୁଲୋମ-ବିଲୋମ)', hi: 'नाड़ी शोधन (अनुलोम-विलोम)', en: 'Nadi-Shodhana (Alternate Nostril)' },
    goal: { or: 'ଇଡ଼ା-ପିଙ୍ଗଳା ନାଡ଼ୀ ଓ ମନର ପୂର୍ଣ୍ଣ ସନ୍ତୁଳନ।', hi: 'इड़ा-पिंगला नाड़ी एवं मन का पूर्ण संतुलन।', en: 'Balance Ida-Pingala subtle channels and calm the mind.' },
    source: 'Hatha-Yoga-Pradipika 2.7-2.30',
    posture: {
      or: 'ସୁଖାସନ, ପଦ୍ମାସନ କିମ୍ବା ଚେୟାରରେ ମେରୁଦଣ୍ଡ ସଳଖ କରି ବସନ୍ତୁ।',
      hi: 'सुखासन, पद्मासन या कुर्सी पर रीढ़ की हड्डी सीधी रखकर बैठें।',
      en: 'Sit comfortably with a tall, straight spine in Sukhasana or a firm chair.',
    },
    bestTime: {
      or: 'ପ୍ରାତଃକାଳ (ବ୍ରାହ୍ମ ମୁହୂର୍ତ୍ତ) କିମ୍ବା ସନ୍ଧ୍ୟାରେ ଖାଲି ପେଟରେ।',
      hi: 'प्रातःकाल (ब्राह्म मुहूर्त) या संध्या समय खाली पेट।',
      en: 'Early morning (Brahma Muhurta) or evening on an empty stomach.',
    },
    steps: {
      or: [
        '୧. ଡାହାଣ ହାତରେ ବିଷ୍ଣୁ ମୁଦ୍ରା (ତର୍ଜନୀ ଓ ମଧ୍ୟମା ବନ୍ଦ) ଧରନ୍ତୁ ଏବଂ ବାମ ହାତ ଜ୍ଞାନ ମୁଦ୍ରାରେ ଆଣ୍ଠୁ ଉପରେ ରଖନ୍ତୁ।',
        '୨. ଡାହାଣ ବୁଢ଼ା ଆଙ୍ଗୁଠିରେ ଡାହାଣ ନାକପୁଡ଼ା ବନ୍ଦ କରି ବାମ ନାକପୁଡ଼ା ଦେଇ ୪ ସେକେଣ୍ଡ ଧୀରେ ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ (ପୂରକ)।',
        '୩. ଅନାମିକା ଓ ବୁଢ଼ା ଆଙ୍ଗୁଠି ଦ୍ୱାରା ଉଭୟ ନାକପୁଡ଼ା ବନ୍ଦ କରି ୮ ସେକେଣ୍ଡ ଶ୍ୱାସ ଧରି ରଖନ୍ତୁ (କୁମ୍ଭକ)।',
        '୪. ଡାହାଣ ନାକପୁଡ଼ା ଖୋଲି ୮ ସେକେଣ୍ଡରେ ନିୟନ୍ତ୍ରିତ ଭାବେ ଶ୍ୱାସ ସମ୍ପୂର୍ଣ୍ଣ ଛାଡ଼ନ୍ତୁ (ରେଚକ)। ପରବର୍ତ୍ତୀ ରାଉଣ୍ଡରେ ଡାହାଣରୁ ନେଇ ବାମରେ ଛାଡ଼ନ୍ତୁ।',
      ],
      hi: [
        '१. दाहिने हाथ से विष्णु मुद्रा बनाएं तथा बाएं हाथ को ज्ञान मुद्रा में घुटने पर रखें।',
        '२. दाहिने अंगूठे से दाहिना नथुना बंद करें और बाएं नथुने से ४ सेकंड धीरे-धीरे श्वास अंदर भरें (पूरक)।',
        '३. दोनों नथुने बंद करके ८ सेकंड तक श्वास को शांत भाव से रोककर रखें (कुंभक)।',
        '४. दाहिना नथुना खोलकर ८ सेकंड में धीरे-धीरे श्वास पूरी बाहर निकालें (रेचक)। अगले चक्र में दाहिने से भरें और बाएं से छोड़ें।',
      ],
      en: [
        '1. Adopt Vishnu Mudra with your right hand; rest your left hand on your knee in Jnana Mudra.',
        '2. Close your right nostril with your thumb and inhale smoothly through the left nostril for 4s (Puraka).',
        '3. Close both nostrils gently with thumb and ring finger; hold the breath calmly for 8s (Kumbhaka).',
        '4. Release the right nostril and exhale completely over 8s (Rechaka). Switch sides on the next round.',
      ],
    },
    benefits: {
      or: [
        'ମସ୍ତିଷ୍କର ଉଭୟ ଗୋଲାର୍ଦ୍ଧରେ ସନ୍ତୁଳନ ଆଣି ଚିନ୍ତା ଓ ମାନସିକ ଚାପ ଦୂର କରେ।',
        'ରକ୍ତଚାପ ନିୟନ୍ତ୍ରଣ କରି ହୃଦ୍‌ସ୍ପନ୍ଦନକୁ ସ୍ଥିର ରଖେ।',
        '୭୨,୦୦୦ ସୂକ୍ଷ୍ମ ପ୍ରାଣ ନାଡ଼ୀର ଶୋଧନ କରି ଆତ୍ମିକ ଊର୍ଜା ଜାଗ୍ରତ କରେ।',
      ],
      hi: [
        'मस्तिष्क के दोनों गोलार्धों को संतुलित कर तनाव और घबराहट दूर करता है।',
        'रक्तचाप को नियंत्रित कर हृदय गति को शांत व स्थिर बनाता है।',
        'शरीर की ७२,००० सूक्ष्म नाड़ियों का शोधन कर प्राण ऊर्जा का संचार करता है।',
      ],
      en: [
        'Balances left and right brain hemispheres, dissolving anxiety and mental restlessness.',
        'Regulates blood pressure and stabilizes resting heart rate.',
        'Purifies the 72,000 subtle energy channels, revitalizing vital pranic force.',
      ],
    },
  },
  {
    id: 'bhramari',
    rounds: 7,
    restSec: 8,
    phases: [
      { kind: 'inhale', seconds: 4 },
      { kind: 'exhale', seconds: 8 },
    ],
    name: { or: 'ଭ୍ରାମରୀ (ଗୁଞ୍ଜନ ପ୍ରାଣାୟାମ)', hi: 'भ्रामरी (गुंजन प्राणायाम)', en: 'Bhramari (Humming Bee Breath)' },
    goal: { or: 'ସ୍ନାୟୁ ମଣ୍ଡଳକୁ ତତକ୍ଷଣାତ୍ ଶାନ୍ତ କରିବା ଓ ମସ୍ତିଷ୍କ କମ୍ପନ।', hi: 'तंत्रिका तंत्र को तुरंत शांत करना व मानसिक शांति।', en: 'Instantly soothe nerves and induce deep vibrational calm.' },
    source: 'Hatha-Yoga-Pradipika 2.68',
    posture: {
      or: 'ପଦ୍ମାସନ ବା ସୁଖାସନରେ ସଳଖ ବସନ୍ତୁ। କାନ୍ଧ ଢିଲା ଓ ଆଖି ବନ୍ଦ ରଖନ୍ତୁ।',
      hi: 'पद्मासन या सुखासन में बैठें। कंधे ढीले और आंखें कोमलता से बंद रखें।',
      en: 'Sit upright with relaxed shoulders and gently closed eyes.',
    },
    bestTime: {
      or: 'ରାତ୍ରିରେ ଶୋଇବା ପୂର୍ବରୁ କିମ୍ବା ଯେକୌଣସି ସମୟରେ ମାନସିକ ଚାପ ଥିଲେ।',
      hi: 'रात को सोने से पूर्व या मानसिक तनाव होने पर कभी भी।',
      en: 'Before bedtime for sound sleep, or whenever feeling overwhelmed.',
    },
    steps: {
      or: [
        '୧. ଦୁଇ ହାତର ବୁଢ଼ା ଆଙ୍ଗୁଠି ଦ୍ୱାରା ଦୁଇ କାନର ଟ୍ରାଗସ୍ (କାନର ଛୋଟ ପରଦା) କୁ ହାଲୁକା ଭାବେ ଚାପି ବାହ୍ୟ ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ।',
        '୨. ନାକ ଦ୍ୱାରା ୪ ସେକେଣ୍ଡ ଗଭୀର ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ।',
        '୩. ମୁହଁ ବନ୍ଦ ରଖି ଶ୍ୱାସ ଛାଡ଼ିବା ସମୟରେ ୮ ସେକେଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ ମହୁମାଛି ପରି ମଧୁର "ମ୍‌ମ୍‌ମ୍‌ମ୍..." ଗୁଞ୍ଜନ ନାଦ କରନ୍ତୁ।',
        '୪. ସେହି କମ୍ପନକୁ ମସ୍ତିଷ୍କ ଓ ଆଜ୍ଞା ଚକ୍ରରେ ଅନୁଭବ କରନ୍ତୁ।',
      ],
      hi: [
        '१. दोनों अंगूठों से कानों के छोटे छिद्र-पटल को हल्का दबाकर बाहरी आवाजें बंद करें।',
        '२. दोनों नथुनों से ४ सेकंड गहरी सांस अंदर भरें।',
        '३. मुंह बंद रखकर ८ सेकंड तक सांस छोड़ते हुए भौंरे की तरह मधुर "म्-म्-म्..." गुंजन ध्वनि करें।',
        '४. इस पावन ध्वनि कंपन को मस्तिष्क के केंद्र में महसूस करें।',
      ],
      en: [
        '1. Close your ears gently with your thumbs to block outside noise.',
        '2. Inhale deeply through your nose for 4s.',
        '3. Keeping lips gently closed, exhale over 8s while making a resonant humming "Mmmmmm" sound.',
        '4. Feel the soothing vibration reverberate through your skull and third eye.',
      ],
    },
    benefits: {
      or: [
        'ଅନିଦ୍ରା (Insomnia) ଦୂର କରି ଗାଢ଼ ଓ ଶାନ୍ତିପୂର୍ଣ୍ଣ ନିଦ୍ରା ପ୍ରଦାନ କରେ।',
        'ନାକ ଗହ୍ୱରରେ ନାଇଟ୍ରିକ୍ ଅକ୍ସାଇଡ୍ (Nitric Oxide) ବୃଦ୍ଧି କରି ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବଢ଼ାଏ।',
        'କ୍ରୋଧ, ଭୟ ଓ ଉଚ୍ଚ ରକ୍ତଚାପରୁ ତୁରନ୍ତ ଆଶ୍ୱସ୍ତି ଦିଏ।',
      ],
      hi: [
        'अनिद्रा दूर करके गहरी और सुकून भरी नींद लाने में रामबाण।',
        'नासा मार्ग में नाइट्रिक ऑक्साइड बढ़ाकर रोग प्रतिरोधक क्षमता बढ़ाता है।',
        'क्रोध, बेचैनी और उच्च रक्तचाप को तत्काल शांत करता है।',
      ],
      en: [
        'Natural cure for insomnia, preparing brain for deep restorative sleep.',
        'Boosts nasal nitric oxide production by up to 15x, improving immunity.',
        'Instantly dissipates anger, hyperactive thoughts, and tension headaches.',
      ],
    },
  },
  {
    id: 'ujjayi',
    rounds: 10,
    restSec: 6,
    phases: [
      { kind: 'inhale', seconds: 5 },
      { kind: 'exhale', seconds: 5 },
    ],
    name: { or: 'ଉଜ୍ଜାୟୀ (ସମୁଦ୍ର ଶ୍ୱାସ)', hi: 'उज्जायी (विजयी / समुद्र श्वास)', en: 'Ujjayi (Victorious / Ocean Breath)' },
    goal: { or: 'ଧ୍ୟାନରେ ଗଭୀର ଏକାଗ୍ରତା ଓ କଣ୍ଠ ବିଶୁଦ୍ଧି।', hi: 'ध्यान में गहरा ठहराव व कंठ विशुद्धि।', en: 'Deep meditative absorption and throat chakra purification.' },
    source: 'Hatha-Yoga-Pradipika 2.51-2.53',
    posture: {
      or: 'ଯେକୌଣସି ଆରାମଦାୟକ ଧ୍ୟାନ ଆସନରେ ସିଧା ବସନ୍ତୁ।',
      hi: 'किसी भी आरामदायक ध्यानात्मक आसन में सीधे बैठें।',
      en: 'Sit tall in any comfortable meditation posture.',
    },
    bestTime: {
      or: 'ପ୍ରାତଃ ସାଧନା କିମ୍ବା ଯୋଗାସନ ଓ ଧ୍ୟାନ ପୂର୍ବରୁ।',
      hi: 'प्रातःकाल या योगासन व ध्यान से पूर्व।',
      en: 'Morning sadhana, or as an anchor before deep meditation.',
    },
    steps: {
      or: [
        '୧. ମୁହଁ ବନ୍ଦ ରଖନ୍ତୁ। କଣ୍ଠନଳୀର ପଛ ଭାଗ (Glottis) କୁ ସାମାନ୍ୟ ସଙ୍କୁଚିତ କରନ୍ତୁ।',
        '୨. ନାକ ଦ୍ୱାରା ୫ ସେକେଣ୍ଡ ଧୀରେ ଶ୍ୱାସ ନିଅନ୍ତୁ, ଯେପରି ସମୁଦ୍ର ଢେଉ ପରି ଏକ ମୃଦୁ ଫୁସ୍‌ଫୁସ୍ ଶବ୍ଦ ହେବ।',
        '୩. ସମାନ କଣ୍ଠ ସଙ୍କୋଚନ ସହ ନାକ ଦ୍ୱାରା ୫ ସେକେଣ୍ଡରେ ଧୀରେ ଶ୍ୱାସ ଛାଡ଼ନ୍ତୁ।',
      ],
      hi: [
        '१. मुंह बंद रखें। कंठ (गले के छिद्र) को हल्का सा सिकोड़ें।',
        '२. दोनों नथुनों से ५ सेकंड श्वास अंदर खींचें; समुद्र की लहर जैसी शांत फुसफुसाहट गूंजेगी।',
        '३. उसी तरह कंठ संकुचन बनाए रखते हुए ५ सेकंड में धीरे-धीरे श्वास छोड़ें।',
      ],
      en: [
        '1. Keep your mouth closed and slightly contract the glottis at the back of your throat.',
        '2. Inhale through your nose for 5s, producing a soft, soothing ocean-wave whisper.',
        '3. Exhale with the same throat whisper for 5s, keeping the breath silky and continuous.',
      ],
    },
    benefits: {
      or: [
        'ଥାଇରଏଡ୍ (Thyroid) ଗ୍ରନ୍ଥିକୁ ସନ୍ତୁଳିତ ଓ ସୁସ୍ଥ ରଖେ।',
        'ହୃଦୟ ଓ ମନର ଗତିକୁ ତତକ୍ଷଣାତ୍ ସ୍ଥିର କରି ଧ୍ୟାନରେ ଲୀନ କରେ।',
        'ଫୁସଫୁସର ଅମ୍ଳଜାନ ଗ୍ରହଣ କ୍ଷମତା ବୃଦ୍ଧି କରେ।',
      ],
      hi: [
        'थायराइड ग्रंथि को सक्रिय और संतुलित रखता है।',
        'हृदय गति को स्थिर कर मन को एकाग्र व अंतर्मुखी बनाता है।',
        'फेफड़ों की ऑक्सीजन अवशोषण क्षमता में उल्लेखनीय वृद्धि करता है।',
      ],
      en: [
        'Nourishes and regulates thyroid and throat (Vishuddha) chakra functions.',
        'Slows respiratory frequency and aligns heart rate variability.',
        'Anchors the wandering mind effortlessly into meditative stillness.',
      ],
    },
  },
  {
    id: 'p478',
    rounds: 4,
    restSec: 10,
    phases: [
      { kind: 'inhale', seconds: 4 },
      { kind: 'hold', seconds: 7 },
      { kind: 'exhale', seconds: 8 },
    ],
    name: { or: '୪-୭-୮ ଛନ୍ଦ (ପ୍ରଶାନ୍ତ ଶ୍ୱାସ)', hi: '४-७-८ लय (प्रशांत श्वास)', en: '4-7-8 Relaxing Breath' },
    goal: { or: 'ସ୍ନାୟୁ ମଣ୍ଡଳକୁ ପ୍ରଶାନ୍ତ କରି ତୁରନ୍ତ ନିଦ୍ରା ଓ ଚିନ୍ତାମୁକ୍ତି।', hi: 'तंत्रिका तंत्र को शांत कर त्वरित नींद व चिंतामुक्ति।', en: 'Reset the autonomic nervous system for sleep and anxiety relief.' },
    source: 'Dr. Andrew Weil (Vedic Pranayama Adaptation)',
    posture: {
      or: 'ବିଛଣାରେ ଶୋଇ କିମ୍ବା ଚେୟାରରେ ଆରାମରେ ବସି କାନ୍ଧ ଢିଲା ରଖନ୍ତୁ।',
      hi: 'बिस्तर पर लेटकर या कुर्सी पर पीठ सीधी और कंधे शिथिल रखकर बैठें।',
      en: 'Sit comfortably upright or lie on your bed with relaxed shoulders.',
    },
    bestTime: {
      or: 'ରାତ୍ରିରେ ଶୋଇବା ପୂର୍ବରୁ କିମ୍ବା ଉଦ୍‌ବେଗ/ଘବରାହଟ ସମୟରେ।',
      hi: 'रात को सोने से तुरंत पहले या घबराहट/तनाव के समय।',
      en: 'Right before going to sleep, or whenever experiencing acute stress.',
    },
    steps: {
      or: [
        '୧. ଜିଭର ଅଗ୍ରଭାଗକୁ ଉପର ଆଗ ଦାନ୍ତ ପଛ ମାଢ଼ି ସହ ଲଗାଇ ରଖନ୍ତୁ। ପାଟିରୁ "ହୁସ୍..." ଶବ୍ଦ କରି ସମ୍ପୂର୍ଣ୍ଣ ଶ୍ୱାସ ଛାଡ଼ନ୍ତୁ।',
        '୨. ପାଟି ବନ୍ଦ କରି ନାକ ଦ୍ୱାରା ୪ ସେକେଣ୍ଡ ଶାନ୍ତ ଭାବେ ଶ୍ୱାସ ଭିତରକୁ ନିଅନ୍ତୁ (ପୂରକ)।',
        '୩. ଶ୍ୱାସକୁ ୭ ସେକେଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ ସମ୍ପୂର୍ଣ୍ଣ ସ୍ଥିର ଭାବେ ରୋକି ରଖନ୍ତୁ (କୁମ୍ଭକ)।',
        '୪. ପାଟି ଖୋଲି ଓଠ ଗୋଲ କରି ୮ ସେକେଣ୍ଡ ଯାଏଁ ଧୀରେ "ହୁସ୍..." ଶବ୍ଦ କରି ସମ୍ପୂର୍ଣ୍ଣ ଶ୍ୱାସ ବାହାରକୁ ଛାଡ଼ନ୍ତୁ (ରେଚକ)।',
      ],
      hi: [
        '१. जीभ की नोक को ऊपर के आगे वाले दांतों के पीछे मसूड़े से लगाएं। मुंह से "हूस" आवाज के साथ पूरी सांस बाहर निकालें।',
        '२. मुंह बंद करें और दोनों नथुनों से ४ सेकंड शांत भाव से सांस अंदर भरें (पूरक)।',
        '३. सांस को ७ सेकंड तक बिना तनाव के भीतर रोककर रखें (कुंभक)।',
        '४. मुंह से होंठ सिकोड़कर ८ सेकंड में "हूस" की धीमी आवाज के साथ पूरी सांस छोड़ें (रेचक)।',
      ],
      en: [
        '1. Place the tip of your tongue behind your upper front teeth. Exhale completely through your mouth with a whoosh sound.',
        '2. Close your mouth and inhale quietly through your nose for 4s (Puraka).',
        '3. Hold your breath calmly for 7s without straining (Kumbhaka).',
        '4. Exhale completely through your mouth with a steady whoosh sound for 8s (Rechaka).',
      ],
    },
    benefits: {
      or: [
        'ପାରାସିମ୍ପାଥେଟିକ୍ (Vagus Nerve) ସ୍ନାୟୁକୁ ସକ୍ରିୟ କରି ୨-୩ ମିନିଟ୍‌ରେ ଘୁମେଇବାରେ ସାହାଯ୍ୟ କରେ।',
        'ରକ୍ତଚାପ ଓ ହୃଦ୍‌ସ୍ପନ୍ଦନକୁ ହ୍ରାସ କରି ମାନସିକ ଉଦ୍‌ବେଗ ଶେଷ କରେ।',
        'ମନର ଅତ୍ୟଧିକ ଚିନ୍ତା (Overthinking) କୁ ତତକ୍ଷଣାତ୍ ବନ୍ଦ କରେ।',
      ],
      hi: [
        'पैरासिम्पेथेटिक नर्वस सिस्टम को सक्रिय कर २-३ मिनट में प्राकृतिक नींद लाता है।',
        'रक्तचाप व हृदय की गति को कम कर बेचैनी को समाप्त करता है।',
        'अत्यधिक मानसिक विचारों (Overthinking) को तुरंत शांत करता है।',
      ],
      en: [
        'Triggers the parasympathetic relaxation response via vagus nerve stimulation.',
        'Proven natural sleep aid that resets heart rate and eases racing thoughts.',
        'Lowers elevated blood pressure and acute adrenaline surges within minutes.',
      ],
    },
  },
];

