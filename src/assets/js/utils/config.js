const pkg = require("../../../../package.json");
const fetch = require("node-fetch")
let url
if (!pkg.user) {
    url = pkg.url
} else {
    url = pkg.url + "/" + pkg.user
}
const config = url + "/launcher/config-launcher/config.json";

module.exports.config = getData;

function getData() {
    return new Promise((resolve, reject) => {
        fetch(config).then(config => {
            return resolve(config.json());
        }).catch(error => {
            return reject(error);
        })
    })
}