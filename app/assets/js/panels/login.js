'use strict';

const { auth } = require("./assets/js/lib/utils.js");
const fs = require("fs");
const convert = require("xml-js");
const net = require('net');

class Login {
  static id = "login";

  async init(popup , changePanel){

    this.popup = popup;
    this.changePanel = changePanel;
   
    if (auth.isLogged()){
      this.changePanel("home");
    }


    this.login();
  }


  
  login(){
    let status = document.querySelector(".login-btn");
    status.addEventListener("click", () => {
      document.getElementById('login-btn').addEventListener('click', e => {
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
      })
    })
  }
}


export default Login;
