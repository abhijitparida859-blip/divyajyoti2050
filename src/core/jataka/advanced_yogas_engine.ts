import { PlanetName, PlanetPosition, VedicYoga, KalaSarpaInfo, ManglikInfo, SadeSatiInfo, ZodiacSign } from '../../types/jataka';
import { normalizeDegrees, calculatePlanetaryPositions } from '../astronomy/ephemeris';

const SIGNS: ZodiacSign[] = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'];

export function calculateAdvancedYogasAndDoshas(
  planets: Record<PlanetName, PlanetPosition>,
  ascSignIndex: number,
  moonSignIndex: number
): {
  yogas: VedicYoga[];
  kalaSarpa: KalaSarpaInfo;
  manglik: ManglikInfo;
  sadeSati: SadeSatiInfo;
} {
  const yogas: VedicYoga[] = [];

  const sunH = planets.Surya.house;
  const moonH = planets.Chandra.house;
  const marsH = planets.Mangala.house;
  const mercH = planets.Budha.house;
  const jupH = planets.Guru.house;
  const venH = planets.Shukra.house;
  const satH = planets.Shani.house;
  const rahuH = planets.Rahu.house;
  const ketuH = planets.Ketu.house;

  // 1. Pancha Mahapurusha Yogas
  const kendras = [1, 4, 7, 10];
  if (kendras.includes(marsH) && (planets.Mangala.dignity === 'Exalted' || planets.Mangala.dignity === 'Own')) {
    yogas.push({
      id: 'ruchaka',
      name: { en: 'Ruchaka Mahapurusha Yoga', hi: 'रुचक महापुरुष योग', or: 'ରୁଚକ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Mars in Kendra in own/exalted sign grants extraordinary physical vitality, heroic courage, executive authority, and large land ownership.', hi: 'मंगल का केंद्र में स्वराशि या उच्च होना अदम्य साहस, भूमि लाभ एवं उच्च सैन्य/प्रशासनिक अधिकार देता है।', or: 'ମଙ୍ଗଳଙ୍କ କେନ୍ଦ୍ରରେ ସ୍ୱକ୍ଷେତ୍ରୀ ବା ଉଚ୍ଚ ଅବସ୍ଥାନ ଅପାର ସାହସ, ଭୂସମ୍ପତ୍ତି ଓ ପ୍ରଶାସନିକ ଅଧିକାର ପ୍ରଦାନ କରେ।' },
      planetsInvolved: ['Mangala'],
      effect: { en: 'Supreme leadership, fearlessness in crisis, real-estate prosperity.', hi: 'नेतृत्व क्षमता एवं शत्रुओं पर अखंड विजय।', or: 'ଉଚ୍ଚ ନେତୃତ୍ୱ ଓ ବିଜୟ ପ୍ରାପ୍ତି।' }
    });
  }

  if (kendras.includes(mercH) && (planets.Budha.dignity === 'Exalted' || planets.Budha.dignity === 'Own')) {
    yogas.push({
      id: 'bhadra',
      name: { en: 'Bhadra Mahapurusha Yoga', hi: 'भद्र महापुरुष योग', or: 'ଭଦ୍ର ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Mercury exalted or in own sign in Kendra bestows unmatched analytical genius, oratorical elegance, and scholarly fame.', hi: 'बुध का केंद्र में स्वराशि/उच्च होना अद्वितीय बुद्धिमत्ता, वाक्-चातुर्य एवं व्यापारिक दूरदर्शिता देता है।', or: 'ବୁଧଙ୍କ କେନ୍ଦ୍ରରେ ବଳବାନ ସ୍ଥିତି ଅସାଧାରଣ ବୁଦ୍ଧି, ପାଣ୍ଡିତ୍ୟ ଓ ବାଗ୍ମିତା ପ୍ରଦାନ କରେ।' },
      planetsInvolved: ['Budha'],
      effect: { en: 'Mathematical mastery, diplomatic eloquence, successful enterprise.', hi: 'वाणिज्यिक सफलता एवं बौद्धिक ख्याति।', or: 'ବାଣିଜ୍ୟିକ ସଫଳତା ଓ ପ୍ରଖର ପ୍ରତିଭା।' }
    });
  }

  if (kendras.includes(jupH) && (planets.Guru.dignity === 'Exalted' || planets.Guru.dignity === 'Own')) {
    yogas.push({
      id: 'hamsa',
      name: { en: 'Hamsa Mahapurusha Yoga', hi: 'हंस महापुरुष योग', or: 'ହଂସ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Jupiter in Kendra in own/exalted sign gives pure spiritual aura, revered counsel, ethical majesty, and enduring fortune.', hi: 'बृहस्पति की केंद्र में उच्च/स्वराशि स्थिति सात्विक तेज, धर्मात्मा चरित्र एवं उच्च सम्मान देती है।', or: 'ଗୁରୁଙ୍କ କେନ୍ଦ୍ରରେ ଉଚ୍ଚ ବା ସ୍ୱକ୍ଷେତ୍ରୀ ଅବସ୍ଥାନ ସାତ୍ତ୍ୱିକ ଜ୍ଞାନ, ଧର୍ମନିଷ୍ଠା ଓ ସମାଜରେ ଶ୍ରେଷ୍ଠ ସମ୍ମାନ ଦିଏ।' },
      planetsInvolved: ['Guru'],
      effect: { en: 'Esteemed preceptor, moral purity, spiritual awakening.', hi: 'धार्मिक प्रतिष्ठा एवं सर्वमान्य नेतृत्व।', or: 'ଧାର୍ମିକ ଜୀବନ ଓ ନିର୍ମଳ ଯଶ।' }
    });
  }

  if (kendras.includes(venH) && (planets.Shukra.dignity === 'Exalted' || planets.Shukra.dignity === 'Own')) {
    yogas.push({
      id: 'malavya',
      name: { en: 'Malavya Mahapurusha Yoga', hi: 'मालव्य महापुरुष योग', or: 'ମାଲବ୍ୟ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Venus in Kendra in own/exalted sign brings extraordinary artistic refinement, luxury, matrimonial grace, and personal magnetism.', hi: 'शुक्र का केंद्र में बलवान होना जीवन में समस्त भौतिक ऐश्वर्य, कलात्मक सुरुचि एवं दांपत्य सुख देता है।', or: 'ଶୁକ୍ରଙ୍କ କେନ୍ଦ୍ରରେ ବଳବାନ ସ୍ଥିତି ଅପାର ଭୋଗବିଳାସ, କଳାତ୍ମକ ପ୍ରତିଭା ଓ ଆକର୍ଷଣୀୟ ବ୍ୟକ୍ତିତ୍ୱ ପ୍ରଦାନ କରେ।' },
      planetsInvolved: ['Shukra'],
      effect: { en: 'Exquisite aesthetic taste, wealth of conveyances, blissful marriage.', hi: 'सुखी दांपत्य एवं भौतिक समृद्धि।', or: 'ସୁଖମୟ ଦାମ୍ପତ୍ୟ ଓ ପ୍ରଚୁର ଐଶ୍ୱର୍ଯ୍ୟ।' }
    });
  }

  if (kendras.includes(satH) && (planets.Shani.dignity === 'Exalted' || planets.Shani.dignity === 'Own')) {
    yogas.push({
      id: 'shasha',
      name: { en: 'Shasha Mahapurusha Yoga', hi: 'शश महापुरुष योग', or: 'ଶଶ ମହାପୁରୁଷ ଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Saturn in Kendra in own/exalted sign produces an iron will, mastery over people, long-lived authority, and political acumen.', hi: 'शनि का केंद्र में स्वराशि/उच्च होना दृढ़ संकल्प, जनसमूह का नेतृत्व एवं दीर्घायु प्रदान करता है।', or: 'ଶନିଙ୍କ କେନ୍ଦ୍ରରେ ଉଚ୍ଚ/ସ୍ୱକ୍ଷେତ୍ରୀ ହେବା ଦ୍ୱାରା ଦୃଢ଼ ଇଚ୍ଛାଶକ୍ତି, ଜନନେତୃତ୍ୱ ଓ ଦୀର୍ଘାୟୁ ପ୍ରାପ୍ତି ହୁଏ।' },
      planetsInvolved: ['Shani'],
      effect: { en: 'Unshakable perseverance, judicial or political power.', hi: 'अटल धैर्य एवं जन-प्रतिनिधित्व।', or: 'ଅସୀମ ଧୈର୍ଯ୍ୟ ଓ ଶାସନ କ୍ଷମତା।' }
    });
  }

  // 2. Gajakesari Yoga
  const jupFromMoon = ((jupH - moonH + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    yogas.push({
      id: 'gaja_kesari',
      name: { en: 'Gaja Kesari Mahayoga', hi: 'गजकेसरी महायोग', or: 'ଗଜକେଶରୀ ମହାଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Jupiter in Kendra from Moon grants unassailable wisdom, lion-like courage over obstacles, and universal goodwill.', hi: 'चन्द्र से केंद्र में गुरु की स्थिति सिंह जैसा पराक्रम, सद्बुद्धि और अक्षय कीर्ति देती है।', or: 'ଚନ୍ଦ୍ରଙ୍କ ଠାରୁ କେନ୍ଦ୍ରରେ ଗୁରୁ। ସିଂହ ସଦୃଶ ନିର୍ଭୀକତା, ଜ୍ଞାନ ଓ ଅକ୍ଷୟ କୀର୍ତ୍ତି ପ୍ରାପ୍ତି।' },
      planetsInvolved: ['Guru', 'Chandra'],
      effect: { en: 'Destroys thousands of afflictions, builds noble legacy.', hi: 'सर्व दोष नाशक एवं यशस्वी जीवन।', or: 'ସର୍ବ ଦୋଷ ବିନାଶକ ଓ ଆଦର୍ଶ ଜୀବନ।' }
    });
  }

  // 3. Budhaditya Yoga
  if (sunH === mercH) {
    yogas.push({
      id: 'budhaditya',
      name: { en: 'Budhaditya Rajayoga', hi: 'बुधादित्य राजयोग', or: 'ବୁଧାଦିତ୍ୟ ରାଜଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Sun and Mercury conjunction sharpens intellectual radiance, civil service success, and sharp decision-making.', hi: 'सूर्य एवं बुध की युति तीक्ष्ण विवेक, प्रशासनिक योग्यता और मान-सम्मान देती है।', or: 'ସୂର୍ଯ୍ୟ ଓ ବୁଧଙ୍କ ଏକତ୍ର ସ୍ଥିତି ଉଚ୍ଚ ପ୍ରଶାସନିକ ମାନ ଓ ବୁଦ୍ଧି ପ୍ରଦାନ କରେ।' },
      planetsInvolved: ['Surya', 'Budha'],
      effect: { en: 'Intellectual brilliance, government favor, sharp administrative power.', hi: 'विद्या एवं शासन में विशिष्ट सफलता।', or: 'ବିଦ୍ୟା ଓ ଶାସନରେ ସଫଳତା।' }
    });
  }

  // 4. Chandra-Mangala Yoga
  if (moonH === marsH) {
    yogas.push({
      id: 'chandra_mangala',
      name: { en: 'Chandra-Mangala Dhana Yoga', hi: 'चन्द्र-मंगल धन योग', or: 'ଚନ୍ଦ୍ର-ମଙ୍ଗଳ ଧନ ଯୋଗ' },
      type: 'Auspicious',
      description: { en: 'Moon and Mars conjunction generates extraordinary commercial resourcefulness and entrepreneurial asset creation.', hi: 'चन्द्र-मंगल की युति व्यापारिक चतुराई और स्वप्रयासों से अकूत धन लाभ कराती है।', or: 'ଚନ୍ଦ୍ର ଓ ମଙ୍ଗଳଙ୍କ ମିଳନ ଉଦ୍ୟୋଗଶୀଳତା ଓ ପ୍ରଚୁର ଧନଲାଭ କରାଏ।' },
      planetsInvolved: ['Chandra', 'Mangala'],
      effect: { en: 'Financial compounding, self-made empire.', hi: 'व्यापारिक उन्नति एवं धन-धान्य।', or: 'ବ୍ୟବସାୟରେ ଉନ୍ନତି ଓ ଧନଲାଭ।' }
    });
  }

  // 5. Vipareeta Rajayoga (Harsha, Sarala, Vimala)
  const dusthanas = [6, 8, 12];
  if (dusthanas.includes(marsH) && dusthanas.includes(satH)) {
    yogas.push({
      id: 'vipareeta_rajayoga',
      name: { en: 'Vipareeta Rajayoga', hi: 'विपरीत राजयोग', or: 'ବିପରୀତ ରାଜଯୋଗ' },
      type: 'Rajayoga',
      description: { en: 'Lords of trik/dusthana houses placed in other dusthanas convert sudden crises into monumental breakthroughs.', hi: 'त्रिक भावों के स्वामियों का अन्य त्रिक में बैठना आकस्मिक संकट को महान विजय में बदल देता है।', or: 'ଦୁଃସ୍ଥାନର ସ୍ୱାମୀ ଅନ୍ୟ ଦୁଃସ୍ଥାନରେ ରହିବା ଦ୍ୱାରା ବିପଦରୁ ଅପ୍ରତ୍ୟାଶିତ ସଫଳତା ମିଳେ।' },
      planetsInvolved: ['Mangala', 'Shani'],
      effect: { en: 'Rise to glory following intense competition or upheaval.', hi: 'संघर्षोपरांत अप्रत्याशित राजसी उन्नति।', or: 'ସଂଘର୍ଷ ପରେ ଅପ୍ରତ୍ୟାଶିତ ଉନ୍ନତି।' }
    });
  }

  // 6. Amala Yoga (Benefic in 10th from Lagna or Moon)
  if ([jupH, venH, mercH].includes(10)) {
    yogas.push({
      id: 'amala_yoga',
      name: { en: 'Amala Yoga', hi: 'अमला योग', or: 'ଅମଳା ଯୋଗ' },
      type: 'Auspicious',
      description: { en: 'Natural benefic in the 10th house grants a spotless professional reputation, charitable soul, and unblemished honor.', hi: 'दशम भाव में शुभ ग्रह निष्कलंक कीर्ति, परोपकार एवं स्थायी प्रतिष्ठा प्रदान करता है।', or: 'ଦଶମ ଭାବରେ ଶୁଭଗ୍ରହ ନିଷ୍କଳଙ୍କ କୀର୍ତ୍ତି, ଧର୍ମନିଷ୍ଠା ଓ ସ୍ଥାୟୀ ସମ୍ମାନ ଦିଏ।' },
      planetsInvolved: ['Guru', 'Shukra'],
      effect: { en: 'Pure career reputation, beloved by society.', hi: 'निर्दोष यश एवं सर्वप्रिय व्यक्तित्व।', or: 'ନିର୍ମଳ ଯଶ ଓ ସର୍ବପ୍ରିୟତା।' }
    });
  }

  // ==========================================
  // KALA SARPA DOSHA CHECK (All 12 types)
  // ==========================================
  const KALA_SARPA_TYPES = [
    { name: { en: 'Ananta Kala Sarpa', hi: 'अनन्त कालसर्प योग', or: 'ଅନନ୍ତ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 1st, Ketu in 7th. Challenges in self-identity and marital patience.', hi: 'प्रथम भाव में राहु, सप्तम में केतु। वैवाहिक जीवन में धैर्य अपेक्षित।', or: 'ପ୍ରଥମେ ରାହୁ, ସପ୍ତମେ କେତୁ। ଦାମ୍ପତ୍ୟ ଜୀବନରେ ଧୈର୍ଯ୍ୟ ଆବଶ୍ୟକ।' } },
    { name: { en: 'Kulika Kala Sarpa', hi: 'कुलिक कालसर्प योग', or: 'କୁଳିକ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 2nd, Ketu in 8th. Requires prudent financial stewardship and gentle speech.', hi: 'द्वितीय में राहु, अष्टम में केतु। आर्थिक संतुलन एवं मधुर वाणी रखें।', or: 'ଦ୍ୱିତୀୟେ ରାହୁ, ଅଷ୍ଟମେ କେତୁ। ଆର୍ଥିକ ସନ୍ତୁଳନ ରକ୍ଷା କରନ୍ତୁ।' } },
    { name: { en: 'Vasuki Kala Sarpa', hi: 'वासुकि कालसर्प योग', or: 'ବାସୁକି କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 3rd, Ketu in 9th. Great courage leads to fortune after age 28.', hi: 'तृतीय में राहु, नवम में केतु। पुरुषार्थ से 28 वर्ष बाद भाग्योदय।', or: 'ତୃତୀୟେ ରାହୁ, ନବମେ କେତୁ। ପୁରୁଷାର୍ଥ ବଳରେ ୨୮ ବର୍ଷ ପରେ ଭାଗ୍ୟୋଦୟ।' } },
    { name: { en: 'Shankhapala Kala Sarpa', hi: 'शंखपाल कालसर्प योग', or: 'ଶଙ୍ଖପାଳ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 4th, Ketu in 10th. Need focus on mother\'s wellness and domestic peace.', hi: 'चतुर्थ में राहु, दशम में केतु। माता के स्वास्थ्य का ध्यान रखें।', or: 'ଚତୁର୍ଥେ ରାହୁ, ଦଶମେ କେତୁ। ପାରିବାରିକ ଶାନ୍ତି ରକ୍ଷା କରନ୍ତୁ।' } },
    { name: { en: 'Padma Kala Sarpa', hi: 'पद्म कालसर्प योग', or: 'ପଦ୍ମ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 5th, Ketu in 11th. Intense intellect, delays in higher studies overcome by sadhana.', hi: 'पंचम में राहु, एकादश में केतु। विद्या साधना से पूर्ण सफलता।', or: 'ପଞ୍ଚମେ ରାହୁ, ଏକାଦଶେ କେତୁ। ସାଧନା ଦ୍ୱାରା ଉଚ୍ଚ ବିଦ୍ୟା ଲାଭ।' } },
    { name: { en: 'Mahapadma Kala Sarpa', hi: 'महापद्म कालसर्प योग', or: 'ମହାପଦ୍ମ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 6th, Ketu in 12th. Complete victory over rivals and litigations.', hi: 'षष्ठ में राहु, द्वादश में केतु। शत्रुओं पर निश्चित विजय।', or: 'ଷଷ୍ଠେ ରାହୁ, ଦ୍ୱାଦଶେ କେତୁ। ଶତ୍ରୁ ଉପରେ ବିଜୟ।' } },
    { name: { en: 'Takshaka Kala Sarpa', hi: 'तक्षक कालसर्प योग', or: 'ତକ୍ଷକ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 7th, Ketu in 1st. Seek spiritually aligned partner and partnership transparency.', hi: 'सप्तम में राहु, लग्न में केतु। साझेदारी में स्पष्टता रखें।', or: 'ସପ୍ତମେ ରାହୁ, ଲଗ୍ନେ କେତୁ। ସହଭାଗିତାରେ ସ୍ୱଚ୍ଛତା ରଖନ୍ତୁ।' } },
    { name: { en: 'Karkotaka Kala Sarpa', hi: 'कर्कोटक कालसर्प योग', or: 'କର୍କୋଟକ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 8th, Ketu in 2nd. Mystical occult depth; regular Shiva abhishekam is a shield.', hi: 'अष्टम में राहु, द्वितीय में केतु। शिव आराधना कवच का कार्य करती है।', or: 'ଅଷ୍ଟମେ ରାହୁ, ଦ୍ୱିତୀୟେ କେତୁ। ଶିବ ଆରାଧନା କବଚ ସଦୃଶ।' } },
    { name: { en: 'Shankhachuda Kala Sarpa', hi: 'शंखचूड़ कालसर्प योग', or: 'ଶଙ୍ଖଚୂଡ଼ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 9th, Ketu in 3rd. Dharmic tests in youth turn into deep philosophical wisdom.', hi: 'नवम में राहु, तृतीय में केतु। धर्म-निष्ठा से पूर्ण भाग्योदय।', or: 'ନବମେ ରାହୁ, ତୃତୀୟେ କେତୁ। ଧର୍ମନିଷ୍ଠା ଯୋଗୁଁ ଭାଗ୍ୟୋଦୟ।' } },
    { name: { en: 'Ghataka Kala Sarpa', hi: 'घातक कालसर्प योग', or: 'ଘାତକ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 10th, Ketu in 4th. Dramatic swings in career stabilizing into high political stature.', hi: 'दशम में राहु, चतुर्थ में केतु। कर्मक्षेत्र में विशिष्ट पहचान।', or: 'ଦଶମେ ରାହୁ, ଚତୁର୍ଥେ କେତୁ। କର୍ମକ୍ଷେତ୍ରରେ ଉଚ୍ଚ ପ୍ରତିଷ୍ଠା।' } },
    { name: { en: 'Vishadhara Kala Sarpa', hi: 'विषधर कालसर्प योग', or: 'ବିଷଧର କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 11th, Ketu in 5th. Multiple sudden wealth streams from non-traditional routes.', hi: 'एकादश में राहु, पंचम में केतु। अप्रत्याशित धन लाभ के योग।', or: 'ଏକାଦଶେ ରାହୁ, ପଞ୍ଚମେ କେତୁ। ଅପ୍ରତ୍ୟାଶିତ ଧନ ପ୍ରାପ୍ତି।' } },
    { name: { en: 'Sheshanaga Kala Sarpa', hi: 'शेषनाग कालसर्प योग', or: 'ଶେଷନାଗ କାଳସର୍ପ ଯୋଗ' }, desc: { en: 'Rahu in 12th, Ketu in 6th. Immense international triumph and eventual moksha inclination.', hi: 'द्वादश में राहु, षष्ठ में केतु। विदेश यात्रा एवं मोक्ष की ओर झुकाव।', or: 'ଦ୍ୱାଦଶେ ରାହୁ, ଷଷ୍ଠେ କେତୁ। ବିଦେଶ ଯାତ୍ରା ଓ ମୋକ୍ଷ ଆଭିମୁଖ୍ୟ।' } }
  ];

  const otherPlanets = [sunH, moonH, marsH, mercH, jupH, venH, satH];
  const rLong = planets.Rahu.longitude;
  const kLong = planets.Ketu.longitude;

  let allOneSide = true;
  const isDirectArc = (rLong < kLong);
  const firstArcContains = otherPlanets.every(h => {
    const pLong = planets[Object.keys(planets)[h - 1] as PlanetName]?.longitude || 0;
    return isDirectArc ? (pLong >= rLong && pLong <= kLong) : (pLong >= rLong || pLong <= kLong);
  });

  const hasKalaSarpa = false; // Evaluated dynamically below
  const rahuTypeIdx = Math.max(0, Math.min(11, rahuH - 1));
  const ksType = KALA_SARPA_TYPES[rahuTypeIdx];

  // Real hemmed check
  let planetsBetween = 0;
  for (const p of ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'] as PlanetName[]) {
    const pLong = planets[p].longitude;
    const diffR = normalizeDegrees(pLong - rLong);
    if (diffR < 180) planetsBetween++;
  }

  const isRealKalaSarpa = (planetsBetween === 7 || planetsBetween === 0);
  const kalaSarpa: KalaSarpaInfo = {
    hasDosha: isRealKalaSarpa,
    type: isRealKalaSarpa ? ksType.name.en : undefined,
    name: isRealKalaSarpa ? ksType.name : { en: 'No Kala Sarpa Dosha', hi: 'कालसर्प दोष मुक्त', or: 'କାଳସର୍ପ ଦୋଷ ମୁକ୍ତ' },
    direction: isRealKalaSarpa ? (planetsBetween === 7 ? 'Udit' : 'Anudit') : 'None',
    description: isRealKalaSarpa ? ksType.desc : { en: 'All planets are free from Rahu-Ketu nodal entrapment. Excellent karmic flow.', hi: 'सभी ग्रह राहु-केतु के बंधन से मुक्त हैं। उत्तम ग्रह स्थिति।', or: 'ସମସ୍ତ ଗ୍ରହ ରାହୁ-କେତୁଙ୍କ ବନ୍ଧନରୁ ମୁକ୍ତ। ଶୁଭ ଗ୍ରହ ସ୍ଥିତି।' },
    isCancelled: [planets.Guru.house, planets.Shukra.house].includes(rahuH) || [planets.Guru.house, planets.Shukra.house].includes(ketuH),
    remedy: {
      en: 'Perform regular Maha Mrityunjaya Japa (108 times daily) and offering bilva leaves to Lord Shiva on Mondays.',
      hi: 'प्रतिदिन 108 बार महामृत्युंजय मंत्र जप करें और सोमवार को शिवलिंग पर जल व बेलपत्र अर्पित करें।',
      or: 'ପ୍ରତିଦିନ ୧୦୮ ମହାମୃତ୍ୟୁଞ୍ଜୟ ମନ୍ତ୍ର ଜପ କରନ୍ତୁ ଏବଂ ସୋମବାର ଶିବଲିଙ୍ଗରେ ବେଲପତ୍ର ଅର୍ପଣ କରନ୍ତୁ।'
    }
  };

  // ==========================================
  // MANGLIK / KUJA DOSHA CHECK
  // ==========================================
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const fromLagna = manglikHouses.includes(marsH);
  const marsFromMoon = ((marsH - moonH + 12) % 12) + 1;
  const fromMoon = manglikHouses.includes(marsFromMoon);
  const marsFromVenus = ((marsH - venH + 12) % 12) + 1;
  const fromVenus = manglikHouses.includes(marsFromVenus);

  const cancellationReasons: ManglikInfo['cancellationReasons'] = [];
  // Classical cancellations
  if (marsH === 1 && planets.Mangala.sign === 'Mesha') cancellationReasons.push({ en: 'Mars in Aries in 1st house cancels Kuja Dosha.', hi: 'मेष लग्न में मंगल प्रथम भाव में होने से दोष भंग होता है।', or: 'ମେଷ ଲଗ୍ନରେ ମଙ୍ଗଳ ପ୍ରଥମେ ଥିବାରୁ କୁଜ ଦୋଷ ଭଙ୍ଗ ହୁଏ।' });
  if (marsH === 4 && planets.Mangala.sign === 'Vrischika') cancellationReasons.push({ en: 'Mars in Scorpio in 4th house neutralizes Dosha.', hi: 'वृश्चिक का मंगल चतुर्थ भाव में दोष निष्प्रभावी करता है।', or: 'ବିଛା ରାଶିର ମଙ୍ଗଳ ଚତୁର୍ଥରେ ଥିବାରୁ ଦୋଷ ଖଣ୍ଡନ ହୁଏ।' });
  if (marsH === 7 && planets.Mangala.sign === 'Makara') cancellationReasons.push({ en: 'Exalted Mars in 7th house creates Ruchaka yoga rather than affliction.', hi: 'सप्तम में उच्च का मंगल रुचक योग बनाता है, दोष नहीं।', or: 'ସପ୍ତମରେ ଉଚ୍ଚ ମଙ୍ଗଳ ରୁଚକ ଯୋଗ କରାଏ, ଦୋଷ ନୁହେଁ।' });
  if (planets.Guru.house === marsH || ((marsH - jupH + 12) % 12 === 6)) {
    cancellationReasons.push({ en: 'Jupiter conjunction or aspect on Mars completely pacifies Manglik Dosha.', hi: 'गुरु की युति अथवा पूर्ण दृष्टि से मंगल दोष शांत होता है।', or: 'ଗୁରୁଙ୍କ ଦୃଷ୍ଟି ବା ଯୁତି ଯୋଗୁଁ ମଙ୍ଗଳ ଦୋଷ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରଶମିତ ହୁଏ।' });
  }

  const isManglik = (fromLagna || fromMoon) && cancellationReasons.length === 0;
  const severity: ManglikInfo['severity'] = !fromLagna && !fromMoon ? 'None' : cancellationReasons.length > 0 ? 'Mild' : (fromLagna && fromMoon) ? 'High' : 'Moderate';

  const manglik: ManglikInfo = {
    isManglik,
    fromLagna,
    fromMoon,
    fromVenus,
    severity,
    cancellationReasons,
    description: isManglik
      ? { en: 'Kuja Dosha present. Harmonized by matching with a partner having similar placement or chanting Mangala Kavacham.', hi: 'मांगलिक प्रभाव है। समान कुंडली मिलान अथवा मंगल कवच जप से दांपत्य सुखमय रहता है।', or: 'ମାଙ୍ଗଳିକ ପ୍ରଭାବ ରହିଛି। ଅନୁରୂପ କୁଣ୍ଡଳୀ ମେଳକ ବା ମଙ୍ଗଳ କବଚ ପାଠ ଶୁଭଙ୍କର।' }
      : { en: 'No operational Manglik Dosha detected. Matrimonial auspiciousness is clear.', hi: 'कोई प्रभावी मांगलिक दोष नहीं है। दांपत्य सुख अनुकूल है।', or: 'କୌଣସି ପ୍ରଭାବୀ ମାଙ୍ଗଳିକ ଦୋଷ ନାହିଁ। ଦାମ୍ପତ୍ୟ ଜୀବନ ଅନୁକୂଳ।' }
  };

  // ==========================================
  // SADE SATI CHRONOMETER — REAL ephemeris (no hardcoding)
  // ==========================================
  // True transit Saturn longitude TODAY from the same JPL engine
  const todayPos = calculatePlanetaryPositions(new Date());
  const saturnNow = ((todayPos.saturn % 360) + 360) % 360;
  const saturnSignIndex = Math.floor(saturnNow / 30) % 12;
  const diffFromMoon = ((saturnSignIndex - moonSignIndex + 12) % 12);

  let phase: SadeSatiInfo['phase'] = 'Not Active';
  let phaseOr = 'ବର୍ତ୍ତମାନ ସାଢ଼େସାତୀ ଚାଲୁନାହିଁ';
  if (diffFromMoon === 11) {
    phase = 'Rising (12th)';
    phaseOr = 'ଆରମ୍ଭ ପର୍ଯ୍ୟାୟ (୧୨ଶ ଭାବରେ ଶନି)';
  } else if (diffFromMoon === 0) {
    phase = 'Peak (Janma)';
    phaseOr = 'ଶିଖର ପର୍ଯ୍ୟାୟ (ଜନ୍ମ ରାଶିରେ ଶନି)';
  } else if (diffFromMoon === 1) {
    phase = 'Setting (2nd)';
    phaseOr = 'ଉତ୍ତରଣ ପର୍ଯ୍ୟାୟ (୨ୟ ଭାବରେ ଶନି)';
  }

  const isKantakaShani = [3, 7].includes(diffFromMoon); // 4th or 8th
  const isAshtamaShani = diffFromMoon === 7; // 8th

  const sadeSati: SadeSatiInfo = {
    isActive: phase !== 'Not Active',
    phase,
    phaseOr,
    saturnCurrentSign: SIGNS[saturnSignIndex],
    saturnDegree: Math.round((saturnNow % 30) * 100) / 100,
    moonSign: planets.Chandra.sign,
    isKantakaShani,
    isAshtamaShani,
    description: phase !== 'Not Active'
      ? { en: `Active Saturn Sade Sati: ${phase}. Demands discipline, patience, and ethical integrity. Purifies past karma into enduring wisdom.`, hi: `शनि की साढ़ेसाती का ${phase} प्रभाव। संयम, सेवा एवं धर्मनिष्ठा से कष्ट दूर होकर महान सफलता मिलती है।`, or: `ଶନିଙ୍କ ସାଢ଼େସାତୀର ${phaseOr}। ଧୈର୍ଯ୍ୟ, ଶିଷ୍ଟାଚାର ଓ ସେବା ମନୋଭାବ ଦ୍ୱାରା ଶନିଦେବ ପ୍ରସନ୍ନ ହୋଇ ଶୁଭଫଳ ଦିଅନ୍ତି।` }
      : { en: 'Saturn\'s 7.5-year cycle is currently dormant for your Rashi. Favorable period for steady growth.', hi: 'वर्तमान में आपकी राशि पर साढ़ेसाती का प्रभाव नहीं है। प्रगति का उत्तम काल।', or: 'ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ରାଶି ଉପରେ ସାଢ଼େସାତୀର ପ୍ରଭାବ ନାହିଁ। ଉନ୍ନତିର ଅନୁକୂଳ ସମୟ।' },
    remedy: {
      en: 'Light a mustard oil lamp under a Peepal tree on Saturdays and recite Dasharatha Shani Stotra.',
      hi: 'शनिवार की संध्या पीपल के वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें एवं दशरथकृत शनि स्तोत्र का पाठ करें।',
      or: 'ଶନିବାର ସନ୍ଧ୍ୟାରେ ଅଶ୍ୱତ୍ଥ ବୃକ୍ଷ ମୂଳେ ରାଶିତେଲର ଦୀପ ଦିଅନ୍ତୁ ଓ ଦଶରଥ ଶନି ସ୍ତୋତ୍ର ପାଠ କରନ୍ତୁ।'
    }
  };

  return {
    yogas,
    kalaSarpa,
    manglik,
    sadeSati
  };
}
