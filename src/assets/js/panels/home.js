/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */
import { config, database, logger, changePanel, appdata, setStatus, pkg, popup } from '../utils.js'

const { Launch } = require('minecraft-java-core')
const { shell, ipcRenderer } = require('electron')

class Home {
    static id = "home";
    constructor() {
        this.currentInstance = null; // Instance courante pour la session
        this.instancesList = null; // Liste des instances
    }
    async init(config) {
        this.config = config;
        this.db = new database();
        this.news()
        this.socialLick()
        this.instancesSelect()
        document.querySelector('.settings-btn').addEventListener('click', e => changePanel('settings'))
    }

    async news() {
        let newsElement = document.querySelector('.news-list');
        let allNews = await config.getNews().then(res => res).catch(err => false);
        
        // Filtrer les news selon l'instance courante
        let news = this.filterNewsByInstance(allNews);
        
        if (news) {
            if (!news.length) {
                let blockNews = document.createElement('div');
                blockNews.classList.add('news-block');
                blockNews.innerHTML = `
                    <div class="news-header">
                        <img class="server-status-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+">
                        <div class="header-text">
                            <div class="title">Aucun news n'ai actuellement disponible.</div>
                        </div>
                        <div class="date">
                            <div class="day">1</div>
                            <div class="month">Janvier</div>
                            <div class="year">2025</div>
                        </div>
                    </div>
                    <div class="news-content">
                        <div class="bbWrapper">
                            <p>Vous pourrez suivre ici toutes les news relative au serveur.</p>
                        </div>
                    </div>`
                newsElement.appendChild(blockNews);
            } else {
                for (let News of news) {
                    let date = this.getdate(News.publish_date)
                    let blockNews = document.createElement('div');
                    blockNews.classList.add('news-block');
                    if (News.pinned) {
                        blockNews.classList.add('pinned-news');
                    }
                    let newsLogo = this.getNewsLogo(News)
                    blockNews.innerHTML = `
                        <div class="news-header">
                            ${News.pinned ? '<div class="pin-indicator"><div class="pin-icon">📌</div></div>' : ''}
                            <img class="server-status-icon" src="${newsLogo}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+'">
                            <div class="header-text">
                                <div class="title">${News.title}</div>
                            </div>
                            <div class="date">
                                <div class="day">${date.day}</div>
                                <div class="month">${date.month}</div>
                                <div class="year">${date.year}</div>
                            </div>
                        </div>
                        <div class="news-content">
                            <div class="bbWrapper">
                                <p>${News.content.replace(/\n/g, '</br>')}</p>
                                <p class="news-author">Auteur - <span>${News.author}</span></p>
                            </div>
                        </div>`
                    newsElement.appendChild(blockNews);
                }
            }
        } else {
            let blockNews = document.createElement('div');
            blockNews.classList.add('news-block');
            blockNews.innerHTML = `
                <div class="news-header">
                        <img class="server-status-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+">
                        <div class="header-text">
                            <div class="title">Error.</div>
                        </div>
                        <div class="date">
                            <div class="day">1</div>
                            <div class="month">Janvier</div>
                            <div class="year">2025</div>
                        </div>
                    </div>
                    <div class="news-content">
                        <div class="bbWrapper">
                            <p>Impossible de contacter le serveur des news.</br>Merci de vérifier votre configuration.</p>
                        </div>
                    </div>`
            newsElement.appendChild(blockNews);
        }
    }

    socialLick() {
        let socials = document.querySelectorAll('.social-block')

        socials.forEach(social => {
            social.addEventListener('click', e => {
                shell.openExternal(e.target.dataset.url)
            })
        });
    }

    async instancesSelect() {
        let configClient = await this.db.readData('configClient')
        let auth = await this.db.readData('accounts', configClient.account_selected)
        this.instancesList = await config.getInstanceList()
        let instanceSelect = this.instancesList.find(i => i.name == configClient?.instance_selct) ? configClient?.instance_selct : null

        let instanceBTN = document.querySelector('.play-instance')
        let instancePopup = document.querySelector('.instance-popup')
        let instancesListPopup = document.querySelector('.instances-List')
        let instanceCloseBTN = document.querySelector('.close-popup')

        if (this.instancesList.length === 1) {
            document.querySelector('.instance-select').style.display = 'none'
            instanceBTN.style.paddingRight = '0'
        }

        // Toujours forcer la sélection sur l'instance "Accueil" au démarrage
        let welcomeInstance = this.instancesList.find(i => i.isWelcome == true)
        if (welcomeInstance) {
            this.currentInstance = welcomeInstance.name
            instanceSelect = welcomeInstance.name
            // Sauvegarder temporairement mais sera réinitialisé au prochain démarrage
            let configClient = await this.db.readData('configClient')
            configClient.instance_selct = welcomeInstance.name
            await this.db.updateData('configClient', configClient)
        } else if (!instanceSelect) {
            // Fallback si pas d'instance d'accueil
            let newInstanceSelect = this.instancesList.find(i => i.whitelistActive == false)
            let configClient = await this.db.readData('configClient')
            configClient.instance_selct = newInstanceSelect.name
            instanceSelect = newInstanceSelect.name
            this.currentInstance = newInstanceSelect.name
            await this.db.updateData('configClient', configClient)
        } else {
            // Si une instance est déjà sélectionnée, mettre à jour la variable courante
            this.currentInstance = instanceSelect
        }

        for (let instance of this.instancesList) {
            if (instance.whitelistActive) {
                let whitelist = instance.whitelist.find(whitelist => whitelist == auth?.name)
                if (whitelist !== auth?.name) {
                    if (instance.name == instanceSelect) {
                        let newInstanceSelect = this.instancesList.find(i => i.whitelistActive == false)
                        let configClient = await this.db.readData('configClient')
                        configClient.instance_selct = newInstanceSelect.name
                        instanceSelect = newInstanceSelect.name
                        setStatus(newInstanceSelect.status)
                        await this.db.updateData('configClient', configClient)
                    }
                }
            } else console.log(`Initializing instance ${instance.name}...`)
            if (instance.name == instanceSelect) setStatus(instance.status)
        }
        
        // Mettre à jour l'état du bouton jouer selon l'instance sélectionnée (instantané)
        this.updatePlayButtonStateInstant(instanceSelect, this.instancesList)
        this.updateInstanceDisplayInstant(instanceSelect)

        instancePopup.addEventListener('click', async e => {
            let configClient = await this.db.readData('configClient')

            if (e.target.classList.contains('instance-elements')) {
                let newInstanceSelect = e.target.id
                let activeInstanceSelect = document.querySelector('.active-instance')

                if (activeInstanceSelect) activeInstanceSelect.classList.toggle('active-instance');
                e.target.classList.add('active-instance');

                // Mise à jour temporaire pour la session ET en base pour le lancement de jeu
                configClient.instance_selct = newInstanceSelect
                this.currentInstance = newInstanceSelect
                instanceSelect = newInstanceSelect
                // Sauvegarder en base pour que startGame() trouve la bonne instance
                await this.db.updateData('configClient', configClient)
                
                // Mise à jour immédiate de l'affichage AVANT de fermer le popup
                this.updateInstanceDisplayInstant(newInstanceSelect)
                this.updatePlayButtonStateInstant(newInstanceSelect, this.instancesList)
                
                instancePopup.style.display = 'none'
                
                // Mettre à jour les news selon la nouvelle instance
                await this.refreshNews()
                let instance = await config.getInstanceList()
                let options = instance.find(i => i.name == configClient.instance_selct)
                await setStatus(options.status)
            }
        })

        instanceBTN.addEventListener('click', async e => {
            let configClient = await this.db.readData('configClient')
            let instanceSelect = configClient.instance_selct
            let auth = await this.db.readData('accounts', configClient.account_selected)

            if (e.target.classList.contains('instance-select')) {
                instancesListPopup.innerHTML = ''
                // Utiliser l'instance courante au lieu de celle en base
                let currentInstance = this.currentInstance || configClient.instance_selct
                
                for (let instance of this.instancesList) {
                    if (instance.whitelistActive) {
                        instance.whitelist.map(whitelist => {
                            if (whitelist == auth?.name) {
                                if (instance.name == currentInstance) {
                                    instancesListPopup.innerHTML += `<div id="${instance.name}" class="instance-elements active-instance">${instance.name}</div>`
                                } else {
                                    instancesListPopup.innerHTML += `<div id="${instance.name}" class="instance-elements">${instance.name}</div>`
                                }
                            }
                        })
                    } else {
                        if (instance.name == currentInstance) {
                            instancesListPopup.innerHTML += `<div id="${instance.name}" class="instance-elements active-instance">${instance.name}</div>`
                        } else {
                            instancesListPopup.innerHTML += `<div id="${instance.name}" class="instance-elements">${instance.name}</div>`
                        }
                    }
                }

                instancePopup.style.display = 'flex'
            }

            if (!e.target.classList.contains('instance-select')) {
                // Vérifier si l'instance sélectionnée est l'instance d'accueil
                let instance = this.instancesList.find(i => i.name == this.currentInstance)
                
                if (instance && instance.isWelcome) {
                    // Ne pas lancer le jeu si c'est l'instance d'accueil
                    console.log('Instance d\'accueil sélectionnée - lancement désactivé')
                    return
                }
                this.startGame()
            }
        })

        instanceCloseBTN.addEventListener('click', () => instancePopup.style.display = 'none')
    }

    async startGame() {
        let launch = new Launch()
        let configClient = await this.db.readData('configClient')
        let instance = await config.getInstanceList()
        let authenticator = await this.db.readData('accounts', configClient.account_selected)
        // Utiliser l'instance courante de la session au lieu de celle en base
        let options = instance.find(i => i.name == this.currentInstance)
        
        // Vérifier que l'instance existe et n'est pas l'instance d'accueil
        if (!options || options.isWelcome) {
            console.log('Instance invalide ou instance d\'accueil - lancement annulé')
            return
        }

        let playInstanceBTN = document.querySelector('.play-instance')
        let infoStartingBOX = document.querySelector('.info-starting-game')
        let infoStarting = document.querySelector(".info-starting-game-text")
        let progressBar = document.querySelector('.progress-bar')

        let opt = {
            url: options.url,
            authenticator: authenticator,
            timeout: 10000,
            path: `${await appdata()}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}`,
            instance: options.name,
            version: options.loadder.minecraft_version,
            detached: configClient.launcher_config.closeLauncher == "close-all" ? false : true,
            downloadFileMultiple: configClient.launcher_config.download_multi,
            intelEnabledMac: configClient.launcher_config.intelEnabledMac,

            loader: {
                type: options.loadder.loadder_type,
                build: options.loadder.loadder_version,
                enable: options.loadder.loadder_type == 'none' ? false : true
            },

            verify: options.verify,

            ignored: [...options.ignored],

            javaPath: configClient.java_config.java_path,

            screen: {
                width: configClient.game_config.screen_size.width,
                height: configClient.game_config.screen_size.height
            },

            memory: {
                min: `${configClient.java_config.java_memory.min * 1024}M`,
                max: `${configClient.java_config.java_memory.max * 1024}M`
            }
        }

        launch.Launch(opt);

        playInstanceBTN.style.display = "none"
        infoStartingBOX.style.display = "block"
        progressBar.style.display = "";
        ipcRenderer.send('main-window-progress-load')

        launch.on('extract', extract => {
            ipcRenderer.send('main-window-progress-load')
            console.log(extract);
        });

        launch.on('progress', (progress, size) => {
            infoStarting.innerHTML = `Téléchargement ${((progress / size) * 100).toFixed(0)}%`
            ipcRenderer.send('main-window-progress', { progress, size })
            progressBar.value = progress;
            progressBar.max = size;
        });

        launch.on('check', (progress, size) => {
            infoStarting.innerHTML = `Vérification ${((progress / size) * 100).toFixed(0)}%`
            ipcRenderer.send('main-window-progress', { progress, size })
            progressBar.value = progress;
            progressBar.max = size;
        });

        launch.on('estimated', (time) => {
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time - hours * 3600) / 60);
            let seconds = Math.floor(time - hours * 3600 - minutes * 60);
            console.log(`${hours}h ${minutes}m ${seconds}s`);
        })

        launch.on('speed', (speed) => {
            console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
        })

        launch.on('patch', patch => {
            console.log(patch);
            ipcRenderer.send('main-window-progress-load')
            infoStarting.innerHTML = `Patch en cours...`
        });

        launch.on('data', (e) => {
            progressBar.style.display = "none"
            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-hide")
            };
            new logger('Minecraft', '#36b030');
            ipcRenderer.send('main-window-progress-load')
            infoStarting.innerHTML = `Demarrage en cours...`
            console.log(e);
        })

        launch.on('close', code => {
            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-show")
            };
            ipcRenderer.send('main-window-progress-reset')
            infoStartingBOX.style.display = "none"
            playInstanceBTN.style.display = "flex"
            infoStarting.innerHTML = `Vérification`
            new logger(pkg.name, '#7289da');
            console.log('Close');
        });

        launch.on('error', err => {
            let popupError = new popup()

            popupError.openPopup({
                title: 'Erreur',
                content: err.error,
                color: 'red',
                options: true
            })

            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-show")
            };
            ipcRenderer.send('main-window-progress-reset')
            infoStartingBOX.style.display = "none"
            playInstanceBTN.style.display = "flex"
            infoStarting.innerHTML = `Vérification`
            new logger(pkg.name, '#7289da');
            console.log(err);
        });
    }

    getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        return { year: year, month: allMonth[month - 1], day: day }
    }

    updatePlayButtonState(instanceSelect, instancesList) {
        this.updatePlayButtonStateInstant(instanceSelect, instancesList)
    }

    updateInstanceDisplay(instanceSelect) {
        this.updateInstanceDisplayInstant(instanceSelect)
    }

    updatePlayButtonStateInstant(instanceSelect, instancesList) {
        let playInstanceBTN = document.querySelector('.play-instance')
        let instance = instancesList.find(i => i.name == (instanceSelect || this.currentInstance))
        
        // Mise à jour synchrone immédiate
        playInstanceBTN.classList.remove('welcome-disabled')
        
        if (instance && instance.isWelcome) {
            playInstanceBTN.classList.add('welcome-disabled')
            playInstanceBTN.title = 'Sélectionnez une instance pour jouer'
        } else {
            playInstanceBTN.title = 'Lancer le jeu'
        }
        
        // Force un redraw immédiat
        playInstanceBTN.offsetHeight;
    }

    updateInstanceDisplayInstant(instanceSelect) {
        let instanceNameElement = document.querySelector('.instance-name')
        if (instanceNameElement) {
            instanceNameElement.textContent = instanceSelect || 'Accueil'
            // Force un redraw immédiat
            instanceNameElement.offsetHeight;
        }
        // Mettre à jour l'icône du status serveur
        this.updateServerStatusIcon(instanceSelect)
    }

    updateServerStatusIcon(instanceSelect) {
        let statusIcon = document.querySelector('.server-status-icon')
        if (statusIcon && this.instancesList) {
            let instance = this.instancesList.find(i => i.name == instanceSelect)
            if (instance && instance.logo) {
                statusIcon.src = instance.logo
                statusIcon.onerror = function() {
                    this.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+"
                }
            } else {
                // Fallback vers logo maison moderne
                statusIcon.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+"
            }
        }
    }

    filterNewsByInstance(allNews) {
        if (!allNews || !Array.isArray(allNews)) return allNews;
        
        let currentInstance = this.currentInstance || 'Accueil';
        console.log('Filtering news for instance:', currentInstance);
        
        // Filtrer les news selon l'instance
        let filteredNews = allNews.filter(newsItem => {
            console.log('News item instance:', newsItem.instance, 'Current:', currentInstance);
            // Si la news a un champ instance
            if (newsItem.instance) {
                // Si c'est global, toujours afficher
                if (newsItem.instance === 'global') return true;
                
                // Si c'est un tableau d'instances
                if (Array.isArray(newsItem.instance)) {
                    return newsItem.instance.includes(currentInstance);
                }
                
                // Si c'est une string, vérifier l'égalité (case-insensitive pour compatibilité)
                return newsItem.instance.toLowerCase() === currentInstance.toLowerCase();
            }
            
            // Si pas de champ instance, c'est pour l'Accueil uniquement
            return currentInstance === 'Accueil';
        });

        // Trier les news : épinglées en premier, puis par date
        return filteredNews.sort((a, b) => {
            // Les news épinglées en premier
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            
            // Si même statut épinglé, trier par date (plus récent en premier)
            return new Date(b.publish_date) - new Date(a.publish_date);
        });
    }

    getNewsLogo(newsItem) {
        // Logo maison par défaut
        const houseLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0YzZlZjUiIHN0cm9rZT0iIzM3NTNkYyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Im0yMCAyOCAxMi04IDEyIDh2MjBIMzZ2LTloLTh2OUgyMFYyOHoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+"
        
        // Si pas de champ instance ou si c'est pour l'Accueil → logo maison
        if (!newsItem.instance || newsItem.instance === 'Accueil') {
            return houseLogo
        }
        
        // Si c'est global → logo maison
        if (newsItem.instance === 'global') {
            return houseLogo
        }
        
        // Si c'est un tableau (multi-instances) → logo maison
        if (Array.isArray(newsItem.instance)) {
            return houseLogo
        }
        
        // Si c'est une instance spécifique, chercher son logo
        if (typeof newsItem.instance === 'string' && this.instancesList) {
            let instance = this.instancesList.find(i => 
                i.name.toLowerCase() === newsItem.instance.toLowerCase()
            )
            if (instance && instance.logo) {
                return instance.logo
            }
        }
        
        // Fallback vers logo maison
        return houseLogo
    }

    async refreshNews() {
        // Vider les news actuelles
        let newsElement = document.querySelector('.news-list');
        newsElement.innerHTML = '';
        
        // Recharger les news avec le filtre
        await this.news();
    }
}
export default Home;