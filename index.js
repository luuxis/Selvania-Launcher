const Gamedig = require('gamedig')

Gamedig.query({
    type: 'minecraft',
    host: "193.70.80.225",
    port: "35565"
}).then((state) => {
    console.log(state.raw.vanilla.raw.players.online + "/" + state.raw.vanilla.raw.players.max);
}).catch((error) => {
    console.log("Server is offline")
})