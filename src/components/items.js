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
		let item = data[ITEM_ACCESSOR][tab][page * 10 + i];
		item = {...item, ...ITEM_DATA[item.id]};

		ele.src = `src/img/${item.img}`;
		ele.onmouseover = (event) => itemTooltipDisplay(event, data[ITEM_ACCESSOR][tab][idx], false);
		ele.onmouseout = () => itemTooltipClose();
		ele.oncontextmenu = () => itemEquip(idx);
	}

	const typeToList = {
		[ITEM_TYPE.WEAPON]: 'weapons',
		[ITEM_TYPE.ARMOR]: 'armors'
	};

	Object.values(ITEM_TYPE).forEach(type => {
		const slot = getElement(`inventory-${type}`);
		let item = data[ITEM_ACCESSOR].equipped[type];

		if (!!item) {
			item = {...item, ...ITEM_DATA[item.id]};

			slot.src = `src/img/${item.img}`;
			slot.onmouseover = (event) => itemTooltipDisplay(event, data[ITEM_ACCESSOR].equipped[type], true);
			slot.onmouseout = () => itemTooltipClose();
			slot.oncontextmenu = () => itemUnequip(type, typeToList[type]);
		} else {
			slot.src = 'src/img/blank.png';
			slot.onmouseover = () => {};
			slot.onmouseout = () => {};
			slot.oncontextmenu = () => {};
		}
	});
}

function itemTooltipDisplay(event, itemData, equipped) {
	if (!itemData) {
		return;
	}

	getElement('item-tooltip-weapon').hidden = true;
	getElement('item-tooltip-armor').hidden = true;

	if (equipped) {
		getElement('item-tooltip-equip').hidden = true;
		getElement('item-tooltip-unequip').hidden = false;
	} else {
		getElement('item-tooltip-equip').hidden = false;
		getElement('item-tooltip-unequip').hidden = true;
	}

	// This will populate the item with static data
	let item = { ...itemData, ...ITEM_DATA[itemData.id] };

	console.log('Item', item)

	if (item.type === ITEM_TYPE.WEAPON) {
		getElement('item-tooltip-weapon').hidden = false;
		getElement('item-tooltip-weapon').innerText = `Attack: ${item.min_attack} - ${item.max_attack}`;
	}

	if (item.type === ITEM_TYPE.ARMOR) {
		getElement('item-tooltip-armor').hidden = false;
		getElement('item-tooltip-armor').innerText = `Defense: ${item.def}`;
	}

	getElement('item-tooltip-name').innerText = item.name;

	const r = event.target.getBoundingClientRect();
	const ele = getElement('item-tooltip');

	ele.style.top = `${r.top - 5}px`;
	ele.style.left = `${r.left + r.width/2}px`;
	ele.style.transform = 'translateY(-100%) translateX(-50%)';
	ele.hidden = false;
}

function itemTooltipClose() {
	getElement('item-tooltip').hidden = true;
}

function itemEquip(idx) {
	if (!data[ITEM_ACCESSOR][tab][idx]) {
		return;
	}

	let item = data[ITEM_ACCESSOR][tab][idx];

	// This will populate the item with static data
	item = { ...item, ...ITEM_DATA[item.id] };

	const holder = data[ITEM_ACCESSOR].equipped[item.type];

	data[ITEM_ACCESSOR].equipped[item.type] = data[ITEM_ACCESSOR][tab][idx];
	data[ITEM_ACCESSOR][tab][idx] = holder;

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

	if (!!data[ITEM_ACCESSOR].equipped.armor) {
		let armor = data[ITEM_ACCESSOR].equipped.armor;
		armor = {...armor, ...ITEM_DATA[armor.id]};

		player.def = armor.def;
	}

	
	update();
}