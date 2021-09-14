const { config, auth, microsoft } = require('./assets/js/utils.js');

document.querySelector(`.password`).style.display = "none"


document.querySelector(".login-btn").addEventListener("click", () => {
    auth.login(document.querySelector(".pseudo").value).then(user => {
        changePanel("login", "home")
    })
})