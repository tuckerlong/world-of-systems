let finished = false;

const player = {
	hp: 10,
	maxHp: 10,
	attack: 10,
	speed: 0.2,
	exp: 0
};

let enemy = {
	hp: 10,
	attack: 2,
	speed: 2.0
}

const fight = () => {
	document.getElementById("fight-button").setAttribute("disabled", "");
	
	const bar = document.getElementById("player-attack-bar");
	const ebar = document.getElementById("enemy-attack-bar");

	finished = false;

	enemy = generateEnemy();

	
	const playerAttack = () => loop(bar, 0, (player.speed * 1000)/100, () => {
		enemy.hp = Math.max(enemy.hp - player.attack, 0);
		update();

		if (enemy.hp <= 0) {
			player.exp += 1;
			document.getElementById("player-info-exp").innerText = player.exp;
			publish(FIGHT_EVENTS.FIGHT_WON);
			return fightFinished();
		}

		playerAttack();
	});

	const enemyAttack = () => loop(ebar, 0, (enemy.speed * 1000)/100, () => {
		player.hp = Math.max(player.hp - enemy.attack, 0);
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

const loop = (bar, progress, interval, onFinish) => {
	if (finished) {
		return;
	}

	bar.style=`width: ${progress}%`;
	bar.setAttribute("aria-valuenow", progress + "");

	if (progress + 1 > 100) {
		return onFinish();
	}

	setTimeout(() => loop(bar, progress + 1, interval, onFinish), interval);
}

const fightFinished = () => {
	finished = true;

	if (player.hp <= 0) {
		document.getElementById("fight-button").hidden = true;
		document.getElementById("respawn-button").hidden = false;
		document.getElementById("respawn").hidden = false;
	} else {
		document.getElementById("fight-button").removeAttribute("disabled");
	}
}

const update = () => {
	document.getElementById("enemy-hp").innerText = enemy.hp;


	document.getElementById("player-hp").innerText = player.hp;
}

const generateEnemy = () => {
	return {
		hp: 10,
		attack: 1,
		speed: 2.0
	}
}

const respawn = () => {
	finished = false;
	loop(document.getElementById("respawn-bar"), 0, 2000/100, () => {
		finished = true;
		player.hp = player.maxHp;

		update();
		
		document.getElementById("respawn-bar").setAttribute("aria-valuenow", "0");
		document.getElementById("respawn-bar").style = "width: 0%";
		document.getElementById("fight-button").hidden = false;
		document.getElementById("respawn-button").hidden = true;
		document.getElementById("respawn").hidden = true;
		document.getElementById("fight-button").removeAttribute("disabled");
	})
}