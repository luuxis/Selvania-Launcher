class database {
    init() {
        let account = indexedDB.open('account')
        let settings = indexedDB.open('settings')
        let skins = indexedDB.open('skins')
        account.onupgradeneeded = (event) => {
            let db = event.target.result;

            if (!db.objectStoreNames.contains('accounts')) {
                db.createObjectStore('accounts', { keyPath: "key" });

            }

        }

        account.onsuccess = (event) => {
            let db = event.target.result;
            
        }
    }
}

export default new database;