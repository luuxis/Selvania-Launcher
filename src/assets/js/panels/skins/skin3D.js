const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const { config } = require('./assets/js/utils.js');

let token = null
let profile = null
let drage = document.querySelector('.drage-skin');


config.config().then((config) => {
    let path = `${dataDirectory}/${config.dataDirectory}/config.json`
    config = require(path)
    config = config.Login[config.select]
    token = config.access_token
    profile = config.profile
})
