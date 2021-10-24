const ACCESSOR = 'storyline';
const MAPS = {
	OLD_ROAD: 'Old Road',
	TOWN_OF_TOWN: 'Town of Town'
}
const mapData = {
	[MAPS.OLD_ROAD]: {
		next: MAPS.TOWN_OF_TOWN,
		monsterLevel: 1
	},
	[MAPS.TOWN_OF_TOWN]: {
		prev: MAPS.OLD_ROAD,
		monsterLevel: 2
	}
}
const map = 'Old road';
let currentMap = MAPS.OLD_ROAD;

const updateStorylineDisplay = () => {
	getElement('storyline-map-name').innerText = currentMap;

	if (!!mapData[currentMap].prev) {
		getElement('storyline-previous').removeAttribute('disabled');
	} else {
		getElement('storyline-previous').setAttribute('disabled', '');
	}

	if (data[ACCESSOR].completed.indexOf(currentMap) !== -1) {
		getElement('storyline-kills-left').innerText = 10;
		getElement('storyline-boss-killed-false').hidden = true;
		getElement('storyline-boss-killed-true').hidden = false;
		
		if (!!mapData[currentMap].next) {
			getElement('storyline-next').removeAttribute('disabled');
		}
	} else {
		getElement('storyline-kills-left').innerText = data[ACCESSOR].progress[currentMap].killed;
		getElement('storyline-boss-killed-false').hidden = false;
		getElement('storyline-boss-killed-true').hidden = true;
		getElement('storyline-next').setAttribute('disabled', '');
	}
}

// Init
document.addEventListener('DOMContentLoaded', (e) => { 
	if (!(ACCESSOR in data)) data[ACCESSOR] = { completed: [], progress: {}, currentMap: MAPS.OLD_ROAD };

	currentMap = data[ACCESSOR].currentMap;
	monsterLevel = mapData[currentMap].monsterLevel;

	newEnemy();
	updateStorylineDisplay();
});

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

const switchMap = (map) => {
	if (!(map in data[ACCESSOR].progress)) {
		data[ACCESSOR].progress[map] = { killed: 0, boss: false };
	}

	currentMap = map;
	data[ACCESSOR].currentMap = map;
	monsterLevel = mapData[map].monsterLevel;

	newEnemy();
	updateStorylineDisplay();
}

const storylinePrevious = () => {
	if (!!mapData[currentMap].prev) {
		switchMap(mapData[currentMap].prev);
	}
}

const storylineNext = () => {
	if (data[ACCESSOR].completed.indexOf(currentMap) === -1) {
		return;
	}
	
	if (!!mapData[currentMap].next) {
		switchMap(mapData[currentMap].next);
	}
}

