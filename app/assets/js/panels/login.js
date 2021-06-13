const { config, auth } = require('./assets/js/utils.js');

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
      window.location.href = "./home.html";
    }).catch (err => {
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "block";
    })
  }
  