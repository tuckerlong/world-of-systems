const ACCESSOR = 'storyline';
const mapData = {
	OLD_ROAD: {
		name: 'Old Road'
	}
}
const map = 'Old road';
let currentMap = mapData.OLD_ROAD.name;

const updateStorylineDisplay = () => {
	if (data[ACCESSOR].completed.indexOf(currentMap) !== -1) {
		getElement('storyline-kills-left').innerText = 10;
		getElement('storyline-boss-killed-false').hidden = true;
		getElement('storyline-boss-killed-true').hidden = false;
	} else {
		getElement('storyline-kills-left').innerText = data[ACCESSOR].progress[currentMap].killed;
		getElement('storyline-boss-killed-false').hidden = false;
		getElement('storyline-boss-killed-true').hidden = true;
	}
}

// Init
(() => {
	if (!(ACCESSOR in data)) data[ACCESSOR] = { completed: [], progress: {}, currentMap: mapData.OLD_ROAD.name };

	currentMap = data[ACCESSOR].currentMap;

	updateStorylineDisplay();
})();

subscribe(FIGHT_EVENTS.FIGHT_WON, () => {
	if (data[ACCESSOR].completed.indexOf(currentMap) !== -1) {
		return;
	}

	if (!(currentMap in data[ACCESSOR].progress)) {
		data[ACCESSOR].progress[currentMap] = { killed: 0, boss: false };
	}

	data[ACCESSOR].progress[currentMap].killed += 1;

	if (data[ACCESSOR].progress[currentMap].killed >= 10) {
		data[ACCESSOR].completed.push(currentMap);
		delete data[ACCESSOR].progress[currentMap];
	}
	
	updateStorylineDisplay();
});

