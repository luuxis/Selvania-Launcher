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

module.exports.getUser = function(id){
    let Users = Object.entries(id)
    let user = []
    if(Users.length < 0 || undefined){
        return user = null
    }
    for(let [uuid, value] of Users){
        let users = {}
        users = value
        users.id = uuid
        user.push(users);
    }
    return user
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