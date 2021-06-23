const { config, crypt } = require('./assets/js/utils.js');
const fs = require("fs")
const { MCAuth } = require('emc-core-luuxis');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)


function isonline(){
  config.isonline().then(online => {
    if (online) {
      console.log("Loading online login \(officiel login\)");
      window.location.href = "./panels/login-online.html"
    } else {
      console.log("Loading offline login \(crack login\)");
      window.location.href = "./panels/login-offline.html"
    }
  })
}


config.config().then(config => {
  if(fs.existsSync(dataDirectory + "/" + config.dataDirectory + "/login.json")) {
    let rawData = fs.readFileSync(dataDirectory + "/" + config.dataDirectory + "/login.json")
    let json = JSON.parse(rawData);
    const password = crypt.decrypt(json.mojang.password);
    MCAuth.auth(json.mojang.user, password).then(user => {
      window.location.href = "./panels/home.html";
    }).catch (err => {
      isonline()
    })
  } else {
    isonline()
  }
})