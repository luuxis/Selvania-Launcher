'use strict';

import { database, changePanel, accountSelect } from '../utils.js';

class Settings {
    static id = "settings";
    async init() {
        this.database = await new database().init();
        this.initSettingsDefault();
        this.initTab();
        this.initAccount();
    }

    initAccount() {
        document.querySelector('.accounts').addEventListener('click', (e) => {
            let uuid = e.target.id;

            if (e.path[0].classList.contains('account')) {
                accountSelect(uuid);
                this.database.update({ uuid: "1234", selected: uuid }, 'accounts-selected');
            }

            if (e.target.classList.contains("account-delete")) {
                this.database.delete(e.path[1].id, 'accounts');
                document.querySelector('.accounts').removeChild(e.path[1])
                if (!document.querySelector('.accounts').children.length) {
                    changePanel("login");
                }
            }
        })

        document.querySelector('.add-account').addEventListener('click', () => {
            document.querySelector(".cancel-login").style.display = "contents";
            changePanel("login");
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

        if (!(await this.database.getAll('java')).length) {
            this.database.add({ uuid: "1234" }, 'java')
        }

        if (!(await this.database.getAll('launcher')).length) {
            this.database.add({ uuid: "1234" }, 'launcher')
        }

        if (!(await this.database.getAll('ram')).length) {
            this.database.add({
                uuid: "1234",
                ramMin: "1024",
                ramMax: "2048"
            }, 'ram')
        }

        if (!(await this.database.getAll('screen')).length) {
            this.database.add({ uuid: "1234" }, 'screen')
        }

    }
}
export default Settings;