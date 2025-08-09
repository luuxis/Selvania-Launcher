/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */

const pkg = require('../package.json');
const nodeFetch = require("node-fetch");
const convert = require('xml-js');
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;
let news = `${url}/launcher/news-launcher/news.json`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            nodeFetch(config).then(async config => {
                if (config.status === 200) return resolve(config.json());
                else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
            }).catch(error => {
                return reject({ error });
            })
        })
    }

    async getInstanceList() {
        let urlInstance = `${url}/files`
        let instances = await nodeFetch(urlInstance).then(res => res.json()).catch(err => err)
        let instancesList = []
        
        // Ajouter l'instance d'accueil par défaut en premier
        instancesList.push({
            name: "Accueil",
            status: { ip: "serveur.haiko.fr", port: 25565, nameServer: "Accueil" },
            whitelistActive: false,
            whitelist: [],
            url: null,
            loadder: {
                minecraft_version: "1.21",
                loadder_type: "none",
                loadder_version: null
            },
            verify: false,
            ignored: [],
            isWelcome: true, // Flag pour identifier l'instance d'accueil
            logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+" // Logo maison moderne en base64 SVG
        })
        
        instances = Object.entries(instances)

        for (let [name, data] of instances) {
            let instance = data
            instance.name = name
            // Récupérer le logo depuis le status, sinon utiliser le logo maison par défaut
            if (instance.status && instance.status.logo) {
                instance.logo = instance.status.logo
            } else if (!instance.logo) {
                instance.logo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+"
            }
            instancesList.push(instance)
        }
        return instancesList
    }

    async getNews() {
        let config = await this.GetConfig() || {}

        if (config.rss) {
            return new Promise((resolve, reject) => {
                nodeFetch(config.rss).then(async config => {
                    if (config.status === 200) {
                        let news = [];
                        let response = await config.text()
                        response = (JSON.parse(convert.xml2json(response, { compact: true })))?.rss?.channel?.item;

                        if (!Array.isArray(response)) response = [response];
                        for (let item of response) {
                            news.push({
                                title: item.title._text,
                                content: item['content:encoded']._text,
                                author: item['dc:creator']._text,
                                publish_date: item.pubDate._text
                            })
                        }
                        return resolve(news);
                    }
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => reject({ error }))
            })
        } else {
            return new Promise((resolve, reject) => {
                nodeFetch(news).then(async config => {
                    if (config.status === 200) return resolve(config.json());
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => {
                    return reject({ error });
                })
            })
        }
    }
}

export default new Config;