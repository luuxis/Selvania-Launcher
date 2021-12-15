const { config } = require('./assets/js/utils.js');
const { status } = require('minecraft-java-core');

config.info().then(async (config)  => {
    let StatusServer = await status.StatusServer(config.ip_server, parseInt(config.port_server))
    
    if(!StatusServer){
        document.querySelector(".player-connect-number").innerHTML = "Le serveur est actuellement ferme.";
        document.querySelector(".player-connect").innerHTML = "Le serveur est actuellement ferme.";
    } else {
        let status_json = StatusServer.raw.vanilla
        document.querySelector(".player-connect").innerHTML = ""
        if(status_json.raw.players.online === 0){
            document.querySelector(".player-connect-number").innerHTML = `Aucun joueur actuellement connecté`;
            document.querySelector(".player-connect").innerHTML = `Aucun joueur actuellement connecté`;
        } else if (status_json.raw.players.online === 1){
            document.querySelector(".player-connect-number").innerHTML = `${status_json.raw.players.online} joueur actuellement connecté`;
            head(status_json)
        } else {
            document.querySelector(".player-connect-number").innerHTML = `${status_json.raw.players.online} joueurs actuellement connectés`;
            head(status_json)
        }
    }
})


function head(status_json) {
    for (let i = 0; i < status_json.raw.players.sample.length; i++) { 
        let player = status_json.raw.players.sample[i].name
        document.querySelector(".player-connect").innerHTML += `<div><img class="users" src="https://mc-heads.net/head/${player}"><b class="users"> ${player}</b></div>`
    }
}


function StatusServerAutoRefresh() {
    config.config().then(config => {
        const config_var = require(`${dataDirectory}/${config.dataDirectory}/config.json`)
        if(config_var.Launcher.StatusServerAutoRefresh === true){
          setInterval(function(){
            status_var
          }, 600000)
        }
    })
}