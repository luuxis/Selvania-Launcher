const { auth, config } = require('./assets/js/utils.js')
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

document.querySelector(".microsoft-btn").addEventListener("click", () => {
    document.querySelector(".login-btn").disabled = true
    document.querySelector(".pseudo").disabled = true
    document.querySelector(".password").disabled = true
    document.querySelector(".info-login").style.color = "#000000";
    document.querySelector(".info-login").innerHTML = "Connexion en cours..."
    auth.loginMicrosoft().then(user => {
        if(document.querySelector(".loginRemember").checked == true){
            const Account = {
                "login":{
                    "Microsoft":{
                        "user": user
                    }
                }
            }
            config.config().then(res => fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(Account, null, 4), 'UTF-8'))
        }
        changePanel("login", "home")
    }).catch (err => {
        document.querySelector(".login-btn").disabled = false
        document.querySelector(".pseudo").disabled = false
        document.querySelector(".password").disabled = false
    })
})