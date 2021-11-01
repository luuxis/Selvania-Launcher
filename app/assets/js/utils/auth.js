const { MCAuth } = require('emc-core-luuxis');
const msmc = require("msmc-luuxis");
const config = require("./config.js")
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
    config.config().then(res => {
            return new Promise((resolve, reject) => {
                msmc.setFetch(fetch)
                msmc.fastLaunch(res.client_id, "nwjs").then(user => {
                    module.exports.user = msmc.getMCLC().getAuth(user)
                    return resolve(user);
                }).catch(error => {
                    return reject (error);
                })
            })
        
    
    })
}