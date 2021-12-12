const fs = require("fs");
const msmc = require("msmc-luuxis");
const { Authenticator } = require('minecraft-java-core');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const { config } = require('./assets/js/utils.js');
let win = nw.Window.get()


if(process.platform == "win32") {
  document.querySelector(".frame").classList.toggle("hide")
  document.querySelector(".dragbar").classList.toggle("hide")
  
  document.querySelector("#minimize").addEventListener("click", () => {
    win.minimize()
  });

  let maximized = false;
  let maximize = document.querySelector("#maximize")
  maximize.addEventListener("click", () => {
    if(maximized) win.unmaximize()
    else win.maximize()
    maximized = !maximized
    maximize.classList.toggle("icon-maximize")
    maximize.classList.toggle("icon-restore-down")
  });

  document.querySelector("#close").addEventListener("click", () => {
    win.close();
  })
}

function changePanel(V1, V2){
  if(V1 == ""){
    document.querySelector(`.${V2}`).style.display = "block"
  } else if (V1 == "login"){
    document.querySelector(`.${V1}`).style.display = "none"
    document.querySelector(`.${V2}`).style.display = "block"
    document.querySelector(".login-btn").disabled = false
    document.querySelector(".pseudo").disabled = false
    document.querySelector(".microsoft-btn").disabled = false
    document.querySelector(".password").disabled = false
  } else {
    document.querySelector(`.${V1}`).style.display = "none"
    document.querySelector(`.${V2}`).style.display = "block"
  }
}

(function(...panels){
  let panelsElem = document.querySelector("#panels")
  for(let panel of panels){
    console.log(`Initializing ${panel} Panel...`)
    let div = document.createElement("div")
    div.classList.add("panel", panel)
    div.innerHTML = fs.readFileSync(`app/panels/${panel}.html`, "utf8")
    panelsElem.appendChild(div);
    import (`./panels/${panel}.js`)
  }
})('login', 'home', 'settings')


config.config().then(config => {
  if(fs.existsSync(dataDirectory + "/" + config.dataDirectory + "/config.json")) {
    let rawData = fs.readFileSync(dataDirectory + "/" + config.dataDirectory + "/config.json")
    let json = JSON.parse(rawData);
    
    if ((json.Login.UserConnect) === null){
      changePanel("", "login")

    } else if(json.Login.UserConnect == "Mojang") {
      if (!json.Login.Account || !json.Login.Account.Mojang || !json.Login.Account.Mojang.User || !json.Login.Account.Mojang.User.access_token || !json.Login.Account.Mojang.User.client_token) changePanel("", "login")
      Authenticator.validate(json.Login.Account.Mojang.User.access_token, json.Login.Account.Mojang.User.client_token).then(user => {
        document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${json.Login.Account.Mojang.User.name}/100`
        changePanel("", "home")
      }).catch (err => {
        changePanel("", "login")
      })

    } else if (json.Login.UserConnect == "Crack") {
      if (!json.Login.Account || !json.Login.Account.Crack || !json.Login.Account.Crack.User || !json.Login.Account.Crack.User.name) changePanel("", "login")
      Authenticator.getAuth(json.Login.Account.Crack.User.name).then(user => {
        document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${json.Login.Account.Crack.User.name}/100`
        changePanel("", "home")
      }).catch (err => {
        changePanel("", "login")
      })

    } else if (json.Login.UserConnect == "Microsoft") {
      if (!json.Login.Account || !json.Login.Account.Microsoft || !json.Login.Account.Microsoft.User) changePanel("", "login")
      msmc.getMCLC().validate(json.Login.Account.Microsoft.User).then(user => {
        msmc.refresh(json.Login.Account.Microsoft.User.profile).then(user => {
          json.Login.UserConnect = "Microsoft"
          json.Login.Account = {"Microsoft":{"User": user}} 
          fs.writeFileSync(`${dataDirectory}/${config.dataDirectory}/config.json`, JSON.stringify(json, true, 4), 'UTF-8')
          document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${user.profile.name}/100`
          changePanel("", "home")
        })
      }).catch (err => {
        changePanel("", "login")
      })
    }
  } else {
    changePanel("", "login")
  }
})