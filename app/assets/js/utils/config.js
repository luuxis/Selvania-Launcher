const pkg = require("../../../../package.json");
const url = pkg.url.replace('{user}', pkg.user);
const config = url + "/launcher/config-launcher/config.json";
const info = url + "/launcher/config-launcher/info.json";

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

module.exports.info = getInfo;
function getInfo() {
    return new Promise((resolve, reject) => {
        fetch(info).then(info => {
            return resolve(info.json());
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