const os = require("os")  
const fs = require("fs")
const { config } = require('./assets/js/utils.js');
const Slider = require('./assets/js/utils/slider.js');
const freeMem = Math.trunc(os.freemem() / 1048576 * 10) / 10;




config.config().then(res => {
    const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`)
    let instance
    const selector = document.getElementById("slider");
    const options = {
        range: [512, 4048],
        value: [file.Settings.Java.RamMin, file.Settings.Java.RamMax]
    }
    instance = new Slider(selector, options);
    
    // document.getElementById("test").addEventListener( "click", () => {
    //     file.Settings.Java.RamMin = instance.val()[0]
    //     file.Settings.Java.RamMax = instance.val()[1]
    //     fs.writeFileSync(`config.json`, JSON.stringify(file, true, 4), 'UTF-8')
    // })
})