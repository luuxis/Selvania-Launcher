const os = require("os")  
const fs = require("fs")
const { config, Slider } = require('./assets/js/utils.js');
const freeMem = Math.trunc(os.freemem() / 1048576 * 10) / 10;
const TotalMem = Math.trunc(os.totalmem() / 1048576 * 10) / 10;

let instance

config.config().then(res => {
    const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`)
    const options = {
        range: [512, Math.round(TotalMem)],
        value: [parseInt(file.Settings.Java.RamMin), parseInt(file.Settings.Java.RamMax)]
    }
    instance = new Slider(document.querySelector(".slider"), options);
    
    document.querySelector(".slider").addEventListener("mouseleave", () => {
        file.Settings.Java.RamMin = `${instance.val()[0]}`
        file.Settings.Java.RamMax = `${instance.val()[1]}`
        fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
    })
})