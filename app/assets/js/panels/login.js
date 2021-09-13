const { config } = require('./assets/js/utils.js');

config.isonline().then(online => {
  if (online) {
    console.log("Loading online login \(officiel login\)");
    import ("./login/microsoft.js")
    import ("./login/mojang.js")
  } else {
    console.log("Loading offline login \(crack login\)");
    import ("./login/crack.js")
  }
})