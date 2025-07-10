// /**
//  * @author Luuxis
//  * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0
//  */

// let console_log = console.log;
// let console_info = console.info;
// let console_warn = console.warn;
// let console_debug = console.debug;
// let console_error = console.error;

// class logger {
//     constructor(name, color) {
//         this.Logger(name, color)
//     }

//     async Logger(name, color) {
//         console.log = value => {
//             console_log.call(console, `%c[${name}]:`, `color: ${color};`, value);
//         };

//         console.info = value => {
//             console_info.call(console, `%c[${name}]:`, `color: ${color};`, value);
//         };

//         console.warn = value => {
//             console_warn.call(console, `%c[${name}]:`, `color: ${color};`, value);
//         };

//         console.debug = value => {
//             console_debug.call(console, `%c[${name}]:`, `color: ${color};`, value);
//         };

//         console.error = value => {
//             console_error.call(console, `%c[${name}]:`, `color: ${color};`, value);
//         };
//     }
// }

// export default logger;

const { ipcRenderer } = window.require?.("electron") || {};

let console_log = console.log;
let console_info = console.info;
let console_warn = console.warn;
let console_debug = console.debug;
let console_error = console.error;

class logger {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.Logger();
    }

    sendToFile(level, value) {
        if (!ipcRenderer) return;
        const msg = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
        ipcRenderer.send('log-from-renderer', {
            level,
            name: this.name,
            message: msg
        });
    }

    Logger() {
        console.log = value => {
            console_log.call(console, `%c[${this.name}]:`, `color: ${this.color};`, value);
            this.sendToFile('log', value);
        };

        console.info = value => {
            console_info.call(console, `%c[${this.name}]:`, `color: ${this.color};`, value);
            this.sendToFile('info', value);
        };

        console.warn = value => {
            console_warn.call(console, `%c[${this.name}]:`, `color: ${this.color};`, value);
            this.sendToFile('warn', value);
        };

        console.debug = value => {
            console_debug.call(console, `%c[${this.name}]:`, `color: ${this.color};`, value);
            this.sendToFile('debug', value);
        };

        console.error = value => {
            console_error.call(console, `%c[${this.name}]:`, `color: ${this.color};`, value);
            this.sendToFile('error', value);
        };
    }
}

export default logger;
