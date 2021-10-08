const os = require("os")

const totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
const freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;

