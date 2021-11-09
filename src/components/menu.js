function collapseMenu() {
	getElement('menu').classList.toggle('collapsed');
}

function collapseMenuRight() {
	const active = document.querySelector("#menu-right div button.active").id;
	console.log(active);
	const isActive = getElement('menu-right').className.includes(`collapsed-${active}`);

	getElement('menu-right').className = 'd-flex align-items-start';
	
	if (isActive ) {
		getElement('menu-right').classList.remove(`collapsed-${active}`);
	} else {
		getElement('menu-right').classList.add(`collapsed-${active}`);
	}
}

function openMenuRight() {
	getElement('menu-right').className = 'd-flex align-items-start';
}