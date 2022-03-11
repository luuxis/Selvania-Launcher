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
                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: "key" });
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

    get(uuid, type) {
        let store = this.getStore(type);
        let uuidKey = this.genKey(uuid);
        return new Promise((resolve) => {
            let get = store.get(uuidKey);
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

    delete(uuid, type) {
        let store = this.getStore(type);
        return store.delete(uuid);
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