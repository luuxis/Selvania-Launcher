'use strict';

import AccDatabase from '../lib/AccDatabase.js';

const fs = require("fs");
const convert = require("xml-js");
const net = require('net');

class Home {
  static id = "home";

  async init(popup){
    this.accounts = await new AccDatabase().init();
    this.popup = popup;
    this.initStatus();
  }


  initStatus(){
    console.log("[Home] Initializing Server Status...");
    this.setStatus();
    setInterval(this.setStatus, 60000)
  }

  async setStatus(){
    let player = document.querySelector(".etat-text .text");
    let desc = document.querySelector(".server-text .desc");
    let online = document.querySelector(".etat-text .online");

    let server = await testServer("minecraft.hariona.fr");

    if(server.error){
      server = await testServer("minecraft.hariona.fr");
      if(server.error){
        server = await testServer("minecraft.hariona.fr");
        if(server.error){
          desc.innerHTML = `<span class="red">Fermé</span> - 0ms`;
          if(!online.classList.contains("off")) online.classList.toggle("off");
          return player.textContent = 0;
        }
      }
    }

    desc.innerHTML = `<span class="green">Opérationnel</span> - ${server.ms}ms`;
    if(online.classList.contains("off")) online.classList.toggle("off");
    player.textContent = server.players;

    async function testServer(ip){
      return new Promise((resolve) => {
        let start = new Date();
        let client = net.connect(25565, ip, () => {
          client.write(Buffer.from([ 0xFE, 0x01 ]));
        });
    
        client.setTimeout(5 * 1000);
    
        client.on('data', (data) => {
          if (data != null && data != '') {
            var infos = data.toString().split("\x00\x00\x00");
            resolve({error: false, ms: Math.round(new Date() - start), players: infos[4].replace(/\u0000/g, '')});
          }
          client.end();
        });
    
        client.on('timeout', () => {
          resolve({error: true});
          client.end();
        });
    
        client.on('err', (err) => {
          resolve({error: true});
          console.error(err);
        });
      });
    }
  }
}

export default Home;
