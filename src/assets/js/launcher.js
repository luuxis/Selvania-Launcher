/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */
// import panel
import Login from './panels/login.js';
import Home from './panels/home.js';
import Settings from './panels/settings.js';

// import modules
import { logger, config, changePanel, database, popup, setBackground, accountSelect, addAccount, pkg } from './utils.js';
const { AZauth, Microsoft, Mojang } = require('minecraft-java-core');

// libs
const { ipcRenderer } = require('electron');
const fs = require('fs');

class Launcher {
    async init() {
        this.initLog();
        console.log('Initializing Launcher...');
        this.shortcut()
        await setBackground()
        if (process.platform == 'win32') this.initFrame();
        this.config = await config.GetConfig().then(res => res).catch(err => err);
        if (await this.config.error) return this.errorConnect()
        this.db = new database();
        await this.initConfigClient();
        this.createPanels(Login, Home, Settings);
        this.startLauncher();
    }

    initLog() {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73 || e.keyCode == 123) {
                ipcRenderer.send('main-window-dev-tools-close');
                ipcRenderer.send('main-window-dev-tools');
            }
        })
        new logger(pkg.name, '#7289da')
    }

    shortcut() {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.keyCode == 87) {
                ipcRenderer.send('main-window-close');
            }
        })
    }


    errorConnect() {
        new popup().openPopup({
            title: this.config.error.code,
            content: this.config.error.message,
            color: 'red',
            exit: true,
            options: true
        });
    }

    initFrame() {
        console.log('Initializing Frame...')
        document.querySelector('.frame').classList.toggle('hide')
        document.querySelector('.dragbar').classList.toggle('hide')

        document.querySelector('#minimize').addEventListener('click', () => {
            ipcRenderer.send('main-window-minimize');
        });

        let maximized = false;
        let maximize = document.querySelector('#maximize')
        maximize.addEventListener('click', () => {
            if (maximized) ipcRenderer.send('main-window-maximize')
            else ipcRenderer.send('main-window-maximize');
            maximized = !maximized
            maximize.classList.toggle('icon-maximize')
            maximize.classList.toggle('icon-restore-down')
        });

        document.querySelector('#close').addEventListener('click', () => {
            ipcRenderer.send('main-window-close');
        })
    }

    async initConfigClient() {
        console.log('Initializing Config Client...')
        let configClient = await this.db.readData('configClient')

        if (!configClient) {
            await this.db.createData('configClient', {
                account_selected: null,
                instance_selct: null,
                java_config: {
                    java_path: null,
                    java_memory: {
                        min: 2,
                        max: 4
                    }
                },
                game_config: {
                    screen_size: {
                        width: 854,
                        height: 480
                    }
                },
                launcher_config: {
                    download_multi: 5,
                    theme: 'auto',
                    closeLauncher: 'close-launcher',
                    intelEnabledMac: true
                }
            })
        }
    }

    createPanels(...panels) {
        let panelsElem = document.querySelector('.panels')
        for (let panel of panels) {
            console.log(`Initializing ${panel.name} Panel...`);
            let div = document.createElement('div');
            div.classList.add('panel', panel.id)
            div.innerHTML = fs.readFileSync(`${__dirname}/panels/${panel.id}.html`, 'utf8');
            panelsElem.appendChild(div);
            let instance = new panel();
            instance.init(this.config);
            
            // Stocker l'instance globalement pour y accéder depuis d'autres panels
            if (panel.id === 'login') {
                window.loginPanelInstance = instance;
                console.log('Stored login panel instance globally');
            }
        }
    }

    async startLauncher() {
        let accounts = await this.db.readAllData('accounts')
        let configClient = await this.db.readData('configClient')
        let account_selected = configClient ? configClient.account_selected : null
        let popupRefresh = new popup();

        // NETTOYER SEULEMENT les modes d'auth temporaires (PAS le flag coming_from_settings)
        if (configClient) {
            delete configClient.temp_auth_mode;
            // NE PAS supprimer coming_from_settings ici car il est nécessaire pour la navigation
            if (configClient.launcher_config) {
                delete configClient.launcher_config.authMode;
                delete configClient.launcher_config.last_auth_mode;
            }
            await this.db.updateData('configClient', configClient);
            console.log('Cleaned temp auth modes on launcher startup (preserved coming_from_settings)');
        }

        if (accounts?.length) {
            for (let account of accounts) {
                let account_ID = account.ID
                if (account.error) {
                    await this.db.deleteData('accounts', account_ID)
                    continue
                }
                
                // Ajouter le type de compte SEULEMENT s'il n'existe pas ET qu'il n'y a pas de tag permanent
                if (!account.account_type && !account.original_auth_method) {
                    // Utiliser la logique améliorée qui respecte les nouveaux tags
                    if (account.auth_source === 'offline' || account.type === 'offline' || account.meta?.online === false) {
                        account.account_type = 'crack';
                        account.auth_source = 'offline';
                        account.original_auth_method = 'crack';
                    } else if (account.auth_source === 'microsoft' || account.auth_source === 'azauth' || account.access_token || account.meta?.type === 'Xbox' || account.meta?.type === 'AZauth') {
                        account.account_type = 'premium';
                        account.auth_source = account.auth_source || (account.meta?.type === 'Xbox' ? 'microsoft' : 'azauth');
                        account.original_auth_method = 'premium';
                    } else {
                        // Fallback sécurisé
                        account.account_type = 'crack';
                        account.auth_source = 'unknown';
                        account.original_auth_method = 'crack';
                    }
                    await this.db.updateData('accounts', account, account_ID);
                    console.log(`Set permanent tags for account ${account.name}: type=${account.account_type}, source=${account.auth_source}, method=${account.original_auth_method}`);
                } else if (account.original_auth_method) {
                    // Si des tags permanents existent, les respecter absolument
                    account.account_type = account.original_auth_method === 'crack' ? 'crack' : 'premium';
                    console.log(`Preserved permanent tags for account ${account.name}: type=${account.account_type} (from original_auth_method=${account.original_auth_method})`);
                }
                if (account.meta.type === 'Xbox') {
                    console.log(`Account Type: ${account.meta.type} | Username: ${account.name}`);
                    popupRefresh.openPopup({
                        title: 'Connexion',
                        content: `Refresh account Type: ${account.meta.type} | Username: ${account.name}`,
                        color: 'var(--color)',
                        background: false
                    });

                    let refresh_accounts = await new Microsoft(this.config.client_id).refresh(account);

                    if (refresh_accounts.error) {
                        await this.db.deleteData('accounts', account_ID)
                        if (account_ID == account_selected) {
                            configClient.account_selected = null
                            await this.db.updateData('configClient', configClient)
                        }
                        console.error(`[Account] ${account.name}: ${refresh_accounts.errorMessage}`);
                        continue;
                    }

                    // PRÉSERVER les tags permanents lors du refresh Microsoft
                    refresh_accounts.ID = account_ID;
                    if (account.original_auth_method) {
                        refresh_accounts.original_auth_method = account.original_auth_method;
                        refresh_accounts.auth_source = account.auth_source;
                        refresh_accounts.account_type = account.account_type;
                        console.log(`Preserved permanent tags during Microsoft refresh: ${account.name} = ${account.account_type}`);
                    }
                    
                    await this.db.updateData('accounts', refresh_accounts, account_ID)
                    await addAccount(refresh_accounts)
                    if (account_ID == account_selected) accountSelect(refresh_accounts)
                } else if (account.meta.type == 'AZauth') {
                    console.log(`Account Type: ${account.meta.type} | Username: ${account.name}`);
                    popupRefresh.openPopup({
                        title: 'Connexion',
                        content: `Refresh account Type: ${account.meta.type} | Username: ${account.name}`,
                        color: 'var(--color)',
                        background: false
                    });
                    let refresh_accounts = await new AZauth(this.config.online).verify(account);

                    if (refresh_accounts.error) {
                        this.db.deleteData('accounts', account_ID)
                        if (account_ID == account_selected) {
                            configClient.account_selected = null
                            this.db.updateData('configClient', configClient)
                        }
                        console.error(`[Account] ${account.name}: ${refresh_accounts.message}`);
                        continue;
                    }

                    // PRÉSERVER les tags permanents lors du refresh AZauth
                    refresh_accounts.ID = account_ID;
                    if (account.original_auth_method) {
                        refresh_accounts.original_auth_method = account.original_auth_method;
                        refresh_accounts.auth_source = account.auth_source;
                        refresh_accounts.account_type = account.account_type;
                        console.log(`Preserved permanent tags during AZauth refresh: ${account.name} = ${account.account_type}`);
                    }
                    
                    this.db.updateData('accounts', refresh_accounts, account_ID)
                    await addAccount(refresh_accounts)
                    if (account_ID == account_selected) accountSelect(refresh_accounts)
                } else if (account.meta.type == 'Mojang') {
                    console.log(`Account Type: ${account.meta.type} | Username: ${account.name}`);
                    popupRefresh.openPopup({
                        title: 'Connexion',
                        content: `Refresh account Type: ${account.meta.type} | Username: ${account.name}`,
                        color: 'var(--color)',
                        background: false
                    });
                    if (account.meta.online == false) {
                        let refresh_accounts = await Mojang.login(account.name);

                        // PRÉSERVER les tags permanents lors du refresh
                        refresh_accounts.ID = account_ID;
                        if (account.original_auth_method) {
                            refresh_accounts.original_auth_method = account.original_auth_method;
                            refresh_accounts.auth_source = account.auth_source;
                            refresh_accounts.account_type = account.account_type;
                            console.log(`Preserved permanent tags during Mojang offline refresh: ${account.name} = ${account.account_type}`);
                        }
                        
                        await addAccount(refresh_accounts)
                        this.db.updateData('accounts', refresh_accounts, account_ID)
                        if (account_ID == account_selected) accountSelect(refresh_accounts)
                        continue;
                    }

                    let refresh_accounts = await Mojang.refresh(account);

                    if (refresh_accounts.error) {
                        this.db.deleteData('accounts', account_ID)
                        if (account_ID == account_selected) {
                            configClient.account_selected = null
                            this.db.updateData('configClient', configClient)
                        }
                        console.error(`[Account] ${account.name}: ${refresh_accounts.errorMessage}`);
                        continue;
                    }

                    // PRÉSERVER les tags permanents lors du refresh Mojang
                    refresh_accounts.ID = account_ID;
                    if (account.original_auth_method) {
                        refresh_accounts.original_auth_method = account.original_auth_method;
                        refresh_accounts.auth_source = account.auth_source;
                        refresh_accounts.account_type = account.account_type;
                        console.log(`Preserved permanent tags during Mojang refresh: ${account.name} = ${account.account_type}`);
                    }
                    
                    this.db.updateData('accounts', refresh_accounts, account_ID)
                    await addAccount(refresh_accounts)
                    if (account_ID == account_selected) accountSelect(refresh_accounts)
                } else {
                    console.error(`[Account] ${account.name}: Account Type Not Found`);
                    this.db.deleteData('accounts', account_ID)
                    if (account_ID == account_selected) {
                        configClient.account_selected = null
                        this.db.updateData('configClient', configClient)
                    }
                }
            }

            accounts = await this.db.readAllData('accounts')
            configClient = await this.db.readData('configClient')
            account_selected = configClient ? configClient.account_selected : null

            if (!account_selected) {
                let uuid = accounts[0].ID
                if (uuid) {
                    configClient.account_selected = uuid
                    await this.db.updateData('configClient', configClient)
                    accountSelect(uuid)
                }
            }

            if (!accounts.length) {
                config.account_selected = null
                await this.db.updateData('configClient', config);
                popupRefresh.closePopup()
                return changePanel("login");
            }

            popupRefresh.closePopup()
            changePanel("home");
        } else {
            popupRefresh.closePopup()
            changePanel('login');
        }
    }
}

new Launcher().init();
