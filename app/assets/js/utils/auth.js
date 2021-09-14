const { MCAuth } = require('emc-core-luuxis');

module.exports.login = function(username, password){
    return new Promise((resolve, reject) => {
        MCAuth.auth(username, password).then(user => {
            module.exports.user = user
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}