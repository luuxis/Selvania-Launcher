'use strict';

import { database, changePanel, addAccount } from '../utils.js';
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

    loginmojang() {
        document.querySelector(".login-btn").addEventListener("click", () => {
            mojang.getAuth(document.querySelector(".Mail").value, document.querySelector(".Password").value).then(user => {
                if (!user) return;

                let account = {
                    access_token: user.access_token,
                    client_token: user.client_token,
                    uuid: user.uuid,
                    name: user.name,
                    user_properties: user.user_properties,
                    meta: {
                        type: user.meta.type,
                        offline: user.meta.offline
                    }
                }

                this.database.add(account, 'accounts')
                addAccount(account)
                changePanel('home');
            })
        })
    }

    loginmicrosoft() {
        document.querySelector(".microsoft").addEventListener("click", () => {
            document.querySelector(".microsoft").disabled = true;
            new microsoft(this.config.client_id).getAuth().then(user => {
                if (!user){
                    document.querySelector(".microsoft").disabled = false;
                    return;
                }

                let account = {
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
                }

                let profile = {
                    uuid: user.uuid,
                    skins: user.profile.skins,
                    cape: user.profile.cape
                }

                this.database.add(account, 'accounts')
                this.database.add(profile, 'profile')
                addAccount(account)
                changePanel("home");
            }).catch (err => {
                document.querySelector(".microsoft").disabled = false;
            })
        })
    }

    loginoffline() {
        document.querySelector(".login-btn").addEventListener("click", () => {
            mojang.getAuth(document.querySelector(".Mail").value).then(user => {
                if (!user) return;

                let account = {
                    access_token: user.access_token,
                    client_token: user.client_token,
                    uuid: user.uuid,
                    name: user.name,
                    user_properties: user.user_properties,
                    meta: {
                        type: user.meta.type,
                        offline: user.meta.offline
                    }
                }
                this.database.add(account, 'accounts')
                addAccount(account)
                changePanel('home');
            })
        })
    }

    InitBtn() {
        document.querySelector(".mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "none";
            document.querySelector(".login-card-mojang").style.display = "block";
        })

        document.querySelector(".cancel-mojang").addEventListener("click", () => {
            document.querySelector(".login-card").style.display = "block";
            document.querySelector(".login-card-mojang").style.display = "none";
        })

        document.querySelector(".cancel-login").addEventListener("click", () => {
            document.querySelector(".cancel-login").style.display = "none";
            changePanel("settings");
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