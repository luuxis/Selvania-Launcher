'use strict';

class Popup {
  constructor(){
    this.popup = document.querySelector(".popup-bg");
    this.title = document.querySelector(".popup .title");
    this.information = document.querySelector(".popup .information");
    this.buttons = document.querySelector(".popup .buttons");
  }

  showPopup(title = "", information = "", type = "info", ...buttons){
    this.title.innerHTML = title;
    this.title.classList.remove("info", "warning");
    this.title.classList.add(type);
    this.information.innerHTML = information;
    this.buttons.innerHTML = "";
    for(let button of buttons) this.createButton(button);
    this.popup.classList.toggle("show");
  }

  createButton({value, func = () => {}}){
    let div = document.createElement("div");
    div.classList.add("button");
    div.textContent = value;
    this.buttons.appendChild(div);
    let popup = this.popup, buttons = this.buttons;
    div.addEventListener("click", async () => {
      func();
      popup.classList.toggle("show");
      await sleep(200);
      buttons.innerHTML = "";
    });
  }
}

function sleep(ms){
  return new Promise(function(resolve) { setTimeout(resolve, ms) });
}

export default Popup;
