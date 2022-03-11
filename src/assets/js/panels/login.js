'use strict';

import { config, database } from '../utils.js';

const { microsoft, mojang } = require('minecraft-java-core');

class Login {
    static id = "login";
    async init() {
        this.database = await new database().init();

        this.link();
        config.config().then(res => {
            if (!res.online) this.online()
            else this.offline()
        })
        document.querySelector(".mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "none";
            document.querySelector(".login-card-mojang").style.display = "block";
        })
    }

    online() {
        this.loginmojang();
        this.loginmicrosoft();
    }

    offline() {
        this.loginoffline();
        this.loginmicrosoft();
    }

    link() {
        document.querySelector(".store").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/store/minecraft-java-edition")
        })
        document.querySelector(".loginSpanDim").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/password/forgot")
        })
    }

    loginmojang() {}
    loginmicrosoft() {
        document.querySelector(".microsoft").addEventListener("click", () => {
            new microsoft().getAuth().then(user => {
                this.database.add({
                    access_token: user.access_token,
                    client_token: user.client_token,
                    uuid: user.uuid,
                    name: user.name,
                    refresh_token: user.refresh_token,
                    user_properties: user.user_properties,
                    meta: {
                        type: user.meta.type,
                        demo: user.meta.demo
                    }
                }, 'accounts')

                this.database.add({
                    uuid: user.uuid,
                    skins: user.profile.skins,
                    cape: user.profile.capes
                }, 'profile')
            })
        })
    }
    loginoffline() {}
}

export default Login;