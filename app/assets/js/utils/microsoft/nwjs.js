const MSMC = require("./microsoft");
const config = require ("../config.js")

const defaultProperties = {
    "title": "Se connecter à votre compte Microsoft",
    "width": 1000,
    "height": 620,
    "frame": true,
    "position": "center",
    "icon": "app/assets/images/logo/microsoft.png"
};

module.exports.Launch = (token, callback, updates = () => { }, Windowproperties = defaultProperties) => {
    var redirect = MSMC.CreateLink(token);
    var loading = false;
    nw.Window.open(redirect, Windowproperties, function (new_win) {
        new_win.on('closed', () => {
            if(!code) code = "cancel";
            if(interval) clearInterval(interval);
            resolve(code);
          });
        new_win.on('loaded', function () {
            const loc = new_win.window.location.href;
            console.log(loc);
            if (loc.startsWith(token.redirect)) {
                const urlParams = new URLSearchParams(loc.substr(loc.indexOf("?") + 1)).get("code");
                try {
                    loading = false;
                    new_win.close(true);
                } catch {
                    console.error("Failed to close window!");
                }
                MSMC.MSCallBack(urlParams, token, callback, updates);
                return true;
            }
            return false;
        });
    });
}
module.exports.FastLaunch = (callback, updates = () => { }, prompt = "select_account", properties = defaultProperties) => {
    config.config().then(config => {
        const token = {
            client_id: config.microsoft_id,
            redirect: "https://login.live.com/oauth20_desktop.srf",
            prompt: prompt,
        };
        this.Launch(token, callback, updates, properties);   
    })
};