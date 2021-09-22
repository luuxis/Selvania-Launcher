const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const os = require("os")
const { config } = require('./assets/js/utils.js');

const totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
const freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;
