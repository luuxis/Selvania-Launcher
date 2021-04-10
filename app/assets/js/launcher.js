'use strict';

import Home from './panels/home.js';
import Settings from './panels/settings.js';


// Libs
import Popup from './lib/Popup.js';


const { config, auth } = require("./assets/js/lib/utils.js");
const fs = require("fs");
const popup = new Popup();


let win = nw.Window.get();


window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Launcher {
  constructor(){
    console.clear();
    console.log("Initializing Launcher...");
    this.backgroundcustome();
    if(process.platform == "win32") this.initFrame();
    this.createPanels(Home, Settings);
    this.logincheck();
  }



  createPanels(...panels){
    let panelsElem = document.querySelector("#panels");
    for(let panel of panels){
      let div = document.createElement("div");
      div.id = panel.id;
      if(div.id == "login"){
        this.panel = div;
        div.classList.toggle("active");
      }
      div.innerHTML = fs.readFileSync(`app/panels/${panel.id}.html`, "utf8");
      panelsElem.appendChild(div);
      new panel().init(popup);
    }
  }

  changePanel(id){
    let panel = document.querySelector(`#panels #${id}`);
    this.panel.classList.toggle("active");
    (this.panel = panel).classList.toggle("active");
  }


  
  initFrame(){
    document.querySelector(".frame").classList.toggle("hide");
    document.querySelector(".dragbar").classList.toggle("hide");
    document.querySelector("#minimize").addEventListener("click", () => {
      win.minimize();
   });
    document.querySelector("#close").addEventListener("click", () => {
     win.close();
    })
  }
  
  logincheck(){
    config.isonline().then(online => {
      if(online){
        console.log("Loading online login \(officiel login\)");
        if (auth.isLogged()){
          this.changePanel("home");
        }
        this.login();
      } else {
        console.log("Loading offline login \(crack login\)");
        if (auth.isLogged()){
          console.log("ok")
          this.changePanel("home");
        }
        this.login();
      }
    })
  }


  login(){
    config.isonline().then(online => {
      document.querySelector(".login-btn").addEventListener("click", () => {
        if (online){
          if (document.querySelector(".pseudo").value == ""){
            document.querySelector(".error").style.display = "block";
            return;
          }
        }
        document.querySelector(".pseudo").disabled = true;
        //document.querySelector(".password").disabled = true;
        document.querySelector(".error").style.display = "none";
        auth.login(document.querySelector(".pseudo").value).then(user => {
          this.changePanel("home");
        }).catch (err => {
          document.querySelector(".pseudo").disabled = false;
          //document.querySelector(".password").disabled = false;
          document.querySelector(".error").style.display = "block";
        })
      })
    })
  }








  backgroundcustome(){
    var imgCount = 6;
    var randomCount = (Math.floor(Math.random() * imgCount));
    var images = ['black-1.png', 'black-2.png', 'black-3.png', 'white-1.png', 'white-2.png', 'white-3.png'];
    document.body.style.backgroundImage = "url('assets/images/background/" + images[randomCount] + "')";
  }
}
new Launcher();