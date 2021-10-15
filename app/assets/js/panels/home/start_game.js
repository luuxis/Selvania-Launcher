const { MCLaunch } = require('emc-core-luuxis');
const launcher = new MCLaunch();
const msmc = require("msmc");
const win = nw.Window.get();
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const { auth, config } = require('./assets/js/utils.js');


document.querySelector(".play-btn").addEventListener("click", () => {
    document.querySelector(".play-btn").style.display = "none"
    document.querySelector(".progress-bar").style.display = "block"
    config.config().then(config => {
        const config_launcher = require(dataDirectory + "/" + config.dataDirectory + "/config.json")
        

        if ((config.forge_version) == ""){
            var version = config.game_version
        } else {
            var version = config.forge_version
        }

        if(config_launcher.Settings.Java.Directory === null){
            if(["win32"].includes(process.platform)){
                var java = "/bin/java.exe"
            } else if(["darwin"].includes(process.platform)){
                var java = "/Contents/Home/bin/java"
            } else if(["linux"].includes(process.platform)){
                var java = "/bin/java"
            }
            var Java = `${dataDirectory}/${config.dataDirectory}/runtime/java${java}`
        } else {
            var Java = config_launcher.Settings.Java.Directory
        }

        if(auth.user == undefined){
            if(config_launcher.Login.UserConnect == "Microsoft"){
                var authenticator = msmc.getMCLC().getAuth(config_launcher.Login.Account.Microsoft.User)
            } else if(config_launcher.Login.UserConnect == "Mojang"){
                var authenticator = config_launcher.Login.Account.Mojang.User
            } else if(config_launcher.Login.UserConnect == "Crack") {
                var authenticator = config_launcher.Login.Account.Crack.User 
            }
        } else {
            var authenticator = auth.user
        }
        
        let opts = {
            url: config.game_url,
            overrides: {
                detached: false
            },
            authorization: authenticator,
            root: `${dataDirectory}/${config.dataDirectory}`,
            javaPath: Java,
            version: config.game_version,
            forge: version,
            checkFiles: true,
            memory: {
                max: `${config_launcher.Settings.Java.RamMax}M`,
                min: `${config_launcher.Settings.Java.RamMin}M`
            }
        }

        launcher.launch(opts);
        
        launcher.on('debug', (e) => {
            console.log("[DEBUG]" + e)
        })

        launcher.on('data', (e) => {
            console.log("[DATA]" + e)
        })

        launcher.on('error', (e) => {
            console.log("[ERROR]" + e)
        })

        launcher.on('verification-status', (e) => {
            console.log(`[V\u00e9rification][emc-core-luuxis]: ${e.name} (${e.current}/${e.total})`)
            document.querySelector(".progress-bar").value = e.current;
            document.querySelector(".progress-bar").max = e.total;
        })
        
        launcher.on('download-status', (e) => {
            console.log(`[DOWNLOAD][emc-core-luuxis]: [${e.type}] ${e.name} (${e.downloadedBytes}/${e.bytesToDownload})`)
            document.querySelector(".progress-bar").value = e.downloadFiles;
            document.querySelector(".progress-bar").max = e.filesToDownload;
        })

        launcher.on('launch', (e) => {
            if(config_launcher.Launcher.CloseLauncher === true){
                win.hide();
            }
        });
        
        launcher.on('close', (e) => {
            if(config_launcher.Launcher.CloseLauncher === true){
                win.show();
                win.focus();
                win.setShowInTaskbar(true);
            }
            document.querySelector(".play-btn").style.display = "block"
            document.querySelector(".progress-bar").style.display = "none"
        })
    })
})