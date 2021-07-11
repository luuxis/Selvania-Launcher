const fetch = require("node-fetch")
module.exports.config = getData;

function getData() {
    return new Promise((resolve, reject) => {
        fetch("https://launcheur.arche-rp.fr/web/launcher/config-launcher/config.json").then(config => {
            return resolve(config.json());
        }).catch(error => {
            return reject(error);
        })
    })
}
