export interface CityCoordinates {
  id: string;
  name: {
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
  timezone: number; // UTC offset in hours (5.5 for IST)
}

export const INDIAN_CITIES: CityCoordinates[] = [
  // Major Odisha Cities
  { id: 'bhubaneswar', name: { en: 'Bhubaneswar', hi: 'भुवनेश्वर', or: 'ଭୁବନେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.2961, longitude: 85.8245, timezone: 5.5 },
  { id: 'puri', name: { en: 'Puri (Shri Kshetra)', hi: 'पुरी (श्रीक्षेत्र)', or: 'ପୁରୀ (ଶ୍ରୀକ୍ଷେତ୍ର)' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.8135, longitude: 85.8312, timezone: 5.5 },
  { id: 'cuttack', name: { en: 'Cuttack', hi: 'कटक', or: 'କଟକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4625, longitude: 85.8828, timezone: 5.5 },
  { id: 'berhampur', name: { en: 'Berhampur', hi: 'बरहमपुर', or: 'ବ୍ରହ୍ମପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 19.3150, longitude: 84.7941, timezone: 5.5 },
  { id: 'sambalpur', name: { en: 'Sambalpur', hi: 'संबलपुर', or: 'ସମ୍ବଲପୁର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.4669, longitude: 83.9812, timezone: 5.5 },
  { id: 'rourkela', name: { en: 'Rourkela', hi: 'राउरकेला', or: 'ରାଉରକେଲା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 22.2604, longitude: 84.8536, timezone: 5.5 },
  { id: 'balasore', name: { en: 'Balasore', hi: 'बालेश्वर', or: 'ବାଲେଶ୍ୱର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.4934, longitude: 86.9135, timezone: 5.5 },
  { id: 'jajpur', name: { en: 'Jajpur (Biraja Kshetra)', hi: 'जाजपुर', or: 'ଯାଜପୁର (ବିରଜା କ୍ଷେତ୍ର)' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8527, longitude: 86.3364, timezone: 5.5 },
  { id: 'bhadrak', name: { en: 'Bhadrak', hi: 'भद्रक', or: 'ଭଦ୍ରକ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.0574, longitude: 86.4959, timezone: 5.5 },
  { id: 'baripada', name: { en: 'Baripada (Mayurbhanj)', hi: 'बारीपदा', or: 'ବାରିପଦା' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 21.9322, longitude: 86.7368, timezone: 5.5 },
  { id: 'koraput', name: { en: 'Koraput', hi: 'कोरापुट', or: 'କୋରାପୁଟ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 18.8135, longitude: 82.7123, timezone: 5.5 },
  { id: 'balangir', name: { en: 'Balangir', hi: 'बलांगिर', or: 'ବଲାଙ୍ଗୀର' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.7107, longitude: 83.4862, timezone: 5.5 },
  { id: 'kendrapara', name: { en: 'Kendrapara (Tulasi Kshetra)', hi: 'केंद्रपड़ा', or: 'କେନ୍ଦ୍ରାପଡ଼ା (ତୁଳସୀ କ୍ଷେତ୍ର)' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.4988, longitude: 86.4230, timezone: 5.5 },
  { id: 'angul', name: { en: 'Angul', hi: 'अंगुल', or: 'ଅନୁଗୋଳ' }, state: { en: 'Odisha', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' }, latitude: 20.8406, longitude: 85.1017, timezone: 5.5 },

  // Major National Metros
  { id: 'delhi', name: { en: 'New Delhi', hi: 'नई दिल्ली', or: 'ନୂଆଦିଲ୍ଲୀ' }, state: { en: 'Delhi', hi: 'दिल्ली', or: 'ଦିଲ୍ଲୀ' }, latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  { id: 'kolkata', name: { en: 'Kolkata', hi: 'कोलकाता', or: 'କୋଲକାତା' }, state: { en: 'West Bengal', hi: 'पश्चिम बंगाल', or: 'ପଶ୍ଚିମବଙ୍ଗ' }, latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  { id: 'mumbai', name: { en: 'Mumbai', hi: 'मुंबई', or: 'ମୁମ୍ବାଇ' }, state: { en: 'Maharashtra', hi: 'महाराष्ट्र', or: 'ମହାରାଷ୍ଟ୍ର' }, latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  { id: 'bengaluru', name: { en: 'Bengaluru', hi: 'बेंगलुरु', or: 'ବେଙ୍ଗାଲୁରୁ' }, state: { en: 'Karnataka', hi: 'कर्नाटक', or: 'କର୍ଣ୍ଣାଟକ' }, latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  { id: 'chennai', name: { en: 'Chennai', hi: 'चेन्नई', or: 'ଚେନ୍ନାଇ' }, state: { en: 'Tamil Nadu', hi: 'तमिलनाडु', or: 'ତାମିଲନାଡୁ' }, latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  { id: 'varanasi', name: { en: 'Varanasi (Kashi)', hi: 'वाराणसी (काशी)', or: 'ବାରଣାସୀ (କାଶୀ)' }, state: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', or: 'ଉତ୍ତରପ୍ରଦେଶ' }, latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  { id: 'hyderabad', name: { en: 'Hyderabad', hi: 'हैदराबाद', or: 'ହାଇଦ୍ରାବାଦ' }, state: { en: 'Telangana', hi: 'तेलंगाना', or: 'ତେଲେଙ୍ଗାନା' }, latitude: 17.3850, longitude: 78.4867, timezone: 5.5 }
];