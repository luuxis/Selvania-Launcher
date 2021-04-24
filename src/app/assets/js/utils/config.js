const pkg = require("../../../../package.json");

module.exports.fetch = getData;

function getData() {

    return new Promise((resolve, reject) => {
        fetch(pkg.config).then(res => {
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