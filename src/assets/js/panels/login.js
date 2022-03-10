'use strict';

import { config } from '../utils.js';

const { microsoft, mojang } = require('minecraft-java-core');

class Login {
    static id = "login";
    init() {
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
    loginmicrosoft() {}
    loginoffline() {}
}

export default Login;