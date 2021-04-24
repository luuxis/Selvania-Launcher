const { MCAuth } = require('emc-core-luuxis');

let authenticator;

module.exports.user = authenticator;

module.exports.login = function(username, password){

    return new Promise((resolve, reject) => {
        MCAuth.auth(username, password).then(user => {
            authenticator = user;
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}

module.exports.isLogged = function isLogged(){
    return authenticator != null && authenticator != undefined;
}