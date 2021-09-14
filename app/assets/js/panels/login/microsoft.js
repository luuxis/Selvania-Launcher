const { auth } = require('./assets/js/utils.js')

document.querySelector(".microsoft").addEventListener("click", () => {
    document.querySelector(".login-btn").disabled = true
    document.querySelector(".pseudo").disabled = true
    document.querySelector(".password").disabled = true
    document.querySelector(".info-login").style.color = "#000000";
    document.querySelector(".info-login").innerHTML = "Connexion en cours..."
    
    auth.loginMicrosoft().then(user => {
        changePanel("login", "home")
    }).catch (err => {
        document.querySelector(".login-btn").disabled = false
        document.querySelector(".pseudo").disabled = false
        document.querySelector(".password").disabled = false
    })
})