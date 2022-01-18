document.querySelector(".singout").addEventListener("click", () => {
    config.config().then(res => {
        const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
        file.Login = null
        fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
        changePanel("settings", "login")
    })
})