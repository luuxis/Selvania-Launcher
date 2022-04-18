'use strict';
const AutoUpdater = require("nw-autoupdater-luuxis");
const pkg = nw.global.manifest.__nwjs_manifest;
import { config } from './utils.js';
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });

let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url
const manifestUrl = url + "/launcher/package.json";

let win = nw.Window.get();
let Dev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Splash {
    constructor() {
        this.splash = document.querySelector(".splash");
        this.splashMessage = document.querySelector(".splash-message");
        this.splashAuthor = document.querySelector(".splash-author");
        this.message = document.querySelector(".message");
        this.progress = document.querySelector("progress");
        document.addEventListener('DOMContentLoaded', () => this.startAnimation());
    }

    async startAnimation() {
        let splashes = [
            { "message": "Je... vie...", "author": "Knipe" },
            { "message": "Salut je suis du code.", "author": "Luuxis" }
        ];
        let splash = splashes[Math.floor(Math.random() * splashes.length)];
        this.splashMessage.textContent = splash.message;
        this.splashAuthor.children[0].textContent = "@" + splash.author;
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
        this.maintenanceCheck();
    }

    async maintenanceCheck() {
        nw.App.clearCache();
        if (Dev) return this.startLauncher();
        config.config().then(res => {
            if (res.maintenance) return this.shutdown(res.maintenance_message);
            else this.checkUpdate();
        }).catch(err => {
            console.log("impossible de charger le config.json");
            console.log(err);
            return this.shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
        })
    }

    async checkUpdate() {
        const manifest = await fetch(manifestUrl).then(res => res.json());
        const update = await updater.checkNewVersion(manifest);
        if (!update) return this.startLauncher();

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


    startLauncher() {
        this.setStatus(`Démarrage du launcher`);
        nw.Window.open("src/launcher.html", {
            "title": pkg.productName,
            "width": 1280,
            "height": 720,
            "min_width": 980,
            "min_height": 552,
            "frame": (process.platform == "win32") ? false : true,
            "position": "center",
            "icon": "src/assets/images/icon.png"
        });
        win.close();
    }

    shutdown(text) {
        this.setStatus(`${text}<br>Arrêt dans 5s`);
        let i = 4;
        setInterval(() => {
            this.setStatus(`${text}<br>Arrêt dans ${i--}s`);
            if (i < 0) win.close();
        }, 1000);
    }

    setStatus(text) {
        this.message.innerHTML = text;
    }

    toggleProgress() {
        if (this.progress.classList.toggle("show")) this.setProgress(0, 1);
    }

    setProgress(value, max) {
        this.progress.value = value;
        this.progress.max = max;
    }
}

new Splash();

function sleep(ms) {
    return new Promise((r) => { setTimeout(r, ms) });
}