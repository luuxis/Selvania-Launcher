const { config, auth } = require('./assets/js/utils.js');



/*if(process.platform == "win32"){
    document.querySelector(".frame").style.display = "block";
    document.querySelector("#minimize").addEventListener("click", () => {
      win.minimize();
   });
    document.querySelector("#close").addEventListener("click", () => {
     win.close();
    })
}  */




config.isonline().then(online => {
    if (auth.isLogged()) {
        window.location.href = "./panels/home.html"
    }

    if (online) {
        console.log("Loading online login \(officiel login\)");
        window.location.href = "./panels/login-online.html"
    } else {
        console.log("Loading offline login \(crack login\)");
        window.location.pathname = "./panels/login-offline.html"
    }
})