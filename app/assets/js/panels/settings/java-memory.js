const os = require("os")  
const fs = require("fs")
const { config } = require('./assets/js/utils.js');
const Slider = require('./assets/js/utils/slider.js');
const freeMem = Math.trunc(os.freemem() / 1048576 * 10) / 10;
const TotalMem = Math.trunc(os.totalmem / 1048576 * 10) / 10;
let instance




config.config().then(res => {
    const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`)
    const selector = document.querySelector(".slider");
    const options = {
        range: [512, Math.round(TotalMem)],
        value: [parseInt(file.Settings.Java.RamMin), parseInt(file.Settings.Java.RamMax)]
    }
    instance = new Slider(selector, options);
    
     document.getElementById("test").addEventListener( "click", () => {
        file.Settings.Java.RamMin = `${instance.val()[0]}`
        file.Settings.Java.RamMax = `${instance.val()[1]}`
        fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
    })
})