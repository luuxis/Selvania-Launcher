const { MCAuth } = require('emc-core-luuxis');
const msmc = require("msmc");
const fetch = require("node-fetch");

module.exports.loginMojang = function(username, password){
    return new Promise((resolve, reject) => {
        MCAuth.auth(username, password).then(user => {
            module.exports.user = user
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}

module.exports.loginMicrosoft = function(){
    return new Promise((resolve, reject) => {
        msmc.setFetch(fetch)
        msmc.fastLaunch("nwjs").then(user => {
            module.exports.user = msmc.getMCLC().getAuth(user)
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}