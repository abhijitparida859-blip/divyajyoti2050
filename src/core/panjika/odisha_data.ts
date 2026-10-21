export interface OdiaFestival {
  name: {
    en: string;
    hi: string;
    or: string;
  };
  odiaMasa: string;
  tithiIndex: number; // 1-30
  month: number; // 1-12 Gregorian
  day: number;
  description: {
    en: string;
    hi: string;
    or: string;
  };
  isMajor: boolean;
}

export interface PanjikaSource {
  id: string;
  name: {
    en: string;
    hi: string;
    or: string;
  };
  tradition: string;
  authority: string;
  description: {
    en: string;
    hi: string;
    or: string;
  };
}

export const ODIA_PANJIKA_SOURCES: PanjikaSource[] = [
  {
    id: 'mukti_mandap',
    name: {
      en: 'Puri Shri Mandira Mukti Mandap Panjika',
      hi: 'पुरी श्री मंदिर मुक्ति मण्डप पंचांग',
      or: 'ପୁରୀ ଶ୍ରୀମନ୍ଦିର ମୁକ୍ତିମଣ୍ଡପ ପାଞ୍ଜି'
    },
    tradition: 'Jagannath Temple Tradition',
    authority: 'Shree Jagannath Temple Administration, Puri',
    description: {
      en: 'Supreme spiritual authority for all rituals, Nitis, and festivals of Lord Jagannath in Puri.',
      hi: 'पुरी में महाप्रभु श्री जगन्नाथ के सभी उत्सवों, नीति एवं अनुष्ठानों का सर्वोच्च प्रामाणिक पंचांग।',
      or: 'ପୁରୀ ଶ୍ରୀମନ୍ଦିରର ସମସ୍ତ ନୀତିକାନ୍ତି, ଯାତ୍ରା ଓ ପର୍ବପର୍ବାଣି ପାଇଁ ସର୍ବୋଚ୍ଚ ପ୍ରାମାଣିକ ପାଞ୍ଜି।'
    }
  },
  {
    id: 'kohinoor',
    name: {
      en: 'Kohinoor Press Panjika (Cuttack)',
      hi: 'कोहिनूर प्रेस पंचांग (कटक)',
      or: 'କୋହିନୂର ପ୍ରେସ ପାଞ୍ଜି (କଟକ)'
    },
    tradition: 'Classical Odisha Grihastha Tradition',
    authority: 'Kohinoor Press, Cuttack (Est. 1935)',
    description: {
      en: 'Most trusted and widely followed traditional Odia almanac across every household in Odisha.',
      hi: 'ओडिशा के प्रत्येक घर में सर्वाधिक प्रचलित एवं विश्वसनीय पारंपरिक ओड़िया पंचांग।',
      or: 'ସମଗ୍ର ଓଡ଼ିଶାର ପ୍ରତି ଘରେ ସର୍ବାଧିକ ପଠିତ ଓ ସର୍ବଜନସ୍ୱୀକୃତ ପ୍ରାମାଣିକ ପାଞ୍ଜି।'
    }
  },
  {
    id: 'biraja',
    name: {
      en: 'Biraja Panjika (Jajpur Shaktipeeth)',
      hi: 'बिरजा पंचांग (जाजपुर शक्तिपीठ)',
      or: 'ବିରଜା ପାଞ୍ଜି (ଯାଜପୁର ଶକ୍ତିପୀଠ)'
    },
    tradition: 'Shakta & Tantric Siddhanta',
    authority: 'Maa Biraja Kshetra, Jajpur',
    description: {
      en: 'Ancient Shakta almanac followed for Durga Puja, Navaratri, and auspicious Shakta muhurtas.',
      hi: 'मां बिरजा शक्तिपीठ द्वारा अनुमोदित प्राचीन शाक्त एवं तांत्रिक गणना पंचांग।',
      or: 'ମା’ ବିରଜା କ୍ଷେତ୍ରର ପ୍ରାଚୀନ ଶାକ୍ତ ପରମ୍ପରା ଓ ଦୁର୍ଗାପୂଜା ପାଇଁ ବିଶେଷ ପ୍ରସିଦ୍ଧ ପାଞ୍ଜି।'
    }
  },
  {
    id: 'radharaman',
    name: {
      en: 'Radharaman Press Panjika',
      hi: 'राधारमण प्रेस पंचांग',
      or: 'ରାଧାରମଣ ପ୍ରେସ ପାଞ୍ଜି'
    },
    tradition: 'Siddhanta Jyotisha Tradition',
    authority: 'Radharaman Press, Cuttack',
    description: {
      en: 'Renowned for accurate mathematical planetary ephemeris and wedding muhurtas.',
      hi: 'सटीक गणितीय ग्रह गणना तथा विवाह, उपनयन मुहूर्तों के लिए प्रसिद्ध।',
      or: 'ସଠିକ୍ ଗ୍ରହ ସ୍ଫୁଟ, ବିବାହ, ବ୍ରତୋପନୟନ ଓ ଶୁଭ ମୁହୂର୍ତ୍ତ ନିର୍ଣ୍ଣୟ ପାଇଁ ପ୍ରସିଦ୍ଧ।'
    }
  },
  {
    id: 'khadiratna',
    name: {
      en: 'Asali Khadiratna Panjika',
      hi: 'असली खड़िरत्न पंचांग',
      or: 'ଅସଲି ଖଡ଼ିରତ୍ନ ପାଞ୍ଜି'
    },
    tradition: 'Pandit Khadiratna Hereditary Lineage',
    authority: 'Jyotirvid Parishad, Odisha',
    description: {
      en: 'Ancient astrological almanac preserving authentic palm-leaf manuscript calculations.',
      hi: 'ताड़पत्र पांडुलिपियों की प्राचीन गणनाओं को संजोने वाला प्रामाणिक पंचांग।',
      or: 'ପ୍ରାଚୀନ ତାଳପୋଥି ସିଦ୍ଧାନ୍ତ ଜ୍ୟୋତିଷ ଉପରେ ଆଧାରିତ ପାରମ୍ପରିକ ଗଣନା।'
    }
  },
  {
    id: 'drik_lahiri',
    name: {
      en: 'Rashtriya Drik Siddhanta (Govt of India)',
      hi: 'राष्ट्रीय दृक सिद्धांत पंचांग',
      or: 'ରାଷ୍ଟ୍ରୀୟ ଦୃକ୍ ସିଦ୍ଧାନ୍ତ ପାଞ୍ଜି'
    },
    tradition: 'Modern Astronomical Ephemeris',
    authority: 'Positional Astronomy Centre (IMD)',
    description: {
      en: 'Modern high-precision telescope-verified scientific Nirayana calendar.',
      hi: 'आधुनिक दूरबीन एवं खगोलीय वेधशाला द्वारा सत्यापित वैज्ञानिक पंचांग।',
      or: 'ଆଧୁନିକ ମହାକାଶ ବିଜ୍ଞାନ ଓ ବୈଜ୍ଞାନିକ ଦୃକ୍-ଗଣିତ ଦ୍ୱାରା ପ୍ରମାଣିତ ପାଞ୍ଜି।'
    }
  }
];

export const ODIA_MONTHS = [
  { id: 'baisakha', en: 'Baisakha', hi: 'वैशाख', or: 'ବୈଶାଖ', season: { en: 'Summer', hi: 'ग्रीष्म', or: 'ଗ୍ରୀଷ୍ମ' } },
  { id: 'jyestha', en: 'Jyestha', hi: 'ज्येष्ठ', or: 'ଜ୍ୟେଷ୍ଠ', season: { en: 'Summer', hi: 'ग्रीष्म', or: 'ଗ୍ରୀଷ୍ମ' } },
  { id: 'asadha', en: 'Asadha', hi: 'आषाढ़', or: 'ଆଷାଢ଼', season: { en: 'Monsoon', hi: 'वर्षा', or: 'ବର୍ଷା' } },
  { id: 'sravana', en: 'Sravana', hi: 'श्रावण', or: 'ଶ୍ରାବଣ', season: { en: 'Monsoon', hi: 'वर्षा', or: 'ବର୍ଷା' } },
  { id: 'bhadraba', en: 'Bhadraba', hi: 'भाद्रपद', or: 'ଭାଦ୍ରବ', season: { en: 'Autumn', hi: 'शरद', or: 'ଶରତ' } },
  { id: 'aswina', en: 'Aswina', hi: 'अश्विन', or: 'ଆଶ୍ୱିନ', season: { en: 'Autumn', hi: 'शरद', or: 'ଶରତ' } },
  { id: 'kartika', en: 'Kartika', hi: 'कार्तिक', or: 'କାର୍ତ୍ତିକ', season: { en: 'Late Autumn', hi: 'हेमंत', or: 'ହେମନ୍ତ' } },
  { id: 'margasira', en: 'Margasira', hi: 'मार्गशीर्ष', or: 'ମାର୍ଗଶୀର', season: { en: 'Winter', hi: 'हेमंत', or: 'ହେମନ୍ତ' } },
  { id: 'pausha', en: 'Pausha', hi: 'पौष', or: 'ପୌଷ', season: { en: 'Winter', hi: 'शिशिर', or: 'ଶିଶିର' } },
  { id: 'magha', en: 'Magha', hi: 'माघ', or: 'ମାଘ', season: { en: 'Winter', hi: 'शिशिर', or: 'ଶିଶିର' } },
  { id: 'phalguna', en: 'Phalguna', hi: 'फाल्गुन', or: 'ଫାଲ୍ଗୁନ', season: { en: 'Spring', hi: 'वसंत', or: 'ବସନ୍ତ' } },
  { id: 'chaitra', en: 'Chaitra', hi: 'चैत्र', or: 'ଚୈତ୍ର', season: { en: 'Spring', hi: 'वसंत', or: 'ବସନ୍ତ' } },
];

export const ODIA_FESTIVALS: OdiaFestival[] = [
  {
    name: {
      en: 'Pana Sankranti / Maha Vishuba (Odia New Year)',
      hi: 'पना संक्रांति / उड़िया नव वर्ष',
      or: 'ପଣା ସଂକ୍ରାନ୍ତି / ମହା ବିଷୁବ (ଓଡ଼ିଆ ନବବର୍ଷ)'
    },
    odiaMasa: 'chaitra',
    tithiIndex: 30,
    month: 4,
    day: 14,
    description: {
      en: 'The beginning of the Odia calendar year. Sacred sweet Bela Pana is offered to Lord Jagannath and Hanuman.',
      hi: 'उड़िया नव वर्ष का शुभारंभ। भगवान जगन्नाथ को पवित्र बेल पना का भोग अर्पित किया जाता है।',
      or: 'ଓଡ଼ିଆ ନୂତନ ବର୍ଷର ଶୁଭାରମ୍ଭ। ବସୁନ୍ଧରା ଠେକି ବନ୍ଧା ଓ ଛତୁଆ-ପଣା ଭୋଗ କରାଯାଏ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Akshaya Tritiya (Chandan Yatra Begins)',
      hi: 'अक्षय तृतीया / चन्दन यात्रा प्रारंभ',
      or: 'ଅକ୍ଷୟ ତୃତୀୟା (ଚନ୍ଦନ ଯାତ୍ରା ଓ ରଥ ନିର୍ମାଣ ଅନୁକୂଳ)'
    },
    odiaMasa: 'baisakha',
    tithiIndex: 3,
    month: 4,
    day: 30,
    description: {
      en: 'Construction of the three sacred Raths for Ratha Yatra begins in Puri. 42-day Chandan Yatra starts.',
      hi: 'पुरी में विश्वप्रसिद्ध रथ निर्माण का शुभारंभ तथा 42-दिवसीय चंदन यात्रा का प्रारंभ।',
      or: 'ଶ୍ରୀକ୍ଷେତ୍ରରେ ରଥ ନିର୍ମାଣ ଅନୁକୂଳ ଓ ୪୨-ଦିନବ୍ୟାପୀ ଚନ୍ଦନ ଯାତ୍ରା ଆରମ୍ଭ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Raja Parba (Pahili Raja)',
      hi: 'रज पर्व (पहिली रज)',
      or: 'ରଜ ପର୍ବ (ପହିଲି ରଜ)'
    },
    odiaMasa: 'jyestha',
    tithiIndex: 30,
    month: 6,
    day: 14,
    description: {
      en: 'Celebrating Mother Earth’s womanhood and fertility with swing rides (Doli), Poda Pitha, and joy.',
      hi: 'धरती माता के मातृत्व का उत्सव। झूले (दोली), पोड़ पीठा और हर्षोल्लास का महान लोकपर्व।',
      or: 'ଧରିତ୍ରୀ ମାତାଙ୍କ ରଜସ୍ୱଳା ଉତ୍ସବ, ଦୋଳି ଖେଳ, ପୋଡ଼ପିଠା ଓ ଓଡ଼ିଶାର ଅନନ୍ୟ ଲୋକପର୍ବ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Deva Snana Purnima',
      hi: 'देव स्नान पूर्णिमा',
      or: 'ଦେବ ସ୍ନାନ ପୂର୍ଣ୍ଣିମା (ହାତୀ ବେଶ)'
    },
    odiaMasa: 'jyestha',
    tithiIndex: 15,
    month: 6,
    day: 20,
    description: {
      en: 'Grand bathing ceremony of Chaturdhamurti with 108 fragrant pots of sacred water, followed by Hati Besha.',
      hi: '१०८ स्वर्ण घटों के सुवासित जल से भगवान जगन्नाथ का महास्नान एवं प्रसिद्ध हाथी वेश।',
      or: '୧୦୮ ସୁବାସିତ ଜଳ ଗରା ସ୍ନାନ ପରେ ଶ୍ରୀଜୀଉଙ୍କ ଗଜାନନ (ହାତୀ) ବେଶ ଓ ଅଣସର ବିଜେ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'World-Famous Ratha Yatra (Gundicha Yatra)',
      hi: 'विश्वप्रसिद्ध रथ यात्रा (गुंडिचा यात्रा)',
      or: 'ବିଶ୍ୱପ୍ରସିଦ୍ଧ ରଥଯାତ୍ରା (ଶ୍ରୀଗୁଣ୍ଡିଚା ଯାତ୍ରା)'
    },
    odiaMasa: 'asadha',
    tithiIndex: 2,
    month: 7,
    day: 7,
    description: {
      en: 'Lord Jagannath, Balabhadra, and Subhadra journey on Nandighosha, Taladhwaja, and Darpadalana to Gundicha Temple.',
      hi: 'भगवान जगन्नाथ, बलभद्र एवं सुभद्रा का नंदीघोष, तालध्वज एवं दर्पदलन रथों में गुंडिचा मंदिर प्रस्थान।',
      or: 'ଚତୁର୍ଦ୍ଧାମୂର୍ତ୍ତିଙ୍କ ବଡ଼ଦାଣ୍ଡରେ ନନ୍ଦିଘୋଷ, ତାଳଧ୍ୱଜ ଓ ଦର୍ପଦଳନ ରଥରେ ଶ୍ରୀଗୁଣ୍ଡିଚା ମନ୍ଦିର ଯାତ୍ରା।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Bahuda Yatra (Return Car Festival)',
      hi: 'बाहुड़ा यात्रा (रथों की वापसी)',
      or: 'ବାହୁଡ଼ା ଯାତ୍ରା (ଫେରନ୍ତା ରଥ)'
    },
    odiaMasa: 'asadha',
    tithiIndex: 10,
    month: 7,
    day: 15,
    description: {
      en: 'Return journey of the Holy Trinity from Gundicha temple to Srimandir with Poda Pitha offering at Mausi Maa.',
      hi: 'गुंडिचा मंदिर से श्रीमंदिर वापसी, मौसी मां मंदिर पर पोड़ पीठा भोग।',
      or: 'ଶ୍ରୀଗୁଣ୍ଡିଚାରୁ ଶ୍ରୀମନ୍ଦିର ବାହୁଡ଼ା ଓ ମାଉସୀ ମା’ ମନ୍ଦିରରେ ପୋଡ଼ପିଠା ଭୋଗ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Suna Besha (Golden Attire on Chariots)',
      hi: 'सुना वेश (स्वर्ण वेश)',
      or: 'ସୁନା ବେଶ (ରଥ ଉପରେ ରାଜରାଜେଶ୍ୱର ବେଶ)'
    },
    odiaMasa: 'asadha',
    tithiIndex: 11,
    month: 7,
    day: 16,
    description: {
      en: 'The deities are adorned in pure solid gold ornaments atop their chariots in front of millions of devotees.',
      hi: 'रथों पर भगवान जगन्नाथ का शुद्ध स्वर्ण आभूषणों से अलंकृत राजाधिराज रूप।',
      or: 'ବଡ଼ଦାଣ୍ଡରେ ରଥ ଉପରେ ଚତୁର୍ଦ୍ଧାମୂର୍ତ୍ତିଙ୍କ ବିଶାଳ ସୁବର୍ଣ୍ଣ ଅଳଙ୍କାର ମଣ୍ଡିତ ସୁନା ବେଶ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Gamha Purnima / Raksha Bandhan',
      hi: 'गमहा पूर्णिमा / रक्षा बंधन (बलभद्र जयंती)',
      or: 'ଗହ୍ମା ପୂର୍ଣ୍ଣିମା / ରାକ୍ଷୀ ପୂର୍ଣ୍ଣିମା (ଶ୍ରୀ ବଳଭଦ୍ର ଜନ୍ମୋତ୍ସବ)'
    },
    odiaMasa: 'sravana',
    tithiIndex: 15,
    month: 8,
    day: 19,
    description: {
      en: 'Birth festival of Lord Balabhadra. Worship of cattle and agriculture, tying of sacred Rakhi.',
      hi: 'भगवान बलभद्र का जन्मोत्सव, गो-पूजन एवं रक्षा बंधन का पावन पर्व।',
      or: 'ପ୍ରଭୁ ବଳଭଦ୍ରଙ୍କ ଜନ୍ମୋତ୍ସବ, ଗୋ-ମାତା ପୂଜନ ଓ ଗହ୍ମା ଡିଆଁ ପର୍ବ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Nuakhai (Agrarian Festival of Western Odisha)',
      hi: 'नुआखाई (नवान्न पर्व)',
      or: 'ନୂଆଖାଇ (ପଶ୍ଚିମ ଓଡ଼ିଶାର ମହାନ୍ ନୂଆଧାନ ପର୍ବ)'
    },
    odiaMasa: 'bhadraba',
    tithiIndex: 20,
    month: 9,
    day: 8,
    description: {
      en: 'Harvest festival celebrated by offering newly harvested paddy to Maa Samaleswari and family elders.',
      hi: 'मां समलेश्वरी को नवीन अन्न अर्पण एवं परिवारजनों के साथ नुआखाई जुहार का पर्व।',
      or: 'ମା’ ସମଲେଶ୍ୱରୀଙ୍କ ଠାରେ ନବାନ୍ନ ଲାଗି, ଘରେ ଘରେ ନୂଆ ଚାଉଳ ଭୋଗ ଓ ନୂଆଖାଇ ଜୁହାର।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Kumar Purnima (Moon Festival for Youth)',
      hi: 'कुमार पूर्णिमा',
      or: 'କୁମାର ପୂର୍ଣ୍ଣିମା (ଚାନ୍ଦ ପୂଜା ଓ ଅଞ୍ଜଳି)'
    },
    odiaMasa: 'aswina',
    tithiIndex: 15,
    month: 10,
    day: 17,
    description: {
      en: 'Celebration of youth, moonlight, and beauty. Young women sing "Kumara Punei Janha Lo" and play Puchi.',
      hi: 'चंद्रमा एवं कार्तिकेय पूजन का मधुर पर्व, बालिकाओं द्वारा पुची खेल एवं संझुआ अर्घ्य।',
      or: 'କୁଆଁରୀ ଝିଅମାନଙ୍କ ଚାନ୍ଦ ପୂଜା, ଖଇ-ଚାଉଳ ଅଞ୍ଜଳି ଓ "କୁମାର ପୁନେଇଁ ଜହ୍ନ ଲୋ" ଗୀତର ଉଲ୍ଲାସ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Kartika Purnima & Boita Bandana (Bali Yatra)',
      hi: 'कार्तिक पूर्णिमा एवं बोइत बंदाण (बाली यात्रा)',
      or: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା ଓ ବୋଇତ ବନ୍ଦାଣ (ବାଲିଯାତ୍ରା ଶୁଭାରମ୍ଭ)'
    },
    odiaMasa: 'kartika',
    tithiIndex: 15,
    month: 11,
    day: 15,
    description: {
      en: 'Commemorating the ancient maritime glory of Kalinga Sadhabas sailing to Bali, Java, and Sumatra. Floating miniature boats with "Aa Ka Ma Boi".',
      hi: 'प्राचीन कलिंग के सामुद्रिक व्यापार गौरव की स्मृति। नदी-सरोवरों में छोटी नावों का तैराना ("आ का मा बोइ")।',
      or: 'ପ୍ରାଚୀନ କଳିଙ୍ଗର ନୌବାଣିଜ୍ୟ ଗୌରବ। "ଆ କା ମା ବୈ, ପାନ ଗୁଆ ଥୋଇ" ଗାନ କରି ଡଙ୍ଗା ଭସା ଓ କଟକ ବାଲିଯାତ୍ରା ଆରମ୍ଭ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Manabasa Gurubara (Margasira Lakshmi Puja)',
      hi: 'माणबसा गुरुवार (मार्गशीर्ष महालक्ष्मी व्रत)',
      or: 'ମାଣବସା ଗୁରୁବାର (ମାର୍ଗଶୀର ମହାଲକ୍ଷ୍ମୀ ବ୍ରତ)'
    },
    odiaMasa: 'margasira',
    tithiIndex: 1,
    month: 12,
    day: 5,
    description: {
      en: 'Every Thursday of Margasira, Maa Lakshmi is worshipped in every Odia home with Mana paddy, beautiful Jhoti/Chita, and Manda Pitha.',
      hi: 'मार्गशीर्ष के प्रत्येक गुरुवार को मां लक्ष्मी की आराधना, माण (धान) पूजन एवं सुंदर झोटी-चिता।',
      or: 'ମାର୍ଗଶୀର ମାସର ପ୍ରତି ଗୁରୁବାର ମା’ ମହାଲକ୍ଷ୍ମୀଙ୍କ ଆବାହନ, ମାଣ ମପା ଧାନ ପୂଜା, ଝୋଟି-ଚିତା ଓ ମଣ୍ଡା ପିଠା।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Prathamastami (Eldest Child Blessing Festival)',
      hi: 'प्रथमाष्टमी (ज्येष्ठ संतान उत्सव)',
      or: 'ପ୍ରଥମାଷ୍ଟମୀ (ପୋଢୁଆଁ ଅଷ୍ଟମୀ ଓ ଏଣ୍ଡୁରି ପିଠା)'
    },
    odiaMasa: 'margasira',
    tithiIndex: 8,
    month: 12,
    day: 23,
    description: {
      en: 'Honoring the eldest child with new clothes from maternal uncle (Mamughara) and steaming aromatic Enduri Pitha wrapped in turmeric leaves.',
      hi: 'मामा के घर से नए वस्त्र पहनकर ज्येष्ठ संतान की दीर्घायु का वंदन तथा हल्दी पत्तों में बनी एण्डुरी पीठा का भोग।',
      or: 'ପରିବାରର ଜ୍ୟେଷ୍ଠ ସନ୍ତାନ (ପୋଢୁଆଁ)ଙ୍କ ଦୀର୍ଘାୟୁ କାମନା, ମାମୁଁ ଘର ନୂଆ ପୋଷାକ ଓ ସୁଗନ୍ଧିତ ହଳଦୀପତ୍ର ଏଣ୍ଡୁରି ପିଠା।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Makara Sankranti (Sun enters Makara / Uttarayana)',
      hi: 'मकर संक्रांति (उत्तरायण प्रारंभ)',
      or: 'ମକର ସଂକ୍ରାନ୍ତି (ମକର ଚାଉଳ ଭୋଗ ଓ ଉତ୍ତରାୟଣ)'
    },
    odiaMasa: 'pausha',
    tithiIndex: 1,
    month: 1,
    day: 14,
    description: {
      en: 'Sun enters Capricorn. Offering of special Makara Chaula (raw rice, milk, jaggery, banana, ginger) and kite flying.',
      hi: 'सूर्य का मकर राशि में प्रवेश। मकर चावल का पवित्र भोग एवं पतंगोत्सव।',
      or: 'ସୂର୍ଯ୍ୟଙ୍କ ଉତ୍ତରାୟଣ ଗତି, ଶ୍ରୀମନ୍ଦିରରେ ମକର ବେଶ ଓ ସୁସ୍ୱାଦୁ ମକର ଚାଉଳ ଭୋଗ।'
    },
    isMajor: true
  },
  {
    name: {
      en: 'Dola Purnima & Holi (Falguna Jatra)',
      hi: 'डोल पूर्णिमा एवं होली (फाल्गुनी दोलोत्सव)',
      or: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା ଓ ହୋଲି (ରାଧାକୃଷ୍ଣ ଦୋଳଯାତ୍ରା ଓ ନୂଆ ପାଞ୍ଜି ପଠନ)'
    },
    odiaMasa: 'phalguna',
    tithiIndex: 15,
    month: 3,
    day: 25,
    description: {
      en: 'Spring festival of colors. Swing procession of Radha-Krishna in Dola Bimana and reading of the New Odia Panjika.',
      hi: 'श्री राधा-कृष्ण का दोल विमान में परिभ्रमण, अबीर-गुलाल एवं नवीन ओड़िया पंचांग का सार्वजनिक वाचन।',
      or: 'ରାଧାକୃଷ୍ଣଙ୍କ ଦୋଳ ବିମାନ ଭ୍ରମଣ, ଫଗୁ ଖେଳ ଏବଂ ନୂତନ ବର୍ଷର ପାଞ୍ଜି ଶ୍ରବଣ।'
    },
    isMajor: true
  }
];