const { config, status_server, crypt } = require('./assets/js/utils.js');
const { MCLaunch, MCAuth } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const launcher = new MCLaunch;

function ram() {
    document.querySelector('.ram').onchange = function() {
        document.getElementById("ram-text").innerHTML = "M\u00e9moire vive " + this.value + " Go";
    }
}


config.info().then(config => {
    ram()
    status_server.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        status_json = state.raw.vanilla;
        document.getElementById("online").innerHTML = status_json.raw.players.online;
        console.log(status_json.raw.players.online);
    }).catch((error) => {
        document.getElementById("online").innerHTML = "Le serveur est fermé.";
    })
})

function play(){
    config.config().then(config => {
        document.querySelector(".config").style.display = "none";
        document.querySelector(".info-progress").style.display = "contents";
        const max_ram = document.getElementById("ram").value
        const login = require(dataDirectory + "/" + config.dataDirectory + "/login.json") 
        const password = crypt.decrypt(login.mojang.password);


        let opts = {
            url: config.game_url,
            overrides: {
                detached: false
            },
            authorization: MCAuth.auth(login.mojang.user, password),
            root: dataDirectory + "/" + config.dataDirectory,
            version: config.game_version,
            forge: config.forge_version,
            checkFiles: true,
            memory: {
                max: max_ram + "G",
                min: "1G"
            }
        }
        launcher.launch(opts);

        launcher.on('debug', (e) => {
            console.log("[DEBUG]" + e);
            document.getElementById("bar-txt").innerHTML = "[DEBUG]" + e
          });

          launcher.on('data', (e) => {
            console.log("[DATA]" + e);
            document.getElementById("bar-txt").innerHTML = "[DATA]" + e
          });
          launcher.on('error', (e) => {
            console.log("[ERROR]" + e);
            document.getElementById("bar-txt").innerHTML = "[ERROR]" + e
          });
      
          launcher.on('verification-status', (e) => {
            console.log("[DOWNLOAD][emc-core-luuxis]: " + e.name + " (" + e.current + "/" + e.total + ")");
            document.getElementById("bar-txt").innerHTML = "[VERIFICATION] " + e.name + " (" + e.current + "/" + e.total + ")";
            progressBar = document.getElementById("progress-bar")
            progressBar.max = e.total;
            progressBar.value = e.current;
          });
      
          launcher.on('download-status', (e) => {
            console.log("[DOWNLOAD][emc-core-luuxis]: [" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")");
            document.getElementById("bar-txt").innerHTML = "[DOWNLOAD][" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")";
            progressBar = document.getElementById("progress-bar")
            progressBar.max = e.bytesToDownload;
            progressBar.value = e.downloadedBytes;
          });
      
          launcher.on('launch', (e) => {
            document.getElementById("bar-txt").innerHTML = "En route pour votre aventure..."
          });

          launcher.on('close', () => {
            document.querySelector(".play-btn").style.display = "block";
            document.querySelector(".info-progress").style.display = "none";
          });
    })
}
