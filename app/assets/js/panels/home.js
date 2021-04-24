const { config, auth } = require('./assets/js/utils.js');
const { MCAuth, MCLaunch } = require('emc-core-luuxis');
const launcher = new MCLaunch;

function play(){
    config.fetch().then(res => {
        if (auth.isLogged()){
            document.querySelector(".play-btn").disabled = true;
            
            let opts = {
                url: res.game_url,
                overrides: {
                    detached: false
                },
                authorization: MCAuth.auth("username", ""),
                root: process.env.APPDATA + res.dataDirectory,
                version: res.game_version,
                forge: res.game_version + "-forge-" + res.forge_version,
                memory: {
                    max: "6G",
                    min: "4G"
                }
            }
            
            launcher.launch(opts);
            
            launcher.on('debug', (e) => event.reply("log", "[DEBUG]" + e));
            launcher.on('data', (e) => event.reply("log", "[DATA]" + e));
            launcher.on('error', (e) => {
                event.reply("log", "[ERROR]" + e)
                event.reply("error");
            });
        } else {
            window.location.href = "../launcher.html"
        }
    })
}
