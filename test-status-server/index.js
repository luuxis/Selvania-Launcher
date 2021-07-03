const Gamedig = require('gamedig');

Gamedig.query({
    type: 'minecraft',
    host: 'jouer.arche-rp.fr'
}).then((state) => {
    status_json = state.raw.vanilla;
    console.log(status_json.raw.players.online + " joueur(s) actuellement connectés");
    document.getElementById("online").innerHTML = status_json.raw.players.online + " joueur(s) actuellement connect\u00e9(s)";
    
    
    for (let pas = 0; pas < 5; pas++) { 
        player = pas
        document.getElementById("users").innerHTML += `<img src="https://mc-heads.net/head/${player}" class="users"><b class="users"> ${player}</b></br>`
    }
    
}).catch((error) => {
    console.log("Server is offline");
});
