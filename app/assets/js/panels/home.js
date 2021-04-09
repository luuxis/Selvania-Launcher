'use strict';
const fs = require("fs");
const convert = require("xml-js");
const net = require('net');
const pkg = require("../package.json");
class Home {
  static id = "home";

  async init(popup){
    this.popup = popup;
    //this.setStatus();


  }
  
  
  async setStatus(){
    let player = document.querySelector(".etat-text .text");
    let desc = document.querySelector(".server-text .desc");
    let online = document.querySelector(".etat-text .online");

    const res = await fetch(pkg.config).then(res => res.json());

    let server = await testServer(res.ip-server);

    if(server.error){
      server = await testServer(res.ip-server);
      if(server.error){
        server = await testServer(res.ip-server);
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
