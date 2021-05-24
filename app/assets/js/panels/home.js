const { config, auth } = require('./assets/js/utils.js');
const { MCAuth, MCLaunch } = require('emc-core-luuxis');
const net = require('net');
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
function setStatus(){
config.info().then(info => {
    let player = document.querySelector(".etat-text .text");
    let desc = document.querySelector(".server-text .desc");
    let online = document.querySelector(".etat-text .online");

    let start = new Date();
    let client = net.connect(25565, info.ip_server, () => {
      client.write(Buffer.from([ 0xFE, 0x01 ]));
    });

    client.setTimeout(5 * 1000);

    client.on('data', (data) => {
      if (data != null && data != '') {
        desc.innerHTML = `<span class="green">Opérationnel</span> - ${Math.round(new Date() - start)}ms`;
        if(online.classList.contains("off")) online.classList.toggle("off");
        var infos = data.toString().split("\x00\x00\x00");
        if (infos[4]) player.textContent = infos[4].replace(/\u0000/g, '');
      }
      client.end();
    });

    client.on('timeout', () => {
      desc.innerHTML = `<span class="red">Fermé</span> - 0ms`;
      if(!online.classList.contains("off")) online.classList.toggle("off");
      player.textContent = 0;
      client.end();
    });

    client.on('err', (err) => {
      desc.innerHTML = `<span class="red">Fermé</span> - 0ms`;
      if(!online.classList.contains("off")) online.classList.toggle("off");
      player.textContent = 0;
      console.error(err);
    });
  }).catch( err => {
    console.log("impossible de charger le config.json");
    console.log(err);
    return this.shutdown("Aucune connexion internet détectée,<br>veuillez réessayer ultérieurement.");
  })
}