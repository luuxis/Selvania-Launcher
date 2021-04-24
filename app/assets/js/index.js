'use strict';

import Downloader from "./lib/Downloader.js";
import Unzipper from "./lib/Unzipper.js";

const AutoUpdater = require("nw-autoupdater");
const pkg = require("../package.json");
const { config } = require('./assets/js/utils.js');
const os = require("os");
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });
const fs = require("fs");

let win = nw.Window.get();

let isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class index {
  constructor(){
    if(localStorage.getItem("theme") == "white") document.children[0].classList.toggle("theme-white");
    else document.children[0].classList.toggle("theme-dark");
    this.splash = document.querySelector(".splash");
    this.splashMessage = document.querySelector(".splash-message");
    this.splashAuthor = document.querySelector(".splash-author");
    this.message = document.querySelector(".message");
    this.progress = document.querySelector("progress");
   if(localStorage.getItem("theme") == null) localStorage.setItem("theme", "dark");
    var self = this;
    document.addEventListener('DOMContentLoaded', () => { self.startAnimation() });
  }

  async startAnimation(){
    await sleep(100);
    document.querySelector("#splash").style.display = "block";
    await sleep(500);
    this.splash.classList.add("opacity");
    await sleep(500);
    this.splash.classList.add("translate");
    this.splashMessage.classList.add("opacity");
    this.splashAuthor.classList.add("opacity");
    this.message.classList.add("opacity");
    await sleep(1000);
    this.checkUpdate();
  }

  async checkUpdate(){
    if(isDev) return this.maintenanceCheck();

    const manifest = await fetch(pkg.manifestUrl).then(res => res.json());
    const update = await updater.checkNewVersion(manifest);
    if(!update) return this.maintenanceCheck();

    updater.on("download", (dlSize, totSize) => {
      this.setProgress(dlSize, totSize);
    });
    updater.on("install", (dlSize, totSize) => {
      this.setProgress(dlSize, totSize);
    });

    this.toggleProgress();
    this.setStatus(`Téléchargement de la mise à jour`);
    const file = await updater.download(manifest);
    this.setStatus(`Décompression de la mise à jour`);
    await updater.unpack(file);
    this.toggleProgress();
    this.setStatus(`Redémarrage`);
    await updater.restartToSwap();
  }
  
  async maintenanceCheck(){
    this.setStatus(`Démarrage du launcher`);
    config.fetch().then(res => {
      if ((res.maintenance) == "on"){
        return this.shutdown(res.maintenance_message);
      }
      this.startLauncher();
    }).catch( err => {
      console.log("impossible de charger le package.json");
      console.log(err);
      return this.shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
    })
  }


  startLauncher(){
    this.setStatus(`Démarrage du launcher`);
    nw.Window.open("app/launcher.html", {
      "title": "Evoldia-Network Launcher",
      "width": 1280,
      "height": 720,
      "min_width": 1280,
      "min_height": 720,
      "frame": (process.platform == "win32") ? false : true,
      "position": "center",
      "resizable": false,
      "icon": "app/assets/images/icons/icon.png"
    });
    win.close();
  }

  shutdown(text){
    this.setStatus(`${text}<br>Arrêt dans 5s`);
    let i = 4;
    setInterval(() => {
      this.setStatus(`${text}<br>Arrêt dans ${i--}s`);
      if(i < 0) win.close();
    }, 1000);
  }

  setStatus(text){
    this.message.innerHTML = text;
  }

  toggleProgress(){
    if(this.progress.classList.toggle("show")) this.setProgress(0, 1);
  }

  setProgress(value, max){
    this.progress.value = value;
    this.progress.max = max;
  }
}

new index();

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}
