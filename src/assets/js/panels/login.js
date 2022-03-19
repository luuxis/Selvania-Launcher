'use strict';

import { database, changePanel } from '../utils.js';
const { microsoft, mojang } = require('minecraft-java-core');

class Login {
    static id = "login";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        if (this.config.online) this.online()
        else this.offline()
        this.InitBtn();
    }

    online() {
        console.log(`Initializing microsoft Panel...`)
        console.log(`Initializing mojang Panel...`)
        this.loginmojang();
        this.loginmicrosoft();
    }

    offline() {
        console.log(`Initializing microsoft Panel...`)
        console.log(`Initializing mojang Panel...`)
        console.log(`Initializing offline Panel...`)
        this.loginoffline();
        this.loginmicrosoft();
    }

    loginmojang() {}
    loginmicrosoft() {
        document.querySelector(".microsoft").addEventListener("click", () => {
            new microsoft().getAuth().then(user => {
                if (!user) return;

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
                    cape: user.profile.cape
                }, 'profile')

                changePanel("home");
            })
        })
    }
    loginoffline() {}

    InitBtn() {
        document.querySelector(".mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "none";
            document.querySelector(".login-card-mojang").style.display = "block";
        })

        document.querySelector(".cancel-mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "block";
            document.querySelector(".login-card-mojang").style.display = "none";
        })

        document.querySelector(".store").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/store/minecraft-java-edition")
        })
        document.querySelector(".password-reset").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/password/forgot")
        })
    }

}

export default Login;