/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */
const { AZauth, Mojang } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');

import { popup, database, changePanel, accountSelect, addAccount, config, setStatus } from '../utils.js';

class Login {
    static id = "login";
    async init(config) {
        console.log('=== LOGIN INIT CALLED ===');
        console.log('LOGIN_INIT STEP 1: Setting up config and database');
        this.config = config;
        this.db = new database();
        
        console.log('LOGIN_INIT STEP 2: Reading initial configClient');
        // FORCER le nettoyage de TOUS les états d'auth dès l'init
        let configClient = await this.db.readData('configClient');
        console.log('LOGIN_INIT STEP 3: Initial configClient:', JSON.stringify(configClient, null, 2));
        
        if (configClient) {
            console.log('LOGIN_INIT STEP 4: Cleaning auth states (but NOT coming_from_settings)');
            // Supprimer toute trace d'état d'authentification précédent
            delete configClient.temp_auth_mode;
            if (configClient.launcher_config) {
                delete configClient.launcher_config.authMode;
                delete configClient.launcher_config.last_auth_mode;
            }
            console.log('LOGIN_INIT STEP 5: ConfigClient after cleaning:', JSON.stringify(configClient, null, 2));
            await this.db.updateData('configClient', configClient);
            console.log('LOGIN_INIT STEP 6: FORCED cleanup completed (preserved coming_from_settings)');
        } else {
            console.log('LOGIN_INIT STEP 4: ConfigClient was null, skipping cleanup');
        }
        
        // Re-lire après nettoyage
        console.log('LOGIN_INIT STEP 7: Re-reading configClient after cleanup');
        configClient = await this.db.readData('configClient');
        console.log('LOGIN_INIT STEP 8: ConfigClient after cleanup:', JSON.stringify(configClient, null, 2));
        
        let authMode = configClient?.temp_auth_mode;
        let fromSettings = configClient?.coming_from_settings;
        console.log('LOGIN_INIT STEP 9: authMode found:', authMode);
        console.log('LOGIN_INIT STEP 10: fromSettings flag:', fromSettings);
        
        // FORCER la réinitialisation du DOM SEULEMENT si on ne vient PAS des paramètres
        if (!fromSettings) {
            console.log('LOGIN_INIT STEP 11: Not from settings, resetting DOM');
            this.resetAllDOM();
        } else {
            console.log('LOGIN_INIT STEP 11: Coming from settings, skipping DOM reset to preserve structure');
        }
        
        // Si mode temporaire (venant des paramètres), l'utiliser directement
        console.log('LOGIN_INIT STEP 12: Checking for temp auth mode');
        if (authMode) {
            console.log('Using temp_auth_mode:', authMode);
            // Nettoyer le mode temporaire après utilisation
            delete configClient.temp_auth_mode;
            await this.db.updateData('configClient', configClient);
            
            if (authMode === "online") {
                console.log('Calling getMicrosoft from init');
                this.getMicrosoft();
            } else if (authMode === "crack") {
                console.log('Calling getCrack from init');
                this.getCrack();
            }
        } else {
            // Sinon, afficher l'interface de choix
            console.log('LOGIN_INIT STEP 13: No temp_auth_mode, calling showMethodChoice');
            console.log('LOGIN_INIT STEP 13.1: About to call showMethodChoice with fromSettings =', fromSettings);
            await this.showMethodChoice();
            console.log('LOGIN_INIT STEP 14: showMethodChoice completed');
        }
        
        console.log('LOGIN_INIT STEP 15: Login init completed');
        // Les gestionnaires pour les boutons retour sont maintenant gérés dans chaque fonction spécifique
    }

    async getMicrosoft() {
        console.log('Initializing Microsoft login...');
        let popupLogin = new popup();
        let loginHome = document.querySelector('.login-home');
        let microsoftBtn = document.querySelector('.connect-home');
        let cancelBtn = document.getElementById('cancel-microsoft'); // Cibler spécifiquement le bouton Microsoft
        
        // Nettoyer les anciens événements pour éviter les doublons
        let newMicrosoftBtn = microsoftBtn.cloneNode(true);
        let newCancelBtn = cancelBtn.cloneNode(true);
        microsoftBtn.parentNode.replaceChild(newMicrosoftBtn, microsoftBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        // Mettre à jour les références
        microsoftBtn = document.querySelector('.connect-home');
        cancelBtn = document.getElementById('cancel-microsoft');
        
        loginHome.style.display = 'block';
        loginHome.style.visibility = 'visible';
        
        // Afficher le bouton retour pour permettre de revenir au choix de méthode
        cancelBtn.style.display = 'inline';
        
        // Gestionnaire pour le bouton retour Microsoft
        cancelBtn.addEventListener('click', async () => {
            console.log('Cancel button clicked on Microsoft login');
            loginHome.style.display = 'none';
            cancelBtn.style.display = 'none';
            
            let configClient = await this.db.readData('configClient');
            
            // Vérifier s'il y a des comptes existants
            let allAccounts;
            try {
                allAccounts = await this.db.readAllData('accounts');
            } catch (error) {
                allAccounts = [];
            }
            
            if (configClient?.coming_from_settings || (allAccounts && allAccounts.length > 0)) {
                // Si on vient des paramètres OU s'il y a des comptes, retourner au choix de méthode
                console.log('Returning to method choice from Microsoft');
                this.showMethodChoice();
            } else {
                // Sinon, retourner au choix de méthode par défaut
                console.log('First launch, showing method choice from Microsoft');
                this.showMethodChoice();
            }
        });

        microsoftBtn.addEventListener("click", () => {
            popupLogin.openPopup({
                title: 'Connexion',
                content: 'Veuillez patienter...',
                color: 'var(--color)'
            });

            ipcRenderer.invoke('Microsoft-window', this.config.client_id).then(async account_connect => {
                if (account_connect == 'cancel' || !account_connect) {
                    popupLogin.closePopup();
                    return;
                } else {
                    // FORCER le type premium pour les connexions Microsoft
                    console.log('FORCING account_type to premium for Microsoft login');
                    account_connect.account_type = 'premium';
                    account_connect.auth_source = 'microsoft';
                    account_connect.original_auth_method = 'premium';
                    
                    await this.saveData(account_connect)
                    popupLogin.closePopup();
                }

            }).catch(err => {
                popupLogin.openPopup({
                    title: 'Erreur',
                    content: err,
                    options: true
                });
            });
        })
    }

    async getCrack() {
        console.log('Initializing offline login...');
        let popupLogin = new popup();
        let loginOffline = document.querySelector('.login-offline');

        let emailOffline = document.querySelector('.email-offline');
        let connectOffline = document.querySelector('.connect-offline');
        let cancelOffline = document.querySelector('.cancel-offline');
        
        // Nettoyer les anciens événements pour éviter les doublons
        let newConnectOffline = connectOffline.cloneNode(true);
        let newCancelOffline = cancelOffline.cloneNode(true);
        connectOffline.parentNode.replaceChild(newConnectOffline, connectOffline);
        cancelOffline.parentNode.replaceChild(newCancelOffline, cancelOffline);
        
        // Mettre à jour les références
        connectOffline = document.querySelector('.connect-offline');
        cancelOffline = document.querySelector('.cancel-offline');
        
        loginOffline.style.display = 'block';
        loginOffline.style.visibility = 'visible';

        // Gestionnaire pour le bouton Retour
        cancelOffline.addEventListener('click', async () => {
            console.log('Retour button clicked in offline mode');
            loginOffline.style.display = 'none';
            
            let configClient = await this.db.readData('configClient');
            
            // Vérifier s'il y a des comptes existants
            let allAccounts;
            try {
                allAccounts = await this.db.readAllData('accounts');
            } catch (error) {
                allAccounts = [];
            }
            
            if (configClient?.coming_from_settings || (allAccounts && allAccounts.length > 0)) {
                // Si on vient des paramètres OU s'il y a des comptes, retourner au choix de méthode
                console.log('Returning to method choice');
                this.showMethodChoice();
            } else {
                // Sinon, c'est le premier lancement, aller à l'accueil n'a pas de sens
                // Retourner au choix de méthode par défaut
                console.log('First launch, showing method choice');
                this.showMethodChoice();
            }
        });

        connectOffline.addEventListener('click', async () => {
            // Protection contre les clics multiples
            if (connectOffline.disabled) {
                console.log('Connection already in progress, ignoring click');
                return;
            }
            connectOffline.disabled = true;
            
            if (emailOffline.value.length < 3) {
                connectOffline.disabled = false;
                popupLogin.openPopup({
                    title: 'Erreur',
                    content: 'Votre pseudo doit faire au moins 3 caractères.',
                    options: true
                });
                return;
            }

            if (emailOffline.value.match(/ /g)) {
                connectOffline.disabled = false;
                popupLogin.openPopup({
                    title: 'Erreur',
                    content: 'Votre pseudo ne doit pas contenir d\'espaces.',
                    options: true
                });
                return;
            }

            let MojangConnect = await Mojang.login(emailOffline.value);

            if (MojangConnect.error) {
                connectOffline.disabled = false;
                popupLogin.openPopup({
                    title: 'Erreur',
                    content: MojangConnect.message,
                    options: true
                });
                return;
            }
            
            // FORCER le type crack pour les connexions offline
            console.log('FORCING account_type to crack for offline login');
            MojangConnect.account_type = 'crack';
            MojangConnect.auth_source = 'offline';
            MojangConnect.original_auth_method = 'crack';
            
            await this.saveData(MojangConnect);
            connectOffline.disabled = false;
            popupLogin.closePopup();
        });
    }

    async getAZauth() {
        console.log('Initializing AZauth login...');
        let AZauthClient = new AZauth(this.config.online);
        let PopupLogin = new popup();
        let loginAZauth = document.querySelector('.login-AZauth');
        let loginAZauthA2F = document.querySelector('.login-AZauth-A2F');

        let AZauthEmail = document.querySelector('.email-AZauth');
        let AZauthPassword = document.querySelector('.password-AZauth');
        let AZauthA2F = document.querySelector('.A2F-AZauth');
        let connectAZauthA2F = document.querySelector('.connect-AZauth-A2F');
        let AZauthConnectBTN = document.querySelector('.connect-AZauth');
        let AZauthCancelA2F = document.querySelector('.cancel-AZauth-A2F');
        let AZauthCancel = document.querySelector('.cancel-AZauth');

        loginAZauth.style.display = 'block';
        loginAZauth.style.visibility = 'visible';

        // Gestionnaire pour le bouton Annuler principal (si il devient visible)
        if (AZauthCancel) {
            AZauthCancel.addEventListener('click', () => {
                console.log('Cancel button clicked in AZauth mode');
                changePanel('settings'); // Retour vers les paramètres
            });
        }

        AZauthConnectBTN.addEventListener('click', async () => {
            PopupLogin.openPopup({
                title: 'Connexion en cours...',
                content: 'Veuillez patienter...',
                color: 'var(--color)'
            });

            if (AZauthEmail.value == '' || AZauthPassword.value == '') {
                PopupLogin.openPopup({
                    title: 'Erreur',
                    content: 'Veuillez remplir tous les champs.',
                    options: true
                });
                return;
            }

            let AZauthConnect = await AZauthClient.login(AZauthEmail.value, AZauthPassword.value);

            if (AZauthConnect.error) {
                PopupLogin.openPopup({
                    title: 'Erreur',
                    content: AZauthConnect.message,
                    options: true
                });
                return;
            } else if (AZauthConnect.A2F) {
                loginAZauthA2F.style.display = 'block';
                loginAZauthA2F.style.visibility = 'visible';
                loginAZauth.style.display = 'none';
                PopupLogin.closePopup();

                AZauthCancelA2F.addEventListener('click', () => {
                    loginAZauthA2F.style.display = 'none';
                    loginAZauth.style.display = 'block';
                    loginAZauth.style.visibility = 'visible';
                });

                connectAZauthA2F.addEventListener('click', async () => {
                    PopupLogin.openPopup({
                        title: 'Connexion en cours...',
                        content: 'Veuillez patienter...',
                        color: 'var(--color)'
                    });

                    if (AZauthA2F.value == '') {
                        PopupLogin.openPopup({
                            title: 'Erreur',
                            content: 'Veuillez entrer le code A2F.',
                            options: true
                        });
                        return;
                    }

                    AZauthConnect = await AZauthClient.login(AZauthEmail.value, AZauthPassword.value, AZauthA2F.value);

                    if (AZauthConnect.error) {
                        PopupLogin.openPopup({
                            title: 'Erreur',
                            content: AZauthConnect.message,
                            options: true
                        });
                        return;
                    }

                    // FORCER le type premium pour les connexions AZauth avec A2F
                    console.log('FORCING account_type to premium for AZauth A2F login');
                    AZauthConnect.account_type = 'premium';
                    AZauthConnect.auth_source = 'azauth';
                    AZauthConnect.original_auth_method = 'premium';

                    await this.saveData(AZauthConnect)
                    PopupLogin.closePopup();
                });
            } else if (!AZauthConnect.A2F) {
                // FORCER le type premium pour les connexions AZauth
                console.log('FORCING account_type to premium for AZauth login');
                AZauthConnect.account_type = 'premium';
                AZauthConnect.auth_source = 'azauth';
                AZauthConnect.original_auth_method = 'premium';
                
                await this.saveData(AZauthConnect)
                PopupLogin.closePopup();
            }
        });
    }

    async saveData(connectionData) {
        console.log('saveData called with:', connectionData.name, connectionData.account_type);
        let configClient = await this.db.readData('configClient');
        
        // Vérifier si un compte avec ce nom ET ce type existe déjà pour éviter les doublons
        try {
            let existingAccounts = await this.db.readAllData('accounts');
            // Chercher par nom ET type d'authentification pour permettre crack + premium avec même pseudo
            let existingAccount = existingAccounts?.find(acc => 
                acc.name === connectionData.name && 
                acc.original_auth_method === connectionData.original_auth_method
            );
            if (existingAccount) {
                console.log('Account with same name AND type already exists, updating:', connectionData.name, connectionData.original_auth_method);
                await accountSelect(existingAccount);
                configClient.account_selected = existingAccount.ID;
                await this.db.updateData('configClient', configClient);
                changePanel('home');
                return;
            } else {
                console.log('Account name exists but different type, allowing creation:', connectionData.name, connectionData.original_auth_method);
            }
        } catch (error) {
            console.log('No existing accounts found, creating new one');
        }
        
        // Ajouter l'indicateur de type de compte avec priorité sur les tags forcés
        console.log('saveData - connectionData before type determination:', {
            account_type: connectionData.account_type,
            auth_source: connectionData.auth_source,
            original_auth_method: connectionData.original_auth_method,
            type: connectionData.type,
            access_token: !!connectionData.access_token,
            meta_type: connectionData.meta?.type
        });
        
        if (!connectionData.account_type) {
            // Si pas de type forcé, utiliser la logique classique mais plus stricte
            if (connectionData.type === 'offline' || connectionData.auth_source === 'offline') {
                connectionData.account_type = 'crack';
                connectionData.auth_source = connectionData.auth_source || 'offline';
                connectionData.original_auth_method = 'crack';
            } else if (connectionData.access_token || connectionData.meta?.type === 'Xbox' || connectionData.meta?.type === 'AZauth' || connectionData.auth_source === 'microsoft' || connectionData.auth_source === 'azauth') {
                connectionData.account_type = 'premium';
                connectionData.auth_source = connectionData.auth_source || (connectionData.meta?.type === 'Xbox' ? 'microsoft' : 'azauth');
                connectionData.original_auth_method = 'premium';
            } else {
                // Fallback plus strict
                console.warn('Fallback account type determination - defaulting to crack');
                connectionData.account_type = 'crack';
                connectionData.auth_source = 'unknown';
                connectionData.original_auth_method = 'crack';
            }
        }
        
        // S'assurer que les tags sont cohérents
        if (!connectionData.auth_source) {
            connectionData.auth_source = connectionData.account_type === 'crack' ? 'offline' : 'unknown';
        }
        if (!connectionData.original_auth_method) {
            connectionData.original_auth_method = connectionData.account_type;
        }
        
        console.log('Creating new account with type:', connectionData.account_type);
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

        // Nettoyer le flag SEULEMENT après création réussie d'un compte
        if (configClient?.coming_from_settings) {
            console.log('Cleaning coming_from_settings flag after successful account creation');
            delete configClient.coming_from_settings;
        }
        
        await this.db.updateData('configClient', configClient);
        await addAccount(account);
        await accountSelect(account);
        changePanel('home');
    }

    resetAllDOM() {
        console.log('=== RESET ALL DOM CALLED ===');
        // MASQUER toutes les sections de login SANS vider le HTML
        let allSections = ['.login-home', '.login-offline', '.login-AZauth', '.login-AZauth-A2F', '.login-choice'];
        allSections.forEach(selector => {
            let element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                console.log(`Reset: Hidden section ${selector} (keeping HTML intact)`);
            }
        });
        
        // Réinitialiser les champs de saisie qui pourraient persister
        let inputs = document.querySelectorAll('.email-offline, .email-AZauth, .password-AZauth, .A2F-AZauth');
        inputs.forEach(input => {
            if (input) {
                input.value = '';
                input.disabled = false;
            }
        });
        
        // Réinitialiser les boutons désactivés
        let buttons = document.querySelectorAll('.connect-offline, .connect-AZauth, .connect-AZauth-A2F, .connect-home');
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.display = '';
            }
        });
        
        console.log('DOM reset completed with full cleanup');
    }

    recreateMethodChoiceContent(loginChoice) {
        console.log('Recreating method choice content');
        loginChoice.innerHTML = `
            <div class="login-text">Comment souhaitez-vous vous connecter ?</div>
            <div class="connection-methods">
                <div class="method-card method-crack" id="choose-crack">
                    <div class="method-icon">💻</div>
                    <div class="method-title">Compte Crack</div>
                    <div class="method-description">Connexion avec pseudo uniquement</div>
                </div>
                <div class="method-card method-premium" id="choose-premium">
                    <div class="method-icon">✅</div>
                    <div class="method-title">Compte Premium</div>
                    <div class="method-description">Compte Microsoft/Mojang officiel</div>
                </div>
            </div>
            <button class="cancel cancel-home" id="cancel-choice" style="display: none;">Retour</button>
        `;
        console.log('Method choice content recreated');
    }

    async showMethodChoice() {
        console.log('=== SHOW METHOD CHOICE CALLED ===');
        
        // MASQUER toutes les sections SANS vider le HTML
        console.log('PHASE 1: Hiding all login sections (keeping HTML)');
        let allSections = ['.login-home', '.login-offline', '.login-AZauth', '.login-AZauth-A2F'];
        allSections.forEach(selector => {
            let element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                console.log(`Hidden section: ${selector} (HTML preserved)`);
            }
        });
        
        // S'assurer que la section login-choice existe et a son contenu
        console.log('PHASE 1.2: Ensuring login-choice has correct structure');
        let loginChoice = document.querySelector('.login-choice');
        if (!loginChoice) {
            console.error('CRITICAL: login-choice element not found!');
            return;
        }
        
        // Vérifier si le contenu existe, sinon le recréer
        if (!loginChoice.querySelector('.connection-methods')) {
            console.log('login-choice content missing, recreating...');
            this.recreateMethodChoiceContent(loginChoice);
        }
        
        // Réinitialiser seulement les champs de saisie
        console.log('PHASE 1.5: Resetting input fields');
        let inputs = document.querySelectorAll('.email-offline, .email-AZauth, .password-AZauth, .A2F-AZauth');
        inputs.forEach(input => {
            if (input) {
                input.value = '';
                input.disabled = false;
            }
        });
        
        console.log('PHASE 2: Making login-choice visible and ensuring content');
        // Le contenu a été vérifié/recréé dans la phase précédente
        
        console.log('PHASE 4: Making login-choice visible');
        loginChoice.style.display = 'block';
        loginChoice.style.visibility = 'visible';
        console.log('login-choice should now be visible. Current style:', {
            display: loginChoice.style.display,
            visibility: loginChoice.style.visibility
        });
        
        console.log('PHASE 5: Getting cancel button');
        let choiceCancelBtn = document.getElementById('cancel-choice');
        console.log('choiceCancelBtn found:', !!choiceCancelBtn, choiceCancelBtn);

        // Vérifier si on vient des paramètres pour afficher le bouton retour
        console.log('PHASE 6: Checking configuration and accounts');
        let configClient = await this.db.readData('configClient');
        let fromSettings = configClient?.coming_from_settings || false;
        console.log('configClient:', configClient);
        console.log('fromSettings flag:', fromSettings);
        
        // Vérifier s'il y a des comptes existants
        let allAccounts = [];
        let hasAccounts = false;
        try {
            allAccounts = await this.db.readAllData('accounts');
            console.log('Raw accounts data:', allAccounts, 'type:', typeof allAccounts);
            hasAccounts = allAccounts && Array.isArray(allAccounts) && allAccounts.length > 0;
            console.log('hasAccounts calculated:', hasAccounts, 'account count:', allAccounts ? allAccounts.length : 0);
        } catch (error) {
            console.log('No accounts found or database error:', error);
            hasAccounts = false;
            allAccounts = [];
        }
        
        console.log('PHASE 7: Decision logic - fromSettings:', fromSettings, 'hasAccounts:', hasAccounts);
        
        // Afficher le bouton retour SEULEMENT si on vient des paramètres OU s'il y a des comptes
        if (choiceCancelBtn) {
            if (fromSettings || hasAccounts) {
                console.log('SHOWING cancel button on method choice (reason: fromSettings=' + fromSettings + ', hasAccounts=' + hasAccounts + ')');
                choiceCancelBtn.style.display = 'inline';
            } else {
                console.log('HIDING cancel button on method choice (first launch, no accounts)');
                choiceCancelBtn.style.display = 'none';
            }
        } else {
            console.error('CRITICAL: choiceCancelBtn not found after recreation!');
        }

        // Maintenant que le HTML est recréé, récupérer les nouveaux éléments
        console.log('PHASE 8: Getting fresh elements after HTML recreation');
        let crackBtn = document.getElementById('choose-crack');
        let premiumBtn = document.getElementById('choose-premium');
        choiceCancelBtn = document.getElementById('cancel-choice');
        
        console.log('Fresh elements check:', {
            crackBtn: !!crackBtn,
            premiumBtn: !!premiumBtn,
            choiceCancelBtn: !!choiceCancelBtn
        });
        
        if (!crackBtn || !premiumBtn || !choiceCancelBtn) {
            console.error('CRITICAL: Missing elements after recreation:', { crackBtn, premiumBtn, choiceCancelBtn });
            return;
        }
        
        console.log('PHASE 9: Cleaning and attaching event handlers');

        // Nettoyer les anciens event handlers en clonant les éléments
        let newCrackBtn = crackBtn.cloneNode(true);
        let newPremiumBtn = premiumBtn.cloneNode(true);
        let newChoiceCancelBtn = choiceCancelBtn.cloneNode(true);
        
        crackBtn.parentNode.replaceChild(newCrackBtn, crackBtn);
        premiumBtn.parentNode.replaceChild(newPremiumBtn, premiumBtn);
        choiceCancelBtn.parentNode.replaceChild(newChoiceCancelBtn, choiceCancelBtn);
        
        // Mettre à jour les références
        crackBtn = newCrackBtn;
        premiumBtn = newPremiumBtn;
        choiceCancelBtn = newChoiceCancelBtn;

        // Gestionnaires d'événements pour les cartes de choix
        crackBtn.addEventListener('click', () => {
            console.log('=== CRACK BUTTON CLICKED ===');
            console.log('Hiding login-choice, calling getCrack()');
            loginChoice.style.display = 'none';
            this.getCrack();
        });

        premiumBtn.addEventListener('click', () => {
            console.log('=== PREMIUM BUTTON CLICKED ===');
            console.log('Hiding login-choice, determining premium method');
            loginChoice.style.display = 'none';
            
            // Pour Premium, toujours utiliser Microsoft par défaut
            // Sauf si une URL AZauth est configurée spécifiquement
            if (typeof this.config.online == 'string' && this.config.online.match(/^(http|https):\/\/[^ "]+$/)) {
                console.log('Using AZauth for premium account');
                this.getAZauth();
            } else {
                console.log('Using Microsoft for premium account');
                this.getMicrosoft();
            }
        });
        
        // Gestionnaire pour le bouton retour du choix de méthode
        choiceCancelBtn.addEventListener('click', async () => {
            console.log('=== CANCEL BUTTON CLICKED ON METHOD CHOICE ===');
            console.log('Hiding UI elements');
            choiceCancelBtn.style.display = 'none';
            loginChoice.style.display = 'none';
            
            // NETTOYER SEULEMENT les modes d'auth temporaires (GARDER coming_from_settings)
            console.log('Cleaning temp auth modes but PRESERVING coming_from_settings');
            let configClient = await this.db.readData('configClient');
            // NE PAS supprimer coming_from_settings pour permettre les clics répétés !
            // delete configClient.coming_from_settings; // SUPPRIMÉ !
            delete configClient.temp_auth_mode;
            // Supprimer toute autre trace de mode d'auth temporaire
            if (configClient.launcher_config) {
                delete configClient.launcher_config.authMode;
                delete configClient.launcher_config.last_auth_mode;
            }
            console.log('Config cleaned (preserved coming_from_settings), returning to settings');
            await this.db.updateData('configClient', configClient);
            changePanel('settings');
        });
        
        console.log('PHASE 10: All event handlers attached successfully');
    }
}
export default Login;