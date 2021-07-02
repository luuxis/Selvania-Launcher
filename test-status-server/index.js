const Gamedig = require('gamedig');
const fs = require("fs")

Gamedig.query({
    type: 'minecraft',
    host: 'jouer.arche-rp.fr'
}).then((state) => {
    let dataStringified = JSON.stringify(state);
    fs.writeFileSync("./status.json", dataStringified);
}).catch((error) => {
    console.log("Server is offline");
});