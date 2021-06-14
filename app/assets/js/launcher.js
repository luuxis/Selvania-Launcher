const { config, auth } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

config.config().then(res => {
  const patch = (dataDirectory + "/" + config.dataDirectory + "/login.json") 
    if (fs.existsSync(patch)){
        const login = require(patch)
        auth.login(login.user, login.password).then(user => {
          window.location.href = "./home.html";
        }).catch (err => {
          document.querySelector(".pseudo").disabled = false;
          document.querySelector(".password").disabled = false;
          document.querySelector(".error").style.display = "block";
        })
      }
})

config.isonline().then(online => {
    if (online) {
        console.log("Loading online login \(officiel login\)");
        window.location.href = "./panels/login-online.html"
    } else {
        console.log("Loading offline login \(crack login\)");
        window.location.href = "./panels/login-offline.html"
    }
})