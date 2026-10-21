import { ZodiacSign, AvakhadaData, GhatakaData } from '../../types/jataka';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';

// 27 Nakshatras 4 Pada Syllables (Nama Aksharas)
const NAKSHATRA_PADA_SYLLABLES: string[][] = [
  ['ଚୁ', 'ଚେ', 'ଚୋ', 'ଲା'], // 1. Ashwini (Chu, Che, Cho, La)
  ['ଲୀ', 'ଲୁ', 'ଲେ', 'ଲୋ'], // 2. Bharani (Li, Lu, Le, Lo)
  ['ଅ', 'ଇ', 'ଉ', 'ଏ'],   // 3. Krittika (A, I, U, E)
  ['ଓ', 'ଭା', 'ଭୀ', 'ଭୁ'], // 4. Rohini (O, Va, Vi, Vu)
  ['ଭେ', 'ଭୋ', 'କା', 'କୀ'], // 5. Mrigashira (Ve, Vo, Ka, Ki)
  ['କୁ', 'ଘ', 'ଙ', 'ଛ'],   // 6. Ardra (Ku, Gha, Nga, Chha)
  ['କେ', 'କୋ', 'ହା', 'ହୀ'], // 7. Punarvasu (Ke, Ko, Ha, Hi)
  ['ହୁ', 'ହେ', 'ହୋ', 'ଡା'], // 8. Pushya (Hu, He, Ho, Da)
  ['ଡୀ', 'ଡୁ', 'ଡେ', 'ଡୋ'], // 9. Ashlesha (Di, Du, De, Do)
  ['ମା', 'ମୀ', 'ମୁ', 'ମେ'], // 10. Magha (Ma, Mi, Mu, Me)
  ['ମୋ', 'ଟା', 'ଟୀ', 'ଟୁ'], // 11. Purva Phalguni (Mo, Ta, Ti, Tu)
  ['ଟେ', 'ଟୋ', 'ପା', 'ପୀ'], // 12. Uttara Phalguni (Te, To, Pa, Pi)
  ['ପୁ', 'ଷ', 'ଣ', 'ଠ'],   // 13. Hasta (Pu, Sha, Na, Tha)
  ['ପେ', 'ପୋ', 'ରା', 'ରୀ'], // 14. Chitra (Pe, Po, Ra, Ri)
  ['ରୁ', 'ରେ', 'ରୋ', 'ତା'], // 15. Swati (Ru, Re, Ro, Ta)
  ['ତୀ', 'ତୁ', 'ତେ', 'ତୋ'], // 16. Vishakha (Ti, Tu, Te, To)
  ['ନା', 'ନୀ', 'ନୁ', 'ନେ'], // 17. Anuradha (Na, Ni, Nu, Ne)
  ['ନୋ', 'ୟା', 'ୟୀ', 'ୟୁ'], // 18. Jyeshtha (No, Ya, Yi, Yu)
  ['ୟେ', 'ୟୋ', 'ଭା', 'ଭୀ'], // 19. Mula (Ye, Yo, Bha, Bhi)
  ['ଭୁ', 'ଧା', 'ଫା', 'ଢା'], // 20. Purva Ashadha (Bhu, Dha, Pha, Dha)
  ['ଭେ', 'ଭୋ', 'ଜା', 'ଜୀ'], // 21. Uttara Ashadha (Bhe, Bho, Ja, Ji)
  ['ଖୀ', 'ଖୁ', 'ଖେ', 'ଖୋ'], // 22. Shravana (Khi, Khu, Khe, Kho)
  ['ଗା', 'ଗୀ', 'ଗୁ', 'ଗେ'], // 23. Dhanishta (Ga, Gi, Gu, Ge)
  ['ଗୋ', 'ସା', 'ସୀ', 'ସୁ'], // 24. Shatabhisha (Go, Sa, Si, Su)
  ['ସେ', 'ସୋ', 'ଦା', 'ଦୀ'], // 25. Purva Bhadrapada (Se, So, Da, Di)
  ['ଦୁ', 'ଥ', 'ଝ', 'ଞ'],   // 26. Uttara Bhadrapada (Du, Tha, Jha, Nya)
  ['ଦେ', 'ଦୋ', 'ଚା', 'ଚୀ']  // 27. Revati (De, Do, Cha, Chi)
];

// Yoni Animals and Natural Enemies
const NAKSHATRA_YONIS: { nameEn: string; nameHi: string; nameOr: string; animal: string; enemy: string }[] = [
  { nameEn: 'Horse (Ashwa)', nameHi: 'अश्व (घोड़ा)', nameOr: 'ଅଶ୍ୱ (ଘୋଡ଼ା)', animal: 'Ashwa', enemy: 'Mahisha (Buffalo)' },
  { nameEn: 'Elephant (Gaja)', nameHi: 'गज (हाथी)', nameOr: 'ଗଜ (ହାତୀ)', animal: 'Gaja', enemy: 'Simha (Lion)' },
  { nameEn: 'Sheep (Mesha)', nameHi: 'मेष (भेड़)', nameOr: 'ମେଷ (ମେଣ୍ଢା)', animal: 'Mesha', enemy: 'Vanara (Monkey)' },
  { nameEn: 'Serpent (Sarpa)', nameHi: 'सर्प (सांप)', nameOr: 'ସର୍ପ (ସାପ)', animal: 'Sarpa', enemy: 'Nakula (Mongoose)' },
  { nameEn: 'Serpent (Sarpa)', nameHi: 'सर्प (सांप)', nameOr: 'ସର୍ପ (ସାପ)', animal: 'Sarpa', enemy: 'Nakula (Mongoose)' },
  { nameEn: 'Dog (Shwana)', nameHi: 'श्वान (कुत्ता)', nameOr: 'ଶ୍ୱାନ (କୁକୁର)', animal: 'Shwana', enemy: 'Mriga (Deer)' },
  { nameEn: 'Cat (Marjara)', nameHi: 'मार्जार (बिल्ली)', nameOr: 'ମାର୍ଜାର (ବିରାଡ଼ି)', animal: 'Marjara', enemy: 'Mushaka (Rat)' },
  { nameEn: 'Sheep (Mesha)', nameHi: 'मेष (भेड़)', nameOr: 'ମେଷ (ମେଣ୍ଢା)', animal: 'Mesha', enemy: 'Vanara (Monkey)' },
  { nameEn: 'Cat (Marjara)', nameHi: 'मार्जार (बिल्ली)', nameOr: 'ମାର୍ଜାର (ବିରାଡ଼ି)', animal: 'Marjara', enemy: 'Mushaka (Rat)' },
  { nameEn: 'Rat (Mushaka)', nameHi: 'मूषक (चूहा)', nameOr: 'ମୂଷିକ (ମୂଷା)', animal: 'Mushaka', enemy: 'Marjara (Cat)' },
  { nameEn: 'Rat (Mushaka)', nameHi: 'मूषक (चूहा)', nameOr: 'ମୂଷିକ (ମୂଷା)', animal: 'Mushaka', enemy: 'Marjara (Cat)' },
  { nameEn: 'Cow (Gau)', nameHi: 'गौ (गाय)', nameOr: 'ଗୋ (ଗାଈ)', animal: 'Gau', enemy: 'Vyaghra (Tiger)' },
  { nameEn: 'Buffalo (Mahisha)', nameHi: 'महिष (भैंस)', nameOr: 'ମହିଷ (ମଇଁଷି)', animal: 'Mahisha', enemy: 'Ashwa (Horse)' },
  { nameEn: 'Tiger (Vyaghra)', nameHi: 'व्याघ्र (बाघ)', nameOr: 'ବ୍ୟାଘ୍ର (ବାଘ)', animal: 'Vyaghra', enemy: 'Gau (Cow)' },
  { nameEn: 'Buffalo (Mahisha)', nameHi: 'महिष (भैंस)', nameOr: 'ମହିଷ (ମଇଁଷି)', animal: 'Mahisha', enemy: 'Ashwa (Horse)' },
  { nameEn: 'Tiger (Vyaghra)', nameHi: 'व्याघ्र (बाघ)', nameOr: 'ବ୍ୟାଘ୍ର (ବାଘ)', animal: 'Vyaghra', enemy: 'Gau (Cow)' },
  { nameEn: 'Deer (Mriga)', nameHi: 'मृग (हिरण)', nameOr: 'ମୃଗ (ହରିଣ)', animal: 'Mriga', enemy: 'Shwana (Dog)' },
  { nameEn: 'Deer (Mriga)', nameHi: 'मृग (हिरण)', nameOr: 'ମୃଗ (ହରିଣ)', animal: 'Mriga', enemy: 'Shwana (Dog)' },
  { nameEn: 'Dog (Shwana)', nameHi: 'श्वान (कुत्ता)', nameOr: 'ଶ୍ୱାନ (କୁକୁର)', animal: 'Shwana', enemy: 'Mriga (Deer)' },
  { nameEn: 'Monkey (Vanara)', nameHi: 'वानर (बंदर)', nameOr: 'ବାନର (ମାଙ୍କଡ଼)', animal: 'Vanara', enemy: 'Mesha (Sheep)' },
  { nameEn: 'Mongoose (Nakula)', nameHi: 'नकुल (नेवला)', nameOr: 'ନକୁଳ (ନେଉଳ)', animal: 'Nakula', enemy: 'Sarpa (Serpent)' },
  { nameEn: 'Monkey (Vanara)', nameHi: 'वानर (बंदर)', nameOr: 'ବାନର (ମାଙ୍କଡ଼)', animal: 'Vanara', enemy: 'Mesha (Sheep)' },
  { nameEn: 'Lion (Simha)', nameHi: 'सिंह (शेर)', nameOr: 'ସିଂହ (ସିଂହ)', animal: 'Simha', enemy: 'Gaja (Elephant)' },
  { nameEn: 'Horse (Ashwa)', nameHi: 'अश्व (घोड़ा)', nameOr: 'ଅଶ୍ୱ (ଘୋଡ଼ା)', animal: 'Ashwa', enemy: 'Mahisha (Buffalo)' },
  { nameEn: 'Lion (Simha)', nameHi: 'सिंह (शेर)', nameOr: 'ସିଂହ (ସିଂହ)', animal: 'Simha', enemy: 'Gaja (Elephant)' },
  { nameEn: 'Cow (Gau)', nameHi: 'गौ (गाय)', nameOr: 'ଗୋ (ଗାଈ)', animal: 'Gau', enemy: 'Vyaghra (Tiger)' },
  { nameEn: 'Elephant (Gaja)', nameHi: 'गज (हाथी)', nameOr: 'ଗଜ (ହାତୀ)', animal: 'Gaja', enemy: 'Simha (Lion)' }
];

// Gana: Deva (0), Manushya (1), Rakshasa (2)
const NAKSHATRA_GANAS = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, // 1-9
  2, 1, 1, 0, 2, 0, 2, 0, 2, // 10-18
  2, 1, 1, 0, 2, 2, 1, 1, 0  // 19-27
];

// Nadi: 0: Adi (Vata), 1: Madhya (Pitta), 2: Antya (Kapha)
const NAKSHATRA_NADIS = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  2, 1, 0, 0, 1, 2, 2, 1, 0,
  0, 1, 2, 2, 1, 0, 0, 1, 2
];

/**
 * Calculates Avakhada Chakra Data based on Natal Moon Position
 */
export function calculateAvakhadaChakra(moonDegree: number, moonSign: ZodiacSign): AvakhadaData {
  const nakIndex = Math.min(26, Math.max(0, Math.floor(moonDegree / (360 / 27))));
  const degInNak = moonDegree % (360 / 27);
  const pada = Math.min(4, Math.floor(degInNak / (360 / 108)) + 1);

  // Varna (Brahmin, Kshatriya, Vaishya, Shudra)
  let varna = { en: 'Shudra', hi: 'शूद्र', or: 'ଶୂଦ୍ର' };
  if (['Karka', 'Vrischika', 'Meena'].includes(moonSign)) {
    varna = { en: 'Brahmin (Knowledge & Intellect)', hi: 'ब्राह्मण (ज्ञान एवं सात्विकता)', or: 'ବ୍ରାହ୍ମଣ (ଜ୍ଞାନ ଓ ଧାର୍ମିକତା)' };
  } else if (['Mesha', 'Simha', 'Dhanu'].includes(moonSign)) {
    varna = { en: 'Kshatriya (Leadership & Valour)', hi: 'क्षत्रिय (तेज एवं नेतृत्व)', or: 'କ୍ଷତ୍ରିୟ (ତେଜ ଓ ପରାକ୍ରମ)' };
  } else if (['Vrishabha', 'Kanya', 'Makara'].includes(moonSign)) {
    varna = { en: 'Vaishya (Commerce & Resourcefulness)', hi: 'वैश्य (व्यापार एवं प्रबंधन)', or: 'ବୈଶ୍ୟ (ବାଣିଜ୍ୟ ଓ ସମ୍ପଦ)' };
  } else {
    varna = { en: 'Shudra (Diligence & Service)', hi: 'शूद्र (कर्मठता एवं सेवा)', or: 'ଶୂଦ୍ର (କର୍ମଠତା ଓ ନିଷ୍ଠା)' };
  }

  // Vashya
  let vashya = { en: 'Manava (Human)', hi: 'मानव', or: 'ମାନବ' };
  if (['Mesha', 'Vrishabha'].includes(moonSign)) {
    vashya = { en: 'Chatushpada (Quadruped)', hi: 'चतुष्पद (पशु)', or: 'ଚତୁଷ୍ପଦ (ପଶୁ)' };
  } else if (['Mithuna', 'Kanya', 'Tula', 'Kumbha'].includes(moonSign)) {
    vashya = { en: 'Dvipada / Manava (Human)', hi: 'द्विपद (मानव)', or: 'ଦ୍ୱିପଦ (ମାନବ)' };
  } else if (['Karka', 'Meena'].includes(moonSign)) {
    vashya = { en: 'Jalachara (Aquatic)', hi: 'जलचर', or: 'ଜଳଚର' };
  } else if (moonSign === 'Simha') {
    vashya = { en: 'Vanachara / Simha (Wild Lion)', hi: 'वनचर (सिंह)', or: 'ବନଚର (ସିଂହ)' };
  } else if (moonSign === 'Vrischika') {
    vashya = { en: 'Keeta (Insect / Scorpion)', hi: 'कीट (वृश्चिक)', or: 'କୀଟ (ବିଚ୍ଛା)' };
  } else if (moonSign === 'Dhanu') {
    vashya = degInNak < 15
      ? { en: 'Dvipada / Manava (Human First Half)', hi: 'द्विपद (मानव पूर्वार्ध)', or: 'ଦ୍ୱିପଦ (ମାନବ ପ୍ରଥମାର୍ଦ୍ଧ)' }
      : { en: 'Chatushpada (Quadruped Second Half)', hi: 'चतुष्पद (पशु उत्तरार्ध)', or: 'ଚତୁଷ୍ପଦ (ପଶୁ ଦ୍ୱିତୀୟାର୍ଦ୍ଧ)' };
  } else if (moonSign === 'Makara') {
    vashya = degInNak < 15
      ? { en: 'Chatushpada (Quadruped First Half)', hi: 'चतुष्पद (पशु पूर्वार्ध)', or: 'ଚତୁଷ୍ପଦ (ପଶୁ ପ୍ରଥମାର୍ଦ୍ଧ)' }
      : { en: 'Jalachara (Aquatic Crocodile Second Half)', hi: 'जलचर (मकर उत्तरार्ध)', or: 'ଜଳଚର (ମକର ଦ୍ୱିତୀୟାର୍ଦ୍ଧ)' };
  }

  // Yoni
  const yoniObj = NAKSHATRA_YONIS[nakIndex];
  const yoni = {
    en: yoniObj.nameEn,
    hi: yoniObj.nameHi,
    or: yoniObj.nameOr,
    animal: yoniObj.animal,
    enemyYoni: yoniObj.enemy
  };

  // Gana
  const ganaIdx = NAKSHATRA_GANAS[nakIndex];
  let gana = {
    en: 'Deva Gana (Divine & Benevolent)',
    hi: 'देव गण (सात्विक, शांत एवं परोपकारी)',
    or: 'ଦେବ ଗଣ (ଶାନ୍ତ, ଦୟାଳୁ ଓ ସଦାଚାରୀ)',
    trait: {
      en: 'Virtuous, philanthropic, diplomatic and peaceful.',
      hi: 'सदाचारी, परोपकारी, धैर्यवान और शांत स्वभाव।',
      or: 'ପରୋପକାରୀ, ସଦାଚାରୀ, ଧୈର୍ଯ୍ୟବାନ ଓ ଶାନ୍ତ ଚରିତ୍ର।'
    }
  };
  if (ganaIdx === 1) {
    gana = {
      en: 'Manushya Gana (Human & Pragmatic)',
      hi: 'मनुष्य गण (कर्मठ, स्वाभिमानी एवं व्यावहारिक)',
      or: 'ମନୁଷ୍ୟ ଗଣ (କର୍ମଠ, ସ୍ୱାଭିମାନୀ ଓ ବ୍ୟାବହାରିକ)',
      trait: {
        en: 'Self-respecting, hardworking, family oriented and balanced.',
        hi: 'स्वाभिमानी, कर्मठ, कुटुंब-प्रेमी और संतुलित बुद्धि।',
        or: 'କର୍ମନିଷ୍ଠ, ଆତ୍ମସମ୍ମାନୀ, ପରିବାରପ୍ରିୟ ଓ ବ୍ୟାବହାରିକ।'
      }
    };
  } else if (ganaIdx === 2) {
    gana = {
      en: 'Rakshasa Gana (Dynamic, Fearless & Dominant)',
      hi: 'राक्षस गण (साहसी, प्रखर, निर्भीक एवं महत्वाकांक्षी)',
      or: 'ରାକ୍ଷସ ଗଣ (ସାହସୀ, ନିର୍ଭୀକ, ତେଜସ୍ୱୀ ଓ ମହତ୍ତ୍ୱାକାଂକ୍ଷୀ)',
      trait: {
        en: 'Fiercely independent, courageous, sharp intuition and uncompromising.',
        hi: 'अत्यंत साहसी, स्पष्टवादी, तीव्र अंतर्ज्ञान और दृढ़ संकल्पी।',
        or: 'ନିର୍ଭୟ, ଦୃଢ଼ ସଂକଳ୍ପୀ, ତୀକ୍ଷ୍ଣ ବୁଦ୍ଧି ଓ ପ୍ରଭାବଶାଳୀ ବ୍ୟକ୍ତିତ୍ୱ।'
      }
    };
  }

  // Nadi
  const nadiIdx = NAKSHATRA_NADIS[nakIndex];
  let nadi = {
    en: 'Adi Nadi (Vata / Air-Ethereal)',
    hi: 'आदि नाड़ी (वात प्रकृति)',
    or: 'ଆଦି ନାଡ଼ି (ବାତ ପ୍ରକୃତି)',
    dosha: 'Vata',
    ayurvedicGuidance: {
      en: 'Vata constitution. Prone to dry skin, anxiety, or joint issues. Warm, cooked foods, sesame oil massage, and grounding routines are beneficial.',
      hi: 'वात प्रकृति। गर्म, सुपाच्य भोजन, तिल के तेल से मालिश और नियमित दिनचर्या स्वास्थ्य के लिए अति उत्तम है।',
      or: 'ବାତ ପ୍ରକୃତି। ଶୁଷ୍କତା ଓ ବାତ ରୋଗରୁ ରକ୍ଷା ପାଇଁ ଉଷୁମ ଓ ସ୍ନିଗ୍ଧ ଆହାର, ତେଲ ମାଲିସ ଏବଂ ନିୟମିତ ବିଶ୍ରାମ ହିତକର।'
    }
  };
  if (nadiIdx === 1) {
    nadi = {
      en: 'Madhya Nadi (Pitta / Fiery-Metabolic)',
      hi: 'मध्य नाड़ी (पित्त प्रकृति)',
      or: 'ମଧ୍ୟ ନାଡ଼ି (ପିତ୍ତ ପ୍ରକୃତି)',
      dosha: 'Pitta',
      ayurvedicGuidance: {
        en: 'Pitta constitution. High metabolism, prone to acidity or heat. Cooling herbs, ghee, hydration, and avoiding excessive spicy foods recommended.',
        hi: 'पित्त प्रकृति। तीक्ष्ण जठराग्नि। शीतल पेय, घी, नारियल पानी और अत्यधिक मिर्च-मसालों से परहेज लाभप्रद है।',
        or: 'ପିତ୍ତ ପ୍ରକୃତି। ଶରୀରରେ ଉତ୍ତାପ ଓ ଅମ୍ଳତା ନିୟନ୍ତ୍ରଣ ପାଇଁ ଘିଅ, ନଡ଼ିଆ ପାଣି, ଥଣ୍ଡା ପାନୀୟ ଏବଂ ମସଲାଯୁକ୍ତ ଖାଦ୍ୟ ତ୍ୟାଗ ଉଚିତ।'
      }
    };
  } else if (nadiIdx === 2) {
    nadi = {
      en: 'Antya Nadi (Kapha / Water-Earth)',
      hi: 'अंत्य नाड़ी (कफ प्रकृति)',
      or: 'ଅନ୍ତ୍ୟ ନାଡ଼ି (କଫ ପ୍ରକୃତି)',
      dosha: 'Kapha',
      ayurvedicGuidance: {
        en: 'Kapha constitution. Prone to congestion or sluggish digestion. Light, warm, spiced foods and vigorous daily exercise maintain vitality.',
        hi: 'कफ प्रकृति। हल्का, उष्ण और पाचक भोजन, अदरक-तुलसी का सेवन और नियमित योगाभ्यास अत्यंत लाभदायक है।',
        or: 'କଫ ପ୍ରକୃତି। ହାଲୁକା, ଉଷୁମ ଓ ସୁପାଚ୍ୟ ଖାଦ୍ୟ, ଅଦା-ତୁଳସୀ ସେବନ ଓ ନିୟମିତ ବ୍ୟାୟାମ ଦ୍ୱାରା ଉତ୍ସାହ ବୃଦ୍ଧି ପାଏ।'
      }
    };
  }

  // Tatwa
  let tatwa = { en: 'Agni (Fire)', hi: 'अग्नि तत्त्व', or: 'ଅଗ୍ନି ତତ୍ତ୍ୱ' };
  if (['Vrishabha', 'Kanya', 'Makara'].includes(moonSign)) {
    tatwa = { en: 'Prithvi (Earth)', hi: 'पृथ्वी तत्त्व', or: 'ପୃଥିବୀ ତତ୍ତ୍ୱ' };
  } else if (['Mithuna', 'Tula', 'Kumbha'].includes(moonSign)) {
    tatwa = { en: 'Vayu (Air)', hi: 'वायु तत्ତ୍व', or: 'ବାୟୁ ତତ୍ତ୍ୱ' };
  } else if (['Karka', 'Vrischika', 'Meena'].includes(moonSign)) {
    tatwa = { en: 'Jala (Water)', hi: 'जल तत्त्व', or: 'ଜଳ ତତ୍ତ୍ୱ' };
  }

  // Nama Aksharas
  const namaAksharas = NAKSHATRA_PADA_SYLLABLES[nakIndex] || ['ଓଁ', 'ଶ୍ରୀ', 'ରା', 'ମ'];

  return {
    varna,
    vashya,
    yoni,
    gana,
    nadi,
    tatwa,
    namaAksharas,
    pada
  };
}

/**
 * Authentic Classical Ghataka Chakra (Odisha Panjika & Classical Jyotish standard)
 * Inauspicious times and configurations specific to the native's Janma Rashi
 */
export function calculateGhatakaChakra(moonSign: ZodiacSign): GhatakaData {
  switch (moonSign) {
    case 'Mesha':
      return {
        ghatakaRashi: 'Vrischika',
        ghatakaMasa: 'କାର୍ତ୍ତିକ (Kartika)',
        ghatakaTithi: '୧, ୬, ୧୧ (ନନ୍ଦା ତିଥି / Nanda)',
        ghatakaVara: 'ରବିବାର (Sunday)',
        ghatakaNakshatra: 'ମଘା (Magha)',
        ghatakaLagna: 'Mesha',
        ghatakaPrahar: '୧ମ ପ୍ରହର (First Prahar, Morning)',
        cautionGuidance: {
          en: 'Exercise caution on Sundays and during Moon transit in Scorpio. Avoid initiating major legal or financial commitments on Nanda tithis.',
          hi: 'रविवार और वृश्चिक राशि के चंद्र गोचर में सतर्क रहें। नंदा तिथियों में महत्वपूर्ण अनुबंधों से बचें।',
          or: 'ରବିବାର ଓ ବିଛା ରାଶିର ଚନ୍ଦ୍ର ଚଳନ ସମୟରେ ସତର୍କ ରୁହନ୍ତୁ। ନନ୍ଦା ତିଥିରେ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଚୁକ୍ତି କରନ୍ତୁ ନାହିଁ।'
        }
      };
    case 'Vrishabha':
      return {
        ghatakaRashi: 'Kanya',
        ghatakaMasa: 'ମାଘ (Magha)',
        ghatakaTithi: '୫, ୧୦, ୧୫ (ପୂର୍ଣ୍ଣା ତିଥି / Purna)',
        ghatakaVara: 'ଶନିବାର (Saturday)',
        ghatakaNakshatra: 'ହସ୍ତା (Hasta)',
        ghatakaLagna: 'Vrishabha',
        ghatakaPrahar: '୨ୟ ପ୍ରହର (Second Prahar, Midday)',
        cautionGuidance: {
          en: 'Moon transit in Virgo and Saturdays require deliberate decisions. Take extra care with financial speculations during Hasta Nakshatra.',
          hi: 'कन्या राशि में चंद्र गोचर और शनिवार को धैर्य रखें। हस्ता नक्षत्र में आर्थिक जोखिमों से बचें।',
          or: 'କନ୍ୟା ରାଶିର ଚନ୍ଦ୍ର ଓ ଶନିବାର ଦିନ ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ। ହସ୍ତା ନକ୍ଷତ୍ରରେ ଆର୍ଥିକ ବିପଦ ଠାରୁ ଦୂରେଇ ରୁହନ୍ତୁ।'
        }
      };
    case 'Mithuna':
      return {
        ghatakaRashi: 'Dhanu',
        ghatakaMasa: 'ଆଷାଢ଼ (Asadha)',
        ghatakaTithi: '୨, ୭, ୧୨ (ଭଦ୍ରା ତିଥି / Bhadra)',
        ghatakaVara: 'ସୋମବାର (Monday)',
        ghatakaNakshatra: 'ସ୍ୱାତୀ (Swati)',
        ghatakaLagna: 'Mithuna',
        ghatakaPrahar: '୩ୟ ପ୍ରହର (Third Prahar, Afternoon)',
        cautionGuidance: {
          en: 'Sagittarius Moon transit and Swati nakshatra can bring restlessness. Avoid hasty journeys or partnerships on Bhadra tithis.',
          hi: 'धनु चंद्र गोचर और स्वाति नक्षत्र में मानसिक चंचलता से बचें। सोमवार को नए व्यापारिक साझेदारी में सावधानी रखें।',
          or: 'ଧନୁ ଚନ୍ଦ୍ର ଓ ସ୍ୱାତୀ ନକ୍ଷତ୍ରରେ ମନ ଅସ୍ଥିର ହୋଇପାରେ। ଭଦ୍ରା ତିଥିରେ ବ୍ୟବସାୟିକ ଚୁକ୍ତି ପ୍ରତି ସଜାଗ ରୁହନ୍ତୁ।'
        }
      };
    case 'Karka':
      return {
        ghatakaRashi: 'Kumbha',
        ghatakaMasa: 'ପୌଷ (Pausha)',
        ghatakaTithi: '୨, ୭, ୧୨ (ଭଦ୍ରା ତିଥି / Bhadra)',
        ghatakaVara: 'ବୁଧବାର (Wednesday)',
        ghatakaNakshatra: 'ଅନୁରାଧା (Anuradha)',
        ghatakaLagna: 'Karka',
        ghatakaPrahar: '୪ର୍ଥ ପ୍ରହର (Fourth Prahar, Evening)',
        cautionGuidance: {
          en: 'Aquarius transit (Ashtama Chandra) and Wednesdays require emotional calm. Guard health and avoid emotional confrontations.',
          hi: 'कुंभ राशि का अष्टम चंद्र गोचर एवं बुधवार को भावनात्मक संतुलन बनाए रखें। स्वास्थ्य के प्रति सचेत रहें।',
          or: 'କୁମ୍ଭ ରାଶିର ଅଷ୍ଟମ ଚନ୍ଦ୍ର ଓ ବୁଧବାର ଦିନ ମାନସିକ ସ୍ଥିରତା ରଖନ୍ତୁ। ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରତି ଯତ୍ନବାନ ହୁଅନ୍ତୁ।'
        }
      };
    case 'Simha':
      return {
        ghatakaRashi: 'Makara',
        ghatakaMasa: 'ଜ୍ୟେଷ୍ଠ (Jyeshtha)',
        ghatakaTithi: '୩, ୮, ୧୩ (ଜୟା ତିଥି / Jaya)',
        ghatakaVara: 'ଗୁରୁବାର (Thursday)',
        ghatakaNakshatra: 'ମୂଳା (Mula)',
        ghatakaLagna: 'Simha',
        ghatakaPrahar: '୧ମ ପ୍ରହର (First Prahar, Morning)',
        cautionGuidance: {
          en: 'Capricorn Moon transit and Thursdays bring potential professional friction. Practice humility in leadership disputes.',
          hi: 'मकर चंद्र गोचर और गुरुवार के दिन वरिष्ठों से विवाद से बचें। मूला नक्षत्र में संयम बरतें।',
          or: 'ମକର ଚନ୍ଦ୍ର ଓ ଗୁରୁବାର ଦିନ ଉଚ୍ଚପଦସ୍ଥଙ୍କ ସହ ବିବାଦରୁ ବଞ୍ଚନ୍ତୁ। ମୂଳା ନକ୍ଷତ୍ରରେ ଶାନ୍ତ ରୁହନ୍ତୁ।'
        }
      };
    case 'Kanya':
      return {
        ghatakaRashi: 'Meena',
        ghatakaMasa: 'ଚୈତ୍ର (Chaitra)',
        ghatakaTithi: '୫, ୧୦, ୧୫ (ପୂର୍ଣ୍ଣା ତିଥି / Purna)',
        ghatakaVara: 'ଶନିବାର (Saturday)',
        ghatakaNakshatra: 'ଶ୍ରବଣା (Shravana)',
        ghatakaLagna: 'Kanya',
        ghatakaPrahar: '୨ୟ ପ୍ରହର (Second Prahar, Midday)',
        cautionGuidance: {
          en: 'Pisces Moon transit and Saturdays can cloud analytical clarity. Avoid overanalyzing or entering speculative agreements.',
          hi: 'मीन राशि के चंद्र गोचर और शनिवार को महत्वपूर्ण निर्णयों में किसी विश्वसनीय व्यक्ति की सलाह लें।',
          or: 'ମୀନ ଚନ୍ଦ୍ର ଓ ଶନିବାର ଦିନ ଦ୍ୱନ୍ଦ୍ୱରେ ପଡ଼ନ୍ତୁ ନାହିଁ। ବୁଝିବିଚାରି ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ।'
        }
      };
    case 'Tula':
      return {
        ghatakaRashi: 'Dhanu',
        ghatakaMasa: 'ବୈଶାଖ (Baisakha)',
        ghatakaTithi: '୪, ୯, ୧୪ (ରିକ୍ତା ତିଥି / Rikta)',
        ghatakaVara: 'ଗୁରୁବାର (Thursday)',
        ghatakaNakshatra: 'ଶତଭିଷା (Shatabhisha)',
        ghatakaLagna: 'Tula',
        ghatakaPrahar: '୩ୟ ପ୍ରହର (Third Prahar, Afternoon)',
        cautionGuidance: {
          en: 'Sagittarius transit and Rikta tithis (4th, 9th, 14th) are prone to expenditure. Refrain from signing heavy purchase deeds.',
          hi: 'धनु चंद्र गोचर और रिक्ता तिथियों में व्यर्थ खर्चों और विवादों से बचें। गुरुवार को संयम रखें।',
          or: 'ଧନୁ ଚନ୍ଦ୍ର ଓ ରିକ୍ତା ତିଥିରେ ଅଯଥା ଖର୍ଚ୍ଚ ଓ କଳହରୁ ବଞ୍ଚନ୍ତୁ। ଗୁରୁବାର ଦିନ ଶାନ୍ତ ରୁହନ୍ତୁ।'
        }
      };
    case 'Vrischika':
      return {
        ghatakaRashi: 'Vrishabha',
        ghatakaMasa: 'ଆଶ୍ୱିନ (Aswina)',
        ghatakaTithi: '୫, ୧୦, ୧୫ (ପୂର୍ଣ୍ଣା ତିଥି / Purna)',
        ghatakaVara: 'ଶୁକ୍ରବାର (Friday)',
        ghatakaNakshatra: 'ରେବତୀ (Revati)',
        ghatakaLagna: 'Vrischika',
        ghatakaPrahar: '୪ର୍ଥ ପ୍ରହର (Fourth Prahar, Evening)',
        cautionGuidance: {
          en: 'Taurus Moon transit opposite natal moon can amplify emotional tension. Maintain balance with spouse and partners on Fridays.',
          hi: 'वृषभ चंद्र गोचर और शुक्रवार को दाम्पत्य एवं व्यापारिक साझेदारों के साथ शांति बनाए रखें।',
          or: 'ବୃଷ ଚନ୍ଦ୍ର ଓ ଶୁକ୍ରବାର ଦିନ ପାରିବାରିକ ଓ ବ୍ୟବସାୟିକ ସମ୍ପର୍କରେ ଧୈର୍ଯ୍ୟ ରଖନ୍ତୁ।'
        }
      };
    case 'Dhanu':
      return {
        ghatakaRashi: 'Mithuna',
        ghatakaMasa: 'ଶ୍ରାବଣ (Sravana)',
        ghatakaTithi: '୧, ୬, ୧୧ (ନନ୍ଦା ତିଥି / Nanda)',
        ghatakaVara: 'ଶୁକ୍ରବାର (Friday)',
        ghatakaNakshatra: 'ଭରଣୀ (Bharani)',
        ghatakaLagna: 'Dhanu',
        ghatakaPrahar: '୧ମ ପ୍ରହର (First Prahar, Morning)',
        cautionGuidance: {
          en: 'Gemini Moon transit and Fridays may bring mixed communications. Verify all written words and contractual clauses.',
          hi: 'मिथुन चंद्र गोचर और शुक्रवार को संवाद में स्पष्टता रखें। भरणी नक्षत्र में विवाद से बचें।',
          or: 'ମିଥୁନ ଚନ୍ଦ୍ର ଓ ଶୁକ୍ରବାର ଦିନ କଥାବାର୍ତ୍ତାରେ ସତର୍କ ରୁହନ୍ତୁ। ଭରଣୀ ନକ୍ଷତ୍ରରେ ବିବାଦରୁ ଦୂରେଇ ରୁହନ୍ତୁ।'
        }
      };
    case 'Makara':
      return {
        ghatakaRashi: 'Simha',
        ghatakaMasa: 'ଭାଦ୍ରବ (Bhadraba)',
        ghatakaTithi: '୪, ୯, ୧୪ (ରିକ୍ତା ତିଥି / Rikta)',
        ghatakaVara: 'ମଙ୍ଗଳବାର (Tuesday)',
        ghatakaNakshatra: 'ରୋହିଣୀ (Rohini)',
        ghatakaLagna: 'Makara',
        ghatakaPrahar: '୨ୟ ପ୍ରହର (Second Prahar, Midday)',
        cautionGuidance: {
          en: 'Leo transit (Ashtama Chandra) and Tuesdays necessitate caution in health, travel, and dealings with authority.',
          hi: 'सिंह राशि का अष्टम चंद्र गोचर और मंगलवार को यात्रा व स्वास्थ्य में विशेष सावधानी रखें।',
          or: 'ସିଂହ ରାଶିର ଅଷ୍ଟମ ଚନ୍ଦ୍ର ଓ ମଙ୍ଗଳବାର ଦିନ ଯାତ୍ରା ଓ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରତି ବିଶେଷ ସାବଧାନ ରୁହନ୍ତୁ।'
        }
      };
    case 'Kumbha':
      return {
        ghatakaRashi: 'Mesha',
        ghatakaMasa: 'ମାର୍ଗଶିର (Margasira)',
        ghatakaTithi: '୩, ୮, ୧୩ (ଜୟା ତିଥି / Jaya)',
        ghatakaVara: 'ଗୁରୁବାର (Thursday)',
        ghatakaNakshatra: 'ଆର୍ଦ୍ରା (Ardra)',
        ghatakaLagna: 'Kumbha',
        ghatakaPrahar: '୩ୟ ପ୍ରହର (Third Prahar, Afternoon)',
        cautionGuidance: {
          en: 'Aries Moon transit and Thursdays bring impulse. Avoid risky physical endeavors or hasty financial bets during Ardra.',
          hi: 'मेष चंद्र गोचर और गुरुवार को जल्दबाजी में निर्णय न लें। आर्द्रा नक्षत्र में मानसिक शांति रखें।',
          or: 'ମେଷ ଚନ୍ଦ୍ର ଓ ଗୁରୁବାର ଦିନ ହଠାତ୍ ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ ନାହିଁ। ଆର୍ଦ୍ରା ନକ୍ଷତ୍ରରେ ଶାନ୍ତ ରୁହନ୍ତୁ।'
        }
      };
    case 'Meena':
    default:
      return {
        ghatakaRashi: 'Karka',
        ghatakaMasa: 'ଆଶ୍ୱିନ (Aswina)',
        ghatakaTithi: '୩, ୮, ୧୩ (ଜୟା ତିଥି / Jaya)',
        ghatakaVara: 'ଶୁକ୍ରବାର (Friday)',
        ghatakaNakshatra: 'ଆଶ୍ଲେଷା (Ashlesha)',
        ghatakaLagna: 'Meena',
        ghatakaPrahar: '୪ର୍ଥ ପ୍ରହର (Fourth Prahar, Evening)',
        cautionGuidance: {
          en: 'Cancer Moon transit and Ashlesha nakshatra heighten sensitivity. Do not lend uncollateralized money or sign major deeds on Fridays.',
          hi: 'कर्क चंद्र गोचर और अश्लेषा नक्षत्र में अत्यधिक भावुकता से बचें। शुक्रवार को धन उधार न दें।',
          or: 'କର୍କଟ ଚନ୍ଦ୍ର ଓ ଅଶ୍ଳେଷା ନକ୍ଷତ୍ରରେ ଭାବପ୍ରବଣ ହୁଅନ୍ତୁ ନାହିଁ। ଶୁକ୍ରବାର ଦିନ ଧନ ଉଧାର ଦିଅନ୍ତୁ ନାହିଁ।'
        }
    }
  };
}
