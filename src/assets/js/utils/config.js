const pkg = nw.global.manifest.__nwjs_manifest;
const fetch = require("node-fetch")
const convert = require('xml-js');
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;
let news = `${url}/launcher/news-launcher/rss.php`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            fetch(config).then(config => {
                return resolve(config.json());
            }).catch(error => {
                return reject(error);
            })
        })
    }

    async GetNews() {
        let rss = await fetch(news);
        if (rss.status === 200) {
            let rssparse = JSON.parse(convert.xml2json(await rss.text(), { compact: true }));
            let data = [];
            if (rssparse?.rss?.channel?.item?.length) {
                for (let i of rssparse.rss.channel.item) {
                    let item = {}
                    item.title = i.title._text;
                    item.content = i.content._text;
                    item.author = i.author._text;
                    item.publish_date = i.publish_date._text;
                    data.push(item);
                }
            } else {
                let item = {}
                item.title = rssparse?.rss?.channel?.item?.title?._text;
                item.content = rssparse?.rss?.channel?.item?.content?._text;
                item.author = rssparse?.rss?.channel?.item?.author?._text;
                item.publish_date = rssparse?.rss?.channel?.item?.publish_date?._text;
                data.push(item);
            }
            return data;
        } else {    
            return false;
        }
    }
}

export default new Config;