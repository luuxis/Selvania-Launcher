const { config, auth, crypt, microsoft } = require('./assets/js/utils.js');
const fs = require("fs")
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)



function setlogging(){
  config.config().then(config => {
    const patch = (dataDirectory + "/" + config.dataDirectory)
    const login = (patch + "/login.json" )

    const name = document.querySelector(".pseudo").value;
    const password = document.querySelector(".password").value;

    const hash = crypt.encrypt(password);

    let data = { 
      "mojang":{
        "user": name,
        "password": hash,
      }
    }; 
    
    let dataStringified = JSON.stringify(data);
    
    if(!fs.existsSync(patch)){
      fs.mkdirSync(patch);
    }
    
    fs.writeFileSync(login, dataStringified);
    console.log(patch);
    window.location.href = "./home.html";
  })
}

function login() {
    if (document.querySelector(".pseudo").value == "" || document.querySelector(".password").value == ""){
      document.querySelector(".error").style.display = "contents";
      return;
    }
    document.querySelector(".pseudo").disabled = true;
    document.querySelector(".password").disabled = true;
    document.querySelector(".error").style.display = "none";
    document.querySelector(".connexion").style.display = "contents";
    auth.login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
      setlogging()
    }).catch (err => {
      document.querySelector(".connexion").style.display = "none";
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "contents";
    })
  }

  function loginoff() {
    if (document.querySelector(".pseudo").value == ""){
      document.querySelector(".error").style.display = "contents";
      return;
    }
    document.querySelector(".connexion").style.display = "contents";
    document.querySelector(".pseudo").disabled = true;
    document.querySelector(".password").disabled = true;
    document.querySelector(".error").style.display = "none";
    auth.login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
      setlogging()
    }).catch (err => {
      document.querySelector(".connexion").style.display = "none";
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "contents";
    })
  }

  function connecte_on() {
    window.location.href = "./login-online.html";
  }

  function microsoft_account(){
    microsoft.getNWjs().FastLaunch(
      (call) => {
        config.config().then(config =>{
          const patch = (dataDirectory + "/" + config.dataDirectory)
          const login = (patch + "/login.json" )
      
          let data = { 
            "microsoft":{
              "profile": call.profile,
              "access_token": call.access_token,
            }
          }; 
          
          let dataStringified = JSON.stringify(data);
          
          if(!fs.existsSync(patch)){
            fs.mkdirSync(patch);
          }
          
          fs.writeFileSync(login, dataStringified);
          console.log(patch);
          window.location.href = "./home.html";
        })
      },
      (update) => {
        switch (update.type) {
          case "Starting":
            document.querySelector(".connexion").style.display = "contents";
            break;
          case "Loading":
            document.getElementById("microsoft_account_txt").innerHTML = "Connexion: " + update.percent + "%"
            break;
          case "Rejection":
            document.getElementById("microsoft_account_txt").innerHTML = update.data
            break;
          case "Error":
            document.getElementById("microsoft_account_txt").innerHTML = update.data
            break;	
        }
      }
    )
  }
  