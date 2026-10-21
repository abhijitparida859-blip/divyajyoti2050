export type PriorityLevel = 'high' | 'medium' | 'low';

export type MuhurtaKey = 'brahma' | 'abhijit' | 'any';

export type TaskFrequency = 'daily' | 'weekly' | 'specific_date' | 'muhurta_sync';

export interface VedicTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  priority: PriorityLevel;
  dueDate?: string;
  dueTime?: string;
  muhurtaKey?: MuhurtaKey;
  auspiciousMuhurtaSuggested?: string;
  energyAlignment: 'Sattva' | 'Rajas' | 'Tamas';
  tags: string[];
  createdAt: string;

  // ── Advanced Recurrence & Scheduling ──
  frequency?: TaskFrequency;
  /** Days of week for 'weekly' frequency (0 = Sunday, 1 = Monday, ..., 6 = Saturday) */
  weekdays?: number[];

  // ── Alarm & Ringtone Configuration ──
  alarmEnabled?: boolean;
  ringtoneId?: string; // 'bell' | 'shankha' | 'om' | 'damaru' | 'flute' | 'bowl' | 'chime' | 'custom'
  customAudioName?: string;
  customAudioData?: string; // Base64 data URI
  snoozeUntil?: number; // epoch ms
}

export interface CustomRingtoneRecord {
  id: string;
  name: string;
  dataUri: string;
  uploadedAt: number;
}
