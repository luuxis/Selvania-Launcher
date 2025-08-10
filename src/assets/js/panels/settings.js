/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */

import { changePanel, accountSelect, database, Slider, config, setStatus, popup, appdata, setBackground, addAccount } from '../utils.js'
const { ipcRenderer } = require('electron');
const os = require('os');

class Settings {
    static id = "settings";
    async init(config) {
        this.config = config;
        this.db = new database();
        this.navBTN()
        this.accounts()
        this.ram()
        this.javaPath()
        this.resolution()
        this.launcher()
        this.backgroundUrl()
    }

    navBTN() {
        document.querySelector('.nav-box').addEventListener('click', e => {
            if (e.target.classList.contains('nav-settings-btn')) {
                let id = e.target.id

                let activeSettingsBTN = document.querySelector('.active-settings-BTN')
                let activeContainerSettings = document.querySelector('.active-container-settings')

                if (id == 'save') {
                    if (activeSettingsBTN) activeSettingsBTN.classList.toggle('active-settings-BTN');
                    document.querySelector('#account').classList.add('active-settings-BTN');

                    if (activeContainerSettings) activeContainerSettings.classList.toggle('active-container-settings');
                    document.querySelector(`#account-tab`).classList.add('active-container-settings');
                    return changePanel('home')
                }

                if (activeSettingsBTN) activeSettingsBTN.classList.toggle('active-settings-BTN');
                e.target.classList.add('active-settings-BTN');

                if (activeContainerSettings) activeContainerSettings.classList.toggle('active-container-settings');
                document.querySelector(`#${id}-tab`).classList.add('active-container-settings');
            }
        })
    }

    async accounts() {
        // Charger et afficher les comptes existants avec leurs types
        await this.loadExistingAccounts();
        
        // Éviter de créer plusieurs gestionnaires d'événements
        let accountsList = document.querySelector('.accounts-list');
        if (accountsList.hasAttribute('data-event-attached')) {
            console.log('Event listener already attached to accounts-list');
            return;
        }
        
        console.log('Attaching event listener to accounts-list');
        accountsList.setAttribute('data-event-attached', 'true');
        accountsList.addEventListener('click', async e => {
            console.log('Click detected on accounts-list', e.target, e.target.id, e.target.classList);
            let popupAccount = new popup()
            try {
                // Trouve l'élément account le plus proche
                let accountElement = e.target.closest('.account');
                if (!accountElement) return;
                
                let id = accountElement.id;
                console.log('Account element found:', id);
                
                // Gestion spécifique pour le bouton ajouter
                if (id === 'add') {
                    console.log('=== ADD BUTTON CLICKED ===');
                    console.log('STEP 1: Starting add account process');
                    
                    // NETTOYER COMPLÈTEMENT et marquer qu'on vient des paramètres
                    try {
                        console.log('STEP 2: Reading current config');
                        let configClient = await this.db.readData('configClient');
                        console.log('STEP 3: Current configClient before cleaning:', JSON.stringify(configClient, null, 2));
                        if (!configClient) {
                            configClient = {};
                            console.log('STEP 3.1: ConfigClient was null, created empty object');
                        }
                        
                        console.log('STEP 4: Cleaning auth modes');
                        // FORCER le nettoyage complet de tous les modes d'auth
                        delete configClient.temp_auth_mode;
                        if (configClient.launcher_config) {
                            delete configClient.launcher_config.authMode;
                            delete configClient.launcher_config.last_auth_mode;
                        }
                        
                        // Marquer qu'on vient des paramètres  
                        console.log('STEP 5: Setting coming_from_settings flag');
                        configClient.coming_from_settings = true;
                        
                        console.log('STEP 6: Cleaned configClient:', JSON.stringify(configClient, null, 2));
                        console.log('STEP 7: Updating database with cleaned config');
                        await this.db.updateData('configClient', configClient);
                        
                        console.log('STEP 8: Verifying config was saved');
                        let verifyConfig = await this.db.readData('configClient');
                        console.log('STEP 8.1: Verified configClient after save:', JSON.stringify(verifyConfig, null, 2));
                        
                        console.log('STEP 9: Calling changePanel(login)');
                        changePanel('login');
                        console.log('STEP 10: changePanel(login) completed');
                        
                        console.log('STEP 11: Forcing showMethodChoice call');
                        // FORCER l'appel de showMethodChoice car changePanel n'appelle pas init()
                        if (window.loginPanelInstance) {
                            console.log('STEP 11.1: Found global login instance, calling showMethodChoice');
                            // Petit délai pour laisser le temps au changePanel de s'exécuter
                            setTimeout(async () => {
                                await window.loginPanelInstance.showMethodChoice();
                                console.log('STEP 11.2: showMethodChoice forced call completed');
                            }, 50);
                        } else {
                            console.log('STEP 11.1: No global login instance found');
                        }
                    } catch (error) {
                        console.error('ERROR in add account process:', error);
                        console.log('FALLBACK: calling changePanel(login) anyway');
                        changePanel('login');
                    }
                    return;
                }
                
                // Gestion du bouton supprimer
                if (e.target.classList.contains("delete-profile") || e.target.classList.contains("delete-profile-icon")) {
                    // Pour les boutons de suppression, on prend l'ID depuis l'attribut ou depuis l'élément parent
                    let deleteId = e.target.id || e.target.closest('.delete-profile').id;
                    console.log('Delete button clicked for account:', deleteId);
                    
                    popupAccount.openPopup({
                        title: 'Connexion',
                        content: 'Veuillez patienter...',
                        color: 'var(--color)'
                    })
                    await this.db.deleteData('accounts', deleteId);
                    let deleteProfile = document.getElementById(`${deleteId}`);
                    let accountListElement = document.querySelector('.accounts-list');
                    accountListElement.removeChild(deleteProfile);

                    if (accountListElement.children.length == 1) return changePanel('login');

                    let configClient = await this.db.readData('configClient');

                    if (configClient.account_selected == deleteId) {
                        let allAccounts = await this.db.readAllData('accounts');
                        configClient.account_selected = allAccounts[0].ID
                        accountSelect(allAccounts[0]);
                        let newInstanceSelect = await this.setInstance(allAccounts[0]);
                        configClient.instance_selct = newInstanceSelect.instance_selct
                        return await this.db.updateData('configClient', configClient);
                    }
                    return;
                }
                
                // Gestion de la sélection d'un compte existant
                if (accountElement.classList.contains('account')) {
                    popupAccount.openPopup({
                        title: 'Connexion',
                        content: 'Veuillez patienter...',
                        color: 'var(--color)'
                    });

                    let account = await this.db.readData('accounts', id);
                    let configClient = await this.setInstance(account);
                    await accountSelect(account);
                    configClient.account_selected = account.ID;
                    return await this.db.updateData('configClient', configClient);
                }
                
            } catch (err) {
                console.error(err)
            } finally {
                popupAccount.closePopup();
            }
        })
    }

    async setInstance(auth) {
        let configClient = await this.db.readData('configClient')
        let instanceSelect = configClient.instance_selct
        let instancesList = await config.getInstanceList()

        for (let instance of instancesList) {
            if (instance.whitelistActive) {
                let whitelist = instance.whitelist.find(whitelist => whitelist == auth.name)
                if (whitelist !== auth.name) {
                    if (instance.name == instanceSelect) {
                        let newInstanceSelect = instancesList.find(i => i.whitelistActive == false)
                        configClient.instance_selct = newInstanceSelect.name
                        await setStatus(newInstanceSelect.status)
                    }
                }
            }
        }
        return configClient
    }

    async ram() {
        let config = await this.db.readData('configClient');
        let totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
        let freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;

        document.getElementById("total-ram").textContent = `${totalMem} Go`;
        document.getElementById("free-ram").textContent = `${freeMem} Go`;

        let sliderDiv = document.querySelector(".memory-slider");
        sliderDiv.setAttribute("max", Math.trunc((80 * totalMem) / 100));

        let ram = config?.java_config?.java_memory ? {
            ramMin: config.java_config.java_memory.min,
            ramMax: config.java_config.java_memory.max
        } : { ramMin: "1", ramMax: "2" };

        if (totalMem < ram.ramMin) {
            config.java_config.java_memory = { min: 1, max: 2 };
            this.db.updateData('configClient', config);
            ram = { ramMin: "1", ramMax: "2" }
        };

        let slider = new Slider(".memory-slider", parseFloat(ram.ramMin), parseFloat(ram.ramMax));

        let minSpan = document.querySelector(".slider-touch-left span");
        let maxSpan = document.querySelector(".slider-touch-right span");

        minSpan.setAttribute("value", `${ram.ramMin} Go`);
        maxSpan.setAttribute("value", `${ram.ramMax} Go`);

        slider.on("change", async (min, max) => {
            let config = await this.db.readData('configClient');
            minSpan.setAttribute("value", `${min} Go`);
            maxSpan.setAttribute("value", `${max} Go`);
            config.java_config.java_memory = { min: min, max: max };
            this.db.updateData('configClient', config);
        });
    }

    async javaPath() {
        let javaPathText = document.querySelector(".java-path-txt")
        javaPathText.textContent = `${await appdata()}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}/runtime`;

        let configClient = await this.db.readData('configClient')
        let javaPath = configClient?.java_config?.java_path || 'Utiliser la version de java livre avec le launcher';
        let javaPathInputTxt = document.querySelector(".java-path-input-text");
        let javaPathInputFile = document.querySelector(".java-path-input-file");
        javaPathInputTxt.value = javaPath;

        document.querySelector(".java-path-set").addEventListener("click", async () => {
            javaPathInputFile.value = '';
            javaPathInputFile.click();
            await new Promise((resolve) => {
                let interval;
                interval = setInterval(() => {
                    if (javaPathInputFile.value != '') resolve(clearInterval(interval));
                }, 100);
            });

            if (javaPathInputFile.value.replace(".exe", '').endsWith("java") || javaPathInputFile.value.replace(".exe", '').endsWith("javaw")) {
                let configClient = await this.db.readData('configClient')
                let file = javaPathInputFile.files[0].path;
                javaPathInputTxt.value = file;
                configClient.java_config.java_path = file
                await this.db.updateData('configClient', configClient);
            } else alert("Le nom du fichier doit être java ou javaw");
        });

        document.querySelector(".java-path-reset").addEventListener("click", async () => {
            let configClient = await this.db.readData('configClient')
            javaPathInputTxt.value = 'Utiliser la version de java livre avec le launcher';
            configClient.java_config.java_path = null
            await this.db.updateData('configClient', configClient);
        });
    }

    async resolution() {
        let configClient = await this.db.readData('configClient')
        let resolution = configClient?.game_config?.screen_size || { width: 1920, height: 1080 };

        let width = document.querySelector(".width-size");
        let height = document.querySelector(".height-size");
        let resolutionReset = document.querySelector(".size-reset");

        width.value = resolution.width;
        height.value = resolution.height;

        width.addEventListener("change", async () => {
            let configClient = await this.db.readData('configClient')
            configClient.game_config.screen_size.width = width.value;
            await this.db.updateData('configClient', configClient);
        })

        height.addEventListener("change", async () => {
            let configClient = await this.db.readData('configClient')
            configClient.game_config.screen_size.height = height.value;
            await this.db.updateData('configClient', configClient);
        })

        resolutionReset.addEventListener("click", async () => {
            let configClient = await this.db.readData('configClient')
            configClient.game_config.screen_size = { width: '854', height: '480' };
            width.value = '854';
            height.value = '480';
            await this.db.updateData('configClient', configClient);
        })
    }

    async launcher() {
        let configClient = await this.db.readData('configClient');

        let maxDownloadFiles = configClient?.launcher_config?.download_multi || 5;
        let maxDownloadFilesInput = document.querySelector(".max-files");
        let maxDownloadFilesReset = document.querySelector(".max-files-reset");
        maxDownloadFilesInput.value = maxDownloadFiles;

        maxDownloadFilesInput.addEventListener("change", async () => {
            let configClient = await this.db.readData('configClient')
            configClient.launcher_config.download_multi = maxDownloadFilesInput.value;
            await this.db.updateData('configClient', configClient);
        })

        maxDownloadFilesReset.addEventListener("click", async () => {
            let configClient = await this.db.readData('configClient')
            maxDownloadFilesInput.value = 5
            configClient.launcher_config.download_multi = 5;
            await this.db.updateData('configClient', configClient);
        })

        let themeBox = document.querySelector(".theme-box");
        let theme = configClient?.launcher_config?.theme || "auto";

        if (theme == "auto") {
            document.querySelector('.theme-btn-auto').classList.add('active-theme');
        } else if (theme == "dark") {
            document.querySelector('.theme-btn-sombre').classList.add('active-theme');
        } else if (theme == "light") {
            document.querySelector('.theme-btn-clair').classList.add('active-theme');
        }

        themeBox.addEventListener("click", async e => {
            if (e.target.classList.contains('theme-btn')) {
                let activeTheme = document.querySelector('.active-theme');
                if (e.target.classList.contains('active-theme')) return
                activeTheme?.classList.remove('active-theme');

                if (e.target.classList.contains('theme-btn-auto')) {
                    setBackground();
                    theme = "auto";
                    e.target.classList.add('active-theme');
                } else if (e.target.classList.contains('theme-btn-sombre')) {
                    setBackground(true);
                    theme = "dark";
                    e.target.classList.add('active-theme');
                } else if (e.target.classList.contains('theme-btn-clair')) {
                    setBackground(false);
                    theme = "light";
                    e.target.classList.add('active-theme');
                }

                let configClient = await this.db.readData('configClient')
                configClient.launcher_config.theme = theme;
                await this.db.updateData('configClient', configClient);
            }
        })

        let closeBox = document.querySelector(".close-box");
        let closeLauncher = configClient?.launcher_config?.closeLauncher || "close-launcher";

        if (closeLauncher == "close-launcher") {
            document.querySelector('.close-launcher').classList.add('active-close');
        } else if (closeLauncher == "close-all") {
            document.querySelector('.close-all').classList.add('active-close');
        } else if (closeLauncher == "close-none") {
            document.querySelector('.close-none').classList.add('active-close');
        }

        closeBox.addEventListener("click", async e => {
            if (e.target.classList.contains('close-btn')) {
                let activeClose = document.querySelector('.active-close');
                if (e.target.classList.contains('active-close')) return
                activeClose?.classList.toggle('active-close');

                let configClient = await this.db.readData('configClient')

                if (e.target.classList.contains('close-launcher')) {
                    e.target.classList.toggle('active-close');
                    configClient.launcher_config.closeLauncher = "close-launcher";
                    await this.db.updateData('configClient', configClient);
                } else if (e.target.classList.contains('close-all')) {
                    e.target.classList.toggle('active-close');
                    configClient.launcher_config.closeLauncher = "close-all";
                    await this.db.updateData('configClient', configClient);
                } else if (e.target.classList.contains('close-none')) {
                    e.target.classList.toggle('active-close');
                    configClient.launcher_config.closeLauncher = "close-none";
                    await this.db.updateData('configClient', configClient);
                }
            }
        })
    }

    async backgroundUrl() {
        let configClient = await this.db.readData('configClient');
        let backgroundUrl = configClient?.launcher_config?.background_url || 'https://i.imgur.com/6W316YN.mp4';
        
        let backgroundUrlInput = document.querySelector(".background-url-input");
        let backgroundUrlReset = document.querySelector(".background-url-reset");
        let backgroundUrlPreview = document.querySelector(".background-url-preview");
        
        backgroundUrlInput.value = backgroundUrl;

        // Fonction pour valider et appliquer l'URL
        const applyBackgroundUrl = async (url) => {
            if (url && url.trim()) {
                // Valider que l'URL est une image ou vidéo
                const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4'];
                const urlLower = url.toLowerCase();
                const isValidMedia = validExtensions.some(ext => urlLower.includes(ext)) || 
                                   urlLower.includes('imgur.com') || 
                                   urlLower.includes('giphy.com') ||
                                   urlLower.includes('tenor.com');
                
                if (isValidMedia) {
                    try {
                        // Déterminer si c'est une vidéo ou une image
                        const isVideo = urlLower.includes('.mp4');
                        
                        if (isVideo) {
                            // Pour les vidéos MP4
                            return new Promise((resolve, reject) => {
                                const testVideo = document.createElement('video');
                                testVideo.crossOrigin = 'anonymous';
                                testVideo.preload = 'metadata';
                                
                                testVideo.onloadedmetadata = async () => {
                                    // Supprimer toute vidéo de fond existante
                                    const existingVideo = document.querySelector('.background-video');
                                    if (existingVideo) {
                                        existingVideo.remove();
                                    }
                                    
                                    // Créer l'élément vidéo de fond
                                    const videoElement = document.createElement('video');
                                    videoElement.src = url;
                                    videoElement.loop = true;
                                    videoElement.muted = true;
                                    videoElement.autoplay = true;
                                    videoElement.playsInline = true;
                                    videoElement.classList.add('background-video');
                                    
                                    // Styles pour la vidéo de fond
                                    videoElement.style.cssText = `
                                        position: fixed;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;
                                        z-index: -1;
                                        pointer-events: none;
                                    `;
                                    
                                    // Supprimer le fond d'image s'il existe
                                    document.body.style.backgroundImage = '';
                                    
                                    // Ajouter la vidéo au body
                                    document.body.appendChild(videoElement);
                                    
                                    // Sauvegarder en base
                                    let configClient = await this.db.readData('configClient');
                                    if (!configClient.launcher_config) configClient.launcher_config = {};
                                    configClient.launcher_config.background_url = url;
                                    await this.db.updateData('configClient', configClient);
                                    
                                    resolve(true);
                                };
                                
                                testVideo.onerror = () => {
                                    reject(new Error('Impossible de charger la vidéo'));
                                };
                                
                                testVideo.src = url;
                            });
                        } else {
                            // Pour les images (code existant)
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            
                            return new Promise((resolve, reject) => {
                                img.onload = async () => {
                                    // Supprimer toute vidéo de fond existante
                                    const existingVideo = document.querySelector('.background-video');
                                    if (existingVideo) {
                                        existingVideo.remove();
                                    }
                                    
                                    // Appliquer le fond d'écran image
                                    document.body.style.backgroundImage = `url("${url}")`;
                                    document.body.style.backgroundSize = 'cover';
                                    document.body.style.backgroundPosition = 'center';
                                    document.body.style.backgroundRepeat = 'no-repeat';
                                    document.body.style.backgroundAttachment = 'fixed';
                                    
                                    // Sauvegarder en base
                                    let configClient = await this.db.readData('configClient');
                                    if (!configClient.launcher_config) configClient.launcher_config = {};
                                    configClient.launcher_config.background_url = url;
                                    await this.db.updateData('configClient', configClient);
                                    
                                    resolve(true);
                                };
                                
                                img.onerror = () => {
                                    reject(new Error('Impossible de charger l\'image'));
                                };
                                
                                img.src = url;
                            });
                        }
                    } catch (error) {
                        throw new Error('URL de média invalide');
                    }
                } else {
                    throw new Error('Format non supporté (JPG, PNG, GIF, WEBP, MP4 uniquement)');
                }
            } else {
                // Réinitialiser au fond par défaut
                const existingVideo = document.querySelector('.background-video');
                if (existingVideo) {
                    existingVideo.remove();
                }
                document.body.style.backgroundImage = '';
                let configClient = await this.db.readData('configClient');
                if (!configClient.launcher_config) configClient.launcher_config = {};
                configClient.launcher_config.background_url = '';
                await this.db.updateData('configClient', configClient);
                
                // Réappliquer le thème par défaut
                await setBackground();
                return true;
            }
        };

        // Appliquer l'URL sauvegardée au chargement
        if (backgroundUrl) {
            try {
                await applyBackgroundUrl(backgroundUrl);
            } catch (error) {
                console.log('Erreur lors du chargement du fond personnalisé:', error.message);
            }
        }

        // Événement sur changement d'URL
        backgroundUrlInput.addEventListener("blur", async () => {
            const url = backgroundUrlInput.value.trim();
            try {
                await applyBackgroundUrl(url);
            } catch (error) {
                alert(error.message);
                // Revenir à la valeur précédente
                backgroundUrlInput.value = backgroundUrl;
            }
        });

        // Événement sur Entrée
        backgroundUrlInput.addEventListener("keypress", async (e) => {
            if (e.key === 'Enter') {
                const url = backgroundUrlInput.value.trim();
                try {
                    await applyBackgroundUrl(url);
                    backgroundUrl = url; // Mettre à jour la valeur de référence
                } catch (error) {
                    alert(error.message);
                    backgroundUrlInput.value = backgroundUrl;
                }
            }
        });

        // Bouton aperçu
        backgroundUrlPreview.addEventListener("click", async () => {
            const url = backgroundUrlInput.value.trim();
            if (!url) {
                alert('Veuillez entrer une URL d\'abord');
                return;
            }
            
            try {
                await applyBackgroundUrl(url);
                backgroundUrl = url; // Mettre à jour la valeur de référence
            } catch (error) {
                alert(error.message);
            }
        });

        // Bouton réinitialiser
        backgroundUrlReset.addEventListener("click", async () => {
            backgroundUrlInput.value = 'https://i.imgur.com/6W316YN.mp4';
            await applyBackgroundUrl('https://i.imgur.com/6W316YN.mp4');
            backgroundUrl = 'https://i.imgur.com/6W316YN.mp4';
        });
    }

    
    async loadExistingAccounts() {
        try {
            let allAccounts = await this.db.readAllData('accounts');
            if (allAccounts && allAccounts.length > 0) {
                console.log(`Loading ${allAccounts.length} accounts from database`);
                
                // Nettoyer la liste actuelle (sauf le bouton ajouter)
                let accountsList = document.querySelector('.accounts-list');
                let addButton = accountsList.querySelector('#add');
                
                // Conserver seulement le bouton ajouter
                accountsList.innerHTML = '';
                accountsList.appendChild(addButton);
                
                // Ajouter chaque compte avec son indicateur
                for (let account of allAccounts) {
                    // Mettre à jour le type si nécessaire
                    if (!account.account_type) {
                        account.account_type = (account.type === 'offline' || account.meta?.online === false) ? 'crack' : 'premium';
                        await this.db.updateData('accounts', account, account.ID);
                    }
                    console.log(`Adding account to DOM: ${account.name} (${account.ID})`);
                    await addAccount(account);
                }
                
                console.log(`Successfully loaded ${allAccounts.length} accounts with types`);
            } else {
                console.log('No accounts found in database');
            }
        } catch (error) {
            console.error('Error loading existing accounts:', error);
        }
    }

}
export default Settings;