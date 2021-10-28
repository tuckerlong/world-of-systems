let finished = false;

const FIGHT_EVENTS = {
	FIGHT_WON: 'fightWon'
}

const player = {
	hp: 10,
	maxHp: 10,
	def: 0,
	attack: {
		min: 1,
		max: 1
	},
	speed: 0.2,
	level: 1,
	exp: 0
};

let enemy = {
	hp: 10,
	def: 0,
	attack: {
		min: 1,
		max: 2
	},
	speed: 2.0
}

let monsterLevel = 1;

// init
document.addEventListener('DOMContentLoaded', (e) => {
	newEnemy();
});

function newEnemy() {
	enemy = generateEnemy(monsterLevel);
	update();
}

function calculateDamage(source, target) {
	let val = Math.floor(Math.random() * source.attack.max +  source.attack.min);
	
	val = Math.max(val - target.def, 0);

	return val;
}

function fight() {
	getElement('fight-button').setAttribute('disabled', '');
	getElement('rest-button').setAttribute('disabled', '')
	
	const bar = getElement('player-attack-bar');
	const ebar = getElement('enemy-attack-bar');

	finished = false;
	
	const playerAttack = () => loop(bar, 0, (player.speed * 1000)/100, () => {
		enemy.hp = Math.max(enemy.hp - calculateDamage(player, enemy), 0);
		update();

		if (enemy.hp <= 0) {
			player.exp += 1;
			getElement('player-info-exp').innerText = player.exp;
			publish(FIGHT_EVENTS.FIGHT_WON);
			return fightFinished();
		}

		playerAttack();
	});

	const enemyAttack = () => loop(ebar, 0, (enemy.speed * 1000)/100, () => {
		player.hp = Math.max(player.hp - calculateDamage(enemy, player), 0);
		update();

		if (player.hp <= 0) {
			return fightFinished();
		}

		enemyAttack();
	});

	update();

	playerAttack();
	enemyAttack();
}

function loop(bar, progress, interval, onFinish) {
	if (finished) {
		return;
	}

	bar.style=`width: ${progress}%`;
	bar.setAttribute('aria-valuenow', progress + '');

	if (progress + 1 > 100) {
		return onFinish();
	}

	setTimeout(() => loop(bar, progress + 1, interval, onFinish), interval);
}

function fightFinished() {
	finished = true;

	if (player.hp < player.maxHp) {		
		getElement('rest-button').removeAttribute('disabled');
	}

	if (player.hp <= 0) {
		getElement('fight-button').hidden = true;
		getElement('rest-button').hidden = true;
		getElement('respawn-button').hidden = false;
		getElement('respawn').hidden = false;
	} else {
		getElement('fight-button').removeAttribute('disabled');
	}

	getElement('enemy-attack-bar').style=`width: 0`;
	getElement('enemy-attack-bar').setAttribute('aria-valuenow', '0');
	
	getElement('player-attack-bar').style=`width: 0`;
	getElement('player-attack-bar').setAttribute('aria-valuenow', '0');
	
	enemy = generateEnemy(monsterLevel);
	update();
}

function update() {
	getElement('enemy-hp').innerText = enemy.hp;
	getElement('player-hp').innerText = player.hp;

	getElement('player-dps').innerText = ((player.attack.max + player.attack.min)/2 / player.speed).toFixed(2);
	getElement('enemy-dps').innerText = ((enemy.attack.max + enemy.attack.min)/2 / enemy.speed).toFixed(2);

	getElement('player-speed').innerText = (1/player.speed).toFixed(2);
	getElement('enemy-speed').innerText = (1/enemy.speed).toFixed(2);

	getElement('player-def').innerText = player.def;
	getElement('enemy-def').innerText = enemy.def;

	getElement('player-atk').innerText = `${player.attack.min} - ${player.attack.max}`;
	getElement('enemy-atk').innerText = `${enemy.attack.min} - ${enemy.attack.max}`;
}

function generateEnemy(level) {
	return {
		hp: 10 + Math.round(Math.pow(level, 1.5)),
		def: 0,
		attack: {
			min: Math.round(Math.pow(level, 1.3)),
			max: Math.round(Math.pow(level, 1.3)) + Math.round(Math.pow(level, 1.5))
		},
		speed: 1.0
	}
}

function respawn() {
	finished = false;
	loop(getElement('respawn-bar'), 0, 2000/100, () => {
		finished = true;
		player.hp = player.maxHp;

		update();
		
		getElement('respawn-bar').setAttribute('aria-valuenow', '0');
		getElement('respawn-bar').style = 'width: 0%';
		getElement('fight-button').hidden = false;
		getElement('rest-button').hidden = false;
		getElement('respawn-button').hidden = true;
		getElement('respawn').hidden = true;
		getElement('fight-button').removeAttribute('disabled');
		getElement('rest-button').setAttribute('disabled', '');
	});
}

function rest() {
	finished = false;

	getElement('respawn').hidden = false;

	loop(getElement('respawn-bar'), 0, 2000/100, () => {
		finished = true;
		player.hp = player.maxHp;

		update();

		getElement('respawn').hidden = true;
		getElement('respawn-bar').setAttribute('aria-valuenow', '0');
		getElement('respawn-bar').style = 'width: 0%';
		getElement('fight-button').hidden = false;
		getElement('fight-button').removeAttribute('disabled');
		getElement('rest-button').setAttribute('disabled', '');
	});
}