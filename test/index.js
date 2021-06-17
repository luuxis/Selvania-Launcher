const { encrypt, decrypt } = require('./crypto');
const fs =require("fs")

//const hash = encrypt('password');



const hash =require("./code.json")


const text = decrypt(hash.password);

console.log(text); 