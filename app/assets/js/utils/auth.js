const { Authenticator } = require('minecraft-java-core');
const msmc = require("msmc-luuxis");
const fetch = require("node-fetch");

module.exports.loginMojang = function(username, password){
    return new Promise((resolve, reject) => {
        Authenticator.getAuth(username, password).then(user => {
            module.exports.user = user
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}



module.exports.loginMicrosoft = function(client_id){
    return new Promise((resolve, reject) => {
        msmc.setFetch(fetch)
        msmc.fastLaunch(client_id, "nwjs").then(user => {
            module.exports.user = msmc.getMCLC().getAuth(user)
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}