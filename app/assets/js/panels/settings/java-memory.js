const os = require("os")

const totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
const freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;


document.querySelector(".range-RamMin").addEventListener("mousemove",() => {
    let RamMin = document.querySelector(".range-RamMin")
    RamMin.max = document.querySelector(".range-RamMax").value
    document.querySelector('.RamMin').innerHTML = RamMin.value;
})


document.querySelector(".range-RamMax").addEventListener("mousemove",() => {
    let RamMax = document.querySelector(".range-RamMax")
    RamMax.min = document.querySelector(".range-RamMin").value
    RamMax.max = (totalMem).toFixed(0)
    document.querySelector('.RamMax').innerHTML = RamMax.value;
})