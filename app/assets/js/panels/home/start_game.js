const {launch} = require('minecraft-java-core');
const launcher = new launch();
const msmc = require("msmc-luuxis");
const pkg = require('../package.json');
const win = nw.Window.get();
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const { auth, config } = require('./assets/js/utils.js');


document.querySelector(".play-btn").addEventListener("click", () => {
    document.querySelector(".play-btn").style.display = "none"
    document.querySelector(".info-download").style.display = "block"
    config.config().then(config => {
        const config_launcher = require(dataDirectory + "/" + config.dataDirectory + "/config.json")

        if(config.game_url === "" || config.game_url === undefined || config.game_url === null) {
            var url = `${pkg.url}/files/`
        } else {
            var url = config.game_url
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
            url: url,
            authorization: authenticator,
            path: `${dataDirectory}/${config.dataDirectory}`,
            version: config.game_version,
            detached: true,
            java: config.java,
            custom: config.custom,
            verify: config.verify,
            ignored: config.ignored,
            memory: {
                min: `${config_launcher.Settings.Java.RamMin}M`,
                max: `${config_launcher.Settings.Java.RamMax}M`
            }
        }

        launcher.launch(opts);
        
        launcher.on('progress', (DL, totDL) => {
            document.querySelector(".progress-bar").style.display = "block"
            document.querySelector(".info-download").innerHTML = `Téléchargement ${((DL / totDL) * 100).toFixed(0)}%`
            document.querySelector(".progress-bar").value = DL;
            document.querySelector(".progress-bar").max = totDL;
        });
        
        launcher.on('speed', (speed) => {
            console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
        })

        launcher.on('check', (e) => {
            document.querySelector(".info-download").innerHTML = `Vérification`
        })
        
        launcher.on('data', (e) => {
            console.log(e)
            if(config_launcher.Launcher.CloseLauncher === true){
                win.hide();
            }
            document.querySelector(".info-download").innerHTML = `Démarrage du jeu en cours`
        })
        
        launcher.on('close', (e) => {
            if(config_launcher.Launcher.CloseLauncher === true){
                win.show();
                win.focus();
                win.setShowInTaskbar(true);
            }
            document.querySelector(".progress-bar").style.display = "none"
            document.querySelector(".info-download").style.display = "none"
            document.querySelector(".info-download").innerHTML = `Vérification`
            document.querySelector(".play-btn").style.display = "block"
        })
    })
})