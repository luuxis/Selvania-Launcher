const { config, auth } = require('./assets/js/utils.js');
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

document.querySelector(".add-account").addEventListener("click", () => {
    document.querySelector(".add-account-cancel").style.display = "block";
    changePanel("settings", "login")
})

// config.config().then(res => {
//     let accounts = document.querySelector(".accounts")
//     let path = `${dataDirectory}/${res.dataDirectory}/config.json`
//     const file = require(path)
//     let user = auth.getUser(file.Login)
//     for(let users of user){
//         let account = document.createElement("div")
//         account.classList.add("account")
//         account.innerHTML += `
//             <div class="account-name">${users.name}</div>
//             <div class="account-delete">
//                 <button class="account-delete-button">Delete</button>
//             </div>
//         `
//         accounts.appendChild(account)
//     }
// })