'use strict';

import { config, database } from '../utils.js';

const { microsoft, mojang } = require('minecraft-java-core');

class Login {
    static id = "login";
    async init() {
        this.database = await new database().init();
        this.config = await config.config().then(res => res);


        if (this.config.online) this.online()
        else this.offline()


        document.querySelector(".mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "none";
            document.querySelector(".login-card-mojang").style.display = "block";
        })

        document.querySelector(".store").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/store/minecraft-java-edition")
        })
        document.querySelector(".loginSpanDim").addEventListener("click", () => {
            nw.Shell.openExternal("https://www.minecraft.net/password/forgot")
        })
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
            })
        })
    }
    loginoffline() {}
}

export default Login;