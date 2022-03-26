'use strict';

import { database, changePanel } from '../utils.js';

class Settings {
    static id = "settings";
    async init() {
        this.database = await new database().init();
        this.initBtn();
    }

    initBtn() {
        document.querySelector('.accounts').addEventListener('click', (e) => {
            let uuid = e.target.id;
            if (e.target.classList.contains("account-delete")) {
                this.database.delete(e.path[1].id, 'accounts');
                document.querySelector('.accounts').removeChild(e.path[1])
                if (document.querySelector('.accounts').children.length == 1) {
                    changePanel("login");
                }
            }
        })

        document.querySelector('.add-account').addEventListener('click', () => {
            document.querySelector(".cancel-login").style.display = "contents";
            changePanel("login");
        })
    }
}
export default Settings;