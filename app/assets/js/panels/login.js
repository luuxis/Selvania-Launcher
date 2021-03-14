'use strict';

import AccDatabase from '../lib/AccDatabase.js';
import Mojang from '../lib/Mojang.js';
import Microsoft from '../lib/Microsoft.js';

class Login {
  static id = "login";

  async init(popup){
    this.accounts = await new AccDatabase().init();
    this.mojang = new Mojang(this.accounts);
    this.microsoft = new Microsoft(this.accounts);
    this.accMojangDiv = document.querySelector("div#mojang.accounts div");
    this.accMicrosoftDiv = document.querySelector("div#microsoft.accounts div");
    this.connect = document.querySelector(".connect-bg");
    this.popup = popup;

    this.initClick();
    this.initAccounts();
  }

  async initAccounts(){
    console.log("[Account] Initializing Accounts...");
    let accounts = await this.accounts.getAll();
    if(accounts[0]){
      for(let account of accounts){
        if(account.type == "mojang"){
          let refresh = await this.mojang.refresh(account.uuid);
          if(refresh.error){
            console.log(`[Account] Deleting ${account.username} (${account.uuid}) mojang account...`);
            console.error(`[Account] ${account.uuid}: ${refresh.errorMessage}`);
            this.accounts.delete(account.uuid);
            if(localStorage.getItem("selected") == account.uuid) localStorage.removeItem("selected");
            continue;
          }
          let div = this.addAccount(refresh);
          this.accMojangDiv.appendChild(div);
        } else {
          let refresh = await this.microsoft.refresh(account.uuid);
          if(refresh.error){
            console.log(`[Account] Deleting ${account.username} (${account.uuid}) microsoft account...`);
            console.error(`[Account] ${account.uuid}: ${refresh.errorMessage}`);
            this.accounts.delete(account.uuid);
            if(localStorage.getItem("selected") == account.uuid) localStorage.removeItem("selected");
            continue;
          }
          let div = this.addAccount(refresh);
          this.accMicrosoftDiv.appendChild(div);
        }
        console.log(`[Account] Adding ${account.username} (${account.uuid}) ${account.type} account...`);
      }
      if((await this.accounts.getAll()).length == 0) return localStorage.removeItem("selected");
      if(localStorage.getItem("selected") == null) localStorage.setItem("selected", accounts[0].uuid);
      this.changeProfile(localStorage.getItem("selected"), false);
      this.selected = document.getElementById(localStorage.getItem("selected"));
      this.selected.classList.toggle("active");
    }
  }

  addAccount(account){
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = account.uuid;
    div.innerHTML = `
      <img class="acc-image" src="https://mc-heads.net/avatar/${account.uuid}/"/>
      <div class="acc-username">${account.username}</div>
      <div class="acc-email">${account.email}</div>
      <div class="acc-delete icon-account-delete"></div>
    `
    return div;
  }

  async changeProfile(uuid, off){
    let side = document.querySelector(".account-side");
    if(off){
      side.ariaLabel = "non connecté"
    } else {
      let acc = await this.accounts.get(uuid);
      side.ariaLabel = acc.username;
    }
    side.innerHTML = `
      <img class="account-side-img" src="https://mc-heads.net/avatar/${uuid}/"/>
      <div class="account-side-connected ${off ? "red" : "green"}"></div>
    `
  }

  initClick(){
    let changeSelected = (uuid) => {
      this.changeProfile(uuid, false);
      localStorage.setItem("selected", uuid);
      this.selected.classList.toggle("active");
      (this.selected = document.getElementById(uuid)).classList.toggle("active");
    }

    this.accMicrosoftDiv.addEventListener("click", async (event) => {
      let uuid = event.target.id;
      console.log(event.target);
      if(localStorage.getItem("selected") == uuid) return;
      if(event.target.classList.contains("acc-delete")){
        let account = await this.accounts.get(event.path[1].id);
        return this.popup.showPopup(`Supprimer ${account.username}`, `Êtes-vous sûr de vouloir supprimer le compte <b>${account.username}</b> ?`, "warning", {value: "Oui", func: async () => {
          console.log(`[Account] Deleting ${account.username} (${account.uuid}) microsoft account...`);
          await this.microsoft.invalidate(event.path[1].id);  
          this.accMicrosoftDiv.removeChild(event.path[1]);
          let accounts = await this.accounts.getAll();
          if(accounts[0] && accounts[0].uuid != event.path[1].id) changeSelected(accounts[0].uuid);
          else {
            this.changeProfile("c06f89064c8a49119c29ea1dbd1aab82", true);
            return localStorage.removeItem("selected")
          };
        }}, {value: "Annuler"});
      }
      changeSelected(event.target.id);
    });

    this.accMojangDiv.addEventListener("click", async (event) => {
      let uuid = event.target.id;
      if(localStorage.getItem("selected") == uuid) return;
      if(event.target.classList.contains("acc-delete")){
        let account = await this.accounts.get(event.path[1].id);
        return this.popup.showPopup(`Supprimer ${account.username}`, `Êtes-vous sûr de vouloir supprimer le compte <b>${account.username}</b> ?`, "warning", {value: "Oui", func: async () => {
          console.log(`[Account] Deleting ${account.username} (${account.uuid}) mojang account...`);
          await this.mojang.invalidate(event.path[1].id);
          this.accMojangDiv.removeChild(event.path[1]);
          let accounts = await this.accounts.getAll();
          if(accounts[0] && accounts[0].uuid != event.path[1].id) changeSelected(accounts[0].uuid);
          else {
            this.changeProfile("c06f89064c8a49119c29ea1dbd1aab82", true);
            return localStorage.removeItem("selected")
          };
        }}, {value: "Annuler"});
      }
      changeSelected(event.target.id);
    });

    let forgot = document.querySelector(".connect #forgot");
    forgot.addEventListener("click", () => {
      nw.Shell.openExternal("https://www.minecraft.net/fr-fr/password/forgot");
    });

    let buy = document.querySelector(".connect #buy");
    buy.addEventListener("click", () => {
      nw.Shell.openExternal("https://sisu.xboxlive.com/connect/XboxLive/?state=signup&signup=1&cobrandId=8058f65d-ce06-4c30-9559-473c9275a65d&tid=896928775&ru=https://www.minecraft.net/login&aid=1142970254");
    });

    let addAcc = document.querySelector("div#mojang.accounts #add");
    addAcc.addEventListener("click", () => {
      this.connect.classList.toggle("show");
    });

    let addMicrosoftAcc = document.querySelector("div#microsoft.accounts #add");
    addMicrosoftAcc.addEventListener("click", async () => {
      let auth = await this.microsoft.authenticate(this.popup);
      if(auth.cancel) return;
      console.log(`[Account] Adding ${auth.username} (${auth.uuid}) microsoft account...`);
      if(!document.getElementById(auth.uuid)){
        let div = this.addAccount(auth);
        this.accMicrosoftDiv.appendChild(div);
      }
      this.changeProfile(auth.uuid, false);
      localStorage.setItem("selected", auth.uuid);
      if(this.selected) this.selected.classList.toggle("active");
      (this.selected = document.getElementById(auth.uuid)).classList.toggle("active");
    });

    let email = document.querySelector("#email");
    let pass = document.querySelector("#pass");
    let close = document.querySelector(".connect-close");
    close.addEventListener("click", (event) => {
      this.connect.classList.toggle("show");
      email.value = "";
      pass.value = "";
    });

    let connection = document.querySelector("#connect");
    email.addEventListener("keyup", (event) => {
      if(event.keyCode == 13){
        var click = new Event('click');
        connection.dispatchEvent(click);
      }
    });

    pass.addEventListener("keyup", (event) => {
      if(event.keyCode == 13){
        var click = new Event('click');
        connection.dispatchEvent(click);
      }
    });

    let email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    connection.addEventListener("click", async () => {
      if(email.value == "")
        return this.popup.showPopup("Adresse mail vide", "L'adresse mail renseignée est vide.", "warning", {value: "Réessayer"});
      if(!email_regex.test(email.value))
        return this.popup.showPopup("Adresse mail incorrecte", "L'adresse mail renseignée est incrorrecte.", "warning", {value: "Corriger"});
      if(pass.value == "")
        return this.popup.showPopup("Mot de passe vide", "Le mot de passe renseignée est vide.", "warning", {value: "Réessayer"});
      let auth = await this.mojang.authenticate(email.value, pass.value);
      if(auth.error){
        console.error(`[Account] ${auth.errorMessage}`);
        if(auth.errorMessage == "Invalid credentials. Invalid username or password.")
          return this.popup.showPopup("Identifiants invalides", "Adresse mail ou mot de passe invalide.", "warning", {value: "Réessayer"});
        else if(auth.errorMessage == "Invalid credentials.")
          return this.popup.showPopup("Relax Max !", "Vous avez essayé trop de fois. Merci de réessayer plus tard", "warning", {value: "Réessayer"});
        else if(auth.errorMessage == "noacc")
          return this.popup.showPopup("Jeu impayé", "Vous n'avez pas payé minecraft !", "warning", {value: "OK"});
        else return this.popup.showPopup("Erreur inconnue", auth.errorMessage, "warning", {value: "Réessayer"});
      }
      console.log(`[Account] Adding ${auth.username} (${auth.uuid}) mojang account...`);
      email.value = "";
      pass.value = "";
      this.changeProfile(auth.uuid, false);
      localStorage.setItem("selected", auth.uuid);
      if(this.selected) this.selected.classList.toggle("active");
      if(!document.getElementById(auth.uuid)){
        let div = this.addAccount(auth);
        this.accMojangDiv.appendChild(div);
      }
      (this.selected = document.getElementById(auth.uuid)).classList.toggle("active");
      this.connect.classList.toggle("show");
    });
  }
}

export default Login;
