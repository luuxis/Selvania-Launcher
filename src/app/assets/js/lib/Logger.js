'use strict';

class Logger {
  constructor(identifier, color){
    this.identifier = identifier;
    this.color = color;
    this.console = console;
  }

  log(...text) {
    this.emit("log", ...text);
  }

  info(...text) {
    this.emit("info", ...text);
  }

  warn(...text) {
    this.emit("warn", ...text);
  }

  debug(...text) {
    this.emit("debug", ...text);
  }

  error(...text) {
    this.emit("error", ...text);
  }

  func = [];

  on(event, func){
    if(!this.func[event]) this.func[event] = [];
    this.func[event].push(func);
  }

  off(event, func){
    if(!this.func[event]) return;
    this.func[event] = this.func[event].filter(f => f !== func);
  }

  emit(event, ...args){
    this.console[event](`%c[${this.identifier}]`, `color: ${this.color};`, ...args);
    if(event == "log") event = "info";
    if(this.func[event]){
      for(let func of this.func[event]){
        func(...args);
      }
    }
  }
}

export default Logger
