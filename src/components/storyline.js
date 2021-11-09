const STORYLINE_EVENTS = {
	PROGRESS_START: 'progress_start',
	PROGRESS_UPDATE: 'progress_update'
}
const STORYLINE_ACCESSOR = 'storyline';
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

/** Init */
document.addEventListener('DOMContentLoaded', (e) => {
	delete data[STORYLINE_ACCESSOR];
	if (!(STORYLINE_ACCESSOR in data)) data[STORYLINE_ACCESSOR] = { completed: [], progress: {}, currentMap: MAPS.OLD_ROAD, position: 0 };

	currentMap = data[STORYLINE_ACCESSOR].currentMap;
	monsterLevel = mapData[currentMap].monsterLevel;	

	newEnemy();
	updateStorylineDisplay();
});

subscribe(STORYLINE_EVENTS.PROGRESS_START, progress => onProgressStart(progress));
subscribe(STORYLINE_EVENTS.PROGRESS_UPDATE, progress => onProgressUpdate(progress));
subscribe(FIGHT_EVENTS.FIGHT_WON, onFightWon);

/** Event Functions */
function onProgressStart(progress) {
	if (progress >= 1) {
		getElement('section-combat').hidden = false;
		getElement('section-combat').classList.add('fade-in');
		
		getElement('rest-button').hidden = false;
	}
}

function onProgressUpdate(progress) {
	if (progress === 0) {
		addLog('You awaken on the side of Harvoks Road.');

		wait(3000, () => {
			addLog('An ash covered figure stumbles towards you. It strikes out.');
			getElement('section-combat').hidden = false;
			getElement('section-combat').classList.add('fade-in');
		});
	}
}

function onFightWon() {
	if (data[STORYLINE_ACCESSOR].completed.indexOf(currentMap) !== -1) {
		return;
	}

	if (!(currentMap in data[STORYLINE_ACCESSOR].progress)) {
		data[STORYLINE_ACCESSOR].progress[currentMap] = { killed: 0, boss: false };
	}

	data[STORYLINE_ACCESSOR].progress[currentMap].killed += 1;

	if (data[STORYLINE_ACCESSOR].progress[currentMap].killed >= 10) {
		data[STORYLINE_ACCESSOR].completed.push(currentMap);
		delete data[STORYLINE_ACCESSOR].progress[currentMap];
	}

	if (data[STORYLINE_ACCESSOR].position === 0) {
		data[STORYLINE_ACCESSOR].position = 1;

		addLog('As you strike your foe down they disappear into a cloud of dust. More foes appear in the distance blocking the route into town. It would be best if you took a quick rest.');

		getElement('rest-button').hidden = false;
		getElement('rest-button').classList.add('fade-in');
		getElement('fight-button').setAttribute('disabled', '');
	}
	
	updateStorylineDisplay();
}


/** Buttons */
function storylinePrevious() {
	if (!!mapData[currentMap].prev) {
		switchMap(mapData[currentMap].prev);
	}
}

function storylineNext() {
	if (data[STORYLINE_ACCESSOR].completed.indexOf(currentMap) === -1) {
		return;
	}
	
	if (!!mapData[currentMap].next) {
		switchMap(mapData[currentMap].next);
	}
}

/** Helpers */
function switchMap(map) {
	if (!(map in data[STORYLINE_ACCESSOR].progress)) {
		data[STORYLINE_ACCESSOR].progress[map] = { killed: 0, boss: false };
	}

	currentMap = map;
	data[STORYLINE_ACCESSOR].currentMap = map;
	monsterLevel = mapData[map].monsterLevel;

	newEnemy();
	updateStorylineDisplay();
}

function updateStorylineDisplay() {
	getElement('storyline-map-name').innerText = currentMap;

	if (!!mapData[currentMap].prev) {
		getElement('storyline-previous').removeAttribute('disabled');
	} else {
		getElement('storyline-previous').setAttribute('disabled', '');
	}

	if (data[STORYLINE_ACCESSOR].completed.indexOf(currentMap) !== -1) {
		getElement('storyline-kills-left').innerText = 10;
		getElement('storyline-boss-killed-false').hidden = true;
		getElement('storyline-boss-killed-true').hidden = false;
		
		if (!!mapData[currentMap].next) {
			getElement('storyline-next').removeAttribute('disabled');
		}
	} else {
		getElement('storyline-kills-left').innerText = data[STORYLINE_ACCESSOR].progress[currentMap].killed;
		getElement('storyline-boss-killed-false').hidden = false;
		getElement('storyline-boss-killed-true').hidden = true;
		getElement('storyline-next').setAttribute('disabled', '');
	}
}
