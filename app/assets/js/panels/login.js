'use strict';
const { auth } = require("./assets/js/lib/utils.js");

class Login {
  static id = "login";

  async init(){
    this.Login();
    if (auth.isLogged()){
      this.changePanel("home");

    }
  }


  Login(){


  }



}
export default Login;
