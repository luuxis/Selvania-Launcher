const { config, microsoft } = require('./assets/js/utils.js');
const { Authenticator } = require('minecraft-launcher-core');
const fs = require("fs")
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
  if(fs.existsSync(dataDirectory + "/" + config.dataDirectory + "/account.json")) {
    let rawData = fs.readFileSync(dataDirectory + "/" + config.dataDirectory + "/account.json")
    let json = JSON.parse(rawData);
    
    if (!json.user || !json.user.type){
      isonline()
    } else if((json.user.type)  == "mojang") {
      Authenticator.validate(json.user.access_token, json.user.client_token).then(user => {
        window.location.href = "./panels/home.html";
      }).catch (err => {
        isonline()
      })
    } else if ((json.user.type)  == "offline") {
      Authenticator.getAuth(json.user.pseudo).then(user => {
        window.location.href = "./panels/home.html";
      }).catch (err => {
        isonline()
      })
    } else if ((json.user.type)  == "xbox") {
      account = microsoft.getMLC().getAuth(json.user.call).then(user => {
        window.location.href = "./panels/home.html";
      }).catch (err => {
        isonline()
      })
    }
  } else {
    isonline()
  }
})