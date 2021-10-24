/**
 * Look into src/data/items.js to find the actual item data
 */
const ITEM_ACCESSOR = 'items'
const ITEM_TABS = {
	WEAPONS: 'weapons'
}
let page = 0;
let tab = ITEM_TABS.WEAPONS;

// init
document.addEventListener('DOMContentLoaded', (e) => { 
	// delete data[ITEM_ACCESSOR];
	if (!(ITEM_ACCESSOR in data)) data[ITEM_ACCESSOR] = { 
		weapons: [],
		armors: [],
		equipped: { 
			weapon: null,
			armor: null
		} 
	};

	updateStats();
	updateItemDisplay();
});

subscribe(FIGHT_EVENTS.FIGHT_WON, () => {
	return;

	if (random() < 0.5) {
		// return;
	}

	const item = generateItem();
	const type = ITEM_DATA[item.id].type;
	console.log(item);

	if (type === ITEM_TYPE.WEAPON) {
		data[ITEM_ACCESSOR].weapons.push(item);
	}

	if (type === ITEM_TYPE.ARMOR) {
		data[ITEM_ACCESSOR].armors.push(item);
	}
	updateItemDisplay();
});

function inventoryChangeTab(t) {
	console.log('TAB', t)
	tab = t;
	updateItemDisplay();
}


function updateItemDisplay() {
	for (var i = 0; i < 10; i++) {
		const ele = getElement(`inventory-${i}`);

		if (!data[ITEM_ACCESSOR][tab][page * 10 + i]) {
			ele.src = 'src/img/blank.png';
			ele.onmouseover = () => {};
			ele.onmouseout = () => {};
			ele.oncontextmenu = () => {};
			continue;
		}

		const idx = page * 10 + i;

		ele.src = 'src/img/crossed-swords.svg';
		ele.onmouseover = (event) => itemTooltipDisplay(event, data[ITEM_ACCESSOR][tab][idx]);
		ele.onmouseout = () => itemTooltipClose();
		ele.oncontextmenu = () => itemEquip(idx);
	}

	const weapon = getElement('inventory-weapon');
	if (!!data[ITEM_ACCESSOR].equipped.weapon) {
		weapon.src = 'src/img/crossed-swords.svg';
		weapon.onmouseover = (event) => itemTooltipDisplay(event, data[ITEM_ACCESSOR].equipped.weapon);
		weapon.onmouseout = () => itemTooltipClose();
		weapon.oncontextmenu = () => itemUnequip('weapon', 'weapons');
	} else {
		weapon.src = 'src/img/blank.png';
		weapon.onmouseover = () => {};
		weapon.onmouseout = () => {};
		weapon.oncontextmenu = () => {};
	}
}

function itemTooltipDisplay(event, itemData) {
	if (!itemData) {
		return;
	}

	getElement('item-tooltip-weapon').hidden = true;

	// This will populate the item with static data
	let item = { ...itemData, ...ITEM_DATA[itemData.id] };

	console.log('Item', item)

	if (item.type === ITEM_TYPE.WEAPON) {
		getElement('item-tooltip-weapon').hidden = false;
		getElement('item-tooltip-weapon').innerText = `Attack: ${item.min_attack} - ${item.max_attack}`;
	}

	getElement('item-tooltip-name').innerText = item.name;

	const r = event.target.getBoundingClientRect();
	const ele = getElement('item-tooltip');
	ele.style.top = `${r.top - 5}px`;
	ele.style.left = `${r.left}px`;
	ele.style.transform = 'translateY(-100%) translateX(-50%)';
	ele.hidden = false;
}

function itemTooltipClose() {
	getElement('item-tooltip').hidden = true;
}

function itemEquip(idx) {
	console.log('eQuip', idx);

	if (!data[ITEM_ACCESSOR][tab][idx]) {
		return;
	}

	let item = data[ITEM_ACCESSOR][tab][idx];

	// This will populate the item with static data
	item = { ...item, ...ITEM_DATA[item.id] };

	if (item.type === ITEM_TYPE.WEAPON) {
		const holder = data[ITEM_ACCESSOR].equipped.weapon;
		data[ITEM_ACCESSOR].equipped.weapon = data[ITEM_ACCESSOR][tab][idx];
		data[ITEM_ACCESSOR][tab][idx] = holder;

		console.log(data);
	}

	updateStats();
	updateItemDisplay();
	itemTooltipClose();
}

function itemUnequip(slot, to) {
	const idx = data[ITEM_ACCESSOR][to].findIndex(item => item === null);
	
	if (idx === -1) {
		data[ITEM_ACCESSOR][to].push(data[ITEM_ACCESSOR].equipped[slot]);
	} else {
		data[ITEM_ACCESSOR][to][idx] = data[ITEM_ACCESSOR].equipped[slot];
	}
	
	data[ITEM_ACCESSOR].equipped[slot] = null;

	updateItemDisplay();
	itemTooltipClose();
}

function generateItem() {
	return generateArmor();
}

function generateArmor() {
	return {
		id: ITEM_MAP.CLOTH_ARMOR,
		prefix: [],
		suffix: []
	}
}

function generateWeapon() {
	return {
		id: ITEM_MAP.WOOD_SWORD,
		prefix: [],
		suffix: []
	}
}

function updateStats() {
	if (!!data[ITEM_ACCESSOR].equipped.weapon) {
		let weapon = data[ITEM_ACCESSOR].equipped.weapon;
		weapon = {...weapon, ...ITEM_DATA[weapon.id]};

		player.attack.min = weapon.min_attack;
		player.attack.max = weapon.max_attack;
	}

	
	update();
}