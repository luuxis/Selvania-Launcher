const { mojang, microsoft } = require('minecraft-java-core');
const Microsoft = new microsoft();

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

module.exports.loginMicrosoft = function(){
    return new Promise((resolve, reject) => {
        Microsoft.getAuth().then(user => {
            module.exports.user = user
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}