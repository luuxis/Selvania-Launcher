const MSMC = require("./microsoft");

const defaultProperties = {
    width: 500,
    height: 650,
    resizable: false,
    title: "Microsoft Login"
};

module.exports.Launch = (token, callback, updates = () => { }, Windowproperties = defaultProperties) => {
    var redirect = MSMC.CreateLink(token);
    var loading = false;
    nw.Window.open(redirect, Windowproperties, function (new_win) {
        new_win.on('close', function () {
            if (!loading) {
                updates({ type: "Canceled" });
            }
        })
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
    const token = {
        client_id: "00000000402b5328",
        redirect: "https://login.live.com/oauth20_desktop.srf",
        prompt: prompt,
    };
    this.Launch(token, callback, updates, properties);
};