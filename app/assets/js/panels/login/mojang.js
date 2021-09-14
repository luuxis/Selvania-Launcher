const { auth } = require('./assets/js/utils.js')

document.getElementsByName('pseudo')[0].placeholder='Adresse E-mail';

document.querySelector(".login-btn").addEventListener("click", () => {
    if (document.querySelector(".pseudo").value == ""){
        document.querySelector(".info-login").innerHTML = "Entrez votre adresse email / nom d'utilisateur"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
        return;
    }

    if (document.querySelector(".password").value == ""){
        document.querySelector(".info-login").innerHTML = "Entrez votre mot de passe"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
        return;
    }

    document.querySelector(".login-btn").disabled = true
    document.querySelector(".pseudo").disabled = true
    document.querySelector(".password").disabled = true
    document.querySelector(".info-login").style.color = "#000000";
    document.querySelector(".info-login").innerHTML = "Connexion en cours..."
    document.querySelector(".info-login").style.display = "block"
    auth.loginMojang(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
        changePanel("login", "home")
    }).catch (err => {
        document.querySelector(".login-btn").disabled = false
        document.querySelector(".pseudo").disabled = false
        document.querySelector(".password").disabled = false
        document.querySelector(".info-login").innerHTML = "Adresse E-mail ou mot de passe invalide"
        document.querySelector(".info-login").style.color = "red";
        document.querySelector(".info-login").style.display = "block"
    })
})