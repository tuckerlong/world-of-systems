const unlockList = [];

let data = {};


const save = () => {
	toast("Saving...");
	localStorage.setItem("data", JSON.stringify(data));
}

const load = () => {
	data = JSON.parse(localStorage.getItem("data")) || {};
}

load();
console.log(data);

setInterval(save, 1 * 60 * 1000); // save every minute


const toast = (message) => {
	const toast = document.createElement("div");
	toast.className = "toast align-items-center";
	toast.setAttribute("role", "alert");
	toast.setAttribute("aria-live", "assertive");
	toast.setAttribute("aria-atomic", "true");
	
	const toastBody = document.createElement("div");
	toastBody.className = "toast-body";
	toastBody.innerText = message;
	
	toast.appendChild(toastBody);
	
	document.getElementById("toast-container").appendChild(toast);
	
	(new bootstrap.Toast(toast)).show();

	toast.addEventListener('hidden.bs.toast', () => {
		toast.remove();
	});
}

const getElement = (id) => {
	return document.getElementById(id);
}

function generateRange(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

function choose(array) {
	return array[generateRange(0, array.length - 1)];
}

function range(min, max) {
	return generateRange(min, max);
}

function random() {
	return Math.random();
}

function wait(time, fn) {
	setTimeout(() => fn(), time);
}


const EVENTS = {
	SHIFT_PRESS: 'shift_pressed'
}
let coreIsShiftPressed = false;

function shiftPressed(e) {
	if (e.key !== 'Shift' || e.shiftKey === coreIsShiftPressed) {
		return;
	}

	coreIsShiftPressed = e.shiftKey;
	publish(EVENTS.SHIFT_PRESS, coreIsShiftPressed);
}

document.addEventListener('keydown', shiftPressed);
document.addEventListener('keyup', shiftPressed);




function roll() {
	const images = ['Boss Abomination Red.png', 'Forest Tree.png', 'Goblin Grunt.png', 'Boss Darkness Titan Ilnoct.png']
	getElement('monster-image').src = `src/img/monsters/${images[range(0, images.length - 1)]}`;
}


function loadSection(path, id, cb) {
	fetch(path)
		.then(res => res.text())
		.then(html => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html').querySelector('body').firstChild;
			getElement(id).appendChild(doc);
		}).then(_ => cb ? cb() : null);
}