const { config, auth } = require('./assets/js/utils.js');
const fs = require("fs")
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)



function setloging(){
  config.config().then(config => {
    
    const patch = (dataDirectory + "/" + config.dataDirectory)
    const login = (patch + "/login.json" )
    
    const name = document.querySelector(".pseudo").value;
    const password = document.querySelector(".password").value;
    
    const data ={ 
      "user": name,
      "password": password,
    }; 
    
    const dataStringified = JSON.stringify(data);
    fs.mkdirSync(patch)
    fs.writeFileSync(login, dataStringified);
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
      setloging()
      window.location.href = "./home.html";
    }).catch (err => {
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "block";
    })
  }
  