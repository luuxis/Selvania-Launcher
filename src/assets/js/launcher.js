'use strict';

// libs 
const { Logger } = require('./assets/js/utils.js');

let win = nw.Window.get();
let Dev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Launcher {
    constructor() {
        this.initLog();
        console.log("Initializing Launcher...");
        if (process.platform == "win32") this.initFrame();
    }

    initLog() {
        let logs = document.querySelector(".log-console");
        let logs_content = document.querySelector(".log-console-content");
        let block = false;
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73 || e.keyCode == 123 && !Dev) {
                if (block === true) {
                    logs.style.opacity = 0;
                    block = false;
                } else {
                    logs.style.opacity = 1;
                    block = true;
                }
            }
        })
        var logBak = console.log;

        console.log = (value) => {
            logs_content.innerHTML += `${value}<br>`;
            logBak.call(console, value);
        };
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
}

new Launcher();