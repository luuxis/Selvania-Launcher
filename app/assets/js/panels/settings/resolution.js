config.config().then(config => {
    const config_launcher = require(dataDirectory + "/" + config.dataDirectory + "/config.json")
    
    if(config_launcher.Settings.Resolution.width === null || config_launcher.Settings.Resolution.height === null){

    } else {
        document.querySelector(".width").value = config_launcher.Settings.Resolution.width
        document.querySelector(".height").value = config_launcher.Settings.Resolution.height
    }
})