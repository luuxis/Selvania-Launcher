
class slider {
    container = null;
    elem = {};
    size = {};

    moving = false;
  
    range = { max: 0, min: 100 };
    selection = {
        left: 0, right: 0,
        outStart: 0, outEnd: 0
    };
    roundHalf(num) {
      return Math.round(num*2)/2;
    }
    static create(query) {
        const matches = document.querySelectorAll(query);
        const out = [];
        for (const elem of matches) {
            out.push(new slider(elem));
        }
        return out;
    }
    constructor(container) {
        this.range.min = parseInt(container.dataset.min);
        this.range.max = parseInt(container.dataset.max);
        if (!(this.range.min && this.range.max) || this.range.min > this.range.max) {
            throw "Paramètres data-min et data-max manquants ou invalides (doivent être des nombres où min < max)";
        }
        this.container = container;
        this.elem.selected = document.createElement("div");
        this.elem.start = document.createElement("button");
        this.elem.end = document.createElement("button");
        for (let childClass in this.elem) {
            this.elem[childClass].classList.add(childClass);
            container.append(this.elem[childClass]);
        }
        const me = this;
        const ondrag = this.startDrag.bind(this);
        const onmove = function (e) {
            window.requestAnimationFrame(function () {
                me.moveDrag.bind(me)(e);
            });
        };
        const onleave = this.stopDrag.bind(this);
        this.elem.start.addEventListener("mousedown", ondrag); 
        this.elem.end.addEventListener("mousedown",   ondrag);
        this.container.addEventListener("mousemove", onmove);
        this.container.addEventListener("mouseup",    onleave);
        this.container.addEventListener("mouseleave", onleave);
        this.container.addEventListener("touchmove", onmove);
        window.addEventListener("resize", function () {
            window.requestAnimationFrame(me.onresize.bind(me));
        });
        this.onresize();
    }
    val() {
        return {
            from: this.MbToRoundedGb(this.selection.outStart).MB,
            to: this.MbToRoundedGb(this.selection.outEnd).MB
        };
    }
    onresize() {
        if (!(this.elem.start instanceof Element)) return;
        let bounds = this.container.getBoundingClientRect();
        this.size = {
            width: bounds.width,
            xpos: bounds.left,
            xend: bounds.right,
            ypos: bounds.top,
            btnWidth: this.elem.end.getBoundingClientRect().width
        };
        this.updatePositions();
    }
    startDrag(e) {
        this.moving = e.target.classList.contains("start") ? "start" : "end";
        this.elem[this.moving].classList.add("moving");
    }
    stopDrag(e) {
        if (!this.moving) {
            return;
        }
        this.elem[this.moving].classList.remove("moving");
        this.moving = false;
    }
    moveDrag(e) {
        if (!this.moving) return;
        const curr = this.moving === "start" ? "left" : "right";
        const pos = (curr === "left") ? (e.clientX - this.size.xpos) : (this.size.xend - e.clientX);
        this.selection[curr] = Math.min(
            pos - (this.size.btnWidth * 0.5),
            this.size.width - this.selection[this.moving === "start" ? "right" : "left"] - (this.size.btnWidth * 2.2)
        );
        if (this.selection[curr] < 0) this.selection[curr] = 0;
        return this.updatePositions();
    }
    updatePositions() {
        this.selection.outStart = ((this.range.max - this.range.min) * this.selection.left / this.size.width) + this.range.min;
        this.selection.outEnd = ((this.range.max - this.range.min) * (this.size.width - this.selection.right) / this.size.width) + this.range.min;

        this.elem.start.style.left = `${this.selection.left}px`;
        this.elem.end.style.right = `${this.selection.right}px`;
        this.elem.selected.style.left = `${this.selection.left + 3}px`;
        this.elem.selected.style.width = `${this.size.width - this.selection.right - this.selection.left - 6}px`;
      
        
        this.elem.start.dataset.val = this.MbToRoundedGb(this.selection.outStart).GB;
        this.elem.end.dataset.val = this.MbToRoundedGb(this.selection.outEnd).GB;
    }
  
    MbToRoundedGb(floatMB) {
      const intGB = Math.floor(floatMB/256) * 0.25;
      const intMB = intGB * 1024;
      return {
        MB: intMB,
        GB: `${intGB.toFixed(2)} G`
      }
    }
}

const sliderElem = document.getElementById("slider");


sliderElem.dataset.min = "512";
sliderElem.dataset.max = "5192";
const instance = new slider(sliderElem);
