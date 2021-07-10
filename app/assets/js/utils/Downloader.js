'use strict';

const fetch = require("node-fetch");
const fs = require("fs");

class Downloader {
  async start(url){
    let size = await fetch(url, {method: "HEAD"}).then(res => parseInt(res.headers.get("content-length")));
    this.emit("progress", 0, size);
    let res = await fetch(url);

    let data = Buffer.allocUnsafe(size);
    let downloaded = 0;

    res.body.on('data', (chunk) => {
      data.fill(chunk, downloaded, downloaded+chunk.length);
      downloaded += chunk.length;
      this.emit("progress", downloaded, size);
    });

    let start = new Date().getTime();
    let before = 0;

    let speeds = [];

    let interval = setInterval(() => {
      let duration = (new Date().getTime() - start) / 1000;
      let loaded = (downloaded - before) * 8;
      if(speeds.length >= 5) speeds = speeds.slice(1);
      speeds.push((loaded / duration) / 8);
      let speed = 0;
      for(let s of speeds) speed += s;
      speed /= speeds.length;
      this.emit("speed", speed);
      let time = (size-downloaded)/(speed);
      this.emit("estimated", time);
      start = new Date().getTime();
      before = downloaded;
    }, 1000);

    res.body.on('end', () => {
      clearInterval(interval);
      this.emit("finish", data);
    });
  }

  multiple(files, totalsize, limit = 1){
    this.emit("progress", 0, totalsize);

    let complete = 0;
    let queued = 0;
    let i = 0;

    let start = new Date().getTime();
    let before = 0;
    let downloaded = 0;

    let speeds = [];

    let interval = setInterval(() => {
      let duration = (new Date().getTime() - start) / 1000;
      let loaded = (downloaded - before) * 8;
      if(speeds.length >= 5) speeds = speeds.slice(1);
      speeds.push((loaded / duration) / 8);
      let speed = 0;
      for(let s of speeds) speed += s;
      speed /= speeds.length;
      this.emit("speed", speed);
      let time = (totalsize-downloaded)/(speed);
      this.emit("estimated", time);
      start = new Date().getTime();
      before = downloaded;
    }, 1000);

    let progressInterval = setInterval(() => {
      this.emit("progress", downloaded, totalsize);
    }, 100);

    queue();

    let finish = this.finish;

    function queue(){
      if(complete == files.length){
        clearInterval(interval);
        clearInterval(progressInterval);
        if(finish) finish();
        return;
      }

      while (queued < limit) {
        if (i == files.length) break;
        download();
      }
    }

    async function download(){
      let file = files[i++];
      queued++;

      if(!fs.existsSync(file.folder)) fs.mkdirSync(file.folder, { recursive: true, mode: 0o777 });
      let flag = fs.openSync(file.path, "w", 0o755);
      let position = 0;

      console.log(`Downloading ${file.url} at ${file.path}`);

      let res = await fetch(file.url);
      res.body.on('data', (chunk) => {
        downloaded += chunk.length;
        position += chunk.length;
        fs.writeSync(flag, chunk, 0, chunk.length, position-chunk.length, (e) => {if(e) throw e});
      });

      res.body.on('end', () => {
        fs.closeSync(flag);
        complete += 1
        queued -= 1
        queue();
      });
    }
  }

  on(event, func){
    this[event] = func;
  }

  emit(event, ...args){
    if(this[event]) this[event](...args);
  }
}

export default Downloader;
