const { config, auth } = require('./assets/js/utils.js');
const fs = require("fs")
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)



function setlogging(){
  config.config().then(config => {
    const patch = (dataDirectory + "/" + config.dataDirectory)
    const login = (patch + "/login.json" )

    const name = document.querySelector(".pseudo").value;
    const password = document.querySelector(".password").value;
    
    let data = { 
      "user": name,
      "password": password,
    }; 
    
    let dataStringified = JSON.stringify(data);
    
    if(!fs.existsSync(patch)){
      fs.mkdirSync(patch)
    }
    
    fs.writeFileSync(login, dataStringified);
    console.log(patch)
    window.location.href = "./home.html";
  })
}


function login(online) {
    if (online){
      if (document.querySelector(".password").value == ""){
        document.querySelector(".error").style.display = "block";
        return;
      }
    }
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
  