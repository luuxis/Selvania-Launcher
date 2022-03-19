const pkg = nw.global.manifest;
const fetch = require("node-fetch")

let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url
const config = url + "/launcher/config-launcher/config.json";

class Config {
    config() {
        return new Promise((resolve, reject) => {
            fetch(config).then(config => {
                return resolve(config.json());
            }).catch(error => {
                return reject(error);
            })
        })
    }
}

export default new Config;