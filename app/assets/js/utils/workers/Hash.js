'use strict';

const MAX_HEAP = 16 * 1024;

class Hash {
  constructor(){
    this.init();
  }

  async init(){
    this.CRC32 = await this.initInstance("crc32", 4);
    this.SHA1 = await this.initInstance("sha1", 20);
  }

  calculate(wasm, data){
    wasm.exports.Hash_Init(null);

    let read = 0;
    while (read < data.length) {
      const chunk = data.subarray(read, read + MAX_HEAP);
      read += chunk.length;
      wasm.memory.set(chunk);
      wasm.exports.Hash_Update(chunk.length);
    }

    wasm.exports.Hash_Final(null);

    let digest = this.digest(wasm);

    return digest;
  }

  digest(wasm){
    const digestChars = new Uint8Array(wasm.hlength * 2);

    let p = 0;

    const alpha = 'a'.charCodeAt(0) - 10;
    const digit = '0'.charCodeAt(0);
    for(let i = 0; i < wasm.hlength; i++){
      let nibble = wasm.memory[i] >>> 4;
      digestChars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
      nibble = wasm.memory[i] & 0xF;
      digestChars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
    }

    return String.fromCharCode.apply(null, digestChars);
  }

  async initInstance(hash, hlength){
    let wasm = (await WebAssembly.instantiateStreaming(fetch(`../wasm/${hash}.wasm`), {})).instance;

    let arrayOffset = wasm.exports.Hash_GetBuffer();
    let memoryBuffer = wasm.exports.memory.buffer;
    wasm.memory = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
    wasm.hlength = hlength;

    return wasm
  }
}

let hash = new Hash();

self.addEventListener('message', (e) => {
  let digest = hash.calculate(hash[e.data.hash], e.data.data);
  self.postMessage(digest);
}, false);
