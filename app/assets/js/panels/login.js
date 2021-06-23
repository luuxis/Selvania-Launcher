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
      "user": name,
      "password": hash,
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
      document.querySelector(".error").style.display = "block";
      return;
    }
    document.querySelector(".pseudo").disabled = true;
    document.querySelector(".password").disabled = true;
    document.querySelector(".error").style.display = "none";
    auth.login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
      setlogging()
    }).catch (err => {
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "block";
    })
  }

  function loginoff() {
    if (document.querySelector(".pseudo").value == ""){
      document.querySelector(".error").style.display = "block";
      return;
    }
    document.querySelector(".pseudo").disabled = true;
    document.querySelector(".password").disabled = true;
    document.querySelector(".error").style.display = "none";
    auth.login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
      setlogging()
    }).catch (err => {
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "block";
    })
  }

  function connecte_on() {
    window.location.href = "./login-online.html";
  }

  function microsoft_account(){
    microsoft.getNWjs().FastLaunch(
      (call) => {
        console.log("Login successful");
        var accessToken = call.access_token;
        var profile = call.profile;
      },
      (update) => {
        switch (update.type) {
          case "Starting":
            console.log("Checking user started!");
            break;
          case "Loading":
            console.log("Loading:", update.data, "-", update.percent + "%");
            break;
          case "Rejection":
            console.error("Fetch rejected!", update.data);
            break;
          case "Error":
            console.error("MC-Account error:", update.data);
            break;
          case "Canceled":
            console.error("User clicked cancel!");
            break;	
        }
      }
  )
  
  }
  