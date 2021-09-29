const status_server = require('gamedig')
const { config } = require('./assets/js/utils.js');

config.info().then(config => {
    status_server.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        status_json = state.raw.vanilla;
        document.getElementById("online").innerHTML = status_json.raw.players.online + " joueur(s) actuellement connect\u00e9(s)";
       }).catch((err) => {
        document.querySelector(".player-connect").innerHTML = "Le serveur est ferme.";
    })
})

// for (let i = 0; i < status_json.raw.players.online; i++) { 
//     player = status_json.raw.players.sample[i].name
//     document.querySelector(".player-connect").innerHTML += `<img src="https://mc-heads.net/head/${player}" class="users"><b class="users"> ${player}</b></br>`
//   }