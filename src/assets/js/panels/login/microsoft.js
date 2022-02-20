const { auth, config } = require('./assets/js/utils.js')
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

document.querySelector(".microsoft-btn").addEventListener("click", () => {
    document.querySelector(".login-btn").disabled = true
    document.querySelector(".microsoft-btn").disabled = true
    document.querySelector(".pseudo").disabled = true
    document.querySelector(".password").disabled = true
    document.querySelector(".uzurion-mail").innerHTML = "&nbsp;"
    document.querySelector(".uzurion-password").innerHTML = "&nbsp;"
    document.querySelector(".info-login").style.color = "white";
    document.querySelector(".info-login").innerHTML = "Connexion en cours..."
    document.querySelector(".info-login").style.display = "block"
    config.config().then(res => {
        auth.loginMicrosoft(res.client_id).then(user => {
            if (!user) {
                document.querySelector(".info-login").innerHTML = "&nbsp;"
                document.querySelector(".login-btn").disabled = false
                document.querySelector(".microsoft-btn").disabled = false
                document.querySelector(".pseudo").disabled = false
                document.querySelector(".password").disabled = false
                return
            }
            if(document.querySelector(".loginRemember").checked == true){
                const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
                file.select = `${user.uuid}`
                file.Login[user.uuid] = user
                fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
            }
            document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${user.name}/100`
            changePanel("login", "home")
        }).catch (err => {
            document.querySelector(".info-login").innerHTML = "&nbsp;"
            document.querySelector(".login-btn").disabled = false
            document.querySelector(".microsoft-btn").disabled = false
            document.querySelector(".pseudo").disabled = false
            document.querySelector(".password").disabled = false
        })
    })
})