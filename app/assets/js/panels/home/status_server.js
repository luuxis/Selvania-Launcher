const Gamedig = require('gamedig')
const { config } = require('./assets/js/utils.js');

let status_var = config.info().then(config => {
    Gamedig.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        let status_json = state.raw.vanilla
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
       }).catch((err) => {
           console.log(err)
           document.querySelector(".player-connect-number").innerHTML = "Le serveur est actuellement ferme.";
    })

    StatusServerAutoRefresh()

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