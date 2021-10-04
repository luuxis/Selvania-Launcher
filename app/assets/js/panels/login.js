const { config } = require('./assets/js/utils.js');

config.isonline().then(online => {
  if (online) {
    console.log(`Initializing microsoft Panel...`)
    import ("./login/microsoft.js")
    console.log(`Initializing mojang Panel...`)
    import ("./login/mojang.js")
  } else {
    console.log(`Initializing crack Panel...`)
    import ("./login/crack.js")
  }
})