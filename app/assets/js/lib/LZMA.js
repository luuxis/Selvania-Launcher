'use strict';

class LZMA {
  static AS_ARRAY_OFFSET = 24;

  static async decompress(buffer){
    if(Buffer.isBuffer(buffer)) buffer = new Uint8Array(buffer);
    let memory = new WebAssembly.Memory({ initial: 160 });
    let module = await WebAssembly.instantiateStreaming(fetch(`assets/js/lib/wasm/lzma.wasm`), {
      env: {
        memory,
        abort: (filename, line, column) => {
          throw Error(`abort called at ${filename ? filename + ':' : ''}${line}:${column}`);
        }
      },
      Math
    });
    let lzma = module.instance.exports;

    let inputData = lzma.newU8Array(buffer.length);

    let u8Array = new Uint8Array(memory.buffer, inputData + LZMA.AS_ARRAY_OFFSET, buffer.length);
    u8Array.set(buffer);

    let resultPtr = lzma.decode(inputData);
    let result = new Uint32Array(memory.buffer, resultPtr, 4);

    let [success, error, unpackSize, dataPtr] = result;

    if(success){
      let data = new Uint8Array(memory.buffer, dataPtr + LZMA.AS_ARRAY_OFFSET, unpackSize);
      return Buffer.from(data);
    } else return false
  }
}

export default LZMA
