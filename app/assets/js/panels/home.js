const { config, auth, status_server } = require('./assets/js/utils.js');
const { MCLaunch, MCAuth } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const launcher = new MCLaunch;
require('nw.gui').Window.get().showDevTools();

function ram() {
    document.querySelector('.ram').onchange = function() {
        document.getElementById("ram-text").innerHTML = "Ram " + this.value + "G";
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
        document.getElementById("online").innerHTML = status_json.raw.players.online + "/" + status_json.raw.players.max;
        console.log(status_json.raw.players.online + "/" + status_json.raw.players.max);
    }).catch((error) => {
        document.getElementById("online").innerHTML = "Le serveur est fermer";
    })
})


function play(){
    config.config().then(config => {
            document.querySelector(".play-btn").disabled = true;
            const max_ram = document.getElementById("ram").value
            


                let opts = {
                    url: config.game_url,
                    overrides: {
                        detached: false
                    },
                    authorization: MCAuth.auth("username", ""),
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


                launcher.on('debug', (e) => console.log("[DEBUG]" + e));
                launcher.on('data', (e) => console.log("[DATA]" + e));
                launcher.on('download-status', (e) => console.log("[DOWNLOAD][emc-core-luuxis]: [" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")"));
                launcher.on('close', () => console.log("Le jeux est fermer."));
                launcher.on('error', (e) => console.log("[ERROR]" + e));
    })
}
