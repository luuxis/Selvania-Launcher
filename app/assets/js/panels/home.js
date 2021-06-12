const { config, auth, status } = require('./assets/js/utils.js');
const { MCLaunch, MCAuth } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const launcher = new MCLaunch;
require('nw.gui').Window.get().showDevTools();

config.info().then(config => {
    status.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        console.log(state.raw.vanilla.raw.players.online + "/" + state.raw.vanilla.raw.players.max);
    }).catch((error) => {
        console.log("Server is offline")
    })
})


function play(){
    config.config().then(config => {
        if (auth.isLogged()){
            document.querySelector(".play-btn").disabled = true;


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
                        max: "1G",
                        min: "1G"
                    }
                }
                launcher.launch(opts);


                launcher.on('debug', (e) => console.log("[DEBUG]" + e));
                launcher.on('data', (e) => console.log("[DATA]" + e));
                launcher.on('download-status', (e) => console.log("[DOWNLOAD][emc-core-luuxis]: [" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")"));
                launcher.on('close', () => console.log("Le jeux est fermer."));
                launcher.on('error', (e) => console.log("[ERROR]" + e));
        } else {
            window.location.href = "../launcher.html"
        }
    })
}
