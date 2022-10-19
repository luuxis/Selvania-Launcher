/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { database, changePanel, accountSelect, Slider } from '../utils.js';
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

const os = require('os');

class Settings {
    static id = "settings";
    async init(config) {
        this.config = config;
        this.database = await new database().init();
        this.initSettingsDefault();
        this.initTab();
        this.initAccount();
        this.initRam();
        this.initJavaPath();
        this.initJavaArgs();
        this.initResolution();
        this.initLauncherSettings();
    }

    initAccount() {
        document.querySelector('.accounts').addEventListener('click', async(e) => {
            let uuid = e.target.id;
            let selectedaccount = await this.database.get('1234', 'accounts-selected');

            if (e.path[0].classList.contains('account')) {
                accountSelect(uuid);
                this.database.update({ uuid: "1234", selected: uuid }, 'accounts-selected');
            }

            if (e.target.classList.contains("account-delete")) {
                this.database.delete(e.path[1].id, 'accounts');

                document.querySelector('.accounts').removeChild(e.path[1])
                if (!document.querySelector('.accounts').children.length) {
                    changePanel("login");
                    return
                }

                if (e.path[1].id === selectedaccount.value.selected) {
                    let uuid = (await this.database.getAll('accounts'))[0].value.uuid
                    this.database.update({
                        uuid: "1234",
                        selected: uuid
                    }, 'accounts-selected')
                    accountSelect(uuid)
                }
            }
        })

        document.querySelector('.add-account').addEventListener('click', () => {
            document.querySelector(".cancel-login").style.display = "contents";
            changePanel("login");
        })
    }

    async initRam() {
        let ramDatabase = (await this.database.get('1234', 'ram'))?.value;
        let totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
        let freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;

        document.getElementById("total-ram").textContent = `${totalMem} Go`;
        document.getElementById("free-ram").textContent = `${freeMem} Go`;

        let sliderDiv = document.querySelector(".memory-slider");
        sliderDiv.setAttribute("max", Math.trunc((80 * totalMem) / 100));

        let ram = ramDatabase ? ramDatabase : { ramMin: "1", ramMax: "2" };
        let slider = new Slider(".memory-slider", parseFloat(ram.ramMin), parseFloat(ram.ramMax));

        let minSpan = document.querySelector(".slider-touch-left span");
        let maxSpan = document.querySelector(".slider-touch-right span");

        minSpan.setAttribute("value", `${ram.ramMin} Go`);
        maxSpan.setAttribute("value", `${ram.ramMax} Go`);

        slider.on("change", (min, max) => {
            minSpan.setAttribute("value", `${min} Go`);
            maxSpan.setAttribute("value", `${max} Go`);
            this.database.update({ uuid: "1234", ramMin: `${min}`, ramMax: `${max}` }, 'ram')
        });
    }

    async initJavaPath() {
        let javaDatabase = (await this.database.get('1234', 'java-path'))?.value?.path;
        let javaPath = javaDatabase ? javaDatabase : 'Utiliser la version de java livre avec le launcher';
        document.querySelector(".info-path").textContent = `${dataDirectory.replace(/\\/g, "/")}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}/runtime`;

        let path = document.querySelector(".path");
        path.value = javaPath;
        let file = document.querySelector(".path-file");

        document.querySelector(".path-button").addEventListener("click", async() => {
            file.value = '';
            file.click();
            await new Promise((resolve) => {
                let interval;
                interval = setInterval(() => {
                    if (file.value != '') resolve(clearInterval(interval));
                }, 100);
            });

            if (file.value.replace(".exe", '').endsWith("java") || file.value.replace(".exe", '').endsWith("javaw")) {
                this.database.update({ uuid: "1234", path: file.value }, 'java-path');
                path.value = file.value.replace(/\\/g, "/");
            } else alert("Le nom du fichier doit être java ou javaw");

        });

        document.querySelector(".path-button-reset").addEventListener("click", () => {
            path.value = 'Utiliser la version de java livre avec le launcher';
            file.value = '';
            this.database.update({ uuid: "1234", path: false }, 'java-path');
        });
    }

    async initJavaArgs() {
        let javaArgsDatabase = (await this.database.get('1234', 'java-args'))?.value?.args;
        let argsInput = document.querySelector(".args-settings");

        if (javaArgsDatabase?.length) argsInput.value = javaArgsDatabase.join(' ');
    
        document.querySelector('.args-settings').addEventListener('change', () => {
            let args = [];
            try {
                if (argsInput.value.length) {
                    argsInput = argsInput.value.trim().split(/\s+/)
                    for(let arg of argsInput) {
                        if (arg === '') continue;
                        if (arg === '--server' || arg === '--port') continue;
                        args.push(arg);
                    }
                }
            } finally {
                this.database.update({ uuid: "1234", args: args }, 'java-args');
            }
        });
    }

    async initResolution() {
        let resolutionDatabase = (await this.database.get('1234', 'screen'))?.value?.screen;
        let resolution = resolutionDatabase ? resolutionDatabase : { width: "1280", height: "720" };
        
        let width = document.querySelector(".width-size");
        width.value = resolution.width;
        
        let height = document.querySelector(".height-size");
        height.value = resolution.height;
    
        let select = document.getElementById("select");
        select.addEventListener("change", (event) => {
            let resolution = select.options[select.options.selectedIndex].value.split(" x ");
            select.options.selectedIndex = 0;
            
            width.value = resolution[0];
            height.value = resolution[1];
            this.database.update({ uuid: "1234", screen: { width: resolution[0], height: resolution[1] } }, 'screen');
        });
    }

    async initLauncherSettings() {
        let launcherDatabase = (await this.database.get('1234', 'launcher'))?.value;
        let settingsLauncher = {
            uuid: "1234",
            launcher: {
                close: launcherDatabase?.launcher?.close || 'close-launcher'
            }
        }

        let closeLauncher = document.getElementById("launcher-close");
        let closeAll = document.getElementById("launcher-close-all");
        let openLauncher = document.getElementById("launcher-open");

        if(settingsLauncher.launcher.close === 'close-launcher') {
            closeLauncher.checked = true;
        } else if(settingsLauncher.launcher.close === 'close-all') {
            closeAll.checked = true;
        } else if(settingsLauncher.launcher.close === 'open-launcher') {
            openLauncher.checked = true;
        }

        closeLauncher.addEventListener("change", () => {
            if(closeLauncher.checked) {
                openLauncher.checked = false;
                closeAll.checked = false;
            }
           if(!closeLauncher.checked) closeLauncher.checked = true;
            settingsLauncher.launcher.close = 'close-launcher';
            this.database.update(settingsLauncher, 'launcher');
        })

        closeAll.addEventListener("change", () => {
            if(closeAll.checked) {
                closeLauncher.checked = false;
                openLauncher.checked = false;
            }
            if(!closeAll.checked) closeAll.checked = true;
            settingsLauncher.launcher.close = 'close-all';
            this.database.update(settingsLauncher, 'launcher');
        })

        openLauncher.addEventListener("change", () => {
            if(openLauncher.checked) {
                closeLauncher.checked = false;
                closeAll.checked = false;
            }
            if(!openLauncher.checked) openLauncher.checked = true;
            settingsLauncher.launcher.close = 'open-launcher';
            this.database.update(settingsLauncher, 'launcher');
        })
    }

    initTab() {
        let TabBtn = document.querySelectorAll('.tab-btn');
        let TabContent = document.querySelectorAll('.tabs-settings-content');

        for (let i = 0; i < TabBtn.length; i++) {
            TabBtn[i].addEventListener('click', () => {
                if (TabBtn[i].classList.contains('save-tabs-btn')) return
                for (let j = 0; j < TabBtn.length; j++) {
                    TabContent[j].classList.remove('active-tab-content');
                    TabBtn[j].classList.remove('active-tab-btn');
                }
                TabContent[i].classList.add('active-tab-content');
                TabBtn[i].classList.add('active-tab-btn');
            });
        }

        document.querySelector('.save-tabs-btn').addEventListener('click', () => {
            document.querySelector('.default-tab-btn').click();
            changePanel("home");
        })
    }

    async initSettingsDefault() {
        if (!(await this.database.getAll('accounts-selected')).length) {
            this.database.add({ uuid: "1234" }, 'accounts-selected')
        }

        if (!(await this.database.getAll('java-path')).length) {
            this.database.add({ uuid: "1234", path: false }, 'java-path')
        }

        if (!(await this.database.getAll('java-args')).length) {
            this.database.add({ uuid: "1234", args: [] }, 'java-args')
        }

        if (!(await this.database.getAll('launcher')).length) {
            this.database.add({
                uuid: "1234",
                launcher: {
                    close: 'close-launcher'
                }
            }, 'launcher')
        }

        if (!(await this.database.getAll('ram')).length) {
            this.database.add({ uuid: "1234", ramMin: "1", ramMax: "2" }, 'ram')
        }

        if (!(await this.database.getAll('screen')).length) {
            this.database.add({ uuid: "1234", screen: { width: "1280", height: "720" } }, 'screen')
        }
    }
}
export default Settings;