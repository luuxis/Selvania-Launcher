/*Copyright 2021 Hanro50
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
End license text.*/

try {
    var FETCH = require("node-fetch");
} catch (er) {
    try {
        FETCH = fetch;
    } catch { }
}

if (!FETCH) {
    console.warn(
        "MSMC: Could not automatically determine which version of fetch to use.\nMSMC: Please use 'setFetch' to set this property manually"
    );
}

/** We need an http server of some description to get the callback */
const http = require("http");

module.exports.setFetch = (fetchIn) => {
    FETCH = fetchIn;
};

module.exports.CreateLink = function (token) {
    //console.log(token);
    return (
        "https://login.live.com/oauth20_authorize.srf" +
        "?client_id=" +
        token.client_id +
        "&response_type=code" +
        "&redirect_uri=" +
        encodeURIComponent(token.redirect) +
        "&scope=XboxLive.signin%20offline_access" +
        (token.prompt ? "&prompt=" + token.prompt : "")
    );
};

/**
 * @param {URLSearchParams} Params
 * @returns
 */
module.exports.MSCallBack = async function (code, MStoken, callback, updates = () => { }) {
    if (!FETCH) {
        console.error(
            "MSMC: Could not automatically determine which version of fetch to use.\nMSMC: Please use 'setFetch' to set this property manually"
        );
        return;
    }
    if (typeof FETCH !== "function") {
        console.error("MSMC: The version of fetch provided is not a function!");
        return;
    }

    updates({ type: "Starting" });

    //console.log(Params); //debug
    var percent = 100 / 8;
    function loadBar(number, asset) {
        updates({ type: "Loading", data: asset, percent: number });
    }

    function error(reason) {
        updates({ type: "Error", data: reason });
    }

    function webCheck(response) {
        if (response.status > 400) {
            updates({ type: "Rejection", response: response });
        }
    }

    loadBar(percent * 1, "Getting Login Token");
    var MS = await (
        await FETCH("https://login.live.com/oauth20_token.srf", {
            method: "post",
            body:
                "client_id=" +
                MStoken.client_id +
                "&code=" +
                code +
                "&grant_type=authorization_code" +
                "&redirect_uri=" +
                MStoken.redirect +
                (MStoken.clientSecret ? "&client_secret=" + MStoken.clientSecret : ""),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
    ).json();
    //console.log(MS); //debug
    webCheck(MS);

    loadBar(percent * 2, "Logging into Xbox Live");
    var rxboxlive = await FETCH("https://user.auth.xboxlive.com/user/authenticate", {
        method: "post",
        body: JSON.stringify({
            Properties: {
                AuthMethod: "RPS",
                SiteName: "user.auth.xboxlive.com",
                RpsTicket: "d=" + MS.access_token, // your access token from step 2 here
            },
            RelyingParty: "http://auth.xboxlive.com",
            TokenType: "JWT",
        }),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    //console.log(rxboxlive); //debug
    webCheck(rxboxlive);
    var token = await rxboxlive.json();

    //console.log(token); //debug

    var XBLToken = token.Token;
    var UserHash = token.DisplayClaims.xui[0].uhs;
    loadBar(percent * 3, "Getting a Xbox One Security Token");
    var rxsts = await FETCH("https://xsts.auth.xboxlive.com/xsts/authorize", {
        method: "post",
        body: JSON.stringify({
            Properties: {
                SandboxId: "RETAIL",
                UserTokens: [
                    XBLToken, // from above
                ],
            },
            RelyingParty: "rp://api.minecraftservices.com/",
            TokenType: "JWT",
        }),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    webCheck(rxsts);
    //console.log(rxsts) //debug
    var XSTS = await rxsts.json();

    //console.log(XSTS);
    loadBar(percent * 4, "Checking for errors");

    if (XSTS.XErr) {
        var reason = "Unknown reason";
        switch (XSTS.XErr) {
            case "2148916233": {
                reason = "The account doesn't have an Xbox account.";
                break;
            }
            case "2148916238": {
                reason =
                    "The account is a child (under 18) and cannot proceed unless the account is added to a Family by an adult. (FIX ME: This error should in theory never happen if the launcher's oauth token is set up correctly)";
                break;
            }
        }
        return error(reason);
    }

    loadBar(percent * 5, "Logging into Minecraft");
    var rlogin_with_xbox = await FETCH(
        "https://api.minecraftservices.com/authentication/login_with_xbox",
        {
            method: "post",
            body: JSON.stringify({
                identityToken: "XBL3.0 x=" + UserHash + ";" + XSTS.Token,
            }),
            headers: { "Content-Type": "application/json", Accept: "application/json" },
        }
    );
    webCheck(rlogin_with_xbox);

    loadBar(percent * 6, "Checking game ownership");
    var MCauth = await rlogin_with_xbox.json();
    //console.log(MCauth) //debug
    var rmcstore = await FETCH("https://api.minecraftservices.com/entitlements/mcstore", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + MCauth.access_token,
        },
    });

    var MCPurchaseCheck = await rmcstore.json();
    //console.log(MCPurchaseCheck) //debug
    if (MCPurchaseCheck.items.length < 1) {
        return error("You do not seem to own minecraft.");
    }

    loadBar(percent * 7, "Fetching player profile");
    var r998 = await FETCH("https://api.minecraftservices.com/minecraft/profile", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + MCauth.access_token,
        },
    });

    var profile = await r998.json();
    //console.log(profile) //debug
    if (profile.error) {
        return error("You do not seem to have a minecraft account.");
    }

    loadBar(100, "Done!");
    callback({ access_token: MCauth.access_token, profile: profile });
};

//This needs to be apart or we could end up with a memory leak!
var app;
/**
 * @param {(URLCallback:URLSearchParams,App:any)=>void} callback
 * This is needed for the oauth 2 callback
 */
function setCallback(callback) {
    try {
        if (app) {
            app.close();
        }
    } catch { }
    app = http.createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Thank you!");
        app.close();
        //console.log(req.url);
        //console.log(req.url.substr(req.url.indexOf("?") + 1))
        if (req.url.includes("?")) {
            const urlParams = new URLSearchParams(req.url.substr(req.url.indexOf("?") + 1));
            //console.log(Array.from(urlParams.keys()));
            callback(urlParams, app);
        }
    });
    return app.listen();
}
module.exports.MSLogin = function (token, callback, updates) {
    setCallback((Params) => this.MSCallBack(Params.get("code"), token, callback, updates));
    return new Promise((resolve) =>
        app.addListener("listening", () => {
            if (String(token.redirect).startsWith("/")) {
                token.redirect = String(token.redirect).substr(1);
            }
            token.redirect =
                "http://localhost:" +
                app.address().port +
                "/" +
                (token.redirect ? token.redirect : "");
            resolve(this.CreateLink(token));
        })
    );
};

module.exports.getElectron = () => {
    return require("./electron");
};

module.exports.getNWjs = () => {
    return require("./nwjs");
};
/**ES6 compatibility */
module.exports.default = module.exports