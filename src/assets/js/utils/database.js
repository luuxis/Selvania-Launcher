/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

class database {
    async init() {
        this.db = await new Promise((resolve) => {
            let request = indexedDB.open('database', 1);

            request.onupgradeneeded = (event) => {
                let db = event.target.result;

                if (!db.objectStoreNames.contains('accounts')) {
                    db.createObjectStore('accounts', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('accounts-selected')) {
                    db.createObjectStore('accounts-selected', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('java-path')) {
                    db.createObjectStore('java-path', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('java-args')) {
                    db.createObjectStore('java-args', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('launcher')) {
                    db.createObjectStore('launcher', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('ram')) {
                    db.createObjectStore('ram', { keyPath: "key" });
                }

                if (!db.objectStoreNames.contains('screen')) {
                    db.createObjectStore('screen', { keyPath: "key" });
                }
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
        return this;
    }

    add(data, type) {
        let store = this.getStore(type);
        return store.add({ key: this.genKey(data.uuid), value: data });
    }

    get(keys, type) {
        let store = this.getStore(type);
        let Key = this.genKey(keys);
        return new Promise((resolve) => {
            let get = store.get(Key);
            get.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
    }

    getAll(type) {
        let store = this.getStore(type);
        return new Promise((resolve) => {
            let getAll = store.getAll();
            getAll.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
    }

    update(data, type) {
        let self = this;
        return new Promise(async(resolve) => {
            let store = self.getStore(type);
            let keyCursor = store.openCursor(self.genKey(data.uuid));
            keyCursor.onsuccess = async(event) => {
                let cursor = event.target.result;
                for (let [key, value] of Object.entries({ value: data })) cursor.value[key] = value;
                resolve(cursor.update(cursor.value));
            }
        });
    }

    delete(key, type) {
        let store = this.getStore(type);
        return store.delete(this.genKey(key));
    }

    getStore(type) {
        return this.db.transaction(type, "readwrite").objectStore(type);
    }

    genKey(int) {
        var key = 0;
        for (let c of int.split("")) key = (((key << 5) - key) + c.charCodeAt()) & 0xFFFFFFFF;
        return key;
    }
}

export default database;