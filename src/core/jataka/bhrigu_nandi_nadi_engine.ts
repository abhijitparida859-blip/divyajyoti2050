import { PlanetName, PlanetPosition, BhriguNandiNadiData, NadiCombination } from '../../types/jataka';

export function calculateBhriguNandiNadi(
  typedPlanets: Record<PlanetName, PlanetPosition>
): BhriguNandiNadiData {
  const combinations: NadiCombination[] = [];

  const planets: PlanetName[] = [
    'Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu'
  ];

  // Helper to check if two planets share same sign or trine (1-5-9)
  const getRelation = (p1: PlanetName, p2: PlanetName): 'Conjunction' | 'Trinal' | 'None' => {
    const s1 = typedPlanets[p1].signIndex;
    const s2 = typedPlanets[p2].signIndex;
    if (s1 === s2) return 'Conjunction';
    // Trines share element (diff is 4 or 8)
    const diff = (s2 - s1 + 12) % 12;
    if (diff === 4 || diff === 8) return 'Trinal';
    return 'None';
  };

  // 1. Guru + Shani (Dharma Karma Nadi)
  const relGuruShani = getRelation('Guru', 'Shani');
  if (relGuruShani !== 'None') {
    combinations.push({
      id: 'guru_shani',
      title: {
        en: 'Guru - Shani Confluence (Dharma Karma Nadi)',
        hi: 'गुरु - शनि संबंध (धर्म कर्माधिपति नाड़ी योग)',
        or: 'ଗୁରୁ - ଶନି ସମ୍ପର୍କ (ଧର୍ମ କର୍ମାଧିପତି ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Guru', 'Shani'],
      type: relGuruShani,
      karmicManifestation: {
        en: 'The Jiva (Guru) and Karma (Shani) fuse together. You are destined to hold positions of trust, ethical administration, and lasting societal legacy.',
        hi: 'जीव (गुरु) और कर्म (शनि) का दिव्य मिलन। आप समाज में प्रतिष्ठित पद, नीतिगत नेतृत्व और स्थायी प्रतिष्ठा प्राप्त करेंगे।',
        or: 'ଜୀବ (ଗୁରୁ) ଓ କର୍ମ (ଶନି) ର ମହାନ ସଂଯୋଗ। ଆପଣ ସମାଜରେ ଉଚ୍ଚ ପଦବୀ, ନୈତିକ ନେତୃତ୍ୱ ଓ ଚିରସ୍ଥାୟୀ ସମ୍ମାନ ଲାଭ କରିବେ।'
      },
      destinyPattern: {
        en: 'Gradual rise after age 28-30; profound respect in teaching, advisory, judicial, or executive organizations.',
        hi: '28-30 वर्ष के उपरांत भाग्योदय; शिक्षण, न्याय, परामर्श या प्रशासनिक क्षेत्रों में विशेष सफलता।',
        or: '୨୮-୩୦ ବର୍ଷ ପରେ ବିଶେଷ ଭାଗ୍ୟୋଦୟ; ଶିକ୍ଷା, ପ୍ରଶାସନ, ପରାମର୍ଶ କିମ୍ବା ନ୍ୟାୟିକ କ୍ଷେତ୍ରରେ କାର୍ଯ୍ୟସିଦ୍ଧି।'
      }
    });
  }

  // 2. Guru + Mangala (Guru Mangala Nadi)
  const relGuruMangala = getRelation('Guru', 'Mangala');
  if (relGuruMangala !== 'None') {
    combinations.push({
      id: 'guru_mangala',
      title: {
        en: 'Guru - Mangala Confluence (Pioneering Leadership)',
        hi: 'गुरु - मंगल संबंध (साहसी नेतृत्व योग)',
        or: 'ଗୁରୁ - ମଙ୍ଗଳ ସମ୍ପର୍କ (ସାହସୀ ନେତୃତ୍ୱ ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Guru', 'Mangala'],
      type: relGuruMangala,
      karmicManifestation: {
        en: 'Wisdom merges with dynamic kinetic energy. Grants fearlessness, engineering aptitude, land acquisition, and dynamic protective power.',
        hi: 'ज्ञान और अदम्य साहस का समन्वय। भूमि लाभ, तकनीकी कौशल और निर्भीक निर्णय लेने की क्षमता।',
        or: 'ଜ୍ଞାନ ଓ ସାହସର ଅଦ୍ଭୁତ ମିଳନ। ଭୂମି ସମ୍ପତ୍ତି, ବୈଷୟିକ ଦକ୍ଷତା ଓ ନିର୍ଭୀକ ନେତୃତ୍ୱର ସୁଯୋଗ।'
      },
      destinyPattern: {
        en: 'Strong real estate fortunes, capacity to lead teams through crises, and victory over adversaries.',
        hi: 'अचल संपत्ति का सुख और संकटों में उत्कृष्ट नेतृत्व करने का सामर्थ्य।',
        or: 'ଜମି-ଗୃହ ନିର୍ମାଣ ସୁଖ ଏବଂ ଜଟିଳ ସମସ୍ୟାର ସମାଧାନ କରିବାର ଅସାଧାରଣ ପ୍ରତିଭା।'
      }
    });
  }

  // 3. Guru + Budha (Saraswati Intellectual Confluence)
  const relGuruBudha = getRelation('Guru', 'Budha');
  if (relGuruBudha !== 'None') {
    combinations.push({
      id: 'guru_budha',
      title: {
        en: 'Guru - Budha Confluence (Saraswati Intellect Nadi)',
        hi: 'गुरु - बुध संबंध (सरस्वती बुद्धि योग)',
        or: 'ଗୁରୁ - ବୁଧ ସମ୍ପର୍କ (ସରସ୍ୱତୀ ବିଦ୍ୟା ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Guru', 'Budha'],
      type: relGuruBudha,
      karmicManifestation: {
        en: 'Supreme cerebral acuity, eloquence, mathematical and linguistic versatility, and high commercial perception.',
        hi: 'अद्भुत वाक्चातुर्य, लेखन प्रतिभा, वाणिज्यिक समझ और बहुआयामी ज्ञान।',
        or: 'ପ୍ରଖର ବୁଦ୍ଧିମତ୍ତା, ସୁନ୍ଦର ବାଣୀ, ବାଣିଜ୍ୟିକ ଚତୁରତା ଓ ବହୁଶାସ୍ତ୍ରଦର୍ଶୀ ଜ୍ଞାନ।'
      },
      destinyPattern: {
        en: 'Prolific in consultancy, literature, finance, tech architecture, and public speaking.',
        hi: 'सलाहकार, वित्त, साहित्य, आईटी और जनसंवाद में विशेष उपलब्धि।',
        or: 'ପରାମର୍ଶ, ଆର୍ଥିକ ଯୋଜନା, ସାହିତ୍ୟ, ଆଇଟି ଓ ଶିକ୍ଷାଦାନରେ ପ୍ରସିଦ୍ଧି।'
      }
    });
  }

  // 4. Guru + Shukra (Bhrigu Brihaspati Prosperity Nadi)
  const relGuruShukra = getRelation('Guru', 'Shukra');
  if (relGuruShukra !== 'None') {
    combinations.push({
      id: 'guru_shukra',
      title: {
        en: 'Guru - Shukra Confluence (Bhrigu-Brihaspati Prosperity)',
        hi: 'गुरु - शुक्र संबंध (भृगु-बृहस्पति समृद्धि योग)',
        or: 'ଗୁରୁ - ଶୁକ୍ର ସମ୍ପର୍କ (ଭୃଗୁ-ବୃହସ୍ପତି ସମୃଦ୍ଧି ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Guru', 'Shukra'],
      type: relGuruShukra,
      karmicManifestation: {
        en: 'The two spiritual preceptors of gods and asuras align. Grants gracious refinement, aesthetic appreciation, luxury vehicles, and financial flow.',
        hi: 'दोनों दैवीय गुरुओं का सामंजस्य। ऐश्वर्य, कलात्मक सुरुचि, वाहन सुख और प्रचुर धन लाभ।',
        or: 'ଉଭୟ ଦେବଗୁରୁ ଓ ଦୈତ୍ୟଗୁରୁଙ୍କ କୃପା। ଧନଧାନ୍ୟ, ଯାନବାହନ ସୁଖ, ସୁନ୍ଦର ପାରିବାରିକ ଜୀବନ ଓ ପ୍ରସନ୍ନତା।'
      },
      destinyPattern: {
        en: 'Enduring social grace, luxurious residential comforts, and peaceful resolution of family affairs.',
        hi: 'स्थायी पारिवारिक सुख, उच्च जीवन स्तर और समाज में आदर।',
        or: 'ଚିରସ୍ଥାୟୀ ପାରିବାରିକ ଆନନ୍ଦ, ସୁଖକର ଜୀବନଶୈଳୀ ଓ ସାମାଜିକ ସମ୍ମାନ।'
      }
    });
  }

  // 5. Surya + Budha (Budhaditya Nadi)
  const relSuryaBudha = getRelation('Surya', 'Budha');
  if (relSuryaBudha !== 'None') {
    combinations.push({
      id: 'surya_budha',
      title: {
        en: 'Surya - Budha Confluence (Budhaditya Nadi)',
        hi: 'सूर्य - बुध संबंध (बुधादित्य नाड़ी योग)',
        or: 'ସୂର୍ଯ୍ୟ - ବୁଧ ସମ୍ପର୍କ (ବୁଧାଦିତ୍ୟ ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Surya', 'Budha'],
      type: relSuryaBudha,
      karmicManifestation: {
        en: 'Solar radiance illumines analytical intelligence. Bestows administrative flair, honor in government or corporate circles, and rapid learning.',
        hi: 'प्रखर प्रशासनिक बुद्धि, राजकृपा, त्वरित सीखने की क्षमता और उत्कृष्ट निर्णय शक्ति।',
        or: 'ତୀକ୍ଷ୍ଣ ପ୍ରଶାସନିକ ବୁଦ୍ଧି, ସରକାରୀ ସମ୍ମାନ, ଶୀଘ୍ର ବିଦ୍ୟା ଅର୍ଜନ ଓ ଦୃଢ଼ ନିଷ୍ପତ୍ତି।'
      },
      destinyPattern: {
        en: 'High status in competitive examinations, civil governance, corporate hierarchy, and research leadership.',
        hi: 'प्रतियोगी परीक्षाओं, प्रशासनिक सेवाओं और प्रबंधन में शीर्ष पद।',
        or: 'ପ୍ରତିଯୋଗିତାମୂଳକ ପରୀକ୍ଷା, ଶାସନ-ପ୍ରଶାସନ ଓ ନିଗମ ପରିଚାଳନାରେ ସଫଳତା।'
      }
    });
  }

  // 6. Shani + Rahu (Maya Karma & Strategic Mastery)
  const relShaniRahu = getRelation('Shani', 'Rahu');
  if (relShaniRahu !== 'None') {
    combinations.push({
      id: 'shani_rahu',
      title: {
        en: 'Shani - Rahu Confluence (Strategic Transformation Nadi)',
        hi: 'शनि - राहु संबंध (कूटनीतिक एवं तकनीकी कर्म योग)',
        or: 'ଶନି - ରାହୁ ସମ୍ପର୍କ (କୂଟନୈତିକ ଓ ବୈଷୟିକ କର୍ମ ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Shani', 'Rahu'],
      type: relShaniRahu,
      karmicManifestation: {
        en: 'Unconventional career trajectory. Deep fascination with cutting-edge technologies, foreign commerce, scale, and strategic breakthroughs.',
        hi: 'अपरंपरागत आजीविका, आधुनिक तकनीक, विदेशी व्यापार और विशाल उपक्रमों में सफलता।',
        or: 'ଆଧୁନିକ ଟେକ୍ନୋଲୋଜି, ବିଦେଶୀ ବାଣିଜ୍ୟ, ବିରାଟ ପ୍ରକଳ୍ପ ଓ ନୂତନ ଉଦ୍ଭାବନରେ କୃତିତ୍ୱ।'
      },
      destinyPattern: {
        en: 'Massive turnaround after overcoming initial delays; potential in AI, engineering, global trade, and media.',
        hi: 'आरंभिक संघर्ष के बाद अप्रत्याशित सफलता; वैश्विक व्यापार और तकनीक में विशिष्ट पहचान।',
        or: 'ପ୍ରାରମ୍ଭିକ ପରୀକ୍ଷା ପରେ ବିରାଟ ସଫଳତା; ବିଶ୍ୱସ୍ତରୀୟ ବାଣିଜ୍ୟ ଓ ଆଇଟି କ୍ଷେତ୍ରରେ ପରିଚୟ।'
      }
    });
  }

  // 7. Shani + Ketu (Mukti Karma & Deep Analysis)
  const relShaniKetu = getRelation('Shani', 'Ketu');
  if (relShaniKetu !== 'None') {
    combinations.push({
      id: 'shani_ketu',
      title: {
        en: 'Shani - Ketu Confluence (Karmic Asceticism & Mastery)',
        hi: 'शनि - केतु संबंध (कर्म संन्यास एवं गूढ़ अनुसंधान योग)',
        or: 'ଶନି - କେତୁ ସମ୍ପର୍କ (କର୍ମ ସନ୍ନ୍ୟାସ ଓ ଗୂଢ଼ ଅନୁସନ୍ଧାନ ନାଡ଼ୀ ଯୋଗ)'
      },
      planets: ['Shani', 'Ketu'],
      type: relShaniKetu,
      karmicManifestation: {
        en: 'Detached, laser-focused work ethic. Innate affinity for surgical precision, spiritual research, law, code, or esoteric sciences.',
        hi: 'गहन एकाग्रता, निष्काम कर्म, अनुसंधान, कानून और आध्यात्मिक विज्ञान में असाधारण क्षमता।',
        or: 'ନିଷ୍କାମ କର୍ମ, ଗଭୀର ଏକାଗ୍ରତା, ଆଇନ, ଡାକ୍ତରୀ କିମ୍ବା ଆଧ୍ୟାତ୍ମିକ ଗବେଷଣାରେ ଅସାଧାରଣ ଦକ୍ଷତା।'
      },
      destinyPattern: {
        en: 'Liberation from superficial ego through mastery of challenging, specialized disciplines.',
        hi: 'कठिन और विशिष्ट विषयों में अद्वितीय दक्षता से समाज में विशिष्ट सम्मान।',
        or: 'ଜଟିଳ ଓ ଗୂଢ଼ ବିଦ୍ୟାରେ ପାରଦର୍ଶିତା ହାସଲ କରି ସମ୍ମାନିତ ହେବାର ସୁଯୋଗ।'
      }
    });
  }

  // Fallback if no specific conjunction/trine formed
  if (combinations.length === 0) {
    combinations.push({
      id: 'jiva_balance',
      title: {
        en: 'Balanced Jiva-Karma Nadi Architecture',
        hi: 'संतुलित जीव-कर्म नाड़ी संरचना',
        or: 'ସନ୍ତୁଳିତ ଜୀବ-କର୍ମ ନାଡ଼ୀ ସ୍ଥିତି'
      },
      planets: ['Guru', 'Surya'],
      type: 'Trinal',
      karmicManifestation: {
        en: 'Your planetary energies are evenly dispersed across cosmic elements, promoting multifaceted development and adaptable wisdom.',
        hi: 'आपके ग्रह विभिन्न तत्त्वों में संतुलित हैं, जो जीवन में समग्र विकास और अनुकूलनशीलता प्रदान करते हैं।',
        or: 'ଆପଣଙ୍କ ଗ୍ରହମାନେ ପୃଥକ ତତ୍ତ୍ୱରେ ସନ୍ତୁଳିତ ଭାବେ ଅବସ୍ଥିତ, ଯାହା ଜୀବନରେ ସର୍ବାଙ୍ଗୀନ ବିକାଶ ଆଣିଦିଏ।'
      },
      destinyPattern: {
        en: 'Harmonious self-reliance, steady professional advancement, and balanced domestic life.',
        hi: 'संतुलित व्यक्तिगत विकास और निरंतर प्रगति।',
        or: 'ସନ୍ତୁଳିତ ବ୍ୟକ୍ତିଗତ ବିକାଶ ଓ ନିରନ୍ତର ସଫଳତା।'
      }
    });
  }

  return {
    combinations,
    karmicMissionSummary: {
      en: `Bhrigu Nandi Nadi highlights ${combinations.length} core karmic confluence(s). Your primary soul mission pivots on synthesizing spiritual integrity with practical leadership.`,
      hi: `भृगु नंदी नाड़ी के अनुसार आपकी कुंडली में ${combinations.length} मुख्य कर्म संबंध सक्रिय हैं। आपका मुख्य उद्देश्य सत्यनिष्ठा और व्यावहारिक कर्म का संतुलन साधना है।`,
      or: `ଭୃଗୁ ନନ୍ଦୀ ନାଡ଼ୀ ଅନୁଯାୟୀ ଆପଣଙ୍କ କୁଣ୍ଡଳୀରେ ${combinations.length} ଟି ମୁଖ୍ୟ କାର୍ମିକ ଯୋଗ ସକ୍ରିୟ ଅଛି। ନୈତିକ ଆଦର୍ଶ ଓ ବ୍ୟାବହାରିକ କର୍ମର ସମନ୍ୱୟ ଆପଣଙ୍କ ଜୀବନର ମୁଖ୍ୟ ଉଦ୍ଦେଶ୍ୟ।`
    }
  };
}
