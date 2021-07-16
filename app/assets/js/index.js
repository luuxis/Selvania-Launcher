'use strict';
const AutoUpdater = require("nw-autoupdater-luuxis");
const pkg = require("../package.json");

const url = pkg.url.replace('{user}', pkg.user);
const manifestUrl = url + "/launcher/package.json";

const { config } = require('./assets/js/utils.js');
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });

let win = nw.Window.get();
let Dev = (window.navigator.plugins.namedItem('Native Client') !== null);


class index {
  constructor(){
    this.splash = document.querySelector(".splash");
    this.splashMessage = document.querySelector(".splash-message");
    this.splashAuthor = document.querySelector(".splash-author");
    this.message = document.querySelector(".message");
    this.progress = document.querySelector("progress");
    this.java = new Java();
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
    if(Dev) return this.startLauncher();
    this.setStatus(`Recherche de mises à jour`);
    
    const manifest = await fetch(manifestUrl).then(res => res.json());
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
    config.config().then(res => {
      if ((res.maintenance) == "on"){
        return this.shutdown(res.maintenance_message);
      }
      this.javaCheck();
    }).catch( err => {
      console.log("impossible de charger le config.json");
      console.log(err);
      return this.shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
    })
  }


  async javaCheck(){
    config.config().then(res => {
      this.setStatus("Vérification de Java");
    
    if(!["win32", "darwin", "linux"].includes(process.platform))
    return this.shutdown("System d'exploitation non supporté");
    this.startLauncher();

    }).catch( err => {
      console.log("impossible de charger le config.json");
      console.log(err);
      return this.shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
    })  
  }
  
  startLauncher(){
    this.setStatus(`Démarrage du launcher`);
     nw.Window.open("app/launcher.html", {
      "title": "Arche Launcher",
      "width": 980,
      "height": 552,
      "min_width": 980,
      "min_height": 552,
      "frame": (process.platform == "win32") ? false : true,
      "position": "center",
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
