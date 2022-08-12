/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const pkg = require('../package.json');
const nodeFetch = require("node-fetch")
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            nodeFetch(config).then(config => {
                return resolve(config.json());
            }).catch(error => {
                return reject(error);
            })
        })
    }
}

export default new Config;