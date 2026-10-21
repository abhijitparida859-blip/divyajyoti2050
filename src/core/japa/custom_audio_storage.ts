/**
 * ============================================================================
 *  CUSTOM MANTRA AUDIO STORAGE (IndexedDB)
 * ============================================================================
 *  Allows devotees to attach any high-quality mantra recording (from YouTube,
 *  temple chants, or personal files) to any mantra in the 108 Japa Mala.
 *
 *  Stores:
 *   - raw audio Blob (MP3, WAV, M4A, OGG, AAC)
 *   - start timestamp (seconds of 1 recitation cycle)
 *   - end timestamp (seconds where 1 cycle completes)
 *   - fileName & metadata
 *
 *  100% offline, persistent, zero server dependency, works on Web & Android.
 * ============================================================================
 */

export interface CustomMantraAudioRecord {
  mantraId: string;
  blob: Blob;
  start: number;
  end: number;
  fileName: string;
  updatedAt: number;
}

export interface CustomAudioLoaded {
  url: string;
  start: number;
  end: number;
  fileName: string;
  record: CustomMantraAudioRecord;
}

const DB_NAME = 'divyajyoti_japa_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_mantra_audio';

// Active Object URL registry to avoid memory leaks
const objectUrlRegistry = new Map<string, string>();

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'mantraId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Save or update custom audio for a specific mantra.
 */
export async function saveCustomAudio(
  mantraId: string,
  blob: Blob,
  start: number,
  end: number,
  fileName: string,
): Promise<CustomAudioLoaded> {
  const db = await openDb();
  const record: CustomMantraAudioRecord = {
    mantraId,
    blob,
    start: Math.max(0, start),
    end: Math.max(start + 0.1, end),
    fileName: fileName || 'custom_mantra.mp3',
    updatedAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Revoke old URL if previously registered
  const prevUrl = objectUrlRegistry.get(mantraId);
  if (prevUrl) {
    try { URL.revokeObjectURL(prevUrl); } catch { /* ignore */ }
  }

  const url = URL.createObjectURL(blob);
  objectUrlRegistry.set(mantraId, url);

  return {
    url,
    start: record.start,
    end: record.end,
    fileName: record.fileName,
    record,
  };
}

/**
 * Retrieve custom audio for a mantra if one has been saved.
 */
export async function getCustomAudio(mantraId: string): Promise<CustomAudioLoaded | null> {
  try {
    const db = await openDb();
    const record = await new Promise<CustomMantraAudioRecord | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(mantraId);
      req.onsuccess = () => resolve(req.result as CustomMantraAudioRecord | undefined);
      req.onerror = () => reject(req.error);
    });

    if (!record || !record.blob) return null;

    let url = objectUrlRegistry.get(mantraId);
    if (!url) {
      url = URL.createObjectURL(record.blob);
      objectUrlRegistry.set(mantraId, url);
    }

    return {
      url,
      start: record.start,
      end: record.end,
      fileName: record.fileName,
      record,
    };
  } catch (err) {
    console.warn('Could not read custom audio from IndexedDB:', err);
    return null;
  }
}

/**
 * Delete custom audio for a mantra.
 */
export async function deleteCustomAudio(mantraId: string): Promise<void> {
  const prevUrl = objectUrlRegistry.get(mantraId);
  if (prevUrl) {
    try { URL.revokeObjectURL(prevUrl); } catch { /* ignore */ }
    objectUrlRegistry.delete(mantraId);
  }

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(mantraId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete custom audio:', err);
  }
}
