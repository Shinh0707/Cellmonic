import { Preset } from './types';

const DB_NAME = 'CellmonicDB';
const DB_VERSION = 1;
const STORE_NAME = 'memos';

export const dbService = {
    db: null as IDBDatabase | null,

    initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB error:", request.error);
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },

    getAllMemos(): Promise<Preset[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                // Try initializing if not ready (though usually app should wait for init)
                this.initDB().then(() => this.getAllMemos().then(resolve).catch(reject));
                return;
            }

            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as Preset[]);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    addMemo(preset: Preset): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Ensure we don't pass an undefined id if we want autoIncrement to work for new items
            // If the preset has an ID, it might update it (put) vs add. 
            // Safe approach: remove id if it exists to force new entry, or use put if we supported editing.
            // For now, memos are just "added", so we treat them as new.
            const { id, ...rest } = preset;
            const request = store.add(rest);

            request.onsuccess = () => {
                resolve(request.result as number);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    deleteMemo(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};
