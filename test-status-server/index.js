const Gamedig = require('gamedig');
Gamedig.query({
    type: 'minecraft',
    host: 'jouer.arche-rp.fr'
}).then((state) => {
    status_json = state.raw.vanilla;
    console.log(status_json.raw.players.online + " joueur(s) actuellement connectés");


    document.getElementById("online").innerHTML = status_json.raw.players.online + " joueur(s) actuellement connect\u00e9(s)";
}).catch((error) => {
    console.log("Server is offline");
});
