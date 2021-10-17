const os = require('os')

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

    let slider = new Sliderbar("memory-slider", parseFloat(localStorage.getItem("minram")), parseFloat(localStorage.getItem("maxram")));

    let minSpan = document.querySelector("#memory-slider .slider-touch-left span");
    let maxSpan = document.querySelector("#memory-slider .slider-touch-right span");

    minSpan.setAttribute("value", `${localStorage.getItem("minram")} Go`);
    maxSpan.setAttribute("value", `${localStorage.getItem("maxram")} Go`);

    slider.on("change", (min, max) => {
      console.log(min + "\n" + max)
    });

    document.getElementById("memory").classList.toggle("open");
  }




  function Sliderbar(id, minValue, maxValue){
    startX = 0;
    x = 0;
    
    slider = document.getElementById(id);
    touchLeft = slider.querySelector('.slider-touch-left');
    touchRight = slider.querySelector('.slider-touch-right');
    lineSpan = slider.querySelector('.slider-line span');
    
    min = parseFloat(slider.getAttribute('min'));
    max = parseFloat(slider.getAttribute('max'));
    
    if(!minValue) minValue = min;
    if(!maxValue) maxValue = max;
    
    minValue = minValue;
    maxValue = maxValue;
    
    step = parseFloat(slider.getAttribute('step'));
    
    normalizeFact = 18;
    
    reset();
    
    maxX = slider.offsetWidth - touchRight.offsetWidth;
    selectedTouch = null;
    initialValue = lineSpan.offsetWidth - normalizeFact;
  
    setMinValue(minValue);
    setMaxValue(maxValue);
  
    touchLeft.addEventListener('mousedown', (event) => {onStart(event.path[1], event)});
    touchRight.addEventListener('mousedown', (event) => {onStart(event.path[1], event)});
    touchLeft.addEventListener('touchstart', (event) => {onStart(event.path[1], event)});
    touchRight.addEventListener('touchstart', (event) => {onStart(event.path[1], event)});
    }
  
    function reset(){
      touchLeft.style.left = '0px';
      touchRight.style.left = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
      lineSpan.style.marginLeft = '0px';
      lineSpan.style.width = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
      startX = 0;
      x = 0;
    }
  
    function setMinValue(minValue){
      let ratio = (minValue - min) / (max - min);
      touchLeft.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact))) + 'px';
      lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
      lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
    }
  
    function setMaxValue(maxValue){
      var ratio = (maxValue - min) / (max - min);
      touchRight.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact)) + normalizeFact) + 'px';
      lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
      lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
    }
  
    function onStart(elem, event){
      event.preventDefault();
  
      if(elem === touchLeft)
        x = touchLeft.offsetLeft;
      else
        x = touchRight.offsetLeft;
  
      startX = event.pageX - x;
      selectedTouch = elem;
  
      let self = this;
      func1 = (event) => {onMove(event)};
      func2 = (event) => {onStop(event)};
  
      document.addEventListener('mousemove', func1);
      document.addEventListener('mouseup', func2);
      document.addEventListener('touchmove', func1);
      document.addEventListener('touchend', func2);
    }
  
    function onMove(event){
      x = event.pageX - startX;
  
      if(selectedTouch === touchLeft){
        if(x > touchRight.offsetLeft - selectedTouch.offsetWidth - 24)
          x = touchRight.offsetLeft - selectedTouch.offsetWidth - 24;
        else if(x < 0)
          x = 0;
  
        selectedTouch.style.left = x + 'px';
      } else if(selectedTouch === touchRight){
        if(x < touchLeft.offsetLeft + touchLeft.offsetWidth + 24){
          x = touchLeft.offsetLeft + touchLeft.offsetWidth + 24;
        } else if(x > maxX)
          x = maxX;
  
        selectedTouch.style.left = x + 'px';
      }
  
      lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
      lineSpan.style.width = touchRight.offsetLeft - touchLeft.offsetLeft + 'px';
  
      calculateValue();
    }
  
    function onStop(self, event){
      document.removeEventListener('mousemove', func1);
      document.removeEventListener('mouseup', func2);
      document.removeEventListener('touchmove', func1);
      document.removeEventListener('touchend', func2);
  
      selectedTouch = null;
  
      calculateValue();
    }
  
    function calculateValue(){
      let newValue = (lineSpan.offsetWidth - normalizeFact) / initialValue;
      let minValue = lineSpan.offsetLeft / initialValue;
      let maxValue = minValue + newValue;
  
      minValue = minValue * (max - min) + min;
      maxValue = maxValue * (max - min) + min;
  
      if(step != 0.0){
        let multi = Math.floor(minValue / step);
        minValue = step * multi;
  
        multi = Math.floor(maxValue / step);
        maxValue = step * multi;
      }
  
      emit('change', minValue, maxValue);
    }
  
    func = [];
  
    function on(name, func){
      func[name] = func;
    }
  
    function emit(name, ...args){
      if(func[name]) func[name](...args);
    }
  