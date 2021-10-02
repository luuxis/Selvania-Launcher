const Gamedig = require('gamedig')
const { config } = require('./assets/js/utils.js');

config.info().then(config => {
    Gamedig.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        var status_json = state.raw.vanilla
        document.querySelector(".player-connect").innerHTML = ""
        if(status_json.raw.players.online === 0){
            document.querySelector(".player-connect-number").innerHTML = `Aucun joueur actuellement connect\u00e9`;
        } else if (status_json.raw.players.online === 1){
            document.querySelector(".player-connect-number").innerHTML = `${status_json.raw.players.online} joueur actuellement connect\u00e9`;
            head(status_json)
        } else {
            document.querySelector(".player-connect-number").innerHTML = `${status_json.raw.players.online} joueurs actuellement connect\u00e9s`;
            head(status_json)
        }
       }).catch((err) => {
           console.log(err)
           document.querySelector(".player-connect-number").innerHTML = "Le serveur est actuellement ferme.";
    })
})


function head(status_json) {
    for (let i = 0; i < status_json.raw.players.sample.length; i++) { 
        var player = status_json.raw.players.sample[i].name
        document.querySelector(".player-connect").innerHTML += `<div><img class="users" src="https://mc-heads.net/head/${player}"><b class="users"> ${player}</b></div>`
    }
}