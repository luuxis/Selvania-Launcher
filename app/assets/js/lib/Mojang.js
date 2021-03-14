'use strict';

class Mojang {
  constructor(accDB){
    if(localStorage.getItem("clientToken") == null) localStorage.setItem("clientToken", this.genUUID());
    this.clientToken = localStorage.getItem("clientToken");
    this.db = accDB;
  }

  genUUID(){
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async authenticate(username, password){
    let post = {
      agent: {
        name: "Minecraft",
        version: 1
      },
      username,
      password,
      clientToken: this.clientToken,
      requestUser: true
    }
    let message = await fetch("https://authserver.mojang.com/authenticate", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(post)}).then(res => res.json());
    if(message.error) return message;
    if(message.availableProfiles.length == 0) return {error: true, errorMessage: "noacc"};
    this.db.add(message.selectedProfile.id, message.selectedProfile.name, message.user.username, message.accessToken, "mojang");
    return {username: message.selectedProfile.name, uuid: message.selectedProfile.id, email: message.user.username};
  }

  async refresh(uuid){
    let acc = await this.db.get(uuid);
    if(!acc) return {error: "Not Found"};
    let post = {
      accessToken: acc.token,
      clientToken: this.clientToken,
      requestUser: true
    }
    let message = await fetch("https://authserver.mojang.com/refresh", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(post)}).then(res => res.json());
    if(message.error) return message;
    this.db.update(uuid, {username: message.selectedProfile.name, email: message.user.username, token: message.accessToken});
    return {username: message.selectedProfile.name, uuid: message.selectedProfile.id, email: message.user.username};
  }

  async validate(uuid){
    let acc = await this.db.get(uuid);
    if(!acc) return {error: "Not Found"};
    let post = {
      accessToken: acc.token,
      clientToken: this.clientToken
    }
    let message = await fetch("https://authserver.mojang.com/validate", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(post)});
    if(message.status == 204) return true
    else return false
  }

  async invalidate(uuid){
    let acc = await this.db.get(uuid);
    if(!acc) return {error: "Not Found"};
    let post = {
      accessToken: acc.token,
      clientToken: this.clientToken
    }
    let message = await fetch("https://authserver.mojang.com/invalidate", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(post)}).then(res => res.text());
    if(message == ""){
      this.db.delete(uuid);
      return true;
    } else return false;
  }
}

export default Mojang;
