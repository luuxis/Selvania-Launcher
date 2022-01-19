const fs = require("fs");
const { mojang, microsoft } = require('minecraft-java-core');
const Microsoft = new microsoft()
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const { config, auth } = require('./assets/js/utils.js');
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


config.config().then(async (config) => {
  let path = `${dataDirectory}/${config.dataDirectory}/config.json`
  if(fs.existsSync(path)) {
    let file = require(path)
    let getuser = auth.getUser(file.Login)

    if(getuser === null){
      changePanel("", "login")
    } else {
      let allusers = []
      for(let user of getuser){
        if(user.meta.type === "msa") {
          let msa = await Microsoft.refresh(user)
          user[msa.uuid] = msa
        } else if(user.meta.type === "mojang") {
          if(user.meta.offline) continue
          let mojang = await auth.refreshAuth(user)
          user[mojang.uuid] = mojang
        }
        allusers.push(user)
      }

      fs.writeFileSync("./AppData/test.json", JSON.stringify(allusers, true, 4))
      changePanel("login", "home")
    }
  } else {
    changePanel("", "login")
  }
})