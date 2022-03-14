'use strict';

import { logger } from '../utils.js';

const { launch, mojang } = require('minecraft-java-core');

class Home {
    static id = "home";
    init(config) {
        this.config = config

        this.launch()

    }

    async launch() {
        let mc = await mojang.getAuth('luuxis')
        document.querySelector(".play-btn").addEventListener("click", () => {            
            let opts = {
                url: "http://launcher.selvania.fr/luuxis",
                authenticator: mc,
                path: "./AppData/.Minecraft",
                version: "1.18.2",
                detached: false,

                java: true,
                args: [],
                custom: true,

                server: {
                    ip: "mc.hypixel.net",
                    port: 25565,
                    autoconnect: false,
                },

                verify: true,
                ignored: ["options.txt", ".fabric", "config", "logs", "ressourcepacks", "shaderpacks", "crash-reports"],

                memory: {
                    min: `3G`,
                    max: `6G`
                }
            }

            launch.launch(opts);

            launch.on('progress', (DL, totDL) => {
                console.log(`Téléchargement ${((DL / totDL) * 100).toFixed(0)}%`)
            });

            launch.on('speed', (speed) => {
                console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
            })

            launch.on('data', (e) => {
                new logger('Minecraft', '#36b030', document.querySelector(".log-content"));
                console.log(e)
            })
        })
    }
}
export default Home;