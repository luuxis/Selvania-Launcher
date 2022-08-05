/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

class Login {
    static id = "login";
    async init(config) {
        this.config = config;
        this.config.online ? this.getOnline() : this.getOffline()
    }

    getOnline() {
        document.querySelector('.login-text p').innerHTML = 'Un compte Minecraft est requis pour jouer.';
    }

    getOffline() {
        document.querySelector('.login-text p').innerHTML = 'Un compte Minecraft ou un pseudo est requis pour jouer.';
        document.querySelector('.offline').style.display = 'block';
    }
}
export default Login;