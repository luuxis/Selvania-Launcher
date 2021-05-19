const pkg = require("../../../../package.json");
const config = pkg.config.replace('{user}', pkg.user);

module.exports.fetch = getData;

function getData() {
    return new Promise((resolve, reject) => {
        fetch(config).then(res => {
            return resolve(res.json());
        }).catch(error => {
            return reject(error);
        })
    })
}

module.exports.isonline = function isonline() {
    return new Promise((resolve, reject) => {
        getData().then(res => {
            return resolve(res.offline != "on")
        }).catch(error => {
            return reject(error);
        })
    })
}