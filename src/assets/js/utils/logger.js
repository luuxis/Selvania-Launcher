let console_log = console.log;
let console_info = console.info;
let console_warn = console.warn;
let console_debug = console.debug;
let console_error = console.error;

class logger {
    constructor(name, color, logs_content) {
        this.Logger(name, color, logs_content)
    }

    async Logger(name, color, logs_content) {
        console.log = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span class="console-log">${value}</span></p>`;
            console_log.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.info = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span class="console-info">${value}</span></p>`;
            console_info.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.warn = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span class="console-warn">${value}</span></p>`;
            console_warn.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.debug = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span class="console-debug">${value}</span></p>`;
            console_debug.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.error = (value) => {
            logs_content.innerHTML += `<p><span style="color:${color};">[${name}]: </span><span class="console-error">${value}</span></p>`;
            console_error.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };
    }
}

export default logger;