'use strict';

import { logger, database, changePanel } from '../utils.js';

const { launch } = require('minecraft-java-core');
const pkg = nw.global.manifest.__nwjs_manifest;

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? `${process.env.HOME}/Library/Application Support` : process.env.HOME)

class Home {
    static id = "home";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        this.initLaunch();
        this.initBtn();
    }

    initLaunch() {
        document.querySelector('.play-btn').addEventListener('click', async () => {
            let urlpkg = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url;
            let uuid = (await this.database.get('1234', 'accounts-selected')).value;
            let account = (await this.database.get(uuid.selected, 'accounts')).value;
            let ram = (await this.database.get('1234', 'ram')).value;
            let javaPath = (await this.database.get('1234', 'java-path')).value;
            let javaArgs = (await this.database.get('1234', 'java-args')).value;
            let Resolution = (await this.database.get('1234', 'screen')).value;

            let playBtn = document.querySelector('.play-btn');
            let info = document.querySelector(".text-download")
            let progressBar = document.querySelector(".progress-bar")
            let logcontent = document.querySelector(".log-content")

            let opts = {
                url: this.config.game_url === "" || this.config.game_url === undefined ? `${urlpkg}/files` : this.config.game_url,
                authenticator: account,
                path: `${dataDirectory}/${this.config.dataDirectory}`,
                version: this.config.game_version,
                detached: false,
                java: this.config.java,
                javapath: javaPath.path,
                args: [...javaArgs.args, ...this.config.game_args],
                // screen: {
                //     width: Resolution.screen.width,
                //     height: Resolution.screen.height
                // },
                custom: this.config.custom,
                verify: this.config.verify,
                ignored: this.config.ignored,
                memory: {
                    min: `${ram.ramMin * 1024}M`,
                    max: `${ram.ramMax * 1024}M`
                }
            }

            playBtn.style.display = "none"
            info.style.display = "block"
            launch.launch(opts);

            launch.on('progress', (DL, totDL) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Téléchargement ${((DL / totDL) * 100).toFixed(0)}%`
                progressBar.value = DL;
                progressBar.max = totDL;
            })
        
            launch.on('speed', (speed) => {
                console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
            })
        
            launch.on('check', (e) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Vérification ${((DL / totDL) * 100).toFixed(0)}%`
                progressBar.value = DL;
                progressBar.max = totDL;
        
            })
        
            launch.on('data', (e) => {
                new logger('Minecraft', '#36b030', logcontent);
                info.innerHTML = `Demarrage en cours...`
                console.log(e);
            })
        
            launch.on('close', () => {
                progressBar.style.display = "none"
                info.style.display = "none"
                playBtn.style.display = "block"
                info.innerHTML = `Vérification`
                new logger('Launcher', '#7289da', logcontent);
                console.log('Close');
            })
        })
    }

    initBtn() {
        document.querySelector('.settings-btn').addEventListener('click', () => {
            changePanel('settings');
        });            
    }
}
export default Home;