const AutoUpdater = require("nw-autoupdater-luuxis");
const Downloader = require('nodejs-file-downloader');
const decompress = require('decompress');
const pkg = require("../package.json");
const fs = require('fs');

const url = pkg.url.replace('{user}', pkg.user);
const manifestUrl = url + "/launcher/package.json";

const { config, compare } = require('./assets/js/utils.js');
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

const win = nw.Window.get();
const Dev = (window.navigator.plugins.namedItem('Native Client') !== null);

const splash = document.querySelector(".splash");
const splashMessage = document.querySelector(".splash-message");
const splashAuthor = document.querySelector(".splash-author");
const message = document.querySelector(".message");
const progress = document.querySelector("progress");
document.addEventListener('DOMContentLoaded', () => { startAnimation() });

async function startAnimation(){
  await sleep(100);
  document.querySelector("#splash").style.display = "block";
  await sleep(500);
  splash.classList.add("opacity");
  await sleep(500);
  splash.classList.add("translate");
  splashMessage.classList.add("opacity");
  splashAuthor.classList.add("opacity");
  message.classList.add("opacity");
  await sleep(1000);
  checkUpdate();
}

async function checkUpdate(){
  if(Dev) return javaCheck();
  
  setStatus(`Recherche de mises à jour`);
  const manifest = await fetch(manifestUrl).then(res => res.json());
  const update = await updater.checkNewVersion(manifest);
  if(!update) return maintenanceCheck();

  updater.on("download", (dlSize, totSize) => {
    setProgress(dlSize, totSize);
  });
  updater.on("install", (dlSize, totSize) => {
    setProgress(dlSize, totSize);
  });

  toggleProgress();
  setStatus(`Téléchargement de la mise à jour`);
  const file = await updater.download(manifest);
  setStatus(`Décompression de la mise à jour`);
  await updater.unpack(file);
  toggleProgress();
  setStatus(`Redémarrage`);
  await updater.restartToSwap();
}
  
async function maintenanceCheck(){    
  config.config().then(res => {
    if ((res.maintenance) == "on"){
      return shutdown(res.maintenance_message);
    }
    javaCheck();
  }).catch( err => {
    console.log("impossible de charger le config.json");
    console.log(err);
    return shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
  })
}


async function javaCheck(){
  config.config().then(res => {
    config.java().then(java => {
      setStatus("Vérification de Java");
      
      if(!["win32", /*"darwin",*/ "linux"].includes(process.platform))return shutdown("System d'exploitation non supporté");
        
        
      if (compare(res.game_version, "1.17") == 1){
        if(["win32"].includes(process.platform)){
          var url = java.jre16.windows.url
        } else if(["darwin"].includes(process.platform)){
          var url = java.jre16.mac.url
        } else if(["linux"].includes(process.platform)){
          var url = java.jre16.linux.url
        }
      } else {
        if(["win32"].includes(process.platform)){
          var url = java.jre8.windows.url
        } else if(["darwin"].includes(process.platform)){
          var url = java.jre8.mac.url
        } else if(["linux"].includes(process.platform)){
          var url = java.jre8.linux.url
        }
      }
      if(!fs.existsSync(dataDirectory + "/" + res.dataDirectory + "/runtime/java/")) {
        const downloader = new Downloader({
          url: url,
          directory: dataDirectory + "/" + res.dataDirectory + "/runtime/",
          fileName: "java.tar.gz",
          cloneFiles: false,
          onProgress:function(percentage){
              setStatus("Téléchargement de Java </br>" + percentage + "%")
          }     
        })
        try {
          downloader.download().then(err => {
          setStatus("Décompression de Java")
          decompress(dataDirectory + "/" + res.dataDirectory + "/runtime/" + "java.tar.gz", dataDirectory + "/" + res.dataDirectory + "/runtime/java/").then(err => {
            fs.unlinkSync(dataDirectory + "/" + res.dataDirectory + "/runtime/" + "java.tar.gz")
            startLauncher();
          })
        })
        } catch (error) {
          return shutdown("Une erreur est survenue,<br>veuillez réessayer ultérieurement.");
        }
      } else {
        startLauncher();
      }
    }).catch( err => {
      console.log("impossible de charger le jre-download.json");
      console.log(err);
      return shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
    })
  }).catch( err => {
    console.log("impossible de charger le config.json");
    console.log(err);
    return shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
  })  
}
  
function startLauncher(){
  setStatus(`Démarrage du launcher`);
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

function shutdown(text){
  setStatus(`${text}<br>Arrêt dans 5s`);
  let i = 4;
  setInterval(() => {
    setStatus(`${text}<br>Arrêt dans ${i--}s`);
    if(i < 0) win.close();
  }, 1000);
}

function setStatus(text){
  message.innerHTML = text;
}

function toggleProgress(){
  if(progress.classList.toggle("show")) setProgress(0, 1);
}

function setProgress(value, max){
  progress.value = value;
  progress.max = max;
}


function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}

