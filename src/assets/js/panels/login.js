const { config } = require('./assets/js/utils.js');

config.config().then(config => {
  if (config.online) {
    console.log(`Initializing microsoft Panel...`)
    import ("./login/microsoft.js")
    console.log(`Initializing mojang Panel...`)
    import ("./login/mojang.js")
  } else {
    console.log(`Initializing crack Panel...`)
    import ("./login/crack.js")
  }
})

document.querySelector(".add-account-cancel").addEventListener("click", () => {
  changePanel("login", "settings")
})