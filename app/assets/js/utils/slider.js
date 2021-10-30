/**
* Classe slider : permet de créer un slider à deux valeurs (utile pour créer des bornes)
* @author LoganTann, Luuxis
*/
module.exports = class Slider {
	/*
	### Variables ###
	*/

	// stockage du container et des elems enfants & tailles utiles
	container = null;
	elem = {};
	size = {};

	/**
	* indique si un slider est actuellement en mouvement.
	* Valeurs possibles : false | "start" | "end"
	*/
	moving = false;

	/** paramètres originaux passés en option */
	range = { max: 0, min: 100, defaultMin: 0, defaultMax: 100};

	/** variables d'état.
	* left/right = offset des curseurs en px
	* outStart/outEnd = valeur réelle des curseurs
	*/
	selection = { left: false, right: false, outStart: 0, outEnd: 0 };

	/*
	### Fonctions utilitaires ###
	*/

	/** Normalise une valeurs en MB */
	static MbToRoundedGb(floatMB) {
		const intGB = Math.floor(floatMB/256) * 0.25;
		const intMB= intGB * 1024;
		return {
			MB: intMB,
			GB: `${intGB.toFixed(2)} GB`
		}
	}

	/** convertis une valeur réelle en position des sliders (px) */
	initSelection() {
		const ratio = this.size.width / (this.range.max - this.range.min);
		this.selection.left = (this.range.defaultMin - this.range.min) * ratio;
		this.selection.right = (this.range.max - this.range.defaultMax) * ratio;
	}

	/*
	### Méthodes ###
	*/

	/**
	* Fabrique une instance d'un unique slider.
	* Usage : const instance = new slider(document.getElementById("identifiant"));
	* @param container : un Element HTML
	*/
	constructor(container, options) {
		// récupération des paramètres
		if (!(options.range[0] && options.range[1])) {
			throw "Slider: Paramètres d'option min et max sont obligatoires.";
		}
		options.value[0] = options.value[0] || options.range[0];
		options.value[1] = options.value[1] || options.range[1];
		if (options.range[0] > options.value[0] || options.value[0] > options.value[1] || options.value[1] > options.range[1]) {
			throw "Options invalides (doivent être des nombres où min < defaultMin < defaultMax < max), donné " + JSON.stringify(options);
		}
		this.range = {min: options.range[0], max: options.range[1], defaultMin: options.value[0], defaultMax: options.value[1]};
		let window = nw.Window.get().window;
		// stockage et génération des éléments html du slider
		this.container = container;
		this.elem.selected = document.createElement("div");
		this.elem.start = document.createElement("button");
		this.elem.end = document.createElement("button");
		for (let childClass in this.elem) {
			this.elem[childClass].classList.add(childClass);
			container.append(this.elem[childClass]);
		}

		// registration des évènements
		const me = this;
		const ondrag = this.startDrag.bind(this);
		const onleave = this.stopDrag.bind(this);
		const onmove = function (e) {
			window.requestAnimationFrame(function () {
				me.moveDrag.bind(me)(e);
			});
		};
		this.elem.start.addEventListener("mousedown", ondrag);
		this.elem.end.addEventListener("mousedown",   ondrag);
		this.container.addEventListener("mousemove", onmove);
		window.addEventListener("mouseup",    onleave);
		window.addEventListener("mouseleave", onleave);
		window.addEventListener("resize", function () {
			window.requestAnimationFrame(me.onresize.bind(me));
		});

		// mise à jour de l'affichage
		this.onresize();
	}

	/**
	* Récupère la valeur du slider
	* @return {from: number, to: number} avec .from = valeur début, .to = valeur fin
	*/
	val() {
		return [
			Slider.MbToRoundedGb(this.selection.outStart).MB,
			Slider.MbToRoundedGb(this.selection.outEnd).MB
		];
	}

	/**
	* Méthode appelée lorsque les positions du slider en mémoire doivent être appliquées sur l'écran
	*/
	updatePositions() {
		// un peu de magie avec les maths
		this.selection.outStart = ((this.range.max - this.range.min) * this.selection.left / this.size.width) + this.range.min;
		this.selection.outEnd = ((this.range.max - this.range.min) * (this.size.width - this.selection.right) / this.size.width) + this.range.min;

		// actualisation des attributs
		this.elem.start.style.left = `${this.selection.left}px`;
		this.elem.end.style.right = `${this.selection.right}px`;
		this.elem.selected.style.left = `${this.selection.left + 3}px`;
		this.elem.selected.style.width = `${this.size.width - this.selection.right - this.selection.left - 6}px`;

		this.elem.start.dataset.val = Slider.MbToRoundedGb(this.selection.outStart).GB;
		this.elem.end.dataset.val = Slider.MbToRoundedGb(this.selection.outEnd).GB;
	}

	// fonctions d'event -----------


	/**
	* appelé lorsque la fenêtre change de taille, mais peut aussi servir pour forcer la mise à jour du slider
	*/
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
		if (!(this.selection.left && this.selection.right)) this.initSelection();
		this.updatePositions();
	}

	/**
	* Méthode appelée lorsqu'un slider reçois le clic
	*/
	startDrag(e) {
		this.moving = e.target.classList.contains("start") ? "start" : "end";
		this.elem[this.moving].classList.add("moving");
	}
	/**
	* Méthode appelée lorsqu'un slider a vu son clic relaché, ou bien que le pointeur a quitté la zone du slider
	*/
	stopDrag(e) {
		if (!this.moving) {
			return;
		}
		this.elem[this.moving].classList.remove("moving");
		this.moving = false;
	}
	/**
	* Méthode appelée lorsque la souris bouge alors qu'un slider est en mouvement (ie. lorsque le slider est déplacé)
	*/
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
}