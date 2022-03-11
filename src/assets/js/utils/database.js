class database {
    async init() {
        this.db = await new Promise((resolve) => {
            let request = indexedDB.open('database');

            request.onupgradeneeded = (event) => {
                let db = event.target.result;

                if (!db.objectStoreNames.contains('accounts')) {
                    db.createObjectStore('accounts', { keyPath: "key" });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: "key" });
                }
                if (!db.objectStoreNames.contains('skins')) {
                    db.createObjectStore('skins', { keyPath: "key" });
                }
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
        return this;
    }

    add(uuid) {
        let store = this.getStore();
        return store.add({ uuid });
    }

    get(uuid) {
        let store = this.getStore();
        return new Promise((resolve) => {
            let get = store.get(uuid);
            get.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
    }

    getAll() {
        let store = this.getStore();
        return new Promise((resolve) => {
            let getAll = store.getAll();
            getAll.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });
    }

    delete(uuid) {
        let store = this.getStore();
        return store.delete(uuid);
    }

    getStore() {
        return this.db.transaction("accounts", "readwrite").objectStore("accounts");
    }
}

export default database;