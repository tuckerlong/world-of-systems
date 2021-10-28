const unlockList = [];

let data = {};


const save = () => {
	toast("Saving...");
	localStorage.setItem("data", JSON.stringify(data));
}

const load = () => {
	data = JSON.parse(localStorage.getItem("data"));
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

function range(min, max) {
	return generateRange(min, max);
}

function random() {
	return Math.random();
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