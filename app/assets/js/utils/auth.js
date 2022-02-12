const { mojang, microsoft } = require('minecraft-java-core');

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

module.exports.loginMicrosoft = function(id){
    return new Promise((resolve, reject) => {
        new microsoft(id).getAuth().then(user => {
            module.exports.user = user
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}

module.exports.getUser = function(id){
    let Users = Object.entries(id)
    let user = []
    if(Users.length === undefined || Users.length === 0){
        return user = null
    }
    for(let [uuid, value] of Users){
        let users = {}
        users = value
        users.uuid = uuid
        user.push(users);
    }
    return user
}

module.exports.refreshAuth = function(acc){
    return new Promise((resolve, reject) => {
        mojang.refreshAuth(acc.access_token, acc.client_token).then(user => {
            return resolve(user);
        }).catch(error => {
            return reject (error);
        })
    })
}

