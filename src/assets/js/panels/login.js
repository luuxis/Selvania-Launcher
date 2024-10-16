/**
 * @author superstrella
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0
 */
const { AZauth, Mojang } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');

import { popup, database, changePanel, accountSelect, addAccount, config, setStatus } from '../utils.js';

class Login {
    static id = "login";
    async init(config) {
        this.config = config;
        this.db = new database();

        if (typeof this.config.online == 'boolean') {
            this.config.online ? this.getMicrosoft() : this.getCrack()
        } else if (typeof this.config.online == 'string') {
            if (this.config.online.match(/^(http|https):\/\/[^ "]+$/)) {
                this.getAZauth();
            }
        }
        
        document.querySelector('.cancel-home').addEventListener('click', () => {
            document.querySelector('.cancel-home').style.display = 'none'
            changePanel('settings')
        })

        document.querySelector('.connect-mojang').addEventListener('click', () => {
            this.getAZauth();
            document.querySelector('.cancel-AZauth2').style.display = "";
            document.querySelector('.login-bg-overlay').style.display = 'block';
            document.querySelector('.cancel-AZauth2').addEventListener('click', () => {
                document.querySelector('.login-AZauth').style.display = "none";
                document.querySelector('.login-bg-overlay').style.display = "none";
            })
        })
    }

    async getMicrosoft() {
        console.log('Inicializando Microsoft login...');
        let popupLogin = new popup();
        let loginHome = document.querySelector('.login-home');
        let microsoftBtn = document.querySelector('.connect-home');
        loginHome.style.display = 'block';

        microsoftBtn.addEventListener("click", () => {
            popupLogin.openPopup({
                title: 'Esperando su inicio de sesión...',
                content: 'Por favor, inicia sesión en la ventana de Microsoft que le aparecerá ahora.',
                color: 'var(--color)'
            });

            ipcRenderer.invoke('Microsoft-window', this.config.client_id).then(async account_connect => {
                if (account_connect == 'cancel' || !account_connect) {
                    popupLogin.closePopup();
                    return;
                } else {
                    await this.saveData(account_connect)
                    popupLogin.closePopup();
                }

            }).catch(err => {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: err,
                    options: true
                });
            });
        })
    }

    async getCrack() {
        console.log('Inicializando offline login...');
        let popupLogin = new popup();
        let loginOffline = document.querySelector('.login-offline');

        let emailOffline = document.querySelector('.email-offline');
        let connectOffline = document.querySelector('.connect-offline');
        loginOffline.style.display = 'block';

        connectOffline.addEventListener('click', async () => {
            if (emailOffline.value.length < 3) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: 'Su apodo debe tener al menos 3 caracteres.',
                    options: true
                });
                return;
            }

            if (emailOffline.value.match(/ /g)) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: 'Tu apodo no debe contener espacios.',
                    options: true
                });
                return;
            }

            let MojangConnect = await Mojang.login(emailOffline.value);

            if (MojangConnect.error) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: MojangConnect.message,
                    options: true
                });
                return;
            }
            await this.saveData(MojangConnect)
            popupLogin.closePopup();
        });
    }

    async getAZauth() {
        console.log('Inicializando AZauth login...');
        let AZauthClient = new AZauth(this.config.online);
        let popupLogin = new popup();
        let loginAZauth = document.querySelector('.login-AZauth');
        let loginAZauthA2F = document.querySelector('.login-AZauth-A2F');

        let AZauthEmail = document.querySelector('.email-AZauth');
        let AZauthPassword = document.querySelector('.password-AZauth');
        let AZauthA2F = document.querySelector('.A2F-AZauth');
        let connectAZauthA2F = document.querySelector('.connect-AZauth-A2F');
        let AZauthConnectBTN = document.querySelector('.connect-AZauth');
        let AZauthCancelA2F = document.querySelector('.cancel-AZauth-A2F');
        let loginOffline = document.querySelector('.login-offline');

        let connectOffline = document.querySelector('.connect-offline');

        loginAZauth.style.display = 'block';

        AZauthConnectBTN.addEventListener('click', async () => {
            if (AZauthEmail.value.length < 3) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: 'Su apodo debe tener al menos 3 caracteres.',
                    options: true
                });
                return;
            }

            if (AZauthEmail.value.match(/ /g)) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: 'Tu apodo no debe contener espacios.',
                    options: true
                });
                return;
            }

            let MojangConnect = await Mojang.login(AZauthEmail.value);

            if (MojangConnect.error) {
                popupLogin.openPopup({
                    title: '¡Error!',
                    content: MojangConnect.message,
                    options: true
                });
                return;
            }
            await this.saveData(MojangConnect)
            popupLogin.closePopup();
        });
    }

    async saveData(connectionData) {
        let configClient = await this.db.readData('configClient');
        let account = await this.db.createData('accounts', connectionData)
        let instanceSelect = configClient.instance_selct
        let instancesList = await config.getInstanceList()
        configClient.account_selected = account.ID;

        for (let instance of instancesList) {
            if (instance.whitelistActive) {
                let whitelist = instance.whitelist.find(whitelist => whitelist == account.name)
                if (whitelist !== account.name) {
                    if (instance.name == instanceSelect) {
                        let newInstanceSelect = instancesList.find(i => i.whitelistActive == false)
                        configClient.instance_selct = newInstanceSelect.name
                        await setStatus(newInstanceSelect.status)
                    }
                }
            }
        }

        await this.db.updateData('configClient', configClient);
        await addAccount(account);
        await accountSelect(account);
        changePanel('home');
    }
}
export default Login;