'use strict';

import { database, changePanel } from '../utils.js';

class Settings {
    static id = "settings";
    async init() {
        this.database = await new database().init();
        this.inittab();
        this.initBtn();
    }

    initBtn() {
        document.querySelector('.accounts').addEventListener('click', (e) => {
            let uuid = e.target.id;
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

    inittab() {
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
    }
}
export default Settings;