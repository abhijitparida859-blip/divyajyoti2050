export interface TithiInfo {
  number: number; // 1 to 30 (1-15 Shukla, 16-30 Krishna)
  nameKey: string;
  paksha: 'Shukla' | 'Krishna';
  percentage: number;
  endTime: string;
}

export interface NakshatraInfo {
  number: number; // 1 to 27
  nameKey: string;
  pada: number; // 1 to 4
  ruler: string;
  deity: string;
  percentage: number;
}

export interface YogaInfo {
  number: number; // 1 to 27
  nameKey: string;
}

export interface KaranaInfo {
  number: number; // 1 to 60 (mapped to 11 names)
  nameKey: string;
  type: 'chara' | 'sthira';
}

export interface MuhurtaWindow {
  nameKey: string;
  start: string;
  end: string;
  isAuspicious: boolean;
}

export interface DayPanjika {
  date: string;
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  vaara: string; // Day of week
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonPhase: number; // 0 (New) to 1 (Full)
  ayanamsa: number; // Lahiri degrees
  muhurtas: {
    rahuKaal: MuhurtaWindow;
    yamaganda: MuhurtaWindow;
    gulika: MuhurtaWindow;
    abhijit: MuhurtaWindow;
    brahmaMuhurta: MuhurtaWindow;
  };
  festivals: string[];
}
