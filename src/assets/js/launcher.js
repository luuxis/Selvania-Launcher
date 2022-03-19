'use strict';

// libs 
const fs = require('fs');
import { config, logger, changePanel, database } from './utils.js';

import Login from './panels/login.js';
import Home from './panels/home.js';
import Settings from './panels/settings.js';


let win = nw.Window.get();
let Dev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Launcher {
    async init() {
        this.initLog();
        console.log("Initializing Launcher...");
        if (process.platform == "win32") this.initFrame();
        this.config = await config.config().then(res => res);
        this.database = await new database().init();
        this.createPanels(Login, Home, Settings);
        this.getaccounts();
    }

    initLog() {
        let logs = document.querySelector(".log-console");
        let block = false;
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73 || e.keyCode == 123 && !Dev) {
                if (block === true) {
                    logs.style.display = "none";
                    block = false;
                } else {
                    logs.style.display = "block";
                    block = true;
                }
            }
        })
        new logger('Launcher', '#7289da', document.querySelector(".log-content"))
    }

    initFrame() {
        console.log("Initializing Frame...")
        document.querySelector(".frame").classList.toggle("hide")
        document.querySelector(".dragbar").classList.toggle("hide")

        document.querySelector("#minimize").addEventListener("click", () => {
            win.minimize()
        });

        let maximized = false;
        let maximize = document.querySelector("#maximize")
        maximize.addEventListener("click", () => {
            if (maximized) win.unmaximize()
            else win.maximize()
            maximized = !maximized
            maximize.classList.toggle("icon-maximize")
            maximize.classList.toggle("icon-restore-down")
        });

        document.querySelector("#close").addEventListener("click", () => {
            win.close();
        })
    }
    
    createPanels(...panels) {
        let panelsElem = document.querySelector(".panels")
        for (let panel of panels) {
            console.log(`Initializing ${panel.name} Panel...`);
            let div = document.createElement("div");
            div.classList.add("panel", panel.id)
            div.innerHTML = fs.readFileSync(`src/panels/${panel.id}.html`, "utf8");
            panelsElem.appendChild(div);
            new panel().init(this.config);
        }
    }

    async getaccounts() {
        let accounts = await this.database.getAll('accounts');
        
        if (accounts.length > 0) {
            changePanel("home");
        } else {
            changePanel("login");
        }
    }

}

new Launcher().init();