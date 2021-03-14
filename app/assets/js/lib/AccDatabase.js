'use strict';

class AccDatabase {
  async init(){
    this.db = await new Promise((resolve) => {
      let request = indexedDB.open("acc", 3);

      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        let store;

        try {
          store = db.createObjectStore("accounts", { keyPath: "key" });
        } catch(e){
          db.deleteObjectStore("accounts");
          store = db.createObjectStore("accounts", { keyPath: "key" });
        }

        store.createIndex("username", "username");
        store.createIndex("email", "email");
        store.createIndex("uuid", "uuid");
        store.createIndex("token", "token");
        store.createIndex("type", "type"); // microsoft/mojang
        store.createIndex("refresh_token", "refresh_token");
        store.createIndex("refresh_date", "refresh_date");
      }

      request.onsuccess = (event) => {
        resolve(event.target.result);
      }
    });
    return this;
  }

  add(uuid, username, email, token, type, refresh_token, refresh_date){
    let store = this.getStore();
    return store.add({key: this.genKey(uuid), uuid, username, email, token, type, refresh_token, refresh_date});
  }

  get(uuid){
    let store = this.getStore();
    let uuidKey = this.genKey(uuid);
    return new Promise((resolve) => {
      let get = store.get(uuidKey);
      get.onsuccess = (event) => {
        resolve(event.target.result);
      }
    });
  }

  update(uuid, json){
    let self = this;
    return new Promise(async (resolve) => {
      let store = self.getStore();
      let keyCursor = store.openCursor(self.genKey(uuid));
      keyCursor.onsuccess = async (event) => {
        let cursor = event.target.result;
        for(let [key, value] of Object.entries(json)) cursor.value[key] = value;
        resolve(cursor.update(cursor.value));
      }
    });
  }

  getAll(){
    let store = this.getStore();
    return new Promise((resolve) => {
      let getAll = store.getAll();
      getAll.onsuccess = (event) => {
        resolve(event.target.result);
      }
    });
  }

  delete(uuid){
    let store = this.getStore();
    return store.delete(this.genKey(uuid));
  }

  getStore(){
    return this.db.transaction("accounts", "readwrite").objectStore("accounts");
  }

  genKey(uuid){
    var key = 0;
    for (let c of uuid.split("")) key = (((key << 5) - key) + c.charCodeAt()) & 0xFFFFFFFF;
    return key;
  }
}

export default AccDatabase;
