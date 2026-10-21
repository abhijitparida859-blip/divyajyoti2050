import { NakshatraSacredData } from '../../types/jataka';
import { NAKSHATRA_NAMES } from '../panjika/panjika_engine';
import { normalizeDegrees } from '../astronomy/ephemeris';

const SACRED_TREES = [
  { or: 'କୁଚିଲା (Kuchila)', bot: 'Strychnos nux-vomica', en: 'Poison Nut Tree' },
  { or: 'ଅଁଳା (Amla)', bot: 'Phyllanthus emblica', en: 'Indian Gooseberry' },
  { or: 'ଡିମ୍ବିରି (Audumbara / Gular)', bot: 'Ficus glomerata', en: 'Cluster Fig' },
  { or: 'ଜାମୁ (Jamun)', bot: 'Syzygium cumini', en: 'Black Plum' },
  { or: 'ଖଦିର (Khadira)', bot: 'Acacia catechu', en: 'Black Cutch' },
  { or: 'ଅଗୁରୁ (Agaru / Krishna Agar)', bot: 'Aquilaria agallocha', en: 'Agarwood' },
  { or: 'ବାଉଁଶ (Baunsha / Vamsha)', bot: 'Bambusa arundinacea', en: 'Giant Bamboo' },
  { or: 'ଅଶ୍ୱତ୍ଥ / ଓସ୍ତ (Peepal / Ashvattha)', bot: 'Ficus religiosa', en: 'Sacred Fig' },
  { or: 'ନାଗକେଶର (Nagakeshara)', bot: 'Mesua ferrea', en: 'Ceylon Ironwood' },
  { or: 'ବର ଗଛ (Vata / Banyan)', bot: 'Ficus benghalensis', en: 'Indian Banyan' },
  { or: 'ପଳାଶ (Palasha / Dhak)', bot: 'Butea monosperma', en: 'Flame of the Forest' },
  { or: 'ପ୍ଲକ୍ଷ / ଖରସାଣ (Plaksha / Pakar)', bot: 'Ficus infectoria', en: 'White Fig' },
  { or: 'ଜୁଈ / ଚାମେଲୀ (Jaati / Chameli)', bot: 'Jasminum grandiflorum', en: 'Royal Jasmine' },
  { or: 'ବେଲ (Bilva / Bel)', bot: 'Aegle marmelos', en: 'Golden Apple / Bael' },
  { or: 'ଅର୍ଜୁନ (Arjuna)', bot: 'Terminalia arjuna', en: 'Arjun Tree' },
  { or: 'କଇଥ (Kaitha / Wood Apple)', bot: 'Limonia acidissima', en: 'Wood Apple' },
  { or: 'ବଉଳ (Bakula / Maulsari)', bot: 'Mimusops elengi', en: 'Spanish Cherry' },
  { or: 'ଶିମିଳି (Shalmali / Semal)', bot: 'Bombax ceiba', en: 'Silk Cotton Tree' },
  { or: 'ଶାଳ (Shala / Sarjara)', bot: 'Shorea robusta', en: 'Sal Tree' },
  { or: 'ଅଶୋକ (Ashoka)', bot: 'Saraca asoca', en: 'Sorrowless Tree' },
  { or: 'ପଣସ (Panasa / Jackfruit)', bot: 'Artocarpus heterophyllus', en: 'Jackfruit Tree' },
  { or: 'ଅରକ (Arka / Calotropis)', bot: 'Calotropis gigantea', en: 'Crown Flower' },
  { or: 'ଶମୀ (Shami)', bot: 'Prosopis cineraria', en: 'Khejri / Shami' },
  { or: 'କଦମ୍ବ (Kadamba)', bot: 'Neolamarckia cadamba', en: 'Burflower Tree' },
  { or: 'ଆମ୍ବ (Amra / Mango)', bot: 'Mangifera indica', en: 'Indian Mango Tree' },
  { or: 'ନିମ (Nimba / Neem)', bot: 'Azadirachta indica', en: 'Neem Tree' },
  { or: 'ମହୁଲ (Mahua)', bot: 'Madhuca longifolia', en: 'Butter Tree' }
];

const DEITIES = [
  { name: { en: 'Ashwini Kumaras (Divine Healers)', hi: 'अश्विनी कुमार', or: 'ଅଶ୍ୱିନୀ କୁମାର (ଦେବ ବୈଦ୍ୟ)' }, mantra: 'ଓଁ ଅଶ୍ୱିନୀକୁମାରାଭ୍ୟାଂ ନମଃ' },
  { name: { en: 'Yama (Lord of Dharma & Truth)', hi: 'यमराज', or: 'ଯମରାଜ (ଧର୍ମରାଜ)' }, mantra: 'ଓଁ ଯମାୟ ନମଃ' },
  { name: { en: 'Agni (Cosmic Sacred Fire)', hi: 'अग्नि देव', or: 'ଅଗ୍ନି ଦେବ' }, mantra: 'ଓଁ ଅଗ୍ନୟେ ନମଃ' },
  { name: { en: 'Prajapati / Brahma (Creator)', hi: 'प्रजापति ब्रह्मा', or: 'ପ୍ରଜାପତି ବ୍ରହ୍ମା' }, mantra: 'ଓଁ ପ୍ରଜାପତୟେ ନମଃ' },
  { name: { en: 'Soma / Chandra (Nectar of Immortality)', hi: 'सोम देव', or: 'ସୋମ ଦେବ (ଚନ୍ଦ୍ର)' }, mantra: 'ଓଁ ସୋମାୟ ନମଃ' },
  { name: { en: 'Rudra (Transformative Cosmic Power)', hi: 'रुद्र देव', or: 'ଭଗବାନ ରୁଦ୍ର' }, mantra: 'ଓଁ ରୁଦ୍ରାୟ ନମଃ' },
  { name: { en: 'Aditi (Cosmic Mother of Gods)', hi: 'माता अदिति', or: 'ଦେବମାତା ଅଦିତି' }, mantra: 'ଓଁ ଅଦିତୟେ ନମଃ' },
  { name: { en: 'Brihaspati (Divine Counselor)', hi: 'देवगुरु बृहस्पति', or: 'ଦେବଗୁରୁ ବୃହସ୍ପତି' }, mantra: 'ଓଁ ବୃହସ୍ପତୟେ ନମଃ' },
  { name: { en: 'Sarpas / Nagaraja (Primordial Kundalini)', hi: 'सर्प / नागराज', or: 'ନାଗରାଜ (ଅନନ୍ତ)' }, mantra: 'ଓଁ ସର୍ପେଭ୍ୟୋ ନମଃ' },
  { name: { en: 'Pitris (Ancestral Guardian Spirits)', hi: 'पितृ देव', or: 'ପିତୃଗଣ' }, mantra: 'ଓଁ ପିତୃଭ୍ୟୋ ନମଃ' },
  { name: { en: 'Bhaga (Bestower of Wealth & Prosperity)', hi: 'भग देव', or: 'ଭଗ ଦେବ (ସୌଭାଗ୍ୟ ପ୍ରଦାତା)' }, mantra: 'ଓଁ ଭଗାୟ ନମଃ' },
  { name: { en: 'Aryama (God of Honor, Alliances & Sun)', hi: 'अर्यमा देव', or: 'ଅର୍ଯ୍ୟମା ଦେବ' }, mantra: 'ଓଁ ଅର୍ଯ୍ୟମ୍ଣେ ନମଃ' },
  { name: { en: 'Savitur (Golden Divine Sun of Awakening)', hi: 'सविता देव', or: 'ସବିତୃ ଦେବ (ସୂର୍ଯ୍ୟନାରାୟଣ)' }, mantra: 'ଓଁ ସବିତ୍ରେ ନମଃ' },
  { name: { en: 'Vishwakarma (Divine Architect of Cosmos)', hi: 'विश्वकर्मा देव', or: 'ଦେବଶିଳ୍ପୀ ବିଶ୍ୱକର୍ମା' }, mantra: 'ଓଁ ବିଶ୍ୱକର୍ମଣେ ନମଃ' },
  { name: { en: 'Vayu (Lord of Wind & Prana Life-Force)', hi: 'वायु देव', or: 'ପବନ ଦେବ (ବାୟୁ)' }, mantra: 'ଓଁ ବାୟବେ ନମଃ' },
  { name: { en: 'Indragni (Dual Deities of Triumph & Light)', hi: 'इन्द्राग्नि देव', or: 'ଇନ୍ଦ୍ରାଗ୍ନି ଦେବ' }, mantra: 'ଓଁ ଇନ୍ଦ୍ରାଗ୍ନିଭ୍ୟାଂ ନମଃ' },
  { name: { en: 'Mitra (Divine Harmonizer & Friendship)', hi: 'मित्र देव', or: 'ମିତ୍ର ଦେବ' }, mantra: 'ଓଁ ମିତ୍ରାୟ ନମଃ' },
  { name: { en: 'Indra (King of Celestial Devas)', hi: 'ଦେବରାଜ ଇନ୍ଦ୍ର', or: 'ଦେବରାଜ ଇନ୍ଦ୍ର' }, mantra: 'ଓଁ ଇନ୍ଦ୍ରାୟ ନମଃ' },
  { name: { en: 'Nirriti (Goddess of Dissolution & Roots)', hi: 'निरृति देवी', or: 'ଦେବୀ ନିଋତି' }, mantra: 'ଓଁ ନିଋତୟେ ନମଃ' },
  { name: { en: 'Apas (Cosmic Primordial Waters)', hi: 'आपः देवी', or: 'ଆପଃ (ବରୁଣ/କୋଶିକ ଜଳ)' }, mantra: 'ଓଁ ଅଦ୍ଭ୍ୟୋ ନମଃ' },
  { name: { en: 'Vishwadevas (Universal Cosmic Protectors)', hi: 'विश्वेदेव', or: 'ବିଶ୍ୱେଦେବାଃ' }, mantra: 'ଓଁ ବିଶ୍ୱେଦେବେଭ୍ୟୋ ନମଃ' },
  { name: { en: 'Lord Vishnu (Supreme Preserver)', hi: 'भगवान श्री विष्णु', or: 'ଭଗବାନ ଶ୍ରୀ ବିଷ୍ଣୁ / ଜଗନ୍ନାଥ' }, mantra: 'ଓଁ ନମୋ ଭଗବତେ ବାସୁଦେବାୟ' },
  { name: { en: 'Ashta Vasus (Elemental Lords of Abundance)', hi: 'अष्ट वसु', or: 'ଅଷ୍ଟ ବସୁ' }, mantra: 'ଓଁ ବସୁଭ୍ୟୋ ନମଃ' },
  { name: { en: 'Varuna (Lord of Cosmic Law & Oceans)', hi: 'वरुण देव', or: 'ବରୁଣ ଦେବ' }, mantra: 'ଓଁ ବରୁଣାୟ ନମଃ' },
  { name: { en: 'Aja Ekapada (One-Footed Cosmic Fire Ascetic)', hi: 'अज एकपाद', or: 'ଅଜ ଏକପାଦ (ରୁଦ୍ରାବତାର)' }, mantra: 'ଓଁ ଅଜୈକପାଦେ ନମଃ' },
  { name: { en: 'Ahirbudhnya (Serpent of Deep Primordial Abyss)', hi: 'अहिर्बुध्न्य', or: 'ଅହିର୍ବୁଧ୍ନ୍ୟ (ଗଭୀର ଜଳଜ ରୁଦ୍ର)' }, mantra: 'ଓଁ ଅହିର୍ବୁଧ୍ନ୍ୟାୟ ନମଃ' },
  { name: { en: 'Pushan (Protector of Travelers & Souls)', hi: 'पूषा देव', or: 'ପୂଷା ଦେବ (ପଥ ପ୍ରଦର୍ଶକ)' }, mantra: 'ଓଁ ପୂଷ୍ଣେ ନମଃ' }
];

const SYMBOLS = [
  { en: "Horse's Head", hi: 'अश्व का मुख', or: 'ଅଶ୍ୱର ମସ୍ତକ' },
  { en: 'Yoni / Triangle of Creation', hi: 'योनि / सृष्टि त्रिकोण', or: 'ଯୋନି / ତ୍ରିକୋଣ' },
  { en: 'Razor / Flame', hi: 'क्षुर / अग्नि शिखा', or: 'ଛୁରି / ଅଗ୍ନିଶିଖା' },
  { en: 'Temple Chariot / Cart', hi: 'रथ / शकट', or: 'ମନ୍ଦିର ରଥ' },
  { en: "Deer's Head", hi: 'मृगशीर्ष', or: 'ହରିଣର ମସ୍ତକ' },
  { en: 'Teardrop / Diamond', hi: 'अश्रुबिंदु / वज्र', or: 'ଅଶ୍ରୁବିନ୍ଦୁ / ହୀରା' },
  { en: 'Bow and Quiver of Arrows', hi: 'धनुष एवं बाण', or: 'ଧନୁ ଓ ତୂଣୀର' },
  { en: "Cow's Udder / Golden Lotus", hi: 'गो-स्तन / कमल', or: 'ଧେନୁସ୍ତନ / ପଦ୍ମ' },
  { en: 'Coiled Serpent', hi: 'कुंडलित सर्प', or: 'କୁଣ୍ଡଳୀକୃତ ସର୍ପ' },
  { en: 'Royal Throne / Palanquin', hi: 'राज सिंहासन / पालकी', or: 'ରାଜ ସିଂହାସନ' },
  { en: 'Front Legs of Couch', hi: 'शय्या के अग्र पाद', or: 'ପଲଙ୍କର ଅଗ୍ରଭାଗ' },
  { en: 'Back Legs of Couch', hi: 'शय्या के पश्च पाद', or: 'ପଲଙ୍କର ପୃଷ୍ଠଭାଗ' },
  { en: 'Open Benevolent Palm', hi: 'हस्त कमल (खुली हथेली)', or: 'ଉନ୍ମୁକ୍ତ ହସ୍ତ ପଦ୍ମ' },
  { en: 'Bright Luminous Pearl / Gem', hi: 'दीप्तिमान मणि / मोती', or: 'ଉଜ୍ଜ୍ୱଳ ମଣି / ମୁକ୍ତା' },
  { en: 'Young Tender Shoot of Plant', hi: 'अंकुरित प्रवाल', or: 'ଅଙ୍କୁରିତ ନବପଲ୍ଲବ' },
  { en: "Triumphal Arch / Potter's Wheel", hi: 'विजय तोरण / चक्र', or: 'ବିଜୟ ତୋରଣ' },
  { en: 'Blossoming Lotus / Row of Offerings', hi: 'प्रफुल्लित कमल', or: 'ପ୍ରସ୍ଫୁଟିତ ପଦ୍ମଫୁଲ' },
  { en: 'Circular Amulet / Royal Umbrella', hi: 'कुंडल / छत्र', or: 'ରାଜ ଛତ୍ର / କବଚ' },
  { en: 'Tied Bundle of Roots', hi: 'मूल समूह (जड़ों का गुच्छा)', or: 'ମୂଳ ବନ୍ଧନ' },
  { en: 'Winnowing Basket / Elephant Tusk', hi: 'शूर्प (सूप) / हस्तिदंत', or: 'କୁଲା / ହାତୀଦାନ୍ତ' },
  { en: 'Elephant Tusk / Planks of Cot', hi: 'हस्तिदंत', or: 'ହସ୍ତୀ ଦନ୍ତ' },
  { en: 'Three Divine Footprints / Ear of Wisdom', hi: 'त्रिविक्रम पदचिह्न / कर्ण', or: 'ତ୍ରିବିକ୍ରମ ପଦଚିହ୍ନ / କାନ' },
  { en: 'Mridanga / Musical Damaru', hi: 'मृदंग / डमरू', or: 'ମୃଦଙ୍ଗ / ଡମ୍ବରୁ' },
  { en: 'Empty Circle / 100 Physicians', hi: 'शतभिषज (वृत्त)', or: 'ଖାଲି ବୃତ୍ତ / ଶତଭିଷକ' },
  { en: 'Front of Funeral Bed / Two-Faced Man', hi: 'खट्वा पाद', or: 'ଦ୍ୱିମୁଖୀ ପୁରୁଷ' },
  { en: 'Back of Funeral Bed / Deep Sea Serpent', hi: 'सागर सर्प', or: 'ସାଗର ସର୍ପ' },
  { en: 'Pair of Swimming Fish', hi: 'मीन युगल', or: 'ମତ୍ସ୍ୟ ଯୁଗଳ' }
];

export function calculateNakshatraSacredLore(
  moonLongitude: number
): NakshatraSacredData {
  const normDeg = normalizeDegrees(moonLongitude);
  const nakIndex = Math.min(26, Math.floor(normDeg / (360 / 27)));
  const degInNak = normDeg % (360 / 27);
  const pada = Math.min(4, Math.floor(degInNak / (360 / 108)) + 1);

  const nakNameOdia = NAKSHATRA_NAMES[nakIndex] || 'ଅଶ୍ୱିନୀ';
  const tree = SACRED_TREES[nakIndex];
  const deity = DEITIES[nakIndex];
  const symbol = SYMBOLS[nakIndex];

  // Pada Specific Spiritual Destiny
  const padaDescriptions = [
    {
      en: `Pada 1 (Dharma Quarter): Endowed with active initiative, high ethical conscience, and pioneer dynamism. Ruled by the fiery spiritual impulse.`,
      hi: `प्रथम पाद (धर्म पाद): अग्रणी स्वभाव, नैतिक निष्ठा और ऊर्जावान व्यक्तित्व।`,
      or: `୧ମ ପାଦ (ଧର୍ମ ପାଦ): ସାହସୀ ସ୍ୱଭାବ, ଧାର୍ମିକ ବିଶ୍ୱାସ ଓ ନେତୃତ୍ୱ ପ୍ରଦାନ କରିବାର ଅଭୂତ ଶକ୍ତି।`
    },
    {
      en: `Pada 2 (Artha Quarter): Deeply pragmatic, resource-conscious, persistent and skilled in materializing tangible prosperity.`,
      hi: `द्वितीय पाद (अर्थ पाद): व्यावहारिक बुद्धि, धैर्य और स्थिर आर्थिक समृद्धि प्राप्त करने में निपुण।`,
      or: `୨ୟ ପାଦ (ଅର୍ଥ ପାଦ): ବ୍ୟାବହାରିକ ବୁଦ୍ଧି, ଧୈର୍ଯ୍ୟ ଓ ସ୍ଥିର ଧନ ସଞ୍ଚୟ କରିବାର ସାମର୍ଥ୍ୟ।`
    },
    {
      en: `Pada 3 (Kama Quarter): Intellectually curious, socially communicative, artistic and driven by relational harmony.`,
      hi: `तृतीय पाद (काम पाद): कलात्मक अभिरुचि, तीव्र संवाद कौशल और सामाजिक सौहार्द।`,
      or: `୩ୟ ପାଦ (କାମ ପାଦ): ସୃଜନଶୀଳତା, ମଧୁର ବାଣୀ, ସାମାଜିକ ପ୍ରତିଷ୍ଠା ଓ କଳାତ୍ମକ ପ୍ରତିଭା।`
    },
    {
      en: `Pada 4 (Moksha Quarter): Highly intuitive, introspective, compassionate and oriented towards transcendent spiritual wisdom.`,
      hi: `चतुर्थ पाद (मोक्ष पाद): गहन अंतर्ज्ञान, परोपकार और आध्यात्मिक अनुसंधान में अग्रसर।`,
      or: `୪ର୍ଥ ପାଦ (ମୋକ୍ଷ ପାଦ): ଗଭୀର ଅନ୍ତର୍ଦୃଷ୍ଟି, ପରୋପକାରୀ ମନୋଭାବ ଓ ଆଧ୍ୟାତ୍ମିକ ସାଧନା।`
    }
  ];

  return {
    nakshatraName: { en: nakNameOdia, hi: nakNameOdia, or: nakNameOdia },
    pada,
    sacredTree: {
      odiaName: tree.or,
      botanicalName: tree.bot,
      englishName: tree.en,
      spiritualSignificance: {
        en: `Planting or honoring the sacred ${tree.en} (${tree.or}) invokes harmony and balances the ${nakNameOdia} biological field.`,
        hi: `पवित्र ${tree.or} वृक्ष का रोपण अथवा संरक्षण आपके नक्षत्र को शांत और ऊर्जावान बनाए रखता है।`,
        or: `ପବିତ୍ର ${tree.or} ବୃକ୍ଷର ସେବା କିମ୍ବା ରୋପଣ ଆପଣଙ୍କ ଜନ୍ମ ନକ୍ଷତ୍ରର ନକାରାତ୍ମକ ପ୍ରଭାବ ଦୂର କରି ଶୁଭତ୍ୱ ପ୍ରଦାନ କରେ।`
      }
    },
    deity: {
      name: deity.name,
      mantra: deity.mantra,
      blessing: {
        en: `Worshipping ${deity.name.en} aligns your life with cosmic protection, unlocking latent talents and peaceful longevity.`,
        hi: `${deity.name.hi} की आराधना से जीवन में शांति, दीर्घायु और प्रतिभा का पूर्ण विकास होता है।`,
        or: `${deity.name.or}ଙ୍କ ନିୟମିତ ସ୍ମରଣ ଦ୍ୱାରା ଅପାର କୃପା, ଆୟୁଷ ଓ ସମସ୍ତ କାର୍ଯ୍ୟରେ ସିଦ୍ଧି ମିଳେ।`
      }
    },
    symbol,
    bird: { en: 'Golden Eagle / Falcon', hi: 'गरुड़ / चील', or: 'ଶାଗୁଣା / ଚିଲ / ଗରୁଡ଼' },
    animal: { en: 'Divine Asterism Totem', hi: 'नक्षत्र पशु', or: 'ପବିତ୍ର ପ୍ରାଣୀ' },
    padaDestiny: padaDescriptions[pada - 1]
  };
}
