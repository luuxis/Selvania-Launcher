const { config, auth, status_server } = require('./assets/js/utils.js');
const { MCAuth, MCLaunch } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const launcher = new MCLaunch;
require('nw.gui').Window.get().showDevTools();
    

function play(){
    config.fetch().then(res => {
        if (auth.isLogged()){
            document.querySelector(".play-btn").disabled = true;


                let opts = {
                    url: res.game_url,
                    overrides: {
                        detached: false
                    },
                    authorization: auth.authenticator,
                    root: dataDirectory + "/" + res.dataDirectory,
                    version: res.game_version,
                    forge: res.forge_version,
                    checkFiles: false,
                    memory: {
                        max: "1G",
                        min: "1G"
                    }
                }
                launcher.launch(opts);


                launcher.on('debug', (e) => console.log("[DEBUG]" + e));
                launcher.on('data', (e) => console.log("[DATA]" + e));
            launcher.on('error', (e) => {
                console.log("[ERROR]" + e)
            });
        } else {
            window.location.href = "../launcher.html"
        }
    })
}

function statusserver() {
    status_server.init('193.70.80.225', 25565, function() {
        if (status_server.online) {
            console.log("on")
            $("#status-server-players").html(status_server.current_players);
            $("#status-server-latency").html(status_server.latency);

            $("#server-total-players").html(status_server.current_players + " <i class=\"online\"></i>");
        }
        else
        console.log("off")
            $("#server-total-players").html("0 <i class=\"offline\"></i>");
    });
}
statusserver()