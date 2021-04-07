'use strict';

const { config } = require("./assets/js/lib/utils.js");

let win = nw.Window.get();


window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Launcher {
  constructor(){
    this.backgroundcustome();
    this.logincheck();
    if(process.platform == "win32") this.initFrame();
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
        
      } else {
        console.log("Loading offline login \(crack login\)");

      }
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