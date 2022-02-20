const { config } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

config.config().then(res => {
    var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
    if (file.Launcher.NewsAutoRefresh === true) {
        document.querySelector(".NewsAutoRefreshSettings").checked = true
    } else if (file.Launcher.NewsAutoRefresh === false) {
        document.querySelector(".NewsAutoRefreshSettings").checked = false
    }

    var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
    if (file.Launcher.StatusServerAutoRefresh === true) {
        document.querySelector(".StatusServerAutoRefreshSettings").checked = true
    } else if (file.Launcher.StatusServerAutoRefresh === false) {
        document.querySelector(".StatusServerAutoRefreshSettings").checked = false
    }

    var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
    if (file.Launcher.CloseLauncher === false) {
        document.querySelector(".CloseLauncherSettings").checked = true
    } else if (file.Launcher.CloseLauncher === true) {
        document.querySelector(".CloseLauncherSettings").checked = false
    }
})



document.querySelector(".NewsAutoRefreshSettings").addEventListener("click", () => {
    config.config().then(res => {
        var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
        if(document.querySelector(".NewsAutoRefreshSettings").checked == true){
            file.Launcher.NewsAutoRefresh = true
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        } else if(document.querySelector(".NewsAutoRefreshSettings").checked ==  false){
            file.Launcher.NewsAutoRefresh = false
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        }
    })
})

document.querySelector(".StatusServerAutoRefreshSettings").addEventListener("click", () => {
    config.config().then(res => {
        var file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
        if(document.querySelector(".StatusServerAutoRefreshSettings").checked == true){
            file.Launcher.StatusServerAutoRefresh = true
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        } else if(document.querySelector(".StatusServerAutoRefreshSettings").checked ==  false){
            file.Launcher.StatusServerAutoRefresh = false
            fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        }
    })
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