const { config, auth } = require('./assets/js/utils.js');
const { MCAuth, MCLaunch } = require('emc-core-luuxis');
const launcher = new MCLaunch;
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

config.fetch().then(res => {

let opts = {
    url: res.game_url,
    overrides: {
        detached: false
    },
    authorization: MCAuth.auth("username", ""),
    root: dataDirectory + "/" + res.dataDirectory,
    version: res.game_version,
    forge: res.game_version + "-forge-" + res.forge_version,
    memory: {
        max: "1G",
        min: "1G"
    }
}

launcher.launch(opts);
})
