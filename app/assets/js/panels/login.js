'use strict';

const { auth } = require("./assets/js/lib/utils.js");

class Login {
  static id = "login";

  async init(){
   
    if (auth.isLogged()){
     // this.changePanel("home");
    }
  }

  /*function login(online) {
    if (online){
      if (document.querySelector(".pseudo").value == ""){
        document.querySelector(".error").style.display = "block";
        return;
      }
    }
    document.querySelector(".pseudo").disabled = true;
    document.querySelector(".password").disabled = true;
    document.querySelector(".error").style.display = "none";
    auth.Login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
      this.changePanel("home");
    }).catch (err => {
      document.querySelector(".pseudo").disabled = false;
      document.querySelector(".password").disabled = false;
      document.querySelector(".error").style.display = "block";
    })
  }*/


}


export default Login;
