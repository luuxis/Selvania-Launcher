'use strict';

const fs = require("fs");
const { execSync } = require("child_process");

class Unzipper {
  constructor(zip){
    this.zip = zip;
  }

  async unzipTo(path){
    let size = this.getSize();
    this.emit("progress", 0, size);

    let unzip = 0;

    let entries = this.zip.getEntries();
    for await (let entry of entries){
      let pathFile = `${path}/${entry.entryName}`;
      if(entry.isDirectory) { if(!fs.existsSync(pathFile)) fs.mkdirSync(pathFile, { recursive: true, mode: 0o777 }) }
      else {
        let folder = pathFile.split("/").slice(0, pathFile.split("/").length-1).join("/");
        if(!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true, mode: 0o777 });
        fs.writeFileSync(pathFile, entry.getData(), { encoding: "utf8", mode: 0o755 });
        if(process.platform == "darwin" && (pathFile.endsWith(".dylib") || ["java", "jspawnhelper"].includes(pathFile.split("/").slice(-1)[0]))){
          let id = String.fromCharCode.apply(null, execSync(`xattr -p com.apple.quarantine "${pathFile}"`));
          execSync(`xattr -w com.apple.quarantine "${id.replace("0081;", "00c1;")}" "${pathFile}"`);
        }
        unzip += entry.header.size;
        this.emit("progress", unzip, size);
      }
    }

    this.emit("finish");
  }

  getSize(){
    let sizeArr = this.zip.getEntries().map(entry => entry.header.size);
    let size = 0;
    for(let s of sizeArr) size += s;
    return size;
  }

  on(event, func){
    this[event] = func;
  }

  emit(event, ...args){
    if(this[event]) this[event](...args);
  }
}

export default Unzipper;
