const { auth, config } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

document.querySelector(`.online`).style.display = "none"
document.querySelector(`.microsoft-btn`).style.display = "none"
document.querySelector(`.loginSpanDim`).style.display = "none"
document.querySelector(`.uzurionAppLoginCardInformation`).innerHTML = "Le serveur Minecraft accepte les crack,<br>pour vous connecter il vous suffit de rentrer votre pseudo"
document.querySelector(`.uzurionAppLoginCardLabel`).innerHTML = "nom d\'utilisateur"
document.querySelector(".uzurionAppGenHeader").style.display = "block"

document.querySelector(".login-btn").addEventListener("click", () => {
    if (document.querySelector(".pseudo").value == ""){
        document.querySelector(".info-login").innerHTML = "Entrez votre nom d'utilisateur"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
        return;
    }

    if (document.querySelector(".pseudo").value.length < 3) {
       document.querySelector(".info-login").innerHTML = "Votre nom d'utilisateur doit avoir au moins 3 caractères"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
        return;
    }

    document.querySelector(".login-btn").disabled = true
    document.querySelector(".pseudo").disabled = true
    document.querySelector(".info-login").style.color = "#000000";
    document.querySelector(".info-login").innerHTML = "Connexion en cours..."
    document.querySelector(".info-login").style.display = "block"
    auth.loginMojang(document.querySelector(".pseudo").value).then(user => {
        config.config().then(res => {
            if(document.querySelector(".loginRemember").checked == true){
                const file = require(`${dataDirectory}/${res.dataDirectory}/config.json`);
                file.select = `${user.uuid}`
                file.Login[user.uuid] = user
                fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(file, true, 4), 'UTF-8')
            }
        })
        document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${user.name}/100`
        changePanel("login", "home")
    }).catch (err => {
        document.querySelector(".login-btn").disabled = false
        document.querySelector(".pseudo").disabled = false
        document.querySelector(".info-login").innerHTML = "error"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
    })
})

document.addEventListener('keydown', function (e) {
    if(e.key === 'Enter'){
        var click = new Event('click')
        document.querySelector(".login-btn").dispatchEvent(click)
    }
})