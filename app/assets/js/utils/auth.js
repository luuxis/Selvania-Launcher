const { mojang } = require('minecraft-java-core');
const msmc = require("msmc");
const fetch = require("node-fetch");

module.exports.loginMojang = function(username, password){
    return new Promise((resolve, reject) => {
        mojang.getAuth(username, password).then(user => {
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
        msmc.fastLaunch("nwjs").then(user => {
            module.exports.user = msmc.getMCLC().getAuth(user)
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}