'use strict';

const os = require("os");
const fs = require("fs");
//const config = require ("./config.js")

let PlatformJSON = {
  win32: "https://launchermeta.mojang.com/v1/products/launcher/d03cf0cf95cce259fa9ea3ab54b65bd28bb0ae82/windows-x86.json",
  darwin: "https://launchermeta.mojang.com/v1/products/launcher/022631aeac4a9addbce8e0503dce662152dc198d/mac-os.json",
  linux: "https://launchermeta.mojang.com/v1/products/launcher/6f083b80d5e6fabbc4236f81d0d8f8a350c665a9/linux.json"
}

let Arch = {x32: "x86", x64: "x64", arm: "x86", arm64: "x64"};

class Java {
  constructor(){
    this.hash = new Worker("assets/js/utils/workers/Hash.js");
  }

  getTotalSize(bundle){
    let size = 0;
    for(let file of bundle){
      size += file.size;
    }
    return size;
  }

  async getManifestJSON(){
    let platformjson = await fetch(PlatformJSON[process.platform]).then(res => res.json());
    return await fetch(platformjson[`jre-${Arch[os.arch()]}`][0].manifest.url).then(res => res.json());
  }

  async getBundle(){
    let manifest = Object.entries((await this.getManifestJSON()).files);

    let java = manifest.find(file => file[0].endsWith(process.platform == "win32" ? "bin/javaw.exe" : "bin/java"))[0];
    let toDelete = java.replace(process.platform == "win32" ? "bin/javaw.exe" : "bin/java", "");

    let files = [];
    for(let [path, info] of manifest){
      if(info.type == "directory") continue;
      let file = {};
      file.path = `${localStorage.getItem(".arche")}/runtime/java/${path.replace(toDelete, "")}`;
      file.folder = file.path.split("/").slice(0, -1).join("/");
      file.executable = info.executable;
      file.sha1 = info.downloads.raw.sha1;
      if(info.downloads.lzma){
        file.lzma = true;
        file.size = info.downloads.lzma.size;
        file.url = info.downloads.lzma.url;
      } else {
        file.lzma = false;
        file.size = info.downloads.raw.size;
        file.url = info.downloads.raw.url;
      }
      files.push(file);
    }

    return files;
  }

  async checkBundle(bundle){
    let todownload = [];
    for (let file of bundle){
      console.log(`Verifying ${file.path} file`);
      if(fs.existsSync(file.path)){
        if(!(await this.checkSHA1(file.path, file.sha1))) todownload.push(file);
      } else todownload.push(file);
    }
    return todownload;
  }

  async checkSHA1(file, hash){
    let sha1 = await this.getDigest("SHA1", fs.readFileSync(file));
    if(sha1 != hash.toLowerCase()) return false;
    return true;
  }

  async getDigest(hash, data){
    return new Promise((resolve) => {
      let message = (e) => {
        this.hash.removeEventListener('message', message);
        resolve(e.data);
      }

      this.hash.addEventListener('message', message);

      this.hash.postMessage({hash, data});
    });
  }
}

export default Java;
