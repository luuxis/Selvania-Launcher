const { Client, Authenticator } = require('minecraft-hariona');
const launcher = new Client();

let opts = {
    clientPackage: null,
    // For production launchers, I recommend not passing 
    // the getAuth function through the authorization field and instead
    // handling authentication outside before you initialize
    // MCLC so you can handle auth based errors and validation!
    authorization: Authenticator.getAuth(""),
    root: "./minecraft",
    version: {
        number: "1.12.2",
        type: "release"
    },
    memory: {
        max: "6G",
        min: "4G"
    }
}

launcher.launch(opts);

launcher.on('debug', (e) => console.log(e));
launcher.on('data', (e) => console.log(e));