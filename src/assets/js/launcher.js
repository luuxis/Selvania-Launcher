/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';
// import panel
import Login from './panels/login.js';

// import modules
import { logger, config, changePanel } from './utils.js';

// libs 
const { ipcRenderer } = require('electron');
const fs = require('fs');


class Launcher {
    async init() {
        this.initLog();
        console.log('Initializing Launcher...');
        this.initBackground();
        if (process.platform == 'win32') this.initFrame();
        this.config = await config.GetConfig().then(res => res);
        this.createPanels(Login);
        changePanel('login');
    }

    initLog() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73 || e.keyCode == 123) {
                ipcRenderer.send('main-window-dev-tools');
            }
        })
        new logger('Launcher', '#7289da')
    }

    async initBackground() {
        let isDarkTheme = await ipcRenderer.invoke('is-dark-theme').then(res => res);
        let body = document.body;
        body.className = isDarkTheme ? 'dark' : 'light';
        if (fs.existsSync(`${__dirname}/assets/images/background/${isDarkTheme ? 'dark' : 'light'}`)) {
            let backgrounds = fs.readdirSync(`${__dirname}/assets/images/background/${isDarkTheme ? 'dark' : 'light'}`);
            let background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            body.style.backgroundImage = `url(./assets/images/background/${isDarkTheme ? 'dark' : 'light'}/${background})`;
            body.style.backgroundSize = 'cover';
        }
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

    createPanels(...panels) {
        let panelsElem = document.querySelector('.panels')
        for (let panel of panels) {
            console.log(`Initializing ${panel.name} Panel...`);
            let div = document.createElement('div');
            div.classList.add('panel', panel.id)
            div.innerHTML = fs.readFileSync(`${__dirname}/panels/${panel.id}.html`, 'utf8');
            panelsElem.appendChild(div);
            new panel().init(this.config);
        }
    }
}

new Launcher().init();