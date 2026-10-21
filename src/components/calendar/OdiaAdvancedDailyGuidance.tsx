import React, { useMemo } from 'react';
import { useI18n } from '../../localization/i18n';
import {
  DynamicOdiaDayInfo,
  OdiaPanjikaEdition,
  OdishaCityLocation
} from '../../core/panjika/odia_calendar_engine';
import {
  Utensils,
  Compass,
  Sparkles,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Car,
  Coins,
  Briefcase,
  Home,
  HeartPulse,
  Info,
  Calendar,
  Award
} from 'lucide-react';

interface OdiaAdvancedDailyGuidanceProps {
  dayInfo: DynamicOdiaDayInfo;
  language: 'or' | 'hi' | 'en';
  selectedPanjika: OdiaPanjikaEdition;
  selectedCity: OdishaCityLocation;
  currentYear: number;
  currentMonth: number;
}

interface ActionSuitabilityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: { or: string; hi: string; en: string };
  status: 'shubha' | 'madhyama' | 'varjita';
  statusText: { or: string; hi: string; en: string };
  badgeClasses: string;
  reason: { or: string; hi: string; en: string };
  bestWindow: { or: string; hi: string; en: string };
}

export const OdiaAdvancedDailyGuidance: React.FC<OdiaAdvancedDailyGuidanceProps> = ({
  dayInfo,
  language,
  selectedPanjika,
  selectedCity
}) => {
  const { formatNumber, tTithiFromKey, tVaara, tNakshatra, formatTime } = useI18n();

  // Format Abhijit Muhurta string from time strings
  const abhijitStr = useMemo(() => {
    if (!dayInfo.panjika?.muhurtas?.abhijit) return '';
    const { start, end } = dayInfo.panjika.muhurtas.abhijit;
    return `${formatTime(start)} - ${formatTime(end)}`;
  }, [dayInfo, formatTime]);

  // Format Rahu Kaal string from time strings
  const rahuKaalStr = useMemo(() => {
    if (!dayInfo.panjika?.muhurtas?.rahuKaal) return '';
    const { start, end } = dayInfo.panjika.muhurtas.rahuKaal;
    return `${formatTime(start)} - ${formatTime(end)}`;
  }, [dayInfo, formatTime]);

  // Format Amrita Bela
  const amritaBelaStr = useMemo(() => {
    return dayInfo.belas?.amritaOr || dayInfo.belas?.amrita || (language === 'or' ? 'ଅମୃତ ବେଳା' : 'Amrita Bela');
  }, [dayInfo, language]);

  // Practical Daily Action Suitability Evaluator (Calculated strictly from Shastric astronomical parameters)
  const actionSuitabilities = useMemo<ActionSuitabilityItem[]>(() => {
    const tithiNum = dayInfo.tithiNumber;
    const isRikta = [4, 9, 14, 19, 24, 29].includes(tithiNum);
    const isAmavasya = dayInfo.isAmavasya;
    const vaaraIdx = dayInfo.weekdayIdx; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const nakNum = dayInfo.panjika.nakshatra.number; // 1 to 27

    // 1. Vehicle Purchase & Long Journey (ଯାନବାହନ କ୍ରୟ ଓ ଯାତ୍ରା)
    // 1-based nakshatras: Ashwini(1), Rohini(4), Punarvasu(7), Pushya(8), Hasta(13), Chitra(14), Swati(15), Anuradha(17), Shravana(22), Dhanishtha(23), Shatabhisha(24), Revati(27)
    const vehicleNaks = [1, 4, 7, 8, 13, 14, 15, 17, 22, 23, 24, 27];
    let vehicleStatus: 'shubha' | 'madhyama' | 'varjita' = 'madhyama';
    let vehicleReason = {
      or: 'ସାଧାରଣ ଅନୁକୂଳ; ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତରେ କାର୍ଯ୍ୟ କରିବା ହିତକର।',
      hi: 'सामान्य अनुकूल; अभिजित मुहूर्त में कार्य करना शुभ है।',
      en: 'Moderately favorable; prefer Abhijit Muhurta.'
    };
    if (isRikta || isAmavasya || vaaraIdx === 2) {
      vehicleStatus = 'varjita';
      vehicleReason = {
        or: isRikta ? 'ରିକ୍ତା ତିଥି (୪, ୯, ୧୪) ହେତୁ ବାହନ କ୍ରୟ ବର୍ଜନୀୟ।' : isAmavasya ? 'ଅମାବାସ୍ୟା ତିଥିରେ ନୂତନ ବାହନ କ୍ରୟ ଅଶୁଭ।' : 'ମଙ୍ଗଳବାର ଅଗ୍ନି-ଧାତୁ ବାର ହେତୁ ବାହନ କ୍ରୟ ବର୍ଜିତ।',
        hi: isRikta ? 'रिक्ता तिथि के कारण वाहन क्रय वर्जित है।' : isAmavasya ? 'अमावस्या पर नया वाहन क्रय अशुभ है।' : 'मंगलवार को वाहन क्रय वर्जित माना गया है।',
        en: isRikta ? 'Avoid vehicle purchase on Rikta tithi.' : isAmavasya ? 'Avoid vehicle purchase on Amavasya.' : 'Tuesday is traditionally avoided for vehicles.'
      };
    } else if (vehicleNaks.includes(nakNum) && [1, 3, 4, 5].includes(vaaraIdx)) {
      vehicleStatus = 'shubha';
      vehicleReason = {
        or: 'ଶୁଭ ନକ୍ଷତ୍ର ଓ ସୌମ୍ୟ ବାର ଯୋଗରେ ବାହନ କ୍ରୟ ଓ ପ୍ରଥମ ଚଳାଚଳ ଅତ୍ୟନ୍ତ ଉତ୍ତମ।',
        hi: 'शुभ नक्षत्र एवं वार के संयोग से वाहन क्रय हेतु सर्वोत्तम दिन।',
        en: 'Highly auspicious constellation and weekday for vehicle purchase.'
      };
    }

    // 2. Gold, Jewelry & Investments (ସ୍ୱର୍ଣ୍ଣ, ଆଭୂଷଣ ଓ ମୂଲ୍ୟବାନ ବସ୍ତୁ)
    // 1-based: Ashwini(1), Rohini(4), Pushya(8), Hasta(13), Swati(15), Anuradha(17), Revati(27)
    const goldNaks = [1, 4, 8, 13, 15, 17, 27];
    let goldStatus: 'shubha' | 'madhyama' | 'varjita' = 'madhyama';
    let goldReason = {
      or: 'ମଧ୍ୟମ ଶୁଭ; ଅମୃତ ବେଳା ବା ଶୁଭ ଚୌଘଡ଼ିଆରେ କ୍ରୟ କରିପାରିବେ।',
      hi: 'मध्यम शुभ; अमृत बेला या शुभ चौघड़िया में क्रय करें।',
      en: 'Moderately auspicious; buy during Amrita Bela.'
    };
    if (isRikta || isAmavasya) {
      goldStatus = 'varjita';
      goldReason = {
        or: 'ରିକ୍ତା ବା ଅମାବାସ୍ୟା ତିଥିରେ ସ୍ୱର୍ଣ୍ଣ-ରୌପ୍ୟ କ୍ରୟ ଧନହାନିକାରକ।',
        hi: 'रिक्ता अथवा अमावस्या तिथि पर स्वर्ण-आभूषण क्रय वर्जित है।',
        en: 'Avoid buying gold or jewelry on Rikta tithi or Amavasya.'
      };
    } else if (goldNaks.includes(nakNum) || [4, 5].includes(vaaraIdx)) {
      goldStatus = 'shubha';
      goldReason = {
        or: nakNum === 8 ? 'ଗୁରୁ/ପୁଷ୍ୟା ଅମୃତ ଯୋଗ; ସ୍ୱର୍ଣ୍ଣ ଓ ଆଭୂଷଣ କ୍ରୟ ପାଇଁ ମହାଶୁଭ!' : 'ଶ୍ରୀବୃଦ୍ଧିକାରକ ଶୁଭ ଯୋଗ; ସ୍ୱର୍ଣ୍ଣ, ଅଳଙ୍କାର ଓ ବସ୍ତ୍ର କ୍ରୟ ପାଇଁ ଉତ୍କୃଷ୍ଟ।',
        hi: nakNum === 8 ? 'पुष्य नक्षत्र का महासंयोग; स्वर्ण आभूषण हेतु सर्वोत्तम!' : 'लक्ष्मीकारक शुभ योग; स्वर्ण एवं वस्त्र क्रय हेतु उत्तम।',
        en: nakNum === 8 ? 'Pushya constellation alignment; supreme for gold buying!' : 'Auspicious Lakshmi yoga for gold, jewelry and apparel.'
      };
    }

    // 3. Business Deals, Contracts & New Ventures (ବ୍ୟବସାୟ, ଚୁକ୍ତିପତ୍ର ଓ ନୂଆ କାର୍ଯ୍ୟାରମ୍ଭ)
    let bizStatus: 'shubha' | 'madhyama' | 'varjita' = 'madhyama';
    let bizReason = {
      or: 'ମଧ୍ୟମ ଶୁଭ; ଶୁଭ ଚୌଘଡ଼ିଆ ଓ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତରେ ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ।',
      hi: 'मध्यम शुभ; शुभ चौघड़िया व अभिजित मुहूर्त में कार्य करें।',
      en: 'Moderately good; schedule deals during Abhijit Muhurta.'
    };
    if (isRikta || isAmavasya) {
      bizStatus = 'varjita';
      bizReason = {
        or: 'ଅଶୁଭ ତିଥି ପ୍ରଭାବରୁ ଆଜି ନୂତନ ଚୁକ୍ତିପତ୍ର ବା ବଡ଼ ନିବେଶ ସ୍ଥଗିତ ରଖନ୍ତୁ।',
        hi: 'अशुभ तिथि के कारण नया अनुबंध अथवा बड़ा निवेश टालें।',
        en: 'Postpone major contracts or high-stake investments.'
      };
    } else if ([1, 3, 4, 5].includes(vaaraIdx) && !isRikta) {
      bizStatus = 'shubha';
      bizReason = {
        or: 'ବ୍ୟବସାୟିକ ଚୁକ୍ତି, ନୂତନ ଶାଖା ଉଦ୍‌ଘାଟନ ଓ ନିବେଶ ପାଇଁ ପ୍ରଶସ୍ତ ଦିନ।',
        hi: 'व्यापारिक अनुबंध, नई शाखा व निवेश हेतु अनुकूल दिन।',
        en: 'Favorable day for business agreements, trade & new launches.'
      };
    }

    // 4. Griha Pravesha / Construction / Bhoomi (ଗୃହ କର୍ମ, ନିର୍ମାଣ ଓ ପ୍ରବେଶ)
    // 1-based: Rohini(4), Uttara Phalguni(12), Uttara Ashadha(21), Uttara Bhadrapada(26)
    const sthiraNaks = [4, 12, 21, 26];
    let grihaStatus: 'shubha' | 'madhyama' | 'varjita' = 'madhyama';
    let grihaReason = {
      or: 'ସାଧାରଣ ନିର୍ମାଣ ଓ ସଜ୍ଜା ଚଳିପାରେ; ପ୍ରବେଶ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ମୁହୂର୍ତ୍ତ ବିଚାର କରନ୍ତୁ।',
      hi: 'सामान्य निर्माण कार्य ठीक है; गृह प्रवेश हेतु विशेष मुहूर्त देखें।',
      en: 'General construction allowed; verify specific muhurta for entry.'
    };
    if (isRikta || isAmavasya || [0, 2].includes(vaaraIdx)) {
      grihaStatus = 'varjita';
      grihaReason = {
        or: 'ମଙ୍ଗଳବାର/ରବିବାର ବା ରିକ୍ତା ତିଥିରେ ଗୃହାରମ୍ଭ ବା ପ୍ରବେଶ ଶାସ୍ତ୍ର ନିଷେଧ।',
        hi: 'मंगलवार/रविवार अथवा रिक्ता तिथि में गृह प्रवेश वर्जित है।',
        en: 'Avoid house inauguration on Tuesday/Sunday or Rikta tithis.'
      };
    } else if (sthiraNaks.includes(nakNum) && dayInfo.isShukla) {
      grihaStatus = 'shubha';
      grihaReason = {
        or: 'ସ୍ଥିର ନକ୍ଷତ୍ର ଓ ଶୁକ୍ଳପକ୍ଷ ସଂଯୋଗରେ ଗୃହ କର୍ମ, ନୀବ ପ୍ରତିଷ୍ଠା ଓ ପ୍ରବେଶ ଅତୀବ ଶୁଭ।',
        hi: 'स्थिर नक्षत्र एवं शुक्ल पक्ष में गृह निर्माण व प्रवेश अति शुभ।',
        en: 'Fixed star & bright fortnight alignment; highly auspicious for home.'
      };
    }

    // 5. Medicine & Health Treatment (ଔଷଧ ସେବନ ଓ ଚିକିତ୍ସା)
    // 1-based: Ashwini(1), Rohini(4), Pushya(8), Hasta(13), Swati(15), Shravana(22), Shatabhisha(24), Revati(27)
    const healthNaks = [1, 4, 8, 13, 15, 22, 24, 27];
    let healthStatus: 'shubha' | 'madhyama' | 'varjita' = 'shubha';
    let healthReason = {
      or: 'ଆରୋଗ୍ୟ ସାଧନା ଓ ନୂତନ ଔଷଧ ସେବନ ପାଇଁ ଅନୁକୂଳ ଦିବସ।',
      hi: 'आरोग्य लाभ एवं नई औषधि सेवन हेतु अनुकूल दिवस।',
      en: 'Favorable day for starting medications and health recovery.'
    };
    if (isAmavasya) {
      healthStatus = 'madhyama';
      healthReason = {
        or: 'ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ଚର୍ଚ୍ଚା ହିତକର; ଆୟୁର୍ବେଦ ବିଧି ପାଳନ ପୂର୍ବକ ସେବନ କରନ୍ତୁ।',
        hi: 'सामान्य स्वास्थ्य देखभाल उत्तम; आयुर्वेदिक नियमों का पालन करें।',
        en: 'Maintain light satvik diet and follow Ayurvedic guidelines.'
      };
    } else if (healthNaks.includes(nakNum)) {
      healthStatus = 'shubha';
      healthReason = {
        or: 'ଅଶ୍ୱିନୀ/ରୋହିଣୀ ଆଦି ଅମୃତ ନକ୍ଷତ୍ରରେ ଚିକିତ୍ସା ଆରମ୍ଭ କଲେ ଶୀଘ୍ର ଆରୋଗ୍ୟ ଲାଭ ହୁଏ।',
        hi: 'शुभ नक्षत्र में चिकित्सा व औषधि सेवन से शीघ्र आरोग्य लाभ होता है।',
        en: 'Healing nakshatra alignment ensures rapid recovery and vigor.'
      };
    }

    const badgeMap = {
      shubha: {
        classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: { or: '✅ ଶୁଭ (ଉତ୍ତମ)', hi: '✅ शुभ (उत्तम)', en: '✅ Auspicious' }
      },
      madhyama: {
        classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        text: { or: '⚡ ମଧ୍ୟମ (ସାଧାରଣ)', hi: '⚡ मध्यम (सामान्य)', en: '⚡ Moderate' }
      },
      varjita: {
        classes: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        text: { or: '⚠️ ବର୍ଜିତ (ନିଷେଧ)', hi: '⚠️ वर्जित (त्याज्य)', en: '⚠️ Avoid' }
      }
    };

    return [
      {
        id: 'vehicle',
        icon: Car,
        title: { or: 'ଯାନବାହନ କ୍ରୟ ଓ ଯାତ୍ରା', hi: 'वाहन क्रय एवं यात्रा', en: 'Vehicle Purchase & Travel' },
        status: vehicleStatus,
        statusText: badgeMap[vehicleStatus].text,
        badgeClasses: badgeMap[vehicleStatus].classes,
        reason: vehicleReason,
        bestWindow: {
          or: abhijitStr ? `ଅଭିଜିତ୍: ${abhijitStr}` : amritaBelaStr,
          hi: abhijitStr ? `अभिजित: ${abhijitStr}` : amritaBelaStr,
          en: abhijitStr ? `Abhijit: ${abhijitStr}` : amritaBelaStr
        }
      },
      {
        id: 'gold',
        icon: Coins,
        title: { or: 'ସ୍ୱର୍ଣ୍ଣ, ଅଳଙ୍କାର ଓ କ୍ରୟ', hi: 'स्वर्ण, आभूषण एवं क्रय', en: 'Gold & Jewelry Purchase' },
        status: goldStatus,
        statusText: badgeMap[goldStatus].text,
        badgeClasses: badgeMap[goldStatus].classes,
        reason: goldReason,
        bestWindow: {
          or: amritaBelaStr,
          hi: amritaBelaStr,
          en: amritaBelaStr
        }
      },
      {
        id: 'business',
        icon: Briefcase,
        title: { or: 'ବ୍ୟବସାୟ, ଚୁକ୍ତି ଓ ନିବେଶ', hi: 'व्यापार, अनुबंध एवं निवेश', en: 'Business Deals & Contracts' },
        status: bizStatus,
        statusText: badgeMap[bizStatus].text,
        badgeClasses: badgeMap[bizStatus].classes,
        reason: bizReason,
        bestWindow: {
          or: abhijitStr ? `ଅଭିଜିତ୍: ${abhijitStr}` : amritaBelaStr,
          hi: abhijitStr ? `अभिजित: ${abhijitStr}` : amritaBelaStr,
          en: abhijitStr ? `Abhijit: ${abhijitStr}` : amritaBelaStr
        }
      },
      {
        id: 'home',
        icon: Home,
        title: { or: 'ଗୃହ କର୍ମ, ନିର୍ମାଣ ଓ ପ୍ରବେଶ', hi: 'गृह निर्माण एवं प्रवेश', en: 'House & Property Works' },
        status: grihaStatus,
        statusText: badgeMap[grihaStatus].text,
        badgeClasses: badgeMap[grihaStatus].classes,
        reason: grihaReason,
        bestWindow: {
          or: abhijitStr ? `ଅଭିଜିତ୍: ${abhijitStr}` : amritaBelaStr,
          hi: abhijitStr ? `अभिजित: ${abhijitStr}` : amritaBelaStr,
          en: abhijitStr ? `Abhijit: ${abhijitStr}` : amritaBelaStr
        }
      },
      {
        id: 'health',
        icon: HeartPulse,
        title: { or: 'ଔଷଧ ସେବନ ଓ ଆରୋଗ୍ୟ', hi: 'औषधि सेवन एवं आरोग्य', en: 'Medicine & Health Wellness' },
        status: healthStatus,
        statusText: badgeMap[healthStatus].text,
        badgeClasses: badgeMap[healthStatus].classes,
        reason: healthReason,
        bestWindow: {
          or: amritaBelaStr,
          hi: amritaBelaStr,
          en: amritaBelaStr
        }
      }
    ];
  }, [dayInfo, abhijitStr, amritaBelaStr]);

  // Seasonal Ayurvedic Health Recommendation
  const seasonalHealthWisdom = useMemo(() => {
    const ritu = dayInfo.rituInfo?.or || '';
    if (ritu.includes('ଗ୍ରୀଷ୍ମ')) {
      return {
        or: 'ଗ୍ରୀଷ୍ମ ଋତୁ: ଶରୀରରେ ଜଳୀୟ ଅଂଶ ବଜାୟ ରଖିବା ପାଇଁ ଲେମ୍ବୁ ପାଣି, ବେଲ ପଣା, ଡାଳିମ୍ବ ରସ ଓ ଶୀତଳ ସାତ୍ତ୍ୱିକ ଆହାର ଗ୍ରହଣ କରନ୍ତୁ।',
        hi: 'ग्रीष्म ऋतु: जल संतुलन हेतु नींबू पानी, बेल पना, अनार रस एवं शीतल सात्विक आहार लें।',
        en: 'Summer Season: Stay hydrated with lime water, bael pana, and cooling satvik foods.'
      };
    } else if (ritu.includes('ବର୍ଷା')) {
      return {
        or: 'ବର୍ଷା ଋତୁ: ପାଚନ ଶକ୍ତି ମନ୍ଦ ଥାଏ; ଫୁଟନ୍ତା ଉଷୁମ ପାଣି, ଶୁଣ୍ଠୀ ଓ ତୁଳସୀ କାଢ଼ା ସେବନ କରି ପେଟ ସୁସ୍ଥ ରଖନ୍ତୁ।',
        hi: 'वर्षा ऋतु: पाचन शक्ति मंद रहती है; उबला गर्म जल, सोंठ व तुलसी काढ़ा सेवन करें।',
        en: 'Monsoon Season: Digestion is sensitive; drink boiled warm water and herbal tulsi-ginger decoctions.'
      };
    } else if (ritu.includes('ଶରତ')) {
      return {
        or: 'ଶରତ ଋତୁ: ପିତ୍ତ ପ୍ରକୋପ ଶାନ୍ତ କରିବା ପାଇଁ ଘୃତ, ମିଶ୍ରି, ଦୁଗ୍ଧ ଓ ମଧୁର ସାତ୍ତ୍ୱିକ ଭୋଜନ ଅନୁକୂଳ।',
        hi: 'शरद ऋतु: पित्त शांत करने हेतु गाय का घी, मिश्री, दूध एवं मधुर सात्विक भोजन उत्तम है।',
        en: 'Autumn Season: Pacify pitta dosha with cow ghee, milk, rock sugar and light sweet foods.'
      };
    } else if (ritu.includes('ହେମନ୍ତ') || ritu.includes('ଶିଶିର')) {
      return {
        or: 'ହେମନ୍ତ/ଶିଶିର ଋତୁ: ଜଠରାଗ୍ନି ପ୍ରବଳ ଥାଏ; ରାଶି ତେଲ, ଗୁଡ଼, ତିଳ ଲଡୁ, କ୍ଷୀର ଓ ପୃଷ୍ଟିକର ଆହାର ଶରୀରକୁ ବଳ ପ୍ରଦାନ କରେ।',
        hi: 'हेमंत/शिशिर ऋतु: जठराग्नि प्रदीप्त रहती है; तिल, गुड़, दूध एवं पौष्टिक आहार बलवर्धक है।',
        en: 'Winter Season: Digestive fire is strong; consume sesame, jaggery, milk and nourishing foods.'
      };
    } else {
      return {
        or: 'ବସନ୍ତ ଋତୁ: କଫ ଦୋଷ ଶାମନ ପାଇଁ ମହୁ, ତ୍ରିଫଳା, ନିମ୍ବ ପତ୍ର ଓ ହାଲୁକା ତିକ୍ତ-କଷାୟ ଭୋଜନ ଉପକାରୀ।',
        hi: 'वसंत ऋतु: कफ नियंत्रण हेतु मधु, त्रिफला, नीम एवं हल्का तिक्त-कषाय भोजन उपयोगी है।',
        en: 'Spring Season: Balance kapha with pure honey, triphala, and light wholesome meals.'
      };
    }
  }, [dayInfo]);

  return (
    <div className="mt-5 pt-4 border-t border-amber-500/30 space-y-4">
      {/* SECTION HEADER: Royal Masthead */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-cosmic-950 to-amber-950/30 border border-amber-500/35 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-amber-200 tracking-wide font-serif">
              {language === 'or'
                ? 'ଆଜିର ଉନ୍ନତ ଦୈନିକ ମାର୍ଗଦର୍ଶିକା ଓ ଶାସ୍ତ୍ରୀୟ ବିଧି'
                : language === 'hi'
                ? 'आज की उन्नत दैनिक मार्गदर्शिका एवं शास्त्रीय विधि'
                : 'Advanced Daily Shastric & Life Guidance'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {language === 'or'
              ? 'କ୍ୟାଲେଣ୍ଡରର ଯେକୌଣସି ତାରିଖ କ୍ଲିକ୍ କଲେ ଖାଦ୍ୟ ନିଷେଧ, ଯାତ୍ରା ପ୍ରତୀକାର, ଚନ୍ଦ୍ରବଳ ଓ କର୍ମ ଅନୁକୂଳତା ସ୍ୱୟଂକ୍ରିୟ ଭାବେ ଅଦ୍ୟତନ ହୁଏ।'
              : language === 'hi'
              ? 'कैलेंडर की किसी भी तारीख पर क्लिक करने पर भोजन निषेध, यात्रा उपाय, चंद्रबल एवं कर्म अनुकूलता स्वतः अपडेट होती है।'
              : 'Click any calendar date to dynamically view dietary rules, travel remedies, Chandrabala & action suitability.'}
          </p>
        </div>

        {/* Selected Day Quick Badges */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{formatNumber(dayInfo.dayOfMonth)} ତାରିଖ ({tVaara(dayInfo.panjika.vaara)})</span>
          </span>
          <span className="text-[10px] font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-1 rounded-xl">
            {tTithiFromKey(dayInfo.panjika.tithi.nameKey)}
          </span>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded-xl">
            {tNakshatra(dayInfo.panjika.nakshatra.nameKey)}
          </span>
        </div>
      </div>

      {/* TOP 4 CARDS GRID: Dietary, Travel Direction, Astro Harmony, Astronomical Length */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* CARD 1: 🥗 ତିଥି ଖାଦ୍ୟ ନିଷେଧ ଓ ଆୟୁର୍ବେଦ ବିଧି */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#120e06] to-cosmic-950 border border-amber-500/30 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-amber-200">
                  {language === 'or' ? 'ତିଥି ଖାଦ୍ୟ ନିଷେଧ ଓ ସ୍ୱାସ୍ଥ୍ୟ ବିଧି' : language === 'hi' ? 'तिथि भोजन निषेध एवं स्वास्थ्य' : 'Dietary Injunctions & Health'}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ପଦ୍ମ ପୁରାଣ ବିଧି
              </span>
            </div>

            {/* Injunction Banner */}
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/35 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">
                  {language === 'or' ? 'ଅଦ୍ୟ ଶାସ୍ତ୍ରୀୟ ଭକ୍ଷଣ ନିଷେଧ' : language === 'hi' ? 'आज का शास्त्रीय भोजन निषेध' : 'Today\'s Prohibited Food'}
                </span>
                <p className="text-xs sm:text-sm font-black text-rose-200 mt-0.5">
                  {dayInfo.foodRestrictionOr}
                </p>
              </div>
            </div>

            {/* Special Vrata / Fasting Discipline */}
            {dayInfo.isEkadashi && (
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/35 text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
                <span>🌿</span>
                <span>
                  {language === 'or'
                    ? 'ଆଜି ପବିତ୍ର ଏକାଦଶୀ ମହାବ୍ରତ: ସର୍ବବିଧ ଅନ୍ନ ଓ ଶସ୍ୟ ଭକ୍ଷଣ ନିଷେଧ; ଫଳାହାର ବା ନିର୍ଜଳା ଉପବାସ ପରମ କଲ୍ୟାଣକାରୀ।'
                    : 'आज एकादशी महाव्रत है: अन्न सेवन सर्वथा वर्जित; फलाहार अथवा निर्जला उपवास करें।'}
                </span>
              </div>
            )}
            {dayInfo.isSankranti && (
              <div className="p-2 rounded-xl bg-orange-950/40 border border-orange-500/35 text-[11px] text-orange-300 flex items-center gap-1.5 font-medium">
                <span>☀️</span>
                <span>
                  {language === 'or'
                    ? 'ଆଜି ସୌର ସଂକ୍ରାନ୍ତି: ତୈଳ ମର୍ଦ୍ଦନ, ଆମିଷ ଓ ପିଆଜ-ରସୁଣ ବର୍ଜନ କରି ସାତ୍ତ୍ୱିକ ହବିଷ୍ୟାନ୍ନ ଗ୍ରହଣ କରନ୍ତୁ।'
                    : 'आज संक्रांति है: तेल मालिश एवं तामसिक भोजन त्याग कर सात्विक आहार लें।'}
                </span>
              </div>
            )}
            {(dayInfo.isPurnima || dayInfo.isAmavasya) && !dayInfo.isEkadashi && (
              <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/35 text-[11px] text-indigo-300 flex items-center gap-1.5 font-medium">
                <span>{dayInfo.isPurnima ? '🌕' : '🌑'}</span>
                <span>
                  {dayInfo.isPurnima
                    ? (language === 'or' ? 'ପୂର୍ଣ୍ଣିମା ତିଥି: ସାତ୍ତ୍ୱିକ କ୍ଷୀର-ଫଳାହାର ଓ ଭଗବତ୍ ଆରାଧନା ଅନୁକୂଳ।' : 'पूर्णिमा तिथि: सात्विक आहार एवं भगवत् पूजा करें।')
                    : (language === 'or' ? 'ଅମାବାସ୍ୟା ତିଥି: ପିତୃ ତର୍ପଣ ଓ ଶୁଦ୍ଧ ନିରାମିଷ ସାତ୍ତ୍ୱିକ ଭୋଜନ ବିଧେୟ।' : 'अमावस्या तिथि: पितृ तर्पण एवं शुद्ध निरामिष भोजन करें।')}
                </span>
              </div>
            )}
          </div>

          {/* Ayurvedic Seasonal Rule */}
          <div className="pt-2 border-t border-slate-800/80 text-[10.5px] text-slate-300 flex items-start gap-1.5">
            <span className="text-amber-400 shrink-0 font-bold">🌿 {dayInfo.rituInfo?.or || 'ଋତୁ'}:</span>
            <span className="text-slate-300 leading-relaxed">{seasonalHealthWisdom[language]}</span>
          </div>
        </div>

        {/* CARD 2: 🧭 ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତୀକାର */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#0a162b] to-cosmic-950 border border-sky-500/30 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-sky-200">
                  {language === 'or' ? 'ଦିଗଶୂଳ ଓ ଯାତ୍ରା ପ୍ରତୀକାର' : language === 'hi' ? 'दिशाशूल एवं यात्रा उपाय' : 'Directional Travel & Remedy'}
                </span>
              </div>
              <span className="text-[10px] text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                {selectedCity.nameOr} ସ୍ଥିତି
              </span>
            </div>

            {/* Digashula Direction Alert */}
            <div className="p-2.5 rounded-xl bg-amber-950/35 border border-amber-500/35 flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">
                  {language === 'or' ? 'ଅଦ୍ୟ ନିଷିଦ୍ଧ ଯାତ୍ରା ଦିଗ (ଦିଗଶୂଳ)' : language === 'hi' ? 'आज का दिशाशूल' : 'Forbidden Direction Today'}
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-200 block">
                  🧭 {dayInfo.digashula?.directionOr || 'କିଛି ନାହିଁ'}
                </span>
              </div>
              <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                {language === 'or' ? 'ଅତି ଜରୁରୀ ନହେଲେ ତ୍ୟାଗ କରନ୍ତୁ' : 'अति आवश्यक न हो तो टालें'}
              </span>
            </div>

            {/* Shastric Travel Remedy */}
            {dayInfo.digashula?.remedyOr && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/35 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                    {language === 'or' ? 'ଦିଗଶୂଳ ଦୋଷ ଖଣ୍ଡନ ପ୍ରତୀକାର (Shastric Remedy)' : language === 'hi' ? 'दिशाशूल निवारण उपाय' : 'Remedy Before Journey'}
                  </span>
                  <p className="text-xs font-semibold text-emerald-200 mt-0.5">
                    {dayInfo.digashula.remedyOr}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Auspicious Travel Windows */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-emerald-400 font-bold block">✨ ଶୁଭ ଅଭିଜିତ୍ ମୁହୂର୍ତ୍ତ:</span>
              <span className="text-slate-200 font-mono font-bold">{abhijitStr || 'ଉପଲବ୍ଧ'}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/20">
              <span className="text-rose-400 font-bold block">⚠️ ରାହୁ କାଳ (ଯାତ୍ରା ନିଷେଧ):</span>
              <span className="text-rose-200 font-mono font-bold">{rahuKaalStr || 'ବର୍ଜିତ'}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: 🌙 ଚନ୍ଦ୍ରବଳ ଓ ତାରାବଳ ଭାଗ୍ୟ ଚକ୍ର */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#1a132b] to-cosmic-950 border border-purple-500/30 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-purple-200">
                  {language === 'or' ? 'ଚନ୍ଦ୍ରବଳ ଓ ତାରାବଳ ଭାଗ୍ୟ ଚକ୍ର' : language === 'hi' ? 'चंद्रबल एवं ताराबल चक्र' : 'Chandrabala & Tarabala Fortune'}
                </span>
              </div>
              <span className="text-[10px] text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                ନବତାରା ଗଣନା
              </span>
            </div>

            {/* Tarabala Auspicious Nakshatras */}
            <div className="p-2.5 rounded-xl bg-cosmic-900/80 border border-purple-500/25 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <span>⭐</span>
                  <span>{language === 'or' ? 'ଅଦ୍ୟ ଶୁଭ ତାରାବଳ ଜନ୍ମ ନକ୍ଷତ୍ର' : 'आज के शुभ ताराबल नक्षत्र'}</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/15 px-1.5 py-0.2 rounded">
                  ସମ୍ପତ୍, କ୍ଷେମ, ସାଧକ, ମିତ୍ର
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {dayInfo.tarabalaSummaryOr}
              </p>
            </div>

            {/* Chandrabala Auspicious Rashis */}
            <div className="p-2.5 rounded-xl bg-cosmic-900/80 border border-cyan-500/25 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                  <span>🌙</span>
                  <span>{language === 'or' ? 'ଅଦ୍ୟ ଅନୁକୂଳ ଚନ୍ଦ୍ରବଳ ରାଶି' : 'आज के शुभ चंद्रबल राशि'}</span>
                </span>
                <span className="text-[9px] text-cyan-400 font-semibold bg-cyan-500/15 px-1.5 py-0.2 rounded">
                  ଅନୁକୂଳ ଗୋଚର
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {dayInfo.chandrabalaSummaryOr}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-amber-400 shrink-0" />
            <span>
              {language === 'or'
                ? 'ଉପରୋକ୍ତ ରାଶି ଓ ନକ୍ଷତ୍ରଧାରୀ ବ୍ୟକ୍ତିବିଶେଷଙ୍କ ପାଇଁ ଆଜି ନୂଆ କାର୍ଯ୍ୟ, ପରୀକ୍ଷା ଓ ବାର୍ତ୍ତାଳାପରେ ଉଚ୍ଚ ସଫଳତା ପ୍ରାପ୍ତ ହେବ।'
                : 'उपरोक्त राशि व नक्षत्र वालों के लिए आज का दिन कार्यसिद्धि व सफलता हेतु विशेष फलदायी है।'}
            </span>
          </div>
        </div>

        {/* CARD 4: ⏱️ ସୌର ଦିନମାନ, ରାତ୍ରିମାନ ଓ ସ୍ଫୁଟ ତଥ୍ୟ */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#1c1808] to-cosmic-950 border border-amber-500/30 shadow-md space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-amber-200">
                  {language === 'or' ? 'ଦିନମାନ, ରାତ୍ରିମାନ ଓ ସ୍ଫୁଟ ମାନ' : language === 'hi' ? 'दिनमान, रात्रिमान एवं स्फुट' : 'Astronomical Day-Night Length'}
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ୬୦ ଘଟୀ-ଦଣ୍ଡ ସିଦ୍ଧାନ୍ତ
              </span>
            </div>

            {/* Dinamana & Ratrimana Matrix */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/25">
                <span className="text-[9.5px] font-bold text-amber-400 block uppercase">
                  ☀️ ସୌର ଦିନମାନ (Daylight)
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-200 mt-1 block">
                  {dayInfo.dinamana?.strOr || `${formatNumber(dayInfo.dinamana?.danda || 30)} ଦଣ୍ଡ ${formatNumber(dayInfo.dinamana?.pala || 0)} ପଳ`}
                </span>
                <span className="text-[9.5px] text-slate-400 block mt-0.5">
                  ({formatNumber(dayInfo.dinamana?.hours || 12)} ଘଣ୍ଟା {formatNumber(dayInfo.dinamana?.minutes || 0)} ମି.)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/25">
                <span className="text-[9.5px] font-bold text-indigo-300 block uppercase">
                  🌙 ସୌର ରାତ୍ରିମାନ (Night)
                </span>
                <span className="text-xs sm:text-sm font-black text-indigo-200 mt-1 block">
                  {dayInfo.ratrimana?.strOr || `${formatNumber(dayInfo.ratrimana?.danda || 30)} ଦଣ୍ଡ ${formatNumber(dayInfo.ratrimana?.pala || 0)} ପଳ`}
                </span>
                <span className="text-[9.5px] text-slate-400 block mt-0.5">
                  ({formatNumber(dayInfo.ratrimana?.hours || 12)} ଘଣ୍ଟା {formatNumber(dayInfo.ratrimana?.minutes || 0)} ମି.)
                </span>
              </div>
            </div>

            {/* Sun & Moon Precise Zodiac Positions */}
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 grid grid-cols-2 gap-2 text-[10.5px]">
              <div>
                <span className="text-amber-400 font-bold block">☀️ ସୂର୍ଯ୍ୟ ରାଶି ସ୍ଫୁଟ:</span>
                <span className="text-slate-200 font-semibold">{dayInfo.suryaRashiInfo.rashiOr} ({dayInfo.suryaRashiInfo.degreesStrOr})</span>
              </div>
              <div>
                <span className="text-sky-300 font-bold block">🌙 ଚନ୍ଦ୍ର ରାଶି ସ୍ଫୁଟ:</span>
                <span className="text-slate-200 font-semibold">{dayInfo.chandraRashiInfo.rashiOr} ({dayInfo.chandraRashiInfo.degreesStrOr})</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>ଅୟନାଂଶ: {dayInfo.panjika.ayanamsa.toFixed(2)}° ଲାହିଡ଼ୀ</span>
            <span className="text-amber-400/90 font-medium">୧ ଦିବାରାତ୍ର = ୬୦ ଦଣ୍ଡ = ୩୬୦୦ ପଳ</span>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SECTION: ⚡ ଦୈନିକ କର୍ମ ଅନୁକୂଳତା ସୂଚକ (Daily Practical Action Suitability Matrix) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cosmic-950 via-[#0e1626] to-cosmic-950 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
              <Award className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-200">
                {language === 'or'
                  ? 'ଦୈନିକ କର୍ମ ଅନୁକୂଳତା ସୂଚକ (ଶୁଭ-ଅଶୁଭ କର୍ମ ବିଚାର)'
                  : language === 'hi'
                  ? 'दैनिक कार्य अनुकूलता सूचक (शुभ-अशुभ निर्णय)'
                  : 'Daily Practical Action Suitability Matrix'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                {language === 'or'
                  ? 'ଆଜିର ତିଥି, ବାର, ନକ୍ଷତ୍ର ଓ ଯୋଗ ଆଧାରରେ ୫ଟି ମୁଖ୍ୟ ସାଂସାରିକ କାର୍ଯ୍ୟର ଶାସ୍ତ୍ରୀୟ ବିଶ୍ଳେଷଣ'
                  : '5 essential life actions analyzed using today\'s authentic Tithi, Vaara, Nakshatra & Yoga.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 shrink-0">
            ଶାସ୍ତ୍ରୀୟ ସିଦ୍ଧାନ୍ତ ଗଣନା
          </span>
        </div>

        {/* 5 Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          {actionSuitabilities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  act.status === 'shubha'
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400/50'
                    : act.status === 'varjita'
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400/50'
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-lg bg-white/10 text-white">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-100 line-clamp-1">
                        {act.title[language]}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div>
                    <span className={`inline-block text-[9.5px] font-black px-2 py-0.5 rounded-md border ${act.badgeClasses}`}>
                      {act.statusText[language]}
                    </span>
                  </div>

                  {/* Shastric Rationale */}
                  <p className="text-[10px] text-slate-300 leading-snug">
                    {act.reason[language]}
                  </p>
                </div>

                {/* Best Recommended Timing */}
                <div className="pt-1.5 border-t border-white/5 text-[9.5px] text-amber-300/90 font-mono">
                  <span className="text-slate-400 block text-[8.5px] font-sans uppercase">ପ୍ରଶସ୍ତ ସମୟ:</span>
                  <span className="font-bold">{act.bestWindow[language]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SRIMANDIR SACRED HERITAGE & PANJIKA TRADITION CALLOUT */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1a1104] via-cosmic-950 to-[#120803] border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🛕</span>
            <h4 className="text-xs sm:text-sm font-black text-amber-200 font-serif">
              {language === 'or' ? 'ଶ୍ରୀମନ୍ଦିର ପରମ୍ପରା ଓ ପାଞ୍ଜି ପରାମର୍ଶ' : 'श्रीक्षेत्र जगन्नाथ परंपरा एवं पंचांग निर्देश'}
            </h4>
          </div>
          {dayInfo.jagannathBesha ? (
            <div className="text-xs text-amber-300 font-medium leading-relaxed">
              <span className="font-bold text-amber-100">👑 ଅଦ୍ୟ ମହାପ୍ରଭୁଙ୍କ ବେଶ: {dayInfo.jagannathBesha.or}</span>
              {dayInfo.jagannathBesha.descriptionOr && (
                <span className="block text-[11px] text-slate-300 mt-0.5">{dayInfo.jagannathBesha.descriptionOr}</span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ଶ୍ରୀମନ୍ଦିର ନିତ୍ୟ ସେବା: ସକାଳେ ସାଧା ବେଶ, ମଧ୍ୟାହ୍ନରେ ଚନ୍ଦନ ବେଶ ଏବଂ ରାତ୍ରି ପହୁଡ଼ରେ ପାଟବସ୍ତ୍ର-କୁସୁମ ସୁଶୋଭିତ ବଡ଼ସିଂହାର ବେଶ।
            </p>
          )}
          {dayInfo.panjikaNotes && (
            <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">
              📜 {selectedPanjika.nameOr} ଟିପ୍ପଣୀ: {dayInfo.panjikaNotes.or}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
            {selectedPanjika.nameOr}
          </span>
          <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-xl">
            {selectedCity.nameOr}
          </span>
        </div>
      </div>
    </div>
  );
};
