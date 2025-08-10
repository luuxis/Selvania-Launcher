/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */

const { ipcRenderer } = require('electron')
const { Status } = require('minecraft-java-core')
const fs = require('fs');
const pkg = require('../package.json');

import config from './utils/config.js';
import database from './utils/database.js';
import logger from './utils/logger.js';
import popup from './utils/popup.js';
import { skin2D } from './utils/skin.js';
import slider from './utils/slider.js';

async function setBackground(theme) {
    if (typeof theme == 'undefined') {
        let databaseLauncher = new database();
        let configClient = await databaseLauncher.readData('configClient');
        theme = configClient?.launcher_config?.theme || "auto"
        theme = await ipcRenderer.invoke('is-dark-theme', theme).then(res => res)
        
        // Vérifier s'il y a un fond d'écran personnalisé
        let customBackgroundUrl = configClient?.launcher_config?.background_url;
        if (customBackgroundUrl && customBackgroundUrl.trim()) {
            let body = document.body;
            body.className = theme ? 'dark global' : 'light global';
            
            // Déterminer si c'est une vidéo ou une image
            const isVideo = customBackgroundUrl.toLowerCase().includes('.mp4');
            
            if (isVideo) {
                // Supprimer toute vidéo de fond existante
                const existingVideo = document.querySelector('.background-video');
                if (existingVideo) {
                    existingVideo.remove();
                }
                
                // Créer l'élément vidéo de fond
                const videoElement = document.createElement('video');
                videoElement.src = customBackgroundUrl;
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
                body.style.backgroundImage = '';
                
                // Ajouter la vidéo au body
                body.appendChild(videoElement);
            } else {
                // Pour les images
                body.style.backgroundImage = `url("${customBackgroundUrl}")`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundRepeat = 'no-repeat';
                body.style.backgroundAttachment = 'fixed';
            }
            return;
        }
    }
    let background
    let body = document.body;
    body.className = theme ? 'dark global' : 'light global';
    if (fs.existsSync(`${__dirname}/assets/images/background/easterEgg`) && Math.random() < 0.005) {
        let backgrounds = fs.readdirSync(`${__dirname}/assets/images/background/easterEgg`);
        let Background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        background = `url(./assets/images/background/easterEgg/${Background})`;
    } else if (fs.existsSync(`${__dirname}/assets/images/background/${theme ? 'dark' : 'light'}`)) {
        let backgrounds = fs.readdirSync(`${__dirname}/assets/images/background/${theme ? 'dark' : 'light'}`);
        let Background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        background = `linear-gradient(#00000080, #00000080), url(./assets/images/background/${theme ? 'dark' : 'light'}/${Background})`;
    }
    body.style.backgroundImage = background ? background : theme ? '#000' : '#fff';
    body.style.backgroundSize = 'cover';
}

async function changePanel(id) {
    let panel = document.querySelector(`.${id}`);
    let active = document.querySelector(`.active`)
    if (active) active.classList.toggle("active");
    panel.classList.add("active");
}

async function appdata() {
    return await ipcRenderer.invoke('appData').then(path => path)
}

async function addAccount(data) {
    // Vérifier si le compte existe déjà dans le DOM
    let existingAccount = document.getElementById(data.ID);
    if (existingAccount) {
        console.log('Account already exists in DOM, updating:', data.ID);
        // Mettre à jour le compte existant au lieu de créer un doublon
        let skin = false
        if (data?.profile?.skins[0]?.base64) skin = await new skin2D().creatHeadTexture(data.profile.skins[0].base64);
        
        // Même logique de détermination pour les comptes existants
        let accountType = data.account_type;
        if (!accountType) {
            if (data.original_auth_method === 'crack' || data.auth_source === 'offline' || data.type === 'offline') {
                accountType = 'crack';
            } else if (data.original_auth_method === 'premium' || data.auth_source === 'microsoft' || data.auth_source === 'azauth') {
                accountType = 'premium';
            } else {
                accountType = data.type === 'offline' ? 'crack' : 'premium';
            }
            console.log(`Updated account type for existing ${data.name}: ${accountType}`);
        }
        
        // Afficher seulement l'indicateur de source (plus clair et moins encombrant)
        let authSourceIndicator = '';
        if (data.auth_source) {
            if (data.auth_source === 'offline') {
                authSourceIndicator = ' (Hors-ligne)';
            } else if (data.auth_source === 'microsoft') {
                authSourceIndicator = ' (Microsoft)';
            } else if (data.auth_source === 'azauth') {
                authSourceIndicator = ' (AZauth)';
            }
        }
        
        existingAccount.innerHTML = `
            <div class="profile-image" ${skin ? 'style="background-image: url(' + skin + ');"' : ''}></div>
            <div class="profile-infos">
                <div class="profile-pseudo">
                    <span>${data.name}${authSourceIndicator}</span>
                </div>
                <div class="profile-uuid">${data.uuid}</div>
            </div>
            <div class="delete-profile" id="${data.ID}">
                <div class="icon-account-delete delete-profile-icon"></div>
            </div>
        `;
        return existingAccount;
    }
    
    console.log('Creating new account in DOM:', data.ID);
    let skin = false
    if (data?.profile?.skins[0]?.base64) skin = await new skin2D().creatHeadTexture(data.profile.skins[0].base64);
    
    // Déterminer le type de compte pour l'indicateur visuel avec priorité sur les nouveaux tags
    let accountType = data.account_type;
    
    // Si pas de account_type défini, utiliser l'ancien système mais avec les nouveaux tags
    if (!accountType) {
        if (data.original_auth_method === 'crack' || data.auth_source === 'offline' || data.type === 'offline') {
            accountType = 'crack';
        } else if (data.original_auth_method === 'premium' || data.auth_source === 'microsoft' || data.auth_source === 'azauth') {
            accountType = 'premium';
        } else {
            // Fallback sur l'ancien système
            accountType = data.type === 'offline' ? 'crack' : 'premium';
        }
        console.log(`Determined account type for ${data.name}: ${accountType} (based on auth_source: ${data.auth_source}, original_auth_method: ${data.original_auth_method})`);
    }
    
    // Afficher seulement l'indicateur de source (plus clair et moins encombrant)
    let authSourceIndicator = '';
    if (data.auth_source) {
        if (data.auth_source === 'offline') {
            authSourceIndicator = ' (Hors-ligne)';
        } else if (data.auth_source === 'microsoft') {
            authSourceIndicator = ' (Microsoft)';
        } else if (data.auth_source === 'azauth') {
            authSourceIndicator = ' (AZauth)';
        }
    }
    
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = data.ID;
    div.innerHTML = `
        <div class="profile-image" ${skin ? 'style="background-image: url(' + skin + ');"' : ''}></div>
        <div class="profile-infos">
            <div class="profile-pseudo">
                <span>${data.name}${authSourceIndicator}</span>
            </div>
            <div class="profile-uuid">${data.uuid}</div>
        </div>
        <div class="delete-profile" id="${data.ID}">
            <div class="icon-account-delete delete-profile-icon"></div>
        </div>
    `
    return document.querySelector('.accounts-list').appendChild(div);
}

async function accountSelect(data) {
    let account = document.getElementById(`${data.ID}`);
    let activeAccount = document.querySelector('.account-select')

    if (activeAccount) activeAccount.classList.toggle('account-select');
    account.classList.add('account-select');
    if (data?.profile?.skins[0]?.base64) headplayer(data.profile.skins[0].base64);
}

async function headplayer(skinBase64) {
    let skin = await new skin2D().creatHeadTexture(skinBase64);
    document.querySelector(".player-head").style.backgroundImage = `url(${skin})`;
}

async function setStatus(opt) {
    let nameServerElement = document.querySelector('.server-status-name')
    let statusServerElement = document.querySelector('.server-status-text')
    let playersOnline = document.querySelector('.status-player-count .player-count')

    if (!opt) {
        statusServerElement.classList.add('red')
        statusServerElement.innerHTML = `Ferme - 0 ms`
        document.querySelector('.status-player-count').classList.add('red')
        playersOnline.innerHTML = '0'
        return
    }

    let { ip, port, nameServer } = opt
    nameServerElement.innerHTML = nameServer
    let status = new Status(ip, port);
    let statusServer = await status.getStatus().then(res => res).catch(err => err);

    if (!statusServer.error) {
        statusServerElement.classList.remove('red')
        document.querySelector('.status-player-count').classList.remove('red')
        statusServerElement.innerHTML = `En ligne - ${statusServer.ms} ms`
        playersOnline.innerHTML = statusServer.playersConnect
    } else {
        statusServerElement.classList.add('red')
        statusServerElement.innerHTML = `Ferme - 0 ms`
        document.querySelector('.status-player-count').classList.add('red')
        playersOnline.innerHTML = '0'
    }
}


export {
    appdata as appdata,
    changePanel as changePanel,
    config as config,
    database as database,
    logger as logger,
    popup as popup,
    setBackground as setBackground,
    skin2D as skin2D,
    addAccount as addAccount,
    accountSelect as accountSelect,
    slider as Slider,
    pkg as pkg,
    setStatus as setStatus
}