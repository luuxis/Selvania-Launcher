const { auth } = require('./assets/js/utils.js');

document.querySelector(".login-btn").addEventListener("click", () => {
    auth.login(document.querySelector(".pseudo").value, document.querySelector(".password").value).then(user => {
        changePanel("login", "home")
    })
})