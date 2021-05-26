const { MCAuth, MCLaunch } = require('emc-core-luuxis')
const launcher = new MCLaunch;
const user = require("../login.json")
const settings = require("../settings.json")


let opts = {
    url: "http://localhost:8080/",
    overrides: {
      detached: false
    },
    authorization: MCAuth.auth(user.user, user.password),
    root: "./.data",
    version: "1.12.2",
    forge: "1.12.2-forge1.12.2-14.23.5.2847",
    checkFiles: true,
    memory: {
        max: settings.ram_max,
        min: settings.ram_min
    }
  }



launcher.launch(opts);


launcher.on('debug', (e) => console.log("[DEBUG]" + e));
launcher.on('data', (e) => console.log("[DATA]" + e));
launcher.on('error', (e) => {
console.log("[ERROR]" + e)
});