const { config } = require('./assets/js/utils.js');

config.isonline().then(online => {
  if (online) {
    console.log(`Initializing Panel crack ${!online}`)
    import ("./login/microsoft.js")
    import ("./login/mojang.js")
  } else {
    console.log(`Initializing Panel crack ${!online}`)
    import ("./login/crack.js")
  }
})