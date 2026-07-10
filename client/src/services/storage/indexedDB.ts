import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MediVoiceDB extends DBSchema {
  recordings: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      timestamp: Date;
      duration: number;
    };
  };
  notes: {
    key: string;
    value: {
      id: string;
      transcription: string;
      formattedNote: string;
      template: string;
      timestamp: Date;
    };
    indexes: { 'by-date': Date };
  };
}

class LocalStorage {
  private db: IDBPDatabase<MediVoiceDB> | null = null;

  async init() {
    this.db = await openDB<MediVoiceDB>('medivoice-offline', 1, {
      upgrade(db) {
        // Recordings store
        if (!db.objectStoreNames.contains('recordings')) {
          db.createObjectStore('recordings', { keyPath: 'id' });
        }
        
        // Notes store with index
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('by-date', 'timestamp');
        }
      },
    });
  }

  async saveRecording(recording: { id: string; blob: Blob; timestamp: Date; duration: number }) {
    if (!this.db) await this.init();
    await this.db!.put('recordings', recording);
  }

  async getRecording(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('recordings', id);
  }

  async getAllRecordings() {
    if (!this.db) await this.init();
    return this.db!.getAll('recordings');
  }

  async saveNote(note: { id: string; transcription: string; formattedNote: string; template: string; timestamp: Date }) {
    if (!this.db) await this.init();
    await this.db!.put('notes', note);
  }

  async getRecentNotes(limit = 10) {
    if (!this.db) await this.init();
    const index = this.db!.transaction('notes').store.index('by-date');
    return index.getAll(null, limit);
  }

  async clearAll() {
    if (!this.db) await this.init();
    await this.db!.clear('recordings');
    await this.db!.clear('notes');
  }
}

export const localStorageDB = new LocalStorage();
