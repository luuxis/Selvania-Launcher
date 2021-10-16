const os = require('os')
//const Slider = require("./test.js")


async function initMemory(){
    await new Promise(function(resolve, reject) {
      let interval;
      interval = setInterval(() => {
        let slider = document.getElementById("memory-slider");
        if(slider.offsetWidth < 1130) resolve(clearInterval(interval));
      }, 100);
    });

    if(localStorage.getItem("minram") == null) localStorage.setItem("minram", 0.5);
    if(localStorage.getItem("maxram") == null) localStorage.setItem("maxram", 2);

    let totalMem = Math.trunc(os.totalmem() / 1073741824 * 10) / 10;
    let freeMem = Math.trunc(os.freemem() / 1073741824 * 10) / 10;
    if(process.platform == "darwin"){
      let freemem = () => {
        try {
          let out = execSync("vm_stat | awk '/free/ {gsub(/\\./, \"\", $3); print $3}'").toString().split("\n");
          if(out[0] == void 0 || out[0] === "" || (out = parseInt(out[0])) == NaN) return os.freemem();
          out *= 4096;
          return out;
        } catch(e) {
          return os.freemem();
        }
      }
      freeMem = Math.trunc(freemem() / 1073741824 * 10) / 10;
    } else if(process.platform == "linux"){
      totalMem = Math.trunc(os.totalmem() / 1000000000 * 10) / 10;
      freeMem = Math.trunc(os.freemem() / 1000000000 * 10) / 10;
    }

    document.getElementById("total-ram").textContent = `${totalMem} Go`;
    document.getElementById("free-ram").textContent = `${freeMem} Go`;

    if(freeMem >= Math.trunc(freeMem) + 0.5) freeMem = Math.trunc(freeMem) + 0.5;
    else if(freeMem >= Math.trunc(freeMem)) freeMem = Math.trunc(freeMem);

    if(totalMem >= Math.trunc(totalMem) + 0.5) totalMem = Math.trunc(totalMem) + 0.5;
    else if(totalMem >= Math.trunc(totalMem)) totalMem = Math.trunc(totalMem);

    if(totalMem > 8) totalMem = 8;

    if(parseFloat(localStorage.getItem("maxram")) > totalMem) if(totalMem - 0.5 > 0) localStorage.setItem("maxram", totalMem - 0.5);


    let sliderDiv = document.getElementById("memory-slider");
    sliderDiv.setAttribute("max", totalMem);

    let slider = new Slider("memory-slider", parseFloat(localStorage.getItem("minram")), parseFloat(localStorage.getItem("maxram")));

    let minSpan = document.querySelector("#memory-slider .slider-touch-left span");
    let maxSpan = document.querySelector("#memory-slider .slider-touch-right span");

    minSpan.setAttribute("value", `${localStorage.getItem("minram")} Go`);
    maxSpan.setAttribute("value", `${localStorage.getItem("maxram")} Go`);

    slider.on("change", (min, max) => {
      minSpan.setAttribute("value", `${min} Go`);
      maxSpan.setAttribute("value", `${max} Go`);
      localStorage.setItem("minram", min);
      localStorage.setItem("maxram", max);
    });

    document.getElementById("memory").classList.toggle("open");
  }

  //initMemory()