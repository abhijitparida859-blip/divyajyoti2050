export interface PlaceLocation {
  id: string;
  name: {
    en: string;
    hi: string;
    or: string;
  };
  district?: {
    en: string;
    hi: string;
    or: string;
  };
  state: {
    en: string;
    hi: string;
    or: string;
  };
  latitude: number;
  longitude: number;
  timezone: number; // 5.5 for IST
  pincode?: string;
}

export const ODISHA_COMPREHENSIVE_LOCATIONS: PlaceLocation[] = [
  // --- 30 DISTRICT HEADQUARTERS & MAJOR CITIES ---
  { id: 'bhubaneswar', name: { en: 'Bhubaneswar', hi: 'भुवनेश्वर', or: 'ଭୁବନେଶ୍ୱର' }, district: { en: 'Khordha', hi: 'खोर्धा', or: 'ଖୋର୍ଦ୍ଧା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.2961, longitude: 85.8245, timezone: 5.5, pincode: '751001' },
  { id: 'puri', name: { en: 'Puri (Shri Kshetra)', hi: 'पुरी (श्रीक्षेत्र)', or: 'ପୁରୀ (ଶ୍ରୀକ୍ଷେତ୍ର)' }, district: { en: 'Puri', hi: 'पुरी', or: 'ପୁରୀ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.8135, longitude: 85.8312, timezone: 5.5, pincode: '752001' },
  { id: 'cuttack', name: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, district: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4625, longitude: 85.8828, timezone: 5.5, pincode: '753001' },
  { id: 'raghunathpur', name: { en: 'Raghunathpur', hi: 'रघुनाथपुर', or: 'ରଘୁନାଥପୁର' }, district: { en: 'Jagatsinghpur', hi: 'जगतसिंहपुर', or: 'ଜଗତସିଂହପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.3167, longitude: 86.1833, timezone: 5.5, pincode: '754132' },
  { id: 'jagatsinghpur', name: { en: 'Jagatsinghpur', hi: 'जगतसिंहपुर', or: 'ଜଗତସିଂହପୁର' }, district: { en: 'Jagatsinghpur', hi: 'जगतसिंहपुर', or: 'ଜଗତସିଂହପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.2644, longitude: 86.1717, timezone: 5.5, pincode: '754103' },
  { id: 'paradeep', name: { en: 'Paradeep Port', hi: 'पारादीप', or: 'ପାରାଦୀପ' }, district: { en: 'Jagatsinghpur', hi: 'जगतसिंहपुर', or: 'ଜଗତସିଂହପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.2974, longitude: 86.6695, timezone: 5.5, pincode: '754142' },
  { id: 'berhampur', name: { en: 'Berhampur (Brahmapur)', hi: 'बरहमपुर', or: 'ବ୍ରହ୍ମପୁର' }, district: { en: 'Ganjam', hi: 'गंजाम', or: 'ଗଞ୍ଜାମ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.3150, longitude: 84.7941, timezone: 5.5, pincode: '760001' },
  { id: 'sambalpur', name: { en: 'Sambalpur', hi: 'संबलपुर', or: 'ସମ୍ବଲପୁର' }, district: { en: 'Sambalpur', hi: 'संबलपुर', or: 'ସମ୍ବଲପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.4669, longitude: 83.9812, timezone: 5.5, pincode: '768001' },
  { id: 'rourkela', name: { en: 'Rourkela', hi: 'राउरकेला', or: 'ରାଉରକେଲା' }, district: { en: 'Sundargarh', hi: 'सुंदरगढ़', or: 'ସୁନ୍ଦରଗଡ଼' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 22.2604, longitude: 84.8536, timezone: 5.5, pincode: '769001' },
  { id: 'balasore', name: { en: 'Balasore (Baleswar)', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, district: { en: 'Balasore', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.4934, longitude: 86.9135, timezone: 5.5, pincode: '756001' },
  { id: 'bhadrak', name: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, district: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.0574, longitude: 86.4959, timezone: 5.5, pincode: '756100' },
  { id: 'baripada', name: { en: 'Baripada', hi: 'बारीपदा', or: 'ବାରିପଦା' }, district: { en: 'Mayurbhanj', hi: 'मयूरभंज', or: 'ମୟୂରଭଞ୍ଜ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.9322, longitude: 86.7368, timezone: 5.5, pincode: '757001' },
  { id: 'jajpur_town', name: { en: 'Jajpur Town (Biraja Kshetra)', hi: 'जाजपुर', or: 'ଯାଜପୁର ଟାଉନ' }, district: { en: 'Jajpur', hi: 'जाजपुर', or: 'ଯାଜପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8527, longitude: 86.3364, timezone: 5.5, pincode: '755001' },
  { id: 'jajpur_road', name: { en: 'Jajpur Road (Vyasanagar)', hi: 'व्यास नगर', or: 'ଯାଜପୁର ରୋଡ୍ (ବ୍ୟାସନଗର)' }, district: { en: 'Jajpur', hi: 'जाजपुर', or: 'ଯାଜପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.9500, longitude: 86.1333, timezone: 5.5, pincode: '755019' },
  { id: 'kendrapara', name: { en: 'Kendrapara (Tulasi Kshetra)', hi: 'केंद्रपड़ा', or: 'କେନ୍ଦ୍ରାପଡ଼ା' }, district: { en: 'Kendrapara', hi: 'केंद्रपड़ा', or: 'କେନ୍ଦ୍ରାପଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4988, longitude: 86.4230, timezone: 5.5, pincode: '754211' },
  { id: 'dhenkanal', name: { en: 'Dhenkanal', hi: 'ढेंकानाल', or: 'ଢେଙ୍କାନାଳ' }, district: { en: 'Dhenkanal', hi: 'ढेंकानाल', or: 'ଢେଙ୍କାନାଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.6667, longitude: 85.6000, timezone: 5.5, pincode: '759001' },
  { id: 'angul', name: { en: 'Angul', hi: 'अंगुल', or: 'ଅନୁଗୋଳ' }, district: { en: 'Angul', hi: 'अंगुल', or: 'ଅନୁଗୋଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8406, longitude: 85.1017, timezone: 5.5, pincode: '759122' },
  { id: 'talcher', name: { en: 'Talcher', hi: 'तालचेर', or: 'ତାଳଚେର' }, district: { en: 'Angul', hi: 'अंगुल', or: 'ଅନୁଗୋଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.9500, longitude: 85.2300, timezone: 5.5, pincode: '759100' },
  { id: 'keonjhar', name: { en: 'Kendujhar (Keonjhar)', hi: 'केंदुझर', or: 'କେନ୍ଦୁଝର' }, district: { en: 'Kendujhar', hi: 'केंदुझर', or: 'କେନ୍ଦୁଝର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.6289, longitude: 85.5817, timezone: 5.5, pincode: '758001' },
  { id: 'barbil', name: { en: 'Barbil', hi: 'बड़बिल', or: 'ବଡ଼ବିଲ' }, district: { en: 'Kendujhar', hi: 'केंदुझर', or: 'କେନ୍ଦୁଝର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 22.1200, longitude: 85.4000, timezone: 5.5, pincode: '758035' },
  { id: 'jharsuguda', name: { en: 'Jharsuguda', hi: 'झारसुगुड़ा', or: 'ଝାରସୁଗୁଡ଼ା' }, district: { en: 'Jharsuguda', hi: 'झारसुगुड़ा', or: 'ଝାରସୁଗୁଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.8554, longitude: 84.0062, timezone: 5.5, pincode: '768201' },
  { id: 'bargarh', name: { en: 'Bargarh', hi: 'बरगढ़', or: 'ବରଗଡ଼' }, district: { en: 'Bargarh', hi: 'बरगढ़', or: 'ବରଗଡ଼' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.3333, longitude: 83.6167, timezone: 5.5, pincode: '768028' },
  { id: 'sonepur', name: { en: 'Subarnapur (Sonepur)', hi: 'सोनपुर', or: 'ସୁବର୍ଣ୍ଣପୁର (ସୋନପୁର)' }, district: { en: 'Subarnapur', hi: 'सोनपुर', or: 'ସୁବର୍ଣ୍ଣପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8333, longitude: 83.9167, timezone: 5.5, pincode: '767017' },
  { id: 'balangir', name: { en: 'Balangir', hi: 'बलांगिर', or: 'ବଲାଙ୍ଗୀର' }, district: { en: 'Balangir', hi: 'बलांगिर', or: 'ବଲାଙ୍ଗୀର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.7107, longitude: 83.4862, timezone: 5.5, pincode: '767001' },
  { id: 'titilagarh', name: { en: 'Titilagarh', hi: 'टिटिलागढ़', or: 'ଟିଟିଲାଗଡ଼' }, district: { en: 'Balangir', hi: 'बलांगिर', or: 'ବଲାଙ୍ଗୀର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.3000, longitude: 83.1500, timezone: 5.5, pincode: '767033' },
  { id: 'nuapada', name: { en: 'Nuapada', hi: 'नुआपड़ा', or: 'ନୂଆପଡ଼ା' }, district: { en: 'Nuapada', hi: 'नुआपड़ा', or: 'ନୂଆପଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8333, longitude: 82.5500, timezone: 5.5, pincode: '766105' },
  { id: 'kalahandi', name: { en: 'Bhawanipatna', hi: 'भवानीपटना', or: 'ଭବାନୀପାଟଣା' }, district: { en: 'Kalahandi', hi: 'कालाहांडी', or: 'କଳାହାଣ୍ଡି' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.9000, longitude: 83.1667, timezone: 5.5, pincode: '766001' },
  { id: 'rayagada', name: { en: 'Rayagada', hi: 'रायगड़ा', or: 'ରାୟଗଡ଼ା' }, district: { en: 'Rayagada', hi: 'रायगड़ा', or: 'ରାୟଗଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.1667, longitude: 83.4167, timezone: 5.5, pincode: '765001' },
  { id: 'gunupur', name: { en: 'Gunupur', hi: 'गुनुपुर', or: 'ଗୁଣୁପୁର' }, district: { en: 'Rayagada', hi: 'रायगड़ा', or: 'ରାୟଗଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.0800, longitude: 83.8200, timezone: 5.5, pincode: '765022' },
  { id: 'koraput', name: { en: 'Koraput', hi: 'कोरापुट', or: 'କୋରାପୁଟ' }, district: { en: 'Koraput', hi: 'कोरापुट', or: 'କୋରାପୁଟ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.8135, longitude: 82.7123, timezone: 5.5, pincode: '764020' },
  { id: 'jeypore', name: { en: 'Jeypore', hi: 'जयपुर (ओडिशा)', or: 'ଜୟପୁର' }, district: { en: 'Koraput', hi: 'कोरापुट', or: 'କୋରାପୁଟ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.8500, longitude: 82.5667, timezone: 5.5, pincode: '764001' },
  { id: 'nabarangpur', name: { en: 'Nabarangpur', hi: 'नवरंगपुर', or: 'ନବରଙ୍ଗପୁର' }, district: { en: 'Nabarangpur', hi: 'नवरंगपुर', or: 'ନବରଙ୍ଗପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.2333, longitude: 82.5500, timezone: 5.5, pincode: '764059' },
  { id: 'malkangiri', name: { en: 'Malkangiri', hi: 'मलकानगिरी', or: 'ମାଲକାନଗିରି' }, district: { en: 'Malkangiri', hi: 'मलकानगिरी', or: 'ମାଲକାନଗିରି' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.3500, longitude: 81.9000, timezone: 5.5, pincode: '764045' },
  { id: 'phulbani', name: { en: 'Phulbani', hi: 'फुलबनी', or: 'ଫୁଲବାଣୀ' }, district: { en: 'Kandhamal', hi: 'कंधमाल', or: 'କନ୍ଧମାଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4700, longitude: 84.2300, timezone: 5.5, pincode: '762001' },
  { id: 'boudh', name: { en: 'Boudh (Boudh Rajpura)', hi: 'बौध', or: 'ବୌଦ୍ଧ' }, district: { en: 'Boudh', hi: 'बौध', or: 'ବୌଦ୍ଧ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8400, longitude: 84.3200, timezone: 5.5, pincode: '762014' },
  { id: 'nayagarh', name: { en: 'Nayagarh', hi: 'नयागढ़', or: 'ନୟାଗଡ଼' }, district: { en: 'Nayagarh', hi: 'नयागढ़', or: 'ନୟାଗଡ଼' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.1300, longitude: 85.1000, timezone: 5.5, pincode: '752069' },
  { id: 'chhatrapur', name: { en: 'Chhatrapur', hi: 'छतरपुर', or: 'ଛତ୍ରପୁର' }, district: { en: 'Ganjam', hi: 'गंजाम', or: 'ଗଞ୍ଜାମ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.3500, longitude: 84.9800, timezone: 5.5, pincode: '761020' },
  { id: 'paralakhemundi', name: { en: 'Paralakhemundi', hi: 'पारलाखेमुंडी', or: 'ପାରଳାଖେମୁଣ୍ଡି' }, district: { en: 'Gajapati', hi: 'गजपति', or: 'ଗଜପତି' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.7800, longitude: 84.0800, timezone: 5.5, pincode: '761200' },
  { id: 'deogarh', name: { en: 'Debagarh (Deogarh)', hi: 'देवगढ़', or: 'ଦେବଗଡ଼' }, district: { en: 'Deogarh', hi: 'देवगढ़', or: 'ଦେବଗଡ଼' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.5300, longitude: 84.7300, timezone: 5.5, pincode: '768108' },

  // --- ODISHA FAMOUS TOWNS, PILGRIMAGES & SUB-DIVISIONS ---
  { id: 'konark', name: { en: 'Konark (Sun Temple)', hi: 'कोणार्क', or: 'କୋଣାର୍କ (ଅର୍କ କ୍ଷେତ୍ର)' }, district: { en: 'Puri', hi: 'पुरी', or: 'ପୁରୀ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.8876, longitude: 86.0945, timezone: 5.5, pincode: '752111' },
  { id: 'pipili', name: { en: 'Pipili', hi: 'पिपिली', or: 'ପିପିଲି' }, district: { en: 'Puri', hi: 'पुरी', or: 'ପୁରୀ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.1167, longitude: 85.8333, timezone: 5.5, pincode: '752104' },
  { id: 'nimapara', name: { en: 'Nimapara', hi: 'निमापड़ा', or: 'ନିମାପଡ଼ା' }, district: { en: 'Puri', hi: 'पुरी', or: 'ପୁରୀ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.0667, longitude: 86.0167, timezone: 5.5, pincode: '752106' },
  { id: 'kakatpur', name: { en: 'Kakatpur (Maa Mangala)', hi: 'काकटपुर', or: 'କାକଟପୁର (ମା’ ମଙ୍ଗଳା)' }, district: { en: 'Puri', hi: 'पुरी', or: 'ପୁରୀ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.0167, longitude: 86.1833, timezone: 5.5, pincode: '752108' },
  { id: 'jatni', name: { en: 'Jatni (Khurda Road)', hi: 'जतनी', or: 'ଜଟଣୀ (ଖୋର୍ଦ୍ଧା ରୋଡ୍)' }, district: { en: 'Khordha', hi: 'खोर्धा', or: 'ଖୋର୍ଦ୍ଧା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.1600, longitude: 85.7000, timezone: 5.5, pincode: '752050' },
  { id: 'khurda_town', name: { en: 'Khordha Town', hi: 'खोर्धा', or: 'ଖୋର୍ଦ୍ଧା ଟାଉନ' }, district: { en: 'Khordha', hi: 'खोर्धा', or: 'ଖୋର୍ଦ୍ଧା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.1800, longitude: 85.6200, timezone: 5.5, pincode: '752055' },
  { id: 'banapur', name: { en: 'Banapur (Maa Bhagabati)', hi: 'बाणपुर', or: 'ବାଣପୁର' }, district: { en: 'Khordha', hi: 'खोर्धा', or: 'ଖୋର୍ଦ୍ଧା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.7800, longitude: 85.1800, timezone: 5.5, pincode: '752031' },
  { id: 'chandikhol', name: { en: 'Chandikhol (Mahavinayak)', hi: 'चंडीखोल', or: 'ଚଣ୍ଡୀଖୋଲ' }, district: { en: 'Jajpur', hi: 'जाजपुर', or: 'ଯାଜପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.7300, longitude: 86.1300, timezone: 5.5, pincode: '755044' },
  { id: 'pattamundai', name: { en: 'Pattamundai', hi: 'पट्टामुंडाई', or: 'ପଟ୍ଟାମୁଣ୍ଡାଇ' }, district: { en: 'Kendrapara', hi: 'केंद्रपड़ा', or: 'କେନ୍ଦ୍ରାପଡ଼ା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.5700, longitude: 86.5700, timezone: 5.5, pincode: '754215' },
  { id: 'salipur', name: { en: 'Salipur', hi: 'सालीपुर', or: 'ସାଳେପୁର' }, district: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4800, longitude: 85.9800, timezone: 5.5, pincode: '754202' },
  { id: 'athagarh', name: { en: 'Athagarh', hi: 'आठगढ़', or: 'ଆଠଗଡ଼' }, district: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.5200, longitude: 85.6300, timezone: 5.5, pincode: '754029' },
  { id: 'banki', name: { en: 'Banki (Charchika)', hi: 'बांकी', or: 'ବାଙ୍କୀ (ମା’ ଚର୍ଚ୍ଚିକା)' }, district: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.3700, longitude: 85.5300, timezone: 5.5, pincode: '754008' },
  { id: 'choudwar', name: { en: 'Choudwar', hi: 'चौद्वार', or: 'ଚୌଦ୍ୱାର' }, district: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.5300, longitude: 85.9000, timezone: 5.5, pincode: '754025' },
  { id: 'jaleswar', name: { en: 'Jaleswar', hi: 'जलेश्वर', or: 'ଜଳେଶ୍ୱର' }, district: { en: 'Balasore', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.8000, longitude: 87.2000, timezone: 5.5, pincode: '756032' },
  { id: 'soro', name: { en: 'Soro', hi: 'सोरो', or: 'ସୋର' }, district: { en: 'Balasore', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.2800, longitude: 86.6800, timezone: 5.5, pincode: '756045' },
  { id: 'nilagiri', name: { en: 'Nilagiri', hi: 'नीलगिरि', or: 'ନୀଳଗିରି' }, district: { en: 'Balasore', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.4600, longitude: 86.7600, timezone: 5.5, pincode: '756040' },
  { id: 'dhamnagar', name: { en: 'Dhamnagar', hi: 'धामनगर', or: 'ଧାମନଗର' }, district: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.9200, longitude: 86.4400, timezone: 5.5, pincode: '756117' },
  { id: 'basudevpur', name: { en: 'Basudevpur', hi: 'वासुदेवपुर', or: 'ବାସୁଦେବପୁର' }, district: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.1400, longitude: 86.7500, timezone: 5.5, pincode: '756125' },
  { id: 'chandbali', name: { en: 'Chandbali', hi: 'चांदबाली', or: 'ଚାନ୍ଦବାଲି' }, district: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.7800, longitude: 86.7400, timezone: 5.5, pincode: '756133' },
  { id: 'ghatagaon', name: { en: 'Ghatagaon (Maa Tarini)', hi: 'घटगांव', or: 'ଘଟଗାଁ (ମା’ ତାରିଣୀ)' }, district: { en: 'Kendujhar', hi: 'केंदुझर', or: 'କେନ୍ଦୁଝର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.5000, longitude: 85.9200, timezone: 5.5, pincode: '758027' },
  { id: 'anandapur', name: { en: 'Anandapur', hi: 'आनंदपुर', or: 'ଆନନ୍ଦପୁର' }, district: { en: 'Kendujhar', hi: 'केंदुझर', or: 'କେନ୍ଦୁଝର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.2200, longitude: 86.1200, timezone: 5.5, pincode: '758021' },
  { id: 'rairangpur', name: { en: 'Rairangpur', hi: 'रायरंगपुर', or: 'ରାଇରଙ୍ଗପୁର' }, district: { en: 'Mayurbhanj', hi: 'मयूरभंज', or: 'ମୟୂରଭଞ୍ଜ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 22.2700, longitude: 86.1800, timezone: 5.5, pincode: '757043' },
  { id: 'bhanjanagar', name: { en: 'Bhanjanagar (Kabi Samrat)', hi: 'भंजनगर', or: 'ଭଞ୍ଜନଗର' }, district: { en: 'Ganjam', hi: 'गंजाम', or: 'ଗଞ୍ଜାମ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.9300, longitude: 84.5800, timezone: 5.5, pincode: '761126' },
  { id: 'aska', name: { en: 'Aska (Sugar City)', hi: 'आस्का', or: 'ଆସିକା' }, district: { en: 'Ganjam', hi: 'गंजाम', or: 'ଗଞ୍ଜାମ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.6100, longitude: 84.6600, timezone: 5.5, pincode: '761110' },
  { id: 'burla', name: { en: 'Burla (Hirakud Dam)', hi: 'बुर्ला', or: 'ବୁର୍ଲା' }, district: { en: 'Sambalpur', hi: 'संबलपुर', or: 'ସମ୍ବଲପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.5000, longitude: 83.8700, timezone: 5.5, pincode: '768017' },
  { id: 'daringbadi', name: { en: 'Daringbadi (Kashmir of Odisha)', hi: 'दारिंगबाड़ी', or: 'ଦାରିଙ୍ଗବାଡ଼ି' }, district: { en: 'Kandhamal', hi: 'कंधमाल', or: 'କନ୍ଧମାଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.9000, longitude: 84.1300, timezone: 5.5, pincode: '762104' },
  { id: 'sunabeda', name: { en: 'Sunabeda (HAL)', hi: 'सुनाबेड़ा', or: 'ସୁନାବେଡ଼ା' }, district: { en: 'Koraput', hi: 'कोरापुट', or: 'କୋରାପୁଟ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.7200, longitude: 82.8300, timezone: 5.5, pincode: '763002' },

  // --- MAJOR NATIONAL METROS & SPIRITUAL CENTRES ---
  { id: 'delhi', name: { en: 'New Delhi', hi: 'नई दिल्ली', or: 'ନୂଆଦିଲ୍ଲୀ' }, state: { en: 'Delhi', hi: 'दिल्ली', or: 'ଦିଲ୍ଲୀ' }, latitude: 28.6139, longitude: 77.2090, timezone: 5.5, pincode: '110001' },
  { id: 'kolkata', name: { en: 'Kolkata', hi: 'कोलकाता', or: 'କୋଲକାତା' }, state: { en: 'West Bengal', hi: 'पश्चिम बंगाल', or: 'ପଶ୍ଚିମବଙ୍ଗ' }, latitude: 22.5726, longitude: 88.3639, timezone: 5.5, pincode: '700001' },
  { id: 'mumbai', name: { en: 'Mumbai', hi: 'मुंबई', or: 'ମୁମ୍ବାଇ' }, state: { en: 'Maharashtra', hi: 'महाराष्ट्र', or: 'ମହାରାଷ୍ଟ୍ର' }, latitude: 19.0760, longitude: 72.8777, timezone: 5.5, pincode: '400001' },
  { id: 'bengaluru', name: { en: 'Bengaluru', hi: 'बेंगलुरु', or: 'ବେଙ୍ଗାଲୁରୁ' }, state: { en: 'Karnataka', hi: 'कर्नाटक', or: 'କର୍ଣ୍ଣାଟକ' }, latitude: 12.9716, longitude: 77.5946, timezone: 5.5, pincode: '560001' },
  { id: 'varanasi', name: { en: 'Varanasi (Kashi)', hi: 'वाराणसी (काशी)', or: 'ବାରଣାସୀ (କାଶୀ)' }, state: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', or: 'ଉତ୍ତରପ୍ରଦେଶ' }, latitude: 25.3176, longitude: 82.9739, timezone: 5.5, pincode: '221001' },
  { id: 'ayodhya', name: { en: 'Ayodhya Dham', hi: 'अयोध्या धाम', or: 'ଅଯୋଧ୍ୟା ଧାମ' }, state: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', or: 'ଉତ୍ତରପ୍ରଦେଶ' }, latitude: 26.7922, longitude: 82.1998, timezone: 5.5, pincode: '224123' },
  { id: 'haridwar', name: { en: 'Haridwar', hi: 'हरिद्वार', or: 'ହରିଦ୍ୱାର' }, state: { en: 'Uttarakhand', hi: 'उत्तराखंड', or: 'ଉତ୍ତରାଖଣ୍ଡ' }, latitude: 29.9457, longitude: 78.1642, timezone: 5.5, pincode: '249401' }
];

export function searchLocalLocations(query: string): PlaceLocation[] {
  if (!query || query.trim().length === 0) return ODISHA_COMPREHENSIVE_LOCATIONS.slice(0, 15);
  const q = query.trim().toLowerCase();
  return ODISHA_COMPREHENSIVE_LOCATIONS.filter(loc => {
    return (
      loc.name.en.toLowerCase().includes(q) ||
      loc.name.or.includes(q) ||
      loc.name.hi.includes(q) ||
      (loc.district && loc.district.en.toLowerCase().includes(q)) ||
      (loc.district && loc.district.or.includes(q)) ||
      (loc.pincode && loc.pincode.includes(q))
    );
  }).slice(0, 15);
}

/**
 * WORLD-WIDE geocoding (Nominatim / OpenStreetMap) — any location on Earth.
 * Estimates timezone from longitude (IST +5.5 for India handled by offset).
 * Free, no API key required.
 */
export async function searchWorldGeocoding(query: string): Promise<PlaceLocation[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    // No hardcoded country — search the whole world, bias results by viewbox when online
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'or,hi,en',
        'User-Agent': 'DivyaJyotiKaliaPanjika/1.0'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any, idx: number) => {
      const displayName: string = item.display_name || item.name || query;
      const parts = displayName.split(',').map((s: string) => s.trim());
      const placeName = parts[0] || query;
      const districtName = parts[1] || '';
      const country = item.address?.country || '';
      // Estimate timezone offset (hours) from longitude — 15° = 1 hour
      const lon = parseFloat(item.lon);
      const estTz = Math.round(lon / 15 * 2) / 2;
      return {
        id: `world_${idx}_${Date.now()}`,
        name: { en: placeName, hi: placeName, or: placeName },
        district: { en: districtName, hi: districtName, or: districtName },
        state: { en: country, hi: country, or: country },
        latitude: parseFloat(item.lat),
        longitude: lon,
        timezone: estTz,
        pincode: item.address?.postcode
      } as PlaceLocation;
    });
  } catch (err) {
    console.warn('World geocoding error:', err);
    return [];
  }
}

export async function searchOnlineGeocoding(query: string): Promise<PlaceLocation[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Odisha, India')}&format=json&addressdetails=1&limit=8`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'or,hi,en',
        'User-Agent': 'DivyaJyotiKaliaPanjika/1.0'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any, idx: number) => {
      const displayName = item.display_name || item.name;
      const parts = displayName.split(',');
      const placeName = parts[0]?.trim() || query;
      const districtName = parts[1]?.trim() || 'Odisha';
      const stateName = 'ଓଡ଼ିଶା';

      return {
        id: `online_${idx}_${Date.now()}`,
        name: {
          en: placeName,
          hi: placeName,
          or: placeName
        },
        district: {
          en: districtName,
          hi: districtName,
          or: districtName
        },
        state: {
          en: 'Odisha',
          hi: 'ओडिशा',
          or: stateName
        },
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        timezone: 5.5,
        pincode: item.address?.postcode
      };
    });
  } catch (err) {
    console.warn('Online geocoding fallback error:', err);
    return [];
  }
}