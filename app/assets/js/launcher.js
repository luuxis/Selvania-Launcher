const fs = require("fs");
let win = nw.Window.get();

if(process.platform == "win32") {
  document.querySelector(".frame").classList.toggle("hide");
  document.querySelector(".dragbar").classList.toggle("hide");
  
  document.querySelector("#minimize").addEventListener("click", () => {
    win.minimize();
  });

  let maximized = false;
  let maximize = document.querySelector("#maximize");
  maximize.addEventListener("click", () => {
    if(maximized) win.unmaximize();
    else win.maximize();
    maximized = !maximized;
    maximize.classList.toggle("icon-maximize");
    maximize.classList.toggle("icon-restore-down");
  });

  document.querySelector("#close").addEventListener("click", () => {
    win.close();
  })
}

(function(...panels){
  let panelsElem = document.querySelector("#panels");
  for(let panel of panels){
    console.log(`Initializing ${panel} Panel...`);
    let div = document.createElement("div");
    div.classList.add("panel", panel);
    div.innerHTML = fs.readFileSync(`app/panels/${panel}.html`, "utf8");
    panelsElem.appendChild(div);
    import ("./panels/" + panel + ".js")
  }
 })('login', 'home', 'settings');

document.querySelector(".login").style.display = "block";
  

