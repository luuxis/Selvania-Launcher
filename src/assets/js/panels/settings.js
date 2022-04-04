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
        let ramDatabase = await this.database.get('1234', 'ram').value;
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
        let javaDatabase = await this.database.get('1234', 'java-path');
        let javaPath = javaDatabase ? javaDatabase.value.path : null;
        document.querySelector("#info-path").textContent = `${dataDirectory.replace(/\\/g, "/")}/${this.config.dataDirectory}/runtime`;

        let path = document.querySelector(".path");
        path.value = javaPath;
        let file = document.querySelector(".path-file");

        document.querySelector(".path-button").addEventListener("click", async() => {
            file.value = "";
            file.click();
            await new Promise((resolve) => {
                let interval;
                interval = setInterval(() => {
                    if (file.value != "") resolve(clearInterval(interval));
                }, 100);
            });

            if (file.value.replace(".exe", "").endsWith("java") || file.value.replace(".exe", "").endsWith("javaw")) {
                this.database.update({ uuid: "1234", path: file.value }, 'java-path');
                path.value = file.value.replace(/\\/g, "/");
            } else alert("Le nom du fichier doit être java ou javaw");

        });

        document.querySelector(".path-button-reset").addEventListener("click", () => {
            path.value = "";
            file.value = "";
            this.database.update({ uuid: "1234", path: null }, 'java-path');
        });
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
            this.database.add({ uuid: "1234", path: null }, 'java-path')
        }

        if (!(await this.database.getAll('java-args')).length) {
            this.database.add({ uuid: "1234", args: null }, 'java-args')
        }

        if (!(await this.database.getAll('launcher')).length) {
            this.database.add({ uuid: "1234" }, 'launcher')
        }

        if (!(await this.database.getAll('ram')).length) {
            this.database.add({
                uuid: "1234",
                ramMin: "1",
                ramMax: "2"
            }, 'ram')
        }

        if (!(await this.database.getAll('screen')).length) {
            this.database.add({ uuid: "1234" }, 'screen')
        }

    }
}
export default Settings;