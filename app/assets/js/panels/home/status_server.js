const Gamedig = require('gamedig')
const { config } = require('./assets/js/utils.js');

config.info().then(config => {
    Gamedig.query({
        type: 'minecraft',
        host: config.ip_server,
        port: config.port
    }).then((state) => {
        var status_json = state.raw.vanilla;
        if(status_json.raw.players.online === 0){
            document.querySelector(".player-connect").innerHTML = `Aucun joueur actuellement connect\u00e9`;
        } else if (status_json.raw.players.online === 1){
            document.querySelector(".player-connect").innerHTML = `${status_json.raw.players.online} joueur actuellement connect\u00e9`;
        } else {
            document.querySelector(".player-connect").innerHTML = `${status_json.raw.players.online} joueurs actuellement connect\u00e9s`;
        }

       }).catch((err) => {
           console.log(err)
        document.querySelector(".player-connect").innerHTML = "Le serveur est ferme.";
    })
})

// for (let i = 0; i < status_json.raw.players.online; i++) { 
//     player = status_json.raw.players.sample[i].name
//     document.querySelector(".player-connect").innerHTML += `<img src="https://mc-heads.net/head/${player}" class="users"><b class="users"> ${player}</b></br>`
//   }