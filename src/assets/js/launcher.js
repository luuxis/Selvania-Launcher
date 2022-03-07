'use strict';

// libs 

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
                    logs.style.display = "none";
                    block = false;
                } else {
                    logs.style.display = "block";
                    block = true;
                }
            }
        })
        this.Logger('Launcher', '#7289da', logs_content);
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

    Logger(name, color, logs_content) {
        let console_log = console.log;
        console.log = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span>${value}</span></p>`;
            console_log.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        let console_info = console.info;
        console.info = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span>${value}</span></p>`;
            console_info.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        let console_warn = console.warn;
        console.warn = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span>${value}</span></p>`;
            console_warn.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        let console_debug = console.debug;
        console.debug = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span>${value}</span></p>`;
            console_debug.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        let console_error = console.error;
        console.error = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span>${value}</span></p>`;
            console_error.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };
        // #36b030
    }
}

new Launcher();