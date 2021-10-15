const { config } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)






config.config().then(res => {
    var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
    if (file.Launcher.CloseLauncher === false) {
        document.querySelector(".CloseLauncherSettings").checked = true
    } else if (file.Launcher.CloseLauncher === true) {
        document.querySelector(".CloseLauncherSettings").checked = false
    }

})

document.querySelector(".CloseLauncherSettings").addEventListener("click", () => {
    config.config().then(res => {
        var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
        if(document.querySelector(".CloseLauncherSettings").checked == true){
            file.Launcher.CloseLauncher = false
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        } else if(document.querySelector(".CloseLauncherSettings").checked ==  false){
            file.Launcher.CloseLauncher = true
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')

        }
    })
})