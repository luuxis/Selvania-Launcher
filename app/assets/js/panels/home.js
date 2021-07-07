const { config, status_server, microsoft } = require('./assets/js/utils.js');
const { MCLaunch, MCAuth } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const launcher = new MCLaunch;

function ram() {
    document.querySelector('.ram').onchange = function() {
        document.getElementById("ram-text").innerHTML = "M\u00e9moire vive " + this.value + " Go";
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
        player = "luuxis"
        document.getElementById("online").innerHTML = status_json.raw.players.online + " joueur(s) actuellement connect\u00e9(s)";
        console.log(status_json.raw.players.online + " joueur(s) actuellement connect\u00e9(s)");
        for (let pas = 0; pas < status_json.raw.players.online; pas++) { 
          player = status_json.raw.players.sample[pas].name
          document.getElementById("users").innerHTML += `<img src="https://mc-heads.net/head/${player}" class="users"><b class="users"> ${player}</b></br>`
        }
       }).catch((error) => {
        document.getElementById("online").innerHTML = "Le serveur est ferme.";
    })
})

function web_site(){
  config.info().then(info => {
    nw.Shell.openExternal(info.site)
  })
}

function discord(){
  config.info().then(info => {
    nw.Shell.openExternal(info.discord)
  })
}

function youtube(){
  config.info().then(info => {
    nw.Shell.openExternal(info.youtube)
  })
}

function play(){
    config.config().then(config => {
        document.querySelector(".config").style.display = "none";
        document.querySelector(".info-progress").style.display = "block";
        const max_ram = document.getElementById("ram").value
        const min_ram = "1" //max_ram - 1
        const login = require(dataDirectory + "/" + config.dataDirectory + "/account.json")

        if((login.user.type)  == "mojang") {
          account = login.user
        } else if ((login.user.type)  == "offline") {
          account = MCAuth.auth(login.user.pseudo)
        } else if ((login.user.type)  == "xbox") {
          account = microsoft.getMLC().getAuth(login.user.call)
        }


        let opts = {
            url: config.game_url,
            overrides: {
                detached: false
            },
            authorization: account,
            root: dataDirectory + "/" + config.dataDirectory,
            version: config.game_version,
            forge: config.forge_version,
            checkFiles: true,
            memory: {
                max: max_ram + "G",
                min: min_ram + "G"
            }
        }
        launcher.launch(opts);

        launcher.on('debug', (e) => {
            console.log("[DEBUG]" + e);
            //document.getElementById("bar-txt").innerHTML = "Verification des ressources."
          });

          launcher.on('data', (e) => {
            console.log("[DATA]" + e);
            //document.getElementById("bar-txt").innerHTML = "Verification des ressources."
          });
          launcher.on('error', (e) => {
            console.log("[ERROR]" + e);
            document.getElementById("bar-txt").innerHTML = "[ERROR]" + e
          });
      
          launcher.on('verification-status', (e) => {
            console.log("[vérification][emc-core-luuxis]: " + e.name + " (" + e.current + "/" + e.total + ")");
            document.getElementById("bar-txt").innerHTML = "V\u00e9rification des ressources..."
            progressBar = document.getElementById("progress-bar")
            progressBar.max = e.total;
            progressBar.value = e.current;
          });
      
          launcher.on('download-status', (e) => {
            console.log("[DOWNLOAD][emc-core-luuxis]: [" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")");
            document.getElementById("bar-txt").innerHTML = "T\u00e9l\u00e9chargement des ressources..."
            progressBar = document.getElementById("progress-bar")
            progressBar.max = e.bytesToDownload;
            progressBar.value = e.downloadedBytes;
          });
      
          launcher.on('launch', (e) => {
            let win = nw.Window.get();
            win.hide();
          });

          launcher.on('close', () => {
            let win = nw.Window.get();
            win.show();
            win.focus();
            win.setShowInTaskbar(true);
            document.querySelector(".config").style.display = "block";
            document.querySelector(".info-progress").style.display = "none";
          });
    })
}
