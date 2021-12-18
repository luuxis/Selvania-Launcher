const { config } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const os = require("os")
let DEFAULT_CONFIG

const totalMem = Math.trunc(os.totalmem() / 1048576 * 10) / 10;
const freeMem = Math.trunc(os.freemem() / 1048576 * 10) / 10;

let RamMin

if ((freeMem / 3).toFixed(0)) {
    RamMin = "512"
} else {
    RamMin = `${(freeMem / 3).toFixed(0)}`
}


config.config().then(res => {
    if(!fs.existsSync(`${dataDirectory}/${res.dataDirectory}/config.json`)){
        DEFAULT_CONFIG = {
            "Launcher": {
                "NewsAutoRefresh": false,
                "StatusServerAutoRefresh": false,
                "CloseLauncher": true
            },
            "Settings": {
                "Java": {
                    "RamMin": RamMin,
                    "RamMax": `${(totalMem / 3).toFixed(0)}`,
                    "Directory": null
                },
                "Resolution": {
                    "width": "1280",	
                    "height": "720"
                }
            },
            "Login": {
                "UserConnect": null,
                "Account": null
            }
        }
        if(!fs.existsSync(`${dataDirectory}/${res.dataDirectory}`)){
            fs.mkdirSync(`${dataDirectory}/${res.dataDirectory}`, { recursive: true })
        }
        fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(DEFAULT_CONFIG, true, 4), 'UTF-8')
    }
    import ("./settings/account.js")
    import ("./settings/java-directory.js")
    import ("./settings/resolution.js")
    import ("./settings/settings-launcher.js")
})

document.querySelector(".accountsettings").addEventListener("click", () => {
    tab('accountsettingstab')
})

document.querySelector(".ramsettings").addEventListener("click", () => {
    tab('ramsettinstab')
    import ("./settings/java-memory.js")
})

document.querySelector(".javasettings").addEventListener("click", () => {
    tab('javasettingstab')
})

document.querySelector(".resolutionsettings").addEventListener("click", () => {
    tab('resolutionsettingstab')
})

document.querySelector(".launchersettings").addEventListener("click", () => {
    tab('launchersettingstab')
})

function tab(info) {
    let content = document.getElementsByClassName("tabsettings");
    for (let i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }
    document.querySelector(`.${info}`).style.display = "block";
}

document.querySelector(".settingsSave").addEventListener("click", () => {
    tab('accountsettingstab')
    changePanel("settings", "home")
})
