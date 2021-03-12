'use strict';

import Downloader from "./lib/Downloader.js";
import LZMA from "./lib/LZMA.js";
import Java from "./lib/Java.js";

const AutoUpdater = require("nw-autoupdater-luuxis");
const pkg = require("../package.json");
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });
const { join } = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

let win = nw.Window.get();

let isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Splash {
  constructor(){
    if(localStorage.getItem("theme") == "white") document.children[0].classList.toggle("theme-white");
    else document.children[0].classList.toggle("theme-dark");
    this.splash = document.querySelector(".splash");
    this.splashMessage = document.querySelector(".splash-message");
    this.splashAuthor = document.querySelector(".splash-author");
    this.message = document.querySelector(".message");
    this.progress = document.querySelector("progress");
    this.java = new Java();
    if(localStorage.getItem(".hariona") == null) localStorage.setItem(".hariona",  join(process.platform == 'win32' ? process.env.APPDATA : process.platform == "darwin" ? join(process.env.HOME, "Library", "Application Support") : process.env.HOME, process.platform == "darwin" ? "hariona" : ".hariona").replace(/\\/g, "/"));
    this.javaDefaultPath = localStorage.setItem("java", join(localStorage.getItem(".hariona"), "runtime", "java", "bin", process.platform == "win32" ? "javaw.exe" : "java"));
    if(localStorage.getItem("java") == null) localStorage.setItem("java", this.javaDefaultPath);
    if(localStorage.getItem("theme") == null) localStorage.setItem("theme", "dark");
    var self = this;
    document.addEventListener('DOMContentLoaded', () => { self.startAnimation() });
  }

  async startAnimation(){
    let splashes = [
      { "message": "Je veux dormir", "author": "Autoupdate inspiré de paladium."},
      { "message": "Je....Je.... vie...", "author": "Autoupdate inspiré de paladium."}
    ];
    if(localStorage.getItem("theme") == "white"){
      splashes.push(
      );
    }
    let splash = splashes[Math.floor(Math.random() * splashes.length)];
    this.splashMessage.textContent = splash.message;
    this.splashAuthor.children[0].textContent = splash.author;
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
    let maintenance = await fetch("https://luuxis.legtux.org/home/luuxis/launcher/package.json").then(res => res.json());
    if((maintenance.maintenance) == "on") return this.shutdown("Le serveur est en maintenance merci de bien vouloir essayer ultérieurement");
    this.javaCheck();
  }

  async javaCheck(){
    this.setStatus("Vérification de Java");

    if(!["win32", "darwin", "linux"].includes(process.platform))
      return this.shutdown("System d'exploitation non supporté");

    if(localStorage.getItem("java") != this.javaDefaultPath && fs.existsSync(localStorage.getItem("java"))) return this.startLauncher();

    let bundle = await this.java.getBundle();
    let todownload = await this.java.checkBundle(bundle);

    if(todownload.length > 0){
      this.toggleProgress();
      this.setStatus("Téléchargement de Java");

      let downloader = new Downloader();
      let totsize = this.java.getTotalSize(todownload);

      downloader.on("progress", (DL, totDL) => {
        this.setProgress(DL, totDL);
      });

      await new Promise((ret) => {
        downloader.on("finish", ret);

        downloader.multiple(todownload, totsize, 10);
      });

      this.setProgress(0, 1);

      this.setStatus("Décompression de Java");

      for(let i=0; i<bundle.length; i++){
        let file = bundle[i];
        if(file.lzma){
          console.log(`Decompressing ${file.path}`);
          let content = fs.readFileSync(file.path);
          let decompressed = await LZMA.decompress(content);
          fs.writeFileSync(file.path, decompressed, { encoding: "utf8", mode: 0o755 });
        } if(process.platform == "darwin" && file.executable){
          console.log(`Whitelisting from Apple Quarantine ${file.path}`);
          let id = String.fromCharCode.apply(null, execSync(`xattr -p com.apple.quarantine "${file.path}"`));
          execSync(`xattr -w com.apple.quarantine "${id.replace("0081;", "00c1;")}" "${file.path}"`);
        }
        this.setProgress(i+1, bundle.length);
      }

      this.toggleProgress();
    }

    this.startLauncher();
  }

  startLauncher(){
    nw.Window.open("app/launcher.html", {
      "title": "Hariona Launcher",
      "width": 1280,
      "height": 720,
      "min_width": 1280,
      "min_height": 720,
      "resizable": false,
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

new Splash();

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}
