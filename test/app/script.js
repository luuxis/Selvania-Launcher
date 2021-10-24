const Slider = require("./code.js");
const os = require("os")  
const fs = require("fs")
const file = require("../config.json")
const freeMem = Math.trunc(os.freemem() / 1048576 * 10) / 10;
let instance
const selector = document.getElementById("slider");
const options = {
    range: [512, ((freeMem).toFixed(0) / 1024).toFixed(0) * 1024],
    value: [file.Settings.Java.RamMin, file.Settings.Java.RamMax]
}

instance = new Slider(selector, options);


  

document.getElementById("test").addEventListener( "click", () => {
    file.Settings.Java.RamMin = `${instance.val()[0]}`
    file.Settings.Java.RamMax = `${instance.val()[1]}`
    fs.writeFileSync(`config.json`, JSON.stringify(file, true, 4), 'UTF-8')
})
