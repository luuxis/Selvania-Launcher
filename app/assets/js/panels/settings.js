const { config } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const os = require("os")
let DEFAULT_CONFIG

const totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
const freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;


// config.config().then(res =>{
//     if(!fs.access(`${dataDirectory}/${res.dataDirectory}/config.json`))
    
//     DEFAULT_CONFIG = {
//         "Settings": {
//             "Java": {
//                 "RamMin": `${(freeMem / 2).toFixed(0)}`,
//                 "RamMax": `${(totalMem / 2).toFixed(0)}`,
//                 "Directory": null
//             },
//             "Resolution": null,
//             "CloseLauncher": null
//         },
//         "Login": {
//             "AutoConnect": null
//         }
//     }
//     fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(DEFAULT_CONFIG, true, 4), 'UTF-8')
// })