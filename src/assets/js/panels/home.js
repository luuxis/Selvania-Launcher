'use strict';

import { logger, database, changePanel } from '../utils.js';

const { launch } = require('minecraft-java-core');
const pkg = nw.global.manifest.__nwjs_manifest;

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

class Home {
    static id = "home";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        this.initBtn();
    }

    launch(data) {
        let { account, settings } = data;
        document.querySelector(".play-btn").style.display = "none"
        document.querySelector(".text-download").style.display = "block"

        let opts = {
            url: this.config.game_url === "" || this.config.game_url === undefined ? `${pkg.url}/files` : this.config.game_url,
            authenticator: account,
            path: `${dataDirectory}/${this.config.dataDirectory}`,
            version: this.config.game_version,
            detached: settings.detached,
            java: this.config.java,
            args: this.config.game_args,
            custom: this.config.custom,
            verify: this.config.verify,
            ignored: this.config.ignored,
            memory: {
                min: `${settings.RamMin}M`,
                max: `${settings.RamMax}M`
            }
        }

        launch.launch(opts);
        launch.on('progress', (DL, totDL) => {
            document.querySelector(".progress-bar").style.display = "block"
            document.querySelector(".text-download").innerHTML = `Téléchargement ${((DL / totDL) * 100).toFixed(0)}%`
            document.querySelector(".progress-bar").value = DL;
            document.querySelector(".progress-bar").max = totDL;
        })

        launch.on('speed', (speed) => {

        })

        launch.on('check', (e) => {

        })

        launch.on('data', (e) => {

            new logger('Minecraft', '#36b030', document.querySelector(".log-content"));
            console.log(e);

        })

        launch.on('close', () => {
            document.querySelector(".progress-bar").style.display = "none"
            document.querySelector(".text-download").style.display = "none"
            document.querySelector(".text-download").innerHTML = `Vérification`
            document.querySelector(".play-btn").style.display = "block"
            new logger('Launcher', '#7289da', document.querySelector(".log-content"))
            console.log('Close');
        })
    }

    initBtn() {
        document.querySelector('.settings-btn').addEventListener('click', () => {
            changePanel('settings');
        });

        document.querySelector('.play-btn').addEventListener('click', async() => {
            let mc = (await this.database.getAll('accounts'))[0]?.value;
            let data = {
                account: mc,
                settings: {
                    RamMin: '2048',
                    RamMax: '4048',
                    detached: false
                }
            }
            this.launch(data);
        })
    }
}
export default Home;