const _registry = {};

const publish = (event, data) => {
	_registry[event]?.forEach(fn => fn(data));
}

const subscribe = (event, fn) => {
	if (!(event in _registry)) {
		_registry[event] = [];
	}

	_registry[event].push(fn);
}

const FIGHT_EVENTS = {
	FIGHT_WON: 'fightWon'
}